function POReport() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_po_date_wise', function(start_date,end_date,status) {
    console.log("calling here")
    let req = {}
    req.action = 'readPODateWise'
    req.start_date=start_date
    req.end_date=end_date
    req.status=status
    // return;
    $.ajax({
      url:'api/po-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_po_date_wise_changed', data.mainArray)
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

  self.on('read_po_report', function(start_date,end_date,status,selected_party_id,selectedStockTypeString) {
    console.log("calling here")
    let req = {}
    req.action = 'readPOReport'
    req.start_date=start_date
    req.end_date=end_date
    req.status=status
    req.party_id=selected_party_id
    req.stock_type_code=selectedStockTypeString
    // return;
    $.ajax({
      url:'api/po-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_po_report_changed', data)
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

  self.on('read_po_party_wise', function(start_date,end_date,party_id) {
    console.log("calling here")
    let req = {}
    req.action = 'readPOPartyWise'
    req.start_date=start_date
    req.end_date=end_date
    req.party_id=party_id
    // return;
    $.ajax({
      url:'api/po-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_po_party_wise_changed', data.mainArray)
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


  self.on('read_po_item_wise', function(start_date,end_date,status) {
    console.log("calling here")
    let req = {}
    req.action = 'readPOItemWise'
    req.start_date=start_date
    req.end_date=end_date
    req.status=status
    // return;
    $.ajax({
      url:'api/po-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_po_item_wise_changed', data.mainArray)
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

  self.on('read_po_report_supplied_materials', function(start_date,end_date,party_id,selectedStockTypeString) {
    console.log("calling here")
    let req = {}
    req.action = 'readPOSuppliedMaterial'
    req.start_date=start_date
    req.end_date=end_date
    req.party_id=party_id
    req.stock_type_code=selectedStockTypeString
    // return;
    $.ajax({
      url:'api/po-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_po_report_supplied_materials_changed', data.mainArray)
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

}
