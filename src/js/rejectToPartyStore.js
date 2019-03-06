function RejectToPartyStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_rejected_docket', function(stock_type_code) {
    let req = {}
    req.action = 'readRejectedDocket'
    req.stock_type_code=stock_type_code
    //req.end_date=end_date
    // return;
    $.ajax({
      url:'api/rejecttoparty',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_rejected_docket_changed', data.rejected_dockets)
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

  self.on('read_docket_to_reject', function(stock_type_code) {
    let req = {}
    req.action = 'readDocketToReject'
    req.stock_type_code=stock_type_code
    //req.end_date=end_date
    // return;
    $.ajax({
      url:'api/rejecttoparty',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_docket_to_reject_changed', data.rejected_dockets)
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

  self.on('read_docket_details_reject_to_party', function(docket_id,stock_type_code) {
    let req = {}
    req.action = 'readDocketDetailsRejectToParty'
    req.docket_id=docket_id
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/rejecttoparty',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_docket_details_reject_to_party_changed', data.details,data.items,data.reject_to_party_no)
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

  
  self.on('read_rejected_docket_details', function(docket_id,reject_to_party_id) {
    let req = {}
    req.action = 'readDocketDetails'
    req.docket_id=docket_id
    req.reject_to_party_id=reject_to_party_id
    // return;
    $.ajax({
      url:'api/rejecttoparty',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_rejected_docket_details_changed', data.dockets)
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

  self.on('read_rejected_docket_edit', function(docket_id,reject_to_party_id) {
    let req = {}
    req.action = 'readRjectedDocketDetailsEdit'
    req.docket_id=docket_id
    req.reject_to_party_id=reject_to_party_id
    // return;
    $.ajax({
      url:'api/rejecttoparty',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_rejected_docket_edit_changed', data.details,data.detailsRP,data.items)
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

  self.on('fetch_user_details_from_session_for_reject_to_party', function() {
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
            self.trigger('fetch_user_details_from_session_for_reject_to_party_changed', data.username,data.user_id)
          }else if(data.status == 'e'){
            showToast("User error.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('reject_to_party', function(docket_id,materials,reject_date,rejected_by,dockets,docket_date,transporter_name,lr_no,vehicle_no,mode_of_transport,reject_to_party_stock_type,reject_to_party_no) {
    let req = {}
    req.action = 'rejectToParty'
    req.reject_docket_id = docket_id
    req.materials = materials
    req.reject_date = reject_date
    req.rejected_by = rejected_by
    req.docket_date = docket_date
    req.transporter_name = transporter_name
    req.lr_no = lr_no
    req.vehicle_no = vehicle_no
    req.mode_of_transport = mode_of_transport
    req.reject_to_party_stock_type = reject_to_party_stock_type
    req.reject_to_party_no = reject_to_party_no
    // return;
    $.ajax({
      url:'api/rejecttoparty',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = dockets.filter(c => {
              return c.docket_id != docket_id
            })
            let  docket = tempCategories
            self.trigger('reject_to_party_changed', docket)
          }else if(data.status == 'date_error'){//docket_date>reject_date
            var msg='docket_date can not be grater than reject_date'
            self.trigger('reject_to_party_date_error', msg)
          }else if(data.status == 'date_error'){//docket_date>reject_date
            var msg='reject_to_party with older date not allowed for same stock type'
            self.trigger('reject_to_party_date_error', msg)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('reject_to_party_edit', function(docket_id,materials,reject_date,rejected_by,dockets,docket_date,transporter_name,lr_no,vehicle_no,mode_of_transport,reject_to_party_stock_type,reject_to_party_no,reject_to_party_id) {
    let req = {}
    req.action = 'rejectToPartyEdit'
    req.reject_docket_id = docket_id
    req.materials = materials
    req.reject_date = reject_date
    req.rejected_by = rejected_by
    req.docket_date = docket_date
    req.transporter_name = transporter_name
    req.lr_no = lr_no
    req.vehicle_no = vehicle_no
    req.mode_of_transport = mode_of_transport
    req.reject_to_party_stock_type = reject_to_party_stock_type
    req.reject_to_party_no = reject_to_party_no
    req.reject_to_party_id = reject_to_party_id
    // return;
    $.ajax({
      url:'api/rejecttoparty',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('reject_to_party_edit_changed')
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })


  self.on('delete_reject_to_party', function(reject_to_party_id,rejectedDockets) {
    let req = {}
    req.action = 'deleteRejectToParty'
    req.reject_to_party_id = reject_to_party_id
    // return;
    $.ajax({
      url:'api/rejecttoparty',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempItems = rejectedDockets.filter(c => {
              return c.reject_to_party_id != reject_to_party_id
            })
            let  items = tempItems
            self.trigger('delete_reject_to_party_changed', items)
          }else if(data.status == 'e'){
            showToast("Issue delete error. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
