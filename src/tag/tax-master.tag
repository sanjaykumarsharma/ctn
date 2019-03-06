<tax-master>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Tax</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchTax" class="form-control" placeholder="search" onkeyup={filterTaxes} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshTaxes}><i class="material-icons">refresh</i></button>

          <button class="btn btn-secondary" disabled={loading} onclick={showTaxModal}><i class="material-icons">add</i></button>

        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">

      <!-- <tr class="input-row">
        <td colspan="2"><input type="text" name="addTaxCodeInput" placeholder="Code" class="form-control" onkeyup={addEnter}></td>
        <td><input type="text" name="addTaxInput" placeholder="Tax" class="form-control" onkeyup={addEnter}></td>
        <td class="two-buttons"><button class="btn btn-primary w-100" onclick={add}>Add</button></td>
      </tr> -->

      <tr>
        <th class="serial-col">#</th>
        <th onclick={sortByTax} style="cursor: pointer;">
          Tax
          <hand if={activeSort=='sortTax'}>
           <i class="material-icons" show={sortTax}>arrow_upward</i> 
           <i class="material-icons" hide={sortTax}>arrow_downward</i>
          <hand>
        </th>
        <th onclick={sortByTaxType} style="cursor: pointer;">
          Tax Type
           <hand if={activeSort=='sortTaxType'}>
            <i class="material-icons" show={sortTaxType}>arrow_upward</i> 
            <i class="material-icons" hide={sortTaxType}>arrow_downward</i>
           </hand>
        </th>
        <th onclick={sortByTaxRate} style="cursor: pointer;">
          Tax Rate
          <hand if={activeSort=='sortTaxRate'}>
           <i class="material-icons" show={sortTaxRate}>arrow_upward</i> 
           <i class="material-icons" hide={sortTaxRate}>arrow_downward</i>
          <hand>
        </th>
        <th onclick={sortByTaxGroup} style="cursor: pointer;">
          Tax Group
           <hand if={activeSort=='sortTaxGroup'}>
            <i class="material-icons" show={sortTaxGroup}>arrow_upward</i> 
            <i class="material-icons" hide={sortTaxGroup}>arrow_downward</i>
           </hand>
        </th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={cat, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td>{cat.tax}</td>
        <td>{cat.tax_type}</td>
        <td>{cat.tax_rate}</td>
        <td>{cat.tax_group}</td>
        <td>
          <div class="table-buttons" hide={cat.confirmDelete ||  cat.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={edit.bind(this, cat)}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
          </div>
          <div class="table-buttons" if={cat.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
          <!-- <div class="table-buttons" if={cat.confirmEdit}>
            <button disabled={loading} class="btn btn-primary btn-sm" onclick={edit.bind(this, cat)}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div> -->
        </td>
      </tr>
      <tfoot>
        <tr>
          <td colspan="6">
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

  <div class="modal fade" id="taxModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	        <h4 class="modal-title" id="myModalLabel">{title} Tax</h4>
	      </div>
	      <div class="modal-body">
	        
					<div class="form-group row">
					  <label for="taxValue" class="col-xs-4 col-form-label">Tax</label>
					  <div class="col-xs-8">
					    <input class="form-control" type="text" id="taxValue">
					  </div>
					</div>

          <div class="form-group row">
            <label for="taxType" class="col-xs-4 col-form-label">Type</label>
            <div class="col-xs-8">
              <input class="form-control" type="text" id="taxType">
            </div>
          </div>

          <div class="form-group row">
            <label for="taxRate" class="col-xs-4 col-form-label">Tax Rate</label>
            <div class="col-xs-8">
              <input class="form-control" type="text" id="taxRate">
            </div>
          </div>

          <div class="form-group row">
            <label for="taxGroup" class="col-xs-4 col-form-label">Group</label>
            <div class="col-xs-8">
              <select name="taxGroup" class="form-control">
                <option value="Tax">Tax</option>
                <option value="Duty">Duty</option>
                <option value="Cess">Cess</option>
              </select>
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

  <script>
    var self = this
    self.on("mount", function(){
      self.loading = true
      self.sortTax = true
      self.sortTaxType = true
      self.sortTaxRate = true
      self.sortTaxGroup = true
      self.activeSort='';
      self.update()
      //RiotControl.trigger('login_init')
      RiotControl.trigger('read_taxes')
    })

     self.refreshTaxes = () => {
      self.taxes = []
      self.searchTax.value;
      RiotControl.trigger('read_taxes')
    }

    self.filterTaxes = () => {
      if(!self.searchTax) return
      self.filteredTaxes = self.taxes.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchTax.value.toLowerCase())>=0
      })
      self.paginate(self.filteredTaxes, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredTaxes, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.taxes.map(c => {
        if(c.tax_id != e.item.cat.tax_id){
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
      RiotControl.trigger('delete_tax', e.item.cat.tax_id)
    }

    self.edit = (t,e) => {
      self.title='Edit'		
      $("#taxModal").modal('show') 	

	  self.taxValue.value= t.tax
	  self.taxType.value= t.tax_type
    self.taxRate.value= t.tax_rate
	  self.taxGroup.value= t.tax_group
	  self.tax_id=t.tax_id // id to update the item
    self.update()
    }

    self.save = () => {
      
      if(!self.taxRate.value){
        toastr.info("Please enter a valid Tax Rate and try again")
      }else  if(!self.taxValue.value){
        toastr.info("Please enter a valid Tax and try again")
      }else  if(!self.taxType.value){
        toastr.info("Please enter a valid Tax Type and try again")
      }else if(self.title=='Add'){  //add data to database after validation
         self.loading = true
        RiotControl.trigger('add_tax', self.taxValue.value, self.taxType.value, self.taxRate.value, self.taxGroup.value)
      }else if(self.title=='Edit'){
      	 self.loading = true
         RiotControl.trigger('edit_tax', self.tax_id, self.taxValue.value, self.taxType.value, self.taxRate.value, self.taxGroup.value)
      }
      
    }

    self.cancelOperation = (e) => {
      self.taxes.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    self.showTaxModal = () => {
        self.title='Add'	
    	$("#taxModal").modal('show')
    }

    RiotControl.on('taxes_changed', function(taxes) {
      $("#taxModal").modal('hide') 	
	    self.taxValue.value=''
	    self.taxType.value=''
      self.taxRate.value=''
	    self.taxGroup.value=''
      self.loading = false
      self.taxes = taxes
      self.filteredTaxes = taxes

      self.items_per_page = 10
      self.callPaging()
      self.update()
    })

    self.callPaging=()=>{
      self.paginate(self.filteredTaxes, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredTaxes, 1, self.items_per_page)
    }


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
      self.pagedDataItems = self.getPageData(self.filteredTaxes, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredTaxes, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredTaxes, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/

    /*sorting Starts*/  
    self.sortByTax = () =>{

      if(self.sortTax==true){
        self.taxes.sort(function(a, b) {
          return (a.tax.toUpperCase()).localeCompare((b.tax.toUpperCase()));
        });
      }else{
        self.taxes.reverse()
      }
 
      self.activeSort='sortTax'      
      self.filteredTaxes = self.taxes
      self.callPaging()
      
      self.update();
      self.sortTax=!self.sortTax
    }

    self.sortByTaxType = () =>{

      if(self.sortTaxType==true){
        self.taxes.sort(function(a, b) {
          return (a.tax_type.toUpperCase()).localeCompare((b.tax_type.toUpperCase()));
        });
      }else{
        self.taxes.reverse()
      }

      self.activeSort='sortTaxType'
      self.filteredTaxes = self.taxes
      self.callPaging()
      
      self.update();
      self.sortTaxType=!self.sortTaxType
    }


    self.sortByTaxRate = () =>{

      if(self.sortTaxRate==true){
        self.taxes.sort(function(a, b) {
          return a.tax_rate - b.tax_rate;
        });
      }else{
        self.taxes.reverse()
      }
 
      self.activeSort='sortTaxRate'      
      self.filteredTaxes = self.taxes
      self.callPaging()
      
      self.update();
      self.sortTaxRate=!self.sortTaxRate
    }

    self.sortByTaxGroup = () =>{

      if(self.sortTaxGroup==true){
        self.taxes.sort(function(a, b) {
          return (a.tax_group.toUpperCase()).localeCompare((b.tax_group.toUpperCase()));
        });
      }else{
        self.taxes.reverse()
      }

      self.activeSort='sortTaxGroup'
      self.filteredTaxes = self.taxes
      self.callPaging()
      
      self.update();
      self.sortTaxGroup=!self.sortTaxGroup
    }
   
   /*sorting Ends*/

  </script>
</tax-master>
