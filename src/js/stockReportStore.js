function StockReportStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_stock_wise_date', function (item_group_code, stock_type_code,transaction_date) {
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

  self.on('read_stock_movement_register_item_wise', function(sd,ed,stock_type_code,selected_item_id) {
    console.log("calling read_stock_movement_register_item_wise")
    let req = {}
    req.action = 'readStockMovementRegisterItemWise'
    req.sd = sd
    req.ed = ed
    req.stock_type_code = stock_type_code
    req.selected_item_id = selected_item_id
    // return;
    $.ajax({
      url: 'api/stock-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_stock_movement_register_item_wise_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      });
  });

  self.on('read_stock_valution_summry_store_type_wise', function(ed,stock_type_code,selected_item_id) {
    console.log("calling read_stock_valution_summry_store_type_wise")
    let req = {}
    req.action = 'readStockValuationSummryStoreTypeWise'
    req.ed = ed
    req.stock_type_code = stock_type_code
    req.selected_item_id = selected_item_id
    // return;
    $.ajax({
      url: 'api/stock-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            console.log('data.items')
            console.log(data.items)
            self.trigger('read_stock_valution_summry_store_type_wise_changed', data.items, data.total)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      });
  });

 self.on('read_stock_ledger_avg_valuation_in_details', function(sd,ed,stock_type_code,selected_item_id) {
    console.log("calling read_stock_ledger_avg_valuation_in_details")
    let req = {}
    req.action = 'readStockLedgerAvgValuationDetails'
    req.sd = sd
    req.ed = ed
    req.stock_type_code = stock_type_code
    req.selected_item_id = selected_item_id
    // return;
    $.ajax({
      url: 'api/stock-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_stock_ledger_avg_valuation_in_details_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      });
  });

 self.on('read_stock_ledger_avg_valuation_in_summry', function(sd,ed,stock_type_code,selected_item_id) {
    console.log("calling read_stock_ledger_avg_valuation_in_summry")
    let req = {}
    req.action = 'readStockLedgerAvgValuationSummry'
    req.sd = sd
    req.ed = ed
    req.stock_type_code = stock_type_code
    req.selected_item_id = selected_item_id
    // return;
    $.ajax({
      url: 'api/stock-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_stock_ledger_avg_valuation_in_summry_changed', data.items, data.total)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      });
  });


  self.on('read_stock_valution_summry_location_wise', function(ed,location,selected_item_id) {
    console.log("calling read_stock_valution_summry_location_wise")
    let req = {}
    req.action = 'readStockValuationSummryLocationWise'
    req.ed = ed
    req.location = location
    req.selected_item_id = selected_item_id
    // return;
    $.ajax({
      url: 'api/stock-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            console.log('data.items')
            console.log(data.items)
            self.trigger('read_stock_valution_summry_location_wise_changed', data.items, data.total)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      });
  });

  self.on('read_locations_for_stock_ledger', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/location',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.locations = data.locations
            self.trigger('locations_for_stock_ledger_changed', self.locations)
          }else if(data.status == 'e'){
            showToast("Location Read Error. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
