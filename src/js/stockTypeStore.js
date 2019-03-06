function StockTypeStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.stock_types = []

  self.on('read_stock_types', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/stock-type',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.stock_types = data.stock_types
            self.trigger('stock_types_changed', self.stock_types)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_stock_type', function(stock_type_id) {
    let req = {}
    req.action = 'delete'
    req.stock_type_id = stock_type_id
    // return;
    $.ajax({
      url:'api/stock-type',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.stock_types.filter(c => {
              return c.stock_type_id != stock_type_id
            })
            self.stock_types = tempCategories
            self.trigger('stock_types_changed', self.stock_types)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_stock_type', function(stock_type_id, stock_type_code, stock_type) {
    let req = {}
    req.action = 'edit'
    req.stock_type_id = stock_type_id
    req.stock_type_code = stock_type_code
    req.stock_type = stock_type
    // return;
    $.ajax({
      url:'api/stock-type',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.stock_types = self.stock_types.map(c => {
              if(c.stock_type_id == stock_type_id){
                c.stock_type_code = stock_type_code
                c.stock_type = stock_type
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('stock_types_changed', self.stock_types)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_stock_type', function(stock_type_code,stock_type) {
    let req = {}
    req.action = 'add'
    req.stock_type_code = stock_type_code
    req.stock_type = stock_type
    // return;
    $.ajax({
      url:'api/stock-type',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.stock_type_id = data.stock_type_id
            cat.stock_type_code = stock_type_code
            cat.stock_type = stock_type
            self.stock_types = [cat, ...self.stock_types]
            self.trigger('stock_types_changed', self.stock_types)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })


  self.on('read_stock_type_details', function() {
    let req = {}
    req.action = 'readStockTypeDetails'
    // return;
    $.ajax({
      url:'api/stock-type',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('stock_types_details_changed', data.stock_types)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
