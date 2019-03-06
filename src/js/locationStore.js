function LocationStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.locations = []

  self.on('read_locations', function() {
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
            self.trigger('locations_changed', self.locations)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_location', function(location_id) {
    let req = {}
    req.action = 'delete'
    req.location_id = location_id
    // return;
    $.ajax({
      url:'api/location',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.locations.filter(c => {
              return c.location_id != location_id
            })
            self.locations = tempCategories
            self.trigger('locations_changed', self.locations)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_location', function(location_id, location_code, location) {
    let req = {}
    req.action = 'edit'
    req.location_id = location_id
    req.location_code = location_code
    req.location = location
    // return;
    $.ajax({
      url:'api/location',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.locations = self.locations.map(c => {
              if(c.location_id == location_id){
                c.location_code = location_code
                c.location = location
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('locations_changed', self.locations)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_location', function(location_code,location) {
    let req = {}
    req.action = 'add'
    req.location_code = location_code
    req.location = location
    // return;
    $.ajax({
      url:'api/location',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.location_id = data.location_id
            cat.location_code = location_code
            cat.location = location
            self.locations = [cat, ...self.locations]
            self.trigger('locations_changed', self.locations)
          }else if(data.status == 'e'){
            showToast("error in adding location.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
