function ReceiveStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this



self.on('read_items_for_receive', function(item_group_code,stock_type_code) {
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
            self.trigger('read_items_for_receive_changed', self.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_receive_view', function(receive_id) {
    let req = {}
    req.action = 'readView'
    req.receive_id = receive_id
    // return;
    $.ajax({
      url:'api/receive',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_receive_view_changed', data.details,data.items)
          }else if(data.status == 'e'){
            showToast("some error occured while reading view.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_receive_number_by_stock_type', function(stock_type_code) {
    let req = {}
    req.action = 'readReceiveNumber'
    req.stock_type_code = stock_type_code
    // return;
    $.ajax({
      url:'api/receive',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_receive_number_by_stock_type_changed', data.receive_no)
          }else if(data.status == 'e'){
            showToast("some error occured while reading receive no.", data)
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

 self.on('add_receive', function(materials,receive_date,adjusted_by,approve_by,receive_no,stock_type_code,remarks) {
    let req = {}

    req.action = 'addReceive'
    req.materials = materials
    req.receive_date = receive_date
    req.approve_by = approve_by
    req.adjusted_by = adjusted_by
    req.receive_no = receive_no
    req.stock_type_code = stock_type_code
    req.remarks = remarks
    // return;
    $.ajax({
      url:'api/receive',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('add_receive_changed')
          }else if(data.status == 'error'){
            showToast("Please check receive date, greater receive date exists.")
          }else if(data.status == 'e'){
            showToast("Somthing went wrong.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

 self.on('edit_receive_to_department', function(materials,receive_date,adjusted_by,approve_by,receive_id,remarks) {
    let req = {}

    req.action = 'editReceiveToDepartment'
    req.materials = materials
    req.receive_date = receive_date
    req.adjusted_by = adjusted_by
    req.approve_by = approve_by
    req.receive_id = receive_id
    req.remarks = remarks
    // return;
    $.ajax({
      url:'api/receive',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('edit_receive_to_department_changed')
          }else if(data.status == 'e'){
            showToast("Somthing went wrong.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
  
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
          
          self.trigger('read_items_for_receive_edit_changed', data.items,data.details);
        } else if (data.status == 'e') {
          showToast("some error occured in read items for receive edit.", data);
        }
      },
      error: function error(data) {
        showToast("", data);
      }
    });
  });


  self.on('delete_receive', function(receive_id,receivedItems) {
    let req = {}
    req.action = 'deleteReceive'
    req.receive_id = receive_id
    // return;
    $.ajax({
      url:'api/receive',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempItems = receivedItems.filter(c => {
              return c.receive_id != receive_id
            })
            let  items = tempItems
            self.trigger('delete_receive_changed', items)
          }else if(data.status == 'e'){
            showToast("Receive delete error. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('fetch_user_details_from_session_for_receive', function() {
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
            self.trigger('fetch_user_details_from_session_for_receive_changed', data.username,data.user_id)
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
