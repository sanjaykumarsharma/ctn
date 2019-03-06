function FinancialYearStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.financialYears = []

  self.on('read_financial_year', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.financialYears = data.financialYears
            self.trigger('financial_years_changed', self.financialYears)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_financial_year', function(id) {
    let req = {}
    req.action = 'delete'
    req.id = id
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.financialYears.filter(c => {
              return c.id != id
            })
            self.financialYears = tempCategories
            self.trigger('financial_years_changed', self.financialYears)
          }else if(data.status == 'e'){
            showToast("some error occured.",data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_financial_year', function(id, start_date, end_date) {
    let req = {}
    req.action = 'edit'
    req.id = id
    req.start_date = start_date
    req.end_date = end_date
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.financialYears = self.financialYears.map(c => {
              if(c.id == id){
                c.status = c.status
                c.start_date = start_date
                c.end_date = end_date
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('financial_years_changed', self.financialYears)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('activate_financial_year', function(id) {
    let req = {}
    req.action = 'activateFinancialYear'
    req.id = id
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('activate_financial_year_changed')
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_financial_year', function(start_date,end_date) {
    let req = {}
    req.action = 'add'
    req.start_date = start_date
    req.end_date = end_date
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.id = data.id
            cat.status = 'inactive'
            cat.start_date = start_date
		        cat.end_date = end_date
            self.financialYears = [cat, ...self.financialYears]
            self.trigger('financial_years_changed', self.financialYears)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('db_backup', function() {
    let req = {}
    req.action = 'db_backup'
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('db_backup_changed')
          }else if(data.status == 'e'){
            showToast("some error occured.",data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('db_store', function() {
    let req = {}
    req.action = 'db_store'
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('db_store_changed')
          }else if(data.status == 'e'){
            showToast("some error occured.",data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('db_running_amount', function() {
    let req = {}
    req.action = 'db_running_amount'
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('db_running_amount_changed')
          }else if(data.status == 'e'){
            showToast("some error occured.",data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('db_opening_stock', function() {
    let req = {}
    req.action = 'db_opening_stock'
    // return;
    $.ajax({
      url:'api/financial-year',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.trigger('db_opening_stock_changed')
          }else if(data.status == 'e'){
            showToast("some error occured.",data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

}
