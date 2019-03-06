function DepartmentStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.departments = []

  self.on('read_departments', function() {
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
            self.trigger('departments_changed', self.departments)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_department', function(department_id) {
    let req = {}
    req.action = 'delete'
    req.department_id = department_id
    // return;
    $.ajax({
      url:'api/department',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.departments.filter(c => {
              return c.department_id != department_id
            })
            self.departments = tempCategories
            self.trigger('departments_changed', self.departments)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_department', function(department_id, department_code, department) {
    let req = {}
    req.action = 'edit'
    req.department_id = department_id
    req.department_code = department_code
    req.department = department
    // return;
    $.ajax({
      url:'api/department',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.departments = self.departments.map(c => {
              if(c.department_id == department_id){
                c.department_code = department_code
                c.department = department
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('departments_changed', self.departments)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_department', function(department_code,department) {
    let req = {}
    req.action = 'add'
    req.department_code = department_code
    req.department = department
    // return;
    $.ajax({
      url:'api/department',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.department_id = data.department_id
            cat.department_code = department_code
            cat.department = department
            self.departments = [cat, ...self.departments]
            self.trigger('departments_changed', self.departments)
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
