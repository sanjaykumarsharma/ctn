<main-nav>
<div class="navbar navbar-fixed-top navbar-dark bg-primary" role="navigation">
  <a class="navbar-brand" href="#">NTC ERP</a>
  <ul class="nav navbar-nav" if={showNavItems}>
    <li class="{active: selected_nav_item == 'masters'} nav-item">
      <a class="nav-item nav-link" href="#/masters">Masters</a>
    </li>
    <li class="{active: selected_nav_item == 'indents'} nav-item">
      <a class="nav-item nav-link " href="#/indents">Indent</a>
    </li>
    <li class="{active: selected_nav_item == 'po'} nav-item">
      <a class="nav-item nav-link " href="#/po">PO</a>
    </li>
    <li class="{active: selected_nav_item == 'docket'} nav-item">
      <a class="nav-item nav-link " href="#/docket">Docket</a>
    </li>
    <li class="{active: selected_nav_item == 'rejecttoparty'} nav-item">
      <a class="nav-item nav-link " href="#/rejecttoparty">Reject to Party</a>
    </li>
    <li class="{active: selected_nav_item == 'issuetodepartment'} nav-item">
      <a class="nav-item nav-link " href="#/issuetodepartment">Issue to Department</a>
    </li>
    <li class="{active: selected_nav_item == 'returntostock'} nav-item">
      <a class="nav-item nav-link " href="#/returntostock">Return to Stock</a>
    </li>
    <li class="{active: selected_nav_item == 'openingstock'} nav-item">
      <a class="nav-item nav-link " href="#/openingstock">Opening Stock</a>
    </li>
    <li class="{active: selected_nav_item == 'receive'} nav-item">
      <a class="nav-item nav-link " href="#/receive">Receive</a>
    </li>
    <li class="nav-item dropdown">
      <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">Reports</a>
      <ul class="nav navbar-nav dropdown-menu">
        <!-- <li><a class="dropdown-item" href="#">Action</a></li> -->
        <!-- <li class="divider" role="separator"></li> -->

        <li class="dropdown-submenu">
            <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#" >Docket </a>
            <ul class="nav navbar-nav dropdown-menu">
                <li><a class="dropdown-item" href="#/docket-register-date-wise">Docket Register Date Wise</a></li>
                <li><a class="dropdown-item" href="#/docket-register-party-wise">Docket Register Party Wise</a></li>
                <li><a class="dropdown-item" href="#/docket-register-item-wise">Docket Register Item Wise</a></li>
                <!-- <li><a class="dropdown-item" href="#/docket-report">Docket Report</a></li> -->
            </ul>
        </li>

        <li class="dropdown-submenu">
            <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#" >Stock </a>
            <ul class="nav navbar-nav dropdown-menu">
                <li><a class="dropdown-item" href="#/stock-date-wise">Stock Date Wise</a></li>
                <!-- <li><a class="dropdown-item" href="#/stock-movement-register">Stock Movement Register</a></li> -->
                <li><a class="dropdown-item" href="#/stock-valuation-summary-store-type-wise">Stock valuation Summary(Store Type Wise)</a></li>
                <li><a class="dropdown-item" href="#/stock-ledger-avg-valuation-in-details">Stock Ledger Avg Valuation In Details</a></li>
                <li><a class="dropdown-item" href="#/stock-ledger-avg-valuation-in-summry">Stock Ledger Avg Valuation In Summary</a></li>
                <li><a class="dropdown-item" href="#/stock-valuation-summary-location-wise">Stock valuation Summary(Location Wise)</a></li>
            </ul>
        </li>

        <li class="dropdown-submenu">
            <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#" >Issue to Department </a>
            <ul class="nav navbar-nav dropdown-menu">
                <li><a class="dropdown-item" href="#/issuetodepartment-date-wise">Date Wise</a></li>
                <li><a class="dropdown-item" href="#/issuetodepartment-item-wise">Item Wise</a></li>
                <li><a class="dropdown-item" href="#/issuetodepartment-dept-wise">Department Wise</a></li>
                <li><a class="dropdown-item" href="#/issuetodepartment-location-wise">Location Wise</a></li>
                <li><a class="dropdown-item" href="#/issuetodepartment-chargehead-wise">Charge Head Wise</a></li>
            </ul>
        </li>
        
        <li class="dropdown-submenu">
            <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#" >Reject to party </a>
            <ul class="nav navbar-nav dropdown-menu">
                <li><a class="dropdown-item" href="#/rejecttoparty-date-wise">Date Wise</a></li>
                <li><a class="dropdown-item" href="#/rejecttoparty-docket-date-wise">Docket Date Wise</a></li>
                <li><a class="dropdown-item" href="#/rejecttoparty-item-wise">Item Wise</a></li>
                <li><a class="dropdown-item" href="#/rejecttoparty-party-wise">Party Wise</a></li>
            </ul>
        </li>

        <li class="dropdown-submenu">
            <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#" >Return to Stock </a>
            <ul class="nav navbar-nav dropdown-menu">
                <li><a class="dropdown-item" href="#/returntostock-date-wise">Date Wise</a></li>
                <li><a class="dropdown-item" href="#/returntostock-item-wise">Item Wise</a></li>
                <li><a class="dropdown-item" href="#/returntostock-dept-wise">Department Wise</a></li>
            </ul>
        </li>

        <li class="dropdown-submenu">
            <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#" >Indent </a>
            <ul class="nav navbar-nav dropdown-menu">
                <li><a class="dropdown-item" href="#/indent-date-wise">Indent Date Wise</a></li>
                <li><a class="dropdown-item" href="#/indent-report">Indent Report</a></li>
                <li><a class="dropdown-item" href="#/indent-item-wise">Indent Item Wise</a></li>
            </ul>
        </li>

        <li class="dropdown-submenu">
            <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#" >PO </a>
            <ul class="nav navbar-nav dropdown-menu">
                <li><a class="dropdown-item" href="#/po-date-wise">PO Date Wise</a></li>
                <li><a class="dropdown-item" href="#/po-party-wise">PO Party Wise</a></li>
                <li><a class="dropdown-item" href="#/po-report">PO Report Pending</a></li>
                <li><a class="dropdown-item" href="#/po-report-supplied-materials">PO Report Supplied Materials</a></li>
            </ul>
        </li>

        <li class="dropdown-submenu">
            <a class="dropdown-toggle-submenu dropdown-item" data-toggle="dropdown" href="#" >stock Adjustment</a>
            <ul class="nav navbar-nav dropdown-menu">
                <li><a class="dropdown-item" href="#/receive-for-stock-adjustment-report">Receive</a></li>
            </ul>
        </li>


        <!-- <li class="divider" role="separator"></li> -->
      </ul>
    </li>
    <li class="pull-md-right power-button" if={showNavItems} onclick={doLogout}>
      <i class="material-icons" style="font-size:24px">power_settings_new</i>
    </li>
    <li class="pull-md-right power-button" if={showNavItems} onclick={changePassword} style="    margin-right: 10px;">
      <i class="material-icons" style="font-size:24px">vpn_key</i>
    </li>
  </ul>
</div>
  <!-- <nav class="navbar navbar-full navbar-fixed-top navbar-dark bg-primary" role="navigation">
    <a class="navbar-brand" href="#">NTC ERP</a>
    <div class="nav navbar-nav" if={showNavItems}>
      
      <ul class="nav-item dropdown" style="list-style-type:none;margin-left:0px;padding-left: 15px;">
        <li>
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Reports
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li class="dropdown-item" href="#reports/docket-register-date-wise">
                Docket
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownDocketLink">
                  <li class="dropdown-item" href="#reports/docket-register-date-wise">Docket Date Wise</li>
                  <li class="dropdown-item" href="#">Docket Item Wise</li>
                  <li class="dropdown-item" href="#">Docket Party Wise</li>
                  <li class="dropdown-item" href="#">Docket Reject Date Wise</li>
                </ul>
              </li>
              <li class="dropdown-item" href="#">Another action</li>
              <li class="dropdown-item" href="#">Something else here</li>
            </ul>
         </li>
      </ul>
  
      <li class="nav-item nav-link {active: selected_nav_item == 'reports'}" href="#/reports">Reports</li>
        
      <li class="nav-item nav-link {active: selected_nav_item == 'home'}" href="#"><span style="display:none">Home<span></li>
    </div> -->
  
  
  
    <!-- <div class="pull-md-right power-button" if={showNavItems} onclick={doLogout}>
      <i class="material-icons" style="font-size:24px">power_settings_new</i>
    </div>
    <div class="pull-md-right power-button" if={showNavItems} onclick={changePassword} style="    margin-right: 10px;">
      <i class="material-icons" style="font-size:24px">vpn_key</i>
    </div> -->
  </nav>


  <div class="modal fade" id="passwordChangeModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">Change Password</h4>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label>User Name</label>
              <input type="text" id="userNameInput" class="form-control">
            </div>
            <div class="form-group">
              <label>Old Password</label>
              <input type="password" id="oldPasswordInput" class="form-control">
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" id="newPasswordInput" class="form-control">
            </div>
            <div class="form-group">
              <label>Re-type New Password</label>
              <input type="password" id="newPasswordInput2" class="form-control">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick={savePassword}>Save changes</button>
        </div>
      </div>
    </div>
  </div><!-- change indent modal status end --> 

  <script>
    var self = this
    if(!opts.selected_nav_item){
      self.selected_nav_item = 'home'
      self.showNavItems=false
    }else{
      self.selected_nav_item = opts.selected_nav_item
      self.showNavItems=true
    }
    self.username = undefined


    self.changePassword = () => {
      $("#passwordChangeModal").modal('show')  
    }

    self.savePassword = () => {
      if(self.userNameInput.value==''){
        toastr.error('Please enter username and try again')
        return
      }

      if(self.oldPasswordInput.value==''){
        toastr.error('Please enter old password and try again')
        return
      }

      if(self.newPasswordInput.value==''){
        toastr.error('Please enter new password and try again')
        return
      }

      var str=self.newPasswordInput.value
      var p = str.length

      if(Number(p)<5){
        toastr.error('new password lenth must be >4')
        return;
      }

      if(self.newPasswordInput.value!=self.newPasswordInput2.value){
        toastr.error('new password not match')
        return;
      }
     
      RiotControl.trigger('change_password',self.userNameInput.value,self.oldPasswordInput.value,self.newPasswordInput.value)

    }

    self.doLogout = () => {
      console.log("calling logout")
      RiotControl.trigger('logout')
    }

    RiotControl.on('login_changed', function(login_status) {
      console.log("calling me in nav tag")
      self.username = login_status.username
      if(login_status.role!='FAIL'){
        self.showNavItems=true
      }
      self.update()
    })

    RiotControl.on('logOut_changed', function() {
     console.log("logged out");
     self.showNavItems=false
        riot.route("/")
    })

    RiotControl.on('change_password_completed', function(count) {
     console.log("Password changed");
     if(Number(count)==1){
        self.userNameInput.value=''
        self.oldPasswordInput.value=''
        self.newPasswordInput.value=''
        self.newPasswordInput2.value=''
        $("#passwordChangeModal").modal('hide')  
        toastr.info('Password Changed Successfully')
        self.update()
     }else{
      toastr.error('Please check your old username and password')
     }

    })
  </script>
</main-nav>
