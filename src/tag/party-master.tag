<party-master>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Party</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchParty" class="form-control" placeholder="search" onkeyup={filterPartyes} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshParties}><i class="material-icons">refresh</i></button>

          <button class="btn btn-secondary" disabled={loading} onclick={showPartyModal}><i class="material-icons">add</i></button>

        </div>
      </div>
    </div>
  </div>
          
  <div class="col-sm-12">
    <table class="table table-bordered">
      <tr>
        <th class="serial-col">#</th>
        <th>Code</th>
        <th onclick={sortByParty} style="cursor: pointer;width:200px">
          Party
           <hand if={activeSort=='sortparty'}>
            <i class="material-icons" show={sortparty}>arrow_upward</i> 
            <i class="material-icons" hide={sortparty}>arrow_downward</i>
           </hand>
        </th>
        <th>Address</th>
        <th>Phone(O)</th>
        <th>Phone(R)</th>
        <th>Mobile</th>
        <th>Email</th>
        <!-- <th>Vat</th>
        <th>Cst</th>
        <th>Excise</th>
        <th>Pan</th> -->
        <th style="width:150px"></th>
      </tr>
      <tr each={cat, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td>{cat.party_code}</td>
        <td>{cat.party_name}</td>
        <td>{cat.address}</td>
        <td>{cat.phone_office}</td>
        <td>{cat.phone_residance}</td>
        <td>{cat.mobile}</td>
        <td>{cat.email}</td>
        <!-- <td>{cat.vat}</td>
        <td>{cat.cst}</td>
        <td>{cat.excise}</td>
        <td>{cat.pan}</td> -->
        <td>
          <div class="table-buttons" hide={cat.confirmDelete ||  cat.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={view.bind(this, cat)}><i class="material-icons">visibility</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={edit.bind(this, cat)}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
          </div>
          <div class="table-buttons" if={cat.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
        </td>
      </tr>
      <tfoot>
        <tr>
          <td colspan="9">
            <div class="right-align">
              Items Per Page: <select class="p1 mb0 rounded inline" onchange={changeItemsPerPage}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              Page No: <select class="p1 mb0 rounded inline" name="page_select" onchange={changePage}>
                <option each={pno in page_array} value={pno}>{pno}</option>
              </select>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="modal fade" id="partyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	  <div class="modal-dialog modal-lg" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	        <h4 class="modal-title" id="myModalLabel">{title} Party</h4>
	      </div>
	      <div class="modal-body">
	        
	        <div class="row">
	           <div class="col-md-6">
	           		<div class="form-group row">
      					  <label for="partyCodeInput" class="col-xs-4 col-form-label">Party Code</label>
      					  <div class="col-xs-8">
      					    <input class="form-control" type="text" id="partyCodeInput">
      					  </div>
      					</div>

      					<div class="form-group row">
      					  <label for="addLine1Input" class="col-xs-4 col-form-label">AddLine1</label>
      					  <div class="col-xs-8">
      					    <input class="form-control" type="text" id="addLine1Input">
      					  </div>
      					</div>

                <div class="form-group row">
      					  <label for="cityInput" class="col-xs-4 col-form-label">City</label>
      					  <div class="col-xs-8">
      					    <input class="form-control" type="text" id="cityInput">
      					  </div>
      					</div>

                <div class="form-group row">
                  <label for="pinInput" class="col-xs-4 col-form-label">PinCode</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="pinInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="phoneOfficeInput" class="col-xs-4 col-form-label">Phone Office</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="phoneOfficeInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="emailInput" class="col-xs-4 col-form-label">Email</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="emailInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="cstInput" class="col-xs-4 col-form-label">Cst No</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="cstInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="panInput" class="col-xs-4 col-form-label">Pan No</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="panInput">
                  </div>
                </div>
	           </div>


	           <div class="col-md-6">
      					<div class="form-group row">
      					  <label for="partyNameInput" class="col-xs-4 col-form-label">Name</label>
      					  <div class="col-xs-8">
      					    <input class="form-control" type="text" id="partyNameInput">
      					  </div>
      					</div>

                <div class="form-group row">
                  <label for="addLine2Input" class="col-xs-4 col-form-label">AddLine2</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="addLine2Input">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="stateInput" class="col-xs-4 col-form-label">State</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="stateInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="mobileInput" class="col-xs-4 col-form-label">Mobile</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="mobileInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="phoneResidenceInput" class="col-xs-4 col-form-label">Phone Residence</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="phoneResidenceInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="vatInput" class="col-xs-4 col-form-label">Vat No</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="vatInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="exciseInput" class="col-xs-4 col-form-label">Excise No</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="exciseInput">
                  </div>
                </div>

                <div class="form-group row">
                  <label for="gstInput" class="col-xs-4 col-form-label">GSTIN</label>
                  <div class="col-xs-8">
                    <input class="form-control" type="text" id="gstInput">
                  </div>
                </div>
	           </div>
	        	
	        </div>

	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
	        <button type="button" class="btn btn-primary" onclick={save}>Save changes</button>
	      </div>
	    </div>
	  </div>
  </div>


  <div class="modal fade" id="partyModalView" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          
          <div class="row">
             <div class="col-md-6">
                <div class="form-group row">
                  <label class="col-xs-4 ">Party Code : </label>
                  <div class="col-xs-8">
                      {partyView.party_code}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="addLine1Input" class="col-xs-4">AddLine1 : </label>
                  <div class="col-xs-8">
                    {partyView.add_line1}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="cityInput" class="col-xs-4">City : </label>
                  <div class="col-xs-8">
                    {partyView.city}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="pinInput" class="col-xs-4">PinCode : </label>
                  <div class="col-xs-8">
                    {partyView.pin}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="phoneOfficeInput" class="col-xs-4">Phone Office : </label>
                  <div class="col-xs-8">
                    {partyView.phone_office}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="emailInput" class="col-xs-4">Email : </label>
                  <div class="col-xs-8">
                    {partyView.email}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="cstInput" class="col-xs-4">Cst No : </label>
                  <div class="col-xs-8">
                    {partyView.cst}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="panInput" class="col-xs-4">Pan No : </label>
                  <div class="col-xs-8">
                    {partyView.pan}
                  </div>
                </div>
             </div>


             <div class="col-md-6">
                <div class="form-group row">
                  <label for="partyNameInput" class="col-xs-4">Name : </label>
                  <div class="col-xs-8">
                    {partyView.party_name}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="addLine2Input" class="col-xs-4">AddLine2 : </label>
                  <div class="col-xs-8">
                    {partyView.add_line2}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="stateInput" class="col-xs-4">State : </label>
                  <div class="col-xs-8">
                    {partyView.state}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="mobileInput" class="col-xs-4">Mobile : </label>
                  <div class="col-xs-8">
                    {partyView.mobile}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="phoneResidenceInput" class="col-xs-4">Phone Residence:</label>
                  <div class="col-xs-8">
                    {partyView.phone_residence}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="vatInput" class="col-xs-4">Vat No : </label>
                  <div class="col-xs-8">
                    {partyView.vat}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="exciseInput" class="col-xs-4">Excise No : </label>
                  <div class="col-xs-8">
                    {partyView.excise}
                  </div>
                </div>

                <div class="form-group row">
                  <label for="gstInput" class="col-xs-4">GSTIN : </label>
                  <div class="col-xs-8">
                    {partyView.gst}
                  </div>
                </div>
             </div>
            
          </div>

        </div>
        
      </div>
    </div>
  </div>

  <script>
    var self = this
    self.on("mount", function(){
      self.loading = true
      self.sortparty = true
      self.activeSort='';
      self.update()
      //RiotControl.trigger('login_init')
      RiotControl.trigger('read_parties')
    })

     self.refreshParties = () => {
      self.parties = []
      self.searchParty.value;
      RiotControl.trigger('read_parties')
    }

    self.filterPartyes = () => {
      if(!self.searchParty) return
      self.filteredParties = self.parties.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase())>=0
      })

      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.parties.map(c => {
        if(c.party_id != e.item.cat.party_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.delete = (e) => {
      self.loading = true
      RiotControl.trigger('delete_party', e.item.cat.party_id)
    }

    self.edit = (t,e) => {
      self.title='Edit'		
      $("#partyModal").modal('show') 	

      self.partyCodeInput.value=t.party_code
      self.addLine1Input.value=t.add_line1
      self.cityInput.value=t.city
      self.pinInput.value=t.pin
      self.phoneOfficeInput.value=t.phone_office
      self.emailInput.value=t.email
      self.cstInput.value=t.cst
      self.panInput.value=t.pan
      self.partyNameInput.value=t.party_name
      self.addLine2Input.value=t.add_line2
      self.stateInput.value=t.state
      self.mobileInput.value=t.mobile
      self.phoneResidenceInput.value=t.phone_residence
      self.vatInput.value=t.vat
      self.exciseInput.value=t.excise
      self.gstInput.value=t.gst
	    self.party_id=t.party_id // id to update the item
    }

    self.view = (t,e) => {
      $("#partyModalView").modal('show')  

      self.partyView=t;
    }

    self.save = () => {
      /*if(!self.partyCodeInput.value){
        toastr.info("Please enter a valid Party Code and try again")
        return
      }*/
      if(!self.partyNameInput.value){
        toastr.info("Please enter a valid Party Name try again")
        return
      }
      
       var obj={}
          obj['partyCode']=self.partyCodeInput.value
          obj['addLine1']=self.addLine1Input.value
          obj['city']=self.cityInput.value
          obj['pin']=self.pinInput.value
          obj['phoneOffice']=self.phoneOfficeInput.value
          obj['email']=self.emailInput.value
          obj['cst']=self.cstInput.value
          obj['pan']=self.panInput.value
          obj['partyName']=self.partyNameInput.value
          obj['addLine2']=self.addLine2Input.value
          obj['state']=self.stateInput.value
          obj['mobile']=self.mobileInput.value
          obj['phoneResidence']=self.phoneResidenceInput.value
          obj['vat']=self.vatInput.value
          obj['excise']=self.exciseInput.value
          obj['gst']=self.gstInput.value

      if(self.title=='Add'){  //add data to database after validation
         self.loading = true
          RiotControl.trigger('add_party', obj)
      }else if(self.title=='Edit'){
      	 self.loading = true
         obj['party_id']=self.party_id
         RiotControl.trigger('edit_party', obj)
      }
      
    }

    self.cancelOperation = (e) => {
      self.parties.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    self.showPartyModal = () => {
        self.title='Add'	
    	$("#partyModal").modal('show')
    }

    RiotControl.on('parties_changed', function(parties) {
      $("#partyModal").modal('hide') 	
      /*self.partyCode.value=''
	  self.partyValue.value=''
	  self.partyType.value=''
	  self.partyRate.value=''
	  self.addRate.value=''*/
      self.loading = false
      self.parties = parties
      self.filteredParties = parties

      self.items_per_page = 10
      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
      self.update()
    })

    /**************** pagination *******************/
    self.getPageData = (full_data, page_no, items_per_page) => {
      let start_index = (page_no - 1)*items_per_page
      let end_index = page_no * items_per_page
      let items = full_data.filter((fd, i) => {
        if(i >= start_index && i < end_index) return true
      })
      return items
    }

    self.paginate = (full_data, items_per_page) => {
      let total_pages = Math.ceil(full_data.length/items_per_page)
      let pages = []
      for(var i = 1; i <= total_pages; i++){
        pages.push(i)
      }
      self.page_array = pages
      self.current_page_no = 1;
      self.update()
    }
    self.changePage = (e) => {
      self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/

    /*sorting Starts*/  
    self.sortByParty = () =>{

      if(self.sortparty==true){
        self.parties.sort(function(a, b) {
          return (a.party_name.toUpperCase()).localeCompare((b.party_name.toUpperCase()));
        });
      }else{
        self.parties.reverse()
      }
 
      self.activeSort='sortparty'      
      self.filteredParties = self.parties
      
      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
      
      self.update();
      self.sortparty=!self.sortparty
    }
   
   /*sorting Ends*/

  </script>
</party-master>
