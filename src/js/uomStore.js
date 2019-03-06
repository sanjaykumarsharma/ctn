function UomStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.uoms = []

  self.on('read_uoms', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/uom',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.uoms = data.uoms
            self.trigger('uoms_changed', self.uoms)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_uom', function(uom_id) {
    let req = {}
    req.action = 'delete'
    req.uom_id = uom_id
    // return;
    $.ajax({
      url:'api/uom',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.uoms.filter(c => {
              return c.uom_id != uom_id
            })
            self.uoms = tempCategories
            self.trigger('uoms_changed', self.uoms)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_uom', function(uom_id, uom_code, uom) {
    let req = {}
    req.action = 'edit'
    req.uom_id = uom_id
    req.uom_code = uom_code
    req.uom = uom
    // return;
    $.ajax({
      url:'api/uom',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.uoms = self.uoms.map(c => {
              if(c.uom_id == uom_id){
                c.uom_code = uom_code
                c.uom = uom
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('uoms_changed', self.uoms)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_uom', function(uom_code,uom) {
    let req = {}
    req.action = 'add'
    req.uom_code = uom_code
    req.uom = uom
    // return;
    $.ajax({
      url:'api/uom',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.uom_id = data.uom_id
            cat.uom_code = uom_code
            cat.uom = uom
            self.uoms = [cat, ...self.uoms]
            self.trigger('uoms_changed', self.uoms)
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
