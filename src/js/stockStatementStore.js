function StockStatementStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_items_for_stock_statement', function(item_group_code,stock_type_code) {
    let req = {}
    req.action = 'readItemsForIndent'
    req.item_group_code = item_group_code
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/stock-summery',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_items_for_stock_statement_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('search_items_for_stock_statement', function(search_term,stock_type_code) {
    console.log('calling me')
    let req = {}
    req.action = 'search_items'
    req.search_term = search_term
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/stock-summery',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_items_for_stock_statement_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Material not found.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_stock_statement', function(item_id) {
    let req = {}
    req.action = 'readStockStatement'
    req.item_id = item_id
    // return;
    $.ajax({
      url:'api/stock-statement',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_stock_statement_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Some Error occured. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })



  
  /******************************************Pending PO*************************************************/
   self.on('read_pending_po', function(stock_type_code) {
    let req = {}
    req.action = 'readPendingPO'
    req.stock_type_code = stock_type_code
    // return;
    $.ajax({
      url:'api/stock-statement',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_pending_po_changed', data.purchaseOrders)
          }else if(data.status == 'e'){
            showToast("Some Error occured. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
  /******************************************Pending PO enf*************************************************/
}
