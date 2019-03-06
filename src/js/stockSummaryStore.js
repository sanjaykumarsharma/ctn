function StockSummaryStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_stock_summary', function(item_group_code,category_code,stock_type_code) {
    let req = {}
    req.action = 'readStockSummary'
    req.item_group_code = item_group_code
    req.category_code = category_code
    req.stock_type_code = stock_type_code
    // return;
    $.ajax({
      url:'api/stock-summery',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_stock_summary_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

    /******************************************Stock in hand*************************************************/
  self.on('read_items_for_stock_in_hand', function(item_group_code,stock_type_code) {
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
            self.trigger('read_items_for_stock_in_hand_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('search_items_for_stock_in_hand', function(search_term,stock_type_code) {
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
            self.trigger('read_items_for_stock_in_hand_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Material not found.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
  /******************************************Stock in hand end *************************************************/

}
