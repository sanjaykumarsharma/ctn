<masters>
  <div class="col-sm-12">
    <ul class="nav nav-pills" style="margin:20px 0">
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'department-master'}" href="#masters/department-master">Department</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'location-master'}" href="#masters/location-master">Location</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'chargehead-master'}" href="#masters/chargehead-master">Charge Head</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'stock-type-master'}" href="#masters/stock-type-master">Stock Type</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'tax-master'}" href="#masters/tax-master">Tax</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'uom-master'}" href="#masters/uom-master">UOM</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'condition-master'}" href="#masters/condition-master">T & C</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'item-group'}" href="#masters/item-group">Item Group</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'party-master'}" href="#masters/party-master">Party</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'item'}" href="#masters/item">Material</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'financial-year'}" href="#masters/financial-year">Financial Year</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_master == 'db-backup'}" href="#masters/db-backup">Backup</a>
      </li>
      
    </ul>
  </div>
  <div id="master-view"></div>
  <script>
    var self = this
    if(!opts.selected_master){
      self.selected_master = 'department-master'
    }else{
      self.selected_master = opts.selected_master
    }
  </script>
</masters>
