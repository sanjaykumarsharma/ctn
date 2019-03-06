<receive>
<loading-bar if={loading}></loading-bar>
<div show={receive_view =='receive_home'}>
 <div class="container-fluid">
  <div class="row">
    <div class="col-md-6">
      <h4>Receive</h4>
    </div>
  </div>
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="selectReadStockTypeInput">Stock Type</label>
        <select name="selectReadStockTypeInput" class="form-control" onchange={readReceiveToDepartment}>
          <option></option>
          <option each={stock_types} value={stock_type_code}>{stock_type}</option>
          <option value='all'>All</option>
        </select>
      </div>
    </div>  
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readReceiveToDepartment} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-8 text-xs-right">
      <div class="form-inline">
          <input type="search" name="searchReceiveToDept" class="form-control" placeholder="search" onkeyup={filterReceiveToDept} style="width:200px;margin-right: 10px;">
          <button class="btn btn-secondary text-right" disabled={loading} onclick={showReceiveToDepartmentEntryForm}><i class="material-icons">add</i></button>
      </div>    
    </div> 
  </div>

  <!-- <div class="row"> -->
    <table class="table table-bordered">
        <tr>
          <th class="serial-col">#</th>
          <th>Receive No</th>
          <th>Receive Date</th>
          <th>Approve By</th>
          <th>Adjusted By</th>
          <th></th>
        </tr>
        <tr each={c, i in pagedDataItems}>
          <td>{(current_page_no-1)*items_per_page + i + 1}</td>
          <td class="text-center">{c.stock_type_code}-{c.receive_no}</td>
          <td class="text-center">{c.receive_date}</td>
          <td class="text-center">{c.approve_by}</td>
          <td class="text-center">{c.adjusted_by}</td>
          <td>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={edit}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={view}><i class="material-icons">visibility</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={deleteReceive}><i class="material-icons">delete</i></button>
          </td>
        </tr>
        <tfoot class="no-print">
        <tr>
          <td colspan="7">
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
   <!-- </div> -->
 </div>
</div>

<div show={receive_view =='receive_entry'}>
 <div class="container-fluid">
  <div class="row">
    <div class="col-md-9">
      <h4>{title} Receive</h4>
    </div>
    <div class="col-md-3">
      <button class="btn btn-secondary text-right" disabled={loading} onclick={closeSaveReceiveToDepartment}><i class="material-icons">close</i></button>
    </div>
  </div>
  
  <form>
     <div class="row">
        <div class="col-sm-3">
          <div class="form-group">
            <label for="receiveDateInput">Receive Date</label>
            <input type="text" class="form-control" id="receiveDateInput" placeholder="DD/MM/YYYY">
          </div>
        </div>
        <div class="col-sm-3">  
          <div class="form-group">
            <label>Stock Type</label>
            <select  id="selectStockType" onchange={changeStockType} class="form-control" style="min-width:250px">
              <option></option>
              <option each={stock_types} value={stock_type_code}>{stock_type}</option>
            </select>
          </div>
        </div>
        <div class="col-sm-3">  
          <div class="form-group">
            <label>Receive Number: </label> {receive_number}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-3">
          <div class="form-group">
            <label for="adjustedByInput">Adjusted By</label>
            <input type="text" class="form-control" id="adjustedByInput" disabled>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="form-group">
            <label for="approveByInput">Approve By</label>
            <input type="text" class="form-control" id="approveByInput" >
          </div>
        </div>
        
     </div>   
     
     <div class="row bgColor" show={title=='Add'}>
      <div class="col-sm-3">
        <div class="form-group">
          <label for="selectIndentGroupFilter">Item Group</label>
          <input id="selectItemGroupFilter" type="text" class="form-control" />
        </div>
      </div>  
      <div class="col-sm-3">  
        <div class="form-group">
          <label for="selectStockTypeFilter">Stock Type</label>
          <select name="selectStockTypeFilter" class="form-control" style="min-width:250px" disabled>
            <option></option> 
            <option each={stock_types} value={stock_type_code}>{stock_type}</option>
          </select>
        </div>
      </div>
      <div class="col-sm-3">  
        <div class="form-group">
          <label for="searchMaterialInput">Search Material</label>
          <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px">
        </div>
      </div>
      <div class="col-sm-3">  
        <div class="form-group">
          <button type="button" class="btn btn-primary" onclick={getMaterial} style="margin-top: 32px;">Get Material</button>
        </div>
      </div>
     </div>
                
   <div class="row">
    <table class="table table-bordered">
        <tr>
          <th class="serial-col">#</th>
          <th>Material</th>
          <th>UOM</th>
          <th>Stock in Hand</th>
          <th>Qty</th>
          <th>Remarks</th>
          <th show={title=='Add'}></th>
        </tr>
        <tr each={cat, i in selectedMaterialsArray} no-reorder>
          <td>{i+1}</td>
          <td>{cat.item_name}-(Code:{cat.item_id})</td>
          <td>{cat.uom_code}</td>
          <td>{cat.stock}</td>
          <td>
            <input type="text"  id="{ 'qtyInput' + cat.item_id }" value={cat.qty} class="form-control"/>
          </td>
          <td>
            <input type="text"  id="{ 'remarksInput' + cat.item_id }" value={cat.remarks} class="form-control"/>
          </td>
          <td show={title=='Add'}>
            <button class="btn btn-secondary" disabled={loading} onclick={removeSelectedMaterial.bind(this, cat)}><i class="material-icons">remove</i></button>
          </td>
        </tr>
      </table>
      <br>
      <label for="remarksInput">Remarks:</label>
      <textarea id="remarksInput" class="form-control" rows="2"></textarea>
      <br>
   </div>

  </form>

  <div class="col-sm-12">
    <button type="button" class="btn btn-primary pull-sm-right" onclick={saveReceiveToDepartment}>Save changes</button>
    <button type="button" class="btn btn-secondary pull-sm-right" onclick={closeSaveReceiveToDepartment} style="    margin-right: 10px;">Close</button>
  </div>
 </div>
</div> <!-- add_opening end -->

<div show={receive_view =='receive_eye'} class="container-fluid print-box">
 <div class="container-fluid">
   <div class="row no-print">
    <div class="col-md-9">
      <h4>Receive</h4>
    </div>
    <div class="col-md-3">
      <button class="btn btn-secondary text-right" disabled={loading} onclick={closeSaveReceiveToDepartment}><i class="material-icons">close</i></button>
    </div>
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
     <th style="width:100px">Receive No</th>
     <td>{receiveDetails.stock_type_code}-{receiveDetails.receive_no}</td>
     <th>Receive Date</th>
     <td>{receiveDetails.receive_date}</td>
    </tr>
    <tr>
     <th>Approve By</th>
     <td>{receiveDetails.approve_by}</td>
     <th>Adjusted By</th>
     <td>{receiveDetails.adjusted_by}</td>
    </tr>
  </table>

  <table class="table table-bordered bill-info-table print-small">
    <tr>
      <th style="max-width:50px;width:50px"><strong>#</strong></th>
      <th><strong>Material</strong></th>
      <th><strong>UOM</strong></th>
      <th><strong>Qty</strong></th>
    </tr>
    <tr each={m, i in receiveViewItems}>
      <td><div class="slno">{i+1}</div></td>
      <td>{m.item_name}-(Code:{m.item_id})</td>
      <td class="text-center">{m.uom_code}</td>
      <td class="text-xs-right">{m.qty}</td>
    </tr>
  </table>   

  
  <p show={showRemarks}><br><br><br>
    <b>Remarks: </b> {receiveDetails.remarks}</p>

  <br><br>
   <table class="table indent-footer">
     <tr>
       <td style="width:50%"><center style="height:21px">{receiveDetails.approve_by}</center><div><center>Approve By</center></div></td>
       <td style="width:50%"><center style="height:21px">{receiveDetails.adjusted_by}</center><div><center>Adjusted By</center></div></td>
       <!--<td><center style="height:21px">{view_indent_details.approved_by}</center><div><center>Approved By</center></div></td> -->
     </tr>
   </table>

 </div>
</div> 

 <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">Select Material</h4>
          <div class="text-xs-right form-inline" >
              <input type="search" name="searchMaterials" class="form-control" placeholder="search" onkeyup={filterMaterials} style="width:200px">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" onclick={selectedMaterial}>Submit</button>
          </div>
        </div>
        <div class="modal-body">
        
          <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th style="width:75px"></th>
            <th>Material</th>
            <th>Group</th>
          </tr>
          <tr each={it, i in pagedDataMaterials}>
            <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td>
            <td><input type="checkbox" class="form-control"  checked={it.selected} onclick="{parent.toggle}"></td>
            <td>{it.item_name}-(Code:{it.item_id})</td>
            <td>{it.item_group}</td>
          </tr>
          <tfoot class="no-print">
            <tr>
              <td colspan="10">
                <div class="right-align">
                  Items Per Page: <select class="p1 mb0 rounded inline" onchange={changeItemsPerPageNew}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  Page No: <select class="p1 mb0 rounded inline" name="page_select_new" onchange={changePageNew}>
                    <option each={pno in page_array_new} value={pno}>{pno}</option>
                  </select>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
                     
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick={selectedMaterial}>Submit</button>
        </div>
      </div>
    </div>
  </div>

<div class="modal fade" id="deleteReceiveModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Delete Receive</h4>
      </div>
      <div class="modal-body">
        <center><strong>Are you sure to delete received items</strong></center>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick={confirmDeleteReceive}>Delete</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->  


<script>
	var self = this
    self.on("mount", function(){
      //RiotControl.trigger('login_init')
      self.items_per_page = 10
      self.items_per_page_new = 10
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('read_item_groups')
      RiotControl.trigger('read_categories')
      RiotControl.trigger('read_chargeheads')
      RiotControl.trigger('read_locations')
      RiotControl.trigger('fetch_user_details_from_session_for_receive')
      self.receive_view='receive_home'
      dateFormat('receiveDateInput')
      self.update()
    })

    self.readReceiveToDepartment = () => {
      self.loading=true
      RiotControl.trigger('read_received_items_by_department',self.selectReadStockTypeInput.value)
    }

    self.showReceiveToDepartmentEntryForm = () => {
      self.title='Add'  
      self.receive_view='receive_entry'
      self.selectedMaterialsArray=[]
      self.receive_number=''
      self.selectStockType.value=''
      self.selectStockTypeFilter.value=''
      self.remarksInput.value=''
      self.approveByInput.value=''
      $("#receiveDateInput").prop( "disabled", false );
      $("#selectStockType").prop( "disabled", false );
      self.adjustedByInput.value=self.user_name
      self.update()
    }

    self.changeStockType = () => {
      self.selectStockTypeFilter.value=self.selectStockType.value
      RiotControl.trigger('read_receive_number_by_stock_type',self.selectStockType.value)
    }
    self.getMaterial = () => {
      self.materials = []
      if(self.searchMaterialInput.value==''){
        if(self.selectItemGroupFilter.value==''){
          toastr.info("Please select Item Group and try again")
          return;
        }
        RiotControl.trigger('read_items_for_receive',self.selected_item_group_code,self.selectStockTypeFilter.value)
      }else{
        RiotControl.trigger('search_items',self.searchMaterialInput.value,self.selectStockTypeFilter.value)
      }
    }

   self.selectedMaterial = () => {
       self.materials = self.materials.map(m => {
        if(m.selected){
            self.selectedMaterialsArray.push(m)
        }
       })
       $("#itemModal").modal('hide') 
       console.log(self.selectedMaterialsArray)
       self.update()
    }

    self.removeSelectedMaterial = (i,e) => { 
      let tempSelectedMaterialsArray = self.selectedMaterialsArray.filter(c => {
        return c.item_id != i.item_id
      })

      self.selectedMaterialsArray=tempSelectedMaterialsArray

    } 

    self.toggle = (e) =>{
        var item = e.item
        item.selected = !item.selected

        /*updating selected materials*/
        self.materials = self.materials.map(m => {
          if(m.item_id == item.it.item_id){ 
           m.item_id=m.item_id
           m.item_name=m.item_name
           m.item_description=m.item_description
           m.uom_code=m.uom_code
           m.max_level=m.max_level
           m.min_level=m.min_level
           m.stock_in_hand=m.stock_in_hand
           m.selected=item.selected

           m.qty=''
           m.location=''

          }
          m.confirmEdit = false
          return m
        })
        return true
    }

    self.closeSaveReceiveToDepartment = () => {
      self.receive_view='receive_home'
    }
    
    self.view = (e) => {
       RiotControl.trigger('read_receive_view',e.item.c.receive_id)
    }

    self.edit = (e) => {
       self.edit_receive_id=e.item.c.receive_id
       RiotControl.trigger('read_items_for_receive_edit',e.item.c.receive_id)
    }

    self.deleteReceive = (e) =>{
      self.delete_receive_id=e.item.c.receive_id
      $("#deleteReceiveModal").modal('show') 
    }
    self.confirmDeleteReceive = (e) =>{
      self.loading=true
      RiotControl.trigger('delete_receive',self.delete_receive_id,self.receivedItems)
    }


    self.saveReceiveToDepartment = () => {
      if(self.receiveDateInput.value==''){
         toastr.info("Please Entet Receive Date")
        return
      }

      let str=self.receiveDateInput.value;
      var d = str.split("/");
      var po_date = moment([d[2].trim()+d[1].trim()+d[0].trim()],'YYYYMMDD')
      var toDay=moment().format('YYYYMMDD')

      let from = moment(po_date, 'YYYYMMDD'); 
      let to = moment(toDay, 'YYYYMMDD');     
      let differnece=to.diff(from, 'days')  

      if(differnece<0){
        toastr.error("Receive date can not be greater than today")
        return
      }

      if(self.adjustedByInput.value==''){
         toastr.info("please provide adjested by")
         return
      }

      if(self.approveByInput.value==''){
         toastr.info("please provide receive by")
         return
      }

      let error='';
      let count=1;
      self.selectedMaterialsArray.map(i=>{
          
          let qtyInput= '#qtyInput'+i.item_id
          i.qty=$(qtyInput).val() 

          let remarksInput= '#remarksInput'+i.item_id
          i.remarks=$(remarksInput).val() 

          //validation check
          if(i.qty==''){
            error=error + 'please enter qty'+count+',';
          }
          count++
      })

      if(error!=''){
        toastr.info(error)
        return;
      }else if(self.title=='Add'){
       RiotControl.trigger('add_receive',self.selectedMaterialsArray,self.receiveDateInput.value,self.adjustedByInput.value,self.approveByInput.value,self.receive_number,self.selectStockType.value,self.remarksInput.value)
      }else if(self.title=='Edit'){
         RiotControl.trigger('edit_receive_to_department',self.selectedMaterialsArray,self.receiveDateInput.value,self.adjustedByInput.value,self.approveByInput.value,self.edit_receive_id,self.remarksInput.value)
      }
      
    }

    self.filterReceiveToDept = () => {
      if(!self.searchReceiveToDept) return
      self.filteredReceiveToDept = self.receivedItems.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchReceiveToDept.value.toLowerCase())>=0
      })

      self.paginate(self.filteredReceiveToDept, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredReceiveToDept, 1, self.items_per_page)
    }

    self.filterMaterials = () => {
      if(!self.searchMaterials) return
      self.filteredMaterials = self.materials.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase())>=0
      })

      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
    }

    /*method change callback from store*/
    RiotControl.on('item_groups_changed', function(item_groups) {

      $('#selectItemGroupFilter').autocomplete({
        source: item_groups,
        select: function( event, ui ) {
          self.selected_item_group_code= ui.item.item_group_code
          console.log(self.selected_item_group_code)
        }
      });
      self.update()
    })

    RiotControl.on('categories_changed', function(categories) {
      self.categories = categories
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('read_items_for_receive_changed', function(items) {
      $("#itemModal").modal('show')  
      self.loading = false
      self.materials = items
      
      self.filteredMaterials=self.materials
      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
      self.update()
    })

    RiotControl.on('search_items_changed', function(items) {
      $("#itemModal").modal('show')  
      self.loading = false
      self.materials = items
      self.searchMaterialInput.value=''
      
      self.filteredMaterials=self.materials
      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
      self.update()
    })

    RiotControl.on('chargeheads_changed', function(chargeheads) {
      self.loading = false
      self.chargeheads = chargeheads
      self.update()
    })

    RiotControl.on('locations_changed', function(locations) {
      self.loading = false
      self.locations = locations
      self.update()
    })

    RiotControl.on('add_receive_changed', function() {
      self.loading = false
      self.receive_view='receive_home'
      self.update()
    })

    RiotControl.on('edit_receive_to_department_changed', function() {
      self.loading = false
      self.receive_view='receive_home'
      self.update()
    })

   RiotControl.on('read_received_items_by_department_changed', function(items) {
      self.loading = false
      self.receivedItems=[]
      self.receivedItems=items
      self.filteredReceiveToDept = items

      self.paginate(self.filteredReceiveToDept, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredReceiveToDept, 1, self.items_per_page)
      self.update()
    })

   RiotControl.on('read_items_for_receive_edit_changed', function(items,details) {
      $("#receiveDateInput").prop( "disabled", true );
      $("#selectStockType").prop( "disabled", true );

      self.loading = false
      self.title='Edit'
      self.receive_view='receive_entry'
      self.selectedMaterialsArray=[]
      self.selectedMaterialsArray = items
      self.receiveDateInput.value=details.receive_date
      self.adjustedByInput.value=details.adjusted_by
      self.approveByInput.value=details.approve_by
      self.remarksInput.value=details.remarks
      self.selectStockType.value=details.stock_type_code
      self.receive_number=details.receive_no
      self.update()
      
    })

   RiotControl.on('read_receive_number_by_stock_type_changed', function(receive_number) {
      self.loading = false
      self.receive_number=receive_number
      self.update()
      
   })

   RiotControl.on('read_receive_view_changed', function(details,items) {
      self.loading = false
      self.receive_view='receive_eye'
      self.receiveDetails={};
      self.receiveDetails=details;
      self.showRemarks=false
      if((details.remarks)!=null){
        if((details.remarks).length>0){
          self.showRemarks=true
        }
      }  
    
      self.receiveViewItems=[];
      self.receiveViewItems=items;
      self.update()
      
   })

   RiotControl.on('delete_receive_changed', function(items) {
      self.loading = false
      $("#deleteReceiveModal").modal('hide') 
      self.receivedItems=items;
      self.update()
   })

   RiotControl.on('fetch_user_details_from_session_for_receive_changed', function(user_name,user_id) {
    self.loading = false
    self.user_name=user_name
    self.user_id=user_id
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
      self.pagedDataItems = self.getPageData(self.filteredReceiveToDept, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredReceiveToDept, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredReceiveToDept, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/  


    /**************** pagination for items*******************/
    self.getPageDataNew = (full_data, page_no, items_per_page_new) => {
      let start_index = (page_no - 1)*items_per_page_new
      let end_index = page_no * items_per_page_new
      let items = full_data.filter((fd, i) => {
        if(i >= start_index && i < end_index) return true
      })
      return items
    }

    self.paginate_new = (full_data, items_per_page_new) => {
      let total_pages = Math.ceil(full_data.length/items_per_page_new)
      let pages = []
      for(var i = 1; i <= total_pages; i++){
        pages.push(i)
      }
      self.page_array_new = pages
      self.current_page_no_new = 1;
      self.update()
    }
    self.changePageNew = (e) => {
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, e.target.value, self.items_per_page_new)
      self.current_page_no_new = e.target.value
    }
    self.changeItemsPerPageNew = (e) => {
      self.items_per_page_new = e.target.value
      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
      self.current_page_no_new = 1
      self.page_select_new.value = 1
    }
    /**************** pagination ends*******************/



</script>

</receive>