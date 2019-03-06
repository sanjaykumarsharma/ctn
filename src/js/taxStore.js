function TaxStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.taxes = []

  self.on('read_taxes', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/tax',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.taxes = data.taxes
            self.trigger('taxes_changed', self.taxes)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_tax', function(tax_id) {
    let req = {}
    req.action = 'delete'
    req.tax_id = tax_id
    // return;
    $.ajax({
      url:'api/tax',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.taxes.filter(c => {
              return c.tax_id != tax_id
            })
            self.taxes = tempCategories
            self.trigger('taxes_changed', self.taxes)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_tax', function(tax_id, tax, tax_type, tax_rate, tax_group) {
    let req = {}
    req.action = 'edit'
    req.tax_id = tax_id
    req.tax = tax
    req.tax_type = tax_type
    req.tax_rate = tax_rate
    req.tax_group = tax_group
    // return;
    $.ajax({
      url:'api/tax',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.taxes = self.taxes.map(c => {
              if(c.tax_id == tax_id){
                c.tax = tax
                c.tax_type = tax_type
                c.tax_rate = tax_rate
			          c.tax_group = tax_group
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('taxes_changed', self.taxes)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_tax', function(tax,tax_type,tax_rate,tax_group) {
    let req = {}
    req.action = 'add'
    req.tax = tax
    req.tax_type = tax_type
    req.tax_rate = tax_rate
    req.tax_group = tax_group
    // return;
    $.ajax({
      url:'api/tax',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.tax_id = data.tax_id
            cat.tax = tax
            cat.tax_type = tax_type
            cat.tax_rate = tax_rate
		        cat.tax_group = tax_group
            self.taxes = [cat, ...self.taxes]
            self.trigger('taxes_changed', self.taxes)
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
