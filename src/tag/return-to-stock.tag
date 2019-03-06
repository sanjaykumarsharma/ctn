<return-to-stock>
<loading-bar if={loading}></loading-bar>
<div class="container-fluid">
  <h4 class="no-print">{title} Return to stock</h4>
</div>  
<div show={return_to_stock_view =='return_to_stock_home_page'}>
 <div class="container-fluid">
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="selectStockTypeCodeInput">Stock Type</label>
        <select name="selectStockTypeCodeInput" class="form-control" onchange={readReturnToStock}>
          <option></option>
          <option each={stock_types} value={stock_type_code}>{stock_type}</option>
          <option value="all">All</option>
        </select>
      </div>
    </div>  
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readReturnToStock} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-8 text-xs-right"> 
      <div class="form-inline">
          <input type="search" name="searchReturnedItems" class="form-control" placeholder="search" onkeyup={filterReturnedItems} style="width:200px;margin-right:10px;">
          <button class="btn btn-secondary text-right" disabled={loading} onclick={showReturnDocketEntryForm}><i class="material-icons">add</i></button>
      </div>    
    </div>
  </div>

  <table class="table table-bordered">
   <tr>
      <th class="serial-col">#</th>
      <th>Return to Stock No</th>
      <th>Return Date</th>
      <th>Return By</th>
      <th></th>
    </tr>
    <tr each={c, i in pagedDataItems}>
      <td>{(current_page_no-1)*items_per_page + i + 1}</td>
      <td class="text-center">{c.stock_type_code}-{c.return_to_stock_no}</td>
      <td class="text-center">{c.return_date}</td>
      <td class="text-center">{c.return_by}</td>
     <td>
       <button disabled={loading} class="btn btn-secondary btn-sm" onclick={edit}><i class="material-icons">create</i></button>
       <button disabled={loading} class="btn btn-secondary btn-sm" onclick={view}><i class="material-icons">visibility</i></button>
       <button disabled={loading} class="btn btn-secondary btn-sm" onclick={deleteReturnToStock}><i class="material-icons">delete</i></button>
     </td>
   </tr> 
   <tfoot class="no-print">
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
</div>

<div show={return_to_stock_view =='return_to_stock_home'}>
 <div class="container-fluid">
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="selectStockTypeInput">Stock Type</label>
        <select name="selectStockTypeInput" class="form-control" onchange={readIssuedItemsToStockType}>
          <option></option>
          <option each={stock_types} value={stock_type_code}>{stock_type}</option>
        </select>
      </div>
    </div>  
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readIssuedItemsToStockType} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-8">
      <button class="btn btn-secondary text-right" disabled={loading} onclick={showDocketHome}><i class="material-icons">close</i></button>
    </div>
  </div>
  
  <table class="table table-bordered">
    <tr>
      <th class="serial-col">#</th>
      <th>Issue No</th>
      <th>Issue Date</th>
      <th>Department</th>
      <th>Issue By</th>
      <th>Receive By</th>
      <th></th>
    </tr>
    <tr each={c, i in issuedItems}>
      <td class="text-center">{i+1}</td>
      <td class="text-center">{c.stock_type_code}-{c.issue_no}</td>
      <td class="text-center">{c.issue_date}</td>
      <td class="text-center">{c.department}</td>
      <td class="text-center">{c.approve_by}</td>
      <td class="text-center">{c.receive_by}</td>
      <td>
        <button disabled={loading} class="btn btn-secondary btn-sm" onclick={returnToStockEnteryForm}><i class="material-icons">assignment_return</i></button>
      </td>
    </tr>
  </table>
 </div>
</div>

<div show={return_to_stock_view =='return_to_stock'}>
 <div class="container-fluid">
   <button type="button" class="btn btn-secondary text-right" onclick={showReturnToStockHome} style="margin-top:-30px">Close</button>
   <table class="table">
     <tr>
       <td>
          <span>Return Date</span> 
          <input type="text" class="form-control" id="returnToStockDateInput" style="width:200px" placeholder="DD/MM/YYYY">
       </td> 
       <td>
         <span>Returned By</span> 
         <input type="text" class="form-control" id="returnedByInput" style="width:200px" disabled>
       </td>
       <td>
         <span>Returned To Stock No:{return_to_stock_no}</span> 
       </td>
     </tr>
   </table>

   <table class="table table-bordered">
    <tr>
     <th>#</th>
     <th>Item Name</th>
     <th>Location</th>
     <th>Unit</th>
     <th>Qty</th>
     <th>Return Qty</th>
     <th>Remarks</th>
     <th>Issue Date</th>
     <th>Approve By</th>
     <th>Receive By</th>
    </tr> 
    <tr each={m, i in returnMaterials}>
     <td>{i+1}</td>
     <td>{m.item_name}-(Code:{m.item_id})</td>
     <td>{m.location}</td>
     <td>{m.uom_code}</td>
     <td>{m.qty}</td>
     <td><input type="text" id="{'returnToStockInput'+m.item_id}" value={m.return_to_stock_qty} class="form-control" /></td>
     <td><input type="text" id="{'returnToStockRemarks'+m.item_id}" value={m.return_to_stock_remarks} class="form-control" /></td>
     <td class="text-center">{m.issue_date}</td>
     <td class="text-center">{m.approve_by}</td>
     <td class="text-center">{m.receive_by}</td>
    </tr>
   </table>
   <div class="row">
     <button type="button" class="btn btn-secondary text-right" onclick={showReturnToStockHome}>Close</button>
     <button type="button" class="btn btn-primary text-right" onclick={submitReturnToStock} style="margin-right:10px">Submit</button>
   </div>
 </div>
</div>

<div show={return_to_stock_view =='return_to_stock_show'} class="container-fluid print-box">
 <div class="container-fluid no-print">
    <button class="btn btn-secondary text-right" disabled={loading} onclick={showDocketHome} style="margin-top:-25px"><i class="material-icons">close</i></button>
  </div>

  <center>
     <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div>
        149,Barrackpore Trunk Road<br>
        P.O. : Kamarhati, Agarpara<br>
        Kolkata - 700058<br>
        Email: purchase@ntcind.com<br>
   </center><br>

  <table class="table table-bordered bill-info-table">
    <tr>
     <th style="width:100px">Return Date</th>
     <td>{viewDetails.return_date}</td>
     <th>Issue No</th>
     <td>{viewDetails.stock_type_code}-{viewDetails.return_to_stock_no}</td>
     <th>Return By</th>
     <td>{viewDetails.return_by}</td>
    </tr>
  </table>

  <table class="table table-bordered bill-info-table print-small">
    <tr>
      <th style="max-width:50px;width:50px"><strong>#</strong></th>
      <th style="width:200px;"><strong>Material</strong></th>
      <th><strong>Return Qty</strong></th>
      <th><strong>UOM</strong></th>
      <th><strong>Location</strong></th>
      <th><strong>Max Level</strong></th>
      <th><strong>Min Level</strong></th>
    </tr>
    <tr each={m, i in viewItems}>
      <td><div class="slno">{i+1}</div></td>
      <td>{m.item_name}-(Code:{m.item_id})</td>
      <td class="text-xs-right">{m.return_to_stock_qty}</td>
      <td class="text-center">{m.uom_code}</td>
      <td class="text-center">{m.location}</td>
      <td class="text-xs-right">{m.max_level}</td>
      <td class="text-xs-right">{m.min_level}</td>
    </tr>
  </table>   

 </div>
</div> 


<div class="modal fade" id="deleteReturnToStockModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Delete Return To Stock</h4>
      </div>
      <div class="modal-body">
        <center><strong>Are you sure to delete return to stock items</strong></center>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick={confirmDeleteReturnToStock}>Delete</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->  



<script>
    var self = this
    self.on("mount", function(){
      self.items_per_page = 10
      self.return_to_stock_view='return_to_stock_home_page'
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('fetch_user_details_from_session_for_return_to_stock')
      self.title=''
      self.update()
      dateFormat('returnToStockDateInput')
    })

    self.showReturnDocketEntryForm = () => {
      self.title='Add'
      self.return_to_stock_view='return_to_stock_home'
      $("#returnToStockDateInput").prop( "disabled", false );
      self.update()
    }

    self.showDocketHome = () => {
      self.title=''
      self.return_to_stock_view='return_to_stock_home_page'
    }

    self.showReturnToStockHome = () => {
      if(self.title=='Add'){
        self.return_to_stock_view='return_to_stock_home'
      }else if(self.title=='Edit'){
        self.return_to_stock_view='return_to_stock_home_page'
      }
      
    }

    self.returnToStockEnteryForm = (e) =>{
      self.return_to_stock_issue_id=e.item.c.issue_id
      self.return_to_stock_transaction_id=e.item.c.transaction_id
      self.returned_by_department_id=e.item.c.department_id
      RiotControl.trigger('read_issued_material_for_return',e.item.c.issue_id,self.selectStockTypeInput.value)
    }

    self.readIssuedItemsToStockType = () => {
      if (self.selectStockTypeInput.value=='') {
        toastr.info("Please Select Department")
        return
      }
      self.loading=true
      RiotControl.trigger('read_issued_items_to_stock_type_code',self.selectStockTypeInput.value)
    }

    self.readReturnToStock = () => {
      if (self.selectStockTypeCodeInput.value=='') {
        toastr.info("Please Select Department")
        return
      }
      self.loading=true
      RiotControl.trigger('read_issued_items_to_stock',self.selectStockTypeCodeInput.value)
    }

    self.edit = (e) => {
      RiotControl.trigger('read_return_to_stock_edit',e.item.c.return_to_stock_id,e.item.c.issue_id)
    }

    self.submitReturnToStock = () =>{
      if(self.returnToStockDateInput.value==''){
        toastr.error("Please Enter Return Date")
        return
      }
      
      if(self.title=='Add'){

        let str=self.returnToStockDateInput.value;
        var d = str.split("/");
        var return_date = moment([d[2].trim()+d[1].trim()+d[0].trim()],'YYYYMMDD')
        var toDay=moment().format('YYYYMMDD')

        let from = moment(return_date, 'YYYYMMDD'); 
        let to = moment(toDay, 'YYYYMMDD');     
        let differnece=to.diff(from, 'days')  

        if(differnece<0){
          toastr.error("Return date can not be greater than today")
          return
        }
      
        //return date vs Issue date
        let str1=self.returnMaterials[0].issue_date
        var d2 = str1.split("/");
        var i_date = moment([d2[2].trim()+d2[1].trim()+d2[0].trim()],'YYYYMMDD')
        let pd = moment(i_date, 'YYYYMMDD');    //i_date
        let diff_of_return_issue = from.diff(pd, 'days')  
        console.log(diff_of_return_issue)

        if(diff_of_return_issue<0){ 
          toastr.error("Return date can not be less than Issue Date")
          return
        }
      }  


      if(self.returnedByInput.value==''){
        toastr.error("Please Enter Returned By")
        return
      }
      
      console.log(self.returnMaterials) 
      let error=''
      let count=1;
      let selectedMaterial=[]
      self.returnMaterials.map(i=>{

        let returnToStockInput= '#returnToStockInput'+i.item_id
        i.return_to_stock_qty=$(returnToStockInput).val()

        let temp_return_to_stock_qty = Number(i.return_to_stock_qty)
        if(isNaN(temp_return_to_stock_qty)){
          temp_return_to_stock_qty = 0
        }

        let return_to_stock_qty = Number(i.return_to_stock_qty)
        if(temp_return_to_stock_qty>0){
          
          if(self.title=='Edit'){
            let max_return_qty= Number(i.qty)+Number(i.old_return_to_stock_qty)//qty=remaing_issue_qty
            if (Number(max_return_qty)<Number(i.return_to_stock_qty)) {
              error=error + "Return Qty" +count +" can't be greater than Qty"+count+" ,";
            }
          }else if(self.title=='Add'){
            if (Number(i.qty)<Number(i.return_to_stock_qty)) {
              error=error + "Return Qty can't be greater than Qty,";
            }
          }

          let returnToStockRemarks= '#returnToStockRemarks'+i.item_id
          i.return_to_stock_remarks=$(returnToStockRemarks).val()

          selectedMaterial.push(i)
          count++

        }

      })
      console.log('selectedMaterial')
      console.log(selectedMaterial)

      if(selectedMaterial.length==0){
         error='Please provide at least one return qty'
      }

      if(error!=''){
        toastr.error(error)
        return
      }


      self.loading=true
      if(self.title=='Add'){
        RiotControl.trigger('return_to_stock',self.return_to_stock_issue_id,self.return_to_stock_transaction_id,selectedMaterial,self.returnToStockDateInput.value,self.returnedByInput.value,self.selectStockTypeInput.value,self.return_to_stock_no)
      }else if(self.title=='Edit'){
        RiotControl.trigger('return_to_stock_edit',self.return_to_stock_issue_id,self.return_to_stock_transaction_id,selectedMaterial,self.returnToStockDateInput.value,self.returnedByInput.value,self.selectStockTypeInput.value,self.edit_return_to_stock_id)
      }
    }

    self.view = (e) => {
       RiotControl.trigger('read_view_return_to_stock',e.item.c.return_to_stock_id)
    }

    self.deleteReturnToStock = (e) => {
       self.return_to_stock_id=e.item.c.return_to_stock_id
       $("#deleteReturnToStockModal").modal('show') 
    }

    self.confirmDeleteReturnToStock = () => {
       RiotControl.trigger('delete_return_to_stock',self.return_to_stock_id,self.returnedItems)
    }

     self.filterReturnedItems = () => {
      if(!self.searchReturnedItems) return
      self.filteredReturnedItems = self.returnedItems.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchReturnedItems.value.toLowerCase())>=0
      })

      self.paginate(self.filteredReturnedItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredReturnedItems, 1, self.items_per_page)
    }

    /*method change callback from store*/
    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('read_issued_items_to_stock_type_code_changed', function(items) {
      self.loading = false
      self.issuedItems = items
      self.update()
    })

    RiotControl.on('read_issued_items_to_stock_changed', function(items) {
      self.loading = false
      self.returnedItems = items
      self.filteredReturnedItems = items

      self.paginate(self.filteredReturnedItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredReturnedItems, 1, self.items_per_page)
      self.update()
    })

    RiotControl.on('return_to_stock_changed', function() {
      self.loading = false
      let items = self.issuedItems.filter(c => {
        return c.transaction_id != self.return_to_stock_transaction_id
      })
      self.issuedItems = items
      self.return_to_stock_view='return_to_stock_home'
      self.update()
    })

    
    RiotControl.on('return_to_stock_changed_error', function() {
      self.loading = false
      toastr.error('Newer Return Date exists for given stock type')
      self.update()
    })
 
    RiotControl.on('read_view_return_to_stock_changed', function(items,details) {
      self.loading = false
      self.viewItems = items
      self.viewDetails = details
      self.return_to_stock_view='return_to_stock_show'
      self.update()
    })

    RiotControl.on('read_issued_material_for_return_changed', function(items,return_to_stock_no) {
      self.loading = false
      self.title='Add'
      self.return_to_stock_view='return_to_stock'
      self.returnMaterials=[]
      self.returnMaterials=items
      self.return_to_stock_no=return_to_stock_no
      self.update()
      self.returnedByInput.value=self.user_name
    })
    
    RiotControl.on('fetch_user_details_from_session_for_return_to_stock_changed', function(user_name,user_id) {
      self.loading = false
      self.user_name=user_name
      self.user_id=user_id
      self.update()
    })

    RiotControl.on('delete_return_to_stock_changed', function(items) {
      self.loading = false
      $("#deleteReturnToStockModal").modal('hide') 
      self.returnedItems=items;
      self.update()
   })

   RiotControl.on('read_return_to_stock_edit_changed', function(items,details) {
      self.loading = false
      self.title='Edit'
      self.return_to_stock_view='return_to_stock'
      self.returnMaterials=[]
      self.returnMaterials=items
      self.returnToStockDateInput.value=details.return_date
      self.return_to_stock_no=details.return_to_stock_no
      self.edit_return_to_stock_id=details.return_to_stock_id
      self.returnedByInput.value=details.return_by
      $("#returnToStockDateInput").prop( "disabled", true );
      self.update()

   })

   RiotControl.on('return_to_stock_edit_changed', function(items,details) {
      self.loading = false
      self.return_to_stock_view='return_to_stock_home_page'
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
      self.pagedDataItems = self.getPageData(self.filteredReturnedItems, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredReturnedItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredReturnedItems, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/ 
 </script>

</return-to-stock>