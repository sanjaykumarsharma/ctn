function RejectToPartyReport() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_reject_to_party_date_wise', function(start_date,end_date,stock_type_code) {
    console.log("calling here")
    let req = {}
    req.action = 'readRejectToPartyDateWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/rejecttoparty-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_reject_to_party_date_wise_changed', data.mainArray)
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

  self.on('read_reject_to_party_docket_date_wise', function(start_date,end_date,stock_type_code) {
    console.log("calling here")
    let req = {}
    req.action = 'readRejectToPartyDocketDateWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/rejecttoparty-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_reject_to_party_docket_date_wise_changed', data.mainArray)
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
  self.on('read_reject_to_party_item_wise', function(start_date,end_date,stock_type_code,selected_item_id) {
    console.log("calling here")
    let req = {}
    req.action = 'readRejectToPartyItemWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_item_id=selected_item_id
    // return;
    $.ajax({
      url:'api/rejecttoparty-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_reject_to_party_item_wise_changed', data.mainArray)
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

  self.on('read_reject_to_party_party_wise', function(start_date,end_date,stock_type_code,selected_party_id) {
    console.log("calling here")
    let req = {}
    req.action = 'readRejectToPartyPartyWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_party_id=selected_party_id
    // return;
    $.ajax({
      url:'api/rejecttoparty-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_reject_to_party_party_wise_changed', data.mainArray)
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
