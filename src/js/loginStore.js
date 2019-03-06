function LoginStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.login_status = {
    username: undefined,
    role: undefined,
    first_name:""
  }

  self.on('check_login', function(username, password) {
    let req = {}
    req.action = 'login'
    req.username = username
    req.password = password
    // return;
    $.ajax({
      url:'api/login',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log(data)
          if(data.status == 's'){
            if(data.role !== 'FAIL'){
              self.login_status.username = data.username
              self.login_status.role = data.role
              self.login_status.first_name = data.first_name
            }else{
              showToast("Invalid Username or password. Please try again.", data)
              self.login_status.role = "FAIL";
            }
            self.trigger('login_changed', self.login_status)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('logout', function() {
    
    let req = {}
    req.action = 'logout'
    $.ajax({
      url:'api/login',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log(data)
          /*if(data.status == 's'){
            self.login_status = {
            username: undefined,
            role: undefined,
            first_name:""
           }*/
            self.trigger('logOut_changed')
          /*}else if(data.status == 'e'){
            showToast("Not able to logout.", data)
          }*/
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('change_password', function(username,old_password,new_password) {
    
    let req = {}
    req.action = 'changePassword'
    req.username=username
    req.old_password=old_password
    req.new_password=new_password

    $.ajax({
      url:'api/login',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status=='s'){
            self.trigger('change_password_completed',data.count)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('login_init', function() {
    //self.trigger('login_changed', self.login_status)
  })


}
