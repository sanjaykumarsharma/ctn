function StockLedgerStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.stockLedgers = []

  self.on('read_stockLedgers', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/ledger',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.stockLedgers = data.stockLedgers
            self.trigger('stockLedgers_changed', self.stockLedgers)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_ledger', function(ledger_id) {
    let req = {}
    req.action = 'delete'
    req.ledger_id = ledger_id
    // return;
    $.ajax({
      url:'api/ledger',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.stockLedgers.filter(c => {
              return c.ledger_id != ledger_id
            })
            self.stockLedgers = tempCategories
            self.trigger('stockLedgers_changed', self.stockLedgers)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_ledger', function(ledger_id, ledger_code, ledger) {
    let req = {}
    req.action = 'edit'
    req.ledger_id = ledger_id
    req.ledger_code = ledger_code
    req.ledger = ledger
    // return;
    $.ajax({
      url:'api/ledger',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.stockLedgers = self.stockLedgers.map(c => {
              if(c.ledger_id == ledger_id){
                c.ledger_code = ledger_code
                c.ledger = ledger
              }
              c.confirmEdit = false
              return c
            })
            self.trigger('stockLedgers_changed', self.stockLedgers)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_ledger', function(ledger_code,ledger) {
    let req = {}
    req.action = 'add'
    req.ledger_code = ledger_code
    req.ledger = ledger
    // return;
    $.ajax({
      url:'api/ledger',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.ledger_id = data.ledger_id
            cat.ledger_code = ledger_code
            cat.ledger = ledger
            self.stockLedgers = [cat, ...self.stockLedgers]
            self.trigger('stockLedgers_changed', self.stockLedgers)
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
