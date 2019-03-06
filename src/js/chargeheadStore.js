function ChargeheadStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.chargeheads = []

  self.on('read_chargeheads', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/chargehead',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.chargeheads = data.chargeheads
            self.trigger('chargeheads_changed', self.chargeheads)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_chargehead', function(chargehead_id) {
    let req = {}
    req.action = 'delete'
    req.chargehead_id = chargehead_id
    // return;
    $.ajax({
      url:'api/chargehead',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.chargeheads.filter(c => {
              return c.chargehead_id != chargehead_id
            })
            self.chargeheads = tempCategories
            self.trigger('chargeheads_changed', self.chargeheads)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_chargehead', function(chargehead_id, chargehead_code, chargehead) {
    let req = {}
    req.action = 'edit'
    req.chargehead_id = chargehead_id
    req.chargehead_code = chargehead_code
    req.chargehead = chargehead
    // return;
    $.ajax({
      url:'api/chargehead',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.chargeheads = self.chargeheads.map(c => {
              if(c.chargehead_id == chargehead_id){
                c.chargehead_code = chargehead_code
                c.chargehead = chargehead
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('chargeheads_changed', self.chargeheads)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_chargehead', function(chargehead_code,chargehead) {
    let req = {}
    req.action = 'add'
    req.chargehead_code = chargehead_code
    req.chargehead = chargehead
    // return;
    $.ajax({
      url:'api/chargehead',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.chargehead_id = data.chargehead_id
            cat.chargehead_code = chargehead_code
            cat.chargehead = chargehead
            self.chargeheads = [cat, ...self.chargeheads]
            self.trigger('chargeheads_changed', self.chargeheads)
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
