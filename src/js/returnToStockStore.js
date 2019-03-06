function ReturnToStockStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this
 
  self.on('read_issued_items_to_stock_type_code', function(stock_type_code) {
    let req = {}
    req.action = 'readIssuedItems'
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/returntostock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_issued_items_to_stock_type_code_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_issued_items_to_stock', function(stock_type_code) {
    let req = {}
    req.action = 'readReturnedItems'
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/returntostock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_issued_items_to_stock_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_issued_material_for_return', function(issue_id,stock_type_code) {
    let req = {}
    req.action = 'readIssuedItemsForReturn'
    req.issue_id=issue_id
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/returntostock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_issued_material_for_return_changed', data.items,data.return_to_stock_no)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_return_to_stock_edit', function(return_to_stock_id,issue_id) {
    let req = {}
    req.action = 'readReturnToStockEdit'
    req.return_to_stock_id=return_to_stock_id
    req.issue_id=issue_id
    // return;
    $.ajax({
      url:'api/returntostock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_return_to_stock_edit_changed', data.items,data.details)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_return_to_stock', function(return_to_stock_id,returnedItems) {
    let req = {}
    req.action = 'deleteReturnToStock'
    req.return_to_stock_id = return_to_stock_id
    // return;
    $.ajax({
      url:'api/returntostock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempItems = returnedItems.filter(c => {
              return c.return_to_stock_id != return_to_stock_id
            })
            let  items = tempItems
            self.trigger('delete_return_to_stock_changed', items)
          }else if(data.status == 'e'){
            showToast("Issue delete error. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_view_return_to_stock', function(return_to_stock_id) {
    let req = {}
    req.action = 'readReturnToStockView'
    req.return_to_stock_id=return_to_stock_id
    // return;
    $.ajax({
      url:'api/returntostock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_view_return_to_stock_changed', data.items,data.details)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('return_to_stock', function(issue_id,transaction_id,materials,return_date,return_by,stock_type_code,return_to_stock_no) {
    let req = {}
    req.action = 'returnToStock'
    req.issue_id = issue_id
    req.transaction_id = transaction_id
    req.materials = materials
    req.return_date = return_date
    req.return_by = return_by
    //req.department_id = department_id
    req.stock_type_code = stock_type_code
    req.return_to_stock_no = return_to_stock_no
    // return;
    $.ajax({
      url:'api/returntostock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('return_to_stock_changed')
          }else if(data.status == 'error'){
            self.trigger('return_to_stock_changed_error')
          }else if(data.status == 'e'){
            showToast("Some error occured. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('return_to_stock_edit', function(issue_id,transaction_id,materials,return_date,return_by,stock_type_code,return_to_stock_id) {
    let req = {}
    req.action = 'returnToStockEdit'
    req.issue_id = issue_id
    req.transaction_id = transaction_id
    req.materials = materials
    req.return_date = return_date
    req.return_by = return_by
    //req.department_id = department_id
    req.stock_type_code = stock_type_code
    req.return_to_stock_id = return_to_stock_id
    // return;
    $.ajax({
      url:'api/returntostock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('return_to_stock_edit_changed')
          }else if(data.status == 'e'){
            showToast("Some error occured. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('fetch_user_details_from_session_for_return_to_stock', function() {
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
            self.trigger('fetch_user_details_from_session_for_return_to_stock_changed', data.username,data.user_id)
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