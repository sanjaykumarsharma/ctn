<db-backup>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>DB Backup</h1>
      </div>
     
    </div>
  </div>

  <div class="row">
    <div class="col-md-12 text-center" style="margin-top:100px">
       <button class="btn btn-primary" disabled={loading} onclick={dbBackup}>Create Database Backup</button>
       <br>
       <br>
       <br>
       <br>
       <br>
       <button class="btn btn-primary" disabled={loading} onclick={dbStore} style="display:none">Item,Party Master utf8-encoding</button>
       <button class="btn btn-primary" disabled={loading} onclick={dbRunningAmount} style="display:none">Running Amount</button>
       <button class="btn btn-primary" disabled={loading} onclick={dbOpeningStock} style="display:none">Opening Stock For New Financial Year</button>
    </div>
  </div>
  

  <script>
    var self = this
    self.on("mount", function(){
      self.update()
    })

    self.dbBackup = (e) => {
      self.loading = true
      RiotControl.trigger('db_backup')
    }

    RiotControl.on('db_backup_changed', function() {
      self.loading = false
      toastr.info("Backup is created Sussfully")
      self.update()
    })

    self.dbStore = (e) => {
      self.loading = true
      RiotControl.trigger('db_store')
    }

    RiotControl.on('db_store_changed', function() {
      self.loading = false
      toastr.info("Backup is created Sussfully")
      self.update()
    })

    self.dbRunningAmount = (e) => {
      self.loading = true
      RiotControl.trigger('db_running_amount')
    }

    RiotControl.on('db_running_amount_changed', function() {
      self.loading = false
      toastr.info("Running Amount created Sussfully")
      self.update()
    })

    self.dbOpeningStock = (e) => {
      self.loading = true
      RiotControl.trigger('db_opening_stock')
    }

    RiotControl.on('db_opening_stock_changed', function() {
      self.loading = false
      toastr.info("Opening Stock created Sussfully")
      self.update()
    })

  </script>
</db-backup>