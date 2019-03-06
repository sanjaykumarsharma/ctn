<reject-to-party>
<loading-bar if={loading}></loading-bar>
<div class="container-fluid">
<h4 class="no-print">{title} Reject to party</h4>
</div>
<div show={reject_to_party_view =='reject_to_party_home_page'}>
 <div class="container-fluid">
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="stockTypeInput">Stock Type</label>
        <select name="stockTypeForReadRejectedDocketInput" class="form-control" onchange={readRejectedDocket}>
          <option></option>
          <option each={stock_types} value={stock_type_code}>{stock_type_code}-{stock_type}</option>
          <option value='all'>All</option>
        </select>
      </div>
    </div>  
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readRejectedDocket} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-8 text-xs-right">
      <div class="form-inline">
          <input type="search" name="searchRjectedDocket" class="form-control" placeholder="search" onkeyup={filterDockets} style="width:200px;margin-right: 10px;">
          <button class="btn btn-secondary text-right" disabled={loading} onclick={showRejectDocketEntryForm}><i class="material-icons">add</i></button>
      </div>    
    </div>
  </div>

  <table class="table table-bordered">
   <tr>
    <th>#</th>
    <th>Reject Number</th>
    <th>Rejection Date</th>
    <th>Rejected By</th>
    <th></th>
   </tr>
   <tr each={d, i in pagedDataItems}>
     <td>{(current_page_no-1)*items_per_page + i + 1}</td> 
     <td class="text-center">{d.stock_type_code}-{d.reject_to_party_no}</td>
     <td class="text-center">{d.reject_date}</td>
     <td class="text-center">{d.rejected_by}</td>
     <td>
        <button disabled={loading} class="btn btn-secondary btn-sm" onclick={viewDocketDetails.bind(this,d)}><i class="material-icons">visibility</i>
        </button>
        <button disabled={loading} class="btn btn-secondary btn-sm" onclick={edit.bind(this,d)}><i class="material-icons">create</i>
        </button>
        <button disabled={loading} class="btn btn-secondary btn-sm" onclick={deleteRejectToParty}><i class="material-icons">delete</i>
        </button>
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

<div show={reject_to_party_view =='reject_to_party_home'}>
 <div class="container-fluid">
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="stockTypeInput">Stock Type</label>
        <select name="stockTypeForReadRejectToPartyInput" class="form-control" onchange={readDocket}>
          <option></option>
          <option each={stock_types} value={stock_type_code}>{stock_type_code}-{stock_type}</option>
        </select>
      </div>
    </div>  
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readDocket} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-8">
      <button class="btn btn-secondary text-right" disabled={loading} onclick={showDocketHome}><i class="material-icons">close</i></button>
    </div>
  </div>

  <table class="table table-bordered">
   <tr>
    <th>Docket Number</th>
    <th>Docket Date</th>
    <th>Party Name</th>
    <th>Bill No</th>
    <th>Bill Date</th>
    <th>Amount</th>
    <th></th>
   </tr>
   <tr each={d, i in dockets}>
     <td class="text-center">{d.stock_type_code}-{d.docket_no}</td>
     <td class="text-center">{d.docket_date}</td>
     <td class="text-center">{d.party_name}</td>
     <td class="text-center">{d.bill_no}</td>
     <td class="text-center">{d.bill_date}</td>
     <td class="text-center">{d.bill_amount}</td>
     <td>
        <button disabled={loading} class="btn btn-secondary btn-sm" onclick={rejectToPartyEnteryForm.bind(this,d)}><i class="material-icons">local_shipping</i></button> 
     </td>
   </tr> 
  </table>
 </div>
</div>

<div show={reject_to_party_view =='reject_to_party'}>
  <button type="button" class="btn btn-secondary text-right" onclick={showRejectToPartyHome} style="margin-top:-30px">Close</button>
 <div class="container-fluid">
   <table class="table">
     <tr>
       <td>
          <span>Reject Date</span> 
          <input type="text" class="form-control" id="rejectToPartyDateInput" style="width:200px" placeholder="DD/MM/YYYY">
       </td> 
       <td>
         <span>Rejected By</span> 
         <input type="text" class="form-control" id="rejectedByInput" style="width:200px" disabled>
       </td>
       <td>Party Details: <b>{docketDetails.party_name}</b></td>
     </tr>
     <tr>
       <td>Docket No: <b>{docketDetails.stock_type_code}-{docketDetails.docket_no}</b></td>
       <td>Bill No: <b>{docketDetails.bill_no}</b></td>
       <td>Challan No: <b>{docketDetails.challan_no}</b></td>
     </tr>
     <tr>
       <td>Docket Date: <b>{docketDetails.docket_date}</b></td>
       <td>Bill Date: <b>{docketDetails.bill_date}</b></td>
       <td>Challan Date: <b>{docketDetails.challan_date}</b></td>
     </tr>
     <tr>
       <td>PO No: <b>{docketDetails.po_no}</b><br>
           PO Date: <b>{docketDetails.po_date}</b>
       </td>
       <td>Transporter Name
           <input type="text" class="form-control" id="transporterInput" style="width:200px">
       </td>
       <td>LR No
           <input type="text" class="form-control" id="lrNoInput" style="width:200px"> 
        </td>
     </tr>
     <tr>
       <td>Reject To Party No:<b>{reject_to_party_stock_type}-{reject_to_party_no}</b></td>
       <td>Vehicle No 
           <input type="text" class="form-control" id="vehicleInput" style="width:200px">
       </td>
       <td>Mode Of Transportation 
          <input type="text" class="form-control" id="modeOfTransportInput" style="width:200px">
       </td>
     </tr>
     <tr>
       <td colspan="2"> </td>
     </tr>
   </table>

   <table class="table table-bordered">
    <tr>
     <th>#</th>
     <th style="width:50px"></th>
     <th>Item Code</th>
     <th>Item Name</th>
     <th>Location</th>
     <th>Unit</th>
     <th>Qty</th>
     <th>Rate</th>
     <th>Return Qty</th>
     <th>Reason for Rejection</th>
    </tr> 
    <tr each={m, i in materials}>
     <td>{i+1}</td>
     <td><input type="checkbox" checked={m.selected} id="{'docketItemSelectionInput'+m.transaction_id}" onclick={selectDocketItems.bind(this,m)} class="form-control" style="margin-top: 5px;"></td>
     <td>{m.item_id}</td>
     <td>{m.item_name}</td>
     <td>{m.location}</td>
     <td>{m.uom_code}</td>
     <td>{m.qty}</td>
     <td>{m.rate}</td>
     <td><input type="text" id="{'rejectToPartyInput'+m.transaction_id}" value={m.reject_to_party_qty} class="form-control" /></td>
     <td><input type="text" id="{'rejectToPartyRemarks'+m.transaction_id}" value={m.reject_to_party_remarks} class="form-control" /></td>
    </tr>
   </table>

   <div class="row">
     <button type="button" class="btn btn-secondary text-right" onclick={showRejectToPartyHome}>Close</button>
     <button type="button" class="btn btn-primary text-right" onclick={submitRejectToParty} style="margin-right:10px">Submit</button>
   </div>
 </div>
</div>



<div show={reject_to_party_view =='reject_to_party_view'}>
 <div class="container-fliud print-box">
   <center>
      <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div>
        149,Barrackpore Trunk Road<br>
        P.O. : Kamarhati, Agarpara<br>
        Kolkata - 700058<br>
        <h4>Reject To Party</h4><br>
   </center>

   <table class="table table-bordered bill-info-table">
     <tr>
       <th style="width:90px">Reject No</th>
       <td>{docketDetails.stock_type_code}-{docketDetails.reject_to_party_no}</td>
       <th>Reject Date</th>
       <td>{docketDetails.reject_date}</td>
       <th>Party</th>
       <td>{docketDetails.party_name}</td>
     </tr>
     <tr>
       <th>Docket No</th>
       <td>{docketDetails.stock_type_code}-{docketDetails.docket_no}</td>
       <th>Bill No</th>
       <td>{docketDetails.bill_no}</td>
       <th style="width:140px">Challan No</th>
       <td>{docketDetails.challan_no}</td>
     </tr>
     <tr>
       <th><span style="font-size:11px;">Docket Date</span></th>
       <td>{docketDetails.docket_date}</td>
       <th>Bill Date</th>
       <td>{docketDetails.bill_date}</td>
       <th>Challan Date</th>
       <td>{docketDetails.challan_date}</td>
     </tr>
     <tr>
       <th>PO No</th>
       <td>{docketDetails.stock_type_code}-{docketDetails.po_no}</td>
       <th>PO Date</th>
       <td>{docketDetails.po_date}</td>
       <th>Transporter Name</th>
       <td>{docketDetails.transporter_name}</td>
     </tr>
     <tr>
       <th>Vehicle No</th>
       <td>{docketDetails.vehicle_no}</td>
       <th>LR No</th>
       <td>{docketDetails.lr_no}</td>
       <th>Mode Of Transpotation</th>
       <td>{docketDetails.mode_of_transport}</td>
     </tr>
   </table>

   <table class="table table-bordered">
    <tr>
     <th>#</th>
     <th>Item Name</th>
     <th>Unit</th>
     <th>Location</th>
     <th>Rate</th>
     <th>Return Qty</th>
     <th>Reason for Rejection</th>
    </tr> 
    <tr each={m, i in materials}>
     <td>{i+1}</td>
     <td class="text-md-center">{m.item_name}(code:{m.item_id})</td>
     <td class="text-md-center">{m.uom_code}</td>
     <td class="text-md-center">{m.location}</td>
     <td class="text-md-right">{m.rate}</td>
     <td class="text-md-right">{m.reject_to_party_qty}</td>
     <td class="text-md-center">{m.reject_to_party_remarks}</td>
    </tr>
   </table>

   <div class="row">
     <button type="button" class="btn btn-secondary text-right no-print" onclick={showDocketHome}>Close</button>
   </div>
 </div>
</div>


<div class="modal fade" id="deleteRejectToPartyModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Delete Reject To Party</h4>
      </div>
      <div class="modal-body">
        <center><strong>Are you sure to delete reject to party items</strong></center>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick={confirmDeleteRejectToParty}>Delete</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->  


<script>
    var self = this
    self.on("mount", function(){
      self.items_per_page = 10
      self.reject_to_party_view='reject_to_party_home_page'
      RiotControl.trigger('read_stock_type_details')
      RiotControl.trigger('fetch_user_details_from_session_for_reject_to_party')
      self.title=''
      self.update()
    })

    self.showRejectDocketEntryForm = () => {
      self.title='Add'
      self.reject_to_party_view='reject_to_party_home'
    }
    self.showDocketHome = () => {
      self.title=''
      self.reject_to_party_view='reject_to_party_home_page'
    }

    self.readRejectedDocket = () => {
      if (self.stockTypeForReadRejectedDocketInput.value=='') {
        toastr.info("Please Select Stock type")
        return
      }
      self.loading=true
      RiotControl.trigger('read_rejected_docket',self.stockTypeForReadRejectedDocketInput.value)
    }

    self.readDocket = () => {
      if (self.stockTypeForReadRejectToPartyInput.value=='') {
        toastr.info("Please Select Stock type")
        return
      }
      self.loading=true
      RiotControl.trigger('read_docket_to_reject',self.stockTypeForReadRejectToPartyInput.value)
    }

    self.selectDocketItems = (item,e) => {
      console.log(e.item)
      e.item.m.selected=!e.item.m.selected
      console.log(self.materials)
    }

    self.showRejectToPartyHome = () => {
      self.title=''
      self.reject_to_party_view='reject_to_party_home_page'
    }

    self.viewDocketDetails = (d,e) => {
      self.loading=true
      RiotControl.trigger('read_rejected_docket_details',d.docket_id,d.reject_to_party_id)

    }
    self.edit = (d,e) => {
      self.loading=true
      self.reject_to_party_docket_id=d.docket_id
      self.edit_reject_to_party_id=d.reject_to_party_id
      RiotControl.trigger('read_rejected_docket_edit',d.docket_id,d.reject_to_party_id)
      
    }

    self.rejectToPartyEnteryForm = (d,e) =>{
      self.loading=true
      self.reject_to_party_docket_id=d.docket_id
      console.log('calling resd sdsd')
      RiotControl.trigger('read_docket_details_reject_to_party',d.docket_id,self.stockTypeForReadRejectToPartyInput.value)
    }

    self.submitRejectToParty = () =>{
      if(self.rejectToPartyDateInput.value==''){
        toastr.error("Please Enter Reject Date")
        return
      }

      let str=self.rejectToPartyDateInput.value;
      var d = str.split("/");
      var po_date = moment([d[2].trim()+d[1].trim()+d[0].trim()],'YYYYMMDD')
      var toDay=moment().format('YYYYMMDD')

      let from = moment(po_date, 'YYYYMMDD'); 
      let to = moment(toDay, 'YYYYMMDD');     
      let differnece=to.diff(from, 'days')  

      if(differnece<0){
        toastr.error("Reject date can not be greater than today")
        return
      }

      if(self.transporterInput.value==''){
        toastr.error("Please Enter Transporter Name")
        return
      }

      if(self.vehicleInput.value==''){
        toastr.error("Please Enter Vehicle No")
        return
      }


      if(self.modeOfTransportInput.value==''){
        toastr.error("Please Enter Mode of Transpotation")
        return
      }
      
      var count=0
      let selectedMaterials=[]
      let error=''
      self.materials.map(i=>{
        count++
        if (i.selected) {
          let rejectToPartyInput= '#rejectToPartyInput'+i.transaction_id
          i.reject_to_party_qty=$(rejectToPartyInput).val()
          if(i.reject_to_party_qty==''){
            error=error + " Please Enter return qty"+count+", ";
          }

          
          if(self.title=='Add'){
            console.log('qty= '+i.qty+ 'return_qty= '+ i.reject_to_party_qty)
            if (Number(i.qty)<Number(i.reject_to_party_qty)) {
              error=error + "Return Qty"+count+" can't be greater than Qty, ";
            }
          }else if(self.title=='Edit'){
             let max_qty=Number(i.qty)+Number(i.reject_to_party_qty_old)//qty=remaing_docket_qty
             console.log('max qty= '+max_qty+ 'return_qty= '+ i.reject_to_party_qty)
             if(Number(max_qty)<Number(i.reject_to_party_qty)){
                 error=error + "Return Qty"+count+" can't be greater than Qty, ";
             }
          }

          let rejectToPartyRemarks= '#rejectToPartyRemarks'+i.transaction_id
          i.reject_to_party_remarks=$(rejectToPartyRemarks).val()
          selectedMaterials.push(i)
        }
      })

      if(selectedMaterials.length==0){
        error=error + " Please select at least one material";
      }

      if(error!=''){
        toastr.error(error)
        return
      }


      self.loading=true
      if(self.title=='Add'){
        RiotControl.trigger('reject_to_party',self.reject_to_party_docket_id,selectedMaterials,self.rejectToPartyDateInput.value,self.rejectedByInput.value,self.dockets,self.docketDetails.docket_date,self.transporterInput.value,self.lrNoInput.value,self.vehicleInput.value,self.modeOfTransportInput.value,self.reject_to_party_stock_type,self.reject_to_party_no)
      }else if(self.title=='Edit'){
        RiotControl.trigger('reject_to_party_edit',self.reject_to_party_docket_id,selectedMaterials,self.rejectToPartyDateInput.value,self.rejectedByInput.value,self.dockets,self.docketDetails.docket_date,self.transporterInput.value,self.lrNoInput.value,self.vehicleInput.value,self.modeOfTransportInput.value,self.reject_to_party_stock_type,self.reject_to_party_no,self.edit_reject_to_party_id)
      }

    }


    self.deleteRejectToParty = (e) =>{
      self.delete_reject_to_party_id=e.item.d.reject_to_party_id
      $("#deleteRejectToPartyModal").modal('show') 
    }
    self.confirmDeleteRejectToParty = (e) =>{
      self.loading=true
      RiotControl.trigger('delete_reject_to_party',self.delete_reject_to_party_id,self.rejectedDockets)
    }

    self.filterDockets = () => {
      if(!self.searchRjectedDocket) return
      self.filteredDockets = self.rejectedDockets.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchRjectedDocket.value.toLowerCase())>=0
      })

      self.paginate(self.filteredDockets, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page)
    }

    /*method change callback from store*/
    RiotControl.on('stock_types_details_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('read_rejected_docket_changed', function(dockets) {
      self.loading=false
      self.rejectedDockets=[]
      self.rejectedDockets=dockets
      self.filteredDockets=dockets

      self.paginate(self.filteredDockets, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page)
      self.update()
    })

    RiotControl.on('read_docket_to_reject_changed', function(dockets) {
      self.loading=false
      self.dockets=[]
      self.dockets=dockets
      self.update()
    })
    
    RiotControl.on('read_rejected_docket_details_changed', function(dockets) {
      self.loading=false
      self.reject_to_party_view='reject_to_party_view'
      self.docketDetails=[]
      self.materials=[]
      self.docketDetails=dockets.details
      self.materials=dockets.items
      console.log(self.docketDetails)
      self.update()
    })

    RiotControl.on('read_docket_details_reject_to_party_changed', function(details,items,reject_to_party_no) {
      self.reject_to_party_view='reject_to_party'
      dateFormat('rejectToPartyDateInput')
      self.loading=false
      self.docketDetails=[]
      self.materials=[]

      self.docketDetails=details
      self.materials=items
      self.rejectedByInput.value=self.user_name
      self.reject_to_party_no=reject_to_party_no
      self.reject_to_party_stock_type=self.stockTypeForReadRejectToPartyInput.value
      $('#rejectToPartyDateInput').prop('disabled', false);
      self.update()
    })
    
    RiotControl.on('reject_to_party_changed', function(dockets) {
      self.loading=false
      self.reject_to_party_view='reject_to_party_home'
      self.dockets=[]
      self.dockets=dockets
      self.update()
    })

    RiotControl.on('reject_to_party_edit_changed', function(dockets) {
      self.loading=false
      self.reject_to_party_view='reject_to_party_home_page'
      self.update()
    })

    RiotControl.on('reject_to_party_date_error', function(msg) {
      self.loading=false
      toastr.error(msg)
      self.update()
    })

    RiotControl.on('fetch_user_details_from_session_for_reject_to_party_changed', function(user_name,user_id) {
      console.log('here')
      console.log(user_name)
      self.loading = false
      self.user_name=user_name
      self.user_id=user_id
      console.log(self.user_name)
      self.update()
    })

    RiotControl.on('delete_reject_to_party_changed', function(items) {
      self.loading = false
      $("#deleteRejectToPartyModal").modal('hide') 
      self.rejectedDockets=items;
      self.update()
   })

   RiotControl.on('read_rejected_docket_edit_changed', function(details,detailsRP,items) {
      self.reject_to_party_view='reject_to_party'
      dateFormat('rejectToPartyDateInput')
      self.title='Edit'
      self.loading=false
      self.docketDetails=[]
      self.materials=[]

      self.docketDetails=details
      self.materials=items
      self.rejectedByInput.value=self.user_name
      self.reject_to_party_no=detailsRP.reject_to_party_no
      self.reject_to_party_stock_type=detailsRP.stock_type_code


      self.rejectToPartyDateInput.value=detailsRP.reject_date
      self.transporterInput.value=detailsRP.transporter_name
      self.lrNoInput.value=detailsRP.lr_no
      self.vehicleInput.value=detailsRP.vehicle_no
      self.modeOfTransportInput.value=detailsRP.mode_of_transport
      $('#rejectToPartyDateInput').prop('disabled', true);

      self.materials.map(i=>{
        if(i.checked=='true'){
          let docketItemSelectionInput='#docketItemSelectionInput'+i.transaction_id
          $(docketItemSelectionInput).prop('checked', true);
          i.selected=true
        }else{
          let docketItemSelectionInput='#docketItemSelectionInput'+i.transaction_id
          $(docketItemSelectionInput).prop('checked', false);
          i.selected=false
        }
      })
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
      self.pagedDataItems = self.getPageData(self.filteredDockets, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredDockets, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/


    
 </script>

</reject-to-party>