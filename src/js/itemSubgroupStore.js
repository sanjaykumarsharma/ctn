function ItemSubgroupStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.item_subgroups = []

  self.on('read_item_subgroups', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/item-subgroup',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.item_subgroups = data.item_subgroups
            self.trigger('item_subgroups_changed', self.item_subgroups)
          }else if(data.status == 'e'){
            showToast("Failed to read item subgroups. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_item_subgroup', function(item_subgroup_id) {
    let req = {}
    req.action = 'delete'
    req.item_subgroup_id = item_subgroup_id
    // return;
    $.ajax({
      url:'api/item-subgroup',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempItemSubgroups = self.item_subgroups.filter(c => {
              return c.item_subgroup_id != item_subgroup_id
            })
            self.item_subgroups = tempItemSubgroups
            self.trigger('item_subgroups_changed', self.item_subgroups)
          }else if(data.status == 'e'){
            showToast("Failed to delete item subgroup. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_item_subgroup', function(item_subgroup_id, item_group_id, item_subgroup) {
    let req = {}
    req.action = 'edit'
    req.item_subgroup_id = item_subgroup_id
    req.item_group_id = item_group_id
    req.item_subgroup = item_subgroup
    // return;
    $.ajax({
      url:'api/item-subgroup',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.item_subgroups = self.item_subgroups.map(c => {
              if(c.item_subgroup_id == item_subgroup_id){
                c.item_subgroup = item_subgroup
                c.item_group_id = item_group_id
                c.item_group = data.item_group
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('item_subgroups_changed', self.item_subgroups)
          }else if(data.status == 'e'){
            showToast("Failed to edit item subgroup. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_item_subgroup', function(item_group_id, item_subgroup) {
    let req = {}
    req.action = 'add'
    req.item_group_id = item_group_id
    req.item_subgroup = item_subgroup
    // return;
    $.ajax({
      url:'api/item-subgroup',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.item_group_id = item_group_id
            cat.item_group = data.item_group
            cat.item_subgroup_id = data.item_subgroup_id
            cat.item_subgroup = item_subgroup
            self.item_subgroups = [cat, ...self.item_subgroups]
            self.trigger('item_subgroups_changed', self.item_subgroups)
          }else if(data.status == 'e'){
            showToast("Failed to add item subgroup. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
}
