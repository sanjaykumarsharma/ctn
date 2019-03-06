function ItemStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.items = []

  self.on('read_items', function(item_group_code,stock_type_code,alphabet) {
    let req = {}
    req.action = 'read'
    req.item_group_code = item_group_code
    req.stock_type_code = stock_type_code
    req.alphabet = alphabet
    // return;
    $.ajax({
      url:'api/item',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.items = data.items
            self.trigger('items_changed', self.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_item', function(item_id) {
    let req = {}
    req.action = 'delete'
    req.item_id = item_id
    // return;
    $.ajax({
      url:'api/item',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.items.filter(c => {
              return c.item_id != item_id
            })
            self.items = tempCategories
            self.trigger('items_changed', self.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_item', function(obj) {
    let req = {}
    req.action = 'edit'
    req.item_id=obj.item_id
    req.item_name=obj.itemNameInput
    req.item_group_code=obj.itemGroupCodeInput
    req.uom_code=obj.uomCodeInput
    req.location=obj.locationInput
    req.max_level=obj.maxLevelInput
    req.reorder_level=obj.rolInput
    req.item_description=obj.itemDescriptionInput
    req.stock_type_code=obj.stockTypeInput
    req.min_level=obj.minLevelInput
    req.reorder_qty=obj.roqInput
    // return;
    $.ajax({
      url:'api/item',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.items = self.items.map(cat => {
              if(cat.item_id == obj.item_id){
                cat.item_id = obj.item_id
                cat.item_name=obj.itemNameInput
                cat.item_group_code=obj.itemGroupCodeInput
                cat.uom_code=obj.uomCodeInput
                cat.location=obj.locationInput
                cat.max_level=obj.maxLevelInput
                cat.reorder_level=obj.rolInput
                cat.item_description=obj.itemDescriptionInput
                cat.stock_type_code=obj.stockTypeInput
                cat.min_level=obj.minLevelInput
                cat.reorder_qty=obj.roqInput
              }
              cat.confirmEdit = false
              return cat
            })
            self.trigger('items_changed', self.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
 
  self.on('add_item', function(obj) {
    console.log(obj)
    let req = {}
    req.action = 'add'
    req.item_name=obj.itemNameInput
    req.item_group_code=obj.itemGroupCodeInput
    req.uom_code=obj.uomCodeInput
    req.location=obj.locationInput
    req.max_level=obj.maxLevelInput
    req.reorder_level=obj.rolInput
    req.item_description=obj.itemDescriptionInput
    req.stock_type_code=obj.stockTypeInput
    req.min_level=obj.minLevelInput
    req.reorder_qty=obj.roqInput
    // return;
    $.ajax({
      url:'api/item',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            /*let cat = {}
            cat.item_id = data.item_id
            cat.item_code=obj.itemCode
            cat.add_line1=obj.addLine1
            cat.city=obj.city
            cat.pin=obj.pin
            cat.phone_office=obj.phoneOffice
            cat.email=obj.email
            cat.cst=obj.cst
            cat.pan=obj.pan
            cat.item_name=obj.itemName
            cat.add_line2=obj.addLine2
            cat.state=obj.state
            cat.mobile=obj.mobile
            cat.phone_residence=obj.phoneResidence
            cat.vat=obj.vat
            cat.excise=obj.excise
            cat.address=obj.addLine1 + ', ' + obj.addLine2 + ', ' + obj.city + ', ' + obj.state + ', ' + obj.pin
        
            self.items = [cat, ...self.items]*/
            self.trigger('items_changed', self.items)
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
