function ActivityStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.activities = []

  self.on('read_activities', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/activity',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.activities = data.activities
            self.trigger('activities_changed', self.activities)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_activity', function(activity_id) {
    let req = {}
    req.action = 'delete'
    req.activity_id = activity_id
    // return;
    $.ajax({
      url:'api/activity',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempActivities = self.activities.filter(c => {
              return c.activity_id != activity_id
            })
            self.activities = tempActivities
            self.trigger('activities_changed', self.activities)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_activity', function(activity_id, activity) {
    let req = {}
    req.action = 'edit'
    req.activity_id = activity_id
    req.activity = activity
    // return;
    $.ajax({
      url:'api/activity',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.activities = self.activities.map(c => {
              if(c.activity_id == activity_id){
                c.activity = activity
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('activities_changed', self.activities)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_activity', function(activity) {
    let req = {}
    req.action = 'add'
    req.activity = activity
    // return;
    $.ajax({
      url:'api/activity',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.activity_id = data.activity_id
            cat.activity = activity
            self.activities = [cat, ...self.activities]
            self.trigger('activities_changed', self.activities)
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
