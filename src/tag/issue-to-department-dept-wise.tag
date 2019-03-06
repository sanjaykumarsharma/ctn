<issue-to-department-dept-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Issue To Department (Department Wise)</h4>

<div show={issue_to_department_dept_wise =='issue_to_department_dept_wise_home'} class="no-print">
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
            <th><input type="search" name="searchDepartment" class="form-control" placeholder="Search Departmnent" onkeyup={filterDepartments}></th>
          </tr>
          <tr each={cat, i in pagedDataItems}>
            <td><input type="checkbox" class="form-control" id="{i}" checked={cat.selected} onclick={selectDepartment.bind(this, cat)}></td>
            <td>{cat.department}</td>
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
            <th>Selected Department</th>
            <th></th>
          </tr>
          <tr each={cat, i in checkedDepartments}>
            <td>{i+1}</td>
            <td>{cat.department}</td>
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


<div  class="container-fluid print-box" show={issue_to_department_dept_wise =='issue_to_department_dept_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>Issue To Department (Department Wise)<br> From {issueFrom} To {issueTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
  <h5>Department: <b>{m.department}</b></h5>
   <table class="table table-bordered bill-info-table print-small">
    <tr>
     <th>Sl</th>
     <th>Issue No</th>
     <th>Issue Date</th>
     <th>Issue By</th>
     <th>Receive By</th>
     <th>Item</th>
     <th>Location</th>
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
     <td>{t.location}</td>
     <td>{t.uom_code}</td>
     <td style="text-align:right">{t.qty}</td>
     <td style="text-align:right">{t.rate}</td>
     <td style="text-align:right">{t.amount}</td>
     <td style="text-align:right">{t.chargehead}</td>
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
    self.checkedDepartments=[]
    self.on("mount", function(){
      dateFormat('issueRegisterItemWiseStartDateInput')
      dateFormat('issueRegisterItemWiseEndDateInput')
      self.issue_to_department_dept_wise='issue_to_department_dept_wise_home'
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('read_departments')
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

      var selected_department_id=''
    
      self.checkedDepartments.map(t => {
          if(selected_department_id==''){
            selected_department_id=t.department_id
          }else if(selected_department_id!=''){
            selected_department_id=selected_department_id+','+t.department_id
          }
       })

     var link="csv/issue_to_department_dept_wise_csv.php?start_date="+self.issueRegisterItemWiseStartDateInput.value+"&end_date="+self.issueRegisterItemWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString+"&department_id="+selected_department_id+"&stock_adjustment="+self.adjustmentInput.value;
      console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }


    /********************************* department filter start*************************/
    self.filterDepartments = () => {
      if(!self.searchDepartment) return
      self.filteredDepartments = self.departments.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchDepartment.value.toLowerCase())>=0
      })

      self.paginate(self.filteredDepartments, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page)
    }

   self.selectDepartment = (t,e) => {
    self.checkedDepartments.push(t)
    
    self.departments = self.departments.filter(c => {
      return c.department_id!=t.department_id
    })
    self.pagedDataItems = self.pagedDataItems.filter(c => {
      return c.department_id!=t.department_id
    })

   }

   self.removeDepartment = (t,e) => {
     self.checkedDepartments = self.checkedDepartments.filter(c => {
      return c.department_id!=t.department_id
    })
     console.log(self.checkedDepartments)
    
    self.departments.push(t)
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
      self.issue_to_department_dept_wise='issue_to_department_dept_wise_home'
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

      var selected_department_id=''
    
      self.checkedDepartments.map(t => {
          if(selected_department_id==''){
            selected_department_id=t.department_id
          }else if(selected_department_id!=''){
            selected_department_id=selected_department_id+','+t.department_id
          }
       })
      console.log('selected_department_id')
      console.log(selected_department_id)
      
      self.loading=true
      RiotControl.trigger('read_issue_to_department_dept_wise',self.issueRegisterItemWiseStartDateInput.value,self.issueRegisterItemWiseEndDateInput.value,selectedStockTypeString,selected_department_id,self.adjustmentInput.value)
    }

    
    RiotControl.on('read_issue_to_department_dept_wise_changed', function(mainArray, qty_grand_total, amount_grand_total) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.qty_grand_total=qty_grand_total
      self.amount_grand_total=amount_grand_total
      self.issue_to_department_dept_wise='issue_to_department_dept_wise_report'
      self.issueFrom=self.issueRegisterItemWiseStartDateInput.value
      self.issueTo=self.issueRegisterItemWiseEndDateInput.value
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('departments_changed', function(departments) {
      self.departments = departments
      self.checkedDepartments=[]
      self.departments = departments
      self.filteredDepartments = departments

      self.items_per_page = 10
      self.paginate(self.filteredDepartments, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page)
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
      self.pagedDataItems = self.getPageData(self.filteredDepartments, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredDepartments, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/
    

</script>    
</issue-to-department-dept-wise>
