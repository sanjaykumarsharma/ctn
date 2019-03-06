<home>

  <div class="row">
    <div class="col-sm-4 offset-sm-4">
      <div class="login-box">
        <div class="login-card card card-block bg-faded">
          <h1 class="card-title">Login</h1>
          <div class="card-text">
            <form onsubmit={login}>
              <div class="form-group">
                <label>Username</label>
                <input type="text" class="form-control" name="username" required onkeyup={loginProcess}>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" name="password" required onkeyup={loginProcess}>
              </div>
              <div class="form-group">
                <button class="btn btn-primary w-100" id="loginButton">Login</button>
              </div>
              <div class="alert alert-warning" role="alert" if={login_warning}>
                <strong>Oops!</strong> Please enter both username and password and try again.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>


  <script>
    var self = this
    self.login_warning = false
    self.on('mount', function() {
      RiotControl.trigger('login_init')
      $('#loginButton').prop('disabled', true);
      self.update()
    })

    RiotControl.on('login_changed', function(login_status) {
     console.log("Changed");
      if(login_status.role && login_status.role != 'FAIL'){
        riot.route("/masters/department-master")
      }
    })

    self.login = (e) => {
      if(!self.username.value || !self.password.value){
        self.login_warning = true
      }
      RiotControl.trigger('check_login', self.username.value, self.password.value)
    }


    self.loginProcess = () => {

      if(self.username.value==''){
        $('#loginButton').prop('disabled', true);
      }else{
        if(self.password.value==''){
          $('#loginButton').prop('disabled', true);
        }else{
         $('#loginButton').prop('disabled', false);
        }
      }
      self.update()
    }

  </script>
</home>
