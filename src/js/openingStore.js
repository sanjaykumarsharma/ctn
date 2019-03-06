function OpeningStockStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_items_for_opening_stock', function(item_group_code,stock_type_code) {
    let req = {}
    req.action = 'readItems'
    req.item_group_code = item_group_code
    req.stock_type_code = stock_type_code
    // return;
    $.ajax({
      url:'api/openingstock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.items = data.items
            self.trigger('read_items_for_opening_stock_changed', self.items)
          }else if(data.status == 'e'){
            showToast("Failed to add opening stock. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('search_items_for_opening_stock', function(search_term,stock_type_code) {
    let req = {}
    req.action = 'searchItemsForOpeningStock'
    req.search_term = search_term
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/openingstock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('search_items_for_opening_stock_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Material not found.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })


  self.on('search_items_of_opening_stock', function(search_term,stock_type_code) {
    let req = {}
    req.action = 'searchItemsOfOpeningStock'
    req.search_term = search_term
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/openingstock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('search_items_of_opening_stock_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Material not found.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

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


  self.on('add_opening_stock', function(selectedMaterialsArray, obj) {
    let req = {}
    req.action = 'addOpeningStock'
    req.materials = selectedMaterialsArray
    req.opening_stock_date = obj.opening_stock_date
    // return;
    $.ajax({
      url:'api/openingstock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('add_opening_stock_changed')
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_opening_stock', function(selectedMaterialsArray, obj) {
    let req = {}
    req.action = 'editOpeningStock'
    req.materials = selectedMaterialsArray
    req.opening_stock_date = obj.opening_stock_date
    // return;
    $.ajax({
      url:'api/openingstock',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('edit_opening_stock_changed')
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
