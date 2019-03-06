function ItemGroupStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.item_groups = []

  self.on('read_item_groups', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/item-group',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.item_groups = data.item_groups
            self.trigger('item_groups_changed', self.item_groups)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_item_group', function(item_group_id) {
    let req = {}
    req.action = 'delete'
    req.item_group_id = item_group_id
    // return;
    $.ajax({
      url:'api/item-group',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.item_groups.filter(c => {
              return c.item_group_id != item_group_id
            })
            self.item_groups = tempCategories
            self.trigger('item_groups_changed', self.item_groups)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_item_group', function(item_group_id, item_group_code, item_group) {
    let req = {}
    req.action = 'edit'
    req.item_group_id = item_group_id
    req.item_group_code = item_group_code
    req.item_group = item_group
    // return;
    $.ajax({
      url:'api/item-group',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.item_groups = self.item_groups.map(c => {
              if(c.item_group_id == item_group_id){
                c.item_group_code = item_group_code
                c.item_group = item_group
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('item_groups_changed', self.item_groups)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_item_group', function(item_group_code,item_group) {
    let req = {}
    req.action = 'add'
    req.item_group_code = item_group_code
    req.item_group = item_group
    // return;
    $.ajax({
      url:'api/item-group',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.item_group_id = data.item_group_id
            cat.item_group_code = item_group_code
            cat.item_group = item_group
            self.item_groups = [cat, ...self.item_groups]
            self.trigger('item_groups_changed', self.item_groups)
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
