riot.tag2('activity-master', '<div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Activities</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchActivity" class="form-control" placeholder="search" onkeyup="{filterCategories}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshActivities}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"><input type="text" name="addActivityInput" placeholder="Add new Activity" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{add}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th>Activity</th> <th class="two-buttons"></th> </tr> <tr each="{activity, i in filteredCategories}"> <td>{i+1}</td> <td> <virtual hide="{activity.confirmDelete || activity.confirmEdit}">{activity.activity}</virtual> <virtual if="{activity.confirmDelete}">Are you sure?</virtual> <virtual if="{activity.confirmEdit}"><input type="text" id="editedActivity" class="form-control" value="{activity.activity}" onkeyup="{editEnter.bind(this, activity.activity_id)}"></virtual> </td> <td> <div class="table-buttons" hide="{activity.confirmDelete ||  activity.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{activity.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{activity.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  RiotControl.trigger('login_init');
  RiotControl.trigger('read_activities');
});

// RiotControl.on('login_changed', function(login_status) {
//   if(!login_status.role || login_status.role == 'FAIL'){
//     riot.route("/home")
//   }
// })

self.refreshActivities = function () {
  self.activities = [];
  self.searchActivity.value;
  RiotControl.trigger('read_activities');
};

self.filterCategories = function () {
  if (!self.searchActivity) return;
  self.filteredCategories = self.activities.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchActivity.value.toLowerCase()) >= 0;
  });
};

self.confirmDelete = function (e) {
  self.activities.map(function (c) {
    if (c.activity_id != e.item.activity.activity_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.activities.map(function (c) {
    if (c.activity_id != e.item.activity.activity_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_activity', e.item.activity.activity_id);
};

self.edit = function (e) {
  console.log(self);
  if (!$("#editedActivity").val()) {
    toastr.info("Please enter a valid activity and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_activity', e.item.activity.activity_id, $("#editedActivity").val());
  }
};

self.add = function () {
  if (!self.addActivityInput.value) {
    toastr.info("Please enter a valid activity and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_activity', self.addActivityInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.add();
  }
};

self.editEnter = function (a, e) {
  if (e.which == 13) {
    if (!$("#editedActivity").val()) {
      toastr.info("Please enter a valid activity and try again");
    } else {
      self.loading = true;
      RiotControl.trigger('edit_activity', e.item.activity.activity_id, $("#editedActivity").val());
    }
  }
};

self.cancelOperation = function (e) {
  self.activities.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

RiotControl.on('activities_changed', function (activities) {
  self.addActivityInput.value = '';
  self.loading = false;
  self.activities = activities;
  self.filteredCategories = activities;
  self.update();
});
});

riot.tag2('chargehead-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Chargeheads</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchChargehead" class="form-control" placeholder="search" onkeyup="{filterChargeheads}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshChargeheads}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"><input type="text" name="addChargeheadCodeInput" placeholder="Code" class="form-control" onkeyup="{addEnter}"></td> <td><input type="text" name="addChargeheadInput" placeholder="Chargehead" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{add}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th onclick="{sortByCode}" style="cursor: pointer;"> Code <hand if="{activeSort==\'sortCode\'}"> <i class="material-icons" show="{sortCode}">arrow_upward</i> <i class="material-icons" hide="{sortCode}">arrow_downward</i> <hand> </th> <th onclick="{sortByChargeHead}" style="cursor: pointer;"> Chargehead <hand if="{activeSort==\'sortCHead\'}"> <i class="material-icons" show="{sortCHead}">arrow_upward</i> <i class="material-icons" hide="{sortCHead}">arrow_downward</i> </hand> </th> <th class="two-buttons"></th> </tr> <tr each="{ch, i in pageDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td if="{!ch.confirmEdit && !ch.confirmDelete}"> {ch.chargehead_code} </td> <td if="{!ch.confirmEdit && !ch.confirmDelete}"> {ch.chargehead} </td> <td colspan="2" if="{ch.confirmDelete}"><span class="delete-question">Are you sure?</span></td> <td if="{ch.confirmEdit}"> <input type="text" id="editedChargeheadCode" autofocus class="form-control" value="{ch.chargehead_code}" onkeyup="{editEnter.bind(this)}"> </td> <td if="{ch.confirmEdit}"> <input type="text" id="editedChargehead" class="form-control" value="{ch.chargehead}" onkeyup="{editEnter.bind(this)}"> </td> <td> <div class="table-buttons" hide="{ch.confirmDelete ||  ch.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{ch.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{ch.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot> <tr> <td colspan="4"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortCHead = true;
  self.sortCode = true;
  self.activeSort = '';
  self.update();
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_chargeheads');
});

// RiotControl.on('login_changed', function(login_status) {
//   if(!login_status.role || login_status.role == 'FAIL'){
//     riot.route("/home")
//   }
// })

self.refreshChargeheads = function () {
  self.chargeheads = [];
  self.searchChargehead.value;
  RiotControl.trigger('read_chargeheads');
};

self.filterChargeheads = function () {
  if (!self.searchChargehead) return;
  self.filteredChargeheads = self.chargeheads.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchChargehead.value.toLowerCase()) >= 0;
  });
  self.paginate(self.filteredChargeheads, self.items_per_page);
  self.pageDataItems = self.getPageData(self.filteredChargeheads, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.chargeheads.map(function (c) {
    if (c.chargehead_id != e.item.ch.chargehead_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.chargeheads.map(function (c) {
    if (c.chargehead_id != e.item.ch.chargehead_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_chargehead', e.item.ch.chargehead_id);
};

self.edit = function (e) {
  if (!$("#editedChargeheadCode").val()) {
    toastr.info("Please enter a valid chargehead Code and try again");
  } else if (!$("#editedChargehead").val()) {
    toastr.info("Please enter a valid chargehead and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_chargehead', e.item.ch.chargehead_id, $("#editedChargeheadCode").val(), $("#editedChargehead").val());
  }
};

self.add = function () {
  if (!self.addChargeheadCodeInput.value) {
    toastr.info("Please enter a valid chargehead Code and try again");
  } else if (!self.addChargeheadInput.value) {
    toastr.info("Please enter a valid chargehead and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_chargehead', self.addChargeheadCodeInput.value, self.addChargeheadInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.add();
  }
};

self.editEnter = function (e) {
  if (e.which == 13) {
    self.edit(e);
  }
};

self.cancelOperation = function (e) {
  self.chargeheads.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

RiotControl.on('chargeheads_changed', function (chargeheads) {
  self.addChargeheadCodeInput.value = '';
  self.addChargeheadInput.value = '';
  self.loading = false;
  self.chargeheads = chargeheads;
  self.filteredChargeheads = chargeheads;
  self.items_per_page = 10;

  self.callPaging();
  self.update();
});

self.callPaging = function () {
  self.paginate(self.filteredChargeheads, self.items_per_page);
  self.pageDataItems = self.getPageData(self.filteredChargeheads, 1, self.items_per_page);
};

/*sorting Starts*/
self.sortByChargeHead = function () {
  console.log('calling sortByChargeHead');

  if (self.sortCHead == true) {
    self.chargeheads.sort(function (a, b) {
      return a.chargehead.toUpperCase().localeCompare(b.chargehead.toUpperCase());
    });
  } else {
    self.chargeheads.reverse();
  }

  self.activeSort = 'sortCHead';
  self.filteredChargeheads = self.chargeheads;
  self.callPaging();

  self.update();
  self.sortCHead = !self.sortCHead;
};

self.sortByCode = function () {

  if (self.sortCode == true) {
    self.chargeheads.sort(function (a, b) {
      return a.chargehead_code - b.chargehead_code;
    });
  } else {
    self.chargeheads.reverse();
  }

  self.activeSort = 'sortCode';
  self.filteredChargeheads = self.chargeheads;
  self.callPaging();

  self.update();
  self.sortCode = !self.sortCode;
};

/*sorting Ends*/

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pageDataItems = self.getPageData(self.filteredChargeheads, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredChargeheads, self.items_per_page);
  self.pageDataItems = self.getPageData(self.filteredChargeheads, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('condition-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Conditions</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchCondition" class="form-control" placeholder="search" onkeyup="{filterConditions}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshConditions}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"><input type="text" name="addConditionInput" placeholder="Condition" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{add}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th onclick="{sortByCondition}" style="cursor: pointer;"> Condition <hand if="{activeSort==\'sortTC\'}"> <i class="material-icons" show="{sortTC}">arrow_upward</i> <i class="material-icons" hide="{sortTC}">arrow_downward</i> </hand> </th> <th class="two-buttons"></th> </tr> <tr each="{loc, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td if="{!loc.confirmEdit && !loc.confirmDelete}"> {loc.condition_name} </td> <td if="{loc.confirmDelete}"><span class="delete-question">Are you sure?</span></td> <td if="{loc.confirmEdit}"> <input type="text" id="editedCondition" class="form-control" value="{loc.condition_name}" onkeyup="{editEnter.bind(this)}"> </td> <td> <div class="table-buttons" hide="{loc.confirmDelete ||  loc.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{loc.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{loc.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot> <tr> <td colspan="4"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortTC = true;
  self.activeSort = '';
  self.update();
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_conditions');
});

// RiotControl.on('login_changed', function(login_status) {
//   if(!login_status.role || login_status.role == 'FAIL'){
//     riot.route("/home")
//   }
// })

self.refreshConditions = function () {
  self.conditions = [];
  self.searchCondition.value;
  RiotControl.trigger('read_conditions');
};

self.filterConditions = function () {
  if (!self.searchCondition) return;
  self.filteredConditions = self.conditions.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchCondition.value.toLowerCase()) >= 0;
  });
  self.paginate(self.filteredConditions, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredConditions, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.conditions.map(function (c) {
    if (c.condition_id != e.item.loc.condition_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.conditions.map(function (c) {
    if (c.condition_id != e.item.loc.condition_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_condition', e.item.loc.condition_id);
};

self.edit = function (e) {
  if (!$("#editedCondition").val()) {
    toastr.info("Please enter a valid Term & Condition and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_condition', e.item.loc.condition_id, $("#editedCondition").val());
  }
};

self.add = function () {
  if (!self.addConditionInput.value) {
    toastr.info("Please enter a valid Term & Condition and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_condition', self.addConditionInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.add();
  }
};

self.editEnter = function (e) {
  if (e.which == 13) {
    self.edit(e);
  }
};

self.cancelOperation = function (e) {
  self.conditions.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

RiotControl.on('conditions_changed', function (conditions) {
  self.addConditionInput.value = '';
  self.loading = false;
  self.conditions = conditions;
  self.filteredConditions = conditions;

  self.items_per_page = 10;
  self.paginate(self.filteredConditions, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredConditions, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredConditions, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredConditions, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredConditions, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/*sorting Starts*/
self.sortByCondition = function () {

  if (self.sortTC == true) {
    self.conditions.sort(function (a, b) {
      return a.condition_name.toUpperCase().localeCompare(b.condition_name.toUpperCase());
    });
  } else {
    self.conditions.reverse();
  }

  self.activeSort = 'sortTC';
  self.filteredConditions = self.conditions;

  self.paginate(self.filteredConditions, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredConditions, 1, self.items_per_page);

  self.update();
  self.sortTC = !self.sortTC;
};

/*sorting Ends*/
});

riot.tag2('db-backup', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>DB Backup</h1> </div> </div> </div> <div class="row"> <div class="col-md-12 text-center" style="margin-top:100px"> <button class="btn btn-primary" __disabled="{loading}" onclick="{dbBackup}">Create Database Backup</button> <br> <br> <br> <br> <br> <button class="btn btn-primary" __disabled="{loading}" onclick="{dbStore}" style="display:none">Item,Party Master utf8-encoding</button> <button class="btn btn-primary" __disabled="{loading}" onclick="{dbRunningAmount}" style="display:none">Running Amount</button> <button class="btn btn-primary" __disabled="{loading}" onclick="{dbOpeningStock}" style="display:none">Opening Stock For New Financial Year</button> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.update();
});

self.dbBackup = function (e) {
  self.loading = true;
  RiotControl.trigger('db_backup');
};

RiotControl.on('db_backup_changed', function () {
  self.loading = false;
  toastr.info("Backup is created Sussfully");
  self.update();
});

self.dbStore = function (e) {
  self.loading = true;
  RiotControl.trigger('db_store');
};

RiotControl.on('db_store_changed', function () {
  self.loading = false;
  toastr.info("Backup is created Sussfully");
  self.update();
});

self.dbRunningAmount = function (e) {
  self.loading = true;
  RiotControl.trigger('db_running_amount');
};

RiotControl.on('db_running_amount_changed', function () {
  self.loading = false;
  toastr.info("Running Amount created Sussfully");
  self.update();
});

self.dbOpeningStock = function (e) {
  self.loading = true;
  RiotControl.trigger('db_opening_stock');
};

RiotControl.on('db_opening_stock_changed', function () {
  self.loading = false;
  toastr.info("Opening Stock created Sussfully");
  self.update();
});
});
riot.tag2('department-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Departments</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchDepartment" class="form-control" placeholder="search" onkeyup="{filterDepartments}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshDepartments}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"><input type="text" name="addDepartmentCodeInput" placeholder="Code" class="form-control" onkeyup="{addEnter}"></td> <td><input type="text" name="addDepartmentInput" placeholder="Department" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{add}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th onclick="{sortByCode}" style="cursor: pointer;"> Code <hand if="{activeSort==\'sortCode\'}"> <i class="material-icons" show="{sortCode}">arrow_upward</i> <i class="material-icons" hide="{sortCode}">arrow_downward</i> <hand> </th> <th onclick="{sortByDept}" style="cursor: pointer;"> Department <hand if="{activeSort==\'sortDept\'}"> <i class="material-icons" show="{sortDept}">arrow_upward</i> <i class="material-icons" hide="{sortDept}">arrow_downward</i> </hand> </th> <th class="two-buttons"></th> </tr> <tr each="{dept, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td if="{!dept.confirmEdit && !dept.confirmDelete}"> {dept.department_code} </td> <td if="{!dept.confirmEdit && !dept.confirmDelete}"> {dept.department} </td> <td colspan="2" if="{dept.confirmDelete}"><span class="delete-question">Are you sure?</span></td> <td if="{dept.confirmEdit}"> <input type="text" id="editedDepartmentCode" autofocus class="form-control" value="{dept.department_code}" onkeyup="{editEnter.bind(this)}"> </td> <td if="{dept.confirmEdit}"> <input type="text" id="editedDepartment" class="form-control" value="{dept.department}" onkeyup="{editEnter.bind(this)}"> </td> <td> <div class="table-buttons" hide="{dept.confirmDelete ||  dept.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{dept.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{dept.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="4"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortDept = true;
  self.sortCode = true;
  self.activeSort = '';
  self.update();
  self.items_per_page = 10;
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_departments');
  console.log('here');
});

self.refreshDepartments = function () {
  self.departments = [];
  self.searchDepartment.value;
  RiotControl.trigger('read_departments');
};

self.filterDepartments = function () {
  if (!self.searchDepartment) return;
  self.filteredDepartments = self.departments.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchDepartment.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.departments.map(function (c) {
    if (c.department_id != e.item.dept.department_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.departments.map(function (c) {
    if (c.department_id != e.item.dept.department_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_department', e.item.dept.department_id);
};

self.edit = function (e) {
  if (!$("#editedDepartmentCode").val()) {
    toastr.info("Please enter a valid department Code and try again");
  } else if (!$("#editedDepartment").val()) {
    toastr.info("Please enter a valid department and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_department', e.item.dept.department_id, $("#editedDepartmentCode").val(), $("#editedDepartment").val());
  }
};

self.add = function () {
  if (!self.addDepartmentCodeInput.value) {
    toastr.info("Please enter a valid department Code and try again");
  } else if (!self.addDepartmentInput.value) {
    toastr.info("Please enter a valid department and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_department', self.addDepartmentCodeInput.value, self.addDepartmentInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.add();
  }
};

self.editEnter = function (e) {
  if (e.which == 13) {
    self.edit(e);
  }
};

self.cancelOperation = function (e) {
  self.departments.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

RiotControl.on('departments_changed', function (departments) {
  self.addDepartmentCodeInput.value = '';
  self.addDepartmentInput.value = '';
  self.loading = false;
  self.departments = departments;
  self.filteredDepartments = departments;

  self.callPaging();

  self.update();
});

self.callPaging = function () {
  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
};

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredDepartments, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/*sorting Starts*/
self.sortByDept = function () {
  console.log('calling sortByDept');

  if (self.sortDept == true) {
    self.departments.sort(function (a, b) {
      return a.department.toUpperCase().localeCompare(b.department.toUpperCase());
    });
  } else {
    self.departments.reverse();
  }

  self.activeSort = 'sortDept';
  self.filteredDepartments = self.departments;
  self.callPaging();

  self.update();
  self.sortDept = !self.sortDept;
};

self.sortByCode = function () {

  if (self.sortCode == true) {
    self.departments.sort(function (a, b) {
      return a.department_code - b.department_code;
    });
  } else {
    self.departments.reverse();
  }

  self.activeSort = 'sortCode';
  self.filteredDepartments = self.departments;
  self.callPaging();

  self.update();
  self.sortCode = !self.sortCode;
};

/*sorting Ends*/
});

riot.tag2('docket-register-date-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Docket Register (Date Wise)</h4> <div show="{docket_register_date_wise ==\'docket_register_date_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="docketRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="docketRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="docketRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="docketRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <table class="table table-bordered"> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readDocket}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" alt="OLD" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> <img src="img/excel.png" alt="NEW" style="height:30px;margin-top: 33px;" onclick="{excelExportNew}"> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{docket_register_date_wise ==\'docket_register_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Docket Register (Date Wise)<br> From {docketFrom} To {docketTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Docket Date: <b>{m.date}</b></h5> <div each="{d, j in m.dockets}"> <table class="table print-small"> <tr> <td>Docket No: <b>{d.docketDetails.stock_type_code}-{d.docketDetails.docket_no}</b></td> <td>Docket Date: <b>{d.docketDetails.docket_date}</b></td> <td>Party: <b>{d.docketDetails.party_name}</b></td> </tr> <tr> <td>Bill No: <b>{d.docketDetails.bill_no}</b></td> <td>Bill Date: <b>{d.docketDetails.bill_date}</b></td> <td>GST No: <b>{d.docketDetails.gst}</b></td> </tr> <tr> <td>Challan No: <b>{d.docketDetails.challan_no}</b></td> <td>Challan Date: <b>{d.docketDetails.challan_date}</b></td> <td>LR No: <b>{d.docketDetails.lr_no}</b></td> </tr> <tr> <td colspan="3">Vehicle No: <b>{d.docketDetails.vehicle_no}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Item Value</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{k+1}</td> <td>{t.item_name}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td style="text-align:right">{t.total}</td> </tr> <tr> <td colspan="7" style="text-align:right">Sub Total</td> <td class="text-xs-right">{d.docketDetails.sub_total_amount}</td> </tr> <tr hide="{d.docketDetails.freight_charge==0.00}"> <td colspan="7" style="text-align:right">Insurance Charges</td> <td class="text-xs-right">{d.docketDetails.freight_charge}</td> </tr> <tr hide="{d.docketDetails.p_and_f_charge==0.00}"> <td colspan="7" style="text-align:right">P & F Charges</td> <td class="text-xs-right">{d.docketDetails.p_and_f_charge}</td> </tr> <tr hide="{d.docketDetails.delivery_charge==0.00}"> <td colspan="7" style="text-align:right">Delivery Charges</td> <td class="text-xs-right">{d.docketDetails.delivery_charge}</td> </tr> <tr hide="{d.docketDetails.loading_charge==0.00}"> <td colspan="7" style="text-align:right">Loading Charges</td> <td class="text-xs-right">{d.docketDetails.loading_charge}</td> </tr> <tr hide="{d.docketDetails.packing_charge==0.00}"> <td colspan="7" style="text-align:right">Packing Charges</td> <td class="text-xs-right">{d.docketDetails.packing_charge}</td> </tr> <tr hide="{d.docketDetails.courier_charge==0.00}"> <td colspan="7" style="text-align:right">Courier Charges</td> <td class="text-xs-right">{d.docketDetails.courier_charge}</td> </tr> <tr hide="{d.docketDetails.round_off_amount==0.00}"> <td colspan="7" style="text-align:right">Round off</td> <td class="text-xs-right">{d.docketDetails.round_off_amount}</td> </tr> <tr> <td colspan="7" style="text-align:right">Bill Amount</td> <td class="text-xs-right">{d.docketDetails.bill_amount}</td> </tr> </table> </div> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td colspan="5" style="text-align:right">Grand Total Qty</td> <td class="text-xs-right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Item Value</td> <td class="text-xs-right">{item_value_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('docketRegisterDateWiseStartDateInput');
  dateFormat('docketRegisterDateWiseEndDateInput');
  self.docket_register_date_wise = 'docket_register_date_wise_home';
  RiotControl.trigger('read_stock_types');
  self.update();
});

self.excelExport = function () {
  if (self.docketRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.docketRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/docket_register_date_wise_csv.php?start_date=" + self.docketRegisterDateWiseStartDateInput.value + "&end_date=" + self.docketRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.excelExportNew = function () {
  if (self.docketRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.docketRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/docket_register_date_wise_csv_new.php?start_date=" + self.docketRegisterDateWiseStartDateInput.value + "&end_date=" + self.docketRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.setStartDate = function () {
  self.sd = self.docketRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.docketRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.docket_register_date_wise = 'docket_register_date_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readDocket = function () {
  if (self.docketRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.docketRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  if (selectedStockTypeString == '') {
    toastr.info("Please Select Stock Type");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_docket_register_date_wise', self.docketRegisterDateWiseStartDateInput.value, self.docketRegisterDateWiseEndDateInput.value, selectedStockTypeString);
};

RiotControl.on('read_docket_register_date_wise_changed', function (mainArray, qty_grand_total, item_value_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.item_value_grand_total = item_value_grand_total;
  self.docket_register_date_wise = 'docket_register_date_wise_report';
  self.docketFrom = self.docketRegisterDateWiseStartDateInput.value;
  self.docketTo = self.docketRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});
});

riot.tag2('docket-register-item-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Docket Register Item Wise</h4> <div show="{docket_register_item_wise ==\'docket_register_item_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="docketRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="docketRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="docketRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="docketRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readDocket}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{docket_register_item_wise ==\'docket_register_item_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Docket Register (Item Wise)<br> From {docketFrom} To {docketTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Item: <b>{m.item}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Docket Dt</th> <th>Docket No</th> <th>Party Name</th> <th>GST No</th> <th>Bill No</th> <th>Bill Date</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Item Value</th> </tr> <tr each="{t, k in m.dockets}" no-reorder> <td>{k+1}</td> <td>{t.docket_date}</td> <td>{t.stock_type_code}-{t.docket_no}</td> <td>{t.party_name}</td> <td>{t.gst}</td> <td>{t.bill_no}</td> <td>{t.bill_date}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td style="text-align:right">{t.total}</td> </tr> </table> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td style="text-align:right">Grand Total Qty</td> <td class="text-xs-right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Item Value</td> <td class="text-xs-right">{item_value_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('docketRegisterItemWiseStartDateInput');
  dateFormat('docketRegisterItemWiseEndDateInput');
  self.docket_register_item_wise = 'docket_register_item_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_items_filter');
  self.update();
});

self.excelExport = function () {
  if (self.docketRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.docketRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/docket_register_item_wise_csv.php?start_date=" + self.docketRegisterItemWiseStartDateInput.value + "&end_date=" + self.docketRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&selected_item_id=" + selected_item_id;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/
self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.setStartDate = function () {
  self.sd = self.docketRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.docketRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.docket_register_item_wise = 'docket_register_item_wise_home';
};

self.readDocket = function () {
  if (self.docketRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.docketRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_docket_register_item_wise', self.docketRegisterItemWiseStartDateInput.value, self.docketRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_item_id);
};

RiotControl.on('read_docket_register_item_wise_changed', function (mainArray, qty_grand_total, item_value_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.item_value_grand_total = item_value_grand_total;
  self.docket_register_item_wise = 'docket_register_item_wise_report';
  self.docketFrom = self.docketRegisterItemWiseStartDateInput.value;
  self.docketTo = self.docketRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('docket-register-party-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Docket Register Party Wise</h4> <div show="{docket_register_party_wise ==\'docket_register_party_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="docketRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="docketRegisterDateWiseStartDateInput" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="docketRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="docketRegisterDateWiseEndDateInput" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readDocket}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchParty" class="form-control" placeholder="Search Party" onkeyup="{filterParties}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectParty.bind(this, cat)}"></td> <td>{cat.party_name}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Party</th> <th></th> </tr> <tr each="{cat, i in checkedParties}"> <td>{i+1}</td> <td>{cat.party_name}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeParty.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{docket_register_party_wise ==\'docket_register_party_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Docket Register (Date Wise)<br> From {docketFrom} To {docketTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Party: <b>{m.date}</b></h5> <div each="{d, j in m.dockets}"> <table class="table print-small"> <tr> <td>Docket No: <b>{d.docketDetails.stock_type_code}-{d.docketDetails.docket_no}</b></td> <td>Docket Date: <b>{d.docketDetails.docket_date}</b></td> <td>Party: <b>{d.docketDetails.party_name}</b></td> </tr> <tr> <td>Bill No: <b>{d.docketDetails.bill_no}</b></td> <td>Bill Date: <b>{d.docketDetails.bill_date}</b></td> <td>GST No: <b>{d.docketDetails.gst}</b></td> </tr> <tr> <td>Challan No: <b>{d.docketDetails.challan_no}</b></td> <td>Challan Date: <b>{d.docketDetails.challan_date}</b></td> <td>LR No: <b>{d.docketDetails.lr_no}</b></td> </tr> <tr> <td colspan="3">Vehicle No: <b>{d.docketDetails.vehicle_no}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Item Value</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{k+1}</td> <td>{t.item_name}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td style="text-align:right">{t.total}</td> </tr> <tr> <td colspan="7" style="text-align:right">Sub Total</td> <td class="text-xs-right">{d.docketDetails.sub_total_amount}</td> </tr> <tr hide="{d.docketDetails.freight_charge==0.00}"> <td colspan="7" style="text-align:right">Insurance Charges</td> <td class="text-xs-right">{d.docketDetails.freight_charge}</td> </tr> <tr hide="{d.docketDetails.p_and_f_charge==0.00}"> <td colspan="7" style="text-align:right">P & F Charges</td> <td class="text-xs-right">{d.docketDetails.p_and_f_charge}</td> </tr> <tr hide="{d.docketDetails.delivery_charge==0.00}"> <td colspan="7" style="text-align:right">Delivery Charges</td> <td class="text-xs-right">{d.docketDetails.delivery_charge}</td> </tr> <tr hide="{d.docketDetails.loading_charge==0.00}"> <td colspan="7" style="text-align:right">Loading Charges</td> <td class="text-xs-right">{d.docketDetails.loading_charge}</td> </tr> <tr hide="{d.docketDetails.packing_charge==0.00}"> <td colspan="7" style="text-align:right">Packing Charges</td> <td class="text-xs-right">{d.docketDetails.packing_charge}</td> </tr> <tr hide="{d.docketDetails.courier_charge==0.00}"> <td colspan="7" style="text-align:right">Courier Charges</td> <td class="text-xs-right">{d.docketDetails.courier_charge}</td> </tr> <tr hide="{d.docketDetails.round_off_amount==0.00}"> <td colspan="7" style="text-align:right">Round off</td> <td class="text-xs-right">{d.docketDetails.round_off_amount}</td> </tr> <tr> <td colspan="7" style="text-align:right">Bill Amount</td> <td class="text-xs-right">{d.docketDetails.bill_amount}</td> </tr> </table> </div> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td colspan="5" style="text-align:right">Grand Total Qty</td> <td class="text-xs-right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Item Value</td> <td class="text-xs-right">{item_value_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.selected_party_id = '';
self.checkedParties = [];
self.on("mount", function () {
  dateFormat('docketRegisterDateWiseStartDateInput');
  dateFormat('docketRegisterDateWiseEndDateInput');
  self.docket_register_party_wise = 'docket_register_party_wise_home';
  RiotControl.trigger('read_parties');
});

self.excelExport = function () {
  if (self.docketRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.docketRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  self.selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (self.selected_party_id == '') {
      self.selected_party_id = t.party_id;
    } else if (self.selected_party_id != '') {
      self.selected_party_id = self.selected_party_id + ',' + t.party_id;
    }
  });

  var link = "csv/docket_register_party_wise_csv.php?start_date=" + self.docketRegisterDateWiseStartDateInput.value + "&end_date=" + self.docketRegisterDateWiseEndDateInput.value + "&selected_party_id=" + self.selected_party_id;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.filterParties = function () {
  if (!self.searchParty) return;
  self.filteredParties = self.parties.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
};

self.selectParty = function (t, e) {
  self.checkedParties.push(t);

  self.parties = self.parties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.party_id != t.party_id;
  });
};

self.removeParty = function (t, e) {
  self.checkedParties = self.checkedParties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  console.log(self.checkedParties);

  self.parties.push(t);
  self.pagedDataItems.push(t);
};

self.closeReport = function () {
  self.docket_register_party_wise = 'docket_register_party_wise_home';
};

self.readDocket = function () {
  if (self.docketRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.docketRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  self.selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (self.selected_party_id == '') {
      self.selected_party_id = t.party_id;
    } else if (self.selected_party_id != '') {
      self.selected_party_id = self.selected_party_id + ',' + t.party_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_docket_register_party_wise', self.docketRegisterDateWiseStartDateInput.value, self.docketRegisterDateWiseEndDateInput.value, self.selected_party_id);
};

RiotControl.on('read_docket_register_party_wise_changed', function (mainArray, qty_grand_total, item_value_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.item_value_grand_total = item_value_grand_total;
  self.docket_register_party_wise = 'docket_register_party_wise_report';
  self.docketFrom = self.docketRegisterDateWiseStartDateInput.value;
  self.docketTo = self.docketRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('parties_changed', function (parties, party) {
  self.loading = false;
  self.checkedParties = [];
  self.parties = party;
  self.filteredParties = party;

  self.items_per_page = 10;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.update();

  /*$('#selectPartyNameInput').autocomplete({
      source: parties,
      select: function( event, ui ) {
        self.selected_party_id= ui.item.party_id
        console.log(self.selected_party_id)
    });*/
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('docket-report', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Docket Report</h4> <div show="{docket_register_date_wise ==\'docket_register_date_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="docketRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="docketRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="docketRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="docketRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <table class="table table-bordered"> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readDocket}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <a href="csv/docket_register_date_wise_csv.php?start_date={sd}&end_date={ed}&stock_type_code={stock_type}" target="_blank" class="btn btn-default text-right"><img src="img/excel.png" style="height:30px;margin-top: 23px;"></a> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{docket_register_date_wise ==\'docket_register_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Docket Register (Date Wise)<br> From {docketFrom} To {docketTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Docket Date: <b>{m.date}</b></h5> <div each="{d, j in m.dockets}"> <table class="table print-small"> <tr> <td>Docket No: <b>{d.docketDetails.stock_type_code}-{d.docketDetails.docket_no}</b></td> <td>Docket Date: <b>{d.docketDetails.docket_date}</b></td> <td>Party: <b>{d.docketDetails.party_name}</b></td> </tr> <tr> <td>Bill No: <b>{d.docketDetails.bill_no}</b></td> <td>Bill Date: <b>{d.docketDetails.bill_date}</b></td> <td>GST No: <b>{d.docketDetails.gst}</b></td> </tr> <tr> <td>Challan No: <b>{d.docketDetails.challan_no}</b></td> <td>Challan Date: <b>{d.docketDetails.challan_date}</b></td> <td>LR No: <b>{d.docketDetails.lr_no}</b></td> </tr> <tr> <td colspan="3">Vehicle No: <b>{d.docketDetails.vehicle_no}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Item Value</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{k+1}</td> <td>{t.item_name}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td style="text-align:right">{t.total}</td> </tr> <tr> <td colspan="7" style="text-align:right">Sub Total</td> <td class="text-xs-right">{d.docketDetails.sub_total_amount}</td> </tr> <tr hide="{d.docketDetails.freight_charge==0.00}"> <td colspan="7" style="text-align:right">Insurance Charges</td> <td class="text-xs-right">{d.docketDetails.freight_charge}</td> </tr> <tr hide="{d.docketDetails.p_and_f_charge==0.00}"> <td colspan="7" style="text-align:right">P & F Charges</td> <td class="text-xs-right">{d.docketDetails.p_and_f_charge}</td> </tr> <tr hide="{d.docketDetails.delivery_charge==0.00}"> <td colspan="7" style="text-align:right">Delivery Charges</td> <td class="text-xs-right">{d.docketDetails.delivery_charge}</td> </tr> <tr hide="{d.docketDetails.loading_charge==0.00}"> <td colspan="7" style="text-align:right">Loading Charges</td> <td class="text-xs-right">{d.docketDetails.loading_charge}</td> </tr> <tr hide="{d.docketDetails.packing_charge==0.00}"> <td colspan="7" style="text-align:right">Packing Charges</td> <td class="text-xs-right">{d.docketDetails.packing_charge}</td> </tr> <tr hide="{d.docketDetails.courier_charge==0.00}"> <td colspan="7" style="text-align:right">Courier Charges</td> <td class="text-xs-right">{d.docketDetails.courier_charge}</td> </tr> <tr hide="{d.docketDetails.round_off_amount==0.00}"> <td colspan="7" style="text-align:right">Round off</td> <td class="text-xs-right">{d.docketDetails.round_off_amount}</td> </tr> <tr> <td colspan="7" style="text-align:right">Bill Amount</td> <td class="text-xs-right">{d.docketDetails.bill_amount}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('docketRegisterDateWiseStartDateInput');
  dateFormat('docketRegisterDateWiseEndDateInput');
  self.docket_register_date_wise = 'docket_register_date_wise_home';
  RiotControl.trigger('read_stock_types');
  self.update();
});

self.setStartDate = function () {
  self.sd = self.docketRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.docketRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.docket_register_date_wise = 'docket_register_date_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readDocket = function () {
  if (self.docketRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.docketRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  if (selectedStockTypeString == '') {
    toastr.info("Please Select Stock Type");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_docket_report', self.docketRegisterDateWiseStartDateInput.value, self.docketRegisterDateWiseEndDateInput.value, selectedStockTypeString);
};

RiotControl.on('read_docket_report_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.docket_register_date_wise = 'docket_register_date_wise_report';
  self.docketFrom = self.docketRegisterDateWiseStartDateInput.value;
  self.docketTo = self.docketRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});
});

riot.tag2('docket', '<loading-bar if="{loading}"></loading-bar> <div show="{docket_view ==\'docket_home\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-4"> <div class="form-group row"> <h1 class="col-xs-5 col-form-label">Docket</h1> <div class="col-xs-7" style="padding-top: 12px;"> <select name="stockTypeForReadInput" class="form-control" onchange="{readDocket}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type_code}-{stock_type}</option> <option value="all">All</option> </select> </div> </div> </div> <div class="col-md-8 text-xs-right" style="padding-top: 12px;"> <div class="form-inline"> <input type="search" name="searchDocket" class="form-control" placeholder="search" onkeyup="{filterDockets}" style="width:200px;margin-right: 10px;"> <button class="btn btn-secondary" onclick="{readDocket}" style="margin-right: 10px;"><i class="material-icons">refresh</i></button> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{showDocketEntryForm}"><i class="material-icons">add</i></button> </div> </div> </div> <table class="table table-bordered"> <tr> <th>Sl</th> <th>Docket Number</th> <th>Docket Date</th> <th>Party Name</th> <th>Bill No</th> <th>Bill Date</th> <th>Amount</th> <th></th> </tr> <tr each="{d, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td class="text-center">{d.stock_type_code}-{d.docket_no}</td> <td class="text-center">{d.docket_date}</td> <td class="text-center">{d.party_name}</td> <td class="text-center">{d.bill_no}</td> <td class="text-center">{d.bill_date}</td> <td class="text-center">{d.bill_amount}</td> <td> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{viewDocketDetails.bind(this,d)}"><i class="material-icons">visibility</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{editDocket.bind(this,d)}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{deleteDocket.bind(this,d)}"><i class="material-icons">delete</i></button> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="8"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{docket_view ==\'docket_entry\'}"> <div class="container-fluid"> <h4>{title} Docket</h4> <button type="button" class="btn btn-secondary text-right" onclick="{showDocketHome}">Close</button> <form> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label for="stockTypeInput">Stock Type</label> <select name="stockTypeInput" class="form-control" onchange="{readPurchaseOrder}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type_code}-{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="partyInput">Party</label> <select name="partyInput" class="form-control" disabled> <option></option> <option each="{parties}" value="{party_id}">{party_name}</option> </select> </div> </div> </div> <div class="row"> <div class="col-sm-12" style="padding-top: 10px;padding-bottom: 10px;"> Select PO: &nbsp;&nbsp;&nbsp;&nbsp; <span each="{p, i in purchaseOrders}" style="padding-right: 10px;"> <input type="checkbox" __checked="{p.selected}" id="{\'selectPOInput\' + p.po_id}" onclick="{selectPO.bind(this,p)}"><span style="margin-left:5px;" class="{fyear: p.fyear==\'true\'}">{p.stock_type_code}-{p.po_no}</span> </span> <button type="button" id="readDetailsButton" class="btn btn-secondary" onclick="{readMaterials}" style="margin-left:5px;">GO</button> </div> </div> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="docketNumberInput">Docket No</label> <input type="text" class="form-control" id="docketNumberInput" disabled> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="docketDateInput">Docket Date</label> <input type="text" class="form-control" id="docketDateInput" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="billNumberInput">Bill No</label> <input type="text" class="form-control" id="billNumberInput"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="billDateInput">Bill Date</label> <input type="text" class="form-control" id="billDateInput" placeholder="DD/MM/YYYY"> </div> </div> </div> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="challanNumberInput">Challan No</label> <input type="text" class="form-control" id="challanNumberInput"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="challanDateInput">Challan Date</label> <input type="text" class="form-control" id="challanDateInput" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="transporterNameInput">Transporter Name</label> <input type="text" class="form-control" id="transporterNameInput"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="modeOfTranspotationInput">Mode of transpotation</label> <input type="text" class="form-control" id="modeOfTranspotationInput"> </div> </div> </div> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="vehicleNumberInput">Vehicle No</label> <input type="text" class="form-control" id="vehicleNumberInput"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="lrNumberInput">LR No</label> <input type="text" class="form-control" id="lrNumberInput"> </div> </div> </div> <div class="row"> <table class="table table-bordered"> <tr> <th>Sl</th> <th>Material</th> <th>PO No</th> <th>UOM</th> <th>Location</th> <th>Pending PO</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Disc %</th> <th>Disc Amt</th> <th>P&F</th> <th each="{dutyhead, a in dutyHeaders}"> <strong>{dutyhead.tax_name}</strong> </th> <th each="{taxhead, b in taxOneHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{taxhead, c in taxTwoHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{cesshead, d in cessHeaders}"> <strong>{cesshead.tax_name}</strong> </th> <th>Other Charges</th> <th style="width: 130px;">Total</th> <th>Remarks</th> <th></th> </tr> <tr each="{m, i in materials}"> <td>{i+1}</td> <td>{m.item_name}(Code:{m.item_id})</td> <td style="width:100px">{m.po_no}</td> <td>{m.uom}</td> <td> <select id="{\'locationInput\' + m.item_index}" class="form-control" onblur="{changeLocation.bind(this,m)}" style="width: 100px;"> <option></option> <option each="{locations}" value="{location}">{location}</option> </select> </td> <td>{m.po_qty}</td> <td> <input class="text-xs-right" type="text" id="{\'qtyInput\'+m.item_index}" value="{m.qty}" onblur="{calculateTotalValue}" class="form-control" style="width: 100px;"> </td> <td class="text-xs-right">{m.unit_value}</td> <td class="text-xs-right">{m.amount}</td> <td class="text-xs-right">{m.discount_percentage}</td> <td class="text-xs-right">{m.discount_amount}</td> <td class="text-xs-right"> <input class="text-xs-right" type="text" id="{\'pAndFInput\'+m.item_index}" value="{m.p_and_f_charges}" onblur="{calculateTotalValue}" class="form-control" style="width: 100px;"> </td> <td each="{d, j in m.duties}" class="text-sm-right"> {d.duty} </td> <td each="{tone, k in m.taxone}" class="text-sm-right"> {tone.tax_one} </td> <td each="{ttwo, l in m.taxtwo}" class="text-sm-right"> {ttwo.tax_two} </td> <td each="{c, m in m.cess}" class="text-sm-right"> {c.cess} </td> <td class="text-xs-right"> <input class="text-xs-right" type="text" id="{\'otherChargesInput\'+m.item_index}" value="{m.other_charges}" onblur="{calculateTotalValue}" class="form-control" style="width: 100px;"> </td> <td class="text-xs-right">{m.total}</td> <td> <input type="text" id="{\'remarksInput\' + m.item_index}" value="{m.remarks}" onblur="{changeRemarks.bind(this,m)}" class="form-control"> </td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeSelectedMaterial.bind(this, m)}"><i class="material-icons">remove</i></button> </td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">Sub Total</td> <td class="text-xs-right">{sub_total}</td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">Insurance Charges</td> <td><input type="text" id="freightChargeInput" onblur="{calculateCharge}" class="form-control text-xs-right" style="width:120px"></td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">P & F Charges</td> <td><input type="text" id="pAndFChargeInput" onblur="{calculateCharge}" class="form-control text-xs-right"></td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">Delivery Charges</td> <td><input type="text" id="deliveryChargeInput" onblur="{calculateCharge}" class="form-control text-xs-right"></td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">Loading Charges</td> <td><input type="text" id="loadingChargeInput" onblur="{calculateCharge}" class="form-control text-xs-right"></td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">Packing Charges</td> <td><input type="text" id="packingChargeInput" onblur="{calculateCharge}" class="form-control text-xs-right"></td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">Courier Charges</td> <td><input type="text" id="courierChargeInput" onblur="{calculateCharge}" class="form-control text-xs-right"></td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">Round Off</td> <td><input type="text" id="roundOffInput" onblur="{calculateCharge}" class="form-control text-xs-right"></td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan}" style="text-align:right">Bill Amount</td> <td class="text-xs-right">{bill_amount}</td> <td colspan="2"></td> </tr> <tr> <td colspan="{colspan+3}"> Remarks:&nbsp;&nbsp; <input type="text" id="docketRemarksInput" class="form-control"> </td> </tr> </table> </div> </form> <div class="row"> <button type="button" class="btn btn-secondary text-right" onclick="{showDocketHome}">Close</button> <button type="button" class="btn btn-primary text-right" onclick="{submitDocket}" style="margin-right: 10px;">Submit</button> </div> </div> </div> <div class="container-fluid print-box" show="{docket_view ==\'docket_view\'}"> <div class="row no-print"> <button type="button" class="btn btn-secondary text-right" onclick="{showDocketHome}">Close</button> </div> <div class="container-fluid" each="{copy in copies}"> <center> <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> Email: purchase@ntcind.com<br> {copy} Copy </span><br> </center><br> <table class="table table-bordered bill-info-table"> <tr> <th style="width:90px">Store Type</th> <td> {docketDetails.stock_type_code}</td> <th>Party</th> <td colspan="3">{docketDetails.party_name}</td> </tr> <tr> <th>Docket No</th> <td>{docketDetails.docket_no}</td> <th>Bill No</th> <td>{docketDetails.bill_no}</td> <th style="width:140px">Challan No</th> <td>{docketDetails.challan_no}</td> </tr> <tr> <th><span style="font-size:11px;">Docket Date</span></th> <td>{docketDetails.docket_date}</td> <th>Bill Date</th> <td>{docketDetails.bill_date}</td> <th>Challan Date</th> <td>{docketDetails.challan_date}</td> </tr> <tr> <th>PO No</th> <td>{docketDetails.po_no}</td> <th>Transporter</th> <td>{docketDetails.transporter_name}</td> <th>LR No</th> <td>{docketDetails.lr_no}</td> </tr> <tr> <th>PO Date</th> <td>{docketDetails.po_date}</td> <th>Vehicle No</th> <td>{docketDetails.vehicle_no}</td> <th><span style="font-size:11px;">Mode Of Transpotation</span></th> <td>{docketDetails.transpotation_mode}</td> </tr> <tr> <th colspan="2">Indent No & Date</th> <td colspan="4">{docketDetails.indent_no_and_date}</td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th style="max-width:50px;width:50px"><strong>Sl</strong></th> <th style="width:200px;"><strong>Material</strong></th> <th><strong>UOM</strong></th> <th><strong>Location</strong></th> <th><strong>Qty</strong></th> <th><strong>Rate</strong></th> <th><strong>Amount</strong></th> <th><strong>Discount</strong></th> <th show="{docketDetails.p_and_f_charges}"><strong>P&F</strong></th> <th each="{dutyhead, a in dutyHeadersView}"> <strong>{dutyhead.tax_name}</strong> </th> <th each="{taxhead, b in taxOneHeadersView}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{taxhead, c in taxTwoHeadersView}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{cesshead, d in cessHeadersView}"> <strong>{cesshead.tax_name}</strong> </th> <th show="{docketDetails.other_charges}"><strong>Other Charges</strong></th> <th style="width: 130px;"><strong>Total</strong></th> </tr> <tr each="{m, i in materialsView}"> <td><div class="slno">{i+1}</div></td> <td>{m.item_name}-(Code:{m.item_id})</td> <td>{m.uom}</td> <td>{m.location}</td> <td class="text-xs-right">{m.qty}</td> <td class="text-xs-right">{m.unit_value}</td> <td class="text-xs-right">{m.amount}</td> <td class="text-xs-right">{m.discount_amount}<br>({m.discount_percentage}%)</td> <td class="text-xs-right" show="{docketDetails.p_and_f_charges}">{m.p_and_f_charge}</td> <td each="{d, j in m.duties}" class="text-sm-right"> {d} </td> <td each="{tone, k in m.taxone}" class="text-sm-right"> {tone} </td> <td each="{ttwo, l in m.taxtwo}" class="text-sm-right"> {ttwo} </td> <td each="{c, m in m.cess}" class="text-sm-right"> {c} </td> <td class="text-xs-right" show="{docketDetails.other_charges}">{m.other_charges}</td> <td class="text-xs-right">{m.total}</td> </tr> <tr> <td colspan="{colspanView}" style="text-align:right">Sub Total</td> <td class="text-xs-right">{docketDetails.sub_total_amount}</td> </tr> <tr hide="{docketDetails.freight_charge==0.00}"> <td colspan="{colspanView}" style="text-align:right">Insurance Charges</td> <td class="text-xs-right">{docketDetails.freight_charge}</td> </tr> <tr hide="{docketDetails.p_and_f_charge==0.00}"> <td colspan="{colspanView}" style="text-align:right">P & F Charges</td> <td class="text-xs-right">{docketDetails.p_and_f_charge}</td> </tr> <tr hide="{docketDetails.delivery_charge==0.00}"> <td colspan="{colspanView}" style="text-align:right">Delivery Charges</td> <td class="text-xs-right">{docketDetails.delivery_charge}</td> </tr> <tr hide="{docketDetails.loading_charge==0.00}"> <td colspan="{colspanView}" style="text-align:right">Loading Charges</td> <td class="text-xs-right">{docketDetails.loading_charge}</td> </tr> <tr hide="{docketDetails.packing_charge==0.00}"> <td colspan="{colspanView}" style="text-align:right">Packing Charges</td> <td class="text-xs-right">{docketDetails.packing_charge}</td> </tr> <tr hide="{docketDetails.courier_charge==0.00}"> <td colspan="{colspanView}" style="text-align:right">Courier Charges</td> <td class="text-xs-right">{docketDetails.courier_charge}</td> </tr> <tr hide="{docketDetails.round_off_amount==0.00}"> <td colspan="{colspanView}" style="text-align:right">Round off</td> <td class="text-xs-right">{docketDetails.round_off_amount}</td> </tr> <tr> <td colspan="{colspanView}" style="text-align:right">Bill Amount</td> <td class="text-xs-right">{docketDetails.bill_amount}</td> </tr> <tr> <td>Remarks</td> <td colspan="{colspanView}">{docketDetails.remarks}</td> </tr> </table> <br> <table class="table indent-footer divFooter1"> <tr> <td></td> <td></td> <td style="width:250px;"><div><center>{copy} Authority</center></div></td> </tr> </table> <div class="page-break"></div> </div> </div> <div class="modal fade" id="deleteDocketModal"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title">Delete Docket</h4> </div> <div class="modal-body"> <center><strong>Are you sure to delete docket</strong></center> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{confirmDeleteDocket}">Delete</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.items_per_page = 10;
  self.copies = ['Accounts', 'Inspection', 'Store'];
  RiotControl.trigger('read_stock_type_details');
  RiotControl.trigger('read_parties');
  RiotControl.trigger('read_locations');
  //dateFormat('docketStartDateInput')
  //dateFormat('docketEndDateInput')
  self.docket_view = 'docket_home';
  self.update();
  $(document).keypress(function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      console.log('no action');
      return false;
    }
  });
});

self.selectPO = function (item, e) {
  item.selected = !e.item.p.selected;
};

self.readDocket = function () {
  if (self.stockTypeForReadInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_docket', self.stockTypeForReadInput.value);
};

self.showDocketEntryForm = function () {
  self.title = 'Add';
  self.docket_view = 'docket_entry';
  dateFormat('docketDateInput');
  dateFormat('billDateInput');
  dateFormat('challanDateInput');
  self.materials = [];
  self.clearData();
  //$("#purchaseOrderInput").prop( "disabled", false );

  self.purchaseOrders.map(function (i) {
    var selectPOInput = '#selectPOInput' + i.po_id;
    $(selectPOInput).prop("disabled", false);
    $(selectPOInput).prop("checked", false);
  });
  $(readDetailsButton).prop("disabled", false);

  $("#docketDateInput").prop("disabled", false);
};

self.viewDocketDetails = function (d, e) {
  self.loading = true;
  RiotControl.trigger('read_docket_details', d.docket_id);
};

self.showDocketHome = function () {
  self.docket_view = 'docket_home';
};

self.readPurchaseOrder = function () {
  if (self.stockTypeInput.value == '') {
    toastr.error("Please select a Stock Type and try again");
    return;
  }
  self.loading = true;
  RiotControl.trigger('read_po_for_docket', self.stockTypeInput.value);
};

self.readMaterials = function () {
  /*if (self.purchaseOrderInput.value=='') {
    toastr.error("Please select a Purchase Order Number and try again")
    return
  }*/
  var selectedPO = [];
  self.purchaseOrders.map(function (i) {
    if (i.selected == true) {
      selectedPO.push(i.po_id);
    }
  });

  console.log(selectedPO);
  self.loading = true;
  //RiotControl.trigger('read_material',self.purchaseOrderInput.value)
  RiotControl.trigger('read_material', selectedPO);
};

/*docket form values start*/

self.changeLocation = function (m, e) {
  self.materials.map(function (i) {
    if (m.item_index == i.item_index) {
      var locationInput = '#locationInput' + i.item_index;
      i.location = $(locationInput).val();
    }
  });
};

self.calculateTotalValue = function (e) {
  var qtyInput = '#qtyInput' + e.item.m.item_index;
  var temp_qty = Number($(qtyInput).val());
  if (isNaN(temp_qty)) {
    temp_qty = 0;
  }

  if (self.title == 'Add') {
    if (temp_qty > Number(e.item.m.po_qty)) {
      toastr.error('Qty can not be grater than PO qty');
      temp_qty = 0;
    }
  } else if (self.title == 'Edit') {
    var max_po_qty = Number(e.item.m.po_qty) + Number(e.item.m.prev_qty);
    if (temp_qty > max_po_qty) {
      toastr.error('Qty can not be grater than PO qty');
      temp_qty = 0;
    }
  }

  var qty = Number(temp_qty).toFixed(3);
  e.item.m.qty = qty; //Qty

  e.item.m.amount = Number(Number(e.item.m.unit_value) * Number(qty)).toFixed(2);
  e.item.m.discount_amount = Number(Number(e.item.m.amount) * Number(e.item.m.discount_percentage) / 100).toFixed(2);
  e.item.m.sub_total = Number(Number(e.item.m.amount) - Number(e.item.m.discount_amount)).toFixed(2);

  var pAndFInput = '#pAndFInput' + e.item.m.item_index;
  var temp_p_and_f_charges = $(pAndFInput).val();
  if (isNaN(temp_p_and_f_charges)) {
    temp_p_and_f_charges = 0;
  }
  var p_and_f_charges = Number(temp_p_and_f_charges).toFixed(2);
  e.item.m.p_and_f_charges = p_and_f_charges; //P&F Charges

  var sub_total = Number(e.item.m.sub_total) + Number(e.item.m.p_and_f_charges); //amount after P&F
  console.log(sub_total);

  /*duty start*/
  var duty = 0;
  var dutyArray = [];
  dutyArray = e.item.m.duties;

  dutyArray.map(function (i) {
    if (i.duty_rate != '') {
      i.duty = Number(Number(sub_total) * Number(i.duty_rate) / 100).toFixed(2);
      duty = Number(Number(sub_total) * Number(i.duty_rate) / 100).toFixed(2);
    }
  });
  e.item.m.amount_after_duty = Number(Number(sub_total) + Number(duty)).toFixed(2);
  /*duty end*/

  /*taxOne start*/
  var tax_one = 0;
  var taxOneArray = [];
  taxOneArray = e.item.m.taxone;

  taxOneArray.map(function (i) {
    if (i.tax_one_rate != '') {
      i.tax_one = Number(Number(e.item.m.amount_after_duty) * Number(i.tax_one_rate) / 100).toFixed(2);
      tax_one = Number(Number(e.item.m.amount_after_duty) * Number(i.tax_one_rate) / 100).toFixed(2);
    }
  });
  /*taxOne end*/

  /*taxTwo start*/
  var tax_two = 0;
  var taxTwoArray = [];
  taxTwoArray = e.item.m.taxtwo;

  taxTwoArray.map(function (i) {
    if (i.tax_two_rate != '') {
      i.tax_two = Number(Number(e.item.m.amount_after_duty) * Number(i.tax_two_rate) / 100).toFixed(2);
      tax_two = Number(Number(e.item.m.amount_after_duty) * Number(i.tax_two_rate) / 100).toFixed(2);
    }
  });
  /*taxTwo end*/

  /*cess start*/
  var cess = 0;
  var cessArray = [];
  cessArray = e.item.m.cess;

  cessArray.map(function (i) {
    if (i.cess_rate != '') {
      i.cess = Number(Number(e.item.m.amount_after_duty) * Number(i.cess_rate) / 100).toFixed(2);
      cess = Number(Number(e.item.m.amount_after_duty) * Number(i.cess_rate) / 100).toFixed(2);
    }
  });
  /*cess end*/

  /*other Charges Start*/
  var otherChargesInput = '#otherChargesInput' + e.item.m.item_index;
  var temp_other_charges = $(otherChargesInput).val();
  if (isNaN(temp_other_charges)) {
    temp_other_charges = 0;
  }
  var other_charges = Number(temp_other_charges).toFixed(2);
  e.item.m.other_charges = other_charges;
  /*other Charges End*/

  e.item.m.total = Number(Number(e.item.m.amount_after_duty) + Number(tax_one) + Number(tax_two) + Number(cess) + Number(other_charges)).toFixed(2); //total
  console.log(e.item.m.total);

  var docket_subtotal = 0;
  self.materials.map(function (i) {
    docket_subtotal = Number(docket_subtotal) + Number(i.total);
  });
  self.sub_total = Number(docket_subtotal).toFixed(2);
  console.log(self.sub_total);
  self.calculateCharge();
};

self.calculateCharge = function () {
  var total = 0;

  var freight_charge = 0;
  if (isNaN(self.freightChargeInput.value)) {
    freight_charge = 0;
  } else {
    freight_charge = Number(self.freightChargeInput.value).toFixed(2);
  }

  var p_and_f_charge = 0;
  if (isNaN(self.pAndFChargeInput.value)) {
    p_and_f_charge = 0;
  } else {
    p_and_f_charge = Number(self.pAndFChargeInput.value).toFixed(2);
  }

  var delivery_charge = 0;
  if (isNaN(self.deliveryChargeInput.value)) {
    delivery_charge = 0;
  } else {
    delivery_charge = Number(self.deliveryChargeInput.value).toFixed(2);
  }

  var loading_charge = 0;
  if (isNaN(self.loadingChargeInput.value)) {
    loading_charge = 0;
  } else {
    loading_charge = Number(self.loadingChargeInput.value).toFixed(2);
  }

  var packing_charge = 0;
  if (isNaN(self.packingChargeInput.value)) {
    packing_charge = 0;
  } else {
    packing_charge = Number(self.packingChargeInput.value).toFixed(2);
  }

  var courier_charge = 0;
  if (isNaN(self.courierChargeInput.value)) {
    courier_charge = 0;
  } else {
    courier_charge = Number(self.courierChargeInput.value).toFixed(2);
  }

  var round_off_amount = 0;
  if (isNaN(self.roundOffInput.value)) {
    round_off_amount = 0;
  } else {
    round_off_amount = Number(self.roundOffInput.value).toFixed(2);
  }

  self.bill_amount = Number(Number(self.sub_total) + Number(freight_charge) + Number(p_and_f_charge) + Number(delivery_charge) + Number(loading_charge) + Number(packing_charge) + Number(courier_charge) + Number(round_off_amount)).toFixed(2);
};

self.changeRemarks = function (item, e) {
  self.materials.map(function (i) {
    if (item.item_index == i.item_index) {
      var remarksInput = '#remarksInput' + i.item_index;
      i.remarks = $(remarksInput).val();
    }
  });
};

self.removeSelectedMaterial = function (i, e) {
  var tempSelectedMaterialsArray = self.materials.filter(function (c) {
    return c.item_index != i.item_index;
  });
  self.materials = tempSelectedMaterialsArray;
  console.log(self.materials);

  var docket_subtotal = 0;
  self.materials.map(function (i) {
    docket_subtotal = Number(docket_subtotal) + Number(i.total);
  });
  self.sub_total = Number(docket_subtotal).toFixed(2);
  self.calculateCharge();
};

/*docket form values end*/

self.submitDocket = function () {
  //add docket
  if (self.docketDateInput.value == '') {
    toastr.info("Please Enter Docket Date and try again");
    return;
  }

  var str = self.docketDateInput.value;
  var d = str.split("/");
  var docket_date = moment([d[2].trim() + d[1].trim() + d[0].trim()], 'YYYYMMDD');
  var toDay = moment().format('YYYYMMDD');

  var from = moment(docket_date, 'YYYYMMDD');
  var to = moment(toDay, 'YYYYMMDD');
  var differnece = to.diff(from, 'days');
  console.log('differnece' + differnece);

  if (differnece < 0) {
    toastr.error("Docket date can not be greater than today");
    return;
  }

  //po date vs docket date
  if (self.title == 'Add') {
    var str1 = self.details['po_date'];
    var d2 = str1.split("/");
    var po_date = moment([d2[2].trim() + d2[1].trim() + d2[0].trim()], 'YYYYMMDD');
    var pd = moment(po_date, 'YYYYMMDD'); //po_date
    var diff_of_po_docket = pd.diff(from, 'days');

    if (diff_of_po_docket > 0) {
      toastr.error("Docket date can not be less than PO Date");
      return;
    }

    //po date vs bill date
    if (self.billDateInput.value != '') {
      var bstr = self.billDateInput.value;
      var d1 = bstr.split("/");
      var bill_date = moment([d1[2].trim() + d1[1].trim() + d1[0].trim()], 'YYYYMMDD');

      var bd = moment(bill_date, 'YYYYMMDD');
      var dif = pd.diff(bd, 'days');

      if (dif > 0) {
        toastr.error("Bill date can not be leass than PO Date");
        return;
      }
    }

    //po date vs bill date
    if (self.challanDateInput.value != '') {
      var cstr = self.challanDateInput.value;
      var d5 = cstr.split("/");
      var challan_date = moment([d5[2].trim() + d5[1].trim() + d5[0].trim()], 'YYYYMMDD');

      var ch_date = moment(challan_date, 'YYYYMMDD');
      var diff_with_chalan_date = pd.diff(ch_date, 'days');

      if (diff_with_chalan_date > 0) {
        toastr.error("Challan date can not be leass than PO Date");
        return;
      }
    }
  }

  if (self.stockTypeInput.value == '') {
    toastr.info("Please select Stock Type and try again");
    return;
  }
  if (self.partyInput.value == '') {
    toastr.info("Please select Party and try again");
    return;
  }
  /*if (self.purchaseOrderInput.value==''){
    toastr.info("Please select Purchase Order and try again")
    return
  }*/
  if (self.docketNumberInput.value == '') {
    toastr.info("Please Enter Docket Number and try again");
    return;
  }

  if (self.billNumberInput.value == '' && self.billDateInput.value == '' && self.challanDateInput.value == '' && self.challanNumberInput.value == '') {
    toastr.info("Please Enter Bill/Challan Number and Bill/Challan Date");
    return;
  }

  var count = 0;
  var error = '';
  self.materials.map(function (i) {
    count++;

    var temp_qty = Number(i.qty);
    if (isNaN(temp_qty)) {
      temp_qty = 0;
    }

    if (temp_qty == 0) {
      error = error + " Please Enter a valid Docket Qty" + count + ", ";
    }
  });

  if (error != '') {
    toastr.error(error);
    return;
  }

  self.loading = true;
  var obj = {};
  obj['stock_type_code'] = self.stockTypeInput.value;
  obj['party_id'] = self.partyInput.value;
  //obj['po_id']=self.purchaseOrderInput.value
  obj['po_id'] = self.details.po_ids;
  obj['docket_no'] = self.docketNumberInput.value;
  obj['docket_date'] = self.docketDateInput.value;
  obj['bill_no'] = self.billNumberInput.value;
  obj['bill_date'] = self.billDateInput.value;
  obj['challan_no'] = self.challanNumberInput.value;
  obj['challan_date'] = self.challanDateInput.value;
  obj['transporter_name'] = self.transporterNameInput.value;
  obj['transpotation_mode'] = self.modeOfTranspotationInput.value;
  obj['vehicle_no'] = self.vehicleNumberInput.value;
  obj['lr_no'] = self.lrNumberInput.value;
  obj['sub_total_amount'] = self.sub_total;
  obj['freight_charge'] = self.freightChargeInput.value;
  obj['p_and_f_charge'] = self.pAndFChargeInput.value;
  obj['delivery_charge'] = self.deliveryChargeInput.value;
  obj['loading_charge'] = self.loadingChargeInput.value;
  obj['packing_charge'] = self.packingChargeInput.value;
  obj['courier_charge'] = self.courierChargeInput.value;
  obj['round_off_amount'] = self.roundOffInput.value;
  obj['bill_amount'] = self.bill_amount;
  obj['remarks'] = self.docketRemarksInput.value;
  if (self.title == 'Add') {
    RiotControl.trigger('save_docket', self.materials, obj);
  } else if (self.title == 'Edit') {
    console.log("edit docket");
    RiotControl.trigger('edit_docket', self.materials, obj, self.edit_docket_id);
  }
};

self.editDocket = function (d, e) {
  self.loading = true;
  self.title = 'Edit';
  self.bill_amount = '';
  self.edit_docket_id = d.docket_id;
  RiotControl.trigger('read_docket_details_edit', d.docket_id, d.po_id);
};

self.deleteDocket = function (d, e) {
  self.delete_docket_id = d.docket_id;
  $("#deleteDocketModal").modal('show');
};
self.confirmDeleteDocket = function (d, e) {
  self.loading = true;
  RiotControl.trigger('delete_docket', self.delete_docket_id, self.dockets);
};

self.clearData = function () {
  self.update();
  self.purchaseOrders = [];
  self.materials = [];
  self.stockTypeInput.value = '';
  self.partyInput.value = '';
  //self.purchaseOrderInput.value=''
  self.docketNumberInput.value = '';
  self.docketDateInput.value = '';
  self.billNumberInput.value = '';
  self.billDateInput.value = '';
  self.challanNumberInput.value = '';
  self.challanDateInput.value = '';
  self.transporterNameInput.value = '';
  self.modeOfTranspotationInput.value = '';
  self.vehicleNumberInput.value = '';
  self.lrNumberInput.value = '';

  self.sub_total = '';
  self.freightChargeInput.value = '';
  self.pAndFChargeInput.value = '';
  self.deliveryChargeInput.value = '';
  self.loadingChargeInput.value = '';
  self.packingChargeInput.value = '';
  self.courierChargeInput.value = '';
  self.roundOffInput.value = '';
  self.bill_amount = '';
  self.docketRemarksInput.value = '';
};

self.filterDockets = function () {
  if (!self.searchDocket) return;
  self.filteredDockets = self.dockets.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchDocket.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredDockets, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page);
};

/*method change callback from store*/
RiotControl.on('stock_types_details_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('parties_changed', function (parties) {
  self.parties = parties;
  self.update();
});

RiotControl.on('locations_changed', function (locations) {
  self.locations = locations;
  self.update();
});

RiotControl.on('read_po_for_docket_changed', function (purchaseOrders, docket_no) {
  self.loading = false;
  self.purchaseOrders = purchaseOrders;
  if (self.purchaseOrders.length == 0) {
    toastr.info("No purchase order found");
  }
  self.docketNumberInput.value = docket_no;
  self.update();
});

RiotControl.on('read_material_changed', function (material) {
  console.log(material);
  self.loading = false;
  self.update();
  self.dutyHeaders = [];
  self.dutyHeaders = material.dutyHeaders;

  self.taxOneHeaders = [];
  self.taxOneHeaders = material.taxOneHeaders;

  self.taxTwoHeaders = [];
  self.taxTwoHeaders = material.taxTwoHeaders;

  self.cessHeaders = [];
  self.cessHeaders = material.cessHeaders;

  self.materials = [];
  self.materials = material.materials;
  self.details = material.details;

  self.colspan = self.details['colspan'];
  self.partyInput.value = self.details['party_id'];
  self.update();
  self.materials.map(function (i) {
    //location
    var locationInput = '#locationInput' + i.item_index;
    console.log(locationInput);
    console.log(i.location);
    $(locationInput).val(i.location);
  });
});

RiotControl.on('docket_save_changed', function () {
  self.loading = false;
  self.docket_view = 'docket_home';
  self.clearData();
  self.update();
});

RiotControl.on('read_docket_changed', function (dockets) {
  self.loading = false;
  self.dockets = [];
  self.dockets = dockets;
  self.filteredDockets = dockets;

  self.paginate(self.filteredDockets, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page);
  self.update();
});

RiotControl.on('read_docket_details_changed', function (dockets) {
  self.loading = false;
  self.docket_view = 'docket_view';

  self.docketDetails = [];
  self.docketDetails = dockets.details;

  self.materialsView = [];
  self.materialsView = dockets.items;

  self.dutyHeadersView = [];
  self.dutyHeadersView = dockets.dutyHeaders;

  self.taxOneHeadersView = [];
  self.taxOneHeadersView = dockets.taxOneHeaders;

  self.taxTwoHeadersView = [];
  self.taxTwoHeadersView = dockets.taxTwoHeaders;

  self.cessHeadersView = [];
  self.cessHeadersView = dockets.cessHeaders;
  console.log(self.docketDetails['other_charges']);

  if (self.docketDetails['other_charges']) {
    self.colspanView = 9;
  } else {
    self.colspanView = 8;
  }

  if (self.docketDetails['p_and_f_charges']) {
    self.colspanView = self.colspanView + 1;
  }

  self.colspanView = self.colspanView + self.dutyHeadersView.length + self.taxOneHeadersView.length + self.taxTwoHeadersView.length + self.cessHeadersView.length;

  self.update();
});

RiotControl.on('read_docket_details_edit_changed', function (dockets) {
  self.docket_view = 'docket_entry';
  self.loading = false;
  self.purchaseOrders = [];
  self.purchaseOrders = dockets.purchaseOrders;

  self.dutyHeaders = [];
  self.dutyHeaders = dockets.dutyHeaders;

  self.taxOneHeaders = [];
  self.taxOneHeaders = dockets.taxOneHeaders;

  self.taxTwoHeaders = [];
  self.taxTwoHeaders = dockets.taxTwoHeaders;

  self.cessHeaders = [];
  self.cessHeaders = dockets.cessHeaders;

  self.materials = [];
  self.materials = dockets.items;

  console.log(self.materials);

  self.colspan = 13;
  self.colspan = self.colspan + self.dutyHeaders.length + self.taxOneHeaders.length + self.taxTwoHeaders.length + self.cessHeaders.length;

  self.stockTypeInput.value = dockets.details.stock_type_code;
  self.partyInput.value = dockets.details.party_id;
  //self.purchaseOrderInput.value=dockets.details.po_id
  self.docketNumberInput.value = dockets.details.docket_no;
  self.docketDateInput.value = dockets.details.docket_date;
  self.billNumberInput.value = dockets.details.bill_no;
  self.billDateInput.value = dockets.details.bill_date;
  self.challanNumberInput.value = dockets.details.challan_no;
  self.challanDateInput.value = dockets.details.challan_date;
  self.transporterNameInput.value = dockets.details.transporter_name;
  self.modeOfTranspotationInput.value = dockets.details.transpotation_mode;
  self.vehicleNumberInput.value = dockets.details.vehicle_no;
  self.lrNumberInput.value = dockets.details.lr_no;
  self.sub_total = dockets.details.sub_total_amount;

  self.freightChargeInput.value = dockets.details.freight_charge;
  self.pAndFChargeInput.value = dockets.details.p_and_f_charge;
  self.deliveryChargeInput.value = dockets.details.delivery_charge;
  self.loadingChargeInput.value = dockets.details.loading_charge;
  self.packingChargeInput.value = dockets.details.packing_charge;
  self.courierChargeInput.value = dockets.details.courier_charge;
  self.roundOffInput.value = dockets.details.round_off_amount;

  self.bill_amount = dockets.details.bill_amount;
  self.docketRemarksInput.value = dockets.details.remarks;

  self.details = dockets.details;

  self.update();
  //self.purchaseOrderInput.value=dockets.details.po_id
  self.materials.map(function (i) {
    //location
    var locationInput = '#locationInput' + i.item_index;
    $(locationInput).val(i.location);
  });

  self.purchaseOrders.map(function (i) {
    var selectPOInput = '#selectPOInput' + i.po_id;
    $(selectPOInput).prop("disabled", true);
    $(selectPOInput).prop("checked", true);
  });
  $(readDetailsButton).prop("disabled", true);

  $("#docketDateInput").prop("disabled", true);

  console.log('self.materials');
  console.log(self.materials);

  self.update();
});

RiotControl.on('read_docket_details_edit_error_changed', function (dockets) {
  toastr.error("Edit not allowed, Items of this docket present in Return To Party");
  self.loading = false;
  self.update();
});

RiotControl.on('delete_docket_changed', function (dockets) {
  self.loading = false;
  $("#deleteDocketModal").modal('hide');
  self.docket_view = 'docket_home';
  self.dockets = [];
  self.dockets = dockets;
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredDockets, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredDockets, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});
riot.tag2('financial-year-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Financial Year</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchFinancialYear" class="form-control" placeholder="search" onkeyup="{filterFinancialYears}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshFinancialYears}"><i class="material-icons">refresh</i></button> <button class="btn btn-secondary" __disabled="{loading}" onclick="{showFinancialYearModal}"><i class="material-icons">add</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Financial Year Start Date</th> <th>Financial Year End Date</th> <th>status</th> <th></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{cat.start_date}</td> <td>{cat.end_date}</td> <td>{cat.status}</td> <td> <div class="table-buttons" hide="{cat.confirmDelete ||  cat.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit.bind(this, cat)}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{activateFinancialYear.bind(this, cat)}"><i class="material-icons">check_circle</i></button> </div> <div class="table-buttons" if="{cat.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot> <tr> <td colspan="5"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> <div class="modal fade" id="financialYearModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">{title} Financial Year</h4> </div> <div class="modal-body"> <div class="form-group row"> <label for="startDateInput" class="col-xs-4 col-form-label">Start Date</label> <div class="col-xs-8"> <input class="form-control" type="text" id="startDateInput" placeholder="DD/MM/YYYY"> </div> </div> <div class="form-group row"> <label for="endDateInput" class="col-xs-4 col-form-label">End Date</label> <div class="col-xs-8"> <input class="form-control" type="text" id="endDateInput" placeholder="DD/MM/YYYY"> </div> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{save}">Save changes</button> </div> </div> </div> </div> <div class="modal fade" id="financialYearActivateModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Financial Year Activate</h4> </div> <div class="modal-body"> <h4>Are you sure to activat this financial year</h4> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{saveActivateFinancialYear}">Save changes</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.update();
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_financial_year');
});

self.refreshFinancialYears = function () {
  self.financialYears = [];
  self.searchFinancialYear.value = '';
  RiotControl.trigger('read_financial_year');
};

self.filterFinancialYears = function () {
  if (!self.searchFinancialYear) return;
  self.filteredFinancialYears = self.financialYears.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchFinancialYear.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredFinancialYears, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredFinancialYears, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.financialYears.map(function (c) {
    if (c.id != e.item.cat.id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_financial_year', e.item.cat.id);
};

self.edit = function (t, e) {
  self.title = 'Edit';
  $("#financialYearModal").modal('show');

  self.startDateInput.value = t.start_date;
  self.endDateInput.value = t.end_date;
  self.id = t.id; // id to update the item
};
self.activateFinancialYear = function (t, e) {
  $("#financialYearActivateModal").modal('show');
  self.activate_financial_year_id = t.id;
};
self.saveActivateFinancialYear = function () {
  RiotControl.trigger('activate_financial_year', self.activate_financial_year_id);
};

self.save = function () {

  if (!self.startDateInput.value) {
    toastr.info("Please enter a valid Financial Year Start Date and try again");
  } else if (!self.endDateInput.value) {
    toastr.info("Please enter a valid Financial Year End Date and try again");
  } else if (self.title == 'Add') {
    //add data to database after validation
    self.loading = true;
    RiotControl.trigger('add_financial_year', self.startDateInput.value, self.endDateInput.value);
  } else if (self.title == 'Edit') {
    self.loading = true;
    RiotControl.trigger('edit_financial_year', self.id, self.startDateInput.value, self.endDateInput.value);
  }
};

self.cancelOperation = function (e) {
  self.financialYears.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

self.showFinancialYearModal = function () {
  self.title = 'Add';
  $("#financialYearModal").modal('show');
  self.update();
  dateFormat('startDateInput');
  dateFormat('endDateInput');
};

RiotControl.on('financial_years_changed', function (financialYears) {
  $("#financialYearModal").modal('hide');
  self.startDateInput.value = '';
  self.endDateInput.value = '';
  self.loading = false;
  self.financialYears = financialYears;
  self.filteredFinancialYears = financialYears;

  self.items_per_page = 10;
  self.paginate(self.filteredFinancialYears, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredFinancialYears, 1, self.items_per_page);
  self.update();
});

RiotControl.on('activate_financial_year_changed', function () {
  $("#financialYearActivateModal").modal('hide');
  self.refreshFinancialYears();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredFinancialYears, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredFinancialYears, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredFinancialYears, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('home', '<div class="row"> <div class="col-sm-4 offset-sm-4"> <div class="login-box"> <div class="login-card card card-block bg-faded"> <h1 class="card-title">Login</h1> <div class="card-text"> <form onsubmit="{login}"> <div class="form-group"> <label>Username</label> <input type="text" class="form-control" name="username" required onkeyup="{loginProcess}"> </div> <div class="form-group"> <label>Password</label> <input type="password" class="form-control" name="password" required onkeyup="{loginProcess}"> </div> <div class="form-group"> <button class="btn btn-primary w-100" id="loginButton">Login</button> </div> <div class="alert alert-warning" role="alert" if="{login_warning}"> <strong>Oops!</strong> Please enter both username and password and try again. </div> </form> </div> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.login_warning = false;
self.on('mount', function () {
  RiotControl.trigger('login_init');
  $('#loginButton').prop('disabled', true);
  self.update();
});

RiotControl.on('login_changed', function (login_status) {
  console.log("Changed");
  if (login_status.role && login_status.role != 'FAIL') {
    riot.route("/masters/department-master");
  }
});

self.login = function (e) {
  if (!self.username.value || !self.password.value) {
    self.login_warning = true;
  }
  RiotControl.trigger('check_login', self.username.value, self.password.value);
};

self.loginProcess = function () {

  if (self.username.value == '') {
    $('#loginButton').prop('disabled', true);
  } else {
    if (self.password.value == '') {
      $('#loginButton').prop('disabled', true);
    } else {
      $('#loginButton').prop('disabled', false);
    }
  }
  self.update();
};
});

riot.tag2('indent-date-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Indent Date Wise</h4> <div show="{indent_date_wise ==\'indent_date_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="indentRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="indentRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="indentRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="indentRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="selectIndentStatus">Status</label> <select name="selectIndentStatus" class="form-control"> <option value=""></option> <option value="P">Pending</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIndent}" id="gobtn">Go</button> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{indent_date_wise ==\'indent_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Indent (Date Wise)<br> From {indentFrom} To {indentTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Indent Date: <b>{m.date}</b></h5> <div each="{d, j in m.indents}"> <table class="table print-small"> <tr> <td>Indent No: <b>{d.indentDetails.stock_type_code}-{d.indentDetails.indent_no}</b></td> <td>Indent Date: <b>{d.indentDetails.indent_date}</b></td> <td>Indent Type: <b>{d.indentDetails.indent_type}</b></td> </tr> <tr> <td>Department: <b>{d.indentDetails.department}</b></td> <td>Prepared By: <b>{d.indentDetails.requested_by}</b></td> <td>Status: <b>{d.indentDetails.status}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th class="serial-col"><strong>Sl</strong></th> <th>Material</th> <th>UOM</th> <th>Qty</th> <th>Unit Value</th> <th>Total Value</th> <th>Delivery Date</th> <th>Stock</th> <th>LP Price</th> <th>LP Qty</th> <th>LP Docket</th> <th>LP Party</th> <th>Remarks</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{i+1}</td> <td>{t.item_name}-(Code No:{t.item_id})</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.unit_value}</td> <td style="text-align:right">{t.total_value}</td> <td>{t.delivery_date}</td> <td style="text-align:right">{t.stock}</td> <td style="text-align:right">{t.lp_price}</td> <td style="text-align:right">{t.lp_qty}</td> <td>{t.stock_type_code}-{t.docket_no}</td> <td>{t.party_name}</td> <td>{t.remarks}</td> </tr> </table> </div> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td style="text-align:right">Grand Total Qty</td> <td style="text-align:right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Value</td> <td style="text-align:right">{item_value_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('indentRegisterDateWiseStartDateInput');
  dateFormat('indentRegisterDateWiseEndDateInput');
  self.indent_date_wise = 'indent_date_wise_home';
  self.update();
});

self.setStartDate = function () {
  self.sd = self.indentRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.indentRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.indent_date_wise = 'indent_date_wise_home';
};

self.readIndent = function () {
  if (self.indentRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.indentRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }
  if (!self.selectIndentStatus.value) {
    toastr.info("Please select Indent Status and try again");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_indent_date_wise', self.indentRegisterDateWiseStartDateInput.value, self.indentRegisterDateWiseEndDateInput.value, self.selectIndentStatus.value);
};

RiotControl.on('read_indent_date_wise_changed', function (mainArray, qty_grand_total, item_value_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.item_value_grand_total = item_value_grand_total;
  self.indent_date_wise = 'indent_date_wise_report';
  self.indentFrom = self.indentRegisterDateWiseStartDateInput.value;
  self.indentTo = self.indentRegisterDateWiseEndDateInput.value;
  self.update();
});
});

riot.tag2('indent-item-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Indent (Item Wise)</h4> <div show="{indent_item_wise ==\'indent_item_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentStatus">Status</label> <select name="selectIndentStatus" class="form-control"> <option value=""></option> <option value="P">Pending</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReturn}" id="gobtn">Go</button> </div> </div> </div> <div class="row"> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{indent_item_wise ==\'indent_item_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Indent (Item Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Item: <b>{m.item}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Indent Date</th> <th>Indent Type</th> <th>Indent No</th> <th>Department</th> <th>Material Code</th> <th>Material</th> <th>UOM</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Remarks</th> <th>Stock</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.indent_date}</td> <td>{t.indent_type}</td> <td>{t.stock_type_code}-{t.indent_no}</td> <td>{t.department}</td> <td>{t.item_id}</td> <td>{t.item_name}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.unit_value}</td> <td style="text-align:right">{t.total_value}</td> <td>{t.remarks}</td> <td>{t.stock}</td> </tr> </table> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td style="text-align:right">Grand Total Qty</td> <td style="text-align:right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Amount</td> <td style="text-align:right">{item_value_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.indent_item_wise = 'indent_item_wise_home';
  self.loading = true;
  RiotControl.trigger('read_items_filter');
  self.update();
});

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.indent_item_wise = 'indent_item_wise_home';
};

self.readReturn = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_indent_item_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, self.selectIndentStatus.value, selected_item_id);
};

RiotControl.on('read_indent_item_wise_changed', function (mainArray, qty_grand_total, item_value_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.item_value_grand_total = item_value_grand_total;
  self.indent_item_wise = 'indent_item_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.loading = false;
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('indent-report', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Indent Report</h4> <div show="{indent_report ==\'indent_report_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="indentRegisterReportStartDateInput">Start Date</label> <input type="text" class="form-control" id="indentRegisterReportStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="indentRegisterReportEndDateInput">End Date</label> <input type="text" class="form-control" id="indentRegisterReportEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="selectIndentStatus">Status</label> <select name="selectIndentStatus" class="form-control" onchange="{setStatus}"> <option value=""></option> <option value="P">Pending</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIndent}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <a href="csv/indent_report_csv.php?start_date={sd}&end_date={ed}&status={status}" target="_blank" class="btn btn-default text-right"><img src="img/excel.png" style="height:30px;margin-top: 23px;"></a> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{indent_report ==\'indent_report_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Indent<br> From {indentFrom} To {indentTo}</div> <br> </center> <table class="table table-bordered bill-info-table print-small"> <tr> <th class="serial-col"><strong>Sl</strong></th> <th>Indent Date</th> <th>Indent Type</th> <th>Indent No</th> <th>Department</th> <th>Material Code</th> <th>Material</th> <th>UOM</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Remarks</th> <th>Stock</th> </tr> <tr each="{t, k in mainArray}" no-reorder> <td>{k+1}</td> <td>{t.indent_date}</td> <td>{t.indent_type}</td> <td>{t.stock_type_code}-{t.indent_no}</td> <td>{t.department}</td> <td>{t.item_id}</td> <td>{t.item_name}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.unit_value}</td> <td style="text-align:right">{t.total_value}</td> <td>{t.remarks}</td> <td>{t.stock}</td> </tr> <tr> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td style="text-align:right">Grand Total Qty</td> <td style="text-align:right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Amount</td> <td style="text-align:right">{item_value_grand_total}</td> <td>{t.remarks}</td> <td>{t.stock}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('indentRegisterReportStartDateInput');
  dateFormat('indentRegisterReportEndDateInput');
  self.indent_report = 'indent_report_home';
  self.update();
});

self.setStartDate = function () {
  self.sd = self.indentRegisterReportStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.indentRegisterReportEndDateInput.value;
};

self.setStatus = function () {
  self.status = self.selectIndentStatus.value;
};

self.closeReport = function () {
  self.indent_report = 'indent_report_home';
};

self.readIndent = function () {
  if (self.indentRegisterReportStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.indentRegisterReportEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }
  if (!self.selectIndentStatus.value) {
    toastr.info("Please select Indent Status and try again");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_indent_report', self.indentRegisterReportStartDateInput.value, self.indentRegisterReportEndDateInput.value, self.selectIndentStatus.value);
};

RiotControl.on('read_indent_report_changed', function (mainArray, qty_grand_total, item_value_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.item_value_grand_total = item_value_grand_total;
  self.indent_report = 'indent_report_report';
  self.indentFrom = self.indentRegisterReportStartDateInput.value;
  self.indentTo = self.indentRegisterReportEndDateInput.value;
  self.update();
});
});

riot.tag2('indents', '<loading-bar if="{loading}"></loading-bar> <div show="{indent_view ==\'indent_home\'}"> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <div class="form-group row"> <h1 for="selectIndentStatus" class="col-xs-3 col-form-label">Indent</h1> <div class="col-xs-9" style="padding-top: 12px;"> <select name="selectIndentStatus" onchange="{refreshIndents}" class="form-control"> <option value=""></option> <option value="A">Approved</option> <option value="P">Pending</option> <option value="R">Rejected</option> <option value="F">Finalized</option> <option value="all">All</option> </select> </div> </div> </div> <div class="col-sm-6 text-xs-right" style="padding-top: 12px;"> <div class="form-inline"> <input type="search" name="searchIndent" class="form-control" placeholder="search" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshIndents}"><i class="material-icons">refresh</i></button> <button class="btn btn-secondary" __disabled="{loading}" onclick="{showIndentModal}"><i class="material-icons">add</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr> <th class="serial-col">Sl</th> <th>Indent No</th> <th>Indent Date</th> <th>Department</th> <th>Stock Type</th> <th>Indent Type</th> <th>Status</th> <th>Approved By</th> <th>Finalized By</th> <th style="width:175px"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{cat.stock_type_code}-{cat.indent_no}</td> <td>{cat.indent_date}</td> <td>{cat.department}</td> <td>{cat.stock_type}</td> <td>{cat.indent_type_view}</td> <td>{cat.status}</td> <td>{cat.approved_by}</td> <td>{cat.finalized_by}</td> <td> <div class="table-buttons" hide="{cat.confirmDelete ||  cat.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" hide="{cat.status==\'F\'}" onclick="{editIndentStatus.bind(this, cat)}"><i class="material-icons">build</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{viewIndent.bind(this, cat)}"><i class="material-icons">visibility</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit.bind(this, cat)}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{cat.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="10"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{indent_view ==\'add_indent\'}"> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"><h4>{title} Indent</h4></div> <div class="col-sm-6"> <button class="btn btn-secondary pull-sm-right" onclick="{closeAddIndent}"><i class="material-icons">close</i></button> </div> </div> <form> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label for="indentDateInput">Indent Date</label> <input type="text" class="form-control" id="indentDateInput" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="departmentInput">Department</label> <select id="departmentInput" class="form-control"> <option each="{departments}" value="{department_code}">{department}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="stockTypeInput">Stock Type</label> <select id="stockTypeInput" name="stockTypeInput" class="form-control" onchange="{changeStockType}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="indentTypeInput">Indent Type</label> <select id="indentTypeInput" class="form-control"> <option value="N">Normal</option> <option value="U">Urgent</option> <option value="VU">Very Urgent</option> </select> </div> </div> </div> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter">Item Group</label> <input id="selectItemGroupFilter" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px" disabled> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="searchMaterialInput">Search Material</label> <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{getMaterialForIndent}" style="margin-top: 32px;">Get Material</button> </div> </div> </div> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label>Indent No: </label>{indent_no_add} </div> </div> </div> <div class="row"> <table class="table table-bordered"> <tr> <th class="serial-col">Sl</th> <th>Material</th> <th>UOM</th> <th>Qty</th> <th>Unit Value</th> <th>Total Value</th> <th>Delivery Date</th> <th>Stock</th> <th>LP Price</th> <th>LP Party</th> <th>LP Qty</th> <th>Remarks</th> <th></th> </tr> <tr each="{cat, i in selectedMaterialsArray}"> <td>{i+1}</td> <td>{cat.item_name}</td> <td>{cat.uom_code}</td> <td> <input type="text" id="{\'qtyInput\' + cat.item_id}" value="{cat.qty}" onkeyup="{calculateTotalValue.bind(this,cat)}" class="form-control"> </td> <td> <input type="text" id="{\'unitValueInput\' + cat.item_id}" value="{cat.unit_value}" onkeyup="{calculateTotalValue.bind(this,cat)}" class="form-control"> </td> <td>{cat.total_value}</td> <td> <input type="text" id="{\'deliveryDateInput\' + cat.item_id}" value="{cat.delivery_date}" class="form-control" placeholder="DD/MM/YYYY"> </td> <td>{cat.stock}</td> <td>{cat.lp_price}</td> <td>{cat.party_name}</td> <td>{cat.lp_qty}</td> <td> <input type="text" id="{\'remarksInput\' + cat.item_id}" value="{cat.remarks}" class="form-control"> </td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeSelectedMaterial.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </form> <div class="col-sm-12"> <button type="button" class="btn btn-primary pull-sm-right" onclick="{save}">Save changes</button> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closeAddIndent}" style=" margin-right: 10px;">Close</button> </div> </div> </div> <div show="{indent_view ==\'view_indent\'}" class="container-fluid print-box"> <center> <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> Indent Details<br><br> </center> <div class="row"> <table class="table table-bordered bill-info-table"> <tr> <th>Indent No</th> <td>{view_indent_details.stock_type_code}-{view_indent_details.indent_no}</td> <th style="width:150px;">Indent Date</th> <td>{view_indent_details.indent_date}</td> </tr> <tr> <th>Stock Type</th> <td>{view_indent_details.stock_type}</td> <th>Indent Type</th> <td>{view_indent_details.indent_type}</td> <tr> <tr> <th>Department</th> <td>{view_indent_details.department}</td> </tr> </table> </div> <div class="row"> <table class="table table-bordered bill-info-table print-small"> <tr> <th class="serial-col"><strong>Sl</strong></th> <th><strong>Material</strong></th> <th><strong>UOM</strong></th> <th><strong>Qty</strong></th> <th><strong>Unit Value</strong></th> <th><strong>Total Value</strong></th> <th><strong>Delivery Date</strong></th> <th><strong>Stock</strong></th> <th><strong>LP Price</strong></th> <th><strong>LP Qty</strong></th> <th><strong>LP Docket</strong></th> <th><strong>LP Party</strong></th> <th><strong>Remarks</strong></th> </tr> <tr each="{vm, i in viewMaterialsArray}"> <td>{i+1}</td> <td>{vm.item_name}-(Code No:{vm.item_id})</td> <td>{vm.uom_code}</td> <td>{vm.qty}</td> <td>{vm.unit_value}</td> <td>{vm.total_value}</td> <td>{vm.delivery_date}</td> <td>{vm.stock}</td> <td>{vm.lp_price}</td> <td>{vm.lp_qty}</td> <td>{vm.stock_type_code}-{vm.docket_no}</td> <td>{vm.party_name}</td> <td>{vm.remarks}</td> </tr> </table> </div> <br><br> <table class="table indent-footer"> <tr> <td><center style="height:21px">{view_indent_details.requested_by}</center><div><center>Prepared By</center></div></td> <td><center style="height:21px"></center><div><center>Indent By</center></div></td> <td><center style="height:21px">{view_indent_details.approved_by}</center><div><center>Approved By</center></div></td> </tr> </table> <div class="col-sm-12 no-print"> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closeviewIndent}" style=" margin-right: 10px;">Close</button> </div> </div> <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Select Materiala</h4> <div class="text-xs-right form-inline"> <input type="search" name="searchMaterials" class="form-control" placeholder="search" onkeyup="{filterMaterials}" style="width:200px"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterial}">Submit</button> </div> </div> <div class="modal-body"> <table class="table table-bordered"> <tr> <th class="serial-col">Sl</th> <th style="width:75px"></th> <th>Material</th> <th>Group</th> </tr> <tr each="{it, i in pagedDataMaterials}" no-reorder> <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td> <td><input type="checkbox" class="form-control" __checked="{it.selected}" onclick="{parent.toggle}"></td> <td>{it.item_name}-(Code:{it.item_id})</td> <td>{it.item_group}</td> </tr> <tfoot class="no-print"> <tr> <td colspan="10"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPageNew}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select_new" onchange="{changePageNew}"> <option each="{pno in page_array_new}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterial}">Submit</button> </div> </div> </div> </div> <div class="modal fade" id="indentStatusModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Change Indent Status</h4> </div> <div class="modal-body"> <form> <div class="form-group"> <label for="indentStatusInput">Status</label> <select id="indentStatusInput" class="form-control"> <option value=""></option> <option each="{indentStatusArray}" value="{status_value}">{status}</option> </select> </div> <div class="form-group"> <label for="statusChangeDateInput">Date</label> <input type="text" id="statusChangeDateInput" class="form-control" placeholder="DD/MM/YYYY"> </div> <div class="form-group"> <label>Authority Name</label> <input type="text" id="statusChangeAuthorityNameInput" class="form-control" disabled> </div> <div class="form-group"> <label for="statusChnageRemarkInput">Remarks</label> <input type="text" id="statusChnageRemarkInput" class="form-control"> </div> </form> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{saveIndentStatus}">Save changes</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.items_per_page = 10;
  RiotControl.trigger('login_init');
  RiotControl.trigger('read_departments_for_indent');
  RiotControl.trigger('read_stock_types');

  RiotControl.trigger('read_item_groups');
  //RiotControl.trigger('read_categories')
  //RiotControl.trigger('read_uoms')
  //RiotControl.trigger('read_parties')
  RiotControl.trigger('fetch_user_details_from_session_for_indent');
  self.indent_view = 'indent_home';
  self.selectedMaterialsArray = [];
  self.indentStatusArray = [{ status_value: "A", status: "Approved" }, { status_value: "P", status: "Pending" }, { status_value: "R", status: "Rejected" }, { status_value: "F", status: "Finalized" }];

  $(document).keypress(function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      console.log('no action');
      return false;
    }
  });

  /*$("#departmentInput").on("focus",function() {
      $("#departmentInput").simulate('mousedown');
  });
   $("#stockTypeInput").on("focus",function() {
      $("#stockTypeInput").simulate('mousedown');
  });
   $("#indentTypeInput").on("focus",function() {
      $("#indentTypeInput").simulate('mousedown');
  }); */
});

self.changeStockType = function () {
  if (self.title == 'Add') {
    self.selectStockTypeFilter.value = self.stockTypeInput.value;
  }
  RiotControl.trigger('read_indent_no', self.stockTypeInput.value);
};

self.getMaterialForIndent = function () {
  self.materials = [];
  if (self.searchMaterialInput.value == '') {
    if (self.selectItemGroupFilter.value == '') {
      toastr.info("Please select Item Group and try again");
      return;
    }
    if (self.selectStockTypeFilter.value == '') {
      toastr.info("Please select Stock Type and try again");
      return;
    }
    self.loading = true;
    RiotControl.trigger('read_items_for_indent', self.selected_item_group_code, self.selectStockTypeFilter.value);
  } else {
    if (self.selectStockTypeFilter.value == '') {
      toastr.info("Please select Stock Type and try again");
      return;
    }
    self.loading = true;
    RiotControl.trigger('search_items_for_indent', self.searchMaterialInput.value, self.selectStockTypeFilter.value);
  }
};

self.toggle = function (e) {
  var item = e.item.it;
  item.selected = !item.selected;

  /*updating selected materials*/
  /*self.materials = self.materials.map(m => {
    if(m.item_id == item.it.item_id){
     m.item_id=m.item_id
     m.item_name=m.item_name
     m.item_group_code=m.item_group_code
     m.uom_code=m.uom_code
     m.uom_id=m.uom_id
     m.uom=m.uom
     m.max_level=m.max_level
     m.reorder_level=m.reorder_level
     m.item_description=m.item_description
     m.category_code=m.category_code
     m.stock_type_code=m.stock_type_code
     m.min_level=m.min_level
     m.reorder_qty=m.reorder_qty
     m.stock=m.stock
     m.selected=item.selected
      m.qty=''
     m.unit_value=''
     m.total_value=''
     m.delivery_date=''
     m.party=''
     m.remarks=''
     }
    m.confirmEdit = false
    return m
  })
  return true*/
};

self.selectedMaterial = function () {
  self.materials.map(function (m) {
    if (m.selected) {
      self.selectedMaterialsArray.push(m);
    }
  });

  $("#itemModal").modal('hide');
  self.update();

  // date element formating
  self.selectedMaterialsArray.map(function (m) {
    var deliveryDateInput = 'deliveryDateInput' + m.item_id;
    dateFormat(deliveryDateInput);
  });
};

self.removeSelectedMaterial = function (i, e) {
  var tempSelectedMaterialsArray = self.selectedMaterialsArray.filter(function (c) {
    return c.item_id != i.item_id;
  });

  self.selectedMaterialsArray = tempSelectedMaterialsArray;
};

self.calculateTotalValue = function (item, e) {
  self.selectedMaterialsArray.map(function (i) {
    if (item.item_id == i.item_id) {
      var unitValueInput = '#unitValueInput' + i.item_id;
      var qtyInput = '#qtyInput' + i.item_id;

      i.total_value = Number(Number($(unitValueInput).val()) * Number($(qtyInput).val())).toFixed(2);
      i.qty = $(qtyInput).val();
      i.unit_value = $(unitValueInput).val();
    }
  });
  //console.log(self.selectedMaterialsArray)
};

self.refreshIndents = function () {
  if (!self.selectIndentStatus.value) {
    toastr.info("Please select Indent Status and try again");
    return;
  }
  self.indents = [];
  //self.searchIndent.value=''
  self.loading = true;
  RiotControl.trigger('read_indents', self.selectIndentStatus.value, self.searchIndent.value);
};

/*self.filterIndentes = () => {
  if(!self.searchIndent) return
  self.filteredIndents = self.indents.filter(c => {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchIndent.value.toLowerCase())>=0
  })
   self.paginate(self.filteredIndents, self.items_per_page)
  self.pagedDataItems = self.getPageData(self.filteredIndents, 1, self.items_per_page)
}*/

self.confirmDelete = function (e) {
  self.indents.map(function (c) {
    if (c.indent_id != e.item.cat.indent_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_indent', e.item.cat.indent_id);
};

self.edit = function (t, e) {
  self.title = 'Edit';
  RiotControl.trigger('read_edit_indents', t.indent_id);
  self.edit_indent_id = t.indent_id;
};

self.save = function () {
  if (!self.indentDateInput.value) {
    toastr.info("Please enter a indent date");
    return;
  }

  var str = self.indentDateInput.value;
  var d = str.split("/");
  var indent_date = moment([d[2].trim() + d[1].trim() + d[0].trim()], 'YYYYMMDD');
  var toDay = moment().format('YYYYMMDD');

  var from = moment(indent_date, 'YYYYMMDD');
  var to = moment(toDay, 'YYYYMMDD');
  var differnece = to.diff(from, 'days');

  if (differnece < 0) {
    toastr.error("Indent date can not be greater than today");
    return;
  }

  if (self.selectedMaterialsArray.length == 0) {
    toastr.info("Please provide some materials");
    return;
  }

  var count = 0;
  var error = '';
  self.selectedMaterialsArray.map(function (i) {
    count++;

    var temp_qty = Number(i.qty);
    if (isNaN(temp_qty)) {
      temp_qty = 0;
    }

    if (temp_qty == 0) {
      error = error + " Please Enter a valid Qty" + count + ", ";
    }

    var temp_unit_value = Number(i.unit_value);
    if (isNaN(temp_unit_value)) {
      temp_unit_value = 0;
    }

    if (temp_unit_value == 0) {
      error = error + " Please Enter a valid Unit Value" + count + ", ";
    }

    var deliveryDateInput = '#deliveryDateInput' + i.item_id;
    i.delivery_date = $(deliveryDateInput).val();

    var remarksInput = '#remarksInput' + i.item_id;
    i.remarks = $(remarksInput).val();
  });

  if (error != '') {
    toastr.error(error);
    return;
  } else {
    var obj = {};
    obj['indent_date'] = self.indentDateInput.value;
    obj['department_code'] = self.departmentInput.value;
    obj['stock_type_code'] = self.stockTypeInput.value;
    obj['indent_type'] = self.indentTypeInput.value;

    if (self.title == 'Add') {
      //add data to database after validation
      self.loading = true;
      RiotControl.trigger('add_indent', self.selectedMaterialsArray, obj);
    } else if (self.title == 'Edit') {
      self.loading = true;
      obj['indent_id'] = self.indent_id;
      RiotControl.trigger('edit_indent', self.selectedMaterialsArray, obj, self.edit_indent_id);
    }
  }
};

self.cancelOperation = function (e) {
  self.indents.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

self.showIndentModal = function () {
  self.title = 'Add';
  self.indent_view = 'add_indent';
  self.selectedMaterialsArray = [];
  $('#stockTypeInput').prop('disabled', false);
  self.stockTypeInput.value = '';
  self.indent_no_add = '';
  $("#indentDateInput").prop("disabled", false);
  self.update();
  dateFormat('indentDateInput');
};

self.closeAddIndent = function () {
  self.indent_view = 'indent_home';
};

self.editIndentStatus = function (t, e) {
  dateFormat('statusChangeDateInput');

  //removing status from array
  var tempStatusArray = self.indentStatusArray.filter(function (c) {
    return c.status_value != self.selectIndentStatus.value;
  });

  self.indentStatusArray = tempStatusArray;
  $("#indentStatusModal").modal('show');
  self.edit_indent_status_id = t.indent_id;
  self.statusChangeAuthorityNameInput.value = self.user_name;
};

self.viewIndent = function (t, e) {
  self.viewMaterialsArray = [];
  RiotControl.trigger('read_view_indents', t.indent_id);
};

self.closeviewIndent = function (t, e) {
  self.indent_view = 'indent_home';
};

self.saveIndentStatus = function () {
  var obj = {};
  obj['status_date'] = self.statusChangeDateInput.value;
  obj['authority_name'] = self.statusChangeAuthorityNameInput.value;
  obj['status_change_remarks'] = self.statusChnageRemarkInput.value;
  obj['status'] = self.indentStatusInput.value;
  obj['indent_id'] = self.edit_indent_status_id;
  RiotControl.trigger('edit_indent_status', obj);
};

//changed method
RiotControl.on('indents_changed', function (indents) {
  self.indent_view = 'indent_home';
  self.loading = false;
  self.indents = indents;
  self.filteredIndents = indents;

  self.paginate(self.filteredIndents, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredIndents, 1, self.items_per_page);
  self.update();
});

RiotControl.on('indents_date_error', function () {
  self.loading = false;
  toastr.error('Please Check indent date back date entry date not allowed');
});

RiotControl.on('item_groups_changed', function (item_groups) {
  /*self.item_groups = item_groups
  self.update()*/

  $('#selectItemGroupFilter').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
      console.log(self.selected_item_group_code);
    }
  });

  self.update();
});

/*RiotControl.on('categories_changed', function(categories) {
  self.categories = categories
  self.update()
})*/

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

/*RiotControl.on('uoms_changed', function(uoms) {
  self.uoms = uoms
  self.update()
})*/

/*RiotControl.on('parties_changed', function(parties) {
  self.loading = false
  self.parties = parties
  self.update()
})*/

RiotControl.on('read_departments_for_indent_changed', function (departments) {
  self.departments = departments;
  self.update();
});

self.filterMaterials = function () {
  if (!self.searchMaterials) return;
  self.filteredMaterials = self.materials.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase()) >= 0;
  });

  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
};

RiotControl.on('items_for_indent_changed', function (items) {
  self.items_per_page_new = 10;
  self.loading = false;
  self.materials = [];
  var tempMaterials = [];

  if (self.selectedMaterialsArray.length == 0) {
    self.materials = items;
  } else {
    items.map(function (sm) {
      //selected materials will be removed from materials
      var count = 0;
      self.selectedMaterialsArray.map(function (i) {
        if (sm.item_id == i.item_id) {
          count = 1;
        }
      });
      if (count == 0) {
        tempMaterials.push(sm);
      }
    });
    self.materials = tempMaterials;
  }

  self.filteredMaterials = self.materials;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);

  self.searchMaterialInput.value = '';
  $("#itemModal").modal('show');
  self.update();
});

RiotControl.on('read_edit_indents_changed', function (values) {
  self.indent_view = 'add_indent';
  $('#stockTypeInput').prop('disabled', true);
  $("#indentDateInput").prop("disabled", true);
  self.loading = false;
  self.selectedMaterialsArray = [];
  self.selectedMaterialsArray = values.selectedMaterialsArray;
  self.indentDateInput.value = values.indent_date;
  self.departmentInput.value = values.department_code;
  self.stockTypeInput.value = values.stock_type_code;
  self.selectStockTypeFilter.value = values.stock_type_code;
  self.indentTypeInput.value = values.indent_type;
  self.update();
  dateFormat('indentDateInput');
  // date element formating
  self.selectedMaterialsArray.map(function (m) {
    var deliveryDateInput = 'deliveryDateInput' + m.item_id;
    dateFormat(deliveryDateInput);

    var partyInput = '#partyInput' + m.item_id;
    $(partyInput).val(m.party);
  });

  self.indent_no_add = values.indent_no;

  self.update();
});

RiotControl.on('read_view_indents_changed', function (view) {
  self.loading = false;
  self.viewMaterialsArray = view.materialArray;
  self.view_indent_details = view;
  self.view_indent_type = view.indent_type;
  self.view_department = view.department;
  self.view_stock_type = view.stock_type;
  self.indent_view = 'view_indent';
  self.update();
});

RiotControl.on('indents_status_changed', function (indents) {
  $("#indentStatusModal").modal('hide');
  self.statusChangeDateInput.value = '';
  self.statusChangeAuthorityNameInput.value = '';
  self.statusChnageRemarkInput.value = '';
  self.indentStatusInput.value = '';
  self.loading = false;
  self.indents = indents;
  self.filteredIndents = indents;
  self.update();
});

RiotControl.on('read_indent_no_changed', function (indent_no) {
  self.loading = false;
  self.indent_no_add = indent_no;
  self.update();
});

RiotControl.on('fetch_user_details_from_session_for_indent_changed', function (user_name, user_id) {
  console.log('here');
  console.log(user_name);
  self.loading = false;
  self.user_name = user_name;
  self.user_id = user_id;
  console.log(self.user_name);
  self.update();
});

/**************** pagination for Indents*******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredIndents, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredIndents, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredIndents, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/**************** pagination for items*******************/
self.getPageDataNew = function (full_data, page_no, items_per_page_new) {
  var start_index = (page_no - 1) * items_per_page_new;
  var end_index = page_no * items_per_page_new;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate_new = function (full_data, items_per_page_new) {
  var total_pages = Math.ceil(full_data.length / items_per_page_new);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array_new = pages;
  self.current_page_no_new = 1;
  self.update();
};
self.changePageNew = function (e) {
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, e.target.value, self.items_per_page_new);
  self.current_page_no_new = e.target.value;
};
self.changeItemsPerPageNew = function (e) {
  self.items_per_page_new = e.target.value;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.current_page_no_new = 1;
  self.page_select_new.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('issue-to-department-chargehead-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Issue To Department (Charge Head Wise)</h4> <div show="{issue_to_department_chargehead_wise ==\'issue_to_department_chargehead_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-2"> <div class="form-group"> <label for="adjustmentInput">Stock Adjustment</label> <select id="adjustmentInput" class="form-control"> <option value="N">N</option> <option value="Y">Y</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIssue}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th class="serial-col">#</th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchChargeHead" class="form-control" placeholder="Search Charge Head" onkeyup="{filterChargeHeads}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectChargeHead.bind(this, cat)}"></td> <td>{cat.chargehead}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected ChargeHead</th> <th></th> </tr> <tr each="{cat, i in checkedChargeHeads}"> <td>{i+1}</td> <td>{cat.chargehead}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeChargeHead.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{issue_to_department_chargehead_wise ==\'issue_to_department_chargehead_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Issue To Department (Charge Head)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Charge Head: <b>{m.chargehead}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Issue No</th> <th>Issue Date</th> <th>Issue By</th> <th>Receive By</th> <th>Item</th> <th>Department</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Location</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.stock_type_code}{t.issue_no}</td> <td>{t.issue_date}</td> <td>{t.approve_by}</td> <td>{t.receive_by}</td> <td>{t.item_name}-(Code:{t.item_id})</td> <td>{t.department}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td>{t.location}</td> </tr> </table> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td style="text-align:right">Grand Total Qty</td> <td style="text-align:right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Amount</td> <td style="text-align:right">{amount_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.checkedChargeHeads = [];
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.issue_to_department_chargehead_wise = 'issue_to_department_chargehead_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_chargeheads');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_chargehead_id = '';

  self.checkedChargeHeads.map(function (t) {
    if (selected_chargehead_id == '') {
      selected_chargehead_id = "'" + t.chargehead + "'";
    } else if (selected_chargehead_id != '') {
      selected_chargehead_id = selected_chargehead_id + ',' + "'" + t.chargehead + "'";
    }
  });

  var link = "csv/issue_to_department_chargehead_wise_csv.php?start_date=" + self.issueRegisterItemWiseStartDateInput.value + "&end_date=" + self.issueRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&chargehead_id=" + selected_chargehead_id + "&stock_adjustment=" + self.adjustmentInput.value;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};
/********************************* department filter start*************************/
self.filterChargeHeads = function () {
  if (!self.searchChargeHead) return;
  self.filteredChargeHeads = self.chargeheads.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchChargeHead.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredChargeHeads, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredChargeHeads, 1, self.items_per_page);
};

self.selectChargeHead = function (t, e) {
  self.checkedChargeHeads.push(t);

  self.chargeheads = self.chargeheads.filter(function (c) {
    return c.chargehead_id != t.chargehead_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.chargehead_id != t.chargehead_id;
  });
};

self.removeChargeHead = function (t, e) {
  self.checkedChargeHeads = self.checkedChargeHeads.filter(function (c) {
    return c.chargehead_id != t.chargehead_id;
  });
  console.log(self.checkedChargeHeads);

  self.chargeheads.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.issue_to_department_chargehead_wise = 'issue_to_department_chargehead_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readIssue = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_chargehead_id = '';

  self.checkedChargeHeads.map(function (t) {
    if (selected_chargehead_id == '') {
      selected_chargehead_id = "'" + t.chargehead + "'";
    } else if (selected_chargehead_id != '') {
      selected_chargehead_id = selected_chargehead_id + ',' + "'" + t.chargehead + "'";
    }
  });

  self.loading = true;
  RiotControl.trigger('read_issue_to_department_chargehead_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_chargehead_id, self.adjustmentInput.value);
};

RiotControl.on('read_issue_to_department_chargehead_wise_changed', function (mainArray, qty_grand_total, amount_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.amount_grand_total = amount_grand_total;
  self.issue_to_department_chargehead_wise = 'issue_to_department_chargehead_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('chargeheads_changed', function (chargeheads) {
  self.chargeheads = chargeheads;
  self.checkedChargeHeads = [];
  self.chargeheads = chargeheads;
  self.filteredChargeHeads = chargeheads;

  self.items_per_page = 10;
  self.paginate(self.filteredChargeHeads, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredChargeHeads, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredChargeHeads, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredChargeHeads, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredChargeHeads, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('issue-to-department-date-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Issue To Department (Date Wise)</h4> <div show="{issue_to_department_date_wise ==\'issue_to_department_date_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-2"> <div class="form-group"> <label for="issueRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-2"> <div class="form-group"> <label for="issueRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-2"> <div class="form-group"> <label for="adjustmentInput">Stock Adjustment</label> <select id="adjustmentInput" class="form-control"> <option value="N">N</option> <option value="Y">Y</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <table class="table table-bordered"> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIssue}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExportNew}"> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{issue_to_department_date_wise ==\'issue_to_department_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Issue To Department (Date Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Issue Date: <b>{m.date}</b></h5> <div each="{d, j in m.issues}"> <table class="table print-small"> <tr> <td>Issue No: <b>{d.issueDetails.stock_type_code}-{d.issueDetails.issue_no}</b></td> <td>Issue Date: <b>{d.issueDetails.issue_date}</b></td> <td>Issue By: <b>{d.issueDetails.approve_by}</b></td> </tr> <tr> <td>Receive By: <b>{d.issueDetails.receive_by}</b></td> <td colspan="2">Department: <b>{d.issueDetails.department}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Chargehead</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{k+1}</td> <td>{t.material}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td style="text-align:right">{t.chargehead}</td> </tr> </table> </div> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td style="text-align:right">Grand Total Qty</td> <td class="text-xs-right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Amount</td> <td class="text-xs-right">{amount_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterDateWiseStartDateInput');
  dateFormat('issueRegisterDateWiseEndDateInput');
  self.issue_to_department_date_wise = 'issue_to_department_date_wise_home';
  RiotControl.trigger('read_stock_types');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/issue_to_department_date_wise_csv.php?start_date=" + self.issueRegisterDateWiseStartDateInput.value + "&end_date=" + self.issueRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&stock_adjustment=" + self.adjustmentInput.value;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.excelExportNew = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/issue_to_department_date_wise_csv_new.php?start_date=" + self.issueRegisterDateWiseStartDateInput.value + "&end_date=" + self.issueRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&stock_adjustment=" + self.adjustmentInput.value;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.setStartDate = function () {
  self.sd = self.issueRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.issue_to_department_date_wise = 'issue_to_department_date_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readIssue = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  if (selectedStockTypeString == '') {
    toastr.info("Please Select Stock Type");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_issue_to_department_date_wise', self.issueRegisterDateWiseStartDateInput.value, self.issueRegisterDateWiseEndDateInput.value, selectedStockTypeString, self.adjustmentInput.value);
};

RiotControl.on('read_issue_to_department_date_wise_changed', function (mainArray, qty_grand_total, amount_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.amount_grand_total = amount_grand_total;
  self.issue_to_department_date_wise = 'issue_to_department_date_wise_report';
  self.issueFrom = self.issueRegisterDateWiseStartDateInput.value;
  self.issueTo = self.issueRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});
});

riot.tag2('issue-to-department-dept-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Issue To Department (Department Wise)</h4> <div show="{issue_to_department_dept_wise ==\'issue_to_department_dept_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-2"> <div class="form-group"> <label for="adjustmentInput">Stock Adjustment</label> <select id="adjustmentInput" class="form-control"> <option value="N">N</option> <option value="Y">Y</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIssue}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th class="serial-col">#</th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchDepartment" class="form-control" placeholder="Search Departmnent" onkeyup="{filterDepartments}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectDepartment.bind(this, cat)}"></td> <td>{cat.department}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Department</th> <th></th> </tr> <tr each="{cat, i in checkedDepartments}"> <td>{i+1}</td> <td>{cat.department}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeDepartment.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{issue_to_department_dept_wise ==\'issue_to_department_dept_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Issue To Department (Department Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Department: <b>{m.department}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Issue No</th> <th>Issue Date</th> <th>Issue By</th> <th>Receive By</th> <th>Item</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Chargehead</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.stock_type_code}{t.issue_no}</td> <td>{t.issue_date}</td> <td>{t.approve_by}</td> <td>{t.receive_by}</td> <td>{t.item_name}-(Code:{t.item_id})</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td style="text-align:right">{t.chargehead}</td> </tr> </table> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td style="text-align:right">Grand Total Qty</td> <td style="text-align:right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Amount</td> <td style="text-align:right">{amount_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.checkedDepartments = [];
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.issue_to_department_dept_wise = 'issue_to_department_dept_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_departments');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_department_id = '';

  self.checkedDepartments.map(function (t) {
    if (selected_department_id == '') {
      selected_department_id = t.department_id;
    } else if (selected_department_id != '') {
      selected_department_id = selected_department_id + ',' + t.department_id;
    }
  });

  var link = "csv/issue_to_department_dept_wise_csv.php?start_date=" + self.issueRegisterItemWiseStartDateInput.value + "&end_date=" + self.issueRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&department_id=" + selected_department_id + "&stock_adjustment=" + self.adjustmentInput.value;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterDepartments = function () {
  if (!self.searchDepartment) return;
  self.filteredDepartments = self.departments.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchDepartment.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
};

self.selectDepartment = function (t, e) {
  self.checkedDepartments.push(t);

  self.departments = self.departments.filter(function (c) {
    return c.department_id != t.department_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.department_id != t.department_id;
  });
};

self.removeDepartment = function (t, e) {
  self.checkedDepartments = self.checkedDepartments.filter(function (c) {
    return c.department_id != t.department_id;
  });
  console.log(self.checkedDepartments);

  self.departments.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.issue_to_department_dept_wise = 'issue_to_department_dept_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readIssue = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_department_id = '';

  self.checkedDepartments.map(function (t) {
    if (selected_department_id == '') {
      selected_department_id = t.department_id;
    } else if (selected_department_id != '') {
      selected_department_id = selected_department_id + ',' + t.department_id;
    }
  });
  console.log('selected_department_id');
  console.log(selected_department_id);

  self.loading = true;
  RiotControl.trigger('read_issue_to_department_dept_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_department_id, self.adjustmentInput.value);
};

RiotControl.on('read_issue_to_department_dept_wise_changed', function (mainArray, qty_grand_total, amount_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.amount_grand_total = amount_grand_total;
  self.issue_to_department_dept_wise = 'issue_to_department_dept_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('departments_changed', function (departments) {
  self.departments = departments;
  self.checkedDepartments = [];
  self.departments = departments;
  self.filteredDepartments = departments;

  self.items_per_page = 10;
  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
  self.update();
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredDepartments, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('issue-to-department-item-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Issue To Department (Item Wise)</h4> <div show="{issue_to_department_item_wise ==\'issue_to_department_item_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-2"> <div class="form-group"> <label for="adjustmentInput">Stock Adjustment</label> <select id="adjustmentInput" class="form-control"> <option value="N">N</option> <option value="Y">Y</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIssue}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{issue_to_department_item_wise ==\'issue_to_department_item_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Issue To Department (Item Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Item: <b>{m.item}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Issue No</th> <th>Issue Date</th> <th>Issue By</th> <th>Receive By</th> <th>Department</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Chargehead</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.stock_type_code}{t.issue_no}</td> <td>{t.issue_date}</td> <td>{t.approve_by}</td> <td>{t.receive_by}</td> <td>{t.department}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td style="text-align:right">{t.chargehead}</td> </tr> </table> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td style="text-align:right">Grand Total Qty</td> <td class="text-xs-right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Amount</td> <td class="text-xs-right">{amount_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.issue_to_department_item_wise = 'issue_to_department_item_wise_home';
  self.loading = true;
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_items_filter');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/issue_to_department_item_wise_csv.php?start_date=" + self.issueRegisterItemWiseStartDateInput.value + "&end_date=" + self.issueRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&item_id=" + selected_item_id + "&stock_adjustment=" + self.adjustmentInput.value;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.issue_to_department_item_wise = 'issue_to_department_item_wise_home';
};

self.readIssue = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_issue_to_department_item_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_item_id, self.adjustmentInput.value);
};

RiotControl.on('read_issue_to_department_item_wise_changed', function (mainArray, qty_grand_total, amount_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.amount_grand_total = amount_grand_total;
  self.issue_to_department_item_wise = 'issue_to_department_item_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.loading = false;
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('issue-to-department-location-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Issue To Department (Location Wise)</h4> <div show="{issue_to_department_location_wise ==\'issue_to_department_location_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-2"> <div class="form-group"> <label for="adjustmentInput">Stock Adjustment</label> <select id="adjustmentInput" class="form-control"> <option value="N">N</option> <option value="Y">Y</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIssue}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th class="serial-col">#</th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchLocation" class="form-control" placeholder="Search Location" onkeyup="{filterLocations}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectLocation.bind(this, cat)}"></td> <td>{cat.location}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Location</th> <th></th> </tr> <tr each="{cat, i in checkedLocations}"> <td>{i+1}</td> <td>{cat.location}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeDepartment.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{issue_to_department_location_wise ==\'issue_to_department_location_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Issue To Department (Location Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Location: <b>{m.location}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Issue No</th> <th>Issue Date</th> <th>Issue By</th> <th>Receive By</th> <th>Item</th> <th>Department</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Chargehead</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.stock_type_code}{t.issue_no}</td> <td>{t.issue_date}</td> <td>{t.approve_by}</td> <td>{t.receive_by}</td> <td>{t.item_name}-(Code:{t.item_id})</td> <td>{t.department}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td>{t.chargehead}</td> </tr> </table> </div> <table class="table table-bordered bill-info-table print-small"> <tr> <td style="text-align:right">Grand Total Qty</td> <td style="text-align:right">{qty_grand_total}</td> <td style="text-align:right">Grand Total Amount</td> <td style="text-align:right">{amount_grand_total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.checkedLocations = [];
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.issue_to_department_location_wise = 'issue_to_department_location_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_locations');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_location_id = '';

  self.checkedLocations.map(function (t) {
    if (selected_location_id == '') {
      selected_location_id = "'" + t.location + "'";
    } else if (selected_location_id != '') {
      selected_location_id = selected_location_id + ',' + "'" + t.location + "'";
    }
  });

  var link = "csv/issue_to_department_location_wise_csv.php?start_date=" + self.issueRegisterItemWiseStartDateInput.value + "&end_date=" + self.issueRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&location_id=" + selected_location_id + "&stock_adjustment=" + self.adjustmentInput.value;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterLocations = function () {
  if (!self.searchLocation) return;
  self.filteredLocations = self.locations.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchLocation.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredLocations, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page);
};

self.selectLocation = function (t, e) {
  self.checkedLocations.push(t);

  self.locations = self.locations.filter(function (c) {
    return c.location_id != t.location_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.location_id != t.location_id;
  });
};

self.removeDepartment = function (t, e) {
  self.checkedLocations = self.checkedLocations.filter(function (c) {
    return c.location_id != t.location_id;
  });
  console.log(self.checkedLocations);

  self.locations.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.issue_to_department_location_wise = 'issue_to_department_location_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readIssue = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_location_id = '';

  self.checkedLocations.map(function (t) {
    if (selected_location_id == '') {
      selected_location_id = "'" + t.location + "'";
    } else if (selected_location_id != '') {
      selected_location_id = selected_location_id + ',' + "'" + t.location + "'";
    }
  });

  self.loading = true;
  RiotControl.trigger('read_issue_to_department_location_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_location_id, self.adjustmentInput.value);
};

RiotControl.on('read_issue_to_department_location_wise_changed', function (mainArray, qty_grand_total, amount_grand_total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.qty_grand_total = qty_grand_total;
  self.amount_grand_total = amount_grand_total;
  self.issue_to_department_location_wise = 'issue_to_department_location_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('locations_changed', function (locations) {
  self.locations = locations;
  self.checkedLocations = [];
  self.locations = locations;
  self.filteredLocations = locations;

  self.items_per_page = 10;
  self.paginate(self.filteredLocations, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page);
  self.update();
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredLocations, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredLocations, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('issue-to-department', '<loading-bar if="{loading}"></loading-bar> <div show="{issue_to_department_view ==\'issue_to_department_home\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-6"> <h4>Issue to Department</h4> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="selectReadStockTypeInput">Stock Type</label> <select name="selectReadStockTypeInput" class="form-control" onchange="{readIssueToDepartment}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIssueToDepartment}" id="gobtn">Go</button> </div> </div> <div class="col-md-8 text-xs-right"> <div class="form-inline"> <input type="search" name="searchIssueToDept" class="form-control" placeholder="search" onkeyup="{filterIssueToDept}" style="width:200px;margin-right: 10px;"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{showIssueToDepartmentEntryForm}"><i class="material-icons">add</i></button> </div> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Issue No</th> <th>Issue Date</th> <th>Department</th> <th>Issue By</th> <th>Receive By</th> <th></th> </tr> <tr each="{c, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td class="text-center">{c.stock_type_code}-{c.issue_no}</td> <td class="text-center">{c.issue_date}</td> <td class="text-center">{c.department}</td> <td class="text-center">{c.approve_by}</td> <td class="text-center">{c.receive_by}</td> <td> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{view}"><i class="material-icons">visibility</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{deleteIssue}"><i class="material-icons">delete</i></button> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="7"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{issue_to_department_view ==\'issue_to_department_entry\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-9"> <h4>{title} Issue to Department</h4> </div> <div class="col-md-3"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{closeSaveIssueToDepartment}"><i class="material-icons">close</i></button> </div> </div> <form> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label for="issueDateInput">Issue Date</label> <input type="text" class="form-control" id="issueDateInput" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectDepartmentInput">Department</label> <select name="selectDepartmentInput" class="form-control" style="min-width:250px"> <option></option> <option each="{departments}" value="{department_id}">{department}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label>Stock Type</label> <select id="selectStockType" onchange="{changeStockType}" class="form-control" style="min-width:250px"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label>Issue Number: </label> {issue_number} </div> </div> </div> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label for="approveByInput">Issue By</label> <input type="text" class="form-control" id="approveByInput" disabled> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="receiveByInput">Receive By</label> <input type="text" class="form-control" id="receiveByInput"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="requisitionNoInput">Requisition No</label> <input type="text" class="form-control" id="requisitionNoInput"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="adjustmentInput">Stock Adjustment</label> <select id="adjustmentInput" class="form-control"> <option value="N">N</option> <option value="Y">Y</option> </select> </div> </div> </div> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter">Item Group</label> <input id="selectItemGroupFilter" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px" disabled> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="searchMaterialInput">Search Material</label> <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{getMaterial}" style="margin-top: 32px;">Get Material</button> </div> </div> </div> <div class="row"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Charge Head</th> <th>Material</th> <th>UOM</th> <th>Max Level</th> <th>Min Level</th> <th>Stock in Hand</th> <th>Qty</th> <th>Remarks</th> <th show="{title==\'Add\'}"></th> </tr> <tr each="{cat, i in selectedMaterialsArray}" no-reorder> <td>{i+1}</td> <td> <select id="{\'chargeHeadInput\' + cat.item_id}" class="form-control"> <option></option> <option each="{chargeheads}" value="{chargehead_id}">{chargehead}</option> </select> </td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td>{cat.uom_code}</td> <td>{cat.max_level}</td> <td>{cat.min_level}</td> <td>{cat.stock}</td> <td> <input type="text" id="{\'qtyInput\' + cat.item_id}" value="{cat.qty}" class="form-control"> </td> <td> <input type="text" id="{\'remarksInput\' + cat.item_id}" value="{cat.remarks}" class="form-control"> </td> <td show="{title==\'Add\' || cat.action==\'edit\'}"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeSelectedMaterial.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> <br> <label for="remarksInput">Remarks:</label> <textarea id="remarksInput" class="form-control" rows="2"></textarea> <br> </div> </form> <div class="col-sm-12"> <button type="button" class="btn btn-primary pull-sm-right" onclick="{saveIssueToDepartment}">Save changes</button> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closeSaveIssueToDepartment}" style=" margin-right: 10px;">Close</button> </div> </div> </div> <div show="{issue_to_department_view ==\'issue_to_department_eye\'}" class="container-fluid print-box"> <div class="container-fluid"> <div class="row no-print"> <div class="col-md-9"> <h4>Issue to Department</h4> </div> <div class="col-md-3"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{closeSaveIssueToDepartment}"><i class="material-icons">close</i></button> </div> </div> <center> <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> Email: purchase@ntcind.com<br> <span if="{stockAdjustmentView}"> (Stock Adjustment) </span> </center><br> <table class="table table-bordered bill-info-table"> <tr> <th style="width:100px">Issue No</th> <td>{issueDetails.stock_type_code}-{issueDetails.issue_no}</td> <th>Issue Date</th> <td>{issueDetails.issue_date}</td> <th>Department</th> <td>{issueDetails.department}</td> </tr> <tr> <th> <span if="{!stockAdjustmentView}">Issue By</span> <span if="{stockAdjustmentView}">Adjustment By</span> </th> <td>{issueDetails.approve_by}</td> <th> <span if="{!stockAdjustmentView}">Receive By</span> <span if="{stockAdjustmentView}">Verification By</span> </th> <td>{issueDetails.receive_by}</td> <th>Requisition No</th> <td>{issueDetails.requisition_no}</td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th style="max-width:50px;width:50px"><strong>#</strong></th> <th style="width:200px;"><strong>Material</strong></th> <th><strong>Charge Head</strong></th> <th><strong>UOM</strong></th> <th><strong>Qty</strong></th> </tr> <tr each="{m, i in issueViewItems}"> <td><div class="slno">{i+1}</div></td> <td>{m.item_name}-(Code:{m.item_id})</td> <td>{m.chargehead}</td> <td class="text-center">{m.uom_code}</td> <td class="text-xs-right">{m.qty}</td> </tr> </table> <p show="{showRemarks}"><br><br><br> <b>Remarks: </b> {issueDetails.remarks}</p> <br><br> <table class="table indent-footer"> <tr> <td style="width:50%"><center style="height:21px">{issueDetails.approve_by}</center><div><center>Issue By</center></div></td> <td style="width:50%"><center style="height:21px">{issueDetails.receive_by}</center><div><center>Receive By</center></div></td> </tr> </table> </div> </div> <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Select Material</h4> <div class="text-xs-right form-inline"> <input type="search" name="searchMaterials" class="form-control" placeholder="search" onkeyup="{filterMaterials}" style="width:200px"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterial}">Submit</button> </div> </div> <div class="modal-body"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th style="width:75px"></th> <th>Material</th> <th>Group</th> </tr> <tr each="{it, i in pagedDataMaterials}"> <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td> <td><input type="checkbox" class="form-control" __checked="{it.selected}" onclick="{parent.toggle}"></td> <td>{it.item_name}-(Code:{it.item_id})</td> <td>{it.item_group}</td> </tr> <tfoot class="no-print"> <tr> <td colspan="10"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPageNew}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select_new" onchange="{changePageNew}"> <option each="{pno in page_array_new}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterial}">Submit</button> </div> </div> </div> </div> <div class="modal fade" id="deleteIssueModal"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title">Delete Issue</h4> </div> <div class="modal-body"> <center><strong>Are you sure to delete issued items</strong></center> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{confirmDeleteIssue}">Delete</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  //RiotControl.trigger('login_init')
  self.items_per_page = 10;
  self.items_per_page_new = 10;
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_item_groups');
  RiotControl.trigger('read_categories');
  RiotControl.trigger('read_departments');
  RiotControl.trigger('read_chargeheads');
  RiotControl.trigger('read_locations');
  RiotControl.trigger('fetch_user_details_from_session_for_issue_to_department');
  self.issue_to_department_view = 'issue_to_department_home';
  dateFormat('issueDateInput');
  self.update();
});

self.readIssueToDepartment = function () {
  self.loading = true;
  RiotControl.trigger('read_issued_items_by_department', self.selectReadStockTypeInput.value);
};

self.showIssueToDepartmentEntryForm = function () {
  self.title = 'Add';
  self.issue_to_department_view = 'issue_to_department_entry';
  self.selectedMaterialsArray = [];
  self.issue_number = '';
  self.selectStockType.value = '';
  self.selectStockTypeFilter.value = '';
  self.adjustmentInput.value = 'N';
  self.remarksInput.value = '';
  self.receiveByInput.value = '';
  self.requisitionNoInput.value = '';
  $("#issueDateInput").prop("disabled", false);
  $("#selectStockType").prop("disabled", false);
  self.approveByInput.value = self.user_name;
  self.update();
};

self.changeStockType = function () {
  self.selectStockTypeFilter.value = self.selectStockType.value;
  RiotControl.trigger('read_issue_number_by_stock_type', self.selectStockType.value);
};
self.getMaterial = function () {
  self.materials = [];
  if (self.searchMaterialInput.value == '') {
    if (self.selectItemGroupFilter.value == '') {
      toastr.info("Please select Item Group and try again");
      return;
    }
    RiotControl.trigger('read_items_for_issue_to_department', self.selected_item_group_code, self.selectStockTypeFilter.value);
  } else {
    RiotControl.trigger('search_items', self.searchMaterialInput.value, self.selectStockTypeFilter.value);
  }
};

self.selectedMaterial = function () {
  self.materials = self.materials.map(function (m) {
    if (m.selected) {
      self.selectedMaterialsArray.push(m);
    }
  });
  $("#itemModal").modal('hide');
  console.log(self.selectedMaterialsArray);
  self.update();
};

self.removeSelectedMaterial = function (i, e) {
  var tempSelectedMaterialsArray = self.selectedMaterialsArray.filter(function (c) {
    return c.item_id != i.item_id;
  });

  self.selectedMaterialsArray = tempSelectedMaterialsArray;
};

self.toggle = function (e) {
  var item = e.item;
  item.selected = !item.selected;

  /*updating selected materials*/
  self.materials = self.materials.map(function (m) {
    if (m.item_id == item.it.item_id) {
      m.item_id = m.item_id;
      m.item_name = m.item_name;
      m.item_description = m.item_description;
      m.uom_code = m.uom_code;
      m.max_level = m.max_level;
      m.min_level = m.min_level;
      m.stock_in_hand = m.stock_in_hand;
      m.selected = item.selected;

      m.qty = '';
      m.chargehead_id = '';
      m.location = '';
      if (self.title == 'Add') {
        m.action = 'add';
      } else {
        m.action = 'edit';
      }
    }
    m.confirmEdit = false;
    return m;
  });
  return true;
};

self.closeSaveIssueToDepartment = function () {
  self.issue_to_department_view = 'issue_to_department_home';
};

self.view = function (e) {
  RiotControl.trigger('read_view', e.item.c.issue_id);
};

self.edit = function (e) {
  self.edit_issue_id = e.item.c.issue_id;
  RiotControl.trigger('read_items_for_issue_edit', e.item.c.issue_id);
};

self.deleteIssue = function (e) {
  self.delete_issue_id = e.item.c.issue_id;
  $("#deleteIssueModal").modal('show');
};
self.confirmDeleteIssue = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_issue', self.delete_issue_id, self.issuedItems);
};

self.saveIssueToDepartment = function () {
  if (self.issueDateInput.value == '') {
    toastr.info("Please Entet Issue Date");
    return;
  }

  var str = self.issueDateInput.value;
  var d = str.split("/");
  var po_date = moment([d[2].trim() + d[1].trim() + d[0].trim()], 'YYYYMMDD');
  var toDay = moment().format('YYYYMMDD');

  var from = moment(po_date, 'YYYYMMDD');
  var to = moment(toDay, 'YYYYMMDD');
  var differnece = to.diff(from, 'days');

  if (differnece < 0) {
    toastr.error("Issue date can not be greater than today");
    return;
  }

  if (self.selectDepartmentInput.value == '') {
    toastr.info("please provide issue department");
    return;
  }

  if (self.approveByInput.value == '') {
    toastr.info("please provide approve by");
    return;
  }

  if (self.receiveByInput.value == '') {
    toastr.info("please provide receive by");
    return;
  }

  var error = '';
  var count = 1;
  self.selectedMaterialsArray.map(function (i) {
    var chargeHeadInput = '#chargeHeadInput' + i.item_id;
    i.chargehead_id = $(chargeHeadInput).val();

    var qtyInput = '#qtyInput' + i.item_id;
    i.qty = $(qtyInput).val();

    var remarksInput = '#remarksInput' + i.item_id;
    i.remarks = $(remarksInput).val();

    //validation check
    //if(self.adjustmentInput.value=='N'){
    if (i.chargehead_id == '') {
      error = error + 'please select chargehead' + count + ',';
    }
    //}
    if (i.qty == '') {
      error = error + 'please enter qty' + count + ',';
    }
    count++;
  });

  if (error != '') {
    toastr.info(error);
    return;
  } else if (self.title == 'Add') {
    RiotControl.trigger('add_issue_to_department', self.selectedMaterialsArray, self.issueDateInput.value, self.selectDepartmentInput.value, self.approveByInput.value, self.receiveByInput.value, self.issue_number, self.selectStockType.value, self.requisitionNoInput.value, self.adjustmentInput.value, self.remarksInput.value);
  } else if (self.title == 'Edit') {
    var addMaterials = []; // newly selected items to be added in issue to department
    var editMaterials = []; // items to be edited
    self.selectedMaterialsArray.map(function (i) {
      if (i.action == 'edit') {
        addMaterials.push(i);
      } else {
        editMaterials.push(i);
      }
    });
    // console.log('self.selectedMaterialsArray');
    // console.log(self.selectedMaterialsArray);
    // console.log('addMaterials');
    // console.log(addMaterials);
    // console.log('editMaterials');
    // console.log(editMaterials);

    RiotControl.trigger('edit_issue_to_department', editMaterials, self.issueDateInput.value, self.selectDepartmentInput.value, self.approveByInput.value, self.receiveByInput.value, self.edit_issue_id, self.requisitionNoInput.value, self.adjustmentInput.value, self.remarksInput.value, addMaterials);

    /*RiotControl.trigger('edit_issue_to_department',self.selectedMaterialsArray,self.issueDateInput.value,self.selectDepartmentInput.value,self.approveByInput.value,self.receiveByInput.value,self.edit_issue_id,self.requisitionNoInput.value,self.adjustmentInput.value,self.remarksInput.value)*/
  }
};

self.filterIssueToDept = function () {
  if (!self.searchIssueToDept) return;
  self.filteredIssueToDept = self.issuedItems.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchIssueToDept.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredIssueToDept, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredIssueToDept, 1, self.items_per_page);
};

self.filterMaterials = function () {
  if (!self.searchMaterials) return;
  self.filteredMaterials = self.materials.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase()) >= 0;
  });

  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
};

/*method change callback from store*/
RiotControl.on('item_groups_changed', function (item_groups) {

  $('#selectItemGroupFilter').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
      console.log(self.selected_item_group_code);
    }
  });
  self.update();
});

RiotControl.on('categories_changed', function (categories) {
  self.categories = categories;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('departments_changed', function (departments) {
  self.loading = false;
  self.departments = departments;
  self.update();
});

RiotControl.on('read_items_for_issue_to_department_changed', function (items) {
  $("#itemModal").modal('show');
  self.loading = false;
  self.materials = items;

  self.filteredMaterials = self.materials;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.update();
});

RiotControl.on('search_items_changed', function (items) {
  $("#itemModal").modal('show');
  self.loading = false;
  self.materials = items;
  self.searchMaterialInput.value = '';

  self.filteredMaterials = self.materials;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.update();
});

RiotControl.on('chargeheads_changed', function (chargeheads) {
  self.loading = false;
  self.chargeheads = chargeheads;
  self.update();
});

RiotControl.on('locations_changed', function (locations) {
  self.loading = false;
  self.locations = locations;
  self.update();
});

RiotControl.on('add_issue_to_department_changed', function () {
  self.loading = false;
  self.issue_to_department_view = 'issue_to_department_home';
  self.update();
});

RiotControl.on('edit_issue_to_department_changed', function () {
  self.loading = false;
  self.issue_to_department_view = 'issue_to_department_home';
  self.update();
});

RiotControl.on('read_issued_items_by_department_changed', function (items) {
  self.loading = false;
  self.issuedItems = [];
  self.issuedItems = items;
  self.filteredIssueToDept = items;

  self.paginate(self.filteredIssueToDept, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredIssueToDept, 1, self.items_per_page);
  self.update();
});

RiotControl.on('read_items_for_issue_edit_changed', function (items, details) {
  $("#issueDateInput").prop("disabled", true);
  $("#selectStockType").prop("disabled", true);

  self.loading = false;
  self.title = 'Edit';
  self.issue_to_department_view = 'issue_to_department_entry';
  self.selectedMaterialsArray = [];
  self.selectedMaterialsArray = items;
  self.issueDateInput.value = details.issue_date;
  self.selectDepartmentInput.value = details.department_id;
  self.approveByInput.value = details.approve_by;
  self.receiveByInput.value = details.receive_by;
  self.requisitionNoInput.value = details.requisition_no;
  self.adjustmentInput.value = details.stock_adjustment;
  self.remarksInput.value = details.remarks;
  self.selectStockType.value = details.stock_type_code;
  self.selectStockTypeFilter.value = details.stock_type_code;
  self.issue_number = details.issue_no;
  self.update();
  self.selectedMaterialsArray.map(function (i) {
    var chargeHeadInput = '#chargeHeadInput' + i.item_id;
    console.log(chargeHeadInput);
    console.log(i.chargehead_id);
    $(chargeHeadInput).val(i.chargehead_id);
  });
});

RiotControl.on('read_issue_number_by_stock_type_changed', function (issue_number) {
  self.loading = false;
  self.issue_number = issue_number;
  self.update();
});

RiotControl.on('read_view_changed', function (details, items) {
  self.loading = false;
  self.issue_to_department_view = 'issue_to_department_eye';
  self.issueDetails = {};
  self.issueDetails = details;
  self.showRemarks = false;
  if (details.remarks != null) {
    if (details.remarks.length > 0) {
      self.showRemarks = true;
    }
  }

  if (details.stock_adjustment == 'Y') {
    self.stockAdjustmentView = true;
  } else {
    self.stockAdjustmentView = false;
  }
  self.issueViewItems = [];
  self.issueViewItems = items;
  self.update();
});

RiotControl.on('delete_issue_changed', function (items) {
  self.loading = false;
  $("#deleteIssueModal").modal('hide');
  self.issuedItems = items;
  self.update();
});

RiotControl.on('fetch_user_details_from_session_for_issue_to_department_changed', function (user_name, user_id) {
  self.loading = false;
  self.user_name = user_name;
  self.user_id = user_id;
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredIssueToDept, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredIssueToDept, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredIssueToDept, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/**************** pagination for items*******************/
self.getPageDataNew = function (full_data, page_no, items_per_page_new) {
  var start_index = (page_no - 1) * items_per_page_new;
  var end_index = page_no * items_per_page_new;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate_new = function (full_data, items_per_page_new) {
  var total_pages = Math.ceil(full_data.length / items_per_page_new);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array_new = pages;
  self.current_page_no_new = 1;
  self.update();
};
self.changePageNew = function (e) {
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, e.target.value, self.items_per_page_new);
  self.current_page_no_new = e.target.value;
};
self.changeItemsPerPageNew = function (e) {
  self.items_per_page_new = e.target.value;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.current_page_no_new = 1;
  self.page_select_new.value = 1;
};
/**************** pagination ends*******************/
});
riot.tag2('item-group-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Item Group</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchItemGroup" class="form-control" placeholder="search" onkeyup="{filterItemGroups}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshItemGroups}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"><input type="text" name="addItemGroupCodeInput" placeholder="Code" class="form-control" onkeyup="{addEnter}"></td> <td><input type="text" name="addItemGroupInput" placeholder="ItemGroup" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{add}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th onclick="{sortByCode}" style="cursor: pointer;"> Code <hand if="{activeSort==\'sortCode\'}"> <i class="material-icons" show="{sortCode}">arrow_upward</i> <i class="material-icons" hide="{sortCode}">arrow_downward</i> <hand> </th> <th onclick="{sortByItemGroup}" style="cursor: pointer;"> Stock Type <hand if="{activeSort==\'sortItemGroup\'}"> <i class="material-icons" show="{sortItemGroup}">arrow_upward</i> <i class="material-icons" hide="{sortItemGroup}">arrow_downward</i> </hand> </th> <th class="two-buttons"></th> </tr> <tr each="{ch, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td if="{!ch.confirmEdit && !ch.confirmDelete}"> {ch.item_group_code} </td> <td if="{!ch.confirmEdit && !ch.confirmDelete}"> {ch.item_group} </td> <td colspan="2" if="{ch.confirmDelete}"><span class="delete-question">Are you sure?</span></td> <td if="{ch.confirmEdit}"> <input type="text" id="editedItemGroupCode" autofocus class="form-control" value="{ch.item_group_code}" onkeyup="{editEnter.bind(this)}"> </td> <td if="{ch.confirmEdit}"> <input type="text" id="editedItemGroup" class="form-control" value="{ch.item_group}" onkeyup="{editEnter.bind(this)}"> </td> <td> <div class="table-buttons" hide="{ch.confirmDelete ||  ch.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{ch.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{ch.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot> <tr> <td colspan="4"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortItemGroup = true;
  self.sortCode = true;
  self.activeSort = '';
  self.update();
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_item_groups');
});

// RiotControl.on('login_changed', function(login_status) {
//   if(!login_status.role || login_status.role == 'FAIL'){
//     riot.route("/home")
//   }
// })

self.refreshItemGroups = function () {
  self.item_groups = [];
  self.searchItemGroup.value;
  RiotControl.trigger('read_item_groups');
};

self.filterItemGroups = function () {
  if (!self.searchItemGroup) return;
  self.filteredItemGroups = self.item_groups.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItemGroup.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItemGroups, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItemGroups, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.item_groups.map(function (c) {
    if (c.item_group_id != e.item.ch.item_group_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.item_groups.map(function (c) {
    if (c.item_group_id != e.item.ch.item_group_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_item_group', e.item.ch.item_group_id);
};

self.edit = function (e) {
  if (!$("#editedItemGroupCode").val()) {
    toastr.info("Please enter a valid item_group Code and try again");
  } else if (!$("#editedItemGroup").val()) {
    toastr.info("Please enter a valid item_group and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_item_group', e.item.ch.item_group_id, $("#editedItemGroupCode").val(), $("#editedItemGroup").val());
  }
};

self.add = function () {
  if (!self.addItemGroupCodeInput.value) {
    toastr.info("Please enter a valid item_group Code and try again");
  } else if (!self.addItemGroupInput.value) {
    toastr.info("Please enter a valid item_group and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_item_group', self.addItemGroupCodeInput.value, self.addItemGroupInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.add();
  }
};

self.editEnter = function (e) {
  if (e.which == 13) {
    self.edit(e);
  }
};

self.cancelOperation = function (e) {
  self.item_groups.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

RiotControl.on('item_groups_changed', function (item_groups) {
  self.addItemGroupCodeInput.value = '';
  self.addItemGroupInput.value = '';
  self.loading = false;
  self.item_groups = item_groups;
  self.filteredItemGroups = item_groups;

  self.items_per_page = 10;
  self.callPaging();
  self.update();
});

self.callPaging = function () {
  self.paginate(self.filteredItemGroups, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItemGroups, 1, self.items_per_page);
};

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItemGroups, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItemGroups, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItemGroups, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/*sorting Starts*/
self.sortByItemGroup = function () {

  if (self.sortItemGroup == true) {
    self.item_groups.sort(function (a, b) {
      return a.item_group.toUpperCase().localeCompare(b.item_group.toUpperCase());
    });
  } else {
    self.item_groups.reverse();
  }

  self.activeSort = 'sortItemGroup';
  self.filteredItemGroups = self.item_groups;
  self.callPaging();

  self.update();
  self.sortItemGroup = !self.sortItemGroup;
};

self.sortByCode = function () {

  if (self.sortCode == true) {
    self.item_groups.sort(function (a, b) {
      return a.item_group_code.toUpperCase().localeCompare(b.item_group_code.toUpperCase());
    });
  } else {
    self.item_groups.reverse();
  }

  self.activeSort = 'sortCode';
  self.filteredItemGroups = self.item_groups;
  self.callPaging();

  self.update();
  self.sortCode = !self.sortCode;
};

/*sorting Ends*/
});

riot.tag2('item-master', '<loading-bar if="{loading}"></loading-bar> <div show="{item_view ==\'item_home\'}"> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Item</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchItem" class="form-control" placeholder="search" onkeyup="{filterItemes}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{showItemModal}"><i class="material-icons">add</i></button> </div> </div> </div> </div> <div class="col-sm-12" style="margin-bottom:20px"> <div class="form-inline"> <div class="form-group"> <label>Item Group</label> <input id="selectItemGroup" type="text" class="form-control"> </div> <div class="form-group"> <label>Stock Type</label> <select name="selectStockType" class="form-control" style="min-width:250px"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{refreshItems}">Go</button> </div> </div> </div> <div class="col-sm-12"> <ul class="alphabet-list"> <li each="{a, i in alphabet}" class="{active: selected_alphabet == a}" onclick="{readItemsByAlphabet.bind(this, a)}">{a}</li> </ul> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Material</th> <th>Code</th> <th>Description</th> <th>G code</th> <th>Uom</th> <th>Location</th> <th>ST Code</th> <th>Max Level</th> <th>Min Level</th> <th>ROL</th> <th>ROQ</th> <th class="two-buttons"></th> </tr> <tr each="{cat, i in pagedDataItems}" no-reorder> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{cat.item_name}</td> <td>{cat.item_id}</td> <td>{cat.item_description}</td> <td>{cat.item_group_code}</td> <td>{cat.uom_code}</td> <td>{cat.location}</td> <td>{cat.stock_type_code}</td> <td>{cat.max_level}</td> <td>{cat.min_level}</td> <td>{cat.reorder_level}</td> <td>{cat.reorder_qty}</td> <td> <div class="table-buttons" hide="{cat.confirmDelete ||  cat.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit.bind(this, cat)}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{cat.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="12"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{item_view ==\'item_add\'}"> <h4 class="modal-title" id="myModalLabel">{title} Material</h4> <div class="row"> <div class="col-md-6"> <div class="form-group row"> <label for="itemNameInput" class="col-xs-4 col-form-label">Name</label> <div class="col-xs-8"> <input class="form-control" type="text" id="itemNameInput"> </div> </div> <div class="form-group row"> <label for="itemGroupCodeInput" class="col-xs-4 col-form-label">Item Group Code</label> <div class="col-xs-8"> <input id="itemGroupCodeInput" type="text" class="form-control"> </div> </div> <div class="form-group row"> <label for="uomCodeInput" class="col-xs-4 col-form-label">Uom Code</label> <div class="col-xs-8"> <select name="uomCodeInput" class="form-control"> <option each="{uoms}" value="{uom}">{uom}</option> </select> </div> </div> <div class="form-group row"> <label for="maxLevelInput" class="col-xs-4 col-form-label">Max Level</label> <div class="col-xs-8"> <input class="form-control" type="text" id="maxLevelInput"> </div> </div> <div class="form-group row"> <label for="rolInput" class="col-xs-4 col-form-label">ROL</label> <div class="col-xs-8"> <input class="form-control" type="text" id="rolInput"> </div> </div> <div class="form-group row"> <label for="locationInput" class="col-xs-4 col-form-label">Location</label> <div class="col-xs-8"> <select name="locationInput" class="form-control"> <option each="{locations}" value="{location}">{location}</option> </select> </div> </div> </div> <div class="col-md-6"> <div class="form-group row"> <label for="itemDescriptionInput" class="col-xs-4 col-form-label">Item Description</label> <div class="col-xs-8"> <input class="form-control" type="text" id="itemDescriptionInput"> </div> </div> <div class="form-group row"> <label for="stockTypeInput" class="col-xs-4 col-form-label">Stock Type Code</label> <div class="col-xs-8"> <select name="stockTypeInput" class="form-control"> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="form-group row"> <label for="minLevelInput" class="col-xs-4 col-form-label">Min Level</label> <div class="col-xs-8"> <input class="form-control" type="text" id="minLevelInput"> </div> </div> <div class="form-group row"> <label for="roqInput" class="col-xs-4 col-form-label">ROQ</label> <div class="col-xs-8"> <input class="form-control" type="text" id="roqInput"> </div> </div> </div> </div> <div class="row text-right"> <button type="button" class="btn btn-secondary" onclick="{hideItemModal}" style="margin-right:10px">Close</button> <button type="button" class="btn btn-primary" onclick="{save}">Save changes</button> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.items_per_page = 10;
  RiotControl.trigger('login_init');
  RiotControl.trigger('read_item_groups');
  RiotControl.trigger('read_categories');
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_uoms');
  RiotControl.trigger('read_locations');
  self.item_view = 'item_home';

  self.alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "All"];
  self.selected_alphabet = "A";
  //self.readContacts(self.selected_alphabet)
});

self.readItemsByAlphabet = function (alphabet, e) {
  self.selected_alphabet = alphabet;
  self.refreshItems();
};
self.refreshItems = function () {
  self.items = [];
  self.searchItem.value = '';

  if (self.selectItemGroup.value == '') {
    self.selected_item_group_code = '';
  }

  if (!self.selected_item_group_code) {
    self.selected_item_group_code = '';
  }

  if (self.selected_item_group_code == '' && self.selectStockType.value == '') {
    toastr.error("Please select item gropu or stock type");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_items', self.selected_item_group_code, self.selectStockType.value, self.selected_alphabet);
  //RiotControl.trigger('read_items',self.selectItemGroup.value,self.selectStockType.value)
};

self.filterItemes = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.items.map(function (c) {
    if (c.item_id != e.item.cat.item_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_item', e.item.cat.item_id);
};

self.edit = function (t, e) {
  console.log(t);
  self.title = 'Edit';
  self.item_view = 'item_add';

  self.itemNameInput.value = t.item_name;
  self.itemGroupCodeInput.value = t.item_group;
  self.selected_item_group_code_input = t.item_group_code;
  self.uomCodeInput.value = t.uom_code;
  self.locationInput.value = t.location;
  self.maxLevelInput.value = t.max_level;
  self.rolInput.value = t.reorder_level;
  self.itemDescriptionInput.value = t.item_description;
  self.stockTypeInput.value = t.stock_type_code;
  self.minLevelInput.value = t.min_level;
  self.roqInput.value = t.reorder_qty;
  self.item_id = t.item_id; // id to update the item
};

self.save = function () {
  if (!self.itemNameInput.value) {
    toastr.info("Please enter a valid Item Nmae and try again");
    return;
  }

  var obj = {};
  obj['itemNameInput'] = self.itemNameInput.value;
  obj['itemGroupCodeInput'] = self.selected_item_group_code_input;
  obj['uomCodeInput'] = self.uomCodeInput.value;
  obj['locationInput'] = self.locationInput.value;
  obj['maxLevelInput'] = self.maxLevelInput.value;
  obj['rolInput'] = self.rolInput.value;
  obj['itemDescriptionInput'] = self.itemDescriptionInput.value;
  obj['stockTypeInput'] = self.stockTypeInput.value;
  obj['minLevelInput'] = self.minLevelInput.value;
  obj['roqInput'] = self.roqInput.value;

  if (self.title == 'Add') {
    //add data to database after validation
    self.loading = true;
    RiotControl.trigger('add_item', obj);
  } else if (self.title == 'Edit') {
    self.loading = true;
    obj['item_id'] = self.item_id;
    RiotControl.trigger('edit_item', obj);
  }
};

self.cancelOperation = function (e) {
  self.items.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

self.showItemModal = function () {
  self.title = 'Add';
  self.item_view = 'item_add';
};

self.hideItemModal = function () {
  self.item_view = 'item_home';
};

RiotControl.on('items_changed', function (items) {
  self.item_view = 'item_home';
  self.loading = false;
  /*if(items.length==0){
    toastr.info("No Data Found")
  }*/
  self.items = [];
  self.items = items;
  self.filteredItems = items;

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);

  self.itemNameInput.value = '';
  self.locationInput.value = '';
  self.maxLevelInput.value = '';
  self.rolInput.value = '';
  self.itemDescriptionInput.value = '';
  self.stockTypeInput.value = '';
  self.minLevelInput.value = '';
  self.roqInput.value = '';

  self.update();
});

RiotControl.on('item_groups_changed', function (item_groups) {
  self.loading = false;
  self.item_groups = item_groups;

  $('#selectItemGroup').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
      console.log(self.selected_item_group_code);
    }
  });

  $('#itemGroupCodeInput').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code_input = ui.item.item_group_code;
      console.log(self.selected_item_group_code_input);
    }
  });

  self.update();
});

RiotControl.on('categories_changed', function (categories) {
  self.loading = false;
  self.categories = categories;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.loading = false;
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('uoms_changed', function (uoms) {
  self.loading = false;
  self.uoms = uoms;
  self.update();
});

RiotControl.on('locations_changed', function (locations) {
  self.loading = false;
  self.locations = locations;
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('item-subgroup-master', '<div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Item Subgroups</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchItemSubgroup" class="form-control" placeholder="search" onkeyup="{filterItemSubgroups}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshItemSubgroups}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"> <div class="form-inline"> <div class="form-group"> <label>Item Group</label> <select name="addItemGroup" class="form-control"> <option each="{item_groups}" value="{item_group_id}">{item_group}</option> </select> </div> </div> </td> <td><input type="text" name="addItemSubgroupInput" placeholder="Add new ItemSubgroup" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{add}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th>Item Group</th> <th>Item Subgroup</th> <th class="two-buttons"></th> </tr> <tr each="{item_subgroup, i in filteredItemSubgroups}"> <td>{i+1}</td> <td if="{!item_subgroup.confirmEdit && !item_subgroup.confirmDelete}"> {item_subgroup.item_group} </td> <td if="{!item_subgroup.confirmEdit && !item_subgroup.confirmDelete}"> {item_subgroup.item_subgroup} </td> <td colspan="2" if="{item_subgroup.confirmDelete}"><span class="delete-question">Are you sure?</span></td> <td if="{item_subgroup.confirmEdit}"> <select id="editedItemGroup" class="form-control"> <option each="{item_groups}" value="{item_group_id}" __selected="{item_group_id === item_subgroup.item_group_id}">{item_group}</option> </select> </td> <td if="{item_subgroup.confirmEdit}"><input type="text" id="editedItemSubgroup" class="form-control" value="{item_subgroup.item_subgroup}" onkeyup="{editEnter.bind(this, item_subgroup.item_subgroup_id)}"></td> <td> <div class="table-buttons" hide="{item_subgroup.confirmDelete ||  item_subgroup.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{item_subgroup.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{item_subgroup.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  RiotControl.trigger('login_init');
  RiotControl.trigger('read_item_groups');
  RiotControl.trigger('read_item_subgroups');
});

// RiotControl.on('login_changed', function(login_status) {
//   if(!login_status.role || login_status.role == 'FAIL'){
//     riot.route("/home")
//   }
// })

self.refreshItemSubgroups = function () {
  self.item_subgroups = [];
  self.searchItemSubgroup.value;
  RiotControl.trigger('read_item_subgroups');
};

self.filterItemSubgroups = function () {
  if (!self.searchItemSubgroup) return;
  self.filteredItemSubgroups = self.item_subgroups.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItemSubgroup.value.toLowerCase()) >= 0;
  });
};

self.confirmDelete = function (e) {
  self.item_subgroups.map(function (c) {
    if (c.item_subgroup_id != e.item.item_subgroup.item_subgroup_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.item_subgroups.map(function (c) {
    if (c.item_subgroup_id != e.item.item_subgroup.item_subgroup_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_item_subgroup', e.item.item_subgroup.item_subgroup_id);
};

self.edit = function (e) {
  if (!$("#editedItemGroup").val()) {
    toastr.info("Please choose item group and try again");
  } else if (!$("#editedItemSubgroup").val()) {
    toastr.info("Please enter a valid item_subgroup and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_item_subgroup', e.item.item_subgroup.item_subgroup_id, $("#editedItemGroup").val(), $("#editedItemSubgroup").val());
  }
};

self.add = function () {
  if (!self.addItemGroup.value) {
    toastr.info("Please choose item group and try again");
  } else if (!self.addItemSubgroupInput.value) {
    toastr.info("Please enter a valid item subgroup and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_item_subgroup', self.addItemGroup.value, self.addItemSubgroupInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.add();
  }
};

self.editEnter = function (a, e) {
  if (e.which == 13) {
    if (!$("#editedItemGroup").val()) {
      toastr.info("Please enter item group and try again");
    } else if (!$("#editedItemSubgroup").val()) {
      toastr.info("Please enter a valid item_subgroup and try again");
    } else {
      self.loading = true;
      RiotControl.trigger('edit_item_subgroup', e.item.item_subgroup.item_subgroup_id, $("#editedItemGroup").val(), $("#editedItemSubgroup").val());
    }
  }
};

self.cancelOperation = function (e) {
  self.item_subgroups.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

RiotControl.on('item_subgroups_changed', function (item_subgroups) {
  self.addItemSubgroupInput.value = '';
  self.loading = false;
  self.item_subgroups = item_subgroups;
  self.filteredItemSubgroups = item_subgroups;
  self.update();
});
RiotControl.on('item_groups_changed', function (item_groups) {
  self.item_groups = item_groups;
  self.update();
});
});

riot.tag2('loading-bar', '<div class="load-bar"> <div class="bar"></div> <div class="bar"></div> <div class="bar"></div> </div>', '.load-bar { position: fixed; top: 40px; left: 0; width: 100%; height: 6px; background-color: #A5D6A7; } .bar { content: ""; display: inline; position: absolute; width: 0; height: 100%; left: 50%; text-align: center; } .bar:nth-child(1) { background-color: #00BCD4; animation: loading 3s linear infinite; } .bar:nth-child(2) { background-color: #FFEB3B; animation: loading 3s linear 1s infinite; } .bar:nth-child(3) { background-color: #FF5722; animation: loading 3s linear 2s infinite; } @keyframes loading { from {left: 50%; width: 0;z-index:100;} 33.3333% {left: 0; width: 100%;z-index: 10;} to {left: 0; width: 100%;} }', '', function(opts) {
});
riot.tag2('location-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Locations</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchLocation" class="form-control" placeholder="search" onkeyup="{filterLocations}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshLocations}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"><input type="text" name="addLocationCodeInput" placeholder="Code" class="form-control" onkeyup="{addEnter}"></td> <td><input type="text" name="addLocationInput" placeholder="Location" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{addLocation}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th onclick="{sortByCode}" style="cursor: pointer;"> Code <hand if="{activeSort==\'sortCode\'}"> <i class="material-icons" show="{sortCode}">arrow_upward</i> <i class="material-icons" hide="{sortCode}">arrow_downward</i> <hand> </th> <th onclick="{sortByLocation}" style="cursor: pointer;"> Location <hand if="{activeSort==\'sortlocation\'}"> <i class="material-icons" show="{sortlocation}">arrow_upward</i> <i class="material-icons" hide="{sortlocation}">arrow_downward</i> </hand> </th> <th class="two-buttons"></th> </tr> <tr each="{loc, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td if="{!loc.confirmEdit && !loc.confirmDelete}"> {loc.location_code} </td> <td if="{!loc.confirmEdit && !loc.confirmDelete}"> {loc.location} </td> <td colspan="2" if="{loc.confirmDelete}"><span class="delete-question">Are you sure?</span></td> <td if="{loc.confirmEdit}"> <input type="text" id="editedLocationCode" autofocus class="form-control" value="{loc.location_code}" onkeyup="{editEnter.bind(this)}"> </td> <td if="{loc.confirmEdit}"> <input type="text" id="editedLocation" class="form-control" value="{loc.location}" onkeyup="{editEnter.bind(this)}"> </td> <td> <div class="table-buttons" hide="{loc.confirmDelete ||  loc.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{loc.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{loc.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="4"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortlocation = true;
  self.sortCode = true;
  self.activeSort = '';
  self.update();
  RiotControl.trigger('read_locations');
});

// RiotControl.on('login_changed', function(login_status) {
//   if(!login_status.role || login_status.role == 'FAIL'){
//     riot.route("/home")
//   }
// })

self.refreshLocations = function () {
  self.locations = [];
  self.searchLocation.value;
  RiotControl.trigger('read_locations');
};

self.filterLocations = function () {
  if (!self.searchLocation) return;
  self.filteredLocations = self.locations.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchLocation.value.toLowerCase()) >= 0;
  });
  self.paginate(self.filteredLocations, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.locations.map(function (c) {
    if (c.location_id != e.item.loc.location_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.locations.map(function (c) {
    if (c.location_id != e.item.loc.location_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_location', e.item.loc.location_id);
};

self.edit = function (e) {
  if (!$("#editedLocationCode").val()) {
    toastr.info("Please enter a valid location Code and try again");
  } else if (!$("#editedLocation").val()) {
    toastr.info("Please enter a valid location and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_location', e.item.loc.location_id, $("#editedLocationCode").val(), $("#editedLocation").val());
  }
};

self.addLocation = function () {
  console.log('calling ad location');
  if (!self.addLocationCodeInput.value) {
    toastr.info("Please enter a valid location Code and try again");
  } else if (!self.addLocationInput.value) {
    toastr.info("Please enter a valid location and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_location', self.addLocationCodeInput.value, self.addLocationInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.addLocation();
  }
};

self.editEnter = function (e) {
  if (e.which == 13) {
    self.edit(e);
  }
};

self.cancelOperation = function (e) {
  self.locations.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};
/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredLocations, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredLocations, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

RiotControl.on('locations_changed', function (locations) {
  self.addLocationCodeInput.value = '';
  self.addLocationInput.value = '';
  self.loading = false;
  self.locations = locations;
  self.filteredLocations = locations;

  self.items_per_page = 10;
  self.callPaging();
  self.update();
});

self.callPaging = function () {
  self.paginate(self.filteredLocations, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page);
};

/*sorting Starts*/
self.sortByLocation = function () {

  if (self.sortlocation == true) {
    self.locations.sort(function (a, b) {
      return a.location.toUpperCase().localeCompare(b.location.toUpperCase());
    });
  } else {
    self.locations.reverse();
  }

  self.activeSort = 'sortlocation';
  self.filteredLocations = self.locations;
  self.callPaging();

  self.update();
  self.sortlocation = !self.sortlocation;
};

self.sortByCode = function () {

  if (self.sortCode == true) {
    self.locations.sort(function (a, b) {
      return a.location_code.toUpperCase().localeCompare(b.location_code.toUpperCase());
    });
  } else {
    self.locations.reverse();
  }

  self.activeSort = 'sortCode';
  self.filteredLocations = self.locations;
  self.callPaging();

  self.update();
  self.sortCode = !self.sortCode;
};

/*sorting Ends*/
});

riot.tag2('main-nav', '<div class="navbar navbar-fixed-top navbar-dark bg-primary" role="navigation"> <a class="navbar-brand" href="#">NTC ERP</a> <ul class="nav navbar-nav" if="{showNavItems}"> <li class="{active: selected_nav_item == \'masters\'} nav-item"> <a class="nav-item nav-link" href="#/masters">Masters</a> </li> <li class="{active: selected_nav_item == \'indents\'} nav-item"> <a class="nav-item nav-link " href="#/indents">Indent</a> </li> <li class="{active: selected_nav_item == \'po\'} nav-item"> <a class="nav-item nav-link " href="#/po">PO</a> </li> <li class="{active: selected_nav_item == \'docket\'} nav-item"> <a class="nav-item nav-link " href="#/docket">Docket</a> </li> <li class="{active: selected_nav_item == \'rejecttoparty\'} nav-item"> <a class="nav-item nav-link " href="#/rejecttoparty">Reject to Party</a> </li> <li class="{active: selected_nav_item == \'issuetodepartment\'} nav-item"> <a class="nav-item nav-link " href="#/issuetodepartment">Issue to Department</a> </li> <li class="{active: selected_nav_item == \'returntostock\'} nav-item"> <a class="nav-item nav-link " href="#/returntostock">Return to Stock</a> </li> <li class="{active: selected_nav_item == \'openingstock\'} nav-item"> <a class="nav-item nav-link " href="#/openingstock">Opening Stock</a> </li> <li class="{active: selected_nav_item == \'receive\'} nav-item"> <a class="nav-item nav-link " href="#/receive">Receive</a> </li> <li class="nav-item dropdown"> <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">Reports</a> <ul class="nav navbar-nav dropdown-menu"> <li class="dropdown-submenu"> <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#">Docket </a> <ul class="nav navbar-nav dropdown-menu"> <li><a class="dropdown-item" href="#/docket-register-date-wise">Docket Register Date Wise</a></li> <li><a class="dropdown-item" href="#/docket-register-party-wise">Docket Register Party Wise</a></li> <li><a class="dropdown-item" href="#/docket-register-item-wise">Docket Register Item Wise</a></li> </ul> </li> <li class="dropdown-submenu"> <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#">Stock </a> <ul class="nav navbar-nav dropdown-menu"> <li><a class="dropdown-item" href="#/stock-date-wise">Stock Date Wise</a></li> <li><a class="dropdown-item" href="#/stock-valuation-summary-store-type-wise">Stock valuation Summary(Store Type Wise)</a></li> <li><a class="dropdown-item" href="#/stock-ledger-avg-valuation-in-details">Stock Ledger Avg Valuation In Details</a></li> <li><a class="dropdown-item" href="#/stock-ledger-avg-valuation-in-summry">Stock Ledger Avg Valuation In Summary</a></li> <li><a class="dropdown-item" href="#/stock-valuation-summary-location-wise">Stock valuation Summary(Location Wise)</a></li> </ul> </li> <li class="dropdown-submenu"> <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#">Issue to Department </a> <ul class="nav navbar-nav dropdown-menu"> <li><a class="dropdown-item" href="#/issuetodepartment-date-wise">Date Wise</a></li> <li><a class="dropdown-item" href="#/issuetodepartment-item-wise">Item Wise</a></li> <li><a class="dropdown-item" href="#/issuetodepartment-dept-wise">Department Wise</a></li> <li><a class="dropdown-item" href="#/issuetodepartment-location-wise">Location Wise</a></li> <li><a class="dropdown-item" href="#/issuetodepartment-chargehead-wise">Charge Head Wise</a></li> </ul> </li> <li class="dropdown-submenu"> <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#">Reject to party </a> <ul class="nav navbar-nav dropdown-menu"> <li><a class="dropdown-item" href="#/rejecttoparty-date-wise">Date Wise</a></li> <li><a class="dropdown-item" href="#/rejecttoparty-docket-date-wise">Docket Date Wise</a></li> <li><a class="dropdown-item" href="#/rejecttoparty-item-wise">Item Wise</a></li> <li><a class="dropdown-item" href="#/rejecttoparty-party-wise">Party Wise</a></li> </ul> </li> <li class="dropdown-submenu"> <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#">Return to Stock </a> <ul class="nav navbar-nav dropdown-menu"> <li><a class="dropdown-item" href="#/returntostock-date-wise">Date Wise</a></li> <li><a class="dropdown-item" href="#/returntostock-item-wise">Item Wise</a></li> <li><a class="dropdown-item" href="#/returntostock-dept-wise">Department Wise</a></li> </ul> </li> <li class="dropdown-submenu"> <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#">Indent </a> <ul class="nav navbar-nav dropdown-menu"> <li><a class="dropdown-item" href="#/indent-date-wise">Indent Date Wise</a></li> <li><a class="dropdown-item" href="#/indent-report">Indent Report</a></li> <li><a class="dropdown-item" href="#/indent-item-wise">Indent Item Wise</a></li> </ul> </li> <li class="dropdown-submenu"> <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#">PO </a> <ul class="nav navbar-nav dropdown-menu"> <li><a class="dropdown-item" href="#/po-date-wise">PO Date Wise</a></li> <li><a class="dropdown-item" href="#/po-party-wise">PO Party Wise</a></li> <li><a class="dropdown-item" href="#/po-report">PO Report Pending</a></li> <li><a class="dropdown-item" href="#/po-report-supplied-materials">PO Report Supplied Materials</a></li> </ul> </li> <li class="dropdown-submenu"> <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#">stock Adjustment</a> <ul class="nav navbar-nav dropdown-menu"> <li><a class="dropdown-item" href="#/receive-for-stock-adjustment-report">Receive</a></li> </ul> </li> </ul> </li> <li class="pull-md-right power-button" if="{showNavItems}" onclick="{doLogout}"> <i class="material-icons" style="font-size:24px">power_settings_new</i> </li> <li class="pull-md-right power-button" if="{showNavItems}" onclick="{changePassword}" style=" margin-right: 10px;"> <i class="material-icons" style="font-size:24px">vpn_key</i> </li> </ul> </div> </nav> <div class="modal fade" id="passwordChangeModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Change Password</h4> </div> <div class="modal-body"> <form> <div class="form-group"> <label>User Name</label> <input type="text" id="userNameInput" class="form-control"> </div> <div class="form-group"> <label>Old Password</label> <input type="password" id="oldPasswordInput" class="form-control"> </div> <div class="form-group"> <label>New Password</label> <input type="password" id="newPasswordInput" class="form-control"> </div> <div class="form-group"> <label>Re-type New Password</label> <input type="password" id="newPasswordInput2" class="form-control"> </div> </form> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{savePassword}">Save changes</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
if (!opts.selected_nav_item) {
  self.selected_nav_item = 'home';
  self.showNavItems = false;
} else {
  self.selected_nav_item = opts.selected_nav_item;
  self.showNavItems = true;
}
self.username = undefined;

self.changePassword = function () {
  $("#passwordChangeModal").modal('show');
};

self.savePassword = function () {
  if (self.userNameInput.value == '') {
    toastr.error('Please enter username and try again');
    return;
  }

  if (self.oldPasswordInput.value == '') {
    toastr.error('Please enter old password and try again');
    return;
  }

  if (self.newPasswordInput.value == '') {
    toastr.error('Please enter new password and try again');
    return;
  }

  var str = self.newPasswordInput.value;
  var p = str.length;

  if (Number(p) < 5) {
    toastr.error('new password lenth must be >4');
    return;
  }

  if (self.newPasswordInput.value != self.newPasswordInput2.value) {
    toastr.error('new password not match');
    return;
  }

  RiotControl.trigger('change_password', self.userNameInput.value, self.oldPasswordInput.value, self.newPasswordInput.value);
};

self.doLogout = function () {
  console.log("calling logout");
  RiotControl.trigger('logout');
};

RiotControl.on('login_changed', function (login_status) {
  console.log("calling me in nav tag");
  self.username = login_status.username;
  if (login_status.role != 'FAIL') {
    self.showNavItems = true;
  }
  self.update();
});

RiotControl.on('logOut_changed', function () {
  console.log("logged out");
  self.showNavItems = false;
  riot.route("/");
});

RiotControl.on('change_password_completed', function (count) {
  console.log("Password changed");
  if (Number(count) == 1) {
    self.userNameInput.value = '';
    self.oldPasswordInput.value = '';
    self.newPasswordInput.value = '';
    self.newPasswordInput2.value = '';
    $("#passwordChangeModal").modal('hide');
    toastr.info('Password Changed Successfully');
    self.update();
  } else {
    toastr.error('Please check your old username and password');
  }
});
});

riot.tag2('masters', '<div class="col-sm-12"> <ul class="nav nav-pills" style="margin:20px 0"> <li class="nav-item"> <a class="nav-link {active: selected_master == \'department-master\'}" href="#masters/department-master">Department</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'location-master\'}" href="#masters/location-master">Location</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'chargehead-master\'}" href="#masters/chargehead-master">Charge Head</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'stock-type-master\'}" href="#masters/stock-type-master">Stock Type</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'tax-master\'}" href="#masters/tax-master">Tax</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'uom-master\'}" href="#masters/uom-master">UOM</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'condition-master\'}" href="#masters/condition-master">T & C</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'item-group\'}" href="#masters/item-group">Item Group</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'party-master\'}" href="#masters/party-master">Party</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'item\'}" href="#masters/item">Material</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'financial-year\'}" href="#masters/financial-year">Financial Year</a> </li> <li class="nav-item"> <a class="nav-link {active: selected_master == \'db-backup\'}" href="#masters/db-backup">Backup</a> </li> </ul> </div> <div id="master-view"></div>', '', '', function(opts) {
'use strict';

var self = this;
if (!opts.selected_master) {
  self.selected_master = 'department-master';
} else {
  self.selected_master = opts.selected_master;
}
});

riot.tag2('opening-stock', '<loading-bar if="{loading}"></loading-bar> <div show="{opening_stock_view ==\'opening_stock_home\'}"> <div class="container-fulid"> <div class="row"> <div class="col-md-6"> <h4>Opening Stock</h4> </div> <div class="col-md-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchOpeningStock" class="form-control" placeholder="search" onkeyup="{filterOpeningStocks}" style="width:200px;margin-right:10px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{showOpeningEntryForm}"><i class="material-icons">add</i></button> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter">Item Group</label> <input id="selectItemGroupFilter" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px"> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="searchMaterialInput">Search Material</label> <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{getOpeningStock}" style="margin-top: 32px;">Get Material</button> </div> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Material</th> <th>UOM</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Location</th> <th>Remarks</th> <th>Date</th> <th></th> </tr> <tr each="{c, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{c.item_name}-(Code:{c.item_id})</td> <td class="text-center">{c.uom_code}</td> <td class="text-center">{c.qty}</td> <td class="text-center">{c.rate}</td> <td class="text-center">{c.running_amount}</td> <td class="text-center">{c.location}</td> <td class="text-center">{c.remarks}</td> <td class="text-center">{c.transaction_date}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{edit}"><i class="material-icons">create</i></button> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="8"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{opening_stock_view ==\'opening_stock_entry\'}"> <h4>{title} Opening Stock</h4> <form> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label for="openingStockDateInput">Date</label> <input type="text" class="form-control" id="openingStockDateInput" placeholder="DD/MM/YYYY"> </div> </div> </div> <div class="row bgColor" show="{title==\'Add\'}"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter1">Item Group</label> <input id="selectItemGroupFilter1" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter1">Stock Type</label> <select name="selectStockTypeFilter1" class="form-control" style="min-width:250px"> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="searchMaterialInput1">Search Material</label> <input type="text" name="searchMaterialInput1" class="form-control" style="min-width:250px"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{getMaterial}" style="margin-top: 32px;">Get Material</button> </div> </div> </div> <div class="row"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Material</th> <th>UOM</th> <th>Location</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Remarks</th> <th show="{title==\'Add\'}"></th> </tr> <tr each="{cat, i in selectedMaterialsArray}"> <td>{i+1}</td> <td>{cat.item_name}</td> <td>{cat.uom_code}</td> <td> <select id="{\'locationInput\' + cat.item_id}" class="form-control"> <option></option> <option each="{locations}" value="{location}">{location}</option> </select> </td> <td> <input type="text" id="{\'qtyInput\' + cat.item_id}" value="{cat.qty}" onchange="{calculateAmount}" class="form-control"> </td> <td> <input type="text" id="{\'rateInput\' + cat.item_id}" value="{cat.rate}" onchange="{calculateAmount}" class="form-control"> </td> <td>{cat.running_amount}</td> <td> <input type="text" id="{\'remarksInput\' + cat.item_id}" value="{cat.remarks}" class="form-control"> </td> <td show="{title==\'Add\'}"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeSelectedMaterial.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </form> <div class="col-sm-12"> <button type="button" class="btn btn-primary pull-sm-right" onclick="{save}">Save changes</button> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closeAddOpeningStock}" style=" margin-right: 10px;">Close</button> </div> </div> <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Select Material</h4> <div class="text-xs-right form-inline"> <input type="search" name="searchMaterials" class="form-control" placeholder="search" onkeyup="{filterMaterials}" style="width:200px"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterial}">Submit</button> </div> </div> <div class="modal-body"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th></th> <th>Material</th> </tr> <tr each="{it, i in pagedDataMaterials}"> <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td> <td><input type="checkbox" class="form-control" __checked="{it.selected}" onclick="{parent.toggle}"></td> <td>{it.item_name}-(Code:{it.item_id})</td> </tr> <tfoot class="no-print"> <tr> <td colspan="10"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPageNew}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select_new" onchange="{changePageNew}"> <option each="{pno in page_array_new}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterial}">Submit</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  //RiotControl.trigger('login_init')
  self.items_per_page = 10;
  self.items_per_page_new = 10;
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_item_groups');
  RiotControl.trigger('read_locations');
  self.opening_stock_view = 'opening_stock_home';
  dateFormat('openingStockDateInput');
  self.update();
});

self.showOpeningEntryForm = function () {
  self.title = 'Add';
  self.opening_stock_view = 'opening_stock_entry';
  self.selectedMaterialsArray = [];
  $("#openingStockDateInput").prop("disabled", false);
  self.update();
};
self.closeAddOpeningStock = function () {
  self.opening_stock_view = 'opening_stock_home';
};

// self.uploadCSV = ($files) => {}
self.getMaterial = function () {
  self.materials = [];
  if (self.searchMaterialInput1.value == '') {
    if (self.selectItemGroupFilter1.value == '') {
      toastr.info("Please select Item Group and try again");
      return;
    }
    RiotControl.trigger('read_items_for_opening_stock', self.selected_item_group_code1, self.selectStockTypeFilter1.value);
  } else {
    RiotControl.trigger('search_items_for_opening_stock', self.searchMaterialInput1.value, self.selectStockTypeFilter1.value);
  }
};

self.selectedMaterial = function () {
  self.materials = self.materials.map(function (m) {
    if (m.selected) {
      self.selectedMaterialsArray.push(m);
    }
  });
  //assign location name to selected array
  $("#itemModal").modal('hide');
  self.update();
  self.selectedMaterialsArray.map(function (i) {
    var locationInput = '#locationInput' + i.item_id;
    $(locationInput).val(i.location);
  });

  self.update();
};

self.removeSelectedMaterial = function (i, e) {
  var tempSelectedMaterialsArray = self.selectedMaterialsArray.filter(function (c) {
    return c.item_id != i.item_id;
  });

  self.selectedMaterialsArray = tempSelectedMaterialsArray;
};

self.toggle = function (e) {
  var item = e.item.it;
  item.selected = !item.selected;

  /*updating selected materials*/
  /*self.materials = self.materials.map(m => {
    if(m.item_id == item.it.item_id){
     m.item_id=m.item_id
     m.item_name=m.item_name
     m.item_group_code=m.item_group_code
     m.uom_code=m.uom_code
     m.uom_id=m.uom_id
     m.uom=m.uom
     m.max_level=m.max_level
     m.reorder_level=m.reorder_level
     m.item_description=m.item_description
     m.category_code=m.category_code
     m.stock_type_code=m.stock_type_code
     m.min_level=m.min_level
     m.reorder_qty=m.reorder_qty
     m.selected=item.selected
      m.qty=''
     m.remarks=''
     }
    m.confirmEdit = false
    return m
  })
  return true*/
};

self.excelExport = function () {
  var link = "csv/opening_stock_csv.php?item_group_code=" + self.selected_item_group_code + "&stock_type_code=" + self.selectStockTypeFilter.value;

  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.calculateAmount = function (e) {
  var qtyInput = '#qtyInput' + e.item.cat.item_id;
  var qty = $(qtyInput).val();

  var rateInput = '#rateInput' + e.item.cat.item_id;
  var rate = $(rateInput).val();

  e.item.cat.running_amount = Number(Number(qty) * Number(rate)).toFixed(3);
};

self.edit = function (e) {
  console.log(e.item.c);
  self.title = 'Edit';
  self.opening_stock_view = 'opening_stock_entry';
  self.selectedMaterialsArray = [];
  self.selectedMaterialsArray.push(e.item.c);
  self.openingStockDateInput.value = e.item.c.transaction_date;
  $("#openingStockDateInput").prop("disabled", true);
  self.update();
  self.selectedMaterialsArray.map(function (i) {
    var locationInput = '#locationInput' + i.item_id;
    $(locationInput).val(i.location);
  });
};

self.save = function () {
  if (self.openingStockDateInput.value == '') {
    toastr.info("Please Entet Openign Stock Date");
    return;
  }

  var str = self.openingStockDateInput.value;
  var d = str.split("/");
  var po_date = moment([d[2].trim() + d[1].trim() + d[0].trim()], 'YYYYMMDD');
  var toDay = moment().format('YYYYMMDD');

  var from = moment(po_date, 'YYYYMMDD');
  var to = moment(toDay, 'YYYYMMDD');
  var differnece = to.diff(from, 'days');

  if (differnece < 0) {
    toastr.error("Opening date can not be greater than today");
    return;
  }

  var error = '';
  var count = 1;
  self.selectedMaterialsArray.map(function (i) {
    var locationInput = '#locationInput' + i.item_id;
    i.location = $(locationInput).val();

    if (i.location == '') {
      error = error + 'Please select location' + count + ', ';
    }

    var qtyInput = '#qtyInput' + i.item_id;
    i.qty = $(qtyInput).val();

    if (i.qty == '') {
      error = error + 'Please select qty' + count + ', ';
    }

    var rateInput = '#rateInput' + i.item_id;
    i.rate = $(rateInput).val();

    var remarksInput = '#remarksInput' + i.item_id;
    i.remarks = $(remarksInput).val();

    count++;
  });

  if (self.selectedMaterialsArray.length == 0) {
    toastr.info("No item to insert");
    return;
  }

  var obj = {};
  obj['opening_stock_date'] = self.openingStockDateInput.value;
  if (error != '') {
    toastr.info(error);
  } else if (self.title == 'Add') {
    //add data to database after validation
    self.loading = true;
    RiotControl.trigger('add_opening_stock', self.selectedMaterialsArray, obj);
  } else if (self.title == 'Edit') {
    self.loading = true;
    RiotControl.trigger('edit_opening_stock', self.selectedMaterialsArray, obj);
  }
};

self.getOpeningStock = function () {
  self.materials = [];
  if (self.searchMaterialInput.value == '') {
    if (self.selectItemGroupFilter.value == '') {
      //toastr.info("Please select Item Group and try again")
      //return;
      self.selected_item_group_code = '';
    }
    RiotControl.trigger('read_opening_stock_items', self.selected_item_group_code, self.selectStockTypeFilter.value);
  } else {
    RiotControl.trigger('search_items_of_opening_stock', self.searchMaterialInput.value, self.selectStockTypeFilter.value);
  }
};

self.filterOpeningStocks = function () {
  if (!self.searchOpeningStock) return;
  self.filteredOpeningStocks = self.openingStocks.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchOpeningStock.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredOpeningStocks, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page);
};

self.filterMaterials = function () {
  if (!self.searchMaterials) return;
  self.filteredMaterials = self.materials.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase()) >= 0;
  });

  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
};

/*method change callback from store*/
RiotControl.on('item_groups_changed', function (item_groups) {
  //self.item_groups = item_groups
  $('#selectItemGroupFilter').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
    }
  });

  $('#selectItemGroupFilter1').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code1 = ui.item.item_group_code;
    }
  });
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('locations_changed', function (locations) {
  self.locations = locations;
  self.update();
});

RiotControl.on('search_items_of_opening_stock_changed', function (items) {
  //$("#itemModal").modal('show')
  self.loading = false;
  self.openingStocks = [];
  self.openingStocks = items;
  self.searchMaterialInput.value = '';

  self.filteredOpeningStocks = self.openingStocks;

  console.log(self.filteredOpeningStocks);

  self.paginate(self.filteredOpeningStocks, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page);
  self.update();
});

RiotControl.on('read_opening_stock_items_changed', function (items) {
  self.loading = false;
  self.openingStocks = [];
  self.openingStocks = items;

  self.filteredOpeningStocks = self.openingStocks;

  self.paginate(self.filteredOpeningStocks, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page);
  self.update();
});

RiotControl.on('add_opening_stock_changed', function () {
  self.loading = false;
  self.opening_stock_view = 'opening_stock_home';
  self.getOpeningStock();
  self.update();
});

RiotControl.on('edit_opening_stock_changed', function () {
  self.loading = false;
  self.opening_stock_view = 'opening_stock_home';
  self.getOpeningStock();
  self.update();
});

RiotControl.on('read_items_for_opening_stock_changed', function (items) {
  $("#itemModal").modal('show');
  self.loading = false;
  self.materials = items;

  self.filteredMaterials = self.materials;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.update();
});

RiotControl.on('search_items_for_opening_stock_changed', function (items) {
  $("#itemModal").modal('show');
  self.loading = false;
  self.materials = items;
  self.searchMaterialInput1.value = '';

  self.filteredMaterials = self.materials;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredOpeningStocks, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/**************** pagination for items*******************/
self.getPageDataNew = function (full_data, page_no, items_per_page_new) {
  var start_index = (page_no - 1) * items_per_page_new;
  var end_index = page_no * items_per_page_new;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate_new = function (full_data, items_per_page_new) {
  var total_pages = Math.ceil(full_data.length / items_per_page_new);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array_new = pages;
  self.current_page_no_new = 1;
  self.update();
};
self.changePageNew = function (e) {
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, e.target.value, self.items_per_page_new);
  self.current_page_no_new = e.target.value;
};
self.changeItemsPerPageNew = function (e) {
  self.items_per_page_new = e.target.value;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.current_page_no_new = 1;
  self.page_select_new.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('party-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Party</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchParty" class="form-control" placeholder="search" onkeyup="{filterPartyes}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshParties}"><i class="material-icons">refresh</i></button> <button class="btn btn-secondary" __disabled="{loading}" onclick="{showPartyModal}"><i class="material-icons">add</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Code</th> <th onclick="{sortByParty}" style="cursor: pointer;width:200px"> Party <hand if="{activeSort==\'sortparty\'}"> <i class="material-icons" show="{sortparty}">arrow_upward</i> <i class="material-icons" hide="{sortparty}">arrow_downward</i> </hand> </th> <th>Address</th> <th>Phone(O)</th> <th>Phone(R)</th> <th>Mobile</th> <th>Email</th> <th style="width:150px"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{cat.party_code}</td> <td>{cat.party_name}</td> <td>{cat.address}</td> <td>{cat.phone_office}</td> <td>{cat.phone_residance}</td> <td>{cat.mobile}</td> <td>{cat.email}</td> <td> <div class="table-buttons" hide="{cat.confirmDelete ||  cat.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{view.bind(this, cat)}"><i class="material-icons">visibility</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit.bind(this, cat)}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{cat.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> <div class="modal fade" id="partyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">{title} Party</h4> </div> <div class="modal-body"> <div class="row"> <div class="col-md-6"> <div class="form-group row"> <label for="partyCodeInput" class="col-xs-4 col-form-label">Party Code</label> <div class="col-xs-8"> <input class="form-control" type="text" id="partyCodeInput"> </div> </div> <div class="form-group row"> <label for="addLine1Input" class="col-xs-4 col-form-label">AddLine1</label> <div class="col-xs-8"> <input class="form-control" type="text" id="addLine1Input"> </div> </div> <div class="form-group row"> <label for="cityInput" class="col-xs-4 col-form-label">City</label> <div class="col-xs-8"> <input class="form-control" type="text" id="cityInput"> </div> </div> <div class="form-group row"> <label for="pinInput" class="col-xs-4 col-form-label">PinCode</label> <div class="col-xs-8"> <input class="form-control" type="text" id="pinInput"> </div> </div> <div class="form-group row"> <label for="phoneOfficeInput" class="col-xs-4 col-form-label">Phone Office</label> <div class="col-xs-8"> <input class="form-control" type="text" id="phoneOfficeInput"> </div> </div> <div class="form-group row"> <label for="emailInput" class="col-xs-4 col-form-label">Email</label> <div class="col-xs-8"> <input class="form-control" type="text" id="emailInput"> </div> </div> <div class="form-group row"> <label for="cstInput" class="col-xs-4 col-form-label">Cst No</label> <div class="col-xs-8"> <input class="form-control" type="text" id="cstInput"> </div> </div> <div class="form-group row"> <label for="panInput" class="col-xs-4 col-form-label">Pan No</label> <div class="col-xs-8"> <input class="form-control" type="text" id="panInput"> </div> </div> </div> <div class="col-md-6"> <div class="form-group row"> <label for="partyNameInput" class="col-xs-4 col-form-label">Name</label> <div class="col-xs-8"> <input class="form-control" type="text" id="partyNameInput"> </div> </div> <div class="form-group row"> <label for="addLine2Input" class="col-xs-4 col-form-label">AddLine2</label> <div class="col-xs-8"> <input class="form-control" type="text" id="addLine2Input"> </div> </div> <div class="form-group row"> <label for="stateInput" class="col-xs-4 col-form-label">State</label> <div class="col-xs-8"> <input class="form-control" type="text" id="stateInput"> </div> </div> <div class="form-group row"> <label for="mobileInput" class="col-xs-4 col-form-label">Mobile</label> <div class="col-xs-8"> <input class="form-control" type="text" id="mobileInput"> </div> </div> <div class="form-group row"> <label for="phoneResidenceInput" class="col-xs-4 col-form-label">Phone Residence</label> <div class="col-xs-8"> <input class="form-control" type="text" id="phoneResidenceInput"> </div> </div> <div class="form-group row"> <label for="vatInput" class="col-xs-4 col-form-label">Vat No</label> <div class="col-xs-8"> <input class="form-control" type="text" id="vatInput"> </div> </div> <div class="form-group row"> <label for="exciseInput" class="col-xs-4 col-form-label">Excise No</label> <div class="col-xs-8"> <input class="form-control" type="text" id="exciseInput"> </div> </div> <div class="form-group row"> <label for="gstInput" class="col-xs-4 col-form-label">GSTIN</label> <div class="col-xs-8"> <input class="form-control" type="text" id="gstInput"> </div> </div> </div> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{save}">Save changes</button> </div> </div> </div> </div> <div class="modal fade" id="partyModalView" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body"> <div class="row"> <div class="col-md-6"> <div class="form-group row"> <label class="col-xs-4 ">Party Code : </label> <div class="col-xs-8"> {partyView.party_code} </div> </div> <div class="form-group row"> <label for="addLine1Input" class="col-xs-4">AddLine1 : </label> <div class="col-xs-8"> {partyView.add_line1} </div> </div> <div class="form-group row"> <label for="cityInput" class="col-xs-4">City : </label> <div class="col-xs-8"> {partyView.city} </div> </div> <div class="form-group row"> <label for="pinInput" class="col-xs-4">PinCode : </label> <div class="col-xs-8"> {partyView.pin} </div> </div> <div class="form-group row"> <label for="phoneOfficeInput" class="col-xs-4">Phone Office : </label> <div class="col-xs-8"> {partyView.phone_office} </div> </div> <div class="form-group row"> <label for="emailInput" class="col-xs-4">Email : </label> <div class="col-xs-8"> {partyView.email} </div> </div> <div class="form-group row"> <label for="cstInput" class="col-xs-4">Cst No : </label> <div class="col-xs-8"> {partyView.cst} </div> </div> <div class="form-group row"> <label for="panInput" class="col-xs-4">Pan No : </label> <div class="col-xs-8"> {partyView.pan} </div> </div> </div> <div class="col-md-6"> <div class="form-group row"> <label for="partyNameInput" class="col-xs-4">Name : </label> <div class="col-xs-8"> {partyView.party_name} </div> </div> <div class="form-group row"> <label for="addLine2Input" class="col-xs-4">AddLine2 : </label> <div class="col-xs-8"> {partyView.add_line2} </div> </div> <div class="form-group row"> <label for="stateInput" class="col-xs-4">State : </label> <div class="col-xs-8"> {partyView.state} </div> </div> <div class="form-group row"> <label for="mobileInput" class="col-xs-4">Mobile : </label> <div class="col-xs-8"> {partyView.mobile} </div> </div> <div class="form-group row"> <label for="phoneResidenceInput" class="col-xs-4">Phone Residence:</label> <div class="col-xs-8"> {partyView.phone_residence} </div> </div> <div class="form-group row"> <label for="vatInput" class="col-xs-4">Vat No : </label> <div class="col-xs-8"> {partyView.vat} </div> </div> <div class="form-group row"> <label for="exciseInput" class="col-xs-4">Excise No : </label> <div class="col-xs-8"> {partyView.excise} </div> </div> <div class="form-group row"> <label for="gstInput" class="col-xs-4">GSTIN : </label> <div class="col-xs-8"> {partyView.gst} </div> </div> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortparty = true;
  self.activeSort = '';
  self.update();
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_parties');
});

self.refreshParties = function () {
  self.parties = [];
  self.searchParty.value;
  RiotControl.trigger('read_parties');
};

self.filterPartyes = function () {
  if (!self.searchParty) return;
  self.filteredParties = self.parties.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.parties.map(function (c) {
    if (c.party_id != e.item.cat.party_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_party', e.item.cat.party_id);
};

self.edit = function (t, e) {
  self.title = 'Edit';
  $("#partyModal").modal('show');

  self.partyCodeInput.value = t.party_code;
  self.addLine1Input.value = t.add_line1;
  self.cityInput.value = t.city;
  self.pinInput.value = t.pin;
  self.phoneOfficeInput.value = t.phone_office;
  self.emailInput.value = t.email;
  self.cstInput.value = t.cst;
  self.panInput.value = t.pan;
  self.partyNameInput.value = t.party_name;
  self.addLine2Input.value = t.add_line2;
  self.stateInput.value = t.state;
  self.mobileInput.value = t.mobile;
  self.phoneResidenceInput.value = t.phone_residence;
  self.vatInput.value = t.vat;
  self.exciseInput.value = t.excise;
  self.gstInput.value = t.gst;
  self.party_id = t.party_id; // id to update the item
};

self.view = function (t, e) {
  $("#partyModalView").modal('show');

  self.partyView = t;
};

self.save = function () {
  /*if(!self.partyCodeInput.value){
    toastr.info("Please enter a valid Party Code and try again")
    return
  }*/
  if (!self.partyNameInput.value) {
    toastr.info("Please enter a valid Party Name try again");
    return;
  }

  var obj = {};
  obj['partyCode'] = self.partyCodeInput.value;
  obj['addLine1'] = self.addLine1Input.value;
  obj['city'] = self.cityInput.value;
  obj['pin'] = self.pinInput.value;
  obj['phoneOffice'] = self.phoneOfficeInput.value;
  obj['email'] = self.emailInput.value;
  obj['cst'] = self.cstInput.value;
  obj['pan'] = self.panInput.value;
  obj['partyName'] = self.partyNameInput.value;
  obj['addLine2'] = self.addLine2Input.value;
  obj['state'] = self.stateInput.value;
  obj['mobile'] = self.mobileInput.value;
  obj['phoneResidence'] = self.phoneResidenceInput.value;
  obj['vat'] = self.vatInput.value;
  obj['excise'] = self.exciseInput.value;
  obj['gst'] = self.gstInput.value;

  if (self.title == 'Add') {
    //add data to database after validation
    self.loading = true;
    RiotControl.trigger('add_party', obj);
  } else if (self.title == 'Edit') {
    self.loading = true;
    obj['party_id'] = self.party_id;
    RiotControl.trigger('edit_party', obj);
  }
};

self.cancelOperation = function (e) {
  self.parties.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

self.showPartyModal = function () {
  self.title = 'Add';
  $("#partyModal").modal('show');
};

RiotControl.on('parties_changed', function (parties) {
  $("#partyModal").modal('hide');
  /*self.partyCode.value=''
  self.partyValue.value=''
  self.partyType.value=''
  self.partyRate.value=''
  self.addRate.value=''*/
  self.loading = false;
  self.parties = parties;
  self.filteredParties = parties;

  self.items_per_page = 10;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/*sorting Starts*/
self.sortByParty = function () {

  if (self.sortparty == true) {
    self.parties.sort(function (a, b) {
      return a.party_name.toUpperCase().localeCompare(b.party_name.toUpperCase());
    });
  } else {
    self.parties.reverse();
  }

  self.activeSort = 'sortparty';
  self.filteredParties = self.parties;

  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);

  self.update();
  self.sortparty = !self.sortparty;
};

/*sorting Ends*/
});

riot.tag2('pending-po', '<div show="{pending_po_view ==\'pending_po_home\'}"> <div class="container-fulid"> <div class="row bgColor no-print"> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px" onchange="{getPendingPO}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>PO Number</th> <th>PO Date</th> <th>Material</th> <th>PO qty</th> <th>Docket Qty</th> </tr> <tr each="{it, i in pagedDataItems}" no-reorder> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td class="text-sm-center">{it.po_no}</td> <td class="text-sm-center">{it.po_date}</td> <td>{it.item_name}</td> <td class="text-sm-right">{it.po_qty}</td> <td class="text-sm-right">{it.docket_po_qty}</td> </tr> <tfoot class="no-print"> <tr> <td colspan="6"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  RiotControl.trigger('read_stock_types');
  self.pending_po_view = 'pending_po_home';
  self.update();
});

self.filterMaterials = function () {
  if (!self.searchItems) return;
  self.filteredMaterials = self.materials.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItems.value.toLowerCase()) >= 0;
  });
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);
};

self.getPendingPO = function () {
  console.log('call');
  self.materials = [];

  if (self.selectStockTypeFilter.value == '') {
    toastr.info("Please select Stock Type and try again");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_pending_po', self.selectStockTypeFilter.value);
};

/*method change callback from store*/

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('read_pending_po_changed', function (items) {
  console.log('herer');
  self.loading = false;
  self.materials = [];
  self.materials = items;

  self.filteredMaterials = items;

  self.items_per_page = 10;
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);

  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredMaterials, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('po-date-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">PO Date Wise</h4> <div show="{po_date_wise ==\'po_date_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="poRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="poRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="poRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="poRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="selectPOStatus">Status</label> <select name="selectPOStatus" class="form-control"> <option value=""></option> <option value="P">Pending</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readPO}" id="gobtn">Go</button> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{po_date_wise ==\'po_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>PO (Date Wise)<br> From {poFrom} To {poTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>PO Date: <b>{m.date}</b></h5> <div each="{d, j in m.pos}"> <table class="table print-small"> <tr> <td>PO No: <b>{d.poDetails.stock_type_code}-{d.poDetails.po_no}</b></td> <td>PO Date: <b>{d.poDetails.po_date}</b></td> <td>Quotatoin Ref: <b>{d.poDetails.quotatoin_ref}</b></td> </tr> <tr> <td>Indent No: <b>{d.poDetails.indent_ids}</b></td> <td colspan="2">Party: <b>{d.poDetails.party_name}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th class="serial-col"><strong>Sl</strong></th> <th style="width: 250px;"><strong>Description of Goods</strong></th> <th><strong>Quantity</strong></th> <th><strong>Unit</strong></th> <th><strong>Unit Price</strong></th> <th><strong>Total</strong></th> <th><strong>Discount</strong></th> <th show="{d.poDetails.p_and_f_charges}"><strong>P&F</strong></th> <th each="{dutyhead, a in d.dutyHeaders}"> <strong>{dutyhead.tax_name}</strong> </th> <th each="{taxhead, b in d.taxOneHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{taxhead, c in d.taxTwoHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{cesshead, d in d.cessHeaders}"> <strong>{cesshead.tax_name}</strong> </th> <th show="{d.poDetails.d.other_charges}"><strong>Other Charges</strong></th> <th><strong>Amount</strong></th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{i+1}</td> <td style="width: 250px;">{t.item_name},{t.description}-(Code No:{t.item_id})</td> <td class="text-sm-right">{t.po_qty}</td> <td class="text-sm-right">{t.uom_code}</td> <td class="text-sm-right">{t.unit_value}</td> <td class="text-sm-right">{t.amount}</td> <td class="text-sm-right">{t.discount_amount} ({t.discount_percentage}%)</td> <td class="text-sm-right" show="{d.poDetails.p_and_f_charges}">{t.p_and_f_charges}</td> <td each="{d, j in t.duties}" class="text-sm-right"> {d} </td> <td each="{tone, k in t.taxone}" class="text-sm-right"> {tone} </td> <td each="{ttwo, l in t.taxtwo}" class="text-sm-right"> {ttwo} </td> <td each="{c, m in t.cess}" class="text-sm-right"> {c} </td> <td class="text-sm-right" show="{d.poDetails.other_charges}">{t.other_charges}</td> <td class="text-sm-right">{t.item_total}</td> </tr> <tr> <td colspan="{d.poDetails.colspan}" align="right">Total</td> <td class="text-sm-right">{d.poDetails.total}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('poRegisterDateWiseStartDateInput');
  dateFormat('poRegisterDateWiseEndDateInput');
  self.po_date_wise = 'po_date_wise_home';
  self.update();
});

self.setStartDate = function () {
  self.sd = self.poRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.poRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.po_date_wise = 'po_date_wise_home';
};

self.readPO = function () {
  if (self.poRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.poRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }
  if (!self.selectPOStatus.value) {
    toastr.info("Please select PO Status and try again");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_po_date_wise', self.poRegisterDateWiseStartDateInput.value, self.poRegisterDateWiseEndDateInput.value, self.selectPOStatus.value);
};

RiotControl.on('read_po_date_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.po_date_wise = 'po_date_wise_report';
  self.poFrom = self.poRegisterDateWiseStartDateInput.value;
  self.poTo = self.poRegisterDateWiseEndDateInput.value;

  /*self.viewPurchaseOrders = []
  self.viewPurchaseOrders = v.materials
   self.viewPODetails = []
  self.viewPODetails = v.details

  self.dutyHeaders = []
  self.dutyHeaders = v.dutyHeaders
   self.taxOneHeaders = []
  self.taxOneHeaders = v.taxOneHeaders
   self.taxTwoHeaders = []
  self.taxTwoHeaders = v.taxTwoHeaders
   self.cessHeaders = []
  self.cessHeaders = v.cessHeaders
   self.viewPOConditions = []
  self.viewPOConditions = v.conditions*/
  self.update();
});
});

riot.tag2('po-item-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">PO (Item Wise)</h4> <div show="{po_item_wise ==\'po_item_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentStatus">Status</label> <select name="selectIndentStatus" class="form-control"> <option value=""></option> <option value="P">Pending</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReturn}" id="gobtn">Go</button> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{po_item_wise ==\'po_item_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>PO (Item Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Item: <b>{m.item}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Indent Date</th> <th>Indent Type</th> <th>Indent No</th> <th>Department</th> <th>Material Code</th> <th>Material</th> <th>UOM</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Remarks</th> <th>Stock</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.indent_date}</td> <td>{t.indent_type}</td> <td>{t.stock_type_code}-{t.indent_no}</td> <td>{t.department}</td> <td>{t.item_id}</td> <td>{t.item_name}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.unit_value}</td> <td style="text-align:right">{t.total_value}</td> <td>{t.remarks}</td> <td>{t.stock}</td> </tr> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.po_item_wise = 'po_item_wise_home';
  self.update();
});

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.po_item_wise = 'po_item_wise_home';
};

self.readReturn = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_po_item_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, self.selectIndentStatus.value);
};

RiotControl.on('read_po_item_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.po_item_wise = 'po_item_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});
});

riot.tag2('po-party-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">PO Party Wise</h4> <div show="{po_party_wise ==\'po_party_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="poRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="poRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="poRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="poRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readPO}" id="gobtn">Go</button> </div> </div> </div> <div class="row"> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchParty" class="form-control" placeholder="Search Party" onkeyup="{filterParties}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectParty.bind(this, cat)}"></td> <td>{cat.party_name}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Party</th> <th></th> </tr> <tr each="{cat, i in checkedParties}"> <td>{i+1}</td> <td>{cat.party_name}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeParty.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{po_party_wise ==\'po_party_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>PO (Party Wise)<br> From {poFrom} To {poTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Party: <b>{m.date}</b></h5> <div each="{d, j in m.pos}"> <table class="table print-small"> <tr> <td>PO No: <b>{d.poDetails.stock_type_code}-{d.poDetails.po_no}</b></td> <td>PO Date: <b>{d.poDetails.po_date}</b></td> <td>Quotatoin Ref: <b>{d.poDetails.quotatoin_ref}</b></td> </tr> <tr> <td>Indent No: <b>{d.poDetails.indent_ids}</b></td> <td colspan="2">Party: <b>{d.poDetails.party_name}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th class="serial-col"><strong>Sl</strong></th> <th style="width: 250px;"><strong>Description of Goods</strong></th> <th><strong>Quantity</strong></th> <th><strong>Unit</strong></th> <th><strong>Unit Price</strong></th> <th><strong>Total</strong></th> <th><strong>Discount</strong></th> <th show="{d.poDetails.p_and_f_charges}"><strong>P&F</strong></th> <th each="{dutyhead, a in d.dutyHeaders}"> <strong>{dutyhead.tax_name}</strong> </th> <th each="{taxhead, b in d.taxOneHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{taxhead, c in d.taxTwoHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{cesshead, d in d.cessHeaders}"> <strong>{cesshead.tax_name}</strong> </th> <th show="{d.poDetails.d.other_charges}"><strong>Other Charges</strong></th> <th><strong>Amount</strong></th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{i+1}</td> <td style="width: 250px;">{t.item_name},{t.description}-(Code No:{t.item_id})</td> <td class="text-sm-right">{t.po_qty}</td> <td class="text-sm-right">{t.uom_code}</td> <td class="text-sm-right">{t.unit_value}</td> <td class="text-sm-right">{t.amount}</td> <td class="text-sm-right">{t.discount_amount} ({t.discount_percentage}%)</td> <td class="text-sm-right" show="{d.poDetails.p_and_f_charges}">{t.p_and_f_charges}</td> <td each="{d, j in t.duties}" class="text-sm-right"> {d} </td> <td each="{tone, k in t.taxone}" class="text-sm-right"> {tone} </td> <td each="{ttwo, l in t.taxtwo}" class="text-sm-right"> {ttwo} </td> <td each="{c, m in t.cess}" class="text-sm-right"> {c} </td> <td class="text-sm-right" show="{d.poDetails.other_charges}">{t.other_charges}</td> <td class="text-sm-right">{t.item_total}</td> </tr> <tr> <td colspan="{d.poDetails.colspan}" align="right">Total</td> <td class="text-sm-right">{d.poDetails.total}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.checkedParties = [];
self.on("mount", function () {
  dateFormat('poRegisterDateWiseStartDateInput');
  dateFormat('poRegisterDateWiseEndDateInput');
  self.po_party_wise = 'po_party_wise_home';
  RiotControl.trigger('read_parties');
  self.update();
});

self.filterParties = function () {
  if (!self.searchParty) return;
  self.filteredParties = self.parties.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
};

self.selectParty = function (t, e) {
  self.checkedParties.push(t);

  self.parties = self.parties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.party_id != t.party_id;
  });
};

self.removeParty = function (t, e) {
  self.checkedParties = self.checkedParties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  console.log(self.checkedParties);

  self.parties.push(t);
  self.pagedDataItems.push(t);
};

self.setStartDate = function () {
  self.sd = self.poRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.poRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.po_party_wise = 'po_party_wise_home';
};

self.readPO = function () {
  if (self.poRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.poRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (selected_party_id == '') {
      selected_party_id = t.party_id;
    } else if (selected_party_id != '') {
      selected_party_id = selected_party_id + ',' + t.party_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_po_party_wise', self.poRegisterDateWiseStartDateInput.value, self.poRegisterDateWiseEndDateInput.value, selected_party_id);
};

RiotControl.on('read_po_party_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.po_party_wise = 'po_party_wise_report';
  self.poFrom = self.poRegisterDateWiseStartDateInput.value;
  self.poTo = self.poRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('parties_changed', function (parties, party) {
  self.loading = false;
  self.checkedParties = [];
  self.parties = party;
  self.filteredParties = party;

  self.items_per_page = 10;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('po-report-supplied-materials', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">PO Report Supplied Materials</h4> <div show="{po_date_wise ==\'po_report_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="poRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="poRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="poRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="poRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readPO}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchParty" class="form-control" placeholder="Search Party" onkeyup="{filterParties}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectParty.bind(this, cat)}"></td> <td>{cat.party_name}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Party</th> <th></th> </tr> <tr each="{cat, i in checkedParties}"> <td>{i+1}</td> <td>{cat.party_name}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeParty.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{po_date_wise ==\'po_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>PO (Date Wise)<br> From {poFrom} To {poTo}</div> <br> </center> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>PO No</th> <th>PO Date</th> <th>Party Name</th> <th>Item</th> <th>Location</th> <th>Unit</th> <th>PO Qty</th> <th>Rate</th> <th>PO Amount</th> <th>Docket No</th> <th>Docket Dt</th> <th>Bill No</th> <th>Bill Date</th> <th>Qty</th> <th>Amount</th> <th>Item Value</th> </tr> <tr each="{t, k in transactions}" no-reorder> <td>{k+1}</td> <td>{t.po_number}</td> <td>{t.po_date}</td> <td>{t.party_name}</td> <td>{t.item_name}-(Code:{t.item_id})</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.po_qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.po_amount}</td> <td>{t.stock_type_code}-{t.docket_no}</td> <td>{t.docket_date}</td> <td>{t.bill_no}</td> <td>{t.bill_date}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.amount}</td> <td style="text-align:right">{t.total}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('poRegisterDateWiseStartDateInput');
  dateFormat('poRegisterDateWiseEndDateInput');
  self.po_date_wise = 'po_report_home';
  RiotControl.trigger('read_parties');
  RiotControl.trigger('read_stock_types');
  self.update();
});

self.filterParties = function () {
  if (!self.searchParty) return;
  self.filteredParties = self.parties.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
};

self.selectParty = function (t, e) {
  self.checkedParties.push(t);

  self.parties = self.parties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.party_id != t.party_id;
  });
};

self.removeParty = function (t, e) {
  self.checkedParties = self.checkedParties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  console.log(self.checkedParties);

  self.parties.push(t);
  self.pagedDataItems.push(t);
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.excelExport = function () {
  if (self.poRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.poRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (selected_party_id == '') {
      selected_party_id = t.party_id;
    } else if (selected_party_id != '') {
      selected_party_id = selected_party_id + ',' + t.party_id;
    }
  });

  var link = "csv/po_report_supplied_materials_csv.php?start_date=" + self.poRegisterDateWiseStartDateInput.value + "&end_date=" + self.poRegisterDateWiseEndDateInput.value + "&party_id=" + selected_party_id + "&stock_type=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.setStartDate = function () {
  self.sd = self.poRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.poRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.po_date_wise = 'po_report_home';
};

self.readPO = function () {
  if (self.poRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.poRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (selected_party_id == '') {
      selected_party_id = t.party_id;
    } else if (selected_party_id != '') {
      selected_party_id = selected_party_id + ',' + t.party_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_po_report_supplied_materials', self.poRegisterDateWiseStartDateInput.value, self.poRegisterDateWiseEndDateInput.value, selected_party_id, selectedStockTypeString);
};

RiotControl.on('read_po_report_supplied_materials_changed', function (data) {
  console.log(data);
  self.loading = false;
  self.transactions = [];
  self.transactions = data;
  self.po_date_wise = 'po_date_wise_report';
  self.poFrom = self.poRegisterDateWiseStartDateInput.value;
  self.poTo = self.poRegisterDateWiseEndDateInput.value;

  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('parties_changed', function (parties, party) {
  self.loading = false;
  self.checkedParties = [];
  self.parties = party;
  self.filteredParties = party;

  self.items_per_page = 10;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('po-report', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">PO Report</h4> <div show="{po_date_wise ==\'po_report_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="poRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="poRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="poRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="poRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="selectPOStatus">Status</label> <select name="selectPOStatus" class="form-control"> <option value="P">Pending</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readPO}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchParty" class="form-control" placeholder="Search Party" onkeyup="{filterParties}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectParty.bind(this, cat)}"></td> <td>{cat.party_name}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Party</th> <th></th> </tr> <tr each="{cat, i in checkedParties}"> <td>{i+1}</td> <td>{cat.party_name}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeParty.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{po_date_wise ==\'po_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>PO (Date Wise)<br> From {poFrom} To {poTo}</div> <br> </center> <table class="table table-bordered bill-info-table print-small"> <tr> <th class="serial-col"><strong>Sl</strong></th> <th><strong>PO NO</strong></th> <th><strong>PO Date</strong></th> <th><strong>Party Name</strong></th> <th><strong>Item Code</strong></th> <th><strong>Description of Goods</strong></th> <th><strong>Location</strong></th> <th><strong>Unit</strong></th> <th><strong>Quantity</strong></th> <th><strong>Unit Price</strong></th> <th><strong>Total</strong></th> <th><strong>Discount</strong></th> <th><strong>P&F</strong></th> <th each="{dutyhead, a in dutyHeaders}"> <strong>{dutyhead.tax_name}</strong> </th> <th each="{taxhead, b in taxOneHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{taxhead, c in taxTwoHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{cesshead, d in cessHeaders}"> <strong>{cesshead.tax_name}</strong> </th> <th><strong>Other Charges</strong></th> <th><strong>Amount</strong></th> </tr> <tr each="{t, k in transactions}" no-reorder> <td>{k+1}</td> <td style="width:100px">{t.stock_type_code}-{t.po_no}</td> <td>{t.po_date}</td> <td>{t.party_name}</td> <td>{t.item_id}</td> <td>{t.item_name}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td class="text-sm-right">{t.po_qty}</td> <td class="text-sm-right">{t.unit_value}</td> <td class="text-sm-right">{t.amount}</td> <td class="text-sm-right">{t.discount_amount} ({t.discount_percentage}%)</td> <td class="text-sm-right">{t.p_and_f_charges}</td> <td each="{d, j in t.duties}" class="text-sm-right"> {d} </td> <td each="{tone, k in t.taxone}" class="text-sm-right"> {tone} </td> <td each="{ttwo, l in t.taxtwo}" class="text-sm-right"> {ttwo} </td> <td each="{c, m in t.cess}" class="text-sm-right"> {c} </td> <td class="text-sm-right">{t.other_charges}</td> <td class="text-sm-right">{t.item_total}</td> </tr> <tr> <th class="serial-col"><strong></strong></th> <th></th> <th></th> <th></th> <th></th> <th></th> <th></th> <th></th> <th><strong>Quantity</strong></th> <th class="text-sm-right">{grand_total_po_qty}</th> <th></th> <th></th> <th></th> <th each="{dutyhead, a in dutyHeaders}"> <strong></strong> </th> <th each="{taxhead, b in taxOneHeaders}"> <strong></strong> </th> <th each="{taxhead, c in taxTwoHeaders}"> <strong></strong> </th> <th each="{cesshead, d in cessHeaders}"> <strong></strong> </th> <th><strong>TOTAL</strong></th> <th class="text-sm-right"><strong>{grand_total}</strong></th> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('poRegisterDateWiseStartDateInput');
  dateFormat('poRegisterDateWiseEndDateInput');
  self.po_date_wise = 'po_report_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_parties');
  self.update();
});

self.filterParties = function () {
  if (!self.searchParty) return;
  self.filteredParties = self.parties.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
};

self.selectParty = function (t, e) {
  self.checkedParties.push(t);

  self.parties = self.parties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.party_id != t.party_id;
  });
};

self.removeParty = function (t, e) {
  self.checkedParties = self.checkedParties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  console.log(self.checkedParties);

  self.parties.push(t);
  self.pagedDataItems.push(t);
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.excelExport = function () {
  if (self.poRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.poRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }
  if (!self.selectPOStatus.value) {
    toastr.info("Please select PO Status and try again");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (selected_party_id == '') {
      selected_party_id = t.party_id;
    } else if (selected_party_id != '') {
      selected_party_id = selected_party_id + ',' + t.party_id;
    }
  });

  var link = "csv/po_report_csv.php?start_date=" + self.poRegisterDateWiseStartDateInput.value + "&end_date=" + self.poRegisterDateWiseEndDateInput.value + "&status=" + self.selectPOStatus.value + "&party_id=" + selected_party_id + "&stock_type=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.setStartDate = function () {
  self.sd = self.poRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.poRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.po_date_wise = 'po_report_home';
};

self.readPO = function () {
  if (self.poRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.poRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }
  if (!self.selectPOStatus.value) {
    toastr.info("Please select PO Status and try again");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (selected_party_id == '') {
      selected_party_id = t.party_id;
    } else if (selected_party_id != '') {
      selected_party_id = selected_party_id + ',' + t.party_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_po_report', self.poRegisterDateWiseStartDateInput.value, self.poRegisterDateWiseEndDateInput.value, self.selectPOStatus.value, selected_party_id, selectedStockTypeString);
};

RiotControl.on('read_po_report_changed', function (data) {
  console.log(data);
  self.loading = false;
  self.transactions = [];
  self.transactions = data.transactions;
  self.po_date_wise = 'po_date_wise_report';
  self.poFrom = self.poRegisterDateWiseStartDateInput.value;
  self.poTo = self.poRegisterDateWiseEndDateInput.value;

  self.viewPurchaseOrders = [];
  self.viewPurchaseOrders = data.materials;

  self.viewPODetails = [];
  self.viewPODetails = data.details;

  self.dutyHeaders = [];
  self.dutyHeaders = data.dutyHeaders;

  self.taxOneHeaders = [];
  self.taxOneHeaders = data.taxOneHeaders;

  self.taxTwoHeaders = [];
  self.taxTwoHeaders = data.taxTwoHeaders;

  self.cessHeaders = [];
  self.cessHeaders = data.cessHeaders;

  self.viewPOConditions = [];
  self.viewPOConditions = data.conditions;

  self.grand_total = data.grand_total;
  self.grand_total_po_qty = data.grand_total_po_qty;
  self.update();
});

RiotControl.on('parties_changed', function (parties, party) {
  self.loading = false;
  self.checkedParties = [];
  self.parties = party;
  self.filteredParties = party;

  self.items_per_page = 10;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('po', '<loading-bar if="{loading}"></loading-bar> <div show="{po_view ==\'po_home\'}"> <div class="container-fluid"> <div class="row"> <div class="col-sm-4"> <div class="form-group row"> <h1 class="col-xs-3 col-form-label">PO</h1> <div class="col-xs-9" style="padding-top: 12px;"> <select name="selectIndentStatus" onchange="{refreshPurchaseOrders}" class="form-control"> <option value=""></option> <option value="C">Completed</option> <option value="P">Pending</option> <option value="D">Deleted</option> <option value="all">All</option> </select> </div> </div> </div> <div class="col-sm-8 text-xs-right" style="padding-top: 12px;"> <div class="form-inline"> <input type="search" name="searchPurchaseOrderByStockType" class="form-control" placeholder="Search By PO No" style="width:200px"> <input type="search" name="searchPurchaseOrder" class="form-control" placeholder="Search By Party, Date" onkeyup="{filterPurchaseOrders}" style="width:200px"> <button class="btn btn-secondary" onclick="{refreshPurchaseOrders}"><i class="material-icons">refresh</i></button> <button class="btn btn-secondary" __disabled="{loading}" onclick="{showIndentModal}"><i class="material-icons">add</i></button> <button class="btn btn-secondary" __disabled="{loading}" onclick="{showSelectItemModal}"> Add PO without Indent </button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr> <th class="serial-col">Sl</th> <th>PO No</th> <th>PO Date</th> <th>Party Name</th> <th>Status</th> <th style="width:180px"></th> </tr> <tr each="{p, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td class="text-center">{p.stock_type_code}-{p.po_no}</td> <td class="text-center">{p.po_date}</td> <td class="text-center">{p.party_name}</td> <td class="text-center">{p.status}</td> <td> <div class="table-buttons" hide="{p.confirmDelete ||  p.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" show="{p.po_without_indent==\'N\'}" onclick="{edit.bind(this, p)}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" show="{p.po_without_indent==\'Y\'}" onclick="{editWithoutIndent.bind(this, p)}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" show="{p.po_without_indent==\'N\'}" onclick="{viewPurchaseOrder.bind(this, p)}"><i class="material-icons">visibility</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" show="{p.po_without_indent==\'Y\'}" onclick="{viewPurchaseOrderWithoutIndent.bind(this, p)}"><i class="material-icons">visibility</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" hide="{p.status==\'C\'}" onclick="{showPurchaseOrderModal.bind(this, p)}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{p.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="6"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="container-fluid" show="{po_view ==\'add_po\'}"> <h4>{title} Purchase Order</h4> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closePurchaseOrderStepZero}" style="margin-bottom:5px;">Close</button> <div class="row"> <table class="table table-bordered"> <tr> <th class="serial-col">Sl</th> <th style="width:50px"></th> <th>Indent No</th> <th>Indent Date</th> <th>Department</th> <th>Stock Type</th> <th>Indent Type</th> </tr> <tr each="{m, i in indents}"> <td>{i+1}</td> <td><input type="checkbox" __checked="{m.selected}" id="{\'indentSelectionInput\' + m.indent_id}" onclick="{selectIndent.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td class="{fyear: m.fyear==\'true\'}">{m.stock_type_code}-{m.indent_no}</td> <td>{m.indent_date}</td> <td>{m.department}</td> <td>{m.stock_type}</td> <td>{m.indent_type_view}</td> </tr> </table> <button type="button" class="btn btn-primary pull-sm-right" onclick="{purchaseOrderStepOne}">Next</button> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closePurchaseOrderStepZero}" style=" margin-right: 10px;">Close</button> </div> </div> <div class="container-fluid" show="{po_view ==\'add_po_step_one\'}"> <div class="row"> <div class="col-md-9"> <h4>{title} Purchase Order</h4> </div> <div class="col-md-3"> <button type="button" class="btn btn-secondary pull-md-right" onclick="{closePurchaseOrderStepOne}" style="margin-bottom:5px;">Back</button> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group row"> <label for="poDateInput" class="col-xs-4 col-form-label">PO Date</label> <div class="col-xs-8"> <input type="text" id="poDateInput" class="form-control" placeholder="DD/MM/YYY"> </div> </div> </div> <div class="col-md-6"> <div class="form-group row"> <label for="selectPartyNameInput" class="col-xs-4 col-form-label">Party</label> <div class="col-xs-8"> <input type="text" id="selectPartyNameInput" class="form-control"> </div> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group row"> <label for="selectPartyNameInput" class="col-xs-4 col-form-label">Quotatoin Ref</label> <div class="col-xs-8"> <input type="text" id="quotatoinRefInput" class="form-control"> </div> </div> </div> <div class="col-md-6"> <div class="form-group row"> <label class="col-xs-4 col-form-label">PO No: {po_no_view}</label> </div> </div> </div> <div class="row"> <strong>Material</strong> <table class="table table-bordered calculation-table"> <tr> <th class="serial-col">Sl</th> <th></th> <th>Material</th> <th>Description</th> <th>UOM</th> <th>Qty</th> <th>PO Qty</th> <th>Unit Value</th> <th>Amount</th> <th>Discount %</th> <th>P&F</th> <th>Duty</th> <th>Tax 1</th> <th>Tax 2</th> <th>Cess</th> <th>Other Charges</th> <th>Total</th> <th>Last Docket No</th> <th>LPP</th> </tr> <tr each="{m, j in values}"> <td>{j+1}</td> <td> <input type="checkbox" __checked="{m.selected}" id="{\'selectMaterialInput\' + m.indent_material_map_id}" onclick="{selectMaterial.bind(this,m)}" style="margin-top: 5px;"> </td> <td>{m.item_name}</td> <td> <input type="text" id="{\'poDescriptionInput\' + m.indent_material_map_id}" value="{m.po_description}" class="form-control" style="width: 100px;"> </td> <td>{m.uom_code}</td> <td>{m.qty}</td> <td> <input type="text" id="{\'poQtyInput\' + m.indent_material_map_id}" value="{m.po_qty}" onblur="{calculateAmount}" class="form-control text-xs-right" style="width: 100px;"> </td> <td> <input type="text" id="{\'poUnitValueInput\' + m.indent_material_map_id}" value="{m.unit_value}" onblur="{calculateAmount}" class="form-control text-xs-right" style="width: 100px;"> </td> <td>{m.total_value}</td> <td> <input type="text" id="{\'discountPercentageInput\' + m.indent_material_map_id}" value="{m.discount_percentage}" onblur="{calculateAmount}" class="form-control text-xs-right"><br> {m.discount_amount} </td> <td> <input type="text" id="{\'poPAndFInput\' + m.indent_material_map_id}" value="{m.p_and_f}" onblur="{calculateAmount}" class="form-control text-xs-right" style="width: 100px;"> </td> <td> <select id="{\'selectDutyInput\'+m.indent_material_map_id}" class="form-control" onchange="{calculateAmount}" style="width:150px"> <option></option> <option each="{duties}" value="{tax_id}">{tax}</option> </select><br> {m.duty} </td> <td> <select id="{\'selectTaxOneInput\'+m.indent_material_map_id}" class="form-control" onchange="{calculateAmount}" style="width:150px"> <option></option> <option each="{taxes}" value="{tax_id}">{tax}</option> </select><br> {m.tax_one} </td> <td> <select id="{\'selectTaxTwoInput\'+m.indent_material_map_id}" class="form-control" onchange="{calculateAmount}" style="width:150px"> <option></option> <option each="{taxes}" value="{tax_id}">{tax}</option> </select><br> {m.tax_two} </td> <td> <select id="{\'selectCessInput\'+m.indent_material_map_id}" class="form-control" onchange="{calculateAmount}" style="width:150px"> <option></option> <option each="{cess}" value="{tax_id}">{tax}</option> </select><br> {m.cess} </td> <td> <input type="text" id="{\'otherChargesInput\' + m.indent_material_map_id}" value="{m.other_charges}" onblur="{calculateAmount}" class="form-control text-xs-right" style="width: 100px;"> </td> <td>{m.item_total}</td> <td>{m.last_docket_no}</td> <td>{m.lp_price}</td> </tr> </tr> </table> <strong>Terms & conditions</strong> <table class="table table-bordered"> <tr> <th class="serial-col">Sl</th> <th class="serial-col"></th> <th>Terms & conditions</th> </tr> <tr each="{t, i in conditions}"> <td>{i+1}</td> <td><input type="checkbox" __checked="{t.selected}" id="{\'selectConditionInput\' + t.condition_id}" onclick="{selectCondition.bind(this,t)}" style="margin-top: 5px;"></td> <td>{t.condition_name}</td> </tr> </table> <strong>Remarks</strong> <textarea id="poRemarks" class="form-control"></textarea> <br> <button type="button" class="btn btn-primary pull-sm-right" onclick="{submitPurchaseOrderStepOne}">Submit</button> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closePurchaseOrderStepOne}" style="margin-right: 10px;">Back</button> </div> </div> <div class="container-fluid print-box" show="{po_view ==\'po_view\'}"> <button class="btn btn-secondary text-right no-print" onclick="{closePurchaseOrderView}"><i class="material-icons">close</i></button> <table class="table po_table"> <tr> <td style="width:30%;"> <div style="margin-top:55px">To</div> <p style="padding-right: 0px;"> {viewPODetails.party_name}<br> {viewPODetails.address}<br> {viewPODetails.tax_details}<br> {viewPODetails.tax_details1}</p> </td> <td style="text-align:center;width:40%"> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"> </center> <p> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> Phone: (033) 3019-0506/0509<br> Fax: (033) 3019-0520<br> Email: purchase@ntcind.com<br> Email: stores_ntc@rdbindia.com<br> </p> </td> <td style="width:30%"> <p style="padding-left: 20px;padding-top: 25px;"> <strong>PURCHASE ORDER</strong><br> Order No: {viewPODetails.stock_type_code}-{viewPODetails.po_no}<br> Date: {viewPODetails.po_date}<br> Quotatoin Ref: {viewPODetails.quotatoin_ref}<br> Indent No: {viewPODetails.indent_ids}<br> ECC No: AABCR4307DXM001<br> VAT No: 19470968014<br> CST No: 19470968208<br> CIN No: L70109WB1991PLC053562<br> GSTIN: 19AABCR4307D1ZP </p> </td> </tr> </table> <hr style="margin-top: -25px;margin-bottom: 5px;"> <p> Dear Sir,<br> With reference to your above noted quotation, we are pleased to place the purchase order on you to supply of the following items at our factory under following terms and conditions. </p> <table class="table table-bordered bill-info-table print-small"> <thead> <tr> <th>Sl</th> <th style="width: 250px;"><strong>Description of Goods</strong></th> <th><strong>Quantity</strong></th> <th><strong>Unit</strong></th> <th><strong>Unit Price</strong></th> <th><strong>Total</strong></th> <th><strong>Discount</strong></th> <th show="{viewPODetails.p_and_f_charges}"><strong>P&F</strong></th> <th each="{dutyhead, a in dutyHeaders}"> <strong>{dutyhead.tax_name}</strong> </th> <th each="{taxhead, b in taxOneHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{taxhead, c in taxTwoHeaders}"> <strong>{taxhead.tax_name}</strong> </th> <th each="{cesshead, d in cessHeaders}"> <strong>{cesshead.tax_name}</strong> </th> <th show="{viewPODetails.other_charges}"><strong>Other Charges</strong></th> <th><strong>Amount</strong></th> </tr> </thead> <tr each="{t, i in viewPurchaseOrders}"> <td>{i+1}</td> <td style="width: 250px;">{t.item_name},{t.description}-(Code No:{t.item_id})</td> <td class="text-sm-right">{t.po_qty}</td> <td class="text-sm-right">{t.uom_code}</td> <td class="text-sm-right">{t.unit_value}</td> <td class="text-sm-right">{t.amount}</td> <td class="text-sm-right">{t.discount_amount} ({t.discount_percentage}%)</td> <td class="text-sm-right" show="{viewPODetails.p_and_f_charges}">{t.p_and_f_charges}</td> <td each="{d, j in t.duties}" class="text-sm-right"> {d} </td> <td each="{tone, k in t.taxone}" class="text-sm-right"> {tone} </td> <td each="{ttwo, l in t.taxtwo}" class="text-sm-right"> {ttwo} </td> <td each="{c, m in t.cess}" class="text-sm-right"> {c} </td> <td class="text-sm-right" show="{viewPODetails.other_charges}">{t.other_charges}</td> <td class="text-sm-right">{t.item_total}</td> </tr> <tr> <td colspan="{viewPODetails.colspan}" align="right">Total</td> <td class="text-sm-right">{viewPODetails.total}</td> </tr> <tbody> </tbody> </table> <table class="table po_table"> <tr> <td> <strong style="text-decoration: underline;">TERMS AND CONDITIONS</strong> <ul> <li each="{c, j in viewPOConditions}">{c.condition_name}</li> </ul> </td> </tr> <tr> <td> <p><strong>Remarks:</strong> {viewPODetails.remarks}</p> </td> </tr> <tr> <td> <center style="text-align:right"> <strong>For ntc industries limited<br><br><br><br> {viewPODetails.authorised_signatory}<br> (Purchase Manager/Authorised Signatory) </strong> </center> </td> </tr> </table> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closePurchaseOrderView}" style=" margin-right: 10px;">Close</button> </div> <div class="modal fade" id="statusModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Complete Purchase Order</h4> </div> <div class="modal-body"> <center>Are You sure, to mark this Purchase Order as completed.</center> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{completePurchaseOrder}">Submit</button> </div> </div> </div> </div> <div show="{po_view ==\'select_items\'}"> <h4>{title} Purchase Order</h4> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter">Item Group</label> <input id="selectItemGroupFilter" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px"> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="searchMaterialInput">Search Material</label> <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{getMaterial}" style="margin-top: 32px;">Get Material</button> </div> </div> </div> <div class="row"> <table class="table table-bordered"> <tr> <th class="serial-col">Sl</th> <th style="width:75px"></th> <th>Material</th> <th>Group</th> <th>Qty</th> <th>Delivery Date</th> </tr> <tr each="{it, i in materials}" no-reorder> <td>{i+1}</td> <td><input type="checkbox" class="form-control" __checked="{it.selected}" onclick="{parent.toggle}"></td> <td>{it.item_name}-(Code:{it.item_id})</td> <td>{it.item_group}</td> <td><input type="text" class="form-control" id="qtyInputForPO{it.item_id}" style="padding:3px"></td> <td><input type="text" class="form-control" id="deliveryDateForPO{it.item_id}" placeholder="DD/MM/YYYY" style="padding:3px"></td> </tr> </table> </div> <div class="col-sm-12"> <button type="button" class="btn btn-primary pull-sm-right" onclick="{selectedMaterial}">Next</button> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closePurchaseOrderStepZero}" style="margin-right:10px;">Close</button> </div> </div> <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Select Material</h4> <div class="text-xs-right form-inline"> <input type="search" name="searchMaterials" class="form-control" placeholder="search" onkeyup="{filterMaterials}" style="width:200px"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterialForPO}">Submit</button> </div> </div> <div class="modal-body"> <table class="table table-bordered"> <tr> <th class="serial-col">Sl</th> <th style="width:75px"></th> <th>Material</th> <th>Group</th> </tr> <tr each="{it, i in pagedDataMaterials}" no-reorder> <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td> <td><input type="checkbox" class="form-control" __checked="{it.selected}" onclick="{parent.toggles}"></td> <td>{it.item_name}-(Code:{it.item_id})</td> <td>{it.item_group}</td> </tr> <tfoot class="no-print"> <tr> <td colspan="10"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPageNew}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select_new" onchange="{changePageNew}"> <option each="{pno in page_array_new}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterialForPO}">Submit</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.items_per_page = 10;
  self.items_per_page_new = 10;
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_parties');
  RiotControl.trigger('read_taxes');
  RiotControl.trigger('read_conditions');
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_item_groups');
  self.po_without_indent = 'N';
  self.po_view = 'po_home';
  self.applyTaxArray = {};
  self.applyDutyArray = {};
  self.update();
  $(document).keypress(function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      console.log('no action');
      return false;
    }
  });
  dateFormat('poDateInput');
});

self.showIndentModal = function () {
  self.title = 'Add';
  self.po_without_indent = 'N';
  self.loading = true;
  RiotControl.trigger('read_indents_for_po_addition', 'F');
};

self.showSelectItemModal = function () {
  self.title = 'Add';
  self.po_without_indent = 'Y';
  self.po_view = 'select_items';
  self.materials = [];
};

self.selectIndent = function (item, e) {
  if (self.title == 'Add') {
    item.selected = !e.item.m.selected;
  } else if (self.title == 'Edit') {
    self.indents.map(function (i) {
      var indentSelectionInput = '#indentSelectionInput' + i.indent_id;
      if ($(indentSelectionInput).is(':checked')) {
        i.selected = true;
      } else {
        i.selected = false;
      }
    });
  }
  console.log(self.indents);
};

self.closePurchaseOrderStepZero = function () {
  self.po_view = 'po_home';
};

self.sameStockType = function (selectedStockTypeCodeArray) {
  if (self.title == 'Add') {
    //any stock_type_code is allowed
    for (var i = 1; i < selectedStockTypeCodeArray.length; i++) {
      if (selectedStockTypeCodeArray[i] != selectedStockTypeCodeArray[0]) {
        return false;
      }
    }
    return true;
  } else if (self.title == 'Edit') {
    for (var i = 0; i < selectedStockTypeCodeArray.length; i++) {
      console.log(self.fixed_po_stock_type_code);
      if (selectedStockTypeCodeArray[i] != self.fixed_po_stock_type_code) {
        return false;
      }
    }
    return true;
  }
};

self.purchaseOrderStepOne = function () {
  self.update();
  console.log(self.po_no_view);
  var selectedIndentArray = [];
  var selectedStockTypeCodeArray = [];
  self.selected_stock_type_code = '';
  self.indent_stock_type = '';
  self.indents.map(function (i) {
    if (i.selected) {
      selectedIndentArray.push(i.indent_id);
      selectedStockTypeCodeArray.push(i.stock_type_code);
    }
  });

  if (self.sameStockType(selectedStockTypeCodeArray)) {
    self.selected_stock_type_code = selectedStockTypeCodeArray[0];
  } else {
    toastr.error('Please select same Stock Type');
    return;
  }
  console.log('self.selected_stock_type_code');
  console.log(self.selected_stock_type_code);

  if (selectedIndentArray.length > 0) {
    if (self.title == 'Add') {
      console.log(self.selected_stock_type_code);
      RiotControl.trigger('read_indents_for_po', selectedIndentArray, self.selected_stock_type_code);
    } else if (self.title == 'Edit') {
      RiotControl.trigger('read_edit_po', self.po_id, selectedIndentArray);
    }
  } else {
    toastr.error('Please select at least one indent');
  }
};

self.closePurchaseOrderStepOne = function () {
  console.log(self.po_without_indent);
  if (self.po_without_indent == 'Y') {
    self.po_view = 'po_home';
  } else {
    self.po_view = 'add_po';
  }
};

self.selectMaterial = function (item, e) {
  console.log(self.values);
  if (self.title == 'Add') {
    e.item.m.selected = !e.item.m.selected;
    console.log(self.values);
  } else if (self.title == 'Edit') {
    self.values.map(function (i) {
      var selectMaterialInput = '#selectMaterialInput' + i.indent_material_map_id;
      if ($(selectMaterialInput).is(':checked')) {
        i.selected = true;
      } else {
        i.selected = false;
      }
    });
    console.log('self.values');
    console.log(self.values);
  }
};

self.selectCondition = function (item, e) {
  item.selected = !e.item.t.selected;
};

self.calculateAmount = function (e) {
  var poQtyInput = '#poQtyInput' + e.item.m.indent_material_map_id;
  var temp_po_qty = $(poQtyInput).val();
  if (isNaN(temp_po_qty)) {
    temp_po_qty = 0;
  }
  var qt = Number(e.item.m.qty);
  if (self.title == 'Add') {
    if (Number(temp_po_qty) > Number(qt)) {
      toastr.error('PO qty can not be grater than qty');
      $(poQtyInput).val(0);
      temp_po_qty = 0;
    }
  } else if (self.title == 'Edit') {
    var max_po_qty = Number(e.item.m.qty) + Number(e.item.m.prev_po_qty);
    if (Number(temp_po_qty) > Number(max_po_qty)) {
      toastr.error('PO qty can not be grater than qty');
      $(poQtyInput).val(0);
      temp_po_qty = 0;
    }
  }
  var po_qty = Number(temp_po_qty).toFixed(3);
  e.item.m.po_qty = po_qty; //PO Qty

  var poUnitValueInput = '#poUnitValueInput' + e.item.m.indent_material_map_id;
  var temp_unit_value = $(poUnitValueInput).val();
  if (isNaN(temp_unit_value)) {
    temp_unit_value = 0;
  }
  var unit_value = Number(temp_unit_value).toFixed(3);
  e.item.m.unit_value = unit_value; //Unit Value

  var amount = Number(Number(unit_value) * Number(po_qty)).toFixed(2);
  e.item.m.total_value = amount; //Amount

  var discountPercentageInput = '#discountPercentageInput' + e.item.m.indent_material_map_id;
  var temp_discount_percentage = $(discountPercentageInput).val();
  if (isNaN(temp_discount_percentage)) {
    temp_discount_percentage = 0;
  }
  var discount_percentage = Number(temp_discount_percentage).toFixed(2);
  e.item.m.discount_percentage = discount_percentage; //Discount %
  var discount_amount = Number(amount * discount_percentage / 100).toFixed(2);
  e.item.m.discount_amount = discount_amount; //Discount Amt

  var poPAndFInput = '#poPAndFInput' + e.item.m.indent_material_map_id;
  var temp_p_and_f_value = $(poPAndFInput).val();
  if (isNaN(temp_p_and_f_value)) {
    temp_p_and_f_value = 0;
  }
  var p_and_f = Number(temp_p_and_f_value).toFixed(2);
  e.item.m.p_and_f = p_and_f; // P&F Value

  var sub_total = Number(Number(amount) - Number(discount_amount) + Number(p_and_f)).toFixed(2);
  e.item.m.sub_total = sub_total;
  console.log(amount);
  console.log(sub_total);

  /*duty start*/
  var selectDutyInput = '#selectDutyInput' + e.item.m.indent_material_map_id;
  var duty_id = $(selectDutyInput).val();
  if (duty_id == '') {
    e.item.m.duty_id = '';
    e.item.m.duty = 0.00;
  } else {
    self.duties.map(function (d) {
      if (d.tax_id == duty_id) {
        e.item.m.duty_id = duty_id;
        e.item.m.duty = Number(Number(sub_total) * Number(d.tax_rate) / 100).toFixed(2);
      }
    });
  }
  e.item.m.amount_after_duty = Number(Number(sub_total) + Number(e.item.m.duty)).toFixed(2);
  /*duty end*/

  /*tax1 start*/
  var selectTaxOneInput = '#selectTaxOneInput' + e.item.m.indent_material_map_id;
  var tax_one_id = $(selectTaxOneInput).val();
  if (tax_one_id == '') {
    e.item.m.tax_one_id = '';
    e.item.m.tax_one = 0.00;
  } else {
    self.taxes.map(function (d) {
      if (d.tax_id == tax_one_id) {
        e.item.m.tax_one_id = tax_one_id;
        e.item.m.tax_one = Number(Number(e.item.m.amount_after_duty) * Number(d.tax_rate) / 100).toFixed(2);
      }
    });
  }
  /*tax1 end*/

  /*tax2 start*/
  var selectTaxTwoInput = '#selectTaxTwoInput' + e.item.m.indent_material_map_id;
  var tax_two_id = $(selectTaxTwoInput).val();
  if (tax_two_id == '') {
    e.item.m.tax_two_id = '';
    e.item.m.tax_two = 0.00;
  } else {
    self.taxes.map(function (d) {
      if (d.tax_id == tax_two_id) {
        e.item.m.tax_two_id = tax_two_id;
        e.item.m.tax_two = Number(Number(e.item.m.amount_after_duty) * Number(d.tax_rate) / 100).toFixed(2);
      }
    });
  }
  /*tax2 end*/

  /*cess start*/
  var selectCessInput = '#selectCessInput' + e.item.m.indent_material_map_id;
  var cess_id = $(selectCessInput).val();
  if (cess_id == '') {
    e.item.m.cess_id = '';
    e.item.m.cess = 0.00;
  } else {
    self.cess.map(function (d) {
      if (d.tax_id == cess_id) {
        e.item.m.cess_id = cess_id;
        e.item.m.cess = Number(Number(e.item.m.amount_after_duty) * Number(d.tax_rate) / 100).toFixed(2);
      }
    });
  }
  /*cess end*/

  /*other charges Start*/
  var otherChargesInput = '#otherChargesInput' + e.item.m.indent_material_map_id;
  var temp_other_charges_value = $(otherChargesInput).val();
  if (isNaN(temp_other_charges_value)) {
    temp_other_charges_value = 0;
  }
  var other_charges = Number(temp_other_charges_value).toFixed(2);
  e.item.m.other_charges = other_charges; // P&F Value
  /*other charges End*/

  e.item.m.item_total = Number(Number(e.item.m.amount_after_duty) + Number(e.item.m.tax_one) + Number(e.item.m.tax_two) + Number(e.item.m.cess) + Number(e.item.m.other_charges)).toFixed(2);

  console.log(e);
};

self.submitPurchaseOrderStepOne = function () {
  if (self.poDateInput.value == '') {
    toastr.error('Please Enter PO Date');
    return;
  }

  var str = self.poDateInput.value;
  var d = str.split("/");
  var po_date = moment([d[2].trim() + d[1].trim() + d[0].trim()], 'YYYYMMDD');
  var toDay = moment().format('YYYYMMDD');

  var from = moment(po_date, 'YYYYMMDD');
  var to = moment(toDay, 'YYYYMMDD');
  var differnece = to.diff(from, 'days');

  if (differnece < 0) {
    toastr.error("PO date can not be greater than today");
    return;
  }

  if (!self.selected_party_id) {
    toastr.error('Please Enter party name');
    return;
  }

  var materialArray = [];
  self.values.map(function (i) {
    //colletion of selected material
    if (i.selected) {
      materialArray.push(i);
    }
  });

  if (materialArray.length == 0) {
    toastr.error('Please select at least one material');
    return;
  }

  var count = 0;
  var error = '';
  materialArray.map(function (i) {
    count++;
    var poDescriptionInput = '#poDescriptionInput' + i.indent_material_map_id;
    i.po_description = $(poDescriptionInput).val();

    var temp_po_qty = Number(i.po_qty);
    if (isNaN(temp_po_qty)) {
      temp_po_qty = 0;
    }

    if (temp_po_qty == 0) {
      error = error + " Please Enter a valid PO Qty" + count + ", ";
    }
  });

  var conditionArray = [];
  self.conditions.map(function (i) {
    // collection of selected conditions
    if (i.selected) {
      conditionArray.push(i);
    }
  });
  if (conditionArray.length == 0) {
    toastr.error('Please select at least one condition');
    return;
  }

  if (error != '') {
    toastr.error(error);
    return;
  } else {
    if (self.title == 'Add') {
      if (self.po_without_indent == 'N') {
        RiotControl.trigger('add_po', materialArray, conditionArray, self.selected_party_id, self.poRemarks.value, self.quotatoinRefInput.value, self.poDateInput.value, self.selected_stock_type_code);
      } else if (self.po_without_indent == 'Y') {
        RiotControl.trigger('add_po_without_indent', materialArray, conditionArray, self.selected_party_id, self.poRemarks.value, self.quotatoinRefInput.value, self.poDateInput.value, self.selectStockTypeFilter.value);
      }
    } else if (self.title == 'Edit') {
      if (self.po_without_indent == 'N') {
        RiotControl.trigger('edit_po', self.values, conditionArray, self.selected_party_id, self.po_id, self.poRemarks.value, self.quotatoinRefInput.value, self.poDateInput.value, self.selected_stock_type_code);
      } else if (self.po_without_indent == 'Y') {
        RiotControl.trigger('edit_po_without_indent', materialArray, conditionArray, self.selected_party_id, self.po_id, self.poRemarks.value, self.quotatoinRefInput.value, self.poDateInput.value);
      }
    }
  }
};

self.refreshPurchaseOrders = function () {
  self.purchaseOrders = [];
  self.loading = true;
  RiotControl.trigger('read_po', self.selectIndentStatus.value, self.searchPurchaseOrderByStockType.value);
};

self.filterPurchaseOrders = function () {
  if (!self.searchPurchaseOrder) return;
  self.filteredPurchaseOrders = self.purchaseOrders.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchPurchaseOrder.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredPurchaseOrders, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredPurchaseOrders, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.purchaseOrders.map(function (c) {
    if (c.po_id != e.item.p.po_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_po', e.item.p.po_id, e.item.p.po_without_indent);
};

self.viewPurchaseOrder = function (p, e) {
  RiotControl.trigger('view_po', p.po_id);
};

self.viewPurchaseOrderWithoutIndent = function (p, e) {
  RiotControl.trigger('view_po_without_indent', p.po_id);
};

self.closePurchaseOrderView = function () {
  self.po_view = 'po_home';
};

self.edit = function (p, e) {
  RiotControl.trigger('read_indents_edit', 'F', p.po_id);
  self.party_id = p.party_id;
  self.po_id = p.po_id;
  self.po_without_indent = 'N';
  self.fixed_po_stock_type_code = p.stock_type_code;
  self.po_no_view = p.po_no;
  console.log(p.po_no);
};

self.editWithoutIndent = function (p, e) {
  self.po_without_indent = 'Y';
  self.party_id = p.party_id;
  self.po_id = p.po_id;
  self.fixed_po_stock_type_code = p.stock_type_code;
  self.po_no_view = p.po_no;
  RiotControl.trigger('read_edit_po_without_indent', self.po_id);
};

self.showPurchaseOrderModal = function (p, e) {
  $("#statusModal").modal('show');
  self.complete_po_id = p.po_id;
};

self.completePurchaseOrder = function () {
  RiotControl.trigger('complete_po', self.complete_po_id);
};

self.cancelOperation = function (e) {
  self.purchaseOrders.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

self.getMaterial = function () {
  if (self.searchMaterialInput.value == '') {
    if (self.selectItemGroupFilter.value == '') {
      toastr.info("Please select Item Group and try again");
      return;
    }
    if (self.selectStockTypeFilter.value == '') {
      toastr.info("Please select Stock Type and try again");
      return;
    }
    self.loading = true;
    RiotControl.trigger('read_items_for_po', self.selected_item_group_code, self.selectStockTypeFilter.value);
  } else {
    if (self.selectStockTypeFilter.value == '') {
      toastr.info("Please select Stock Type and try again");
      return;
    }
    self.loading = true;
    RiotControl.trigger('search_items_for_po', self.searchMaterialInput.value, self.selectStockTypeFilter.value);
  }
};

self.toggles = function (e) {
  var item = e.item.it;
  item.selected = !item.selected;
  console.log(self.modelMaterials);
};

self.toggle = function (e) {
  var item = e.item.it;
  item.selected = !item.selected;
};

self.selectedMaterialForPO = function () {
  console.log('calling this ');
  self.modelMaterials.map(function (m) {
    if (m.selected) {
      self.materials.push(m);
    }
  });

  $("#itemModal").modal('hide');
  self.update();

  // date element formating
  self.materials.map(function (m) {
    var deliveryDateForPO = 'deliveryDateForPO' + m.item_id;
    dateFormat(deliveryDateForPO);
  });
};

self.selectedMaterial = function () {
  console.log('self.selectedMaterial');
  self.update();
  self.values = [];
  var error = '';
  self.materials.map(function (m) {
    if (m.selected) {
      self.values.push(m);
      var qtyInputForPO = '#qtyInputForPO' + m.item_id;
      m.qty = $(qtyInputForPO).val();
      m.po_qty = $(qtyInputForPO).val();
      m.indent_material_map_id = m.item_id; //for dynamic data
      m.indent_id = '';

      var deliveryDateForPO = '#deliveryDateForPO' + m.item_id;
      m.delivery_date = $(deliveryDateForPO).val();

      m.checked = true;
      if (m.qty == '') {
        error = 'Please provide qty for material';
        console.log('*' + m.qty + '*');
      }
    }
  });

  if (error != '') {
    toastr.info(error);
    return;
  }

  console.log(self.values);

  self.po_no_view = '';
  self.po_view = 'add_po_step_one';
  self.update();
  $('#poDateInput').prop('disabled', false);

  self.selectPartyNameInput.vlaue = '';
  self.quotatoinRefInput.vlaue = '';
  self.poRemarks.vlaue = '';
  self.conditions.map(function (i) {
    if (i.condition_id == 47 || i.condition_id == 71 || i.condition_id == 72) {
      i.selected = true;
      var selectConditionInput = '#selectConditionInput' + i.condition_id;
      $(selectConditionInput).prop('checked', true);
    } else {
      i.selected = false;
      var _selectConditionInput = '#selectConditionInput' + i.condition_id;
      $(_selectConditionInput).prop('checked', false);
    }
  });
  console.log('self.conditions');
  console.log(self.conditions);

  self.materials.map(function (m) {
    var selectMaterialInput = '#selectMaterialInput' + m.indent_material_map_id;
    $(selectMaterialInput).prop('checked', true);
  });
  RiotControl.trigger('read_po_no', self.selectStockTypeFilter.value);
};

/*chnage start*/
RiotControl.on('read_indents_for_po_addition_changed', function (indents) {
  self.po_view = 'add_po';
  self.update();
  self.selectPartyNameInput.vlaue = '';
  self.quotatoinRefInput.vlaue = '';
  self.poRemarks.vlaue = '';
  self.loading = false;
  self.indents = indents;
  self.update();
});

RiotControl.on('purchase_orders_changed', function (po) {
  $("#statusModal").modal('hide');
  self.loading = false;
  self.purchaseOrders = [];
  self.purchaseOrders = po;
  self.filteredPurchaseOrders = [];
  self.filteredPurchaseOrders = po;

  self.paginate(self.filteredPurchaseOrders, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredPurchaseOrders, 1, self.items_per_page);
  self.update();
});

RiotControl.on('purchase_orders_not_deleted', function (po) {
  self.loading = false;
  self.purchaseOrders.map(function (c) {
    c.confirmDelete = false;
  });
  self.update();
});

RiotControl.on('po_created', function () {

  self.po_view = 'po_home';
  self.loading = false;
  self.update();
});

RiotControl.on('po_creation_date_error', function () {
  self.loading = false;
  toastr.error('Please Check PO Date newer po date exists for same Stock Type');
  self.update();
});

RiotControl.on('read_indents_for_po_changed', function (values, po_no) {
  console.log('read_indents_for_po_changed');
  self.po_view = 'add_po_step_one';
  self.update();
  $('#poDateInput').prop('disabled', false);
  self.loading = false;
  self.selectPartyNameInput.vlaue = '';
  self.quotatoinRefInput.vlaue = '';
  self.poRemarks.vlaue = '';
  self.values = [];
  self.values = values;
  self.po_no_view = po_no;
  self.conditions.map(function (i) {
    if (i.condition_id == 47 || i.condition_id == 71 || i.condition_id == 72) {
      i.selected = true;
      var selectConditionInput = '#selectConditionInput' + i.condition_id;
      $(selectConditionInput).prop('checked', true);
    } else {
      i.selected = false;
      var _selectConditionInput2 = '#selectConditionInput' + i.condition_id;
      $(_selectConditionInput2).prop('checked', false);
    }
  });
  console.log(self.conditions);
  self.update();
  self.values.map(function (i) {
    var selectDutyInput = '#selectDutyInput' + i.indent_material_map_id;
    $(selectDutyInput).on("focus", function () {
      $(selectDutyInput).simulate('mousedown');
    });

    var selectTaxOneInput = '#selectTaxOneInput' + i.indent_material_map_id;
    $(selectTaxOneInput).on("focus", function () {
      $(selectTaxOneInput).simulate('mousedown');
    });

    var selectTaxTwoInput = '#selectTaxTwoInput' + i.indent_material_map_id;
    $(selectTaxTwoInput).on("focus", function () {
      $(selectTaxTwoInput).simulate('mousedown');
    });

    var selectCessInput = '#selectCessInput' + i.indent_material_map_id;
    $(selectCessInput).on("focus", function () {
      $(selectCessInput).simulate('mousedown');
    });
  });
  self.update();
});

RiotControl.on('parties_changed', function (parties) {
  self.loading = false;
  self.parties = parties;

  $('#selectPartyNameInput').autocomplete({
    source: parties,
    select: function select(event, ui) {
      self.selected_party_id = ui.item.party_id;
      console.log(self.selected_party_id);
    }
  });
  //self.update()
});

RiotControl.on('taxes_changed', function (taxes) {
  self.loading = false;
  self.taxes = [];
  self.duties = [];
  self.cess = [];

  taxes.map(function (i) {
    if (i.tax_group == 'Duty') {
      self.duties.push(i);
    } else if (i.tax_group == 'Tax') {
      self.taxes.push(i);
    } else if (i.tax_group == 'Cess') {
      self.cess.push(i);
    }
  });
  self.update();
});

RiotControl.on('conditions_changed', function (conditions) {
  self.loading = false;
  self.conditions = conditions;
  self.update();
});

RiotControl.on('purchase_orders_view_changed', function (v) {
  self.loading = false;
  self.viewPurchaseOrders = [];
  self.viewPurchaseOrders = v.materials;

  self.viewPODetails = [];
  self.viewPODetails = v.details;

  self.dutyHeaders = [];
  self.dutyHeaders = v.dutyHeaders;

  self.taxOneHeaders = [];
  self.taxOneHeaders = v.taxOneHeaders;

  self.taxTwoHeaders = [];
  self.taxTwoHeaders = v.taxTwoHeaders;

  self.cessHeaders = [];
  self.cessHeaders = v.cessHeaders;

  self.viewPOConditions = [];
  self.viewPOConditions = v.conditions;
  self.po_view = 'po_view';
  self.update();
});

RiotControl.on('purchase_orders_edit_changed', function (v) {
  console.log(self.po_no_view);
  self.loading = false;
  self.po_view = 'add_po_step_one';
  self.values = [];
  self.values = v.materials;

  self.appliedConditions = v.conditions;
  self.details = v.details;
  self.update();

  self.selectPartyNameInput.value = self.details['party_id'];
  self.quotatoinRefInput.value = self.details['quotatoin_ref'];
  self.poDateInput.value = self.details['po_date'];
  self.poRemarks.value = self.details['remarks'];
  $('#poDateInput').prop('disabled', true);

  self.values.map(function (i) {
    var selectDutyInput = '#selectDutyInput' + i.indent_material_map_id;
    $(selectDutyInput).val(i.duty_id);

    var selectTaxOneInput = '#selectTaxOneInput' + i.indent_material_map_id;
    $(selectTaxOneInput).val(i.tax_one_id);

    var selectTaxTwoInput = '#selectTaxTwoInput' + i.indent_material_map_id;
    $(selectTaxTwoInput).val(i.tax_two_id);

    var selectCessInput = '#selectCessInput' + i.indent_material_map_id;
    $(selectCessInput).val(i.cess_id);
  });

  /*selected material tick checkbox*/
  self.values.map(function (i) {
    var count = 0;
    v.selctedMaterials.map(function (j) {
      if (i.indent_material_map_id == j.indent_material_map_id) {
        var selectMaterialInput = '#selectMaterialInput' + i.indent_material_map_id;
        $(selectMaterialInput).prop('checked', true);
        i.selected = true;
        count = 1;
      }
    });
    if (count == 0) {
      i.selected = false;
    }
  });

  /*selected condition tick checkbox*/
  self.update();
  self.conditions.map(function (i) {
    i.selected = false;
    var selectConditionInput = '#selectConditionInput' + i.condition_id;
    $(selectConditionInput).prop('checked', false);

    self.appliedConditions.map(function (j) {
      if (i.condition_id == j.condition_id) {
        $(selectConditionInput).prop('checked', true);
        i.selected = true;
      }
    });
  });

  self.parties.map(function (i) {
    if (i.party_id == self.party_id) {
      self.selectPartyNameInput.value = i.party_name;
      self.selected_party_id = i.party_id;
    }
  });
  self.update();
});

RiotControl.on('purchase_orders_edit_without_indent_error', function () {
  self.loading = false;
  toastr.error('Some Docket is there. Please delete Docket first.');
  self.update();
});

RiotControl.on('purchase_orders_edit_without_indent_changed', function (v) {
  console.log(self.po_no_view);
  self.loading = false;
  self.po_view = 'add_po_step_one';
  self.title = 'Edit';
  self.values = [];
  self.values = v.materials;

  self.appliedConditions = v.conditions;
  self.details = v.details;
  self.update();

  self.selectPartyNameInput.value = self.details['party_id'];
  self.quotatoinRefInput.value = self.details['quotatoin_ref'];
  self.poDateInput.value = self.details['po_date'];
  self.poRemarks.value = self.details['remarks'];

  $('#poDateInput').prop('disabled', true);

  self.values.map(function (i) {
    var selectDutyInput = '#selectDutyInput' + i.indent_material_map_id;
    $(selectDutyInput).val(i.duty_id);

    var selectTaxOneInput = '#selectTaxOneInput' + i.indent_material_map_id;
    $(selectTaxOneInput).val(i.tax_one_id);

    var selectTaxTwoInput = '#selectTaxTwoInput' + i.indent_material_map_id;
    $(selectTaxTwoInput).val(i.tax_two_id);

    var selectCessInput = '#selectCessInput' + i.indent_material_map_id;
    $(selectCessInput).val(i.cess_id);
  });

  /*selected material tick checkbox*/
  self.values.map(function (i) {
    var selectMaterialInput = '#selectMaterialInput' + i.indent_material_map_id;
    $(selectMaterialInput).prop('checked', true);
    i.selected = true;
  });
  console.log('values');
  console.log(self.values);

  /*selected condition tick checkbox*/
  self.update();
  self.conditions.map(function (i) {
    i.selected = false;
    var selectConditionInput = '#selectConditionInput' + i.condition_id;
    $(selectConditionInput).prop('checked', false);

    self.appliedConditions.map(function (j) {
      if (i.condition_id == j.condition_id) {
        $(selectConditionInput).prop('checked', true);
        i.selected = true;
      }
    });
  });

  self.parties.map(function (i) {
    if (i.party_id == self.party_id) {
      self.selectPartyNameInput.value = i.party_name;
      self.selected_party_id = i.party_id;
    }
  });

  self.update();
});

self.filterMaterials = function () {
  if (!self.searchMaterials) return;
  self.filteredMaterials = self.modelMaterials.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase()) >= 0;
  });

  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
};

RiotControl.on('po_edited', function () {
  self.po_view = 'po_home';

  self.loading = false;
  self.update();
});

RiotControl.on('indents_edit_changed', function (indents) {
  self.po_view = 'add_po';
  self.title = 'Edit';

  self.loading = false;
  self.indents = indents.indents;
  self.indentIds = indents.indentIds;
  self.update();

  self.indents.map(function (i) {
    self.indentIds.map(function (j) {
      if (i.indent_id == j.indent_id) {
        var indentSelectionInput = '#indentSelectionInput' + i.indent_id;
        $(indentSelectionInput).prop('checked', true);
        //$(indentSelectionInput).prop("disabled", true);
        i.selected = true;
      }
    });
  });
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_for_po_changed', function (items) {
  self.loading = false;
  self.loading = false;
  self.modelMaterials = [];
  var tempMaterials = [];

  if (self.materials.length == 0) {
    self.modelMaterials = items;
  } else {
    items.map(function (sm) {
      //selected materials will be removed from materials
      var count = 0;
      self.materials.map(function (i) {
        if (sm.item_id == i.item_id) {
          count = 1;
        }
      });
      if (count == 0) {
        tempMaterials.push(sm);
      }
    });
    self.modelMaterials = tempMaterials;
  }
  self.searchMaterialInput.value = '';

  self.filteredMaterials = self.modelMaterials;

  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  $("#itemModal").modal('show');
  self.update();
});

RiotControl.on('item_groups_changed', function (item_groups) {
  $('#selectItemGroupFilter').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
      console.log(self.selected_item_group_code);
    }
  });

  self.update();
});

RiotControl.on('read_po_no_changed', function (po_no) {
  console.log('heree');
  self.po_no_view = po_no;
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredPurchaseOrders, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredPurchaseOrders, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredPurchaseOrders, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/**************** pagination for items*******************/
self.getPageDataNew = function (full_data, page_no, items_per_page_new) {
  var start_index = (page_no - 1) * items_per_page_new;
  var end_index = page_no * items_per_page_new;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate_new = function (full_data, items_per_page_new) {
  var total_pages = Math.ceil(full_data.length / items_per_page_new);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array_new = pages;
  self.current_page_no_new = 1;
  self.update();
};
self.changePageNew = function (e) {
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, e.target.value, self.items_per_page_new);
  self.current_page_no_new = e.target.value;
};
self.changeItemsPerPageNew = function (e) {
  self.items_per_page_new = e.target.value;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.current_page_no_new = 1;
  self.page_select_new.value = 1;
};
/**************** pagination ends*******************/
});
riot.tag2('receive-for-stock-adjustment-report', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Receive for Stock Adjustment</h4> <div show="{receive_for_stock_adjustment_report ==\'receive_for_stock_adjustment_report_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-2"> <div class="form-group"> <label for="issueRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-2"> <div class="form-group"> <label for="issueRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <table class="table table-bordered"> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReceive}" id="gobtn">Go</button> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{receive_for_stock_adjustment_report ==\'receive_for_stock_adjustment_report_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Receive Stock Adjustment<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Receive Date: <b>{m.date}</b></h5> <div each="{d, j in m.receives}"> <table class="table print-small"> <tr> <td> Receive No: <b>{d.receiveDetails.stock_type_code}-{d.receiveDetails.receive_no}</b> </td> <td>Receive Date: <b>{d.receiveDetails.receive_date}</b></td> <td>Approve By: <b>{d.receiveDetails.approve_by}</b></td> </tr> <tr> <td>Adjusted By: <b>{d.receiveDetails.adjusted_by}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Qty</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{k+1}</td> <td>{t.item_name}(Code:{t.item_id})</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterDateWiseStartDateInput');
  dateFormat('issueRegisterDateWiseEndDateInput');
  self.receive_for_stock_adjustment_report = 'receive_for_stock_adjustment_report_home';
  RiotControl.trigger('read_stock_types');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/receive_for_stock_adjustment_report_csv.php?start_date=" + self.issueRegisterDateWiseStartDateInput.value + "&end_date=" + self.issueRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.setStartDate = function () {
  self.sd = self.issueRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.receive_for_stock_adjustment_report = 'receive_for_stock_adjustment_report_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readReceive = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  if (selectedStockTypeString == '') {
    toastr.info("Please Select Stock Type");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_receive_for_stock_adjustment_report', self.issueRegisterDateWiseStartDateInput.value, self.issueRegisterDateWiseEndDateInput.value, selectedStockTypeString);
};

RiotControl.on('read_receive_for_stock_adjustment_report_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.receive_for_stock_adjustment_report = 'receive_for_stock_adjustment_report_report';
  self.issueFrom = self.issueRegisterDateWiseStartDateInput.value;
  self.issueTo = self.issueRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});
});

riot.tag2('receive', '<loading-bar if="{loading}"></loading-bar> <div show="{receive_view ==\'receive_home\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-6"> <h4>Receive</h4> </div> </div> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="selectReadStockTypeInput">Stock Type</label> <select name="selectReadStockTypeInput" class="form-control" onchange="{readReceiveToDepartment}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReceiveToDepartment}" id="gobtn">Go</button> </div> </div> <div class="col-md-8 text-xs-right"> <div class="form-inline"> <input type="search" name="searchReceiveToDept" class="form-control" placeholder="search" onkeyup="{filterReceiveToDept}" style="width:200px;margin-right: 10px;"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{showReceiveToDepartmentEntryForm}"><i class="material-icons">add</i></button> </div> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Receive No</th> <th>Receive Date</th> <th>Approve By</th> <th>Adjusted By</th> <th></th> </tr> <tr each="{c, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td class="text-center">{c.stock_type_code}-{c.receive_no}</td> <td class="text-center">{c.receive_date}</td> <td class="text-center">{c.approve_by}</td> <td class="text-center">{c.adjusted_by}</td> <td> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{view}"><i class="material-icons">visibility</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{deleteReceive}"><i class="material-icons">delete</i></button> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="7"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{receive_view ==\'receive_entry\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-9"> <h4>{title} Receive</h4> </div> <div class="col-md-3"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{closeSaveReceiveToDepartment}"><i class="material-icons">close</i></button> </div> </div> <form> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label for="receiveDateInput">Receive Date</label> <input type="text" class="form-control" id="receiveDateInput" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label>Stock Type</label> <select id="selectStockType" onchange="{changeStockType}" class="form-control" style="min-width:250px"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label>Receive Number: </label> {receive_number} </div> </div> </div> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label for="adjustedByInput">Adjusted By</label> <input type="text" class="form-control" id="adjustedByInput" disabled> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="approveByInput">Approve By</label> <input type="text" class="form-control" id="approveByInput"> </div> </div> </div> <div class="row bgColor" show="{title==\'Add\'}"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter">Item Group</label> <input id="selectItemGroupFilter" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px" disabled> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="searchMaterialInput">Search Material</label> <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{getMaterial}" style="margin-top: 32px;">Get Material</button> </div> </div> </div> <div class="row"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Material</th> <th>UOM</th> <th>Stock in Hand</th> <th>Qty</th> <th>Remarks</th> <th show="{title==\'Add\'}"></th> </tr> <tr each="{cat, i in selectedMaterialsArray}" no-reorder> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td>{cat.uom_code}</td> <td>{cat.stock}</td> <td> <input type="text" id="{\'qtyInput\' + cat.item_id}" value="{cat.qty}" class="form-control"> </td> <td> <input type="text" id="{\'remarksInput\' + cat.item_id}" value="{cat.remarks}" class="form-control"> </td> <td show="{title==\'Add\'}"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeSelectedMaterial.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> <br> <label for="remarksInput">Remarks:</label> <textarea id="remarksInput" class="form-control" rows="2"></textarea> <br> </div> </form> <div class="col-sm-12"> <button type="button" class="btn btn-primary pull-sm-right" onclick="{saveReceiveToDepartment}">Save changes</button> <button type="button" class="btn btn-secondary pull-sm-right" onclick="{closeSaveReceiveToDepartment}" style=" margin-right: 10px;">Close</button> </div> </div> </div> <div show="{receive_view ==\'receive_eye\'}" class="container-fluid print-box"> <div class="container-fluid"> <div class="row no-print"> <div class="col-md-9"> <h4>Receive</h4> </div> <div class="col-md-3"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{closeSaveReceiveToDepartment}"><i class="material-icons">close</i></button> </div> </div> <center> <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> Email: purchase@ntcind.com<br> </center><br> <table class="table table-bordered bill-info-table"> <tr> <th style="width:100px">Receive No</th> <td>{receiveDetails.stock_type_code}-{receiveDetails.receive_no}</td> <th>Receive Date</th> <td>{receiveDetails.receive_date}</td> </tr> <tr> <th>Approve By</th> <td>{receiveDetails.approve_by}</td> <th>Adjusted By</th> <td>{receiveDetails.adjusted_by}</td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th style="max-width:50px;width:50px"><strong>#</strong></th> <th><strong>Material</strong></th> <th><strong>UOM</strong></th> <th><strong>Qty</strong></th> </tr> <tr each="{m, i in receiveViewItems}"> <td><div class="slno">{i+1}</div></td> <td>{m.item_name}-(Code:{m.item_id})</td> <td class="text-center">{m.uom_code}</td> <td class="text-xs-right">{m.qty}</td> </tr> </table> <p show="{showRemarks}"><br><br><br> <b>Remarks: </b> {receiveDetails.remarks}</p> <br><br> <table class="table indent-footer"> <tr> <td style="width:50%"><center style="height:21px">{receiveDetails.approve_by}</center><div><center>Approve By</center></div></td> <td style="width:50%"><center style="height:21px">{receiveDetails.adjusted_by}</center><div><center>Adjusted By</center></div></td> </tr> </table> </div> </div> <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Select Material</h4> <div class="text-xs-right form-inline"> <input type="search" name="searchMaterials" class="form-control" placeholder="search" onkeyup="{filterMaterials}" style="width:200px"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterial}">Submit</button> </div> </div> <div class="modal-body"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th style="width:75px"></th> <th>Material</th> <th>Group</th> </tr> <tr each="{it, i in pagedDataMaterials}"> <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td> <td><input type="checkbox" class="form-control" __checked="{it.selected}" onclick="{parent.toggle}"></td> <td>{it.item_name}-(Code:{it.item_id})</td> <td>{it.item_group}</td> </tr> <tfoot class="no-print"> <tr> <td colspan="10"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPageNew}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select_new" onchange="{changePageNew}"> <option each="{pno in page_array_new}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{selectedMaterial}">Submit</button> </div> </div> </div> </div> <div class="modal fade" id="deleteReceiveModal"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title">Delete Receive</h4> </div> <div class="modal-body"> <center><strong>Are you sure to delete received items</strong></center> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{confirmDeleteReceive}">Delete</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  //RiotControl.trigger('login_init')
  self.items_per_page = 10;
  self.items_per_page_new = 10;
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_item_groups');
  RiotControl.trigger('read_categories');
  RiotControl.trigger('read_chargeheads');
  RiotControl.trigger('read_locations');
  RiotControl.trigger('fetch_user_details_from_session_for_receive');
  self.receive_view = 'receive_home';
  dateFormat('receiveDateInput');
  self.update();
});

self.readReceiveToDepartment = function () {
  self.loading = true;
  RiotControl.trigger('read_received_items_by_department', self.selectReadStockTypeInput.value);
};

self.showReceiveToDepartmentEntryForm = function () {
  self.title = 'Add';
  self.receive_view = 'receive_entry';
  self.selectedMaterialsArray = [];
  self.receive_number = '';
  self.selectStockType.value = '';
  self.selectStockTypeFilter.value = '';
  self.remarksInput.value = '';
  self.approveByInput.value = '';
  $("#receiveDateInput").prop("disabled", false);
  $("#selectStockType").prop("disabled", false);
  self.adjustedByInput.value = self.user_name;
  self.update();
};

self.changeStockType = function () {
  self.selectStockTypeFilter.value = self.selectStockType.value;
  RiotControl.trigger('read_receive_number_by_stock_type', self.selectStockType.value);
};
self.getMaterial = function () {
  self.materials = [];
  if (self.searchMaterialInput.value == '') {
    if (self.selectItemGroupFilter.value == '') {
      toastr.info("Please select Item Group and try again");
      return;
    }
    RiotControl.trigger('read_items_for_receive', self.selected_item_group_code, self.selectStockTypeFilter.value);
  } else {
    RiotControl.trigger('search_items', self.searchMaterialInput.value, self.selectStockTypeFilter.value);
  }
};

self.selectedMaterial = function () {
  self.materials = self.materials.map(function (m) {
    if (m.selected) {
      self.selectedMaterialsArray.push(m);
    }
  });
  $("#itemModal").modal('hide');
  console.log(self.selectedMaterialsArray);
  self.update();
};

self.removeSelectedMaterial = function (i, e) {
  var tempSelectedMaterialsArray = self.selectedMaterialsArray.filter(function (c) {
    return c.item_id != i.item_id;
  });

  self.selectedMaterialsArray = tempSelectedMaterialsArray;
};

self.toggle = function (e) {
  var item = e.item;
  item.selected = !item.selected;

  /*updating selected materials*/
  self.materials = self.materials.map(function (m) {
    if (m.item_id == item.it.item_id) {
      m.item_id = m.item_id;
      m.item_name = m.item_name;
      m.item_description = m.item_description;
      m.uom_code = m.uom_code;
      m.max_level = m.max_level;
      m.min_level = m.min_level;
      m.stock_in_hand = m.stock_in_hand;
      m.selected = item.selected;

      m.qty = '';
      m.location = '';
    }
    m.confirmEdit = false;
    return m;
  });
  return true;
};

self.closeSaveReceiveToDepartment = function () {
  self.receive_view = 'receive_home';
};

self.view = function (e) {
  RiotControl.trigger('read_receive_view', e.item.c.receive_id);
};

self.edit = function (e) {
  self.edit_receive_id = e.item.c.receive_id;
  RiotControl.trigger('read_items_for_receive_edit', e.item.c.receive_id);
};

self.deleteReceive = function (e) {
  self.delete_receive_id = e.item.c.receive_id;
  $("#deleteReceiveModal").modal('show');
};
self.confirmDeleteReceive = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_receive', self.delete_receive_id, self.receivedItems);
};

self.saveReceiveToDepartment = function () {
  if (self.receiveDateInput.value == '') {
    toastr.info("Please Entet Receive Date");
    return;
  }

  var str = self.receiveDateInput.value;
  var d = str.split("/");
  var po_date = moment([d[2].trim() + d[1].trim() + d[0].trim()], 'YYYYMMDD');
  var toDay = moment().format('YYYYMMDD');

  var from = moment(po_date, 'YYYYMMDD');
  var to = moment(toDay, 'YYYYMMDD');
  var differnece = to.diff(from, 'days');

  if (differnece < 0) {
    toastr.error("Receive date can not be greater than today");
    return;
  }

  if (self.adjustedByInput.value == '') {
    toastr.info("please provide adjested by");
    return;
  }

  if (self.approveByInput.value == '') {
    toastr.info("please provide receive by");
    return;
  }

  var error = '';
  var count = 1;
  self.selectedMaterialsArray.map(function (i) {

    var qtyInput = '#qtyInput' + i.item_id;
    i.qty = $(qtyInput).val();

    var remarksInput = '#remarksInput' + i.item_id;
    i.remarks = $(remarksInput).val();

    //validation check
    if (i.qty == '') {
      error = error + 'please enter qty' + count + ',';
    }
    count++;
  });

  if (error != '') {
    toastr.info(error);
    return;
  } else if (self.title == 'Add') {
    RiotControl.trigger('add_receive', self.selectedMaterialsArray, self.receiveDateInput.value, self.adjustedByInput.value, self.approveByInput.value, self.receive_number, self.selectStockType.value, self.remarksInput.value);
  } else if (self.title == 'Edit') {
    RiotControl.trigger('edit_receive_to_department', self.selectedMaterialsArray, self.receiveDateInput.value, self.adjustedByInput.value, self.approveByInput.value, self.edit_receive_id, self.remarksInput.value);
  }
};

self.filterReceiveToDept = function () {
  if (!self.searchReceiveToDept) return;
  self.filteredReceiveToDept = self.receivedItems.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchReceiveToDept.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredReceiveToDept, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredReceiveToDept, 1, self.items_per_page);
};

self.filterMaterials = function () {
  if (!self.searchMaterials) return;
  self.filteredMaterials = self.materials.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase()) >= 0;
  });

  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
};

/*method change callback from store*/
RiotControl.on('item_groups_changed', function (item_groups) {

  $('#selectItemGroupFilter').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
      console.log(self.selected_item_group_code);
    }
  });
  self.update();
});

RiotControl.on('categories_changed', function (categories) {
  self.categories = categories;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('read_items_for_receive_changed', function (items) {
  $("#itemModal").modal('show');
  self.loading = false;
  self.materials = items;

  self.filteredMaterials = self.materials;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.update();
});

RiotControl.on('search_items_changed', function (items) {
  $("#itemModal").modal('show');
  self.loading = false;
  self.materials = items;
  self.searchMaterialInput.value = '';

  self.filteredMaterials = self.materials;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.update();
});

RiotControl.on('chargeheads_changed', function (chargeheads) {
  self.loading = false;
  self.chargeheads = chargeheads;
  self.update();
});

RiotControl.on('locations_changed', function (locations) {
  self.loading = false;
  self.locations = locations;
  self.update();
});

RiotControl.on('add_receive_changed', function () {
  self.loading = false;
  self.receive_view = 'receive_home';
  self.update();
});

RiotControl.on('edit_receive_to_department_changed', function () {
  self.loading = false;
  self.receive_view = 'receive_home';
  self.update();
});

RiotControl.on('read_received_items_by_department_changed', function (items) {
  self.loading = false;
  self.receivedItems = [];
  self.receivedItems = items;
  self.filteredReceiveToDept = items;

  self.paginate(self.filteredReceiveToDept, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredReceiveToDept, 1, self.items_per_page);
  self.update();
});

RiotControl.on('read_items_for_receive_edit_changed', function (items, details) {
  $("#receiveDateInput").prop("disabled", true);
  $("#selectStockType").prop("disabled", true);

  self.loading = false;
  self.title = 'Edit';
  self.receive_view = 'receive_entry';
  self.selectedMaterialsArray = [];
  self.selectedMaterialsArray = items;
  self.receiveDateInput.value = details.receive_date;
  self.adjustedByInput.value = details.adjusted_by;
  self.approveByInput.value = details.approve_by;
  self.remarksInput.value = details.remarks;
  self.selectStockType.value = details.stock_type_code;
  self.receive_number = details.receive_no;
  self.update();
});

RiotControl.on('read_receive_number_by_stock_type_changed', function (receive_number) {
  self.loading = false;
  self.receive_number = receive_number;
  self.update();
});

RiotControl.on('read_receive_view_changed', function (details, items) {
  self.loading = false;
  self.receive_view = 'receive_eye';
  self.receiveDetails = {};
  self.receiveDetails = details;
  self.showRemarks = false;
  if (details.remarks != null) {
    if (details.remarks.length > 0) {
      self.showRemarks = true;
    }
  }

  self.receiveViewItems = [];
  self.receiveViewItems = items;
  self.update();
});

RiotControl.on('delete_receive_changed', function (items) {
  self.loading = false;
  $("#deleteReceiveModal").modal('hide');
  self.receivedItems = items;
  self.update();
});

RiotControl.on('fetch_user_details_from_session_for_receive_changed', function (user_name, user_id) {
  self.loading = false;
  self.user_name = user_name;
  self.user_id = user_id;
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredReceiveToDept, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredReceiveToDept, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredReceiveToDept, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/**************** pagination for items*******************/
self.getPageDataNew = function (full_data, page_no, items_per_page_new) {
  var start_index = (page_no - 1) * items_per_page_new;
  var end_index = page_no * items_per_page_new;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate_new = function (full_data, items_per_page_new) {
  var total_pages = Math.ceil(full_data.length / items_per_page_new);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array_new = pages;
  self.current_page_no_new = 1;
  self.update();
};
self.changePageNew = function (e) {
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, e.target.value, self.items_per_page_new);
  self.current_page_no_new = e.target.value;
};
self.changeItemsPerPageNew = function (e) {
  self.items_per_page_new = e.target.value;
  self.paginate_new(self.filteredMaterials, self.items_per_page_new);
  self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new);
  self.current_page_no_new = 1;
  self.page_select_new.value = 1;
};
/**************** pagination ends*******************/
});
riot.tag2('reject-to-party-date-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Reject To Party (Date Wise)</h4> <div show="{reject_to_party_date_wise ==\'reject_to_party_date_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <table class="table table-bordered"> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReject}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExportNew}"> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{reject_to_party_date_wise ==\'reject_to_party_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Reject To Party (Date Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Reject Date: <b>{m.date}</b></h5> <div each="{d, j in m.issues}"> <table class="table print-small"> <tr> <td>Reject No: <b>{d.rejectDetails.stock_type_code}-{d.rejectDetails.reject_to_party_no}</b></td> <td>Reject Date: <b>{d.rejectDetails.reject_date}</b></td> <td>Reject By: <b>{d.rejectDetails.rejected_by}</b></td> </tr> <tr> <td>Transporter Name: <b>{d.rejectDetails.transporter_name}</b></td> <td>LR No: <b>{d.rejectDetails.lr_no}</b></td> <td>Vehicle No: <b>{d.rejectDetails.vehicle_no}</b></td> </tr> <tr> <td colspan="3">Mode Of Transportation: <b>{d.rejectDetails.mode_of_transport}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Return Qty</th> <th>Rate</th> <th>Amount</th> <th>Reason for Rejection</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{k+1}</td> <td>{t.item_name}(Code:{t.item_id})</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.reject_to_party_qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td>{t.reject_to_party_remarks}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterDateWiseStartDateInput');
  dateFormat('issueRegisterDateWiseEndDateInput');
  self.reject_to_party_date_wise = 'reject_to_party_date_wise_home';
  RiotControl.trigger('read_stock_types');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/reject_to_party_date_wise_csv.php?start_date=" + self.issueRegisterDateWiseStartDateInput.value + "&end_date=" + self.issueRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.excelExportNew = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/reject_to_party_date_wise_csv_new.php?start_date=" + self.issueRegisterDateWiseStartDateInput.value + "&end_date=" + self.issueRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.setStartDate = function () {
  self.sd = self.issueRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.reject_to_party_date_wise = 'reject_to_party_date_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readReject = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  if (selectedStockTypeString == '') {
    toastr.info("Please Select Stock Type");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_reject_to_party_date_wise', self.issueRegisterDateWiseStartDateInput.value, self.issueRegisterDateWiseEndDateInput.value, selectedStockTypeString);
};

RiotControl.on('read_reject_to_party_date_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.reject_to_party_date_wise = 'reject_to_party_date_wise_report';
  self.issueFrom = self.issueRegisterDateWiseStartDateInput.value;
  self.issueTo = self.issueRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});
});

riot.tag2('reject-to-party-docket-date-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Reject To Party (Docket Date Wise)</h4> <div show="{reject_to_party_docket_date_wise ==\'reject_to_party_docket_date_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <table class="table table-bordered"> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReject}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{reject_to_party_docket_date_wise ==\'reject_to_party_docket_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Reject To Party (Docket Date Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Docket Date: <b>{m.date}</b></h5> <div each="{d, j in m.issues}"> <table class="table print-small"> <tr> <td>Reject No: <b>{d.rejectDetails.stock_type_code}-{d.rejectDetails.reject_to_party_no}</b></td> <td>Docket Date: <b>{d.rejectDetails.docket_date}</b></td> <td>Reject By: <b>{d.rejectDetails.rejected_by}</b></td> </tr> <tr> <td>Transporter Name: <b>{d.rejectDetails.transporter_name}</b></td> <td>LR No: <b>{d.rejectDetails.lr_no}</b></td> <td>Vehicle No: <b>{d.rejectDetails.vehicle_no}</b></td> </tr> <tr> <td colspan="3">Mode Of Transportation: <b>{d.rejectDetails.mode_of_transport}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Return Qty</th> <th>Rate</th> <th>Amount</th> <th>Reason for Rejection</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{k+1}</td> <td>{t.item_name}(Code:{t.item_id})</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.reject_to_party_qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> <td>{t.reject_to_party_remarks}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterDateWiseStartDateInput');
  dateFormat('issueRegisterDateWiseEndDateInput');
  self.reject_to_party_docket_date_wise = 'reject_to_party_docket_date_wise_home';
  RiotControl.trigger('read_stock_types');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/reject_to_party_docket_date_wise_csv.php?start_date=" + self.issueRegisterDateWiseStartDateInput.value + "&end_date=" + self.issueRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.setStartDate = function () {
  self.sd = self.issueRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.reject_to_party_docket_date_wise = 'reject_to_party_docket_date_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readReject = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  if (selectedStockTypeString == '') {
    toastr.info("Please Select Stock Type");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_reject_to_party_docket_date_wise', self.issueRegisterDateWiseStartDateInput.value, self.issueRegisterDateWiseEndDateInput.value, selectedStockTypeString);
};

RiotControl.on('read_reject_to_party_docket_date_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.reject_to_party_docket_date_wise = 'reject_to_party_docket_date_wise_report';
  self.issueFrom = self.issueRegisterDateWiseStartDateInput.value;
  self.issueTo = self.issueRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});
});

riot.tag2('reject-to-party-item-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Reject To Party (Item Wise)</h4> <div show="{reject_to_party_item_wise ==\'reject_to_party_item_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReject}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{reject_to_party_item_wise ==\'reject_to_party_item_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Reject To Party (Item Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Item: <b>{m.item}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Reject No</th> <th>Reject Date</th> <th>Reject By</th> <th>Party</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.stock_type_code}-{t.reject_to_party_no}</td> <td>{t.reject_date}</td> <td>{t.rejected_by}</td> <td>{t.party_name}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.reject_to_party_qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> </tr> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.reject_to_party_item_wise = 'reject_to_party_item_wise_home';
  self.loading = true;
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_items_filter');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    console.log(i);
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/reject_to_party_item_wise_csv.php?start_date=" + self.issueRegisterItemWiseStartDateInput.value + "&end_date=" + self.issueRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&item_id=" + selected_item_id;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/
self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.reject_to_party_item_wise = 'reject_to_party_item_wise_home';
};

self.readReject = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    console.log(i);
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_reject_to_party_item_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_item_id);
};

RiotControl.on('read_reject_to_party_item_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.reject_to_party_item_wise = 'reject_to_party_item_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.loading = false;
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('reject-to-party-party-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Reject To Party (Party Wise)</h4> <div show="{reject_to_party_party_wise ==\'reject_to_party_party_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReject}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <table class="table table-bordered"> <th>#</th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchParty" class="form-control" placeholder="Search Party" onkeyup="{filterParties}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectParty.bind(this, cat)}"></td> <td>{cat.party_name}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Party</th> <th></th> </tr> <tr each="{cat, i in checkedParties}"> <td>{i+1}</td> <td>{cat.party_name}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeParty.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{reject_to_party_party_wise ==\'reject_to_party_party_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Reject To Party (Party Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Party: <b>{m.party}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Reject No</th> <th>Reject Date</th> <th>Reject By</th> <th>Item</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.stock_type_code}-{t.reject_to_party_no}</td> <td>{t.reject_date}</td> <td>{t.rejected_by}</td> <td>{t.item_name}-(Code:{t.item_id})</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.reject_to_party_qty}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.amount}</td> </tr> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.checkedParties = [];
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.reject_to_party_party_wise = 'reject_to_party_party_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_parties');
});

self.excelExport = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (selected_party_id == '') {
      selected_party_id = t.party_id;
    } else if (selected_party_id != '') {
      selected_party_id = selected_party_id + ',' + t.party_id;
    }
  });

  var link = "csv/reject_to_party_party_wise_csv.php?start_date=" + self.issueRegisterItemWiseStartDateInput.value + "&end_date=" + self.issueRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&party_id=" + selected_party_id;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.filterParties = function () {
  if (!self.searchParty) return;
  self.filteredParties = self.parties.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
};

self.selectParty = function (t, e) {
  self.checkedParties.push(t);

  self.parties = self.parties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.party_id != t.party_id;
  });
};

self.removeParty = function (t, e) {
  self.checkedParties = self.checkedParties.filter(function (c) {
    return c.party_id != t.party_id;
  });
  console.log(self.checkedParties);

  self.parties.push(t);
  self.pagedDataItems.push(t);
};

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.reject_to_party_party_wise = 'reject_to_party_party_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readReject = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_party_id = '';

  self.checkedParties.map(function (t) {
    if (selected_party_id == '') {
      selected_party_id = t.party_id;
    } else if (selected_party_id != '') {
      selected_party_id = selected_party_id + ',' + t.party_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_reject_to_party_party_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_party_id);
};

RiotControl.on('read_reject_to_party_party_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.reject_to_party_party_wise = 'reject_to_party_party_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('parties_changed', function (parties, party) {
  self.loading = false;
  self.checkedParties = [];
  self.parties = party;
  self.filteredParties = party;

  self.items_per_page = 10;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredParties, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('reject-to-party', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <h4 class="no-print">{title} Reject to party</h4> </div> <div show="{reject_to_party_view ==\'reject_to_party_home_page\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="stockTypeInput">Stock Type</label> <select name="stockTypeForReadRejectedDocketInput" class="form-control" onchange="{readRejectedDocket}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type_code}-{stock_type}</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readRejectedDocket}" id="gobtn">Go</button> </div> </div> <div class="col-md-8 text-xs-right"> <div class="form-inline"> <input type="search" name="searchRjectedDocket" class="form-control" placeholder="search" onkeyup="{filterDockets}" style="width:200px;margin-right: 10px;"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{showRejectDocketEntryForm}"><i class="material-icons">add</i></button> </div> </div> </div> <table class="table table-bordered"> <tr> <th>#</th> <th>Reject Number</th> <th>Rejection Date</th> <th>Rejected By</th> <th></th> </tr> <tr each="{d, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td class="text-center">{d.stock_type_code}-{d.reject_to_party_no}</td> <td class="text-center">{d.reject_date}</td> <td class="text-center">{d.rejected_by}</td> <td> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{viewDocketDetails.bind(this,d)}"><i class="material-icons">visibility</i> </button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit.bind(this,d)}"><i class="material-icons">create</i> </button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{deleteRejectToParty}"><i class="material-icons">delete</i> </button> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="5"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{reject_to_party_view ==\'reject_to_party_home\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="stockTypeInput">Stock Type</label> <select name="stockTypeForReadRejectToPartyInput" class="form-control" onchange="{readDocket}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type_code}-{stock_type}</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readDocket}" id="gobtn">Go</button> </div> </div> <div class="col-md-8"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{showDocketHome}"><i class="material-icons">close</i></button> </div> </div> <table class="table table-bordered"> <tr> <th>Docket Number</th> <th>Docket Date</th> <th>Party Name</th> <th>Bill No</th> <th>Bill Date</th> <th>Amount</th> <th></th> </tr> <tr each="{d, i in dockets}"> <td class="text-center">{d.stock_type_code}-{d.docket_no}</td> <td class="text-center">{d.docket_date}</td> <td class="text-center">{d.party_name}</td> <td class="text-center">{d.bill_no}</td> <td class="text-center">{d.bill_date}</td> <td class="text-center">{d.bill_amount}</td> <td> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{rejectToPartyEnteryForm.bind(this,d)}"><i class="material-icons">local_shipping</i></button> </td> </tr> </table> </div> </div> <div show="{reject_to_party_view ==\'reject_to_party\'}"> <button type="button" class="btn btn-secondary text-right" onclick="{showRejectToPartyHome}" style="margin-top:-30px">Close</button> <div class="container-fluid"> <table class="table"> <tr> <td> <span>Reject Date</span> <input type="text" class="form-control" id="rejectToPartyDateInput" style="width:200px" placeholder="DD/MM/YYYY"> </td> <td> <span>Rejected By</span> <input type="text" class="form-control" id="rejectedByInput" style="width:200px" disabled> </td> <td>Party Details: <b>{docketDetails.party_name}</b></td> </tr> <tr> <td>Docket No: <b>{docketDetails.stock_type_code}-{docketDetails.docket_no}</b></td> <td>Bill No: <b>{docketDetails.bill_no}</b></td> <td>Challan No: <b>{docketDetails.challan_no}</b></td> </tr> <tr> <td>Docket Date: <b>{docketDetails.docket_date}</b></td> <td>Bill Date: <b>{docketDetails.bill_date}</b></td> <td>Challan Date: <b>{docketDetails.challan_date}</b></td> </tr> <tr> <td>PO No: <b>{docketDetails.po_no}</b><br> PO Date: <b>{docketDetails.po_date}</b> </td> <td>Transporter Name <input type="text" class="form-control" id="transporterInput" style="width:200px"> </td> <td>LR No <input type="text" class="form-control" id="lrNoInput" style="width:200px"> </td> </tr> <tr> <td>Reject To Party No:<b>{reject_to_party_stock_type}-{reject_to_party_no}</b></td> <td>Vehicle No <input type="text" class="form-control" id="vehicleInput" style="width:200px"> </td> <td>Mode Of Transportation <input type="text" class="form-control" id="modeOfTransportInput" style="width:200px"> </td> </tr> <tr> <td colspan="2"> </td> </tr> </table> <table class="table table-bordered"> <tr> <th>#</th> <th style="width:50px"></th> <th>Item Code</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> <th>Return Qty</th> <th>Reason for Rejection</th> </tr> <tr each="{m, i in materials}"> <td>{i+1}</td> <td><input type="checkbox" __checked="{m.selected}" id="{\'docketItemSelectionInput\'+m.transaction_id}" onclick="{selectDocketItems.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.item_id}</td> <td>{m.item_name}</td> <td>{m.location}</td> <td>{m.uom_code}</td> <td>{m.qty}</td> <td>{m.rate}</td> <td><input type="text" id="{\'rejectToPartyInput\'+m.transaction_id}" value="{m.reject_to_party_qty}" class="form-control"></td> <td><input type="text" id="{\'rejectToPartyRemarks\'+m.transaction_id}" value="{m.reject_to_party_remarks}" class="form-control"></td> </tr> </table> <div class="row"> <button type="button" class="btn btn-secondary text-right" onclick="{showRejectToPartyHome}">Close</button> <button type="button" class="btn btn-primary text-right" onclick="{submitRejectToParty}" style="margin-right:10px">Submit</button> </div> </div> </div> <div show="{reject_to_party_view ==\'reject_to_party_view\'}"> <div class="container-fliud print-box"> <center> <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <h4>Reject To Party</h4><br> </center> <table class="table table-bordered bill-info-table"> <tr> <th style="width:90px">Reject No</th> <td>{docketDetails.stock_type_code}-{docketDetails.reject_to_party_no}</td> <th>Reject Date</th> <td>{docketDetails.reject_date}</td> <th>Party</th> <td>{docketDetails.party_name}</td> </tr> <tr> <th>Docket No</th> <td>{docketDetails.stock_type_code}-{docketDetails.docket_no}</td> <th>Bill No</th> <td>{docketDetails.bill_no}</td> <th style="width:140px">Challan No</th> <td>{docketDetails.challan_no}</td> </tr> <tr> <th><span style="font-size:11px;">Docket Date</span></th> <td>{docketDetails.docket_date}</td> <th>Bill Date</th> <td>{docketDetails.bill_date}</td> <th>Challan Date</th> <td>{docketDetails.challan_date}</td> </tr> <tr> <th>PO No</th> <td>{docketDetails.stock_type_code}-{docketDetails.po_no}</td> <th>PO Date</th> <td>{docketDetails.po_date}</td> <th>Transporter Name</th> <td>{docketDetails.transporter_name}</td> </tr> <tr> <th>Vehicle No</th> <td>{docketDetails.vehicle_no}</td> <th>LR No</th> <td>{docketDetails.lr_no}</td> <th>Mode Of Transpotation</th> <td>{docketDetails.mode_of_transport}</td> </tr> </table> <table class="table table-bordered"> <tr> <th>#</th> <th>Item Name</th> <th>Unit</th> <th>Location</th> <th>Rate</th> <th>Return Qty</th> <th>Reason for Rejection</th> </tr> <tr each="{m, i in materials}"> <td>{i+1}</td> <td class="text-md-center">{m.item_name}(code:{m.item_id})</td> <td class="text-md-center">{m.uom_code}</td> <td class="text-md-center">{m.location}</td> <td class="text-md-right">{m.rate}</td> <td class="text-md-right">{m.reject_to_party_qty}</td> <td class="text-md-center">{m.reject_to_party_remarks}</td> </tr> </table> <div class="row"> <button type="button" class="btn btn-secondary text-right no-print" onclick="{showDocketHome}">Close</button> </div> </div> </div> <div class="modal fade" id="deleteRejectToPartyModal"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title">Delete Reject To Party</h4> </div> <div class="modal-body"> <center><strong>Are you sure to delete reject to party items</strong></center> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{confirmDeleteRejectToParty}">Delete</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.items_per_page = 10;
  self.reject_to_party_view = 'reject_to_party_home_page';
  RiotControl.trigger('read_stock_type_details');
  RiotControl.trigger('fetch_user_details_from_session_for_reject_to_party');
  self.title = '';
  self.update();
});

self.showRejectDocketEntryForm = function () {
  self.title = 'Add';
  self.reject_to_party_view = 'reject_to_party_home';
};
self.showDocketHome = function () {
  self.title = '';
  self.reject_to_party_view = 'reject_to_party_home_page';
};

self.readRejectedDocket = function () {
  if (self.stockTypeForReadRejectedDocketInput.value == '') {
    toastr.info("Please Select Stock type");
    return;
  }
  self.loading = true;
  RiotControl.trigger('read_rejected_docket', self.stockTypeForReadRejectedDocketInput.value);
};

self.readDocket = function () {
  if (self.stockTypeForReadRejectToPartyInput.value == '') {
    toastr.info("Please Select Stock type");
    return;
  }
  self.loading = true;
  RiotControl.trigger('read_docket_to_reject', self.stockTypeForReadRejectToPartyInput.value);
};

self.selectDocketItems = function (item, e) {
  console.log(e.item);
  e.item.m.selected = !e.item.m.selected;
  console.log(self.materials);
};

self.showRejectToPartyHome = function () {
  self.title = '';
  self.reject_to_party_view = 'reject_to_party_home_page';
};

self.viewDocketDetails = function (d, e) {
  self.loading = true;
  RiotControl.trigger('read_rejected_docket_details', d.docket_id, d.reject_to_party_id);
};
self.edit = function (d, e) {
  self.loading = true;
  self.reject_to_party_docket_id = d.docket_id;
  self.edit_reject_to_party_id = d.reject_to_party_id;
  RiotControl.trigger('read_rejected_docket_edit', d.docket_id, d.reject_to_party_id);
};

self.rejectToPartyEnteryForm = function (d, e) {
  self.loading = true;
  self.reject_to_party_docket_id = d.docket_id;
  console.log('calling resd sdsd');
  RiotControl.trigger('read_docket_details_reject_to_party', d.docket_id, self.stockTypeForReadRejectToPartyInput.value);
};

self.submitRejectToParty = function () {
  if (self.rejectToPartyDateInput.value == '') {
    toastr.error("Please Enter Reject Date");
    return;
  }

  var str = self.rejectToPartyDateInput.value;
  var d = str.split("/");
  var po_date = moment([d[2].trim() + d[1].trim() + d[0].trim()], 'YYYYMMDD');
  var toDay = moment().format('YYYYMMDD');

  var from = moment(po_date, 'YYYYMMDD');
  var to = moment(toDay, 'YYYYMMDD');
  var differnece = to.diff(from, 'days');

  if (differnece < 0) {
    toastr.error("Reject date can not be greater than today");
    return;
  }

  if (self.transporterInput.value == '') {
    toastr.error("Please Enter Transporter Name");
    return;
  }

  if (self.vehicleInput.value == '') {
    toastr.error("Please Enter Vehicle No");
    return;
  }

  if (self.modeOfTransportInput.value == '') {
    toastr.error("Please Enter Mode of Transpotation");
    return;
  }

  var count = 0;
  var selectedMaterials = [];
  var error = '';
  self.materials.map(function (i) {
    count++;
    if (i.selected) {
      var rejectToPartyInput = '#rejectToPartyInput' + i.transaction_id;
      i.reject_to_party_qty = $(rejectToPartyInput).val();
      if (i.reject_to_party_qty == '') {
        error = error + " Please Enter return qty" + count + ", ";
      }

      if (self.title == 'Add') {
        console.log('qty= ' + i.qty + 'return_qty= ' + i.reject_to_party_qty);
        if (Number(i.qty) < Number(i.reject_to_party_qty)) {
          error = error + "Return Qty" + count + " can't be greater than Qty, ";
        }
      } else if (self.title == 'Edit') {
        var max_qty = Number(i.qty) + Number(i.reject_to_party_qty_old); //qty=remaing_docket_qty
        console.log('max qty= ' + max_qty + 'return_qty= ' + i.reject_to_party_qty);
        if (Number(max_qty) < Number(i.reject_to_party_qty)) {
          error = error + "Return Qty" + count + " can't be greater than Qty, ";
        }
      }

      var rejectToPartyRemarks = '#rejectToPartyRemarks' + i.transaction_id;
      i.reject_to_party_remarks = $(rejectToPartyRemarks).val();
      selectedMaterials.push(i);
    }
  });

  if (selectedMaterials.length == 0) {
    error = error + " Please select at least one material";
  }

  if (error != '') {
    toastr.error(error);
    return;
  }

  self.loading = true;
  if (self.title == 'Add') {
    RiotControl.trigger('reject_to_party', self.reject_to_party_docket_id, selectedMaterials, self.rejectToPartyDateInput.value, self.rejectedByInput.value, self.dockets, self.docketDetails.docket_date, self.transporterInput.value, self.lrNoInput.value, self.vehicleInput.value, self.modeOfTransportInput.value, self.reject_to_party_stock_type, self.reject_to_party_no);
  } else if (self.title == 'Edit') {
    RiotControl.trigger('reject_to_party_edit', self.reject_to_party_docket_id, selectedMaterials, self.rejectToPartyDateInput.value, self.rejectedByInput.value, self.dockets, self.docketDetails.docket_date, self.transporterInput.value, self.lrNoInput.value, self.vehicleInput.value, self.modeOfTransportInput.value, self.reject_to_party_stock_type, self.reject_to_party_no, self.edit_reject_to_party_id);
  }
};

self.deleteRejectToParty = function (e) {
  self.delete_reject_to_party_id = e.item.d.reject_to_party_id;
  $("#deleteRejectToPartyModal").modal('show');
};
self.confirmDeleteRejectToParty = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_reject_to_party', self.delete_reject_to_party_id, self.rejectedDockets);
};

self.filterDockets = function () {
  if (!self.searchRjectedDocket) return;
  self.filteredDockets = self.rejectedDockets.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchRjectedDocket.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredDockets, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page);
};

/*method change callback from store*/
RiotControl.on('stock_types_details_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('read_rejected_docket_changed', function (dockets) {
  self.loading = false;
  self.rejectedDockets = [];
  self.rejectedDockets = dockets;
  self.filteredDockets = dockets;

  self.paginate(self.filteredDockets, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page);
  self.update();
});

RiotControl.on('read_docket_to_reject_changed', function (dockets) {
  self.loading = false;
  self.dockets = [];
  self.dockets = dockets;
  self.update();
});

RiotControl.on('read_rejected_docket_details_changed', function (dockets) {
  self.loading = false;
  self.reject_to_party_view = 'reject_to_party_view';
  self.docketDetails = [];
  self.materials = [];
  self.docketDetails = dockets.details;
  self.materials = dockets.items;
  console.log(self.docketDetails);
  self.update();
});

RiotControl.on('read_docket_details_reject_to_party_changed', function (details, items, reject_to_party_no) {
  self.reject_to_party_view = 'reject_to_party';
  dateFormat('rejectToPartyDateInput');
  self.loading = false;
  self.docketDetails = [];
  self.materials = [];

  self.docketDetails = details;
  self.materials = items;
  self.rejectedByInput.value = self.user_name;
  self.reject_to_party_no = reject_to_party_no;
  self.reject_to_party_stock_type = self.stockTypeForReadRejectToPartyInput.value;
  $('#rejectToPartyDateInput').prop('disabled', false);
  self.update();
});

RiotControl.on('reject_to_party_changed', function (dockets) {
  self.loading = false;
  self.reject_to_party_view = 'reject_to_party_home';
  self.dockets = [];
  self.dockets = dockets;
  self.update();
});

RiotControl.on('reject_to_party_edit_changed', function (dockets) {
  self.loading = false;
  self.reject_to_party_view = 'reject_to_party_home_page';
  self.update();
});

RiotControl.on('reject_to_party_date_error', function (msg) {
  self.loading = false;
  toastr.error(msg);
  self.update();
});

RiotControl.on('fetch_user_details_from_session_for_reject_to_party_changed', function (user_name, user_id) {
  console.log('here');
  console.log(user_name);
  self.loading = false;
  self.user_name = user_name;
  self.user_id = user_id;
  console.log(self.user_name);
  self.update();
});

RiotControl.on('delete_reject_to_party_changed', function (items) {
  self.loading = false;
  $("#deleteRejectToPartyModal").modal('hide');
  self.rejectedDockets = items;
  self.update();
});

RiotControl.on('read_rejected_docket_edit_changed', function (details, detailsRP, items) {
  self.reject_to_party_view = 'reject_to_party';
  dateFormat('rejectToPartyDateInput');
  self.title = 'Edit';
  self.loading = false;
  self.docketDetails = [];
  self.materials = [];

  self.docketDetails = details;
  self.materials = items;
  self.rejectedByInput.value = self.user_name;
  self.reject_to_party_no = detailsRP.reject_to_party_no;
  self.reject_to_party_stock_type = detailsRP.stock_type_code;

  self.rejectToPartyDateInput.value = detailsRP.reject_date;
  self.transporterInput.value = detailsRP.transporter_name;
  self.lrNoInput.value = detailsRP.lr_no;
  self.vehicleInput.value = detailsRP.vehicle_no;
  self.modeOfTransportInput.value = detailsRP.mode_of_transport;
  $('#rejectToPartyDateInput').prop('disabled', true);

  self.materials.map(function (i) {
    if (i.checked == 'true') {
      var docketItemSelectionInput = '#docketItemSelectionInput' + i.transaction_id;
      $(docketItemSelectionInput).prop('checked', true);
      i.selected = true;
    } else {
      var _docketItemSelectionInput = '#docketItemSelectionInput' + i.transaction_id;
      $(_docketItemSelectionInput).prop('checked', false);
      i.selected = false;
    }
  });
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredDockets, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredDockets, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});
riot.tag2('reports', '<div class="no-print"> <ul class="nav nav-pills" style="margin:20px 0"> <li class="nav-item"> <a class="nav-link {active: selected_report == \'docket-register-date-wise\'}" href="#reports/docket-register-date-wise">Docket Register(Date Wise)</a> </li> </ul> </div> <div id="report-view" class="container-fulid"></div>', '', '', function(opts) {
'use strict';

var self = this;
if (!opts.selected_report) {
  self.selected_report = 'stock-statement';
} else {
  self.selected_report = opts.selected_report;
}
});
riot.tag2('return-to-stock-date-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Return to Stock (Date Wise)</h4> <div show="{return_to_stock_date_wise ==\'return_to_stock_date_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterDateWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="issueRegisterDateWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterDateWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <table class="table table-bordered"> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReturn}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{return_to_stock_date_wise ==\'return_to_stock_date_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Return to Stock (Date Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Return Date: <b>{m.date}</b></h5> <div each="{d, j in m.issues}"> <table class="table print-small"> <tr> <td>Return No: <b>{d.returnDetails.stock_type_code}-{d.returnDetails.return_to_stock_no}</b></td> <td>Return Date: <b>{d.returnDetails.return_date}</b></td> <td>Return By: <b>{d.returnDetails.return_by}</b></td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Qty</th> </tr> <tr each="{t, k in d.transactions}" no-reorder> <td>{k+1}</td> <td>{t.item_name}(Code:{t.item_id})</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.return_to_stock_qty}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterDateWiseStartDateInput');
  dateFormat('issueRegisterDateWiseEndDateInput');
  self.return_to_stock_date_wise = 'return_to_stock_date_wise_home';
  RiotControl.trigger('read_stock_types');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var link = "csv/return_to_stock_date_wise_csv.php?start_date=" + self.issueRegisterDateWiseStartDateInput.value + "&end_date=" + self.issueRegisterDateWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.setStartDate = function () {
  self.sd = self.issueRegisterDateWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterDateWiseEndDateInput.value;
};

self.closeReport = function () {
  self.return_to_stock_date_wise = 'return_to_stock_date_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readReturn = function () {
  if (self.issueRegisterDateWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterDateWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  if (selectedStockTypeString == '') {
    toastr.info("Please Select Stock Type");
    return;
  }

  self.loading = true;
  RiotControl.trigger('read_return_to_stock_date_wise', self.issueRegisterDateWiseStartDateInput.value, self.issueRegisterDateWiseEndDateInput.value, selectedStockTypeString);
};

RiotControl.on('read_return_to_stock_date_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.return_to_stock_date_wise = 'return_to_stock_date_wise_report';
  self.issueFrom = self.issueRegisterDateWiseStartDateInput.value;
  self.issueTo = self.issueRegisterDateWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});
});

riot.tag2('return-to-stock-dept-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Return To Stock (Department Wise)</h4> <div show="{return_to_stock_dept_wise ==\'return_to_stock_dept_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReturn}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th class="serial-col">#</th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{\'selectStockTypeFilter\' + m.stock_type_code}" onclick="{selectStockType.bind(this,m)}" class="form-control" style="margin-top: 5px;"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchDepartment" class="form-control" placeholder="Search Departmnent" onkeyup="{filterDepartments}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectDepartment.bind(this, cat)}"></td> <td>{cat.department}</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Department</th> <th></th> </tr> <tr each="{cat, i in checkedDepartments}"> <td>{i+1}</td> <td>{cat.department}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeDepartment.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{return_to_stock_dept_wise ==\'return_to_stock_dept_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Return To Stock (Department Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Department: <b>{m.department}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Return No</th> <th>Return Date</th> <th>Return By</th> <th>Item</th> <th>Location</th> <th>Unit</th> <th>Qty</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.stock_type_code}{t.return_to_stock_no}</td> <td>{t.return_date}</td> <td>{t.return_by}</td> <td>{t.item_name}-(Code:{t.item_id})</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.return_to_stock_qty}</td> </tr> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.checkedDepartments = [];
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.return_to_stock_dept_wise = 'return_to_stock_dept_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_departments');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_department_id = '';

  self.checkedDepartments.map(function (t) {
    if (selected_department_id == '') {
      selected_department_id = t.department_id;
    } else if (selected_department_id != '') {
      selected_department_id = selected_department_id + ',' + t.department_id;
    }
  });

  var link = "csv/return_to_stock_dept_wise_csv.php?start_date=" + self.issueRegisterItemWiseStartDateInput.value + "&end_date=" + self.issueRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&department_id=" + selected_department_id;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};
/********************************* department filter start*************************/
self.filterDepartments = function () {
  if (!self.searchDepartment) return;
  self.filteredDepartments = self.departments.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchDepartment.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
};

self.selectDepartment = function (t, e) {
  self.checkedDepartments.push(t);

  self.departments = self.departments.filter(function (c) {
    return c.department_id != t.department_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.department_id != t.department_id;
  });
};

self.removeDepartment = function (t, e) {
  self.checkedDepartments = self.checkedDepartments.filter(function (c) {
    return c.department_id != t.department_id;
  });
  console.log(self.checkedDepartments);

  self.departments.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.return_to_stock_dept_wise = 'return_to_stock_dept_wise_home';
};

self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
  console.log(self.stock_types);

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });
  self.stock_type = selectedStockTypeString;
};

self.readReturn = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_department_id = '';

  self.checkedDepartments.map(function (t) {
    if (selected_department_id == '') {
      selected_department_id = t.department_id;
    } else if (selected_department_id != '') {
      selected_department_id = selected_department_id + ',' + t.department_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_return_to_stock_dept_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_department_id);
};

RiotControl.on('read_return_to_stock_dept_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.return_to_stock_dept_wise = 'return_to_stock_dept_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('departments_changed', function (departments) {
  self.departments = departments;
  self.checkedDepartments = [];
  self.departments = departments;
  self.filteredDepartments = departments;

  self.items_per_page = 10;
  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
  self.update();
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredDepartments, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredDepartments, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('return-to-stock-item-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Return To Stock (Item Wise)</h4> <div show="{return_to_stock_item_wise ==\'return_to_stock_item_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="issueRegisterItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="issueRegisterItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReturn}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{return_to_stock_item_wise ==\'return_to_stock_item_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Return To Stock (Item Wise)<br> From {issueFrom} To {issueTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Item: <b>{m.item}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Return No</th> <th>Return Date</th> <th>Return By</th> <th>Department</th> <th>Location</th> <th>Unit</th> <th>Qty</th> </tr> <tr each="{t, k in m.issues}" no-reorder> <td>{k+1}</td> <td>{t.stock_type_code}{t.return_to_stock_no}</td> <td>{t.return_date}</td> <td>{t.return_by}</td> <td>{t.department}</td> <td>{t.location}</td> <td>{t.uom_code}</td> <td style="text-align:right">{t.return_to_stock_qty}</td> </tr> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('issueRegisterItemWiseStartDateInput');
  dateFormat('issueRegisterItemWiseEndDateInput');
  self.return_to_stock_item_wise = 'return_to_stock_item_wise_home';
  self.loading = true;
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_items_filter');
  self.update();
});

self.excelExport = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/return_to_stock_item_wise_csv.php?start_date=" + self.issueRegisterItemWiseStartDateInput.value + "&end_date=" + self.issueRegisterItemWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&item_id=" + selected_item_id;
  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};
/********************************* department filter end***************************/
self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.setStartDate = function () {
  self.sd = self.issueRegisterItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.issueRegisterItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.return_to_stock_item_wise = 'return_to_stock_item_wise_home';
};

self.readReturn = function () {
  if (self.issueRegisterItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.issueRegisterItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  RiotControl.trigger('read_return_to_stock_item_wise', self.issueRegisterItemWiseStartDateInput.value, self.issueRegisterItemWiseEndDateInput.value, selectedStockTypeString, selected_item_id);
};

RiotControl.on('read_return_to_stock_item_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.return_to_stock_item_wise = 'return_to_stock_item_wise_report';
  self.issueFrom = self.issueRegisterItemWiseStartDateInput.value;
  self.issueTo = self.issueRegisterItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.loading = false;
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('return-to-stock', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <h4 class="no-print">{title} Return to stock</h4> </div> <div show="{return_to_stock_view ==\'return_to_stock_home_page\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="selectStockTypeCodeInput">Stock Type</label> <select name="selectStockTypeCodeInput" class="form-control" onchange="{readReturnToStock}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> <option value="all">All</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readReturnToStock}" id="gobtn">Go</button> </div> </div> <div class="col-md-8 text-xs-right"> <div class="form-inline"> <input type="search" name="searchReturnedItems" class="form-control" placeholder="search" onkeyup="{filterReturnedItems}" style="width:200px;margin-right:10px;"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{showReturnDocketEntryForm}"><i class="material-icons">add</i></button> </div> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Return to Stock No</th> <th>Return Date</th> <th>Return By</th> <th></th> </tr> <tr each="{c, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td class="text-center">{c.stock_type_code}-{c.return_to_stock_no}</td> <td class="text-center">{c.return_date}</td> <td class="text-center">{c.return_by}</td> <td> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{view}"><i class="material-icons">visibility</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{deleteReturnToStock}"><i class="material-icons">delete</i></button> </td> </tr> <tfoot class="no-print"> <tr> <td colspan="5"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{return_to_stock_view ==\'return_to_stock_home\'}"> <div class="container-fluid"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="selectStockTypeInput">Stock Type</label> <select name="selectStockTypeInput" class="form-control" onchange="{readIssuedItemsToStockType}"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readIssuedItemsToStockType}" id="gobtn">Go</button> </div> </div> <div class="col-md-8"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{showDocketHome}"><i class="material-icons">close</i></button> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Issue No</th> <th>Issue Date</th> <th>Department</th> <th>Issue By</th> <th>Receive By</th> <th></th> </tr> <tr each="{c, i in issuedItems}"> <td class="text-center">{i+1}</td> <td class="text-center">{c.stock_type_code}-{c.issue_no}</td> <td class="text-center">{c.issue_date}</td> <td class="text-center">{c.department}</td> <td class="text-center">{c.approve_by}</td> <td class="text-center">{c.receive_by}</td> <td> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{returnToStockEnteryForm}"><i class="material-icons">assignment_return</i></button> </td> </tr> </table> </div> </div> <div show="{return_to_stock_view ==\'return_to_stock\'}"> <div class="container-fluid"> <button type="button" class="btn btn-secondary text-right" onclick="{showReturnToStockHome}" style="margin-top:-30px">Close</button> <table class="table"> <tr> <td> <span>Return Date</span> <input type="text" class="form-control" id="returnToStockDateInput" style="width:200px" placeholder="DD/MM/YYYY"> </td> <td> <span>Returned By</span> <input type="text" class="form-control" id="returnedByInput" style="width:200px" disabled> </td> <td> <span>Returned To Stock No:{return_to_stock_no}</span> </td> </tr> </table> <table class="table table-bordered"> <tr> <th>#</th> <th>Item Name</th> <th>Location</th> <th>Unit</th> <th>Qty</th> <th>Return Qty</th> <th>Remarks</th> <th>Issue Date</th> <th>Approve By</th> <th>Receive By</th> </tr> <tr each="{m, i in returnMaterials}"> <td>{i+1}</td> <td>{m.item_name}-(Code:{m.item_id})</td> <td>{m.location}</td> <td>{m.uom_code}</td> <td>{m.qty}</td> <td><input type="text" id="{\'returnToStockInput\'+m.item_id}" value="{m.return_to_stock_qty}" class="form-control"></td> <td><input type="text" id="{\'returnToStockRemarks\'+m.item_id}" value="{m.return_to_stock_remarks}" class="form-control"></td> <td class="text-center">{m.issue_date}</td> <td class="text-center">{m.approve_by}</td> <td class="text-center">{m.receive_by}</td> </tr> </table> <div class="row"> <button type="button" class="btn btn-secondary text-right" onclick="{showReturnToStockHome}">Close</button> <button type="button" class="btn btn-primary text-right" onclick="{submitReturnToStock}" style="margin-right:10px">Submit</button> </div> </div> </div> <div show="{return_to_stock_view ==\'return_to_stock_show\'}" class="container-fluid print-box"> <div class="container-fluid no-print"> <button class="btn btn-secondary text-right" __disabled="{loading}" onclick="{showDocketHome}" style="margin-top:-25px"><i class="material-icons">close</i></button> </div> <center> <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> Email: purchase@ntcind.com<br> </center><br> <table class="table table-bordered bill-info-table"> <tr> <th style="width:100px">Return Date</th> <td>{viewDetails.return_date}</td> <th>Issue No</th> <td>{viewDetails.stock_type_code}-{viewDetails.return_to_stock_no}</td> <th>Return By</th> <td>{viewDetails.return_by}</td> </tr> </table> <table class="table table-bordered bill-info-table print-small"> <tr> <th style="max-width:50px;width:50px"><strong>#</strong></th> <th style="width:200px;"><strong>Material</strong></th> <th><strong>Return Qty</strong></th> <th><strong>UOM</strong></th> <th><strong>Location</strong></th> <th><strong>Max Level</strong></th> <th><strong>Min Level</strong></th> </tr> <tr each="{m, i in viewItems}"> <td><div class="slno">{i+1}</div></td> <td>{m.item_name}-(Code:{m.item_id})</td> <td class="text-xs-right">{m.return_to_stock_qty}</td> <td class="text-center">{m.uom_code}</td> <td class="text-center">{m.location}</td> <td class="text-xs-right">{m.max_level}</td> <td class="text-xs-right">{m.min_level}</td> </tr> </table> </div> </div> <div class="modal fade" id="deleteReturnToStockModal"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title">Delete Return To Stock</h4> </div> <div class="modal-body"> <center><strong>Are you sure to delete return to stock items</strong></center> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{confirmDeleteReturnToStock}">Delete</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.items_per_page = 10;
  self.return_to_stock_view = 'return_to_stock_home_page';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('fetch_user_details_from_session_for_return_to_stock');
  self.title = '';
  self.update();
  dateFormat('returnToStockDateInput');
});

self.showReturnDocketEntryForm = function () {
  self.title = 'Add';
  self.return_to_stock_view = 'return_to_stock_home';
  $("#returnToStockDateInput").prop("disabled", false);
  self.update();
};

self.showDocketHome = function () {
  self.title = '';
  self.return_to_stock_view = 'return_to_stock_home_page';
};

self.showReturnToStockHome = function () {
  if (self.title == 'Add') {
    self.return_to_stock_view = 'return_to_stock_home';
  } else if (self.title == 'Edit') {
    self.return_to_stock_view = 'return_to_stock_home_page';
  }
};

self.returnToStockEnteryForm = function (e) {
  self.return_to_stock_issue_id = e.item.c.issue_id;
  self.return_to_stock_transaction_id = e.item.c.transaction_id;
  self.returned_by_department_id = e.item.c.department_id;
  RiotControl.trigger('read_issued_material_for_return', e.item.c.issue_id, self.selectStockTypeInput.value);
};

self.readIssuedItemsToStockType = function () {
  if (self.selectStockTypeInput.value == '') {
    toastr.info("Please Select Department");
    return;
  }
  self.loading = true;
  RiotControl.trigger('read_issued_items_to_stock_type_code', self.selectStockTypeInput.value);
};

self.readReturnToStock = function () {
  if (self.selectStockTypeCodeInput.value == '') {
    toastr.info("Please Select Department");
    return;
  }
  self.loading = true;
  RiotControl.trigger('read_issued_items_to_stock', self.selectStockTypeCodeInput.value);
};

self.edit = function (e) {
  RiotControl.trigger('read_return_to_stock_edit', e.item.c.return_to_stock_id, e.item.c.issue_id);
};

self.submitReturnToStock = function () {
  if (self.returnToStockDateInput.value == '') {
    toastr.error("Please Enter Return Date");
    return;
  }

  if (self.title == 'Add') {

    var str = self.returnToStockDateInput.value;
    var d = str.split("/");
    var return_date = moment([d[2].trim() + d[1].trim() + d[0].trim()], 'YYYYMMDD');
    var toDay = moment().format('YYYYMMDD');

    var from = moment(return_date, 'YYYYMMDD');
    var to = moment(toDay, 'YYYYMMDD');
    var differnece = to.diff(from, 'days');

    if (differnece < 0) {
      toastr.error("Return date can not be greater than today");
      return;
    }

    //return date vs Issue date
    var str1 = self.returnMaterials[0].issue_date;
    var d2 = str1.split("/");
    var i_date = moment([d2[2].trim() + d2[1].trim() + d2[0].trim()], 'YYYYMMDD');
    var pd = moment(i_date, 'YYYYMMDD'); //i_date
    var diff_of_return_issue = from.diff(pd, 'days');
    console.log(diff_of_return_issue);

    if (diff_of_return_issue < 0) {
      toastr.error("Return date can not be less than Issue Date");
      return;
    }
  }

  if (self.returnedByInput.value == '') {
    toastr.error("Please Enter Returned By");
    return;
  }

  console.log(self.returnMaterials);
  var error = '';
  var count = 1;
  var selectedMaterial = [];
  self.returnMaterials.map(function (i) {

    var returnToStockInput = '#returnToStockInput' + i.item_id;
    i.return_to_stock_qty = $(returnToStockInput).val();

    var temp_return_to_stock_qty = Number(i.return_to_stock_qty);
    if (isNaN(temp_return_to_stock_qty)) {
      temp_return_to_stock_qty = 0;
    }

    var return_to_stock_qty = Number(i.return_to_stock_qty);
    if (temp_return_to_stock_qty > 0) {

      if (self.title == 'Edit') {
        var max_return_qty = Number(i.qty) + Number(i.old_return_to_stock_qty); //qty=remaing_issue_qty
        if (Number(max_return_qty) < Number(i.return_to_stock_qty)) {
          error = error + "Return Qty" + count + " can't be greater than Qty" + count + " ,";
        }
      } else if (self.title == 'Add') {
        if (Number(i.qty) < Number(i.return_to_stock_qty)) {
          error = error + "Return Qty can't be greater than Qty,";
        }
      }

      var returnToStockRemarks = '#returnToStockRemarks' + i.item_id;
      i.return_to_stock_remarks = $(returnToStockRemarks).val();

      selectedMaterial.push(i);
      count++;
    }
  });
  console.log('selectedMaterial');
  console.log(selectedMaterial);

  if (selectedMaterial.length == 0) {
    error = 'Please provide at least one return qty';
  }

  if (error != '') {
    toastr.error(error);
    return;
  }

  self.loading = true;
  if (self.title == 'Add') {
    RiotControl.trigger('return_to_stock', self.return_to_stock_issue_id, self.return_to_stock_transaction_id, selectedMaterial, self.returnToStockDateInput.value, self.returnedByInput.value, self.selectStockTypeInput.value, self.return_to_stock_no);
  } else if (self.title == 'Edit') {
    RiotControl.trigger('return_to_stock_edit', self.return_to_stock_issue_id, self.return_to_stock_transaction_id, selectedMaterial, self.returnToStockDateInput.value, self.returnedByInput.value, self.selectStockTypeInput.value, self.edit_return_to_stock_id);
  }
};

self.view = function (e) {
  RiotControl.trigger('read_view_return_to_stock', e.item.c.return_to_stock_id);
};

self.deleteReturnToStock = function (e) {
  self.return_to_stock_id = e.item.c.return_to_stock_id;
  $("#deleteReturnToStockModal").modal('show');
};

self.confirmDeleteReturnToStock = function () {
  RiotControl.trigger('delete_return_to_stock', self.return_to_stock_id, self.returnedItems);
};

self.filterReturnedItems = function () {
  if (!self.searchReturnedItems) return;
  self.filteredReturnedItems = self.returnedItems.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchReturnedItems.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredReturnedItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredReturnedItems, 1, self.items_per_page);
};

/*method change callback from store*/
RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('read_issued_items_to_stock_type_code_changed', function (items) {
  self.loading = false;
  self.issuedItems = items;
  self.update();
});

RiotControl.on('read_issued_items_to_stock_changed', function (items) {
  self.loading = false;
  self.returnedItems = items;
  self.filteredReturnedItems = items;

  self.paginate(self.filteredReturnedItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredReturnedItems, 1, self.items_per_page);
  self.update();
});

RiotControl.on('return_to_stock_changed', function () {
  self.loading = false;
  var items = self.issuedItems.filter(function (c) {
    return c.transaction_id != self.return_to_stock_transaction_id;
  });
  self.issuedItems = items;
  self.return_to_stock_view = 'return_to_stock_home';
  self.update();
});

RiotControl.on('return_to_stock_changed_error', function () {
  self.loading = false;
  toastr.error('Newer Return Date exists for given stock type');
  self.update();
});

RiotControl.on('read_view_return_to_stock_changed', function (items, details) {
  self.loading = false;
  self.viewItems = items;
  self.viewDetails = details;
  self.return_to_stock_view = 'return_to_stock_show';
  self.update();
});

RiotControl.on('read_issued_material_for_return_changed', function (items, return_to_stock_no) {
  self.loading = false;
  self.title = 'Add';
  self.return_to_stock_view = 'return_to_stock';
  self.returnMaterials = [];
  self.returnMaterials = items;
  self.return_to_stock_no = return_to_stock_no;
  self.update();
  self.returnedByInput.value = self.user_name;
});

RiotControl.on('fetch_user_details_from_session_for_return_to_stock_changed', function (user_name, user_id) {
  self.loading = false;
  self.user_name = user_name;
  self.user_id = user_id;
  self.update();
});

RiotControl.on('delete_return_to_stock_changed', function (items) {
  self.loading = false;
  $("#deleteReturnToStockModal").modal('hide');
  self.returnedItems = items;
  self.update();
});

RiotControl.on('read_return_to_stock_edit_changed', function (items, details) {
  self.loading = false;
  self.title = 'Edit';
  self.return_to_stock_view = 'return_to_stock';
  self.returnMaterials = [];
  self.returnMaterials = items;
  self.returnToStockDateInput.value = details.return_date;
  self.return_to_stock_no = details.return_to_stock_no;
  self.edit_return_to_stock_id = details.return_to_stock_id;
  self.returnedByInput.value = details.return_by;
  $("#returnToStockDateInput").prop("disabled", true);
  self.update();
});

RiotControl.on('return_to_stock_edit_changed', function (items, details) {
  self.loading = false;
  self.return_to_stock_view = 'return_to_stock_home_page';
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredReturnedItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredReturnedItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredReturnedItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});
riot.tag2('stock-date-wise', '<loading-bar if="{loading}"></loading-bar> <div show="{date_wise_stock_view ==\'date_wise_stock_home\'}"> <div class="container-fulid"> <div class="row"> <div class="col-md-6"> <h4>Stock Date Wise</h4> </div> <div class="col-md-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchOpeningStock" class="form-control" placeholder="search" onkeyup="{filterOpeningStocks}" style="width:200px;margin-right:10px"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter">Item Group</label> <input id="selectItemGroupFilter" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px"> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="transactionDateInput">Date</label> <input type="text" class="form-control" id="transactionDateInput" placeholder="DD/MM/YYYY" onkeyup="{setDate}"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{getOpeningStock}" style="margin-top: 32px;">Get Material</button> </div> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Material</th> <th>UOM</th> <th>Qty</th> <th>Rate</th> <th>Amount</th> <th>Location</th> <th>Stock Type</th> </tr> <tr each="{c, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{c.item_name}-(Code:{c.item_id})</td> <td class="text-center">{c.uom_code}</td> <td class="text-center">{c.qty}</td> <td class="text-center">{c.rate}</td> <td class="text-center">{c.amount}</td> <td class="text-center">{c.location}</td> <td class="text-center">{c.stock_type_code}</td> </tr> <tfoot class="no-print"> <tr> <td colspan="8"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  //RiotControl.trigger('login_init')
  self.items_per_page = 10;
  self.items_per_page_new = 10;
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_item_groups');
  self.date_wise_stock_view = 'date_wise_stock_home';
  self.update();
  dateFormat('transactionDateInput');
});

self.setDate = function () {
  self.transactionDate = self.transactionDateInput.value;
};

self.getOpeningStock = function () {
  self.materials = [];
  //if(self.searchMaterialInput.value==''){
  if (self.selectItemGroupFilter.value == '') {
    toastr.info("Please select Item Group and try again");
    return;
  }
  if (self.transactionDateInput.value == '') {
    toastr.info("Please enter date and try again");
    return;
  }
  RiotControl.trigger('read_stock_wise_date', self.selected_item_group_code, self.selectStockTypeFilter.value, self.transactionDateInput.value);
  //RiotControl.trigger('read_stock_wise_date',self.transactionDateInput.value)
  /*}else{
     RiotControl.trigger('search_items_of_opening_stock',self.searchMaterialInput.value,self.selectStockTypeFilter.value)
  }*/
};

self.excelExport = function () {

  if (self.selectItemGroupFilter.value == '') {
    toastr.info("Please select Item Group");
    return;
  }

  var link = "csv/current_stock_csv.php?date=" + self.transactionDateInput.value + "&item_group_code=" + self.selected_item_group_code + "&stock_type_code=" + self.selectStockTypeFilter.value;

  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

self.filterOpeningStocks = function () {
  if (!self.searchOpeningStock) return;
  self.filteredOpeningStocks = self.openingStocks.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchOpeningStock.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredOpeningStocks, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page);
};

/*method change callback from store*/
RiotControl.on('item_groups_changed', function (item_groups) {
  //self.item_groups = item_groups
  $('#selectItemGroupFilter').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
    }
  });

  $('#selectItemGroupFilter1').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code1 = ui.item.item_group_code;
    }
  });
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('search_items_of_opening_stock_changed', function (items) {
  //$("#itemModal").modal('show')
  self.loading = false;
  self.openingStocks = [];
  self.openingStocks = items;
  self.searchMaterialInput.value = '';

  self.filteredOpeningStocks = self.openingStocks;

  console.log(self.filteredOpeningStocks);

  self.paginate(self.filteredOpeningStocks, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page);
  self.update();
});

RiotControl.on('read_stock_wise_date_changed', function (items) {
  self.loading = false;
  self.openingStocks = [];
  self.openingStocks = items;

  self.filteredOpeningStocks = self.openingStocks;

  self.paginate(self.filteredOpeningStocks, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredOpeningStocks, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('stock-in-hand', '<div show="{stock_in_hand_view ==\'stock_in_hand_home\'}"> <div class="container-fulid"> <div class="row bgColor no-print"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter">Item Group</label> <input id="selectItemGroupFilter" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="searchMaterialInput">Search Material</label> <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px"> </div> </div> <div class="col-sm-3"> <div class="form-inline"> <input type="search" name="searchItems" class="form-control" placeholder="search" onkeyup="{filterMaterials}" style="width:200px;margin-top: 32px;"> <button type="button" class="btn btn-primary" onclick="{getMaterialForStockStatement}" style="margin-top: 32px;">GO</button> </div> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Material</th> <th>UOM</th> <th>Group</th> <th>Qty</th> </tr> <tr each="{it, i in pagedDataItems}" no-reorder> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{it.item_name}-(Code:{it.item_id})</td> <td class="text-sm-center">{it.uom_code}</td> <td class="text-sm-center">{it.item_group}</td> <td class="text-sm-right">{it.stock}</td> </tr> <tfoot class="no-print"> <tr> <td colspan="5"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_item_groups');
  self.stock_in_hand_view = 'stock_in_hand_home';
  self.update();
});

self.filterMaterials = function () {
  if (!self.searchItems) return;
  self.filteredMaterials = self.materials.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItems.value.toLowerCase()) >= 0;
  });
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);
};

self.getMaterialForStockStatement = function () {
  console.log('call');
  self.materials = [];
  if (self.searchMaterialInput.value == '') {
    if (self.selectItemGroupFilter.value == '') {
      toastr.info("Please select Item Group and try again");
      return;
    }
    if (self.selectStockTypeFilter.value == '') {
      toastr.info("Please select Stock Type and try again");
      return;
    }
    self.loading = true;
    RiotControl.trigger('read_items_for_stock_in_hand', self.selected_item_group_code, self.selectStockTypeFilter.value);
  } else {
    if (self.selectStockTypeFilter.value == '') {
      toastr.info("Please select Stock Type and try again");
      return;
    }
    self.loading = true;
    RiotControl.trigger('search_items_for_stock_in_hand', self.searchMaterialInput.value, self.selectStockTypeFilter.value);
  }
};

/*method change callback from store*/
RiotControl.on('item_groups_changed', function (item_groups) {
  $('#selectItemGroupFilter').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
      console.log(self.selected_item_group_code);
    }
  });
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('read_items_for_stock_in_hand_changed', function (items) {
  console.log('herer');
  self.loading = false;
  self.materials = [];
  self.materials = items;
  self.searchMaterialInput.value = '';

  self.filteredMaterials = items;

  self.items_per_page = 10;
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);

  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredMaterials, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('stock-ledger-avg-valuation-in-details', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Stock Ledger Avg Valuation Details</h4> <div show="{stock_ledger_avg_valuation_in_details ==\'stock_ledger_avg_valuation_in_details_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="stockLedgerAvgValuationDetailsStartDateInput">Start Date</label> <input type="text" class="form-control" id="stockLedgerAvgValuationDetailsStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="stockLedgerAvgValuationDetailsEndDateInput">As On Date</label> <input type="text" class="form-control" id="stockLedgerAvgValuationDetailsEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readStockAvgValuationDetails}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{stock_ledger_avg_valuation_in_details ==\'stock_ledger_avg_valuation_in_details_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Stock Ledger Avg Valuation Details <br> From {docketFrom} To {docketTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Item: <b>{m.item_name}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Details</th> <th>Date</th> <th>Opening Qty</th> <th>Opening Amount</th> <th>Receive Qty</th> <th>Receive Amount</th> <th>Issue Qty</th> <th>Issue Amount</th> <th>Avg Rate</th> <th>Balance Qty</th> <th>Balance Amount</th> </tr> <tr each="{t, k in m.items}" no-reorder> <td>{k+1}</td> <td style="text-align:center">{t.details}</td> <td>{t.td}</td> <td style="text-align:right">{t.o_qty}</td> <td style="text-align:right">{t.o_amount}</td> <td style="text-align:right">{t.r_qty}</td> <td style="text-align:right">{t.r_amount}</td> <td style="text-align:right">{t.i_qty}</td> <td style="text-align:right">{t.i_amount}</td> <td style="text-align:right">{t.rate}</td> <td style="text-align:right">{t.running_balance}</td> <td style="text-align:right">{t.running_amount}</td> </tr> <tr> <td></td> <td></td> <td style="text-align:right">Total</td> <td style="text-align:right">{m.o_qty}</td> <td style="text-align:right">{m.o_amount}</td> <td style="text-align:right">{m.r_qty}</td> <td style="text-align:right">{m.r_amount}</td> <td style="text-align:right">{m.i_qty}</td> <td style="text-align:right">{m.i_amount}</td> <td style="text-align:right">{m.rate}</td> <td style="text-align:right">{m.running_balance}</td> <td style="text-align:right">{m.running_amount}</td> </tr> </table> <div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('stockLedgerAvgValuationDetailsStartDateInput');
  dateFormat('stockLedgerAvgValuationDetailsEndDateInput');
  self.stock_ledger_avg_valuation_in_details = 'stock_ledger_avg_valuation_in_details_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_items_filter');
  self.update();
});

self.excelExport = function () {
  if (self.stockLedgerAvgValuationDetailsStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.stockLedgerAvgValuationDetailsEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/stock_ledger_avg_valuation_in_details_csv.php?start_date=" + self.stockLedgerAvgValuationDetailsStartDateInput.value + "&end_date=" + self.stockLedgerAvgValuationDetailsEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&selected_item_id=" + selected_item_id;

  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};

/********************************* department filter end***************************/
self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.setStartDate = function () {
  self.sd = self.stockLedgerAvgValuationDetailsStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.stockLedgerAvgValuationDetailsEndDateInput.value;
};

self.closeReport = function () {
  self.stock_ledger_avg_valuation_in_details = 'stock_ledger_avg_valuation_in_details_home';
};

self.readStockAvgValuationDetails = function () {

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  //RiotControl.trigger('read_stock_ledger_avg_valuation_in_details', selectedStockTypeString,selected_item_id)
  RiotControl.trigger('read_stock_ledger_avg_valuation_in_details', self.stockLedgerAvgValuationDetailsStartDateInput.value, self.stockLedgerAvgValuationDetailsEndDateInput.value, selectedStockTypeString, selected_item_id);
};

RiotControl.on('read_stock_ledger_avg_valuation_in_details_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  // self.qty_grand_total = qty_grand_total
  // self.item_value_grand_total = item_value_grand_total
  self.stock_ledger_avg_valuation_in_details = 'stock_ledger_avg_valuation_in_details_report';
  self.docketFrom = self.stockLedgerAvgValuationDetailsStartDateInput.value;
  self.docketTo = self.stockLedgerAvgValuationDetailsEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('stock-ledger-avg-valuation-in-summry', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Stock Ledger Avg Valuation Summry</h4> <div show="{stock_ledger_avg_valuation_in_summry ==\'stock_ledger_avg_valuation_in_summry_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="stockLedgerAvgValuationSummryStartDateInput">Start Date</label> <input type="text" class="form-control" id="stockLedgerAvgValuationSummryStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="stockLedgerAvgValuationSummryEndDateInput">As On Date</label> <input type="text" class="form-control" id="stockLedgerAvgValuationSummryEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readStockAvgValuationSummry}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{stock_ledger_avg_valuation_in_summry ==\'stock_ledger_avg_valuation_in_summry_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Stock Ledger Avg Valuation Summry <br> From {docketFrom} To {docketTo}</div> <br> </center> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item</th> <th>Stock Type</th> <th>Unit</th> <th>Opening Qty</th> <th>Opening Amount</th> <th>Receive Qty</th> <th>Receive Amount</th> <th>Issue Qty</th> <th>Issue Amount</th> <th>RP Qty</th> <th>RP Amount</th> <th>RS Qty</th> <th>RS Amount</th> <th>Closing Avg Rate</th> <th>Closing Qty</th> <th>Closing Amount</th> </tr> <tr each="{t, k in mainArray}" no-reorder> <td>{k+1}</td> <td>{t.item_name}</td> <td style="text-align:center">{t.stock_type_code}</td> <td style="text-align:center">{t.uom_code}</td> <td style="text-align:right">{t.o_qty}</td> <td style="text-align:right">{t.o_amount}</td> <td style="text-align:right">{t.r_qty}</td> <td style="text-align:right">{t.r_amount}</td> <td style="text-align:right">{t.i_qty}</td> <td style="text-align:right">{t.i_amount}</td> <td style="text-align:right">{t.rp_qty}</td> <td style="text-align:right">{t.rp_amount}</td> <td style="text-align:right">{t.rs_qty}</td> <td style="text-align:right">{t.rs_amount}</td> <td style="text-align:right">{t.closing_rate}</td> <td style="text-align:right">{t.closing_qty}</td> <td style="text-align:right">{t.closing_amount}</td> </tr> <tr> <td></td> <td></td> <td style="text-align:center"></td> <td style="text-align:center">Total</td> <td style="text-align:right">{total.o_qty}</td> <td style="text-align:right">{total.o_amount}</td> <td style="text-align:right">{total.r_qty}</td> <td style="text-align:right">{total.r_amount}</td> <td style="text-align:right">{total.i_qty}</td> <td style="text-align:right">{total.i_amount}</td> <td style="text-align:right"></td> <td style="text-align:right">{total.rp_amount}</td> <td style="text-align:right"></td> <td style="text-align:right">{total.rs_amount}</td> <td style="text-align:right">{total.closing_rate}</td> <td style="text-align:right">{total.closing_qty}</td> <td style="text-align:right">{total.closing_amount}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('stockLedgerAvgValuationSummryStartDateInput');
  dateFormat('stockLedgerAvgValuationSummryEndDateInput');
  self.stock_ledger_avg_valuation_in_summry = 'stock_ledger_avg_valuation_in_summry_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_items_filter');
  self.update();
});

self.excelExport = function () {
  if (self.stockLedgerAvgValuationSummryStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.stockLedgerAvgValuationSummryEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/stock_ledger_avg_valuation_in_summry_csv.php?start_date=" + self.stockLedgerAvgValuationSummryStartDateInput.value + "&end_date=" + self.stockLedgerAvgValuationSummryEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&selected_item_id=" + selected_item_id;

  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};

/********************************* department filter end***************************/
self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.setStartDate = function () {
  self.sd = self.stockLedgerAvgValuationSummryStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.stockLedgerAvgValuationSummryEndDateInput.value;
};

self.closeReport = function () {
  self.stock_ledger_avg_valuation_in_summry = 'stock_ledger_avg_valuation_in_summry_home';
};

self.readStockAvgValuationSummry = function () {

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  //RiotControl.trigger('read_stock_ledger_avg_valuation_in_summry', selectedStockTypeString,selected_item_id)
  RiotControl.trigger('read_stock_ledger_avg_valuation_in_summry', self.stockLedgerAvgValuationSummryStartDateInput.value, self.stockLedgerAvgValuationSummryEndDateInput.value, selectedStockTypeString, selected_item_id);
};

RiotControl.on('read_stock_ledger_avg_valuation_in_summry_changed', function (mainArray, total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.total = [];
  self.total = total;
  // self.qty_grand_total = qty_grand_total
  // self.item_value_grand_total = item_value_grand_total
  self.stock_ledger_avg_valuation_in_summry = 'stock_ledger_avg_valuation_in_summry_report';
  self.docketFrom = self.stockLedgerAvgValuationSummryStartDateInput.value;
  self.docketTo = self.stockLedgerAvgValuationSummryEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('stock-ledger', '<h1>Workig Ledger</h1>', '', '', function(opts) {
});

riot.tag2('stock-movement-register', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Stock Movement Register</h4> <div show="{stock_movement_register_item_wise ==\'stock_movement_register_item_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="stockMovementItemWiseStartDateInput">Start Date</label> <input type="text" class="form-control" id="stockMovementItemWiseStartDateInput" onchange="{setStartDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="stockMovementItemWiseEndDateInput">End Date</label> <input type="text" class="form-control" id="stockMovementItemWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readStockMovementRegister}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{stock_movement_register_item_wise ==\'stock_movement_register_item_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Stock Register (Item Wise)<br> From {docketFrom} To {docketTo}</div> <br> </center> <div each="{m, i in mainArray}" class="reportDiv" no-reorder> <h5>Item: <b>{m.item_name}</b></h5> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Transaction Dt</th> <th>Stock Type</th> <th>Transaction Type</th> <th>Unit</th> <th>Qty</th> <th>Rate</th> </tr> <tr each="{t, k in m.items}" no-reorder> <td>{k+1}</td> <td style="text-align:center">{t.td}</td> <td style="text-align:center">{t.stock_type_code}</td> <td style="text-align:center">{t.transaction_type}</td> <td style="text-align:center">{t.uom_code}</td> <td style="text-align:right">{t.qty}</td> <td style="text-align:right">{t.rate}</td> </tr> </table> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  dateFormat('stockMovementItemWiseStartDateInput');
  dateFormat('stockMovementItemWiseEndDateInput');
  self.stock_movement_register_item_wise = 'stock_movement_register_item_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_items_filter');
  self.update();
});

self.excelExport = function () {
  if (self.stockMovementItemWiseStartDateInput.value == '') {
    toastr.info("Please Entet Start Date");
    return;
  }
  if (self.stockMovementItemWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/stock_movement_register_item_wise_csv.php?start_date=" + "&end_date=" + "&stock_type_code=" + selectedStockTypeString + "&selected_item_id=" + selected_item_id;
  // var link="csv/docket_register_item_wise_csv.php?start_date="+self.stockMovementItemWiseStartDateInput.value+"&end_date="+self.stockMovementItemWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString+"&selected_item_id="+selected_item_id;

  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};

/********************************* department filter end***************************/
self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

self.setStartDate = function () {
  self.sd = self.stockMovementItemWiseStartDateInput.value;
};

self.setEndDate = function () {
  self.ed = self.stockMovementItemWiseEndDateInput.value;
};

self.closeReport = function () {
  self.stock_movement_register_item_wise = 'stock_movement_register_item_wise_home';
};

self.readStockMovementRegister = function () {

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  //RiotControl.trigger('read_stock_movement_register_item_wise', selectedStockTypeString,selected_item_id)
  RiotControl.trigger('read_stock_movement_register_item_wise', self.stockMovementItemWiseStartDateInput.value, self.stockMovementItemWiseEndDateInput.value, selectedStockTypeString, selected_item_id);
};

RiotControl.on('read_stock_movement_register_item_wise_changed', function (mainArray) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  // self.qty_grand_total = qty_grand_total
  // self.item_value_grand_total = item_value_grand_total
  self.stock_movement_register_item_wise = 'stock_movement_register_item_wise_report';
  self.docketFrom = self.stockMovementItemWiseStartDateInput.value;
  self.docketTo = self.stockMovementItemWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('stock-statement', '<div show="{stock_statement_view ==\'stock_statement_home\'}"> <div class="container-fulid"> <div class="row bgColor"> <div class="col-sm-3"> <div class="form-group"> <label for="selectIndentGroupFilter">Item Group</label> <input id="selectItemGroupFilter" type="text" class="form-control"> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeFilter">Stock Type</label> <select name="selectStockTypeFilter" class="form-control" style="min-width:250px"> <option></option> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="searchMaterialInput">Search Material</label> <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px"> </div> </div> <div class="col-sm-3"> <div class="form-inline"> <input type="search" name="searchItems" class="form-control" placeholder="search" onkeyup="{filterMaterials}" style="width:200px;margin-top: 32px;"> <button type="button" class="btn btn-primary" onclick="{getMaterialForStockStatement}" style="margin-top: 32px;">GO</button> </div> </div> </div> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Material</th> <th>UOM</th> <th>Group</th> <th></th> </tr> <tr each="{it, i in pagedDataItems}" no-reorder> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{it.item_name}-(Code:{it.item_id})</td> <td>{it.uom_code}</td> <td>{it.item_group}</td> <td> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{getStockStatement}"><i class="material-icons">visibility</i></button> </td> </tr> <tfoot> <tr> <td colspan="5"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div show="{stock_statement_view ==\'stock_statement_report\'}"> <div class="container-fulid"> <div class="row"> Stock Statyement of: {item_name} <button class="btn btn-secondary pull-sm-right no-print" onclick="{closeStockReport}" style="margin-top: -10px; margin-bottom: 5px;"><i class="material-icons">close</i></button> </div> <div class="row"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Transaction Date</th> <th>UOM</th> <th>Transactio Type</th> <th>Qty</th> <th>Balance</th> </tr> <tr each="{it, i in stockStatement}" no-reorder> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td class="text-sm-center">{it.transaction_date}</td> <td class="text-sm-center">{it.uom_code}</td> <td class="text-sm-center">{it.transaction_type}</td> <td class="text-sm-right">{it.qty}</td> <td class="text-sm-right">{it.running_balance}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_item_groups');
  self.stock_statement_view = 'stock_statement_home';
  self.update();
});

self.closeStockReport = function () {
  self.stock_statement_view = 'stock_statement_home';
};

self.filterMaterials = function () {
  if (!self.searchItems) return;
  self.filteredMaterials = self.materials.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItems.value.toLowerCase()) >= 0;
  });
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);
};

self.getMaterialForStockStatement = function () {
  console.log('call');
  self.materials = [];
  if (self.searchMaterialInput.value == '') {
    if (self.selectItemGroupFilter.value == '') {
      toastr.info("Please select Item Group and try again");
      return;
    }
    if (self.selectStockTypeFilter.value == '') {
      toastr.info("Please select Stock Type and try again");
      return;
    }
    self.loading = true;
    RiotControl.trigger('read_items_for_stock_statement', self.selected_item_group_code, self.selectStockTypeFilter.value);
  } else {
    if (self.selectStockTypeFilter.value == '') {
      toastr.info("Please select Stock Type and try again");
      return;
    }
    self.loading = true;
    RiotControl.trigger('search_items_for_stock_statement', self.searchMaterialInput.value, self.selectStockTypeFilter.value);
  }
};

self.getStockStatement = function (e) {
  self.item_name = e.item.it.item_name + '(' + e.item.it.item_id + ')';
  RiotControl.trigger('read_stock_statement', e.item.it.item_id);
};

/*method change callback from store*/
RiotControl.on('item_groups_changed', function (item_groups) {
  $('#selectItemGroupFilter').autocomplete({
    source: item_groups,
    select: function select(event, ui) {
      self.selected_item_group_code = ui.item.item_group_code;
      console.log(self.selected_item_group_code);
    }
  });
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('read_items_for_stock_statement_changed', function (items) {
  console.log('herer');
  self.loading = false;
  self.materials = [];
  self.materials = items;
  self.searchMaterialInput.value = '';

  self.filteredMaterials = items;

  self.items_per_page = 10;
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);

  self.update();
});

RiotControl.on('read_stock_statement_changed', function (items) {
  self.loading = false;
  self.stock_statement_view = 'stock_statement_report';
  self.stockStatement = [];
  self.stockStatement = items;
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredMaterials, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredMaterials, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('stock-summary', '<div show="{opening_stock_view ==\'stock_summry_home\'}"> <div class="container"> <div class="row"> <div class="col-md-9"> <h4>Stock Summary</h4> </div> </div> <div class="row"> <div class="col-sm-3"> <div class="form-group"> <label for="selectItemGroupInput">Item Group</label> <select name="selectItemGroupInput" class="form-control" style="min-width:250px"> <option each="{item_groups}" value="{item_group_code}">{item_group}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectCategoryInput">Category</label> <select name="selectCategoryInput" class="form-control" style="min-width:250px"> <option each="{categories}" value="{category_code}">{category}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <label for="selectStockTypeInput">Stock Type</label> <select name="selectStockTypeInput" class="form-control" style="min-width:250px"> <option each="{stock_types}" value="{stock_type_code}">{stock_type}</option> </select> </div> </div> <div class="col-sm-3"> <div class="form-group"> <button type="button" class="btn btn-primary" onclick="{getStockSummary}" style="margin-top: 32px;">Go</button> </div> </div> </div> <div class="row"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Material</th> <th>Opening Qty</th> <th>Receipt Qty</th> <th>Issue Qty</th> <th>Closing Qty</th> <th>UOM</th> </tr> <tr each="{c, i in stockSummary}"> <td>{i+1}</td> <td>{c.item_name}</td> <td>{c.opening_qty}</td> <td>{c.receipt_qty}</td> <td>{c.issue_qty}</td> <td>{c.closing_qty}</td> <td>{c.uom}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_item_groups');
  RiotControl.trigger('read_categories');
  self.opening_stock_view = 'stock_summry_home';
  self.update();
});

self.getStockSummary = function () {
  RiotControl.trigger('read_stock_summary', self.selectItemGroupInput.value, self.selectCategoryInput.value, self.selectStockTypeInput.value);
};

/*method change callback from store*/
RiotControl.on('item_groups_changed', function (item_groups) {
  self.item_groups = item_groups;
  self.update();
});

RiotControl.on('categories_changed', function (categories) {
  self.categories = categories;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('read_stock_summary_changed', function (items) {
  self.loading = false;
  self.stockSummary = [];
  self.stockSummary = items;
  self.update();
});
});

riot.tag2('stock-type-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Stock Type</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchStockType" class="form-control" placeholder="search" onkeyup="{filterStockTypes}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshStockTypes}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"><input type="text" name="addStockTypeCodeInput" placeholder="Code" class="form-control" onkeyup="{addEnter}"></td> <td><input type="text" name="addStockTypeInput" placeholder="StockType" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{add}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th onclick="{sortByCode}" style="cursor: pointer;"> Code <hand if="{activeSort==\'sortCode\'}"> <i class="material-icons" show="{sortCode}">arrow_upward</i> <i class="material-icons" hide="{sortCode}">arrow_downward</i> <hand> </th> <th onclick="{sortByStockType}" style="cursor: pointer;"> Stock Type <hand if="{activeSort==\'sortStockType\'}"> <i class="material-icons" show="{sortStockType}">arrow_upward</i> <i class="material-icons" hide="{sortStockType}">arrow_downward</i> </hand> </th> <th class="two-buttons"></th> </tr> <tr each="{ch, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td if="{!ch.confirmEdit && !ch.confirmDelete}"> {ch.stock_type_code} </td> <td if="{!ch.confirmEdit && !ch.confirmDelete}"> {ch.stock_type} </td> <td colspan="2" if="{ch.confirmDelete}"><span class="delete-question">Are you sure?</span></td> <td if="{ch.confirmEdit}"> <input type="text" id="editedStockTypeCode" autofocus class="form-control" value="{ch.stock_type_code}" onkeyup="{editEnter.bind(this)}"> </td> <td if="{ch.confirmEdit}"> <input type="text" id="editedStockType" class="form-control" value="{ch.stock_type}" onkeyup="{editEnter.bind(this)}"> </td> <td> <div class="table-buttons" hide="{ch.confirmDelete ||  ch.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{ch.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{ch.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot> <tr> <td colspan="4"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortStockType = true;
  self.sortCode = true;
  self.activeSort = '';
  self.update();
  // RiotControl.trigger('login_init')
  RiotControl.trigger('read_stock_types');
});

// RiotControl.on('login_changed', function(login_status) {
//   if(!login_status.role || login_status.role == 'FAIL'){
//     riot.route("/home")
//   }
// })

self.refreshStockTypes = function () {
  self.stock_types = [];
  self.searchStockType.value;
  RiotControl.trigger('read_stock_types');
};

self.filterStockTypes = function () {
  if (!self.searchStockType) return;
  self.filteredStockTypes = self.stock_types.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchStockType.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredStockTypes, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredStockTypes, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.stock_types.map(function (c) {
    if (c.stock_type_id != e.item.ch.stock_type_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.stock_types.map(function (c) {
    if (c.stock_type_id != e.item.ch.stock_type_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_stock_type', e.item.ch.stock_type_id);
};

self.edit = function (e) {
  if (!$("#editedStockTypeCode").val()) {
    toastr.info("Please enter a valid stock_type Code and try again");
  } else if (!$("#editedStockType").val()) {
    toastr.info("Please enter a valid stock_type and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_stock_type', e.item.ch.stock_type_id, $("#editedStockTypeCode").val(), $("#editedStockType").val());
  }
};

self.add = function () {
  if (!self.addStockTypeCodeInput.value) {
    toastr.info("Please enter a valid stock_type Code and try again");
  } else if (!self.addStockTypeInput.value) {
    toastr.info("Please enter a valid stock_type and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_stock_type', self.addStockTypeCodeInput.value, self.addStockTypeInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.add();
  }
};

self.editEnter = function (e) {
  if (e.which == 13) {
    self.edit(e);
  }
};

self.cancelOperation = function (e) {
  self.stock_types.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

RiotControl.on('stock_types_changed', function (stock_types) {
  self.addStockTypeCodeInput.value = '';
  self.addStockTypeInput.value = '';
  self.loading = false;
  self.stock_types = stock_types;
  self.filteredStockTypes = stock_types;

  self.items_per_page = 10;
  self.callPaging();
  self.update();
});

self.callPaging = function () {
  self.paginate(self.filteredStockTypes, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredStockTypes, 1, self.items_per_page);
};

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredStockTypes, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredStockTypes, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredStockTypes, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/*sorting Starts*/
self.sortByStockType = function () {

  if (self.sortStockType == true) {
    self.stock_types.sort(function (a, b) {
      return a.stock_type.toUpperCase().localeCompare(b.stock_type.toUpperCase());
    });
  } else {
    self.stock_types.reverse();
  }

  self.activeSort = 'sortStockType';
  self.filteredStockTypes = self.stock_types;
  self.callPaging();

  self.update();
  self.sortStockType = !self.sortStockType;
};

self.sortByCode = function () {

  if (self.sortCode == true) {
    self.stock_types.sort(function (a, b) {
      return a.stock_type_code.toUpperCase().localeCompare(b.stock_type_code.toUpperCase());
    });
  } else {
    self.stock_types.reverse();
  }

  self.activeSort = 'sortCode';
  self.filteredStockTypes = self.stock_types;
  self.callPaging();

  self.update();
  self.sortCode = !self.sortCode;
};

/*sorting Ends*/
});

riot.tag2('stock-valuation-summary-location-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Stock Valuation Summary (Location Wise)</h4> <div show="{stock_valution_summry_location_wise ==\'stock_valution_summry_location_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="stockValuationSummryLocationWiseEndDateInput">As On Date</label> <input type="text" class="form-control" id="stockValuationSummryLocationWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readStockValuationSummaryLocationWise}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> </div> </div> </div> <div class="row"> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.location})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.location}</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{stock_valution_summry_location_wise ==\'stock_valution_summry_location_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Stock Valuation Summary (Location Wise) <br> As On {docketTo}</div> <br> </center> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item</th> <th>Location</th> <th>Unit</th> <th>Opening Qty</th> <th>Receive Qty</th> <th>Issue Qty</th> <th>Closing Balance</th> </tr> <tr each="{t, k in mainArray}" no-reorder> <td>{k+1}</td> <td>{t.item_name}</td> <td style="text-align:center">{t.location}</td> <td style="text-align:center">{t.uom_code}</td> <td style="text-align:right">{t.o_qty}</td> <td style="text-align:right">{t.r_qty}</td> <td style="text-align:right">{t.i_qty}</td> <td style="text-align:right">{t.closing_qty}</td> </tr> <tr> <td></td> <td></td> <td style="text-align:center"></td> <td style="text-align:center"></td> <td style="text-align:right">{total.o_qty}</td> <td style="text-align:right">{total.r_qty}</td> <td style="text-align:right">{total.i_qty}</td> <td style="text-align:right">{total.closing_qty}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  //dateFormat('stockValuationSummryLocationWiseStartDateInput')
  dateFormat('stockValuationSummryLocationWiseEndDateInput');
  self.stock_valution_summry_location_wise = 'stock_valution_summry_location_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_locations_for_stock_ledger');
  //RiotControl.trigger('read_items_filter')
  self.update();
});

self.excelExport = function () {
  // if (self.stockValuationSummryLocationWiseStartDateInput.value=='') {
  //   toastr.info("Please Entet Start Date")
  //   return
  // }
  if (self.stockValuationSummryLocationWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedLocationString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedLocationString == '') {
        selectedLocationString = "'" + i.location + "'";
      } else {
        selectedLocationString = selectedLocationString + ",'" + i.location + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/stock_valution_summry_location_wise_csv.php?end_date=" + self.stockValuationSummryLocationWiseEndDateInput.value + "&location=" + selectedLocationString + "&selected_item_id=" + selected_item_id;
  // var link="csv/docket_register_item_wise_csv.php?start_date="+self.stockValuationSummryLocationWiseStartDateInput.value+"&end_date="+self.stockValuationSummryLocationWiseEndDateInput.value+"&location="+selectedLocationString+"&selected_item_id="+selected_item_id;

  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.location_id != t.location_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.location_id != t.location_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.location_id != t.location_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};

/********************************* department filter end***************************/
// self.selectLocation = (item,e) => {
//   item.selected=!e.item.m.selected
// }
self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

// self.setStartDate = () => {
//   self.sd=self.stockValuationSummryLocationWiseStartDateInput.value
// }

self.setEndDate = function () {
  self.ed = self.stockValuationSummryLocationWiseEndDateInput.value;
};

self.closeReport = function () {
  self.stock_valution_summry_location_wise = 'stock_valution_summry_location_wise_home';
};

self.readStockValuationSummaryLocationWise = function () {

  var selectedLocationString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedLocationString == '') {
        selectedLocationString = "'" + i.stock_type_code + "'";
      } else {
        selectedLocationString = selectedLocationString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = "'" + t.location + "'";
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ",'" + t.location + "'";
    }
  });
  console.log(selected_item_id);
  self.loading = true;
  //RiotControl.trigger('read_stock_valution_summry_location_wise', selectedLocationString,selected_item_id)
  RiotControl.trigger('read_stock_valution_summry_location_wise', self.stockValuationSummryLocationWiseEndDateInput.value, selectedLocationString, selected_item_id);
};

RiotControl.on('read_stock_valution_summry_location_wise_changed', function (mainArray, total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.total = [];
  self.total = total;
  // self.qty_grand_total = qty_grand_total
  // self.item_value_grand_total = item_value_grand_total
  self.stock_valution_summry_location_wise = 'stock_valution_summry_location_wise_report';
  //self.docketFrom=self.stockValuationSummryLocationWiseStartDateInput.value
  self.docketTo = self.stockValuationSummryLocationWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

// RiotControl.on('locations_for_stock_ledger_changed', function(locations) {
//   self.locations = locations
//   self.update()
// })

RiotControl.on('locations_for_stock_ledger_changed', function (items) {
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};

self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};

self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};

/**************** pagination ends*******************/
});
riot.tag2('stock-valuation-summary-store-type-wise', '<loading-bar if="{loading}"></loading-bar> <h4 class="no-print">Stock Valuation Summary (Store Type Wise)</h4> <div show="{stock_valution_summry_store_type_wise ==\'stock_valution_summry_store_type_wise_home\'}" class="no-print"> <div class="container-fulid no-print"> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="stockValuationSummryStoreTypeWiseEndDateInput">As On Date</label> <input type="text" class="form-control" id="stockValuationSummryStoreTypeWiseEndDateInput" onchange="{setEndDate}" placeholder="DD/MM/YYYY"> </div> </div> <div class="col-md-1"> <div class="form-group"> <label for="gobtn"></label> <button class="btn btn-primary form-control" style="margin-top: 6px;" __disabled="{loading}" onclick="{readStockValuationSummaryStoreTypeWise}" id="gobtn">Go</button> </div> </div> <div class="col-md-1"> <div class="form-group"> <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick="{excelExport}"> </div> </div> </div> <div class="row"> <div class="col-sm-4"> <div class="form-group"> <table class="table table-bordered"> <th></th> <th>Stock Type</th> <tr each="{m, i in stock_types}"> <td style="width:50px"><input type="checkbox" __checked="{m.selected}" id="{i}" class="form-control" onclick="{selectStockType.bind(this,m)}"></td> <td>{m.stock_type}</td> </tr> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup="{filterItems}"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td><input type="checkbox" class="form-control" id="{i}" __checked="{cat.selected}" onclick="{selectItem.bind(this, cat)}"></td> <td>{cat.item_name}-(Code:{cat.item_id})</td> </tr> <tfoot> <tr> <td colspan="9"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> </div> <div class="col-md-4"> <div class="form-group"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th>Selected Item</th> <th></th> </tr> <tr each="{cat, i in checkedItems}"> <td>{i+1}</td> <td>{cat.item_name}-(Code:{cat.item_id})</td> <td> <button class="btn btn-secondary" __disabled="{loading}" onclick="{removeItem.bind(this, cat)}"><i class="material-icons">remove</i></button> </td> </tr> </table> </div> </div> </div> </div> </div> <div class="container-fluid print-box" show="{stock_valution_summry_store_type_wise ==\'stock_valution_summry_store_type_wise_report\'}"> <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick="{closeReport}" style="margin-bottom:5px;">Close</button> <br> <center> <img src="dist/img/logo.png" style="height: 30px;"><br> <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br> 149,Barrackpore Trunk Road<br> P.O. : Kamarhati, Agarpara<br> Kolkata - 700058<br> <div>Stock Valuation Summary (Store Type Wise) <br> As On {docketTo}</div> <br> </center> <table class="table table-bordered bill-info-table print-small"> <tr> <th>Sl</th> <th>Item</th> <th>Stock Type</th> <th>Unit</th> <th>Opening Qty</th> <th>Receive Qty</th> <th>Issue Qty</th> <th>Reject to Party Qty</th> <th>Return to Stock Qty</th> <th>Closing Balance</th> </tr> <tr each="{t, k in mainArray}" no-reorder> <td>{k+1}</td> <td>{t.item_name}</td> <td style="text-align:center">{t.stock_type_code}</td> <td style="text-align:center">{t.uom_code}</td> <td style="text-align:right">{t.o_qty}</td> <td style="text-align:right">{t.r_qty}</td> <td style="text-align:right">{t.i_qty}</td> <td style="text-align:right">{t.rp_qty}</td> <td style="text-align:right">{t.rs_qty}</td> <td style="text-align:right">{t.closing_qty}</td> </tr> <tr> <td></td> <td></td> <td style="text-align:center"></td> <td style="text-align:center"></td> <td style="text-align:right">{total.o_qty}</td> <td style="text-align:right">{total.r_qty}</td> <td style="text-align:right">{total.i_qty}</td> <td style="text-align:right">{total.rp_qty}</td> <td style="text-align:right">{total.rs_qty}</td> <td style="text-align:right">{total.closing_qty}</td> </tr> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  //dateFormat('stockValuationSummryStoreTypeWiseStartDateInput')
  dateFormat('stockValuationSummryStoreTypeWiseEndDateInput');
  self.stock_valution_summry_store_type_wise = 'stock_valution_summry_store_type_wise_home';
  RiotControl.trigger('read_stock_types');
  RiotControl.trigger('read_items_filter');
  self.update();
});

self.excelExport = function () {
  // if (self.stockValuationSummryStoreTypeWiseStartDateInput.value=='') {
  //   toastr.info("Please Entet Start Date")
  //   return
  // }
  if (self.stockValuationSummryStoreTypeWiseEndDateInput.value == '') {
    toastr.info("Please Entet End Date");
    return;
  }

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  var link = "csv/stock_valution_summry_store_type_wise_csv.php?end_date=" + self.stockValuationSummryStoreTypeWiseEndDateInput.value + "&stock_type_code=" + selectedStockTypeString + "&selected_item_id=" + selected_item_id;
  // var link="csv/docket_register_item_wise_csv.php?start_date="+self.stockValuationSummryStoreTypeWiseStartDateInput.value+"&end_date="+self.stockValuationSummryStoreTypeWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString+"&selected_item_id="+selected_item_id;

  console.log(link);
  var win = window.open(link, '_blank');
  win.focus();
};

/********************************* department filter start*************************/
self.filterItems = function () {
  if (!self.searchItem) return;
  self.filteredItems = self.items.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase()) >= 0;
  });

  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
};

self.selectItem = function (t, e) {
  self.checkedItems.push(t);

  self.items = self.items.filter(function (c) {
    return c.item_id != t.item_id;
  });
  self.pagedDataItems = self.pagedDataItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
};

self.removeItem = function (t, e) {
  self.checkedItems = self.checkedItems.filter(function (c) {
    return c.item_id != t.item_id;
  });
  console.log(self.checkedItems);

  self.items.push(t);
  self.pagedDataItems.push(t);
};

/********************************* department filter end***************************/
self.selectStockType = function (item, e) {
  item.selected = !e.item.m.selected;
};

// self.setStartDate = () => {
//   self.sd=self.stockValuationSummryStoreTypeWiseStartDateInput.value
// }

self.setEndDate = function () {
  self.ed = self.stockValuationSummryStoreTypeWiseEndDateInput.value;
};

self.closeReport = function () {
  self.stock_valution_summry_store_type_wise = 'stock_valution_summry_store_type_wise_home';
};

self.readStockValuationSummaryStoreTypeWise = function () {

  var selectedStockTypeString = '';

  self.stock_types.map(function (i) {
    if (i.selected == true) {
      if (selectedStockTypeString == '') {
        selectedStockTypeString = "'" + i.stock_type_code + "'";
      } else {
        selectedStockTypeString = selectedStockTypeString + ",'" + i.stock_type_code + "'";
      }
    }
  });

  var selected_item_id = '';

  self.checkedItems.map(function (t) {
    if (selected_item_id == '') {
      selected_item_id = t.item_id;
    } else if (selected_item_id != '') {
      selected_item_id = selected_item_id + ',' + t.item_id;
    }
  });

  self.loading = true;
  //RiotControl.trigger('read_stock_valution_summry_store_type_wise', selectedStockTypeString,selected_item_id)
  RiotControl.trigger('read_stock_valution_summry_store_type_wise', self.stockValuationSummryStoreTypeWiseEndDateInput.value, selectedStockTypeString, selected_item_id);
};

RiotControl.on('read_stock_valution_summry_store_type_wise_changed', function (mainArray, total) {
  self.loading = false;
  self.mainArray = [];
  self.mainArray = mainArray;
  self.total = [];
  self.total = total;
  // self.qty_grand_total = qty_grand_total
  // self.item_value_grand_total = item_value_grand_total
  self.stock_valution_summry_store_type_wise = 'stock_valution_summry_store_type_wise_report';
  //self.docketFrom=self.stockValuationSummryStoreTypeWiseStartDateInput.value
  self.docketTo = self.stockValuationSummryStoreTypeWiseEndDateInput.value;
  self.update();
});

RiotControl.on('stock_types_changed', function (stock_types) {
  self.stock_types = stock_types;
  self.update();
});

RiotControl.on('items_filter_changed', function (items) {
  self.items = items;
  self.checkedItems = [];
  self.items = items;
  self.filteredItems = items;

  self.items_per_page = 10;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.update();
});

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredItems, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/
});

riot.tag2('tax-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>Tax</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchTax" class="form-control" placeholder="search" onkeyup="{filterTaxes}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshTaxes}"><i class="material-icons">refresh</i></button> <button class="btn btn-secondary" __disabled="{loading}" onclick="{showTaxModal}"><i class="material-icons">add</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr> <th class="serial-col">#</th> <th onclick="{sortByTax}" style="cursor: pointer;"> Tax <hand if="{activeSort==\'sortTax\'}"> <i class="material-icons" show="{sortTax}">arrow_upward</i> <i class="material-icons" hide="{sortTax}">arrow_downward</i> <hand> </th> <th onclick="{sortByTaxType}" style="cursor: pointer;"> Tax Type <hand if="{activeSort==\'sortTaxType\'}"> <i class="material-icons" show="{sortTaxType}">arrow_upward</i> <i class="material-icons" hide="{sortTaxType}">arrow_downward</i> </hand> </th> <th onclick="{sortByTaxRate}" style="cursor: pointer;"> Tax Rate <hand if="{activeSort==\'sortTaxRate\'}"> <i class="material-icons" show="{sortTaxRate}">arrow_upward</i> <i class="material-icons" hide="{sortTaxRate}">arrow_downward</i> <hand> </th> <th onclick="{sortByTaxGroup}" style="cursor: pointer;"> Tax Group <hand if="{activeSort==\'sortTaxGroup\'}"> <i class="material-icons" show="{sortTaxGroup}">arrow_upward</i> <i class="material-icons" hide="{sortTaxGroup}">arrow_downward</i> </hand> </th> <th class="two-buttons"></th> </tr> <tr each="{cat, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td>{cat.tax}</td> <td>{cat.tax_type}</td> <td>{cat.tax_rate}</td> <td>{cat.tax_group}</td> <td> <div class="table-buttons" hide="{cat.confirmDelete ||  cat.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{edit.bind(this, cat)}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{cat.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot> <tr> <td colspan="6"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div> <div class="modal fade" id="taxModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">{title} Tax</h4> </div> <div class="modal-body"> <div class="form-group row"> <label for="taxValue" class="col-xs-4 col-form-label">Tax</label> <div class="col-xs-8"> <input class="form-control" type="text" id="taxValue"> </div> </div> <div class="form-group row"> <label for="taxType" class="col-xs-4 col-form-label">Type</label> <div class="col-xs-8"> <input class="form-control" type="text" id="taxType"> </div> </div> <div class="form-group row"> <label for="taxRate" class="col-xs-4 col-form-label">Tax Rate</label> <div class="col-xs-8"> <input class="form-control" type="text" id="taxRate"> </div> </div> <div class="form-group row"> <label for="taxGroup" class="col-xs-4 col-form-label">Group</label> <div class="col-xs-8"> <select name="taxGroup" class="form-control"> <option value="Tax">Tax</option> <option value="Duty">Duty</option> <option value="Cess">Cess</option> </select> </div> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" onclick="{save}">Save changes</button> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortTax = true;
  self.sortTaxType = true;
  self.sortTaxRate = true;
  self.sortTaxGroup = true;
  self.activeSort = '';
  self.update();
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_taxes');
});

self.refreshTaxes = function () {
  self.taxes = [];
  self.searchTax.value;
  RiotControl.trigger('read_taxes');
};

self.filterTaxes = function () {
  if (!self.searchTax) return;
  self.filteredTaxes = self.taxes.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchTax.value.toLowerCase()) >= 0;
  });
  self.paginate(self.filteredTaxes, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredTaxes, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.taxes.map(function (c) {
    if (c.tax_id != e.item.cat.tax_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_tax', e.item.cat.tax_id);
};

self.edit = function (t, e) {
  self.title = 'Edit';
  $("#taxModal").modal('show');

  self.taxValue.value = t.tax;
  self.taxType.value = t.tax_type;
  self.taxRate.value = t.tax_rate;
  self.taxGroup.value = t.tax_group;
  self.tax_id = t.tax_id; // id to update the item
  self.update();
};

self.save = function () {

  if (!self.taxRate.value) {
    toastr.info("Please enter a valid Tax Rate and try again");
  } else if (!self.taxValue.value) {
    toastr.info("Please enter a valid Tax and try again");
  } else if (!self.taxType.value) {
    toastr.info("Please enter a valid Tax Type and try again");
  } else if (self.title == 'Add') {
    //add data to database after validation
    self.loading = true;
    RiotControl.trigger('add_tax', self.taxValue.value, self.taxType.value, self.taxRate.value, self.taxGroup.value);
  } else if (self.title == 'Edit') {
    self.loading = true;
    RiotControl.trigger('edit_tax', self.tax_id, self.taxValue.value, self.taxType.value, self.taxRate.value, self.taxGroup.value);
  }
};

self.cancelOperation = function (e) {
  self.taxes.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

self.showTaxModal = function () {
  self.title = 'Add';
  $("#taxModal").modal('show');
};

RiotControl.on('taxes_changed', function (taxes) {
  $("#taxModal").modal('hide');
  self.taxValue.value = '';
  self.taxType.value = '';
  self.taxRate.value = '';
  self.taxGroup.value = '';
  self.loading = false;
  self.taxes = taxes;
  self.filteredTaxes = taxes;

  self.items_per_page = 10;
  self.callPaging();
  self.update();
});

self.callPaging = function () {
  self.paginate(self.filteredTaxes, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredTaxes, 1, self.items_per_page);
};

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredTaxes, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredTaxes, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredTaxes, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/*sorting Starts*/
self.sortByTax = function () {

  if (self.sortTax == true) {
    self.taxes.sort(function (a, b) {
      return a.tax.toUpperCase().localeCompare(b.tax.toUpperCase());
    });
  } else {
    self.taxes.reverse();
  }

  self.activeSort = 'sortTax';
  self.filteredTaxes = self.taxes;
  self.callPaging();

  self.update();
  self.sortTax = !self.sortTax;
};

self.sortByTaxType = function () {

  if (self.sortTaxType == true) {
    self.taxes.sort(function (a, b) {
      return a.tax_type.toUpperCase().localeCompare(b.tax_type.toUpperCase());
    });
  } else {
    self.taxes.reverse();
  }

  self.activeSort = 'sortTaxType';
  self.filteredTaxes = self.taxes;
  self.callPaging();

  self.update();
  self.sortTaxType = !self.sortTaxType;
};

self.sortByTaxRate = function () {

  if (self.sortTaxRate == true) {
    self.taxes.sort(function (a, b) {
      return a.tax_rate - b.tax_rate;
    });
  } else {
    self.taxes.reverse();
  }

  self.activeSort = 'sortTaxRate';
  self.filteredTaxes = self.taxes;
  self.callPaging();

  self.update();
  self.sortTaxRate = !self.sortTaxRate;
};

self.sortByTaxGroup = function () {

  if (self.sortTaxGroup == true) {
    self.taxes.sort(function (a, b) {
      return a.tax_group.toUpperCase().localeCompare(b.tax_group.toUpperCase());
    });
  } else {
    self.taxes.reverse();
  }

  self.activeSort = 'sortTaxGroup';
  self.filteredTaxes = self.taxes;
  self.callPaging();

  self.update();
  self.sortTaxGroup = !self.sortTaxGroup;
};

/*sorting Ends*/
});

riot.tag2('uom-master', '<loading-bar if="{loading}"></loading-bar> <div class="container-fluid"> <div class="row"> <div class="col-sm-6"> <h1>UOM</h1> </div> <div class="col-sm-6 text-xs-right"> <div class="form-inline"> <input type="search" name="searchUom" class="form-control" placeholder="search" onkeyup="{filterUoms}" style="width:200px"> <button class="btn btn-secondary" __disabled="{loading}" onclick="{refreshUoms}"><i class="material-icons">refresh</i></button> </div> </div> </div> </div> <div class="col-sm-12"> <table class="table table-bordered"> <tr class="input-row"> <td colspan="2"><input type="text" name="addUomCodeInput" placeholder="Code" class="form-control" onkeyup="{addEnter}"></td> <td><input type="text" name="addUomInput" placeholder="UOM" class="form-control" onkeyup="{addEnter}"></td> <td class="two-buttons"><button class="btn btn-primary w-100" onclick="{add}">Add</button></td> </tr> <tr> <th class="serial-col">#</th> <th onclick="{sortByCode}" style="cursor: pointer;"> Code <hand if="{activeSort==\'sortCode\'}"> <i class="material-icons" show="{sortCode}">arrow_upward</i> <i class="material-icons" hide="{sortCode}">arrow_downward</i> <hand> </th> <th onclick="{sortByUOM}" style="cursor: pointer;"> UOM <hand if="{activeSort==\'sortuom\'}"> <i class="material-icons" show="{sortuom}">arrow_upward</i> <i class="material-icons" hide="{sortuom}">arrow_downward</i> </hand> </th> <th class="two-buttons"></th> </tr> <tr each="{loc, i in pagedDataItems}"> <td>{(current_page_no-1)*items_per_page + i + 1}</td> <td if="{!loc.confirmEdit && !loc.confirmDelete}"> {loc.uom_code} </td> <td if="{!loc.confirmEdit && !loc.confirmDelete}"> {loc.uom} </td> <td colspan="2" if="{loc.confirmDelete}"><span class="delete-question">Are you sure?</span></td> <td if="{loc.confirmEdit}"> <input type="text" id="editedUomCode" autofocus class="form-control" value="{loc.uom_code}" onkeyup="{editEnter.bind(this)}"> </td> <td if="{loc.confirmEdit}"> <input type="text" id="editedUom" class="form-control" value="{loc.uom}" onkeyup="{editEnter.bind(this)}"> </td> <td> <div class="table-buttons" hide="{loc.confirmDelete ||  loc.confirmEdit}"> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmEdit}"><i class="material-icons">create</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{confirmDelete}"><i class="material-icons">delete</i></button> </div> <div class="table-buttons" if="{loc.confirmDelete}"> <button __disabled="{loading}" class="btn btn-danger btn-sm" onclick="{delete}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> <div class="table-buttons" if="{loc.confirmEdit}"> <button __disabled="{loading}" class="btn btn-primary btn-sm" onclick="{edit}"><i class="material-icons">done</i></button> <button __disabled="{loading}" class="btn btn-secondary btn-sm" onclick="{cancelOperation}"><i class="material-icons">clear</i></button> </div> </td> </tr> <tfoot> <tr> <td colspan="4"> <div class="right-align"> Items Per Page: <select class="p1 mb0 rounded inline" onchange="{changeItemsPerPage}"> <option value="10">10</option> <option value="20">20</option> <option value="50">50</option> <option value="100">100</option> </select> Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange="{changePage}"> <option each="{pno in page_array}" value="{pno}">{pno}</option> </select> </div> </td> </tr> </tfoot> </table> </div>', '', '', function(opts) {
'use strict';

var self = this;
self.on("mount", function () {
  self.loading = true;
  self.sortuom = true;
  self.sortCode = true;
  self.activeSort = '';
  self.update();
  //RiotControl.trigger('login_init')
  RiotControl.trigger('read_uoms');
});

// RiotControl.on('login_changed', function(login_status) {
//   if(!login_status.role || login_status.role == 'FAIL'){
//     riot.route("/home")
//   }
// })

self.refreshUoms = function () {
  self.uoms = [];
  self.searchUom.value;
  RiotControl.trigger('read_uoms');
};

self.filterUoms = function () {
  if (!self.searchUom) return;
  self.filteredUoms = self.uoms.filter(function (c) {
    return JSON.stringify(c).toLowerCase().indexOf(self.searchUom.value.toLowerCase()) >= 0;
  });
  self.paginate(self.filteredUoms, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredUoms, 1, self.items_per_page);
};

self.confirmDelete = function (e) {
  self.uoms.map(function (c) {
    if (c.uom_id != e.item.loc.uom_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = true;
      c.confirmEdit = false;
    }
  });
};

self.confirmEdit = function (e) {
  self.uoms.map(function (c) {
    if (c.uom_id != e.item.loc.uom_id) {
      c.confirmDelete = false;
      c.confirmEdit = false;
    } else {
      c.confirmDelete = false;
      c.confirmEdit = true;
    }
  });
};

self.delete = function (e) {
  self.loading = true;
  RiotControl.trigger('delete_uom', e.item.loc.uom_id);
};

self.edit = function (e) {
  if (!$("#editedUomCode").val()) {
    toastr.info("Please enter a valid uom Code and try again");
  } else if (!$("#editedUom").val()) {
    toastr.info("Please enter a valid uom and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('edit_uom', e.item.loc.uom_id, $("#editedUomCode").val(), $("#editedUom").val());
  }
};

self.add = function () {
  if (!self.addUomCodeInput.value) {
    toastr.info("Please enter a valid uom Code and try again");
  } else if (!self.addUomInput.value) {
    toastr.info("Please enter a valid uom and try again");
  } else {
    self.loading = true;
    RiotControl.trigger('add_uom', self.addUomCodeInput.value, self.addUomInput.value);
  }
};

self.addEnter = function (e) {
  if (e.which == 13) {
    self.add();
  }
};

self.editEnter = function (e) {
  if (e.which == 13) {
    self.edit(e);
  }
};

self.cancelOperation = function (e) {
  self.uoms.map(function (c) {
    c.confirmDelete = false;
    c.confirmEdit = false;
  });
};

RiotControl.on('uoms_changed', function (uoms) {
  self.addUomCodeInput.value = '';
  self.addUomInput.value = '';
  self.loading = false;
  self.uoms = uoms;
  self.filteredUoms = uoms;

  self.items_per_page = 10;
  self.callPaging();
  self.update();
});

self.callPaging = function () {
  self.paginate(self.filteredUoms, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredUoms, 1, self.items_per_page);
};

/**************** pagination *******************/
self.getPageData = function (full_data, page_no, items_per_page) {
  var start_index = (page_no - 1) * items_per_page;
  var end_index = page_no * items_per_page;
  var items = full_data.filter(function (fd, i) {
    if (i >= start_index && i < end_index) return true;
  });
  return items;
};

self.paginate = function (full_data, items_per_page) {
  var total_pages = Math.ceil(full_data.length / items_per_page);
  var pages = [];
  for (var i = 1; i <= total_pages; i++) {
    pages.push(i);
  }
  self.page_array = pages;
  self.current_page_no = 1;
  self.update();
};
self.changePage = function (e) {
  self.pagedDataItems = self.getPageData(self.filteredUoms, e.target.value, self.items_per_page);
  self.current_page_no = e.target.value;
};
self.changeItemsPerPage = function (e) {
  self.items_per_page = e.target.value;
  self.paginate(self.filteredUoms, self.items_per_page);
  self.pagedDataItems = self.getPageData(self.filteredUoms, 1, self.items_per_page);
  self.current_page_no = 1;
  self.page_select.value = 1;
};
/**************** pagination ends*******************/

/*sorting Starts*/
self.sortByUOM = function () {

  if (self.sortuom == true) {
    self.uoms.sort(function (a, b) {
      return a.uom.toUpperCase().localeCompare(b.uom.toUpperCase());
    });
  } else {
    self.uoms.reverse();
  }

  self.activeSort = 'sortuom';
  self.filteredUoms = self.uoms;
  self.callPaging();

  self.update();
  self.sortuom = !self.sortuom;
};

self.sortByCode = function () {

  if (self.sortCode == true) {
    self.uoms.sort(function (a, b) {
      return a.uom_code - b.uom_code;
    });
  } else {
    self.uoms.reverse();
  }

  self.activeSort = 'sortCode';
  self.filteredUoms = self.uoms;
  self.callPaging();

  self.update();
  self.sortCode = !self.sortCode;
};

/*sorting Ends*/
});
