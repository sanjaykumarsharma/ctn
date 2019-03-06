<issue-to-department-location-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Issue To Department (Location Wise)</h4>

<div show={issue_to_department_location_wise =='issue_to_department_location_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="issueRegisterItemWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-3">
      <div class="form-group">
        <label for="issueRegisterItemWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div> 
    <div class="col-md-2">
      <div class="form-group">
        <label for="adjustmentInput">Stock Adjustment</label>
        <select  id="adjustmentInput" class="form-control">
          <option value="N">N</option>
          <option value="Y">Y</option>
        </select>
      </div>
    </div>
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readIssue} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-1">
      <div class="form-group">
         <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick={excelExport}>
      </div>   
    </div>
  </div>
  <div class="row">
    <div class="col-sm-4">  
        <div class="form-group">
          <table class="table table-bordered">
            <th class="serial-col">#</th>
            <th>Stock Type</th>
            <tr each={m, i in stock_types}>
                <td style="width:50px"><input type="checkbox" checked={m.selected} id="{'selectStockTypeFilter' + m.stock_type_code}" onclick={selectStockType.bind(this,m)} class="form-control" style="margin-top: 5px;"></td>
                <td>{m.stock_type}</td>
            </tr>
           </table>
        </div>
    </div>
    <div class="col-md-4">
      <div class="form-group">
         <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th><input type="search" name="searchLocation" class="form-control" placeholder="Search Location" onkeyup={filterLocations}></th>
          </tr>
          <tr each={cat, i in pagedDataItems}>
            <td><input type="checkbox" class="form-control" id="{i}" checked={cat.selected} onclick={selectLocation.bind(this, cat)}></td>
            <td>{cat.location}</td>
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
    </div>
    <!-- selected party -->
    <div class="col-md-4">
      <div class="form-group">
        <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th>Selected Location</th>
            <th></th>
          </tr>
          <tr each={cat, i in checkedLocations}>
            <td>{i+1}</td>
            <td>{cat.location}</td>
            <td>
              <button class="btn btn-secondary" disabled={loading} onclick={removeDepartment.bind(this, cat)}><i class="material-icons">remove</i></button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={issue_to_department_location_wise =='issue_to_department_location_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>Issue To Department (Location Wise)<br> From {issueFrom} To {issueTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
  <h5>Location: <b>{m.location}</b></h5>
   <table class="table table-bordered bill-info-table print-small">
    <tr>
     <th>Sl</th>
     <th>Issue No</th>
     <th>Issue Date</th>
     <th>Issue By</th>
     <th>Receive By</th>
     <th>Item</th>
     <th>Department</th>
     <th>Unit</th>
     <th>Qty</th>
     <th>Rate</th>
     <th>Amount</th>
     <th>Chargehead</th>
    </tr> 
    <tr each={t, k in m.issues} no-reorder>
     <td>{k+1}</td>
     <td>{t.stock_type_code}{t.issue_no}</td>
     <td>{t.issue_date}</td>
     <td>{t.approve_by}</td>
     <td>{t.receive_by}</td>
     <td>{t.item_name}-(Code:{t.item_id})</td>
     <td>{t.department}</td>
     <td>{t.uom_code}</td>
     <td style="text-align:right">{t.qty}</td>
     <td style="text-align:right">{t.rate}</td>
     <td style="text-align:right">{t.amount}</td>
     <td>{t.chargehead}</td>
    </tr>
  </table>
</div> <!-- report main loop -->
  <table class="table table-bordered bill-info-table print-small">
    <tr>
      <td style="text-align:right">Grand Total Qty</td>
      <td style="text-align:right">{qty_grand_total}</td>
      <td style="text-align:right">Grand Total Amount</td>
      <td style="text-align:right">{amount_grand_total}</td>
    </tr>
  </table>
 </div><!-- main div -->


<script>
    var self = this
    self.checkedLocations=[]
    self.on("mount", function(){
      dateFormat('issueRegisterItemWiseStartDateInput')
      dateFormat('issueRegisterItemWiseEndDateInput')
      self.issue_to_department_location_wise='issue_to_department_location_wise_home'
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('read_locations')
      self.update()
    })

    self.excelExport = () => {
      if (self.issueRegisterItemWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.issueRegisterItemWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }

      var selectedStockTypeString=''

      self.stock_types.map(i=>{
        if(i.selected==true){
          if(selectedStockTypeString==''){
            selectedStockTypeString="'"+i.stock_type_code+"'"
          }else{
            selectedStockTypeString=selectedStockTypeString+",'"+i.stock_type_code+"'"
          }
        }
      })
      
      var selected_location_id=''
    
      self.checkedLocations.map(t => {
          if(selected_location_id==''){
            selected_location_id="'"+t.location+"'"
          }else if(selected_location_id!=''){
            selected_location_id=selected_location_id+','+"'"+t.location+"'"
          }
       })

     var link="csv/issue_to_department_location_wise_csv.php?start_date="+self.issueRegisterItemWiseStartDateInput.value+"&end_date="+self.issueRegisterItemWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString+"&location_id="+selected_location_id+"&stock_adjustment="+self.adjustmentInput.value;
      console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

    /********************************* department filter start*************************/
    self.filterLocations = () => {
      if(!self.searchLocation) return
      self.filteredLocations = self.locations.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchLocation.value.toLowerCase())>=0
      })

      self.paginate(self.filteredLocations, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page)
    }

   self.selectLocation = (t,e) => {
    self.checkedLocations.push(t)
    
    self.locations = self.locations.filter(c => {
      return c.location_id!=t.location_id
    })
    self.pagedDataItems = self.pagedDataItems.filter(c => {
      return c.location_id!=t.location_id
    })

   }

   self.removeDepartment = (t,e) => {
     self.checkedLocations = self.checkedLocations.filter(c => {
      return c.location_id!=t.location_id
    })
     console.log(self.checkedLocations)
    
    self.locations.push(t)
    self.pagedDataItems.push(t)
   }
  /********************************* department filter end***************************/

    self.setStartDate = () => {
      self.sd=self.issueRegisterItemWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.issueRegisterItemWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.issue_to_department_location_wise='issue_to_department_location_wise_home'
    }

    self.selectStockType = (item,e) => {
      item.selected=!e.item.m.selected
      console.log(self.stock_types)

      var selectedStockTypeString=''

      self.stock_types.map(i=>{
      	if(i.selected==true){
      		if(selectedStockTypeString==''){
      			selectedStockTypeString="'"+i.stock_type_code+"'"
      		}else{
      			selectedStockTypeString=selectedStockTypeString+",'"+i.stock_type_code+"'"
      		}
      	}
      })
      self.stock_type=selectedStockTypeString
    } 

    self.readIssue = () => {
      if (self.issueRegisterItemWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.issueRegisterItemWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }

      var selectedStockTypeString=''

      self.stock_types.map(i=>{
      	if(i.selected==true){
      		if(selectedStockTypeString==''){
      			selectedStockTypeString="'"+i.stock_type_code+"'"
      		}else{
      			selectedStockTypeString=selectedStockTypeString+",'"+i.stock_type_code+"'"
      		}
      	}
      })
      
      var selected_location_id=''
    
      self.checkedLocations.map(t => {
          if(selected_location_id==''){
            selected_location_id="'"+t.location+"'"
          }else if(selected_location_id!=''){
            selected_location_id=selected_location_id+','+"'"+t.location+"'"
          }
       })
      
      self.loading=true
      RiotControl.trigger('read_issue_to_department_location_wise',self.issueRegisterItemWiseStartDateInput.value,self.issueRegisterItemWiseEndDateInput.value,selectedStockTypeString,selected_location_id,self.adjustmentInput.value)
    }

    
    RiotControl.on('read_issue_to_department_location_wise_changed', function(mainArray, qty_grand_total, amount_grand_total) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.qty_grand_total=qty_grand_total
      self.amount_grand_total=amount_grand_total
      self.issue_to_department_location_wise='issue_to_department_location_wise_report'
      self.issueFrom=self.issueRegisterItemWiseStartDateInput.value
      self.issueTo=self.issueRegisterItemWiseEndDateInput.value
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('locations_changed', function(locations) {
      self.locations = locations
      self.checkedLocations=[]
      self.locations = locations
      self.filteredLocations = locations

      self.items_per_page = 10
      self.paginate(self.filteredLocations, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page)
      self.update()
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
      self.pagedDataItems = self.getPageData(self.filteredLocations, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredLocations, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/
    

</script>    
</issue-to-department-location-wise>
