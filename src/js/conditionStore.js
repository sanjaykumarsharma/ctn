function ConditionStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.conditions = []

  self.on('read_conditions', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/condition',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.conditions = data.conditions
            self.trigger('conditions_changed', self.conditions)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_condition', function(condition_id) {
    let req = {}
    req.action = 'delete'
    req.condition_id = condition_id
    // return;
    $.ajax({
      url:'api/condition',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.conditions.filter(c => {
              return c.condition_id != condition_id
            })
            self.conditions = tempCategories
            self.trigger('conditions_changed', self.conditions)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_condition', function(condition_id, condition_name) {
    let req = {}
    req.action = 'edit'
    req.condition_id = condition_id
    req.condition_name = condition_name
    // return;
    $.ajax({
      url:'api/condition',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.conditions = self.conditions.map(c => {
              if(c.condition_id == condition_id){
                c.condition_name = condition_name
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('conditions_changed', self.conditions)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_condition', function(condition_name) {
    let req = {}
    req.action = 'add'
    req.condition_name = condition_name
    // return;
    $.ajax({
      url:'api/condition',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.condition_id = data.condition_id
            cat.condition_name = condition_name
            self.conditions = [cat, ...self.conditions]
            self.trigger('conditions_changed', self.conditions)
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
