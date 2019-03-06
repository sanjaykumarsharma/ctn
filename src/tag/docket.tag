<docket>
<loading-bar if={loading}></loading-bar>
<div show={docket_view =='docket_home'}>
 <div class="container-fluid">
  <div class="row">
    <div class="col-md-4">
      <div class="form-group row">
        <h1 class="col-xs-5 col-form-label">Docket</h1>
        <div class="col-xs-7" style="padding-top: 12px;">
          <!-- <label for="stockTypeInput">Stock Type</label> -->
          <select name="stockTypeForReadInput" class="form-control" onchange={readDocket}>
            <option></option>
            <option each={stock_types} value={stock_type_code}>{stock_type_code}-{stock_type}</option>
            <option value='all'>All</option>
          </select>
        </div>
      </div>
    </div>  
    <div class="col-md-8 text-xs-right" style="padding-top: 12px;">
      <div class="form-inline">
        <input type="search" name="searchDocket" class="form-control" placeholder="search" onkeyup={filterDockets} style="width:200px;margin-right: 10px;">
        <button class="btn btn-secondary" onclick={readDocket} style="margin-right: 10px;"><i class="material-icons">refresh</i></button>
        <button class="btn btn-secondary text-right" disabled={loading} onclick={showDocketEntryForm}><i class="material-icons">add</i></button>
      </div>
    </div>
  </div>

  <table class="table table-bordered">
   <tr>
    <th>Sl</th>
    <th>Docket Number</th>
    <th>Docket Date</th>
    <th>Party Name</th>
    <th>Bill No</th>
    <th>Bill Date</th>
    <th>Amount</th>
    <th></th>
   </tr>
   <tr each={d, i in pagedDataItems}>
     <td>{(current_page_no-1)*items_per_page + i + 1}</td>
     <td class="text-center">{d.stock_type_code}-{d.docket_no}</td>
     <td class="text-center">{d.docket_date}</td>
     <td class="text-center">{d.party_name}</td>
     <td class="text-center">{d.bill_no}</td>
     <td class="text-center">{d.bill_date}</td>
     <td class="text-center">{d.bill_amount}</td>
     <td>
       <button disabled={loading} class="btn btn-secondary btn-sm" onclick={viewDocketDetails.bind(this,d)}><i class="material-icons">visibility</i></button>
       <button disabled={loading} class="btn btn-secondary btn-sm" onclick={editDocket.bind(this,d)}><i class="material-icons">create</i></button>
       <button disabled={loading} class="btn btn-secondary btn-sm" onclick={deleteDocket.bind(this,d)}><i class="material-icons">delete</i></button>
       <!-- <button disabled={loading} class="btn btn-secondary btn-sm" onclick={rejectToPartyForm.bind(this,d)}><i class="material-icons">local_shipping</i></button> -->
     </td>
   </tr> 
   <tfoot class="no-print">
        <tr>
          <td colspan="8">
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

<div show={docket_view =='docket_entry'}>
 <div class="container-fluid">
 <h4>{title} Docket</h4>
 <button type="button" class="btn btn-secondary text-right" onclick={showDocketHome}>Close</button>
 <form>
     <div class="row">
        <div class="col-sm-3">
          <div class="form-group">
            <label for="stockTypeInput">Stock Type</label>
            <select name="stockTypeInput" class="form-control" onchange={readPurchaseOrder}>
                <option></option>
                <option each={stock_types} value={stock_type_code}>{stock_type_code}-{stock_type}</option>
              </select>
          </div>  
        </div>

        <div class="col-sm-3">
          <div class="form-group">
            <label for="partyInput">Party</label>
            <select name="partyInput" class="form-control" disabled>
                <option></option>
                <option each={parties} value={party_id}>{party_name}</option>
              </select>
          </div>  
        </div>

        <!-- <div class="col-sm-3">
          <div class="form-group">
            <label for="purchaseOrderInput">PO</label>
            <select name="purchaseOrderInput" id="purchaseOrderInput" class="form-control" onchange={readMaterials}>
                <option></option>
                <option each={purchaseOrders} value={po_id}>{stock_type_code}-{po_no}</option>
            </select>
          </div>  
        </div> -->
      
     </div>

     <!-- new fro multiple PO -->
     <div class="row">
      <div class="col-sm-12" style="padding-top: 10px;padding-bottom: 10px;">
        Select PO: &nbsp;&nbsp;&nbsp;&nbsp;
        <span each={p, i in purchaseOrders} style="padding-right: 10px;">
          <input type="checkbox" checked={p.selected} id="{'selectPOInput' + p.po_id}" onclick={selectPO.bind(this,p)}><span style="margin-left:5px;" class={ fyear: p.fyear=='true' }>{p.stock_type_code}-{p.po_no}</span>
        </span>
        <button type="button" id="readDetailsButton" class="btn btn-secondary" onclick={readMaterials} style="margin-left:5px;">GO</button>
      </div>  
       <!-- <div class="col-sm-3">
          <div class="form-group">
            <label for="purchaseOrderInput">PO</label>
            <select name="purchaseOrderInput" id="purchaseOrderInput" class="form-control" onchange={readMaterials}>
                <option></option>
                <option each={purchaseOrders} value={po_id}>{stock_type_code}-{po_no}</option>
            </select>
          </div>  
        </div>  -->
     </div>
     <!-- new fro multiple PO -->

     <div class="row bgColor">
      <div class="col-sm-3">
        <div class="form-group">
          <label for="docketNumberInput">Docket No</label>
          <input type="text" class="form-control" id="docketNumberInput" disabled>
        </div>
      </div>  
      <div class="col-sm-3">
        <div class="form-group">
          <label for="docketDateInput">Docket Date</label>
          <input type="text" class="form-control" id="docketDateInput" placeholder="DD/MM/YYYY">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <label for="billNumberInput">Bill No</label>
          <input type="text" class="form-control" id="billNumberInput" >
        </div>
      </div>  
      <div class="col-sm-3">
        <div class="form-group">
          <label for="billDateInput">Bill Date</label>
          <input type="text" class="form-control" id="billDateInput" placeholder="DD/MM/YYYY">
        </div>
      </div>
    </div>

    <div class="row bgColor">
      <div class="col-sm-3">
        <div class="form-group">
          <label for="challanNumberInput">Challan No</label>
          <input type="text" class="form-control" id="challanNumberInput" >
        </div>
      </div>  
      <div class="col-sm-3">
        <div class="form-group">
          <label for="challanDateInput">Challan Date</label>
          <input type="text" class="form-control" id="challanDateInput" placeholder="DD/MM/YYYY">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <label for="transporterNameInput">Transporter Name</label>
          <input type="text" class="form-control" id="transporterNameInput" >
        </div>
      </div>  
      <div class="col-sm-3">
        <div class="form-group">
          <label for="modeOfTranspotationInput">Mode of transpotation</label>
          <input type="text" class="form-control" id="modeOfTranspotationInput" >
        </div>
      </div>
    </div>

    <div class="row bgColor">
      <div class="col-sm-3">
        <div class="form-group">
          <label for="vehicleNumberInput">Vehicle No</label>
          <input type="text" class="form-control" id="vehicleNumberInput" >
        </div>
      </div>  
      <div class="col-sm-3">
        <div class="form-group">
          <label for="lrNumberInput">LR No</label>
          <input type="text" class="form-control" id="lrNumberInput" >
        </div>
      </div>
      
    </div>
                
   <div class="row">
    <table class="table table-bordered">
        <tr>
          <th>Sl</th>
          <th>Material</th>
          <th>PO No</th>
          <th>UOM</th>
          <th>Location</th>
          <th>Pending PO</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
          <th>Disc %</th>
          <th>Disc Amt</th>
          <th>P&F</th>
          <th each={dutyhead, a in dutyHeaders}>
           <strong>{dutyhead.tax_name}</strong>
          </th>
          <th each={taxhead, b in taxOneHeaders}>
             <strong>{taxhead.tax_name}</strong>
          </th>
          <th each={taxhead, c in taxTwoHeaders}>
             <strong>{taxhead.tax_name}</strong>
          </th>
          <th each={cesshead, d in cessHeaders}>
             <strong>{cesshead.tax_name}</strong>
          </th>
          <th>Other Charges</th>
          <th style="width: 130px;">Total</th>
          <th>Remarks</th> 
          <th></th>
        </tr>
        <tr each={m, i in materials}>
          <td>{i+1}</td>
          <td>{m.item_name}(Code:{m.item_id})</td>
          <td style="width:100px">{m.po_no}</td>
          <td>{m.uom}</td>
          <td>
            <select id="{ 'locationInput' + m.item_index }" class="form-control" onblur={changeLocation.bind(this,m)} style="width: 100px;">
               <option></option>
               <option each={locations} value={location}>{location}</option>
            </select>
          </td>
          <td>{m.po_qty}</td>
          <td>
            <input class="text-xs-right" type="text" id="{'qtyInput'+m.item_index}" value={m.qty} onblur={calculateTotalValue} class="form-control" style="width: 100px;" />
          </td>
          <td class="text-xs-right">{m.unit_value}</td>
          <td class="text-xs-right">{m.amount}</td>
          <td class="text-xs-right">{m.discount_percentage}</td>
          <td class="text-xs-right">{m.discount_amount}</td>
          <td class="text-xs-right">
            <input class="text-xs-right" type="text" id="{'pAndFInput'+m.item_index}" value={m.p_and_f_charges} onblur={calculateTotalValue} class="form-control" style="width: 100px;" />
          </td>
          <td each={d, j in m.duties} class="text-sm-right">
           {d.duty}
          </td>
          <td each={tone, k in m.taxone} class="text-sm-right">
           {tone.tax_one}
          </td>
          <td each={ttwo, l in m.taxtwo} class="text-sm-right">
           {ttwo.tax_two}
          </td>
          <td each={c, m in m.cess} class="text-sm-right">
           {c.cess}
          </td>
          <td class="text-xs-right">
            <input class="text-xs-right" type="text" id="{'otherChargesInput'+m.item_index}" value={m.other_charges} onblur={calculateTotalValue} class="form-control" style="width: 100px;" />
          </td>
          <td class="text-xs-right">{m.total}</td>
          <td>
            <input type="text" id="{ 'remarksInput' + m.item_index }"  value={m.remarks} onblur={changeRemarks.bind(this,m)} class="form-control" />
          </td>
          <td>
            <button class="btn btn-secondary" disabled={loading} onclick={removeSelectedMaterial.bind(this, m)} ><i class="material-icons">remove</i></button>
          </td>
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">Sub Total</td>
          <td class="text-xs-right">{sub_total}</td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">Insurance Charges</td>
          <td><input type="text" id="freightChargeInput" onblur={calculateCharge} class="form-control text-xs-right" style="width:120px"/></td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">P & F Charges</td>
          <td><input type="text" id="pAndFChargeInput" onblur={calculateCharge} class="form-control text-xs-right"/></td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">Delivery Charges</td>
          <td><input type="text" id="deliveryChargeInput" onblur={calculateCharge} class="form-control text-xs-right"/></td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">Loading Charges</td>
          <td><input type="text" id="loadingChargeInput" onblur={calculateCharge} class="form-control text-xs-right"/></td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">Packing Charges</td>
          <td><input type="text" id="packingChargeInput" onblur={calculateCharge} class="form-control text-xs-right"/></td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">Courier Charges</td>
          <td><input type="text" id="courierChargeInput" onblur={calculateCharge} class="form-control text-xs-right"/></td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">Round Off</td>
          <td><input type="text" id="roundOffInput" onblur={calculateCharge} class="form-control text-xs-right"/></td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan} style="text-align:right">Bill Amount</td>
          <td class="text-xs-right">{bill_amount}</td>
          <td colspan="2"></td> 
        </tr>
        <tr>
          <td colspan={colspan+3}>
             Remarks:&nbsp;&nbsp; <input type="text" id="docketRemarksInput" class="form-control">
          </td>
        </tr>
      </table>
   </div>

  </form>

  <div class="row">
   <button type="button" class="btn btn-secondary text-right" onclick={showDocketHome}>Close</button>
   <button type="button" class="btn btn-primary text-right" onclick={submitDocket} style="margin-right: 10px;">Submit</button>
  </div>
 </div>
</div>

<div class="container-fluid print-box" show={docket_view =='docket_view'}>
 
 <div class="row no-print">
   <button type="button" class="btn btn-secondary text-right" onclick={showDocketHome}>Close</button>
 </div>
   
 <div class="container-fluid" each={copy in copies}>
   <center>
     <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div>
        149,Barrackpore Trunk Road<br>
        P.O. : Kamarhati, Agarpara<br>
        Kolkata - 700058<br>
        Email: purchase@ntcind.com<br>
        {copy} Copy </span><br>
   </center><br>

   <table class="table table-bordered bill-info-table">
     <tr>
       <th style="width:90px">Store Type</th>
       <td> {docketDetails.stock_type_code}</td>
       <th>Party</th>
       <td colspan="3">{docketDetails.party_name}</td>
     </tr>
     <tr>
       <th>Docket No</th>
       <td>{docketDetails.docket_no}</td>
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
       <td>{docketDetails.po_no}</td>
       <th>Transporter</th>
       <td>{docketDetails.transporter_name}</td>
       <th>LR No</th>
       <td>{docketDetails.lr_no}</td>
     </tr>
     <tr>
       <th>PO Date</th>
       <td>{docketDetails.po_date}</td>
       <th>Vehicle No</th>
       <td>{docketDetails.vehicle_no}</td>
       <th><span style="font-size:11px;">Mode Of Transpotation</span></th>
       <td>{docketDetails.transpotation_mode}</td>
     </tr>
     <tr>
       <th colspan="2">Indent No & Date</th>
       <td colspan="4">{docketDetails.indent_no_and_date}</td>
     </tr>
   </table>

   <table class="table table-bordered bill-info-table print-small">
    <tr>
      <th style="max-width:50px;width:50px"><strong>Sl</strong></th>
      <th style="width:200px;"><strong>Material</strong></th>
      <th><strong>UOM</strong></th>
      <th><strong>Location</strong></th>
      <th><strong>Qty</strong></th>
      <th><strong>Rate</strong></th>
      <th><strong>Amount</strong></th>
      <th><strong>Discount</strong></th>
      <th show={docketDetails.p_and_f_charges}><strong>P&F</strong></th>
      <th each={dutyhead, a in dutyHeadersView}>
       <strong>{dutyhead.tax_name}</strong>
      </th>
      <th each={taxhead, b in taxOneHeadersView}>
         <strong>{taxhead.tax_name}</strong>
      </th>
      <th each={taxhead, c in taxTwoHeadersView}>
         <strong>{taxhead.tax_name}</strong>
      </th>
      <th each={cesshead, d in cessHeadersView}>
         <strong>{cesshead.tax_name}</strong>
      </th>
      <th show={docketDetails.other_charges}><strong>Other Charges</strong></th>
      <th style="width: 130px;"><strong>Total</strong></th>
    </tr>
    <tr each={m, i in materialsView}>
      <td><div class="slno">{i+1}</div></td>
      <td>{m.item_name}-(Code:{m.item_id})</td>
      <td>{m.uom}</td>
      <td>{m.location}</td>
      <td class="text-xs-right">{m.qty}</td>
      <td class="text-xs-right">{m.unit_value}</td>
      <td class="text-xs-right">{m.amount}</td>
      <td class="text-xs-right">{m.discount_amount}<br>({m.discount_percentage}%)</td>
      <td class="text-xs-right" show={docketDetails.p_and_f_charges}>{m.p_and_f_charge}</td>
      <td each={d, j in m.duties} class="text-sm-right">
       {d}
      </td>
      <td each={tone, k in m.taxone} class="text-sm-right">
       {tone}
      </td>
      <td each={ttwo, l in m.taxtwo} class="text-sm-right">
       {ttwo}
      </td>
      <td each={c, m in m.cess} class="text-sm-right">
       {c}
      </td>
      <td class="text-xs-right" show={docketDetails.other_charges}>{m.other_charges}</td>
      <td class="text-xs-right">{m.total}</td>
    </tr>
    <tr>
      <td colspan={colspanView} style="text-align:right">Sub Total</td>
      <td class="text-xs-right">{docketDetails.sub_total_amount}</td>
    </tr>
    <tr hide={docketDetails.freight_charge==0.00}>
      <td colspan={colspanView} style="text-align:right">Insurance Charges</td>
      <td class="text-xs-right">{docketDetails.freight_charge}</td>
    </tr>
    <tr hide={docketDetails.p_and_f_charge==0.00}>
      <td colspan={colspanView} style="text-align:right">P & F Charges</td>
      <td class="text-xs-right">{docketDetails.p_and_f_charge}</td>
    </tr>
    <tr hide={docketDetails.delivery_charge==0.00}>
      <td colspan={colspanView} style="text-align:right">Delivery Charges</td>
      <td class="text-xs-right">{docketDetails.delivery_charge}</td>
    </tr>
    <tr hide={docketDetails.loading_charge==0.00}>
      <td colspan={colspanView} style="text-align:right">Loading Charges</td>
      <td class="text-xs-right">{docketDetails.loading_charge}</td>
    </tr>
    <tr hide={docketDetails.packing_charge==0.00}>
      <td colspan={colspanView} style="text-align:right">Packing Charges</td>
      <td class="text-xs-right">{docketDetails.packing_charge}</td>
    </tr>
    <tr hide={docketDetails.courier_charge==0.00}>
      <td colspan={colspanView} style="text-align:right">Courier Charges</td>
      <td class="text-xs-right">{docketDetails.courier_charge}</td>
    </tr>
    <tr hide={docketDetails.round_off_amount==0.00}>
      <td colspan={colspanView} style="text-align:right">Round off</td>
      <td class="text-xs-right">{docketDetails.round_off_amount}</td>
    </tr>
    <tr>
      <td colspan={colspanView} style="text-align:right">Bill Amount</td>
      <td class="text-xs-right">{docketDetails.bill_amount}</td>
    </tr>
    <tr>
      <td>Remarks</td>
      <td colspan={colspanView}>{docketDetails.remarks}</td>
    </tr>
  </table>

  <br>
  <table class="table indent-footer divFooter1">
   <tr>
     <td></td>
     <td></td>
     <td style="width:250px;"><div><center>{copy} Authority</center></div></td>
   </tr>
  </table>

  <div class="page-break"></div>
   
 </div>
</div>

<div class="modal fade" id="deleteDocketModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Delete Docket</h4>
      </div>
      <div class="modal-body">
        <center><strong>Are you sure to delete docket</strong></center>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick={confirmDeleteDocket}>Delete</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

 <script>
    var self = this
    self.on("mount", function(){
      self.items_per_page = 10
      self.copies=['Accounts','Inspection','Store']
      RiotControl.trigger('read_stock_type_details')
      RiotControl.trigger('read_parties')
      RiotControl.trigger('read_locations')
      //dateFormat('docketStartDateInput')
      //dateFormat('docketEndDateInput')
      self.docket_view='docket_home'
      self.update()
      $(document).keypress(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
          e.preventDefault();
          console.log('no action')
          return false;
        }
      })     
    })

    self.selectPO = (item,e) => {
      item.selected=!e.item.p.selected
    } 

    self.readDocket = () => {
      if (self.stockTypeForReadInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      
      self.loading=true
      RiotControl.trigger('read_docket',self.stockTypeForReadInput.value)
    }

    self.showDocketEntryForm = () => {
      self.title='Add'  
      self.docket_view='docket_entry'
      dateFormat('docketDateInput')
      dateFormat('billDateInput')
      dateFormat('challanDateInput')
      self.materials=[]
      self.clearData()
      //$("#purchaseOrderInput").prop( "disabled", false );

      self.purchaseOrders.map(i=>{
        let selectPOInput='#selectPOInput'+i.po_id
        $(selectPOInput).prop( "disabled", false );
        $(selectPOInput).prop( "checked", false );
      })
        $(readDetailsButton).prop( "disabled", false );
        
      $("#docketDateInput").prop( "disabled", false );

    }

    self.viewDocketDetails = (d,e) => {
      self.loading=true
      RiotControl.trigger('read_docket_details',d.docket_id)

    }

    self.showDocketHome = () => {
      self.docket_view='docket_home'
    }

    self.readPurchaseOrder = () => {
      if (self.stockTypeInput.value=='') {
        toastr.error("Please select a Stock Type and try again")
        return
      }
      self.loading=true
      RiotControl.trigger('read_po_for_docket',self.stockTypeInput.value)
    }

    self.readMaterials = () => {
      /*if (self.purchaseOrderInput.value=='') {
        toastr.error("Please select a Purchase Order Number and try again")
        return
      }*/
      let selectedPO=[]
      self.purchaseOrders.map(i=>{
        if(i.selected==true){
           selectedPO.push(i.po_id)
        }
      })

      console.log(selectedPO)
      self.loading=true
      //RiotControl.trigger('read_material',self.purchaseOrderInput.value)
      RiotControl.trigger('read_material',selectedPO)
    }

    /*docket form values start*/

    self.changeLocation = (m, e) => {
      self.materials.map(i=>{
        if(m.item_index==i.item_index){
          let locationInput= '#locationInput'+i.item_index
          i.location=$(locationInput).val()
        }
      })
    }

    self.calculateTotalValue = (e) => {
      let qtyInput= '#qtyInput'+e.item.m.item_index
      let temp_qty = Number($(qtyInput).val())
      if(isNaN(temp_qty)){
        temp_qty = 0
      }

      if(self.title=='Add'){
        if(temp_qty>Number(e.item.m.po_qty)){
          toastr.error('Qty can not be grater than PO qty')
          temp_qty = 0
        }
      }else if(self.title=='Edit'){
        let max_po_qty=Number(e.item.m.po_qty) + Number(e.item.m.prev_qty)
        if(temp_qty>max_po_qty){
          toastr.error('Qty can not be grater than PO qty')
          temp_qty = 0
        }
      }

      let qty= Number(temp_qty).toFixed(3)
      e.item.m.qty= qty//Qty
      
      e.item.m.amount= Number(Number(e.item.m.unit_value) * Number(qty)).toFixed(2)
      e.item.m.discount_amount=Number((Number(e.item.m.amount) * Number(e.item.m.discount_percentage))/100).toFixed(2)
      e.item.m.sub_total= Number(Number(e.item.m.amount)-Number(e.item.m.discount_amount)).toFixed(2)

      let pAndFInput= '#pAndFInput'+e.item.m.item_index
      let temp_p_and_f_charges = $(pAndFInput).val()
      if(isNaN(temp_p_and_f_charges)){
        temp_p_and_f_charges = 0
      }
      let p_and_f_charges = Number(temp_p_and_f_charges).toFixed(2)
      e.item.m.p_and_f_charges = p_and_f_charges//P&F Charges
      
      let sub_total=Number(e.item.m.sub_total)+Number(e.item.m.p_and_f_charges) //amount after P&F
      console.log(sub_total)
      
      /*duty start*/
      let duty=0
      let dutyArray=[]
      dutyArray=e.item.m.duties

      dutyArray.map(i=>{
        if(i.duty_rate!=''){
          i.duty=Number((Number(sub_total) * Number(i.duty_rate))/100).toFixed(2)
          duty=Number((Number(sub_total) * Number(i.duty_rate))/100).toFixed(2)
        }
      })
      e.item.m.amount_after_duty= Number(Number(sub_total)+Number(duty)).toFixed(2)
      /*duty end*/

      /*taxOne start*/
      let tax_one=0
      let taxOneArray=[]
      taxOneArray=e.item.m.taxone

      taxOneArray.map(i=>{
        if(i.tax_one_rate!=''){
          i.tax_one=Number((Number(e.item.m.amount_after_duty) * Number(i.tax_one_rate))/100).toFixed(2)
          tax_one=Number((Number(e.item.m.amount_after_duty) * Number(i.tax_one_rate))/100).toFixed(2)
        }
      })
      /*taxOne end*/

      /*taxTwo start*/
      let tax_two=0
      let taxTwoArray=[]
      taxTwoArray=e.item.m.taxtwo

      taxTwoArray.map(i=>{
        if(i.tax_two_rate!=''){
          i.tax_two=Number((Number(e.item.m.amount_after_duty) * Number(i.tax_two_rate))/100).toFixed(2)
          tax_two=Number((Number(e.item.m.amount_after_duty) * Number(i.tax_two_rate))/100).toFixed(2)
        }
      })
      /*taxTwo end*/

      /*cess start*/
      let cess=0
      let cessArray=[]
      cessArray=e.item.m.cess

      cessArray.map(i=>{
        if(i.cess_rate!=''){
          i.cess=Number((Number(e.item.m.amount_after_duty) * Number(i.cess_rate))/100).toFixed(2)
          cess=Number((Number(e.item.m.amount_after_duty) * Number(i.cess_rate))/100).toFixed(2)
        }
      })
      /*cess end*/

      /*other Charges Start*/
      let otherChargesInput= '#otherChargesInput'+e.item.m.item_index
      let temp_other_charges = $(otherChargesInput).val()
      if(isNaN(temp_other_charges)){
        temp_other_charges = 0
      }
      let other_charges = Number(temp_other_charges).toFixed(2)
      e.item.m.other_charges = other_charges
      /*other Charges End*/

      e.item.m.total=Number(Number(e.item.m.amount_after_duty)+Number(tax_one)+Number(tax_two)+Number(cess)+Number(other_charges)).toFixed(2)//total
      console.log(e.item.m.total)

      let docket_subtotal=0
      self.materials.map(i=>{
        docket_subtotal= Number(docket_subtotal) + Number(i.total)
      })
      self.sub_total=Number(docket_subtotal).toFixed(2)
      console.log(self.sub_total)
      self.calculateCharge()
    }
    
    self.calculateCharge = () => {
      let total=0

      let freight_charge = 0
      if(isNaN(self.freightChargeInput.value)){
        freight_charge = 0
      }else{
        freight_charge = Number(self.freightChargeInput.value).toFixed(2)
      }

      let p_and_f_charge = 0
      if(isNaN(self.pAndFChargeInput.value)){
        p_and_f_charge = 0
      }else{
        p_and_f_charge = Number(self.pAndFChargeInput.value).toFixed(2)
      }
      
      let delivery_charge = 0
      if(isNaN(self.deliveryChargeInput.value)){
        delivery_charge = 0
      }else{
        delivery_charge = Number(self.deliveryChargeInput.value).toFixed(2)
      }

      let loading_charge = 0
      if(isNaN(self.loadingChargeInput.value)){
        loading_charge = 0
      }else{
        loading_charge = Number(self.loadingChargeInput.value).toFixed(2)
      }

      let packing_charge = 0
      if(isNaN(self.packingChargeInput.value)){
        packing_charge = 0
      }else{
        packing_charge = Number(self.packingChargeInput.value).toFixed(2)
      }

      let courier_charge = 0
      if(isNaN(self.courierChargeInput.value)){
        courier_charge = 0
      }else{
        courier_charge = Number(self.courierChargeInput.value).toFixed(2)
      }

      let round_off_amount = 0
      if(isNaN(self.roundOffInput.value)){
        round_off_amount = 0
      }else{
        round_off_amount = Number(self.roundOffInput.value).toFixed(2)
      }

      self.bill_amount=Number(Number(self.sub_total)+Number(freight_charge)+Number(p_and_f_charge)+Number(delivery_charge)+Number(loading_charge)+Number(packing_charge)+Number(courier_charge)+Number(round_off_amount)).toFixed(2)
    }
    
    self.changeRemarks = (item, e) => {
      self.materials.map(i=>{
        if(item.item_index==i.item_index){
          let remarksInput= '#remarksInput'+i.item_index
          i.remarks=$(remarksInput).val()
        }
      })
    }

    self.removeSelectedMaterial = (i,e) => { 
      let tempSelectedMaterialsArray = self.materials.filter(c => {
        return c.item_index != i.item_index
      })
      self.materials=tempSelectedMaterialsArray
      console.log(self.materials);

      let docket_subtotal=0
      self.materials.map(i=>{
        docket_subtotal= Number(docket_subtotal) + Number(i.total)
      })
      self.sub_total=Number(docket_subtotal).toFixed(2)
      self.calculateCharge()
    }  

    /*docket form values end*/

    self.submitDocket = () => {//add docket
      if (self.docketDateInput.value==''){
        toastr.info("Please Enter Docket Date and try again")
        return
      }

      let str=self.docketDateInput.value;
      var d = str.split("/");
      var docket_date = moment([d[2].trim()+d[1].trim()+d[0].trim()],'YYYYMMDD')
      var toDay=moment().format('YYYYMMDD')

      let from = moment(docket_date, 'YYYYMMDD'); 
      let to = moment(toDay, 'YYYYMMDD');     
      let differnece=to.diff(from, 'days')  
      console.log('differnece'+differnece)

      if(differnece<0){
        toastr.error("Docket date can not be greater than today")
        return
      }
      
      //po date vs docket date
      if(self.title=='Add'){
      let str1=self.details['po_date']
      var d2 = str1.split("/");
      var po_date = moment([d2[2].trim()+d2[1].trim()+d2[0].trim()],'YYYYMMDD')
      let pd = moment(po_date, 'YYYYMMDD');    //po_date
      let diff_of_po_docket=pd.diff(from, 'days')  

      if(diff_of_po_docket>0){
        toastr.error("Docket date can not be less than PO Date")
        return
      }
      
      
      //po date vs bill date 
      if(self.billDateInput.value!=''){
        let bstr=self.billDateInput.value;
        var d1 = bstr.split("/");
        var bill_date = moment([d1[2].trim()+d1[1].trim()+d1[0].trim()],'YYYYMMDD')
        
        let bd = moment(bill_date, 'YYYYMMDD'); 
        let dif=pd.diff(bd, 'days')  

        if(dif>0){
          toastr.error("Bill date can not be leass than PO Date")
          return
        }
      }

      //po date vs bill date 
      if(self.challanDateInput.value!=''){
        let cstr=self.challanDateInput.value;
        var d5 = cstr.split("/");
        var challan_date = moment([d5[2].trim()+d5[1].trim()+d5[0].trim()],'YYYYMMDD')
        
        let ch_date = moment(challan_date, 'YYYYMMDD'); 
        let diff_with_chalan_date=pd.diff(ch_date, 'days')  

        if(diff_with_chalan_date>0){
          toastr.error("Challan date can not be leass than PO Date")
          return
        }
      }

      }

      if (self.stockTypeInput.value==''){
        toastr.info("Please select Stock Type and try again")
        return
      }
      if (self.partyInput.value==''){
        toastr.info("Please select Party and try again")
        return
      }
      /*if (self.purchaseOrderInput.value==''){
        toastr.info("Please select Purchase Order and try again")
        return
      }*/
      if (self.docketNumberInput.value==''){
        toastr.info("Please Enter Docket Number and try again")
        return
      }
      
      if (self.billNumberInput.value=='' && self.billDateInput.value=='' && self.challanDateInput.value=='' && self.challanNumberInput.value==''){
        toastr.info("Please Enter Bill/Challan Number and Bill/Challan Date")
        return
      } 

      var count=0
      let error=''
      self.materials.map(i=>{
        count++

        let temp_qty = Number(i.qty)
        if(isNaN(temp_qty)){
          temp_qty = 0
        }

        if(temp_qty==0){
          error=error + " Please Enter a valid Docket Qty"+count+", ";
        }
      })

      if(error!=''){
        toastr.error(error)
        return
      }
      
      self.loading=true
      var obj={}
      obj['stock_type_code']=self.stockTypeInput.value
      obj['party_id']=self.partyInput.value
      //obj['po_id']=self.purchaseOrderInput.value
      obj['po_id']=self.details.po_ids
      obj['docket_no']=self.docketNumberInput.value
      obj['docket_date']=self.docketDateInput.value
      obj['bill_no']=self.billNumberInput.value
      obj['bill_date']=self.billDateInput.value
      obj['challan_no']=self.challanNumberInput.value
      obj['challan_date']=self.challanDateInput.value
      obj['transporter_name']=self.transporterNameInput.value
      obj['transpotation_mode']=self.modeOfTranspotationInput.value
      obj['vehicle_no']=self.vehicleNumberInput.value
      obj['lr_no']=self.lrNumberInput.value
      obj['sub_total_amount']=self.sub_total
      obj['freight_charge']=self.freightChargeInput.value
      obj['p_and_f_charge']=self.pAndFChargeInput.value
      obj['delivery_charge']=self.deliveryChargeInput.value
      obj['loading_charge']=self.loadingChargeInput.value
      obj['packing_charge']=self.packingChargeInput.value
      obj['courier_charge']=self.courierChargeInput.value
      obj['round_off_amount']=self.roundOffInput.value
      obj['bill_amount']=self.bill_amount
      obj['remarks']=self.docketRemarksInput.value
      if (self.title=='Add') {
        RiotControl.trigger('save_docket', self.materials, obj)
      }else if(self.title=='Edit'){
        console.log("edit docket")
        RiotControl.trigger('edit_docket', self.materials, obj,self.edit_docket_id)
      }
    }
  

    self.editDocket = (d,e) =>{
      self.loading=true
      self.title='Edit'
      self.bill_amount=''
      self.edit_docket_id=d.docket_id
      RiotControl.trigger('read_docket_details_edit',d.docket_id,d.po_id)
    }

    self.deleteDocket = (d,e) =>{
      self.delete_docket_id=d.docket_id
      $("#deleteDocketModal").modal('show') 
    }
    self.confirmDeleteDocket = (d,e) =>{
      self.loading=true
      RiotControl.trigger('delete_docket',self.delete_docket_id,self.dockets)
    }

    self.clearData=()=>{
      self.update();
      self.purchaseOrders=[]
      self.materials=[]
      self.stockTypeInput.value=''
      self.partyInput.value=''
      //self.purchaseOrderInput.value=''
      self.docketNumberInput.value=''
      self.docketDateInput.value=''
      self.billNumberInput.value=''
      self.billDateInput.value=''
      self.challanNumberInput.value=''
      self.challanDateInput.value=''
      self.transporterNameInput.value=''
      self.modeOfTranspotationInput.value=''
      self.vehicleNumberInput.value=''
      self.lrNumberInput.value=''
      
      self.sub_total=''
      self.freightChargeInput.value=''
      self.pAndFChargeInput.value=''
      self.deliveryChargeInput.value=''
      self.loadingChargeInput.value=''
      self.packingChargeInput.value=''
      self.courierChargeInput.value=''
      self.roundOffInput.value=''
      self.bill_amount=''
      self.docketRemarksInput.value=''
    }

    self.filterDockets = () => {
      if(!self.searchDocket) return
      self.filteredDockets = self.dockets.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchDocket.value.toLowerCase())>=0
      })

      self.paginate(self.filteredDockets, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page)
    }

    /*method change callback from store*/
    RiotControl.on('stock_types_details_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('parties_changed', function(parties) {
      self.parties = parties
      self.update()
    })

    RiotControl.on('locations_changed', function(locations) {
      self.locations = locations
      self.update()
    })

    RiotControl.on('read_po_for_docket_changed', function(purchaseOrders,docket_no) {
      self.loading=false
      self.purchaseOrders = purchaseOrders
      if(self.purchaseOrders.length==0) {
        toastr.info("No purchase order found")
      }
      self.docketNumberInput.value=docket_no
      self.update()
    })

    RiotControl.on('read_material_changed', function(material) {
      console.log(material)
      self.loading=false
      self.update()
      self.dutyHeaders=[]
      self.dutyHeaders = material.dutyHeaders

      self.taxOneHeaders=[]
      self.taxOneHeaders = material.taxOneHeaders

      self.taxTwoHeaders=[]
      self.taxTwoHeaders = material.taxTwoHeaders

      self.cessHeaders=[]
      self.cessHeaders = material.cessHeaders

      self.materials=[]
      self.materials = material.materials
      self.details = material.details
      
      self.colspan=self.details['colspan']
      self.partyInput.value=self.details['party_id']
      self.update()
      self.materials.map(i=>{        
         //location
         let locationInput= '#locationInput'+i.item_index
         console.log(locationInput)
         console.log(i.location)
         $(locationInput).val(i.location);
      })
    })

    RiotControl.on('docket_save_changed', function() {
      self.loading=false
      self.docket_view='docket_home'
      self.clearData()
      self.update()
    })

    RiotControl.on('read_docket_changed', function(dockets) {
      self.loading=false
      self.dockets=[]
      self.dockets=dockets
      self.filteredDockets=dockets

      self.paginate(self.filteredDockets, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDockets, 1, self.items_per_page)      
      self.update()
    })


    RiotControl.on('read_docket_details_changed', function(dockets) {
      self.loading=false
      self.docket_view='docket_view'

      self.docketDetails=[]
      self.docketDetails=dockets.details

      self.materialsView=[]
      self.materialsView=dockets.items

      self.dutyHeadersView=[]
      self.dutyHeadersView = dockets.dutyHeaders

      self.taxOneHeadersView=[]
      self.taxOneHeadersView = dockets.taxOneHeaders

      self.taxTwoHeadersView=[]
      self.taxTwoHeadersView = dockets.taxTwoHeaders

      self.cessHeadersView=[]
      self.cessHeadersView = dockets.cessHeaders
      console.log(self.docketDetails['other_charges'])

      if(self.docketDetails['other_charges']){
        self.colspanView=9
      }else{
        self.colspanView=8
      }

      if(self.docketDetails['p_and_f_charges']){
        self.colspanView=self.colspanView+1
      }
      
      self.colspanView=self.colspanView + self.dutyHeadersView.length + self.taxOneHeadersView.length + self.taxTwoHeadersView.length + self.cessHeadersView.length
      
      self.update()
    })

    RiotControl.on('read_docket_details_edit_changed', function(dockets) {
      self.docket_view='docket_entry'
      self.loading=false
      self.purchaseOrders=[]
      self.purchaseOrders = dockets.purchaseOrders

      self.dutyHeaders=[]
      self.dutyHeaders = dockets.dutyHeaders

      self.taxOneHeaders=[]
      self.taxOneHeaders = dockets.taxOneHeaders

      self.taxTwoHeaders=[]
      self.taxTwoHeaders = dockets.taxTwoHeaders

      self.cessHeaders=[]
      self.cessHeaders = dockets.cessHeaders


      self.materials=[]
      self.materials = dockets.items

      console.log(self.materials);
      
      self.colspan=13
      self.colspan=self.colspan + self.dutyHeaders.length + self.taxOneHeaders.length + self.taxTwoHeaders.length + self.cessHeaders.length

      self.stockTypeInput.value=dockets.details.stock_type_code
      self.partyInput.value=dockets.details.party_id
      //self.purchaseOrderInput.value=dockets.details.po_id
      self.docketNumberInput.value=dockets.details.docket_no
      self.docketDateInput.value=dockets.details.docket_date
      self.billNumberInput.value=dockets.details.bill_no
      self.billDateInput.value=dockets.details.bill_date
      self.challanNumberInput.value=dockets.details.challan_no
      self.challanDateInput.value=dockets.details.challan_date
      self.transporterNameInput.value=dockets.details.transporter_name
      self.modeOfTranspotationInput.value=dockets.details.transpotation_mode
      self.vehicleNumberInput.value=dockets.details.vehicle_no
      self.lrNumberInput.value=dockets.details.lr_no
      self.sub_total=dockets.details.sub_total_amount

      self.freightChargeInput.value=dockets.details.freight_charge
      self.pAndFChargeInput.value=dockets.details.p_and_f_charge
      self.deliveryChargeInput.value=dockets.details.delivery_charge
      self.loadingChargeInput.value=dockets.details.loading_charge
      self.packingChargeInput.value=dockets.details.packing_charge
      self.courierChargeInput.value=dockets.details.courier_charge
      self.roundOffInput.value=dockets.details.round_off_amount

      self.bill_amount=dockets.details.bill_amount
      self.docketRemarksInput.value=dockets.details.remarks

      self.details=dockets.details
      
      self.update()
      //self.purchaseOrderInput.value=dockets.details.po_id
      self.materials.map(i=>{        
         //location
         let locationInput= '#locationInput'+i.item_index
         $(locationInput).val(i.location);

      })

      self.purchaseOrders.map(i=>{
        let selectPOInput='#selectPOInput'+i.po_id
        $(selectPOInput).prop( "disabled", true );
        $(selectPOInput).prop( "checked", true );
      })
        $(readDetailsButton).prop( "disabled", true );
      

      $("#docketDateInput").prop( "disabled", true );

      console.log('self.materials');
      console.log(self.materials);
      
      self.update()
    })

    RiotControl.on('read_docket_details_edit_error_changed', function(dockets) {
      toastr.error("Edit not allowed, Items of this docket present in Return To Party")
      self.loading=false
      self.update()
    })

    RiotControl.on('delete_docket_changed', function(dockets) {
      self.loading=false
      $("#deleteDocketModal").modal('hide') 
      self.docket_view='docket_home'
      self.dockets=[]
      self.dockets=dockets
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

</docket>