<financial-year-master>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Financial Year</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchFinancialYear" class="form-control" placeholder="search" onkeyup={filterFinancialYears} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshFinancialYears}><i class="material-icons">refresh</i></button>

          <button class="btn btn-secondary" disabled={loading} onclick={showFinancialYearModal}><i class="material-icons">add</i></button>

        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">
      <tr>
        <th class="serial-col">#</th>
        <th>Financial Year Start Date</th>
        <th>Financial Year End Date</th>
        <th>status</th>
        <th></th>
      </tr>
      <tr each={cat, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td>{cat.start_date}</td>
        <td>{cat.end_date}</td>
        <td>{cat.status}</td>
        <td>
          <div class="table-buttons" hide={cat.confirmDelete ||  cat.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={edit.bind(this, cat)}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={activateFinancialYear.bind(this, cat)}><i class="material-icons">check_circle</i></button>
          </div>
          <div class="table-buttons" if={cat.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
        </td>
      </tr>
      <tfoot>
        <tr>
          <td colspan="5">
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

  <div class="modal fade" id="financialYearModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	        <h4 class="modal-title" id="myModalLabel">{title} Financial Year</h4>
	      </div>
	      <div class="modal-body">
	        
					<div class="form-group row">
					  <label for="startDateInput" class="col-xs-4 col-form-label">Start Date</label>
					  <div class="col-xs-8">
					    <input class="form-control" type="text" id="startDateInput" placeholder="DD/MM/YYYY">
					  </div>
					</div>

          <div class="form-group row">
            <label for="endDateInput" class="col-xs-4 col-form-label">End Date</label>
            <div class="col-xs-8">
              <input class="form-control" type="text" id="endDateInput" placeholder="DD/MM/YYYY">
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

  <div class="modal fade" id="financialYearActivateModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">Financial Year Activate</h4>
        </div>
        <div class="modal-body">
          
          <h4>Are you sure to activat this financial year</h4>
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick={saveActivateFinancialYear}>Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    var self = this
    self.on("mount", function(){
      self.loading = true
      self.update()
      //RiotControl.trigger('login_init')
      RiotControl.trigger('read_financial_year')
    })

     self.refreshFinancialYears = () => {
      self.financialYears = []
      self.searchFinancialYear.value='';
      RiotControl.trigger('read_financial_year')
    }

    self.filterFinancialYears = () => {
      if(!self.searchFinancialYear) return
      self.filteredFinancialYears = self.financialYears.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchFinancialYear.value.toLowerCase())>=0
      })

      self.paginate(self.filteredFinancialYears, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredFinancialYears, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.financialYears.map(c => {
        if(c.id != e.item.cat.id){
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
      RiotControl.trigger('delete_financial_year', e.item.cat.id)
    }

    self.edit = (t,e) => {
      self.title='Edit'   
      $("#financialYearModal").modal('show')  

    self.startDateInput.value= t.start_date
    self.endDateInput.value= t.end_date
    self.id=t.id // id to update the item
    }
    self.activateFinancialYear = (t,e) => {
      $("#financialYearActivateModal").modal('show')
      self.activate_financial_year_id=t.id
      
    }
    self.saveActivateFinancialYear = () => {
      RiotControl.trigger('activate_financial_year', self.activate_financial_year_id)
    }

    self.save = () => {
      
      if(!self.startDateInput.value){
        toastr.info("Please enter a valid Financial Year Start Date and try again")
      }else  if(!self.endDateInput.value){
        toastr.info("Please enter a valid Financial Year End Date and try again")
      }else if(self.title=='Add'){  //add data to database after validation
         self.loading = true
        RiotControl.trigger('add_financial_year', self.startDateInput.value, self.endDateInput.value)
      }else if(self.title=='Edit'){
      	 self.loading = true
         RiotControl.trigger('edit_financial_year', self.id, self.startDateInput.value, self.endDateInput.value)
      }
      
    }

    self.cancelOperation = (e) => {
      self.financialYears.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    self.showFinancialYearModal = () => {
        self.title='Add'	
    	$("#financialYearModal").modal('show')
      self.update();
      dateFormat('startDateInput')
      dateFormat('endDateInput')
    }

    RiotControl.on('financial_years_changed', function(financialYears) {
      $("#financialYearModal").modal('hide')  
      self.startDateInput.value=''
      self.endDateInput.value=''
      self.loading = false
      self.financialYears = financialYears
      self.filteredFinancialYears = financialYears

      self.items_per_page = 10
      self.paginate(self.filteredFinancialYears, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredFinancialYears, 1, self.items_per_page)
      self.update()
    })

    RiotControl.on('activate_financial_year_changed', function() {
      $("#financialYearActivateModal").modal('hide')
	    self.refreshFinancialYears()
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
      self.pagedDataItems = self.getPageData(self.filteredFinancialYears, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredFinancialYears, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredFinancialYears, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/

  </script>
</financial-year-master>
