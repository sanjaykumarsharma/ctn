'use strict';

function ActivityStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.activities = [];

  self.on('read_activities', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/activity',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.activities = data.activities;
          self.trigger('activities_changed', self.activities);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_activity', function (activity_id) {
    var req = {};
    req.action = 'delete';
    req.activity_id = activity_id;
    // return;
    $.ajax({
      url: 'api/activity',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempActivities = self.activities.filter(function (c) {
            return c.activity_id != activity_id;
          });
          self.activities = tempActivities;
          self.trigger('activities_changed', self.activities);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_activity', function (activity_id, activity) {
    var req = {};
    req.action = 'edit';
    req.activity_id = activity_id;
    req.activity = activity;
    // return;
    $.ajax({
      url: 'api/activity',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.activities = self.activities.map(function (c) {
            if (c.activity_id == activity_id) {
              c.activity = activity;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('activities_changed', self.activities);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_activity', function (activity) {
    var req = {};
    req.action = 'add';
    req.activity = activity;
    // return;
    $.ajax({
      url: 'api/activity',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.activity_id = data.activity_id;
          cat.activity = activity;
          self.activities = [cat].concat(self.activities);
          self.trigger('activities_changed', self.activities);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
"use strict";

var showToast = function showToast(msg, data) {
  if (msg == "" || !msg) {
    msg = "Something went wrong";
  }
  toastr.error(msg);
  console.log("[ERROR:]");
  console.log(data);
};

var loginStore = new LoginStore(); // Create a store instance.
RiotControl.addStore(loginStore); // Register the store in central dispatch.

var indentStore = new IndentStore();
RiotControl.addStore(indentStore);

/*store for master start*/

var departmentStore = new DepartmentStore(); // Create a store instance.
RiotControl.addStore(departmentStore); // Register the store in central dispatch.

var locationStore = new LocationStore();
RiotControl.addStore(locationStore);

var chargeheadStore = new ChargeheadStore();
RiotControl.addStore(chargeheadStore);

var stockTypeStore = new StockTypeStore();
RiotControl.addStore(stockTypeStore);

var taxStore = new TaxStore();
RiotControl.addStore(taxStore);

var financialYearStore = new FinancialYearStore();
RiotControl.addStore(financialYearStore);

var uomStore = new UomStore();
RiotControl.addStore(uomStore);

var conditionStore = new ConditionStore();
RiotControl.addStore(conditionStore);

var itemGroupStore = new ItemGroupStore(); // Create a store instance.
RiotControl.addStore(itemGroupStore); // Register the store in central dispatch.

var partyStore = new PartyStore(); // Create a store instance.
RiotControl.addStore(partyStore); // Register the store in central dispatch.

var itemSubgroupStore = new ItemSubgroupStore(); // Create a store instance.
RiotControl.addStore(itemSubgroupStore); // Register the store in central dispatch.

var itemStore = new ItemStore(); // Create a store instance.
RiotControl.addStore(itemStore); // Register the store in central dispatch.

var purchaseOrderStore = new PurchaseOrderStore(); // Create a store instance.
RiotControl.addStore(purchaseOrderStore); // Register the store in central dispatch.

var docketStore = new DocketStore(); // Create a store instance.
RiotControl.addStore(docketStore); // Register the store in central dispatch.

var rejectToPartyStore = new RejectToPartyStore(); // Create a store instance.
RiotControl.addStore(rejectToPartyStore); // Register the store in central dispatch.

var issueToDepartmentStore = new IssueToDepartmentStore(); // Create a store instance.
RiotControl.addStore(issueToDepartmentStore); // Register the store in central dispatch.

var receiveStore = new ReceiveStore(); // Create a store instance.
RiotControl.addStore(receiveStore); // Register the store in central dispatch.

var returnToStockStore = new ReturnToStockStore(); // Create a store instance.
RiotControl.addStore(returnToStockStore); // Register the store in central dispatch.

var openingStockStore = new OpeningStockStore(); // Create a store instance.
RiotControl.addStore(openingStockStore); // Register the store in central dispatch.

/*store for master end*/

/*store for Report*/
var docketReportStore = new DocketReportStore();
RiotControl.addStore(docketReportStore);

var issueToDepartmentReport = new IssueToDepartmentReport();
RiotControl.addStore(issueToDepartmentReport);

var returnToStockReport = new ReturnToStockReport();
RiotControl.addStore(returnToStockReport);

var rejectToPartyReport = new RejectToPartyReport();
RiotControl.addStore(rejectToPartyReport);

var stockReportStore = new StockReportStore();
RiotControl.addStore(stockReportStore);

var stockSummaryStore = new StockSummaryStore();
RiotControl.addStore(stockSummaryStore);

var stockStatementStore = new StockStatementStore();
RiotControl.addStore(stockStatementStore);

var stockLedgerStore = new StockLedgerStore();
RiotControl.addStore(stockLedgerStore);

var indentReport = new IndentReport();
RiotControl.addStore(indentReport);

var poReport = new POReport();
RiotControl.addStore(poReport);
/*store for Report end*/

var currentPage = null;

var goTo = function goTo(path1, path2) {
  riot.mount('main-nav', { selected_nav_item: path1 });
  if (currentPage) {
    currentPage.unmount(true);
  }
  switch (path1) {
    case 'home':
      currentPage = riot.mount('div#view', 'home')[0];
      break;
    case 'indents':
      currentPage = riot.mount('div#view', 'indents')[0];
      break;
    case 'po':
      currentPage = riot.mount('div#view', 'po')[0];
      break;
    case 'docket':
      currentPage = riot.mount('div#view', 'docket')[0];
      break;
    case 'rejecttoparty':
      currentPage = riot.mount('div#view', 'reject-to-party')[0];
      break;
    case 'issuetodepartment':
      currentPage = riot.mount('div#view', 'issue-to-department')[0];
      break;
    case 'returntostock':
      currentPage = riot.mount('div#view', 'return-to-stock')[0];
      break;
    case 'openingstock':
      currentPage = riot.mount('div#view', 'opening-stock')[0];
      break;
    case 'receive':
      currentPage = riot.mount('div#view', 'receive')[0];
      break;
    case 'masters':
      console.log("Found path: " + path1 + " / " + path2);
      currentPage = riot.mount('div#view', 'masters', { selected_master: path2 })[0];
      switch (path2) {
        case 'department-master':
          riot.mount("div#master-view", 'department-master');
          break;
        case 'location-master':
          riot.mount("div#master-view", 'location-master');
          break;
        case 'chargehead-master':
          riot.mount("div#master-view", 'chargehead-master');
          break;
        case 'stock-type-master':
          riot.mount("div#master-view", 'stock-type-master');
          break;
        case 'tax-master':
          riot.mount("div#master-view", 'tax-master');
          break;
        case 'uom-master':
          riot.mount("div#master-view", 'uom-master');
          break;
        case 'condition-master':
          riot.mount("div#master-view", 'condition-master');
          break;
        case 'item-group':
          riot.mount("div#master-view", 'item-group-master');
          break;
        case 'party-master':
          riot.mount("div#master-view", 'party-master');
          break;
        case 'item':
          riot.mount("div#master-view", 'item-master');
          break;
        case 'financial-year':
          riot.mount("div#master-view", 'financial-year-master');
          break;
        case 'db-backup':
          riot.mount("div#master-view", 'db-backup');
          break;
        default:
          riot.mount("div#master-view", 'item-group-master');
      }
      break;
    case 'docket-register-date-wise':
      currentPage = riot.mount('div#view', 'docket-register-date-wise')[0];
      break;
    case 'docket-register-item-wise':
      currentPage = riot.mount('div#view', 'docket-register-item-wise')[0];
      break;
    case 'docket-register-party-wise':
      currentPage = riot.mount('div#view', 'docket-register-party-wise')[0];
      break;
    case 'docket-report':
      currentPage = riot.mount('div#view', 'docket-report')[0];
      break;
    case 'stock-date-wise':
      currentPage = riot.mount('div#view', 'stock-date-wise')[0];
      break;
    case 'stock-movement-register':
      currentPage = riot.mount('div#view', 'stock-movement-register')[0];
      break;
    case 'stock-valuation-summary-store-type-wise':
      currentPage = riot.mount('div#view', 'stock-valuation-summary-store-type-wise')[0];
      break;
    case 'stock-ledger-avg-valuation-in-details':
      currentPage = riot.mount('div#view', 'stock-ledger-avg-valuation-in-details')[0];
      break;
    case 'stock-ledger-avg-valuation-in-summry':
      currentPage = riot.mount('div#view', 'stock-ledger-avg-valuation-in-summry')[0];
      break;
    case 'stock-valuation-summary-location-wise':
      currentPage = riot.mount('div#view', 'stock-valuation-summary-location-wise')[0];
      break;
    case 'issuetodepartment-date-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-date-wise')[0];
      break;
    case 'issuetodepartment-item-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-item-wise')[0];
      break;
    case 'issuetodepartment-dept-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-dept-wise')[0];
      break;
    case 'issuetodepartment-location-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-location-wise')[0];
      break;
    case 'issuetodepartment-chargehead-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-chargehead-wise')[0];
      break;
    case 'returntostock-date-wise':
      currentPage = riot.mount('div#view', 'return-to-stock-date-wise')[0];
      break;
    case 'returntostock-item-wise':
      currentPage = riot.mount('div#view', 'return-to-stock-item-wise')[0];
      break;
    case 'returntostock-dept-wise':
      currentPage = riot.mount('div#view', 'return-to-stock-dept-wise')[0];
      break;
    case 'rejecttoparty-date-wise':
      currentPage = riot.mount('div#view', 'reject-to-party-date-wise')[0];
      break;
    case 'rejecttoparty-docket-date-wise':
      currentPage = riot.mount('div#view', 'reject-to-party-docket-date-wise')[0];
      break;
    case 'rejecttoparty-item-wise':
      currentPage = riot.mount('div#view', 'reject-to-party-item-wise')[0];
      break;
    case 'rejecttoparty-party-wise':
      currentPage = riot.mount('div#view', 'reject-to-party-party-wise')[0];
      break;
    case 'indent-date-wise':
      currentPage = riot.mount('div#view', 'indent-date-wise')[0];
      break;
    case 'indent-item-wise':
      currentPage = riot.mount('div#view', 'indent-item-wise')[0];
      break;
    case 'indent-report':
      currentPage = riot.mount('div#view', 'indent-report')[0];
      break;
    case 'po-date-wise':
      currentPage = riot.mount('div#view', 'po-date-wise')[0];
      break;
    case 'po-report':
      currentPage = riot.mount('div#view', 'po-report')[0];
      break;
    case 'po-party-wise':
      currentPage = riot.mount('div#view', 'po-party-wise')[0];
      break;
    case 'po-item-wise':
      currentPage = riot.mount('div#view', 'po-item-wise')[0];
      break;
    case 'po-report-supplied-materials':
      currentPage = riot.mount('div#view', 'po-report-supplied-materials')[0];
      break;
    case 'receive-for-stock-adjustment-report':
      currentPage = riot.mount('div#view', 'receive-for-stock-adjustment-report')[0];
      break;
    /*case 'reports':
      console.log("Found path for reports: " + path1 + " / " + path2);
      currentPage = riot.mount('div#view', 'reports', {selected_report: path2})[0];
      switch(path2){
        case 'docket-register-date-wise':
          riot.mount("div#report-view", 'docket-register-date-wise')
        break;
        case 'stock-summary':
          riot.mount("div#report-view", 'stock-summary')
        break;
        case 'stock-statement':
          riot.mount("div#report-view", 'stock-statement')
        break;
        case 'stock-in-hand':
          riot.mount("div#report-view", 'stock-in-hand')
        break;
        case 'pending-po':
          riot.mount("div#report-view", 'pending-po')
        break;
        case 'stock-ledger':
          riot.mount("div#report-view", 'stock-ledger')
        break;
        default:
          riot.mount("div#report-view", 'stock-statement')
      }
    break;*/
    default:

      currentPage = riot.mount('div#view', 'home')[0];
  }
};

riot.route.stop();
//riot.route.base('/#!')
//riot.route.base('/ntc')
riot.route.start(true);
riot.route(goTo);
'use strict';

function ChargeheadStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.chargeheads = [];

  self.on('read_chargeheads', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/chargehead',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.chargeheads = data.chargeheads;
          self.trigger('chargeheads_changed', self.chargeheads);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_chargehead', function (chargehead_id) {
    var req = {};
    req.action = 'delete';
    req.chargehead_id = chargehead_id;
    // return;
    $.ajax({
      url: 'api/chargehead',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.chargeheads.filter(function (c) {
            return c.chargehead_id != chargehead_id;
          });
          self.chargeheads = tempCategories;
          self.trigger('chargeheads_changed', self.chargeheads);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_chargehead', function (chargehead_id, chargehead_code, chargehead) {
    var req = {};
    req.action = 'edit';
    req.chargehead_id = chargehead_id;
    req.chargehead_code = chargehead_code;
    req.chargehead = chargehead;
    // return;
    $.ajax({
      url: 'api/chargehead',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.chargeheads = self.chargeheads.map(function (c) {
            if (c.chargehead_id == chargehead_id) {
              c.chargehead_code = chargehead_code;
              c.chargehead = chargehead;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('chargeheads_changed', self.chargeheads);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_chargehead', function (chargehead_code, chargehead) {
    var req = {};
    req.action = 'add';
    req.chargehead_code = chargehead_code;
    req.chargehead = chargehead;
    // return;
    $.ajax({
      url: 'api/chargehead',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.chargehead_id = data.chargehead_id;
          cat.chargehead_code = chargehead_code;
          cat.chargehead = chargehead;
          self.chargeheads = [cat].concat(self.chargeheads);
          self.trigger('chargeheads_changed', self.chargeheads);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function ConditionStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.conditions = [];

  self.on('read_conditions', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/condition',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.conditions = data.conditions;
          self.trigger('conditions_changed', self.conditions);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_condition', function (condition_id) {
    var req = {};
    req.action = 'delete';
    req.condition_id = condition_id;
    // return;
    $.ajax({
      url: 'api/condition',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.conditions.filter(function (c) {
            return c.condition_id != condition_id;
          });
          self.conditions = tempCategories;
          self.trigger('conditions_changed', self.conditions);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_condition', function (condition_id, condition_name) {
    var req = {};
    req.action = 'edit';
    req.condition_id = condition_id;
    req.condition_name = condition_name;
    // return;
    $.ajax({
      url: 'api/condition',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.conditions = self.conditions.map(function (c) {
            if (c.condition_id == condition_id) {
              c.condition_name = condition_name;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('conditions_changed', self.conditions);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_condition', function (condition_name) {
    var req = {};
    req.action = 'add';
    req.condition_name = condition_name;
    // return;
    $.ajax({
      url: 'api/condition',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.condition_id = data.condition_id;
          cat.condition_name = condition_name;
          self.conditions = [cat].concat(self.conditions);
          self.trigger('conditions_changed', self.conditions);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function DepartmentStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.departments = [];

  self.on('read_departments', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/department',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.departments = data.departments;
          self.trigger('departments_changed', self.departments);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_department', function (department_id) {
    var req = {};
    req.action = 'delete';
    req.department_id = department_id;
    // return;
    $.ajax({
      url: 'api/department',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.departments.filter(function (c) {
            return c.department_id != department_id;
          });
          self.departments = tempCategories;
          self.trigger('departments_changed', self.departments);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_department', function (department_id, department_code, department) {
    var req = {};
    req.action = 'edit';
    req.department_id = department_id;
    req.department_code = department_code;
    req.department = department;
    // return;
    $.ajax({
      url: 'api/department',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.departments = self.departments.map(function (c) {
            if (c.department_id == department_id) {
              c.department_code = department_code;
              c.department = department;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('departments_changed', self.departments);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_department', function (department_code, department) {
    var req = {};
    req.action = 'add';
    req.department_code = department_code;
    req.department = department;
    // return;
    $.ajax({
      url: 'api/department',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.department_id = data.department_id;
          cat.department_code = department_code;
          cat.department = department;
          self.departments = [cat].concat(self.departments);
          self.trigger('departments_changed', self.departments);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function DocketReportStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_docket_register_date_wise', function (start_date, end_date, stock_type_code) {
    console.log("calling here");
    var req = {};
    req.action = 'readDocketRegisterDateWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/docket-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_docket_register_date_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_docket_report', function (start_date, end_date, stock_type_code) {
    console.log("calling here");
    var req = {};
    req.action = 'readDocketReport';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/docket-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_docket_report_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_docket_register_party_wise', function (start_date, end_date, party_id) {
    console.log("calling here");
    var req = {};
    req.action = 'readDocketRegisterPartyWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.party_id = party_id;
    // return;
    $.ajax({
      url: 'api/docket-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_docket_register_party_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_docket_register_item_wise', function (start_date, end_date, stock_type_code, selected_item_id) {
    console.log("calling here");
    var req = {};
    req.action = 'readDocketRegisterItemWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/docket-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_docket_register_item_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_items_filter', function () {
    var req = {};
    req.action = 'read_items_filter';
    // return;
    $.ajax({
      url: 'api/item',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('items_filter_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Failed to read items. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function DocketStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.conditions = [];

  self.on('read_po_for_docket', function (stock_type) {
    var req = {};
    req.action = 'readPOForDocket';
    req.stock_type = stock_type;
    // return;
    $.ajax({
      url: 'api/docket',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_po_for_docket_changed', data.purchaseOrders, data.docket_no);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_material', function (po_id) {
    var req = {};
    req.action = 'readMaterials';
    //req.po_id=po_id
    req.poids = po_id;
    // return;
    $.ajax({
      url: 'api/docket',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_material_changed', data.material);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('save_docket', function (materials, details) {
    var req = {};
    req.action = 'saveDocket';
    req.materials = materials;
    req.details = details;
    // return;
    $.ajax({
      url: 'api/docket',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('docket_save_changed');
        } else if (data.status == 'error') {
          showToast("Please check your docket date some docket with newer date exists.");
        } else if (data.status == 'e') {
          showToast("Somthing went wrong.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_docket', function (materials, details, edit_docket_id) {
    var req = {};
    req.action = 'editDocket';
    req.materials = materials;
    req.details = details;
    req.edit_docket_id = edit_docket_id;
    // return;
    $.ajax({
      url: 'api/docket',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('docket_save_changed');
        } else if (data.status == 'e') {
          showToast("Somthing went wrong.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_docket', function (stock_type_code) {
    var req = {};
    req.action = 'readDocket';
    req.stock_type_code = stock_type_code;
    //req.end_date=end_date
    // return;
    $.ajax({
      url: 'api/docket',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_docket_changed', data.dockets);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_docket_details', function (docket_id) {
    var req = {};
    req.action = 'readDocketDetails';
    req.docket_id = docket_id;
    // return;
    $.ajax({
      url: 'api/docket',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_docket_details_changed', data.dockets);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_docket_details_edit', function (docket_id, po_id) {
    var req = {};
    req.action = 'readDocketDetailsEdit';
    req.docket_id = docket_id;
    req.po_id = po_id;
    // return;
    $.ajax({
      url: 'api/docket',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_docket_details_edit_changed', data.dockets);
        } else if (data.status == 'return_to_party_error') {
          self.trigger('read_docket_details_edit_error_changed', data.dockets);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  /*self.on('read_docket_details_reject_to_party', function(docket_id) {
    let req = {}
    req.action = 'readDocketDetailsEdit'
    req.docket_id=docket_id
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_docket_details_reject_to_party_changed', data.dockets)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })*/

  self.on('delete_docket', function (docket_id, dockets) {
    var req = {};
    req.action = 'deleteDocket';
    req.docket_id = docket_id;
    // return;
    $.ajax({
      url: 'api/docket',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = dockets.filter(function (c) {
            return c.docket_id != docket_id;
          });
          var docket = tempCategories;
          self.trigger('delete_docket_changed', docket);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function FinancialYearStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.financialYears = [];

  self.on('read_financial_year', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.financialYears = data.financialYears;
          self.trigger('financial_years_changed', self.financialYears);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_financial_year', function (id) {
    var req = {};
    req.action = 'delete';
    req.id = id;
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.financialYears.filter(function (c) {
            return c.id != id;
          });
          self.financialYears = tempCategories;
          self.trigger('financial_years_changed', self.financialYears);
        } else if (data.status == 'e') {
          showToast("some error occured.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_financial_year', function (id, start_date, end_date) {
    var req = {};
    req.action = 'edit';
    req.id = id;
    req.start_date = start_date;
    req.end_date = end_date;
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.financialYears = self.financialYears.map(function (c) {
            if (c.id == id) {
              c.status = c.status;
              c.start_date = start_date;
              c.end_date = end_date;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('financial_years_changed', self.financialYears);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('activate_financial_year', function (id) {
    var req = {};
    req.action = 'activateFinancialYear';
    req.id = id;
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('activate_financial_year_changed');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_financial_year', function (start_date, end_date) {
    var req = {};
    req.action = 'add';
    req.start_date = start_date;
    req.end_date = end_date;
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.id = data.id;
          cat.status = 'inactive';
          cat.start_date = start_date;
          cat.end_date = end_date;
          self.financialYears = [cat].concat(self.financialYears);
          self.trigger('financial_years_changed', self.financialYears);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('db_backup', function () {
    var req = {};
    req.action = 'db_backup';
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('db_backup_changed');
        } else if (data.status == 'e') {
          showToast("some error occured.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('db_store', function () {
    var req = {};
    req.action = 'db_store';
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('db_store_changed');
        } else if (data.status == 'e') {
          showToast("some error occured.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('db_running_amount', function () {
    var req = {};
    req.action = 'db_running_amount';
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('db_running_amount_changed');
        } else if (data.status == 'e') {
          showToast("some error occured.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('db_opening_stock', function () {
    var req = {};
    req.action = 'db_opening_stock';
    // return;
    $.ajax({
      url: 'api/financial-year',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('db_opening_stock_changed');
        } else if (data.status == 'e') {
          showToast("some error occured.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function IndentReport() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_indent_date_wise', function (start_date, end_date, status) {
    console.log("calling here");
    var req = {};
    req.action = 'readIndentDateWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.status = status;
    // return;
    $.ajax({
      url: 'api/indent-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_indent_date_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_indent_report', function (start_date, end_date, status) {
    console.log("calling here");
    var req = {};
    req.action = 'readIndentReport';
    req.start_date = start_date;
    req.end_date = end_date;
    req.status = status;
    // return;
    $.ajax({
      url: 'api/indent-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_indent_report_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_indent_item_wise', function (start_date, end_date, status, selected_item_id) {
    console.log("calling here");
    var req = {};
    req.action = 'readIndentItemWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.status = status;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/indent-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_indent_item_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function IndentStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.indents = [];

  self.on('read_departments_for_indent', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/department',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.departments = data.departments;
          self.trigger('read_departments_for_indent_changed', self.departments);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_indents', function (indent_status, stock_type) {
    var req = {};
    req.action = 'read';
    req.indent_status = indent_status;
    req.stock_type = stock_type;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.indents = data.indents;
          self.trigger('indents_changed', self.indents);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_indent_no', function (stock_type_code) {
    var req = {};
    req.action = 'readIndentNo';
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_indent_no_changed', data.indent_no);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_items_for_indent', function (item_group_code, stock_type_code) {
    var req = {};
    req.action = 'readItemsForIndent';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('items_for_indent_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_edit_indents', function (indent_id) {
    var req = {};
    req.action = 'readIndentEdit';
    req.indent_id = indent_id;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's' && data.total_po == 0) {
          self.values = data.item;
          self.trigger('read_edit_indents_changed', self.values);
        } else if (data.status == 's' && data.total_po > 0) {
          showToast("Edit Not Allowed.PO is created for this indent", data);
        } else if (data.status == 'e') {
          showToast("some error occured. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_view_indents', function (indent_id) {
    var req = {};
    req.action = 'readIndentView';
    req.indent_id = indent_id;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.view = data.item;
          self.trigger('read_view_indents_changed', self.view);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_indent', function (indent_id) {
    var req = {};
    req.action = 'delete';
    req.indent_id = indent_id;
    // return;
    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.indents.filter(function (c) {
            return c.indent_id != indent_id;
          });
          self.indents = tempCategories;
          self.trigger('indents_changed', self.indents);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_indent', function (selectedMaterialsArray, obj, indent_id) {
    var req = {};
    req.action = 'edit';
    req.materialsArray = selectedMaterialsArray;
    req.indent_date = obj.indent_date;
    req.department_code = obj.department_code;
    req.stock_type_code = obj.stock_type_code;
    req.indent_type = obj.indent_type;
    req.indent_id = indent_id;
    // return;
    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('indents_changed', self.indents);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_indent_status', function (obj) {
    var req = {};
    req.action = 'editIndentStatus';
    req.status_date = obj.status_date;
    req.authority_name = obj.authority_name;
    req.status_change_remarks = obj.status_change_remarks;
    req.status = obj.status;
    req.indent_id = obj.indent_id;
    // return;
    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.indents.filter(function (c) {
            return c.indent_id != obj.indent_id;
          });
          self.indents = tempCategories;
          self.trigger('indents_status_changed', self.indents);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_indent', function (selectedMaterialsArray, obj) {
    console.log(obj);
    var req = {};
    req.action = 'add';
    req.materialsArray = selectedMaterialsArray;
    req.indent_date = obj.indent_date;
    req.department_code = obj.department_code;
    req.stock_type_code = obj.stock_type_code;
    req.indent_type = obj.indent_type;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('indents_changed', self.indents);
        } else if (data.status == 'date_error') {
          self.trigger('indents_date_error');
        } else if (data.status == 'e') {
          showToast("some error occurred.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('search_items_for_indent', function (search_term, stock_type_code) {
    var req = {};
    req.action = 'search_items';
    req.search_term = search_term;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('items_for_indent_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Material not found.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('fetch_user_details_from_session_for_indent', function () {
    var req = {};
    req.action = 'fetchUserDetailsFromSessionForIndent';

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          console.log(data);
          self.trigger('fetch_user_details_from_session_for_indent_changed', data.username, data.user_id);
        } else if (data.status == 'e') {
          showToast("User error.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function IssueToDepartmentReport() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_issue_to_department_date_wise', function (start_date, end_date, stock_type_code, stock_adjustment) {
    console.log("calling here");
    var req = {};
    req.action = 'readIssueToDepartmentDateWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.stock_adjustment = stock_adjustment;
    // return;
    $.ajax({
      url: 'api/issuetodepartment-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_issue_to_department_date_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_issue_to_department_item_wise', function (start_date, end_date, stock_type_code, selected_item_id, stock_adjustment) {
    console.log("calling here");
    var req = {};
    req.action = 'readIssueToDepartmentItemWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_item_id = selected_item_id;
    req.stock_adjustment = stock_adjustment;
    // return;
    $.ajax({
      url: 'api/issuetodepartment-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_issue_to_department_item_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_issue_to_department_dept_wise', function (start_date, end_date, stock_type_code, selected_department_id, stock_adjustment) {
    console.log("calling here");
    var req = {};
    req.action = 'readIssueToDepartmentDeptWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_department_id = selected_department_id;
    req.stock_adjustment = stock_adjustment;
    // return;
    $.ajax({
      url: 'api/issuetodepartment-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_issue_to_department_dept_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_issue_to_department_location_wise', function (start_date, end_date, stock_type_code, selected_location_id, stock_adjustment) {
    console.log("calling here");
    var req = {};
    req.action = 'readIssueToDepartmentLocationWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_location_id = selected_location_id;
    req.stock_adjustment = stock_adjustment;
    // return;
    $.ajax({
      url: 'api/issuetodepartment-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_issue_to_department_location_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_issue_to_department_chargehead_wise', function (start_date, end_date, stock_type_code, selected_chargehead_id, stock_adjustment) {
    console.log("calling here");
    var req = {};
    req.action = 'readIssueToDepartmentChargeHeadWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_chargehead_id = selected_chargehead_id;
    req.stock_adjustment = stock_adjustment;
    // return;
    $.ajax({
      url: 'api/issuetodepartment-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_issue_to_department_chargehead_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  /*Stock Adjustment Report Receive*/

  self.on('read_receive_for_stock_adjustment_report', function (start_date, end_date, stock_type_code) {
    console.log("calling here");
    var req = {};
    req.action = 'readReceiveForStockAdjustment';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/issuetodepartment-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_receive_for_stock_adjustment_report_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function IssueToDepartmentStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_items_for_issue_to_department', function (item_group_code, stock_type_code) {
    var req = {};
    req.action = 'read';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/item',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.items = data.items;
          self.trigger('read_items_for_issue_to_department_changed', self.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_view', function (issue_id) {
    var req = {};
    req.action = 'readView';
    req.issue_id = issue_id;
    // return;
    $.ajax({
      url: 'api/issuetodepartment',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_view_changed', data.details, data.items);
        } else if (data.status == 'e') {
          showToast("some error occured while reading view.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_issue_number_by_stock_type', function (stock_type_code) {
    var req = {};
    req.action = 'readIssueNumber';
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/issuetodepartment',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_issue_number_by_stock_type_changed', data.issue_no);
        } else if (data.status == 'e') {
          showToast("some error occured while reading issue no.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('search_items', function (search_term, stock_type_code) {
    var req = {};
    req.action = 'search_items';
    req.search_term = search_term;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('search_items_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Material not found.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_issue_to_department', function (materials, issue_date, department_id, approve_by, receive_by, issue_no, stock_type_code, requisition_no, stock_adjustment, remarks) {
    var req = {};

    req.action = 'addIssueToDepartment';
    req.materials = materials;
    req.issue_date = issue_date;
    req.department_id = department_id;
    req.approve_by = approve_by;
    req.receive_by = receive_by;
    req.issue_no = issue_no;
    req.stock_type_code = stock_type_code;
    req.requisition_no = requisition_no;
    req.stock_adjustment = stock_adjustment;
    req.remarks = remarks;
    // return;
    $.ajax({
      url: 'api/issuetodepartment',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('add_issue_to_department_changed');
        } else if (data.status == 'error') {
          showToast("Please check issue date, greater issue date exists.");
        } else if (data.status == 'e') {
          showToast("Somthing went wrong.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_issue_to_department', function (materials, issue_date, department_id, approve_by, receive_by, issue_id, requisition_no, stock_adjustment, remarks, newMaterials) {
    var req = {};

    req.action = 'editIssueToDepartment';
    req.materials = materials;
    req.issue_date = issue_date;
    req.department_id = department_id;
    req.approve_by = approve_by;
    req.receive_by = receive_by;
    req.issue_id = issue_id;
    req.requisition_no = requisition_no;
    req.stock_adjustment = stock_adjustment;
    req.remarks = remarks;
    req.new_materials = newMaterials;
    // return;
    $.ajax({
      url: 'api/issuetodepartment',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('edit_issue_to_department_changed');
        } else if (data.status == 'e') {
          showToast("Somthing went wrong.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_issued_items_by_department', function (stock_type_code) {
    var req = {};
    req.action = 'readIssuedItems';
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/issuetodepartment',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {

          self.trigger('read_issued_items_by_department_changed', data.items);
        } else if (data.status == 'e') {
          showToast("some error occured in read_issued_items_by_department.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_items_for_issue_edit', function (issue_id) {
    var req = {};
    req.action = 'readItemsForIssueEdit';
    req.issue_id = issue_id;
    // return;
    $.ajax({
      url: 'api/issuetodepartment',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {

          self.trigger('read_items_for_issue_edit_changed', data.items, data.details);
        } else if (data.status == 'e') {
          showToast("some error occured in read items for issue edit.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_issue', function (issue_id, issuedItems) {
    var req = {};
    req.action = 'deleteIssue';
    req.issue_id = issue_id;
    // return;
    $.ajax({
      url: 'api/issuetodepartment',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempItems = issuedItems.filter(function (c) {
            return c.issue_id != issue_id;
          });
          var items = tempItems;
          self.trigger('delete_issue_changed', items);
        } else if (data.status == 'e') {
          showToast("Issue delete error. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('fetch_user_details_from_session_for_issue_to_department', function () {
    var req = {};
    req.action = 'fetchUserDetailsFromSessionForIndent';

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          console.log(data);
          self.trigger('fetch_user_details_from_session_for_issue_to_department_changed', data.username, data.user_id);
        } else if (data.status == 'e') {
          showToast("User error.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function ItemGroupStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.item_groups = [];

  self.on('read_item_groups', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/item-group',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.item_groups = data.item_groups;
          self.trigger('item_groups_changed', self.item_groups);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_item_group', function (item_group_id) {
    var req = {};
    req.action = 'delete';
    req.item_group_id = item_group_id;
    // return;
    $.ajax({
      url: 'api/item-group',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.item_groups.filter(function (c) {
            return c.item_group_id != item_group_id;
          });
          self.item_groups = tempCategories;
          self.trigger('item_groups_changed', self.item_groups);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_item_group', function (item_group_id, item_group_code, item_group) {
    var req = {};
    req.action = 'edit';
    req.item_group_id = item_group_id;
    req.item_group_code = item_group_code;
    req.item_group = item_group;
    // return;
    $.ajax({
      url: 'api/item-group',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.item_groups = self.item_groups.map(function (c) {
            if (c.item_group_id == item_group_id) {
              c.item_group_code = item_group_code;
              c.item_group = item_group;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('item_groups_changed', self.item_groups);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_item_group', function (item_group_code, item_group) {
    var req = {};
    req.action = 'add';
    req.item_group_code = item_group_code;
    req.item_group = item_group;
    // return;
    $.ajax({
      url: 'api/item-group',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.item_group_id = data.item_group_id;
          cat.item_group_code = item_group_code;
          cat.item_group = item_group;
          self.item_groups = [cat].concat(self.item_groups);
          self.trigger('item_groups_changed', self.item_groups);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function ItemStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.items = [];

  self.on('read_items', function (item_group_code, stock_type_code, alphabet) {
    var req = {};
    req.action = 'read';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;
    req.alphabet = alphabet;
    // return;
    $.ajax({
      url: 'api/item',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.items = data.items;
          self.trigger('items_changed', self.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_item', function (item_id) {
    var req = {};
    req.action = 'delete';
    req.item_id = item_id;
    // return;
    $.ajax({
      url: 'api/item',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.items.filter(function (c) {
            return c.item_id != item_id;
          });
          self.items = tempCategories;
          self.trigger('items_changed', self.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_item', function (obj) {
    var req = {};
    req.action = 'edit';
    req.item_id = obj.item_id;
    req.item_name = obj.itemNameInput;
    req.item_group_code = obj.itemGroupCodeInput;
    req.uom_code = obj.uomCodeInput;
    req.location = obj.locationInput;
    req.max_level = obj.maxLevelInput;
    req.reorder_level = obj.rolInput;
    req.item_description = obj.itemDescriptionInput;
    req.stock_type_code = obj.stockTypeInput;
    req.min_level = obj.minLevelInput;
    req.reorder_qty = obj.roqInput;
    // return;
    $.ajax({
      url: 'api/item',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.items = self.items.map(function (cat) {
            if (cat.item_id == obj.item_id) {
              cat.item_id = obj.item_id;
              cat.item_name = obj.itemNameInput;
              cat.item_group_code = obj.itemGroupCodeInput;
              cat.uom_code = obj.uomCodeInput;
              cat.location = obj.locationInput;
              cat.max_level = obj.maxLevelInput;
              cat.reorder_level = obj.rolInput;
              cat.item_description = obj.itemDescriptionInput;
              cat.stock_type_code = obj.stockTypeInput;
              cat.min_level = obj.minLevelInput;
              cat.reorder_qty = obj.roqInput;
            }
            cat.confirmEdit = false;
            return cat;
          });
          self.trigger('items_changed', self.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_item', function (obj) {
    console.log(obj);
    var req = {};
    req.action = 'add';
    req.item_name = obj.itemNameInput;
    req.item_group_code = obj.itemGroupCodeInput;
    req.uom_code = obj.uomCodeInput;
    req.location = obj.locationInput;
    req.max_level = obj.maxLevelInput;
    req.reorder_level = obj.rolInput;
    req.item_description = obj.itemDescriptionInput;
    req.stock_type_code = obj.stockTypeInput;
    req.min_level = obj.minLevelInput;
    req.reorder_qty = obj.roqInput;
    // return;
    $.ajax({
      url: 'api/item',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          /*let cat = {}
          cat.item_id = data.item_id
          cat.item_code=obj.itemCode
          cat.add_line1=obj.addLine1
          cat.city=obj.city
          cat.pin=obj.pin
          cat.phone_office=obj.phoneOffice
          cat.email=obj.email
          cat.cst=obj.cst
          cat.pan=obj.pan
          cat.item_name=obj.itemName
          cat.add_line2=obj.addLine2
          cat.state=obj.state
          cat.mobile=obj.mobile
          cat.phone_residence=obj.phoneResidence
          cat.vat=obj.vat
          cat.excise=obj.excise
          cat.address=obj.addLine1 + ', ' + obj.addLine2 + ', ' + obj.city + ', ' + obj.state + ', ' + obj.pin
                   self.items = [cat, ...self.items]*/
          self.trigger('items_changed', self.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function ItemSubgroupStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.item_subgroups = [];

  self.on('read_item_subgroups', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/item-subgroup',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.item_subgroups = data.item_subgroups;
          self.trigger('item_subgroups_changed', self.item_subgroups);
        } else if (data.status == 'e') {
          showToast("Failed to read item subgroups. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_item_subgroup', function (item_subgroup_id) {
    var req = {};
    req.action = 'delete';
    req.item_subgroup_id = item_subgroup_id;
    // return;
    $.ajax({
      url: 'api/item-subgroup',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempItemSubgroups = self.item_subgroups.filter(function (c) {
            return c.item_subgroup_id != item_subgroup_id;
          });
          self.item_subgroups = tempItemSubgroups;
          self.trigger('item_subgroups_changed', self.item_subgroups);
        } else if (data.status == 'e') {
          showToast("Failed to delete item subgroup. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_item_subgroup', function (item_subgroup_id, item_group_id, item_subgroup) {
    var req = {};
    req.action = 'edit';
    req.item_subgroup_id = item_subgroup_id;
    req.item_group_id = item_group_id;
    req.item_subgroup = item_subgroup;
    // return;
    $.ajax({
      url: 'api/item-subgroup',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.item_subgroups = self.item_subgroups.map(function (c) {
            if (c.item_subgroup_id == item_subgroup_id) {
              c.item_subgroup = item_subgroup;
              c.item_group_id = item_group_id;
              c.item_group = data.item_group;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('item_subgroups_changed', self.item_subgroups);
        } else if (data.status == 'e') {
          showToast("Failed to edit item subgroup. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_item_subgroup', function (item_group_id, item_subgroup) {
    var req = {};
    req.action = 'add';
    req.item_group_id = item_group_id;
    req.item_subgroup = item_subgroup;
    // return;
    $.ajax({
      url: 'api/item-subgroup',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.item_group_id = item_group_id;
          cat.item_group = data.item_group;
          cat.item_subgroup_id = data.item_subgroup_id;
          cat.item_subgroup = item_subgroup;
          self.item_subgroups = [cat].concat(self.item_subgroups);
          self.trigger('item_subgroups_changed', self.item_subgroups);
        } else if (data.status == 'e') {
          showToast("Failed to add item subgroup. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function LocationStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.locations = [];

  self.on('read_locations', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/location',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.locations = data.locations;
          self.trigger('locations_changed', self.locations);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_location', function (location_id) {
    var req = {};
    req.action = 'delete';
    req.location_id = location_id;
    // return;
    $.ajax({
      url: 'api/location',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.locations.filter(function (c) {
            return c.location_id != location_id;
          });
          self.locations = tempCategories;
          self.trigger('locations_changed', self.locations);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_location', function (location_id, location_code, location) {
    var req = {};
    req.action = 'edit';
    req.location_id = location_id;
    req.location_code = location_code;
    req.location = location;
    // return;
    $.ajax({
      url: 'api/location',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.locations = self.locations.map(function (c) {
            if (c.location_id == location_id) {
              c.location_code = location_code;
              c.location = location;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('locations_changed', self.locations);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_location', function (location_code, location) {
    var req = {};
    req.action = 'add';
    req.location_code = location_code;
    req.location = location;
    // return;
    $.ajax({
      url: 'api/location',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.location_id = data.location_id;
          cat.location_code = location_code;
          cat.location = location;
          self.locations = [cat].concat(self.locations);
          self.trigger('locations_changed', self.locations);
        } else if (data.status == 'e') {
          showToast("error in adding location.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function LoginStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.login_status = {
    username: undefined,
    role: undefined,
    first_name: ""
  };

  self.on('check_login', function (username, password) {
    var req = {};
    req.action = 'login';
    req.username = username;
    req.password = password;
    // return;
    $.ajax({
      url: 'api/login',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log(data);
        if (data.status == 's') {
          if (data.role !== 'FAIL') {
            self.login_status.username = data.username;
            self.login_status.role = data.role;
            self.login_status.first_name = data.first_name;
          } else {
            showToast("Invalid Username or password. Please try again.", data);
            self.login_status.role = "FAIL";
          }
          self.trigger('login_changed', self.login_status);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('logout', function () {

    var req = {};
    req.action = 'logout';
    $.ajax({
      url: 'api/login',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log(data);
        /*if(data.status == 's'){
          self.login_status = {
          username: undefined,
          role: undefined,
          first_name:""
         }*/
        self.trigger('logOut_changed');
        /*}else if(data.status == 'e'){
          showToast("Not able to logout.", data)
        }*/
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('change_password', function (username, old_password, new_password) {

    var req = {};
    req.action = 'changePassword';
    req.username = username;
    req.old_password = old_password;
    req.new_password = new_password;

    $.ajax({
      url: 'api/login',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('change_password_completed', data.count);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('login_init', function () {
    //self.trigger('login_changed', self.login_status)
  });
}
'use strict';

function OpeningStockStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_items_for_opening_stock', function (item_group_code, stock_type_code) {
    var req = {};
    req.action = 'readItems';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/openingstock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.items = data.items;
          self.trigger('read_items_for_opening_stock_changed', self.items);
        } else if (data.status == 'e') {
          showToast("Failed to add opening stock. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('search_items_for_opening_stock', function (search_term, stock_type_code) {
    var req = {};
    req.action = 'searchItemsForOpeningStock';
    req.search_term = search_term;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/openingstock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('search_items_for_opening_stock_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Material not found.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('search_items_of_opening_stock', function (search_term, stock_type_code) {
    var req = {};
    req.action = 'searchItemsOfOpeningStock';
    req.search_term = search_term;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/openingstock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('search_items_of_opening_stock_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Material not found.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_opening_stock_items', function (item_group_code, stock_type_code) {
    var req = {};
    req.action = 'readOpeningStock';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/openingstock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_opening_stock_items_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_opening_stock', function (selectedMaterialsArray, obj) {
    var req = {};
    req.action = 'addOpeningStock';
    req.materials = selectedMaterialsArray;
    req.opening_stock_date = obj.opening_stock_date;
    // return;
    $.ajax({
      url: 'api/openingstock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('add_opening_stock_changed');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_opening_stock', function (selectedMaterialsArray, obj) {
    var req = {};
    req.action = 'editOpeningStock';
    req.materials = selectedMaterialsArray;
    req.opening_stock_date = obj.opening_stock_date;
    // return;
    $.ajax({
      url: 'api/openingstock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('edit_opening_stock_changed');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function PartyStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.parties = [];

  self.on('read_parties', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/party',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.parties = data.parties;
          self.trigger('parties_changed', self.parties, data.party);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_party', function (party_id) {
    var req = {};
    req.action = 'delete';
    req.party_id = party_id;
    // return;
    $.ajax({
      url: 'api/party',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.parties.filter(function (c) {
            return c.party_id != party_id;
          });
          self.parties = tempCategories;
          self.trigger('parties_changed', self.parties);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_party', function (obj) {
    var req = {};
    req.action = 'edit';
    req.party_id = obj.party_id;
    req.party_code = obj.partyCode;
    req.add_line1 = obj.addLine1;
    req.city = obj.city;
    req.pin = obj.pin;
    req.phone_office = obj.phoneOffice;
    req.email = obj.email;
    req.cst = obj.cst;
    req.pan = obj.pan;
    req.party_name = obj.partyName;
    req.add_line2 = obj.addLine2;
    req.state = obj.state;
    req.mobile = obj.mobile;
    req.phone_residence = obj.phoneResidence;
    req.vat = obj.vat;
    req.excise = obj.excise;
    req.gst = obj.gst;
    // return;
    $.ajax({
      url: 'api/party',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.parties = self.parties.map(function (cat) {
            if (cat.party_id == obj.party_id) {
              cat.party_id = obj.party_id;
              cat.party_code = obj.partyCode;
              cat.add_line1 = obj.addLine1;
              cat.city = obj.city;
              cat.pin = obj.pin;
              cat.phone_office = obj.phoneOffice;
              cat.email = obj.email;
              cat.cst = obj.cst;
              cat.pan = obj.pan;
              cat.party_name = obj.partyName;
              cat.add_line2 = obj.addLine2;
              cat.state = obj.state;
              cat.mobile = obj.mobile;
              cat.phone_residence = obj.phoneResidence;
              cat.vat = obj.vat;
              cat.excise = obj.excise;
              cat.gst = obj.gst;
              cat.address = obj.addLine1 + ', ' + obj.addLine2 + ', ' + obj.city + ', ' + obj.state + ', ' + obj.pin;
            }
            cat.confirmEdit = false;
            return cat;
          });
          self.trigger('parties_changed', self.parties);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_party', function (obj) {
    console.log(obj);
    var req = {};
    req.action = 'add';
    req.party_code = obj.partyCode;
    req.add_line1 = obj.addLine1;
    req.city = obj.city;
    req.pin = obj.pin;
    req.phone_office = obj.phoneOffice;
    req.email = obj.email;
    req.cst = obj.cst;
    req.pan = obj.pan;
    req.party_name = obj.partyName;
    req.add_line2 = obj.addLine2;
    req.state = obj.state;
    req.mobile = obj.mobile;
    req.phone_residence = obj.phoneResidence;
    req.vat = obj.vat;
    req.excise = obj.excise;
    req.gst = obj.gst;
    // return;
    $.ajax({
      url: 'api/party',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.party_id = data.party_id;
          cat.party_code = obj.partyCode;
          cat.add_line1 = obj.addLine1;
          cat.city = obj.city;
          cat.pin = obj.pin;
          cat.phone_office = obj.phoneOffice;
          cat.email = obj.email;
          cat.cst = obj.cst;
          cat.pan = obj.pan;
          cat.party_name = obj.partyName;
          cat.add_line2 = obj.addLine2;
          cat.state = obj.state;
          cat.mobile = obj.mobile;
          cat.phone_residence = obj.phoneResidence;
          cat.vat = obj.vat;
          cat.excise = obj.excise;
          cat.gst = obj.gst;
          cat.address = obj.addLine1 + ', ' + obj.addLine2 + ', ' + obj.city + ', ' + obj.state + ', ' + obj.pin;

          self.parties = [cat].concat(self.parties);
          self.trigger('parties_changed', self.parties);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function POReport() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_po_date_wise', function (start_date, end_date, status) {
    console.log("calling here");
    var req = {};
    req.action = 'readPODateWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.status = status;
    // return;
    $.ajax({
      url: 'api/po-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_po_date_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_po_report', function (start_date, end_date, status, selected_party_id, selectedStockTypeString) {
    console.log("calling here");
    var req = {};
    req.action = 'readPOReport';
    req.start_date = start_date;
    req.end_date = end_date;
    req.status = status;
    req.party_id = selected_party_id;
    req.stock_type_code = selectedStockTypeString;
    // return;
    $.ajax({
      url: 'api/po-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_po_report_changed', data);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_po_party_wise', function (start_date, end_date, party_id) {
    console.log("calling here");
    var req = {};
    req.action = 'readPOPartyWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.party_id = party_id;
    // return;
    $.ajax({
      url: 'api/po-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_po_party_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_po_item_wise', function (start_date, end_date, status) {
    console.log("calling here");
    var req = {};
    req.action = 'readPOItemWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.status = status;
    // return;
    $.ajax({
      url: 'api/po-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_po_item_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_po_report_supplied_materials', function (start_date, end_date, party_id, selectedStockTypeString) {
    console.log("calling here");
    var req = {};
    req.action = 'readPOSuppliedMaterial';
    req.start_date = start_date;
    req.end_date = end_date;
    req.party_id = party_id;
    req.stock_type_code = selectedStockTypeString;
    // return;
    $.ajax({
      url: 'api/po-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_po_report_supplied_materials_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function PurchaseOrderStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.purchase_orders = [];

  self.on('read_po', function (purchase_order_status, stock_type) {
    var req = {};
    req.action = 'read';
    req.purchase_order_status = purchase_order_status;
    req.stock_type = stock_type;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.purchaseOrders = data.purchase_orders;
          self.trigger('purchase_orders_changed', self.purchaseOrders);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_indents_for_po_addition', function (indent_status) {
    var req = {};
    req.action = 'readIndentsForPOAddition';
    req.indent_status = indent_status;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_indents_for_po_addition_changed', data.indents);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_indents_for_po', function (indentIdArray, stock_type_code) {
    var req = {};
    req.action = 'readIndentsForPurchaseOrder';
    req.indentIdArray = indentIdArray;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.values = data.item;
          self.trigger('read_indents_for_po_changed', self.values, data.po_no);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_po_no', function (stock_type_code) {
    var req = {};
    req.action = 'readPoNo';
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_po_no_changed', data.po_no);
        } else if (data.status == 'e') {
          showToast("po no read error. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_po', function (materialArray, conditionArray, party_id, remarks, quotatoin_ref, po_date, stock_type_code) {
    var req = {};
    req.action = 'add';
    req.materialArray = materialArray;
    req.conditionArray = conditionArray;
    req.party_id = party_id;
    req.remarks = remarks;
    req.quotatoin_ref = quotatoin_ref;
    req.po_date = po_date;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('po_created');
        } else if (data.status == 'date_error') {
          self.trigger('po_creation_date_error');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_po_without_indent', function (materialArray, conditionArray, party_id, remarks, quotatoin_ref, po_date, stock_type_code) {
    var req = {};
    req.action = 'addPurchaseOrderWithoutIndent';
    req.materialArray = materialArray;
    req.conditionArray = conditionArray;
    req.party_id = party_id;
    req.remarks = remarks;
    req.quotatoin_ref = quotatoin_ref;
    req.po_date = po_date;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('po_created');
        } else if (data.status == 'date_error') {
          self.trigger('po_creation_date_error');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_po', function (materialArray, conditionArray, party_id, po_id, remarks, quotatoin_ref, po_date, stock_type_code) {
    var req = {};
    req.action = 'edit';
    req.materialArray = materialArray;
    req.conditionArray = conditionArray;
    req.party_id = party_id;
    req.po_id = po_id;
    req.remarks = remarks;
    req.quotatoin_ref = quotatoin_ref;
    req.po_date = po_date;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('po_edited');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_po_without_indent', function (materialArray, conditionArray, party_id, po_id, remarks, quotatoin_ref, po_date) {
    var req = {};
    req.action = 'editPOWithoutIndent';
    req.materialArray = materialArray;
    req.conditionArray = conditionArray;
    req.party_id = party_id;
    req.po_id = po_id;
    req.remarks = remarks;
    req.quotatoin_ref = quotatoin_ref;
    req.po_date = po_date;
    //req.stock_type_code=stock_type_code

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('po_edited');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_po', function (po_id, po_without_indent) {
    var req = {};
    req.action = 'delete';
    req.po_id = po_id;
    req.po_without_indent = po_without_indent;
    // return;
    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's' && data.total_docket_no == 0) {
          var tempPos = self.purchaseOrders.filter(function (c) {
            return c.po_id != po_id;
          });
          self.purchaseOrders = tempPos;
          self.trigger('purchase_orders_changed', self.purchaseOrders);
        } else if (data.status == 's' && data.total_docket_no > 0) {
          showToast("Some Docket is there. Please delete Docket first.", data);
          self.trigger('purchase_orders_not_deleted', self.purchaseOrders);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('complete_po', function (po_id) {
    var req = {};
    req.action = 'completePO';
    req.po_id = po_id;
    // return;
    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempPos = self.purchaseOrders.filter(function (c) {
            return c.po_id != po_id;
          });
          self.purchaseOrders = tempPos;
          self.trigger('purchase_orders_changed', self.purchaseOrders);
        } else if (data.status == 'e') {
          showToast("Needs admin permission to approve the PO.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('view_po', function (po_id) {
    var req = {};
    req.action = 'readPurchaseOrderView';
    req.po_id = po_id;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          //self.viewPurchaseOrders = data.purchaseOrders
          self.trigger('purchase_orders_view_changed', data.purchaseOrders);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('view_po_without_indent', function (po_id) {
    var req = {};
    req.action = 'readPurchaseOrderViewWithoutIndent';
    req.po_id = po_id;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          //self.viewPurchaseOrders = data.purchaseOrders
          self.trigger('purchase_orders_view_changed', data.purchaseOrders);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_edit_po', function (po_id, indentIdArray, stock_type_code) {
    var req = {};
    req.action = 'readPurchaseOrderEdit';
    req.po_id = po_id;
    req.indentIdArray = indentIdArray;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('purchase_orders_edit_changed', data.purchaseOrders, data.po_no);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_edit_po_without_indent', function (po_id, indentIdArray) {
    var req = {};
    req.action = 'readPurchaseOrderEditWithoutIndent';
    req.po_id = po_id;
    req.indentIdArray = indentIdArray;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's' && data.purchaseOrders.total_docket_no == 0) {
          self.trigger('purchase_orders_edit_without_indent_changed', data.purchaseOrders);
        } else if (data.status == 's' && data.purchaseOrders.total_docket_no > 0) {
          self.trigger('purchase_orders_edit_without_indent_error');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_indents_edit', function (indent_status, po_id) {
    var req = {};
    req.action = 'readIndentEdit';
    req.indent_status = indent_status;
    req.po_id = po_id;

    $.ajax({
      url: 'api/po',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's' && data.docket_no == 0) {
          self.trigger('indents_edit_changed', data.indents);
        } else if (data.status == 's' && data.docket_no > 0) {
          showToast("Edit is not allowed. some docket is created for this PO.", data);
        } else if (data.status == 'e') {
          showToast("some error occured. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_items_for_po', function (item_group_code, stock_type_code) {
    var req = {};
    req.action = 'readItemsForIndent';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('items_for_po_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('search_items_for_po', function (search_term, stock_type_code) {
    var req = {};
    req.action = 'search_items';
    req.search_term = search_term;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('items_for_po_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Material not found.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function ReceiveStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_items_for_receive', function (item_group_code, stock_type_code) {
    var req = {};
    req.action = 'read';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/item',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.items = data.items;
          self.trigger('read_items_for_receive_changed', self.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_receive_view', function (receive_id) {
    var req = {};
    req.action = 'readView';
    req.receive_id = receive_id;
    // return;
    $.ajax({
      url: 'api/receive',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_receive_view_changed', data.details, data.items);
        } else if (data.status == 'e') {
          showToast("some error occured while reading view.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_receive_number_by_stock_type', function (stock_type_code) {
    var req = {};
    req.action = 'readReceiveNumber';
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/receive',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_receive_number_by_stock_type_changed', data.receive_no);
        } else if (data.status == 'e') {
          showToast("some error occured while reading receive no.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('search_items', function (search_term, stock_type_code) {
    var req = {};
    req.action = 'search_items';
    req.search_term = search_term;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('search_items_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Material not found.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_receive', function (materials, receive_date, adjusted_by, approve_by, receive_no, stock_type_code, remarks) {
    var req = {};

    req.action = 'addReceive';
    req.materials = materials;
    req.receive_date = receive_date;
    req.approve_by = approve_by;
    req.adjusted_by = adjusted_by;
    req.receive_no = receive_no;
    req.stock_type_code = stock_type_code;
    req.remarks = remarks;
    // return;
    $.ajax({
      url: 'api/receive',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('add_receive_changed');
        } else if (data.status == 'error') {
          showToast("Please check receive date, greater receive date exists.");
        } else if (data.status == 'e') {
          showToast("Somthing went wrong.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_receive_to_department', function (materials, receive_date, adjusted_by, approve_by, receive_id, remarks) {
    var req = {};

    req.action = 'editReceiveToDepartment';
    req.materials = materials;
    req.receive_date = receive_date;
    req.adjusted_by = adjusted_by;
    req.approve_by = approve_by;
    req.receive_id = receive_id;
    req.remarks = remarks;
    // return;
    $.ajax({
      url: 'api/receive',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('edit_receive_to_department_changed');
        } else if (data.status == 'e') {
          showToast("Somthing went wrong.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_received_items_by_department', function (stock_type_code) {
    var req = {};
    req.action = 'readReceivedItems';
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/receive',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {

          self.trigger('read_received_items_by_department_changed', data.items);
        } else if (data.status == 'e') {
          showToast("some error occured in read_received_items_by_department.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_items_for_receive_edit', function (receive_id) {
    var req = {};
    req.action = 'readItemsForReceiveEdit';
    req.receive_id = receive_id;
    // return;
    $.ajax({
      url: 'api/receive',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {

          self.trigger('read_items_for_receive_edit_changed', data.items, data.details);
        } else if (data.status == 'e') {
          showToast("some error occured in read items for receive edit.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_receive', function (receive_id, receivedItems) {
    var req = {};
    req.action = 'deleteReceive';
    req.receive_id = receive_id;
    // return;
    $.ajax({
      url: 'api/receive',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempItems = receivedItems.filter(function (c) {
            return c.receive_id != receive_id;
          });
          var items = tempItems;
          self.trigger('delete_receive_changed', items);
        } else if (data.status == 'e') {
          showToast("Receive delete error. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('fetch_user_details_from_session_for_receive', function () {
    var req = {};
    req.action = 'fetchUserDetailsFromSessionForIndent';

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          console.log(data);
          self.trigger('fetch_user_details_from_session_for_receive_changed', data.username, data.user_id);
        } else if (data.status == 'e') {
          showToast("User error.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function RejectToPartyReport() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_reject_to_party_date_wise', function (start_date, end_date, stock_type_code) {
    console.log("calling here");
    var req = {};
    req.action = 'readRejectToPartyDateWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/rejecttoparty-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_reject_to_party_date_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_reject_to_party_docket_date_wise', function (start_date, end_date, stock_type_code) {
    console.log("calling here");
    var req = {};
    req.action = 'readRejectToPartyDocketDateWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/rejecttoparty-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_reject_to_party_docket_date_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
  self.on('read_reject_to_party_item_wise', function (start_date, end_date, stock_type_code, selected_item_id) {
    console.log("calling here");
    var req = {};
    req.action = 'readRejectToPartyItemWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/rejecttoparty-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_reject_to_party_item_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_reject_to_party_party_wise', function (start_date, end_date, stock_type_code, selected_party_id) {
    console.log("calling here");
    var req = {};
    req.action = 'readRejectToPartyPartyWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_party_id = selected_party_id;
    // return;
    $.ajax({
      url: 'api/rejecttoparty-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_reject_to_party_party_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function RejectToPartyStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_rejected_docket', function (stock_type_code) {
    var req = {};
    req.action = 'readRejectedDocket';
    req.stock_type_code = stock_type_code;
    //req.end_date=end_date
    // return;
    $.ajax({
      url: 'api/rejecttoparty',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_rejected_docket_changed', data.rejected_dockets);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_docket_to_reject', function (stock_type_code) {
    var req = {};
    req.action = 'readDocketToReject';
    req.stock_type_code = stock_type_code;
    //req.end_date=end_date
    // return;
    $.ajax({
      url: 'api/rejecttoparty',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_docket_to_reject_changed', data.rejected_dockets);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_docket_details_reject_to_party', function (docket_id, stock_type_code) {
    var req = {};
    req.action = 'readDocketDetailsRejectToParty';
    req.docket_id = docket_id;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/rejecttoparty',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_docket_details_reject_to_party_changed', data.details, data.items, data.reject_to_party_no);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_rejected_docket_details', function (docket_id, reject_to_party_id) {
    var req = {};
    req.action = 'readDocketDetails';
    req.docket_id = docket_id;
    req.reject_to_party_id = reject_to_party_id;
    // return;
    $.ajax({
      url: 'api/rejecttoparty',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_rejected_docket_details_changed', data.dockets);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_rejected_docket_edit', function (docket_id, reject_to_party_id) {
    var req = {};
    req.action = 'readRjectedDocketDetailsEdit';
    req.docket_id = docket_id;
    req.reject_to_party_id = reject_to_party_id;
    // return;
    $.ajax({
      url: 'api/rejecttoparty',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_rejected_docket_edit_changed', data.details, data.detailsRP, data.items);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('fetch_user_details_from_session_for_reject_to_party', function () {
    var req = {};
    req.action = 'fetchUserDetailsFromSessionForIndent';

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          console.log(data);
          self.trigger('fetch_user_details_from_session_for_reject_to_party_changed', data.username, data.user_id);
        } else if (data.status == 'e') {
          showToast("User error.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('reject_to_party', function (docket_id, materials, reject_date, rejected_by, dockets, docket_date, transporter_name, lr_no, vehicle_no, mode_of_transport, reject_to_party_stock_type, reject_to_party_no) {
    var req = {};
    req.action = 'rejectToParty';
    req.reject_docket_id = docket_id;
    req.materials = materials;
    req.reject_date = reject_date;
    req.rejected_by = rejected_by;
    req.docket_date = docket_date;
    req.transporter_name = transporter_name;
    req.lr_no = lr_no;
    req.vehicle_no = vehicle_no;
    req.mode_of_transport = mode_of_transport;
    req.reject_to_party_stock_type = reject_to_party_stock_type;
    req.reject_to_party_no = reject_to_party_no;
    // return;
    $.ajax({
      url: 'api/rejecttoparty',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = dockets.filter(function (c) {
            return c.docket_id != docket_id;
          });
          var docket = tempCategories;
          self.trigger('reject_to_party_changed', docket);
        } else if (data.status == 'date_error') {
          //docket_date>reject_date
          var msg = 'docket_date can not be grater than reject_date';
          self.trigger('reject_to_party_date_error', msg);
        } else if (data.status == 'date_error') {
          //docket_date>reject_date
          var msg = 'reject_to_party with older date not allowed for same stock type';
          self.trigger('reject_to_party_date_error', msg);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('reject_to_party_edit', function (docket_id, materials, reject_date, rejected_by, dockets, docket_date, transporter_name, lr_no, vehicle_no, mode_of_transport, reject_to_party_stock_type, reject_to_party_no, reject_to_party_id) {
    var req = {};
    req.action = 'rejectToPartyEdit';
    req.reject_docket_id = docket_id;
    req.materials = materials;
    req.reject_date = reject_date;
    req.rejected_by = rejected_by;
    req.docket_date = docket_date;
    req.transporter_name = transporter_name;
    req.lr_no = lr_no;
    req.vehicle_no = vehicle_no;
    req.mode_of_transport = mode_of_transport;
    req.reject_to_party_stock_type = reject_to_party_stock_type;
    req.reject_to_party_no = reject_to_party_no;
    req.reject_to_party_id = reject_to_party_id;
    // return;
    $.ajax({
      url: 'api/rejecttoparty',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('reject_to_party_edit_changed');
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_reject_to_party', function (reject_to_party_id, rejectedDockets) {
    var req = {};
    req.action = 'deleteRejectToParty';
    req.reject_to_party_id = reject_to_party_id;
    // return;
    $.ajax({
      url: 'api/rejecttoparty',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempItems = rejectedDockets.filter(function (c) {
            return c.reject_to_party_id != reject_to_party_id;
          });
          var items = tempItems;
          self.trigger('delete_reject_to_party_changed', items);
        } else if (data.status == 'e') {
          showToast("Issue delete error. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function ReturnToStockReport() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_return_to_stock_date_wise', function (start_date, end_date, stock_type_code) {
    console.log("calling here");
    var req = {};
    req.action = 'readReturnToStockDateWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/returntostock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_return_to_stock_date_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_return_to_stock_item_wise', function (start_date, end_date, stock_type_code, selected_item_id) {
    console.log("calling here");
    var req = {};
    req.action = 'readReturnToStockItemWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/returntostock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_return_to_stock_item_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_return_to_stock_dept_wise', function (start_date, end_date, stock_type_code, selected_department_id) {
    console.log("calling here");
    var req = {};
    req.action = 'readReturnToStockDepartmentWise';
    req.start_date = start_date;
    req.end_date = end_date;
    req.stock_type_code = stock_type_code;
    req.selected_department_id = selected_department_id;
    // return;
    $.ajax({
      url: 'api/returntostock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_return_to_stock_dept_wise_changed', data.mainArray);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function ReturnToStockStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_issued_items_to_stock_type_code', function (stock_type_code) {
    var req = {};
    req.action = 'readIssuedItems';
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/returntostock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_issued_items_to_stock_type_code_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_issued_items_to_stock', function (stock_type_code) {
    var req = {};
    req.action = 'readReturnedItems';
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/returntostock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_issued_items_to_stock_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_issued_material_for_return', function (issue_id, stock_type_code) {
    var req = {};
    req.action = 'readIssuedItemsForReturn';
    req.issue_id = issue_id;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/returntostock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_issued_material_for_return_changed', data.items, data.return_to_stock_no);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_return_to_stock_edit', function (return_to_stock_id, issue_id) {
    var req = {};
    req.action = 'readReturnToStockEdit';
    req.return_to_stock_id = return_to_stock_id;
    req.issue_id = issue_id;
    // return;
    $.ajax({
      url: 'api/returntostock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_return_to_stock_edit_changed', data.items, data.details);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_return_to_stock', function (return_to_stock_id, returnedItems) {
    var req = {};
    req.action = 'deleteReturnToStock';
    req.return_to_stock_id = return_to_stock_id;
    // return;
    $.ajax({
      url: 'api/returntostock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempItems = returnedItems.filter(function (c) {
            return c.return_to_stock_id != return_to_stock_id;
          });
          var items = tempItems;
          self.trigger('delete_return_to_stock_changed', items);
        } else if (data.status == 'e') {
          showToast("Issue delete error. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_view_return_to_stock', function (return_to_stock_id) {
    var req = {};
    req.action = 'readReturnToStockView';
    req.return_to_stock_id = return_to_stock_id;
    // return;
    $.ajax({
      url: 'api/returntostock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_view_return_to_stock_changed', data.items, data.details);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('return_to_stock', function (issue_id, transaction_id, materials, return_date, return_by, stock_type_code, return_to_stock_no) {
    var req = {};
    req.action = 'returnToStock';
    req.issue_id = issue_id;
    req.transaction_id = transaction_id;
    req.materials = materials;
    req.return_date = return_date;
    req.return_by = return_by;
    //req.department_id = department_id
    req.stock_type_code = stock_type_code;
    req.return_to_stock_no = return_to_stock_no;
    // return;
    $.ajax({
      url: 'api/returntostock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('return_to_stock_changed');
        } else if (data.status == 'error') {
          self.trigger('return_to_stock_changed_error');
        } else if (data.status == 'e') {
          showToast("Some error occured. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('return_to_stock_edit', function (issue_id, transaction_id, materials, return_date, return_by, stock_type_code, return_to_stock_id) {
    var req = {};
    req.action = 'returnToStockEdit';
    req.issue_id = issue_id;
    req.transaction_id = transaction_id;
    req.materials = materials;
    req.return_date = return_date;
    req.return_by = return_by;
    //req.department_id = department_id
    req.stock_type_code = stock_type_code;
    req.return_to_stock_id = return_to_stock_id;
    // return;
    $.ajax({
      url: 'api/returntostock',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('return_to_stock_edit_changed');
        } else if (data.status == 'e') {
          showToast("Some error occured. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('fetch_user_details_from_session_for_return_to_stock', function () {
    var req = {};
    req.action = 'fetchUserDetailsFromSessionForIndent';

    $.ajax({
      url: 'api/indent',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          console.log(data);
          self.trigger('fetch_user_details_from_session_for_return_to_stock_changed', data.username, data.user_id);
        } else if (data.status == 'e') {
          showToast("User error.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function StockLedgerStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.stockLedgers = [];

  self.on('read_stockLedgers', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/ledger',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.stockLedgers = data.stockLedgers;
          self.trigger('stockLedgers_changed', self.stockLedgers);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_ledger', function (ledger_id) {
    var req = {};
    req.action = 'delete';
    req.ledger_id = ledger_id;
    // return;
    $.ajax({
      url: 'api/ledger',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.stockLedgers.filter(function (c) {
            return c.ledger_id != ledger_id;
          });
          self.stockLedgers = tempCategories;
          self.trigger('stockLedgers_changed', self.stockLedgers);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_ledger', function (ledger_id, ledger_code, ledger) {
    var req = {};
    req.action = 'edit';
    req.ledger_id = ledger_id;
    req.ledger_code = ledger_code;
    req.ledger = ledger;
    // return;
    $.ajax({
      url: 'api/ledger',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.stockLedgers = self.stockLedgers.map(function (c) {
            if (c.ledger_id == ledger_id) {
              c.ledger_code = ledger_code;
              c.ledger = ledger;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('stockLedgers_changed', self.stockLedgers);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_ledger', function (ledger_code, ledger) {
    var req = {};
    req.action = 'add';
    req.ledger_code = ledger_code;
    req.ledger = ledger;
    // return;
    $.ajax({
      url: 'api/ledger',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.ledger_id = data.ledger_id;
          cat.ledger_code = ledger_code;
          cat.ledger = ledger;
          self.stockLedgers = [cat].concat(self.stockLedgers);
          self.trigger('stockLedgers_changed', self.stockLedgers);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function StockReportStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_stock_wise_date', function (item_group_code, stock_type_code, transaction_date) {
    var req = {};
    req.action = 'readStockDateWise';
    req.transaction_date = transaction_date;
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/stock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_stock_wise_date_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Some Error Occured. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_stock_movement_register_item_wise', function (sd, ed, stock_type_code, selected_item_id) {
    console.log("calling read_stock_movement_register_item_wise");
    var req = {};
    req.action = 'readStockMovementRegisterItemWise';
    req.sd = sd;
    req.ed = ed;
    req.stock_type_code = stock_type_code;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/stock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_stock_movement_register_item_wise_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_stock_valution_summry_store_type_wise', function (ed, stock_type_code, selected_item_id) {
    console.log("calling read_stock_valution_summry_store_type_wise");
    var req = {};
    req.action = 'readStockValuationSummryStoreTypeWise';
    req.ed = ed;
    req.stock_type_code = stock_type_code;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/stock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          console.log('data.items');
          console.log(data.items);
          self.trigger('read_stock_valution_summry_store_type_wise_changed', data.items, data.total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_stock_ledger_avg_valuation_in_details', function (sd, ed, stock_type_code, selected_item_id) {
    console.log("calling read_stock_ledger_avg_valuation_in_details");
    var req = {};
    req.action = 'readStockLedgerAvgValuationDetails';
    req.sd = sd;
    req.ed = ed;
    req.stock_type_code = stock_type_code;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/stock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_stock_ledger_avg_valuation_in_details_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_stock_ledger_avg_valuation_in_summry', function (sd, ed, stock_type_code, selected_item_id) {
    console.log("calling read_stock_ledger_avg_valuation_in_summry");
    var req = {};
    req.action = 'readStockLedgerAvgValuationSummry';
    req.sd = sd;
    req.ed = ed;
    req.stock_type_code = stock_type_code;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/stock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          self.trigger('read_stock_ledger_avg_valuation_in_summry_changed', data.items, data.total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_stock_valution_summry_location_wise', function (ed, location, selected_item_id) {
    console.log("calling read_stock_valution_summry_location_wise");
    var req = {};
    req.action = 'readStockValuationSummryLocationWise';
    req.ed = ed;
    req.location = location;
    req.selected_item_id = selected_item_id;
    // return;
    $.ajax({
      url: 'api/stock-report',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        console.log("calling here1");
        if (data.status == 's') {
          console.log('data.items');
          console.log(data.items);
          self.trigger('read_stock_valution_summry_location_wise_changed', data.items, data.total);
        } else if (data.status == 'e') {
          showToast("Somthing went wrong", data);
          self.loading = false;
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_locations_for_stock_ledger', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/location',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.locations = data.locations;
          self.trigger('locations_for_stock_ledger_changed', self.locations);
        } else if (data.status == 'e') {
          showToast("Location Read Error. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function StockStatementStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_items_for_stock_statement', function (item_group_code, stock_type_code) {
    var req = {};
    req.action = 'readItemsForIndent';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/stock-summery',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_items_for_stock_statement_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('search_items_for_stock_statement', function (search_term, stock_type_code) {
    console.log('calling me');
    var req = {};
    req.action = 'search_items';
    req.search_term = search_term;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/stock-summery',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_items_for_stock_statement_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Material not found.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_stock_statement', function (item_id) {
    var req = {};
    req.action = 'readStockStatement';
    req.item_id = item_id;
    // return;
    $.ajax({
      url: 'api/stock-statement',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_stock_statement_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Some Error occured. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  /******************************************Pending PO*************************************************/
  self.on('read_pending_po', function (stock_type_code) {
    var req = {};
    req.action = 'readPendingPO';
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/stock-statement',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_pending_po_changed', data.purchaseOrders);
        } else if (data.status == 'e') {
          showToast("Some Error occured. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
  /******************************************Pending PO enf*************************************************/
}
'use strict';

function StockSummaryStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.on('read_stock_summary', function (item_group_code, category_code, stock_type_code) {
    var req = {};
    req.action = 'readStockSummary';
    req.item_group_code = item_group_code;
    req.category_code = category_code;
    req.stock_type_code = stock_type_code;
    // return;
    $.ajax({
      url: 'api/stock-summery',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_stock_summary_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  /******************************************Stock in hand*************************************************/
  self.on('read_items_for_stock_in_hand', function (item_group_code, stock_type_code) {
    var req = {};
    req.action = 'readItemsForIndent';
    req.item_group_code = item_group_code;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/stock-summery',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_items_for_stock_in_hand_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('search_items_for_stock_in_hand', function (search_term, stock_type_code) {
    console.log('calling me');
    var req = {};
    req.action = 'search_items';
    req.search_term = search_term;
    req.stock_type_code = stock_type_code;

    $.ajax({
      url: 'api/stock-summery',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('read_items_for_stock_in_hand_changed', data.items);
        } else if (data.status == 'e') {
          showToast("Material not found.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
  /******************************************Stock in hand end *************************************************/
}
'use strict';

function StockTypeStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.stock_types = [];

  self.on('read_stock_types', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/stock-type',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.stock_types = data.stock_types;
          self.trigger('stock_types_changed', self.stock_types);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_stock_type', function (stock_type_id) {
    var req = {};
    req.action = 'delete';
    req.stock_type_id = stock_type_id;
    // return;
    $.ajax({
      url: 'api/stock-type',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.stock_types.filter(function (c) {
            return c.stock_type_id != stock_type_id;
          });
          self.stock_types = tempCategories;
          self.trigger('stock_types_changed', self.stock_types);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_stock_type', function (stock_type_id, stock_type_code, stock_type) {
    var req = {};
    req.action = 'edit';
    req.stock_type_id = stock_type_id;
    req.stock_type_code = stock_type_code;
    req.stock_type = stock_type;
    // return;
    $.ajax({
      url: 'api/stock-type',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.stock_types = self.stock_types.map(function (c) {
            if (c.stock_type_id == stock_type_id) {
              c.stock_type_code = stock_type_code;
              c.stock_type = stock_type;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('stock_types_changed', self.stock_types);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_stock_type', function (stock_type_code, stock_type) {
    var req = {};
    req.action = 'add';
    req.stock_type_code = stock_type_code;
    req.stock_type = stock_type;
    // return;
    $.ajax({
      url: 'api/stock-type',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.stock_type_id = data.stock_type_id;
          cat.stock_type_code = stock_type_code;
          cat.stock_type = stock_type;
          self.stock_types = [cat].concat(self.stock_types);
          self.trigger('stock_types_changed', self.stock_types);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('read_stock_type_details', function () {
    var req = {};
    req.action = 'readStockTypeDetails';
    // return;
    $.ajax({
      url: 'api/stock-type',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.trigger('stock_types_details_changed', data.stock_types);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function TaxStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.taxes = [];

  self.on('read_taxes', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/tax',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.taxes = data.taxes;
          self.trigger('taxes_changed', self.taxes);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_tax', function (tax_id) {
    var req = {};
    req.action = 'delete';
    req.tax_id = tax_id;
    // return;
    $.ajax({
      url: 'api/tax',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.taxes.filter(function (c) {
            return c.tax_id != tax_id;
          });
          self.taxes = tempCategories;
          self.trigger('taxes_changed', self.taxes);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_tax', function (tax_id, tax, tax_type, tax_rate, tax_group) {
    var req = {};
    req.action = 'edit';
    req.tax_id = tax_id;
    req.tax = tax;
    req.tax_type = tax_type;
    req.tax_rate = tax_rate;
    req.tax_group = tax_group;
    // return;
    $.ajax({
      url: 'api/tax',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.taxes = self.taxes.map(function (c) {
            if (c.tax_id == tax_id) {
              c.tax = tax;
              c.tax_type = tax_type;
              c.tax_rate = tax_rate;
              c.tax_group = tax_group;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('taxes_changed', self.taxes);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_tax', function (tax, tax_type, tax_rate, tax_group) {
    var req = {};
    req.action = 'add';
    req.tax = tax;
    req.tax_type = tax_type;
    req.tax_rate = tax_rate;
    req.tax_group = tax_group;
    // return;
    $.ajax({
      url: 'api/tax',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.tax_id = data.tax_id;
          cat.tax = tax;
          cat.tax_type = tax_type;
          cat.tax_rate = tax_rate;
          cat.tax_group = tax_group;
          self.taxes = [cat].concat(self.taxes);
          self.trigger('taxes_changed', self.taxes);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
'use strict';

function UomStore() {
  riot.observable(this); // Riot provides our event emitter.
  var self = this;

  self.uoms = [];

  self.on('read_uoms', function () {
    var req = {};
    req.action = 'read';
    // return;
    $.ajax({
      url: 'api/uom',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.uoms = data.uoms;
          self.trigger('uoms_changed', self.uoms);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('delete_uom', function (uom_id) {
    var req = {};
    req.action = 'delete';
    req.uom_id = uom_id;
    // return;
    $.ajax({
      url: 'api/uom',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var tempCategories = self.uoms.filter(function (c) {
            return c.uom_id != uom_id;
          });
          self.uoms = tempCategories;
          self.trigger('uoms_changed', self.uoms);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('edit_uom', function (uom_id, uom_code, uom) {
    var req = {};
    req.action = 'edit';
    req.uom_id = uom_id;
    req.uom_code = uom_code;
    req.uom = uom;
    // return;
    $.ajax({
      url: 'api/uom',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          self.uoms = self.uoms.map(function (c) {
            if (c.uom_id == uom_id) {
              c.uom_code = uom_code;
              c.uom = uom;
            }
            c.confirmEdit = false;
            return c;
          });
          self.trigger('uoms_changed', self.uoms);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });

  self.on('add_uom', function (uom_code, uom) {
    var req = {};
    req.action = 'add';
    req.uom_code = uom_code;
    req.uom = uom;
    // return;
    $.ajax({
      url: 'api/uom',
      type: "POST",
      data: JSON.stringify(req),
      contentType: "application/json",
      dataType: "json",
      success: function success(data) {
        if (data.status == 's') {
          var cat = {};
          cat.uom_id = data.uom_id;
          cat.uom_code = uom_code;
          cat.uom = uom;
          self.uoms = [cat].concat(self.uoms);
          self.trigger('uoms_changed', self.uoms);
        } else if (data.status == 'e') {
          showToast("Invalid Username or password. Please try again.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });
}
