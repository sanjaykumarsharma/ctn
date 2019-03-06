function DocketStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.conditions = []

  self.on('read_po_for_docket', function(stock_type) {
    let req = {}
    req.action = 'readPOForDocket'
    req.stock_type=stock_type
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_po_for_docket_changed', data.purchaseOrders,data.docket_no)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_material', function(po_id) {
    let req = {}
    req.action = 'readMaterials'
    //req.po_id=po_id
    req.poids=po_id
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_material_changed', data.material)
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

  self.on('save_docket', function(materials,details) {
    let req = {}
    req.action = 'saveDocket'
    req.materials = materials
    req.details = details
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('docket_save_changed')
          }else if(data.status == 'error'){
            showToast("Please check your docket date some docket with newer date exists.")
          }else if(data.status == 'e'){
            showToast("Somthing went wrong.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })


  self.on('edit_docket', function(materials,details,edit_docket_id) {
    let req = {}
    req.action = 'editDocket'
    req.materials = materials
    req.details = details
    req.edit_docket_id = edit_docket_id
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('docket_save_changed')
          }else if(data.status == 'e'){
            showToast("Somthing went wrong.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  
  self.on('read_docket', function(stock_type_code) {
    let req = {}
    req.action = 'readDocket'
    req.stock_type_code=stock_type_code
    //req.end_date=end_date
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_docket_changed', data.dockets)
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


  self.on('read_docket_details', function(docket_id) {
    let req = {}
    req.action = 'readDocketDetails'
    req.docket_id=docket_id
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_docket_details_changed', data.dockets)
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


  self.on('read_docket_details_edit', function(docket_id,po_id) {
    let req = {}
    req.action = 'readDocketDetailsEdit'
    req.docket_id=docket_id
    req.po_id=po_id
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_docket_details_edit_changed', data.dockets)
          }else if(data.status == 'return_to_party_error'){
            self.trigger('read_docket_details_edit_error_changed', data.dockets)
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

  /*self.on('read_docket_details_reject_to_party', function(docket_id) {
    let req = {}
    req.action = 'readDocketDetailsEdit'
    req.docket_id=docket_id
    // return;
    $.ajax({
      url:'api/docket',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_docket_details_reject_to_party_changed', data.dockets)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })*/

  self.on('delete_docket', function(docket_id,dockets) {
    let req = {}
    req.action = 'deleteDocket'
    req.docket_id = docket_id
    // return;
    $.ajax({
      url:'api/docket',
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
            self.trigger('delete_docket_changed', docket)
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
