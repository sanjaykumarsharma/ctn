function PurchaseOrderStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.purchase_orders = []

  
  self.on('read_po', function(purchase_order_status,stock_type) {
    let req = {}
    req.action = 'read'
    req.purchase_order_status = purchase_order_status
    req.stock_type = stock_type

    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.purchaseOrders = data.purchase_orders
            self.trigger('purchase_orders_changed', self.purchaseOrders)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_indents_for_po_addition', function(indent_status) {
    let req = {}
    req.action = 'readIndentsForPOAddition'
    req.indent_status = indent_status

    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_indents_for_po_addition_changed', data.indents)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })



  self.on('read_indents_for_po', function(indentIdArray,stock_type_code) {
    let req = {}
    req.action = 'readIndentsForPurchaseOrder'
    req.indentIdArray = indentIdArray
    req.stock_type_code = stock_type_code
    
    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.values = data.item
            self.trigger('read_indents_for_po_changed', self.values,data.po_no)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_po_no', function(stock_type_code) {
    let req = {}
    req.action = 'readPoNo'
    req.stock_type_code = stock_type_code
    
    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_po_no_changed',data.po_no)
          }else if(data.status == 'e'){
            showToast("po no read error. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_po', function(materialArray, conditionArray, party_id,remarks,quotatoin_ref,po_date,stock_type_code) {
    let req = {}
    req.action = 'add'
    req.materialArray=materialArray
    req.conditionArray=conditionArray
    req.party_id=party_id
    req.remarks=remarks
    req.quotatoin_ref=quotatoin_ref
    req.po_date=po_date
    req.stock_type_code=stock_type_code
    
    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('po_created')
          }else if(data.status == 'date_error'){
            self.trigger('po_creation_date_error')
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_po_without_indent', function(materialArray, conditionArray, party_id,remarks,quotatoin_ref,po_date,stock_type_code) {
    let req = {}
    req.action = 'addPurchaseOrderWithoutIndent'
    req.materialArray=materialArray
    req.conditionArray=conditionArray
    req.party_id=party_id
    req.remarks=remarks
    req.quotatoin_ref=quotatoin_ref
    req.po_date=po_date
    req.stock_type_code=stock_type_code
    
    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('po_created')
          }else if(data.status == 'date_error'){
            self.trigger('po_creation_date_error')
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_po', function(materialArray, conditionArray, party_id, po_id, remarks, quotatoin_ref,po_date,stock_type_code) {
    let req = {}
    req.action = 'edit'
    req.materialArray=materialArray
    req.conditionArray=conditionArray
    req.party_id=party_id
    req.po_id=po_id
    req.remarks=remarks
    req.quotatoin_ref=quotatoin_ref
    req.po_date=po_date
    req.stock_type_code=stock_type_code
    
    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('po_edited')
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_po_without_indent', function(materialArray, conditionArray, party_id, po_id, remarks, quotatoin_ref,po_date) {
    let req = {}
    req.action = 'editPOWithoutIndent'
    req.materialArray=materialArray
    req.conditionArray=conditionArray
    req.party_id=party_id
    req.po_id=po_id
    req.remarks=remarks
    req.quotatoin_ref=quotatoin_ref
    req.po_date=po_date
    //req.stock_type_code=stock_type_code
    
    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('po_edited')
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_po', function(po_id,po_without_indent) {
    let req = {}
    req.action = 'delete'
    req.po_id = po_id
    req.po_without_indent = po_without_indent
    // return;
    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's' && data.total_docket_no==0){
            let tempPos = self.purchaseOrders.filter(c => {
              return c.po_id != po_id
            })
            self.purchaseOrders = tempPos
            self.trigger('purchase_orders_changed', self.purchaseOrders)
          }else if(data.status == 's' && data.total_docket_no>0){
            showToast("Some Docket is there. Please delete Docket first.", data)
            self.trigger('purchase_orders_not_deleted', self.purchaseOrders)

          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
  
  self.on('complete_po', function(po_id) {
    let req = {}
    req.action = 'completePO'
    req.po_id = po_id
    // return;
    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempPos = self.purchaseOrders.filter(c => {
              return c.po_id != po_id
            })
            self.purchaseOrders = tempPos
            self.trigger('purchase_orders_changed', self.purchaseOrders)
          }else if(data.status == 'e'){
            showToast("Needs admin permission to approve the PO.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('view_po', function(po_id) {
    let req = {}
    req.action = 'readPurchaseOrderView'
    req.po_id = po_id

    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            //self.viewPurchaseOrders = data.purchaseOrders
            self.trigger('purchase_orders_view_changed', data.purchaseOrders)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('view_po_without_indent', function(po_id) {
    let req = {}
    req.action = 'readPurchaseOrderViewWithoutIndent'
    req.po_id = po_id

    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            //self.viewPurchaseOrders = data.purchaseOrders
            self.trigger('purchase_orders_view_changed', data.purchaseOrders)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_edit_po', function(po_id, indentIdArray,stock_type_code) {
    let req = {}
    req.action = 'readPurchaseOrderEdit'
    req.po_id = po_id
    req.indentIdArray = indentIdArray
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('purchase_orders_edit_changed', data.purchaseOrders,data.po_no)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

   self.on('read_edit_po_without_indent', function(po_id, indentIdArray) {
    let req = {}
    req.action = 'readPurchaseOrderEditWithoutIndent'
    req.po_id = po_id
    req.indentIdArray = indentIdArray

    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's' && data.purchaseOrders.total_docket_no==0){
            self.trigger('purchase_orders_edit_without_indent_changed', data.purchaseOrders)
          }else if(data.status == 's' && data.purchaseOrders.total_docket_no>0){
            self.trigger('purchase_orders_edit_without_indent_error')
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_indents_edit', function(indent_status, po_id) {
    let req = {}
    req.action = 'readIndentEdit'
    req.indent_status = indent_status
    req.po_id = po_id

    $.ajax({
      url:'api/po',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's' && data.docket_no==0){
            self.trigger('indents_edit_changed', data.indents)
          }else if(data.status == 's' && data.docket_no>0){
            showToast("Edit is not allowed. some docket is created for this PO.", data)
          }else if(data.status == 'e'){
            showToast("some error occured. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_items_for_po', function(item_group_code,stock_type_code) {
    let req = {}
    req.action = 'readItemsForIndent'
    req.item_group_code = item_group_code
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('items_for_po_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('search_items_for_po', function(search_term,stock_type_code) {
    let req = {}
    req.action = 'search_items'
    req.search_term = search_term
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('items_for_po_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Material not found.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
