function DocketReportStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_docket_register_date_wise', function(start_date,end_date,stock_type_code) {
    console.log("calling here")
    let req = {}
    req.action = 'readDocketRegisterDateWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/docket-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_docket_register_date_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total)
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

  self.on('read_docket_report', function(start_date,end_date,stock_type_code) {
    console.log("calling here")
    let req = {}
    req.action = 'readDocketReport'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/docket-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_docket_report_changed', data.mainArray)
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

  self.on('read_docket_register_party_wise', function(start_date,end_date,party_id) {
    console.log("calling here")
    let req = {}
    req.action = 'readDocketRegisterPartyWise'
    req.start_date=start_date
    req.end_date=end_date
    req.party_id=party_id
    // return;
    $.ajax({
      url:'api/docket-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_docket_register_party_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total)
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

  self.on('read_docket_register_item_wise', function(start_date,end_date,stock_type_code,selected_item_id) {
    console.log("calling here")
    let req = {}
    req.action = 'readDocketRegisterItemWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_item_id=selected_item_id
    // return;
    $.ajax({
      url:'api/docket-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_docket_register_item_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total)
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

  self.on('read_items_filter', function() {
    let req = {}
    req.action = 'read_items_filter'
    // return;
    $.ajax({
      url:'api/item',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('items_filter_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Failed to read items. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
