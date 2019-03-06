function PartyStore() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.parties = []

  self.on('read_parties', function() {
    let req = {}
    req.action = 'read'
    // return;
    $.ajax({
      url:'api/party',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.parties = data.parties
            self.trigger('parties_changed', self.parties, data.party)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('delete_party', function(party_id) {
    let req = {}
    req.action = 'delete'
    req.party_id = party_id
    // return;
    $.ajax({
      url:'api/party',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let tempCategories = self.parties.filter(c => {
              return c.party_id != party_id
            })
            self.parties = tempCategories
            self.trigger('parties_changed', self.parties)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('edit_party', function(obj) {
    let req = {}
    req.action = 'edit'
    req.party_id = obj.party_id
    req.party_code=obj.partyCode
    req.add_line1=obj.addLine1
    req.city=obj.city
    req.pin=obj.pin
    req.phone_office=obj.phoneOffice
    req.email=obj.email
    req.cst=obj.cst
    req.pan=obj.pan
    req.party_name=obj.partyName
    req.add_line2=obj.addLine2
    req.state=obj.state
    req.mobile=obj.mobile
    req.phone_residence=obj.phoneResidence
    req.vat=obj.vat
    req.excise=obj.excise
    req.gst=obj.gst
    // return;
    $.ajax({
      url:'api/party',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            self.parties = self.parties.map(cat => {
              if(cat.party_id == obj.party_id){
                cat.party_id = obj.party_id
                cat.party_code=obj.partyCode
                cat.add_line1=obj.addLine1
                cat.city=obj.city
                cat.pin=obj.pin
                cat.phone_office=obj.phoneOffice
                cat.email=obj.email
                cat.cst=obj.cst
                cat.pan=obj.pan
                cat.party_name=obj.partyName
                cat.add_line2=obj.addLine2
                cat.state=obj.state
                cat.mobile=obj.mobile
                cat.phone_residence=obj.phoneResidence
                cat.vat=obj.vat
                cat.excise=obj.excise
                cat.gst=obj.gst
                cat.address=obj.addLine1 + ', ' + obj.addLine2 + ', ' + obj.city + ', ' + obj.state + ', ' + obj.pin
              }
              cat.confirmEdit = false
              return cat
            })
            self.trigger('parties_changed', self.parties)
          }else if(data.status == 'e'){
            showToast("Invalid Username or password. Please try again.", data)
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('add_party', function(obj) {
    console.log(obj)
    let req = {}
    req.action = 'add'
    req.party_code=obj.partyCode
    req.add_line1=obj.addLine1
    req.city=obj.city
    req.pin=obj.pin
    req.phone_office=obj.phoneOffice
    req.email=obj.email
    req.cst=obj.cst
    req.pan=obj.pan
    req.party_name=obj.partyName
    req.add_line2=obj.addLine2
    req.state=obj.state
    req.mobile=obj.mobile
    req.phone_residence=obj.phoneResidence
    req.vat=obj.vat
    req.excise=obj.excise
    req.gst=obj.gst
    // return;
    $.ajax({
      url:'api/party',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          if(data.status == 's'){
            let cat = {}
            cat.party_id = data.party_id
            cat.party_code=obj.partyCode
            cat.add_line1=obj.addLine1
            cat.city=obj.city
            cat.pin=obj.pin
            cat.phone_office=obj.phoneOffice
            cat.email=obj.email
            cat.cst=obj.cst
            cat.pan=obj.pan
            cat.party_name=obj.partyName
            cat.add_line2=obj.addLine2
            cat.state=obj.state
            cat.mobile=obj.mobile
            cat.phone_residence=obj.phoneResidence
            cat.vat=obj.vat
            cat.excise=obj.excise
            cat.gst=obj.gst
            cat.address=obj.addLine1 + ', ' + obj.addLine2 + ', ' + obj.city + ', ' + obj.state + ', ' + obj.pin
		    
            self.parties = [cat, ...self.parties]
            self.trigger('parties_changed', self.parties)
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
