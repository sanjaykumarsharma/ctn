function IndentStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.indents = []

  self.on('read_departments_for_indent', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/department',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.departments = data.departments
            self.trigger('read_departments_for_indent_changed', self.departments)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_indents', function(indent_status,stock_type) {
    let req = {}
    req.action = 'read'
    req.indent_status = indent_status
    req.stock_type = stock_type

    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.indents = data.indents
            self.trigger('indents_changed', self.indents)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_indent_no', function(stock_type_code) {
    let req = {}
    req.action = 'readIndentNo'
    req.stock_type_code = stock_type_code

    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('read_indent_no_changed', data.indent_no)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
  

  self.on('read_items_for_indent', function(item_group_code,stock_type_code) {
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
            self.trigger('items_for_indent_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_edit_indents', function(indent_id) {
    let req = {}
    req.action = 'readIndentEdit'
    req.indent_id = indent_id
    
    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's' && data.total_po==0){
            self.values = data.item
            self.trigger('read_edit_indents_changed', self.values)
          }else if(data.status == 's' && data.total_po>0){
            showToast("Edit Not Allowed.PO is created for this indent", data)
          }else if(data.status == 'e'){
            showToast("some error occured. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_view_indents', function(indent_id) {
    let req = {}
    req.action = 'readIndentView'
    req.indent_id = indent_id
    
    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.view = data.item
            self.trigger('read_view_indents_changed', self.view)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_indent', function(indent_id) {
    let req = {}
    req.action = 'delete'
    req.indent_id = indent_id
    // return;
    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.indents.filter(c => {
              return c.indent_id != indent_id
            })
            self.indents = tempCategories
            self.trigger('indents_changed', self.indents)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_indent', function(selectedMaterialsArray, obj, indent_id) {
    let req = {}
    req.action = 'edit'
    req.materialsArray=selectedMaterialsArray
    req.indent_date=obj.indent_date
    req.department_code=obj.department_code
    req.stock_type_code=obj.stock_type_code
    req.indent_type=obj.indent_type
    req.indent_id=indent_id
    // return;
    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('indents_changed', self.indents)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

 self.on('edit_indent_status', function(obj) {
    let req = {}
    req.action = 'editIndentStatus'
    req.status_date=obj.status_date
    req.authority_name=obj.authority_name
    req.status_change_remarks=obj.status_change_remarks
    req.status=obj.status
    req.indent_id=obj.indent_id
    // return;
    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.indents.filter(c => {
              return c.indent_id != obj.indent_id
            })
            self.indents = tempCategories
            self.trigger('indents_status_changed', self.indents)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
 
  self.on('add_indent', function(selectedMaterialsArray, obj) {
    console.log(obj)
    let req = {}
    req.action = 'add'
    req.materialsArray=selectedMaterialsArray
    req.indent_date=obj.indent_date
    req.department_code=obj.department_code
    req.stock_type_code=obj.stock_type_code
    req.indent_type=obj.indent_type
    
    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('indents_changed', self.indents)
          }else if(data.status == 'date_error'){
            self.trigger('indents_date_error')
          }else if(data.status == 'e'){
            showToast("some error occurred.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('search_items_for_indent', function(search_term,stock_type_code) {
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
            self.trigger('items_for_indent_changed', data.items)
          }else if(data.status == 'e'){
            showToast("Material not found.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('fetch_user_details_from_session_for_indent', function() {
    let req = {}
    req.action = 'fetchUserDetailsFromSessionForIndent'

    $.ajax({
      url:'api/indent',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            console.log(data)
            self.trigger('fetch_user_details_from_session_for_indent_changed', data.username,data.user_id)
          }else if(data.status == 'e'){
            showToast("User error.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
