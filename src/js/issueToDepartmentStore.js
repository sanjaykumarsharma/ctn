function IssueToDepartmentStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this



self.on('read_items_for_issue_to_department', function(item_group_code,stock_type_code) {
    let req = {}
    req.action = 'read'
    req.item_group_code = item_group_code
    req.stock_type_code = stock_type_code
    // return;
    $.ajax({
      url:'api/item',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.items = data.items
            self.trigger('read_items_for_issue_to_department_changed', self.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_view', function(issue_id) {
    let req = {}
    req.action = 'readView'
    req.issue_id = issue_id
    // return;
    $.ajax({
      url:'api/issuetodepartment',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_view_changed', data.details,data.items)
          }else if(data.status == 'e'){
            showToast("some error occured while reading view.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_issue_number_by_stock_type', function(stock_type_code) {
    let req = {}
    req.action = 'readIssueNumber'
    req.stock_type_code = stock_type_code
    // return;
    $.ajax({
      url:'api/issuetodepartment',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_issue_number_by_stock_type_changed', data.issue_no)
          }else if(data.status == 'e'){
            showToast("some error occured while reading issue no.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('search_items', function(search_term,stock_type_code) {
    let req = {}
    req.action = 'search_items'
    req.search_term = search_term
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('search_items_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Material not found.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

 self.on('add_issue_to_department', function(materials,issue_date,department_id,approve_by,receive_by,issue_no,stock_type_code,requisition_no,stock_adjustment,remarks) {
    let req = {}

    req.action = 'addIssueToDepartment'
    req.materials = materials
    req.issue_date = issue_date
    req.department_id = department_id
    req.approve_by = approve_by
    req.receive_by = receive_by
    req.issue_no = issue_no
    req.stock_type_code = stock_type_code
    req.requisition_no = requisition_no
    req.stock_adjustment = stock_adjustment
    req.remarks = remarks
    // return;
    $.ajax({
      url:'api/issuetodepartment',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('add_issue_to_department_changed')
          }else if(data.status == 'error'){
            showToast("Please check issue date, greater issue date exists.")
          }else if(data.status == 'e'){
            showToast("Somthing went wrong.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

 self.on('edit_issue_to_department', function(materials,issue_date,department_id,approve_by,receive_by,issue_id,requisition_no,stock_adjustment,remarks,newMaterials) {
    let req = {}

    req.action = 'editIssueToDepartment'
    req.materials = materials
    req.issue_date = issue_date
    req.department_id = department_id
    req.approve_by = approve_by
    req.receive_by = receive_by
    req.issue_id = issue_id
    req.requisition_no = requisition_no
    req.stock_adjustment = stock_adjustment
    req.remarks = remarks
    req.new_materials = newMaterials
    // return;
    $.ajax({
      url:'api/issuetodepartment',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('edit_issue_to_department_changed')
          }else if(data.status == 'e'){
            showToast("Somthing went wrong.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
  
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
          
          self.trigger('read_items_for_issue_edit_changed', data.items,data.details);
        } else if (data.status == 'e') {
          showToast("some error occured in read items for issue edit.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });


  self.on('delete_issue', function(issue_id,issuedItems) {
    let req = {}
    req.action = 'deleteIssue'
    req.issue_id = issue_id
    // return;
    $.ajax({
      url:'api/issuetodepartment',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempItems = issuedItems.filter(c => {
              return c.issue_id != issue_id
            })
            let  items = tempItems
            self.trigger('delete_issue_changed', items)
          }else if(data.status == 'e'){
            showToast("Issue delete error. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('fetch_user_details_from_session_for_issue_to_department', function() {
    let req = {}
    req.action = 'fetchUserDetailsFromSessionForIndent'

    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            console.log(data)
            self.trigger('fetch_user_details_from_session_for_issue_to_department_changed', data.username,data.user_id)
          }else if(data.status == 'e'){
            showToast("User error.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
