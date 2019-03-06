<po>
<loading-bar if={loading}></loading-bar>
 <div show={po_view =='po_home'}>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-4">
        <div class="form-group row">
          <h1 class="col-xs-3 col-form-label">PO</h1>
          <div class="col-xs-9" style="padding-top: 12px;">
            <select name="selectIndentStatus" onchange={refreshPurchaseOrders} class="form-control">
              <option value=""></option>
              <option value="C">Completed</option>
              <option value="P">Pending</option>
              <option value="D">Deleted</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-sm-8 text-xs-right" style="padding-top: 12px;">
        <div class="form-inline">
          <input type="search" name="searchPurchaseOrderByStockType" class="form-control" placeholder="Search By PO No" style="width:200px"> 
          <input type="search" name="searchPurchaseOrder" class="form-control" placeholder="Search By Party, Date" onkeyup={filterPurchaseOrders} style="width:200px">
          <button class="btn btn-secondary" onclick={refreshPurchaseOrders}><i class="material-icons">refresh</i></button>
          <button class="btn btn-secondary" disabled={loading} onclick={showIndentModal}><i class="material-icons">add</i></button>
          <button class="btn btn-secondary" disabled={loading} onclick={showSelectItemModal}> Add PO without Indent </button>
        </div>
      </div>
    </div>
  </div>
      
  <div class="col-sm-12">
    <table class="table table-bordered">
      <tr>
        <th class="serial-col">Sl</th>
        <th>PO No</th>
        <th>PO Date</th>
        <th>Party Name</th>
        <th>Status</th>
        <th style="width:180px"></th>
      </tr>
      <tr each={p, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td class="text-center">{p.stock_type_code}-{p.po_no}</td>
        <td class="text-center">{p.po_date}</td>
        <td class="text-center">{p.party_name}</td>
        <td class="text-center">{p.status}</td>
        <td>
          <div class="table-buttons" hide={p.confirmDelete ||  p.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" show={p.po_without_indent=='N'} onclick={edit.bind(this, p)}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" show={p.po_without_indent=='Y'} onclick={editWithoutIndent.bind(this, p)}><i class="material-icons">create</i></button>


            <button disabled={loading} class="btn btn-secondary btn-sm" show={p.po_without_indent=='N'} onclick={viewPurchaseOrder.bind(this, p)}><i class="material-icons">visibility</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" show={p.po_without_indent=='Y'} onclick={viewPurchaseOrderWithoutIndent.bind(this, p)}><i class="material-icons">visibility</i></button>


            <button disabled={loading} class="btn btn-secondary btn-sm" hide={p.status=='C'} onclick={showPurchaseOrderModal.bind(this, p)}><i class="material-icons">done</i></button>

            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
            
          </div>
          <div class="table-buttons" if={p.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
        </td>
      </tr>
      <tfoot class="no-print">
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
 </div> <!-- PO home end -->

 <div class="container-fluid" show={po_view =='add_po'}><!-- add PO step Zero start-->
  <h4>{title} Purchase Order</h4>
  <button type="button" class="btn btn-secondary pull-sm-right" onclick={closePurchaseOrderStepZero} style="margin-bottom:5px;">Close</button> 
  <div class="row">
   <table class="table table-bordered">
      <tr>
        <th class="serial-col">Sl</th>
        <th style="width:50px"></th>
        <th>Indent No</th>
        <th>Indent Date</th>
        <th>Department</th>
        <th>Stock Type</th>
        <th>Indent Type</th>
      </tr>
      <tr each={m, i in indents}>
        <td>{i+1}</td>
        <td><input type="checkbox" checked={m.selected} id="{'indentSelectionInput' + m.indent_id}" onclick={selectIndent.bind(this,m)} class="form-control" style="margin-top: 5px;"></td>
        <td class={ fyear: m.fyear=='true' }>{m.stock_type_code}-{m.indent_no}</td>
        <td>{m.indent_date}</td>
        <td>{m.department}</td>
        <td>{m.stock_type}</td>
        <td>{m.indent_type_view}</td>
      </tr>
    </table>
    <button type="button" class="btn btn-primary pull-sm-right" onclick={purchaseOrderStepOne}>Next</button>
    <button type="button" class="btn btn-secondary pull-sm-right" onclick={closePurchaseOrderStepZero} style=" margin-right: 10px;">Close</button>  
  </div>
 </div> <!-- add PO step Zero end -->

  <div class="container-fluid" show={po_view =='add_po_step_one'}>
  <div class="row">
    <div class="col-md-9">
      <h4>{title} Purchase Order</h4>
    </div>
    <div class="col-md-3">
      <button type="button" class="btn btn-secondary pull-md-right" onclick={closePurchaseOrderStepOne} style="margin-bottom:5px;">Back</button>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6">
      <div class="form-group row">
        <label for="poDateInput" class="col-xs-4 col-form-label">PO Date</label>
        <div class="col-xs-8">
          <input type="text" id="poDateInput" class="form-control" placeholder="DD/MM/YYY" >
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group row">
        <label for="selectPartyNameInput" class="col-xs-4 col-form-label">Party</label>
        <div class="col-xs-8">
          <input type="text" id="selectPartyNameInput" class="form-control" >
        </div>
      </div>
    </div>      
  </div>

  <div class="row">
    <div class="col-md-6">
      <div class="form-group row">
        <label for="selectPartyNameInput" class="col-xs-4 col-form-label">Quotatoin Ref</label>
        <div class="col-xs-8">
          <input type="text" id="quotatoinRefInput" class="form-control" >
        </div>
      </div>
    </div> 
    <div class="col-md-6">
      <div class="form-group row">
        <label class="col-xs-4 col-form-label">PO No: {po_no_view}</label>
      </div>
    </div>      
    
  </div>


  <div class="row">
   <strong>Material</strong>
   <table class="table table-bordered calculation-table">
     <tr>
      <th class="serial-col">Sl</th>
      <th></th>
      <th>Material</th>
      <th>Description</th>
      <th>UOM</th>
      <th>Qty</th>
      <th>PO Qty</th>
      <th>Unit Value</th>
      <th>Amount</th>
      <th>Discount %</th>
      <!-- <th>Discount Amt</th> -->
      <th>P&F</th>
      <th>Duty</th>
      <th>Tax 1</th>
      <th>Tax 2</th>
      <th>Cess</th>
      <th>Other Charges</th>
      <th>Total</th>
      <!-- <th>Delivery Date</th> -->
      <th>Last Docket No</th>
      <th>LPP</th>
      <!-- <th>Remarks</th> -->
    </tr>
     <tr each={m, j in values }>
      <td>{j+1}</td>
      <td>
        <input type="checkbox" checked={m.selected} id="{'selectMaterialInput' + m.indent_material_map_id}" onclick={selectMaterial.bind(this,m)} style="margin-top: 5px;">
      </td>
      <td>{m.item_name}</td> 
      <td>
        <input type="text"  id="{'poDescriptionInput' + m.indent_material_map_id}" value={m.po_description} class="form-control" style="width: 100px;"/>
      </td>
      <td>{m.uom_code}</td>
      <td>{m.qty}</td>
      <td>
        <input type="text"  id="{'poQtyInput' + m.indent_material_map_id}" value={m.po_qty} onblur={calculateAmount} class="form-control text-xs-right" style="width: 100px;"/>
      </td>
      <td>
        <input type="text"  id="{'poUnitValueInput' + m.indent_material_map_id}" value={m.unit_value} onblur={calculateAmount} class="form-control text-xs-right" style="width: 100px;"/>
      </td>
      <td>{m.total_value}</td>
      <td>
        <input type="text"  id="{'discountPercentageInput' + m.indent_material_map_id}" value={m.discount_percentage} onblur={calculateAmount} class="form-control text-xs-right" /><br>
        {m.discount_amount}
      </td>
      <td>
        <input type="text"  id="{'poPAndFInput' + m.indent_material_map_id}" value={m.p_and_f} onblur={calculateAmount}  class="form-control text-xs-right" style="width: 100px;"/>
      </td>
      <td>
        <select id="{'selectDutyInput'+m.indent_material_map_id}" class="form-control" onchange={calculateAmount} style="width:150px">
          <option></option>
          <option each={duties} value={tax_id}>{tax}</option>
        </select><br>
        {m.duty}
      </td>
      <td>
        <select id="{'selectTaxOneInput'+m.indent_material_map_id}" class="form-control" onchange={calculateAmount} style="width:150px">
          <option></option>
          <option each={taxes} value={tax_id}>{tax}</option>
        </select><br>
        {m.tax_one}
      </td>
      <td>
        <select id="{'selectTaxTwoInput'+m.indent_material_map_id}" class="form-control" onchange={calculateAmount} style="width:150px">
          <option></option>
          <option each={taxes} value={tax_id}>{tax}</option>
        </select><br>
        {m.tax_two}
      </td>
      <td>
        <select id="{'selectCessInput'+m.indent_material_map_id}" class="form-control" onchange={calculateAmount} style="width:150px">
          <option></option>
          <option each={cess} value={tax_id}>{tax}</option>
        </select><br>
        {m.cess}
      </td>
      <td>
        <input type="text"  id="{'otherChargesInput' + m.indent_material_map_id}" value={m.other_charges} onblur={calculateAmount}  class="form-control text-xs-right" style="width: 100px;"/>
      </td>
      <td>{m.item_total}</td>
      <!-- <td>{m.delivery_date}</td> -->
      <td>{m.last_docket_no}</td>
      <td>{m.lp_price}</td>
      <!-- <td>{m.remarks}</td> -->
    </tr>
    </tr>
   </table>

   <strong>Terms & conditions</strong>
   <table class="table table-bordered">
     <tr>
      <th class="serial-col">Sl</th>
      <th class="serial-col"></th>
      <th>Terms & conditions</th>
    </tr>
     <tr each={t, i in conditions}>
      <td>{i+1}</td>
      <td><input type="checkbox" checked={t.selected} id="{'selectConditionInput' + t.condition_id}" onclick={selectCondition.bind(this,t)} style="margin-top: 5px;"></td>
      <td>{t.condition_name}</td>
    </tr>
   </table>

   <strong>Remarks</strong>
   <textarea id="poRemarks" class="form-control"></textarea>
   <br>
      
   <button type="button" class="btn btn-primary pull-sm-right" onclick={submitPurchaseOrderStepOne} >Submit</button> 
   <button type="button" class="btn btn-secondary pull-sm-right" onclick={closePurchaseOrderStepOne} style="margin-right: 10px;">Back</button>  
  </div>
 </div>

 


 <div class="container-fluid print-box" show={po_view =='po_view'}>
    <button class="btn btn-secondary text-right no-print" onclick={closePurchaseOrderView}><i class="material-icons">close</i></button>
    <table class="table po_table">
      <tr>
        <td style="width:30%;">
          <div style="margin-top:55px">To</div>
          <p style="padding-right: 0px;">
            {viewPODetails.party_name}<br>
            {viewPODetails.address}<br>

            {viewPODetails.tax_details}<br>
            {viewPODetails.tax_details1}</p>
        </td>  
        <!-- <td style="width:40%"> -->
        <td style="text-align:center;width:40%">
          <center>
            <img src="dist/img/logo.png" style="height: 30px;"><br>
            <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px">
          </center>
          <!-- <p style="padding-left:65px"> -->
          <p>
            149,Barrackpore Trunk Road<br>
            P.O. : Kamarhati, Agarpara<br>
            Kolkata - 700058<br>
            Phone: (033) 3019-0506/0509<br>
            Fax: (033) 3019-0520<br>
            Email: purchase@ntcind.com<br>
            Email: stores_ntc@rdbindia.com<br>
          </p>
        </td>  
        <td style="width:30%">
          <p style="padding-left: 20px;padding-top: 25px;">
          <strong>PURCHASE ORDER</strong><br>
            Order No: {viewPODetails.stock_type_code}-{viewPODetails.po_no}<br>
            Date: {viewPODetails.po_date}<br>
            Quotatoin Ref: {viewPODetails.quotatoin_ref}<br>
            Indent No: {viewPODetails.indent_ids}<br>
            ECC No: AABCR4307DXM001<br>
            VAT No: 19470968014<br>
            CST No: 19470968208<br>
            CIN No: L70109WB1991PLC053562<br>
            GSTIN: 19AABCR4307D1ZP
          </p>
        </td>
      </tr>
    </table>
    <hr style="margin-top: -25px;margin-bottom: 5px;">
    <p>
      Dear Sir,<br>
      With reference to your above noted quotation, we are pleased to place the purchase order on you to supply of the following items at our factory under following terms and conditions.
    </p>

     <table class="table table-bordered bill-info-table print-small">
      <thead>
        <tr>
        <th>Sl</th>
        <th style="width: 250px;"><strong>Description of Goods</strong></th>
        <th><strong>Quantity</strong></th>
        <th><strong>Unit</strong></th>
        <th><strong>Unit Price</strong></th>
        <th><strong>Total</strong></th>
        <th><strong>Discount</strong></th>
        <th show={viewPODetails.p_and_f_charges}><strong>P&F</strong></th>
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
        <th show={viewPODetails.other_charges}><strong>Other Charges</strong></th>
        <th><strong>Amount</strong></th>
      </tr>
      </thead>  
        <tr each={t, i in viewPurchaseOrders }>
          <td>{i+1}</td>
          <td style="width: 250px;">{t.item_name},{t.description}-(Code No:{t.item_id})</td>
          <td class="text-sm-right">{t.po_qty}</td>
          <td class="text-sm-right">{t.uom_code}</td>
          <td class="text-sm-right">{t.unit_value}</td>
          <td class="text-sm-right">{t.amount}</td>
          <td class="text-sm-right">{t.discount_amount} ({t.discount_percentage}%)</td>
          <td class="text-sm-right" show={viewPODetails.p_and_f_charges}>{t.p_and_f_charges}</td>
          <td each={d, j in t.duties} class="text-sm-right">
           {d}
          </td>
          <td each={tone, k in t.taxone} class="text-sm-right">
           {tone}
          </td>
          <td each={ttwo, l in t.taxtwo} class="text-sm-right">
           {ttwo}
          </td>
          <td each={c, m in t.cess} class="text-sm-right">
           {c}
          </td>
          <td class="text-sm-right" show={viewPODetails.other_charges}>{t.other_charges}</td>
          <td class="text-sm-right">{t.item_total}</td>
        </tr>
        <tr>
          <td colspan={viewPODetails.colspan} align="right">Total</td>
          <td class="text-sm-right">{viewPODetails.total}</td>
        </tr>
      <tbody>
        
        
      </tbody>
  </table>
  <table class="table po_table">
    <tr>
      <td>
          <strong style="text-decoration: underline;">TERMS AND CONDITIONS</strong>
          <ul>
            <li each={c, j in viewPOConditions}>{c.condition_name}</li>
          </ul>
      </td>
    </tr>
    <tr>
      <td>
        <p><strong>Remarks:</strong> {viewPODetails.remarks}</p>
      </td>
    </tr>
    <tr>  
      <td>
        <center style="text-align:right">
          <strong>For ntc industries limited<br><br><br><br>
          {viewPODetails.authorised_signatory}<br>
          (Purchase Manager/Authorised Signatory)
          </strong>
        </center>
      </td>
    </tr>
   </table>




   <button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closePurchaseOrderView} style="    margin-right: 10px;">Close</button>  
 </div><!-- po View end -->


 <div class="modal fade" id="statusModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">Complete Purchase Order</h4>
        </div>
        <div class="modal-body">
        
         <center>Are You sure, to mark this Purchase Order as completed.</center>
                     
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick={completePurchaseOrder}>Submit</button>
        </div>
      </div>
    </div>
  </div>

<div show={po_view =='select_items'}>
  <h4>{title} Purchase Order</h4>
   <div class="row bgColor">
    <div class="col-sm-3">
      <div class="form-group">
        <label for="selectIndentGroupFilter">Item Group</label>
        <input id="selectItemGroupFilter" type="text" class="form-control" />
      </div>
    </div>  
    <div class="col-sm-3">  
      <div class="form-group">
        <label for="selectStockTypeFilter">Stock Type</label>
        <select name="selectStockTypeFilter" class="form-control" style="min-width:250px">
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
      <th class="serial-col">Sl</th>
      <th style="width:75px"></th>
      <th>Material</th>
      <th>Group</th>
      <th>Qty</th>
      <th>Delivery Date</th>
    </tr>
    <tr each={it, i in materials} no-reorder>
      <td>{i+1}</td>
      <td><input type="checkbox" class="form-control"  checked={it.selected} onclick="{parent.toggle}"></td>
      <td>{it.item_name}-(Code:{it.item_id})</td>
      <td>{it.item_group}</td>
      <td><input type="text" class="form-control" id="qtyInputForPO{it.item_id}" style="padding:3px"></td>
      <td><input type="text" class="form-control" id="deliveryDateForPO{it.item_id}" placeholder="DD/MM/YYYY" style="padding:3px"></td>
    </tr>
  </table>
 </div>

  <div class="col-sm-12">
    <button type="button" class="btn btn-primary pull-sm-right" onclick={selectedMaterial}>Next</button>
    <button type="button" class="btn btn-secondary pull-sm-right" onclick={closePurchaseOrderStepZero} style="margin-right:10px;">Close</button>
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
              <button type="button" class="btn btn-primary" onclick={selectedMaterialForPO}>Submit</button>
          </div>
        </div>
        <div class="modal-body">
        
          <table class="table table-bordered">
          <tr>
            <th class="serial-col">Sl</th>
            <th style="width:75px"></th>
            <th>Material</th>
            <th>Group</th>
          </tr>
          <tr each={it, i in pagedDataMaterials} no-reorder>
            <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td>
            <td><input type="checkbox" class="form-control"  checked={it.selected} onclick="{parent.toggles}"></td>
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
          <button type="button" class="btn btn-primary" onclick={selectedMaterialForPO}>Submit</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    var self = this
    self.on("mount", function(){
      self.items_per_page = 10 
      self.items_per_page_new = 10
      //RiotControl.trigger('login_init')
      RiotControl.trigger('read_parties')
      RiotControl.trigger('read_taxes')
      RiotControl.trigger('read_conditions')
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('read_item_groups')
      self.po_without_indent='N'
      self.po_view='po_home'
      self.applyTaxArray={}
      self.applyDutyArray={}
      self.update()
      $(document).keypress(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
          e.preventDefault();
          console.log('no action')
          return false;
        }
      })     
      dateFormat('poDateInput')
    })


    self.showIndentModal = () => {
        self.title='Add'  
        self.po_without_indent='N'
        self.loading=true;
        RiotControl.trigger('read_indents_for_po_addition','F')
    }

    self.showSelectItemModal = () => {
        self.title='Add'
        self.po_without_indent='Y'
        self.po_view='select_items'
        self.materials=[]
    }

    self.selectIndent = (item,e) => {
      if(self.title=='Add'){
        item.selected=!e.item.m.selected
      }else if (self.title=='Edit') {
        self.indents.map(i=>{
          let indentSelectionInput= '#indentSelectionInput'+i.indent_id
          if($(indentSelectionInput).is(':checked')){
            i.selected=true
          }else{
            i.selected=false
          }
        })
      }
      console.log(self.indents)
    } 

    self.closePurchaseOrderStepZero = () => {
      self.po_view='po_home'
    }



    self.sameStockType = (selectedStockTypeCodeArray) => {
      if(self.title=='Add'){//any stock_type_code is allowed
        for(var i = 1; i < selectedStockTypeCodeArray.length; i++)
        { 
          if(selectedStockTypeCodeArray[i] != selectedStockTypeCodeArray[0]){
            return false;
          }
        }
        return true;
      }else if(self.title=='Edit'){
        for(var i = 0; i < selectedStockTypeCodeArray.length; i++)
        { 
          console.log(self.fixed_po_stock_type_code)
          if(selectedStockTypeCodeArray[i] != self.fixed_po_stock_type_code){
            return false;
          }
        }
        return true;
      }
      
    }

    self.purchaseOrderStepOne = () => {
      self.update();
      console.log(self.po_no_view)
      var selectedIndentArray=[]
      var selectedStockTypeCodeArray=[]
      self.selected_stock_type_code=''
      self.indent_stock_type='';
      self.indents.map(i=>{
        if(i.selected){
          selectedIndentArray.push(i.indent_id)
          selectedStockTypeCodeArray.push(i.stock_type_code)
        }
      })
     
      if(self.sameStockType(selectedStockTypeCodeArray)){
        self.selected_stock_type_code=selectedStockTypeCodeArray[0]
      }else{
        toastr.error('Please select same Stock Type')
        return;
      }
      console.log('self.selected_stock_type_code')
      console.log(self.selected_stock_type_code)

      if (selectedIndentArray.length>0){
        if (self.title=='Add') {
          console.log(self.selected_stock_type_code)
          RiotControl.trigger('read_indents_for_po', selectedIndentArray, self.selected_stock_type_code)
        }else if (self.title=='Edit') {
          RiotControl.trigger('read_edit_po', self.po_id , selectedIndentArray)
        }  
      }else{
        toastr.error('Please select at least one indent')
      }
        
    }

    self.closePurchaseOrderStepOne = () => {
      console.log(self.po_without_indent)
      if(self.po_without_indent=='Y'){
        self.po_view='po_home'
      }else{
        self.po_view='add_po'
      }
    }

    self.selectMaterial = (item,e) => {
      console.log(self.values)
      if (self.title=='Add') {
        e.item.m.selected=!e.item.m.selected
      console.log(self.values)
      }else if (self.title=='Edit') {
        self.values.map(i=>{
          let selectMaterialInput= '#selectMaterialInput'+i.indent_material_map_id
          if($(selectMaterialInput).is(':checked')){
            i.selected=true
          }else{
            i.selected=false
          }
        })
      console.log('self.values')
      console.log(self.values)
      }
    } 
    

    self.selectCondition = (item,e) => {
      item.selected=!e.item.t.selected
    } 

    self.calculateAmount = (e) => {
      let poQtyInput= '#poQtyInput'+e.item.m.indent_material_map_id
      let temp_po_qty = $(poQtyInput).val()
      if(isNaN(temp_po_qty)){
        temp_po_qty = 0
      }
      let qt = Number(e.item.m.qty)
      if(self.title=='Add'){
        if(Number(temp_po_qty)>Number(qt)){
          toastr.error('PO qty can not be grater than qty')
          $(poQtyInput).val(0)
          temp_po_qty = 0
        }
      }else if(self.title=='Edit'){
        let max_po_qty=Number(e.item.m.qty) + Number(e.item.m.prev_po_qty)
        if(Number(temp_po_qty)>Number(max_po_qty)){
          toastr.error('PO qty can not be grater than qty')
          $(poQtyInput).val(0)
          temp_po_qty = 0
        }
      }
      let po_qty= Number(temp_po_qty).toFixed(3)
      e.item.m.po_qty= po_qty//PO Qty

      let poUnitValueInput= '#poUnitValueInput'+e.item.m.indent_material_map_id
      let temp_unit_value = $(poUnitValueInput).val()
      if(isNaN(temp_unit_value)){
        temp_unit_value = 0
      }
      let unit_value = Number(temp_unit_value).toFixed(3)
      e.item.m.unit_value = unit_value //Unit Value
      
      let amount = Number(Number(unit_value) * Number(po_qty)).toFixed(2)
      e.item.m.total_value = amount //Amount


      let discountPercentageInput= '#discountPercentageInput'+e.item.m.indent_material_map_id
      let temp_discount_percentage = $(discountPercentageInput).val()
      if(isNaN(temp_discount_percentage)){
        temp_discount_percentage = 0
      }
      let discount_percentage = Number(temp_discount_percentage).toFixed(2)
      e.item.m.discount_percentage = discount_percentage //Discount %
      let discount_amount = Number((amount * discount_percentage)/100).toFixed(2)
      e.item.m.discount_amount = discount_amount //Discount Amt 

      let poPAndFInput= '#poPAndFInput'+e.item.m.indent_material_map_id
      let temp_p_and_f_value = $(poPAndFInput).val()
      if(isNaN(temp_p_and_f_value)){
        temp_p_and_f_value = 0
      }
      let p_and_f = Number(temp_p_and_f_value).toFixed(2)
      e.item.m.p_and_f = p_and_f // P&F Value

      let sub_total = Number(Number(amount)-Number(discount_amount)+Number(p_and_f)).toFixed(2)
      e.item.m.sub_total = sub_total
      console.log(amount)
      console.log(sub_total)
      
      /*duty start*/
      let selectDutyInput= '#selectDutyInput'+e.item.m.indent_material_map_id
      let duty_id = $(selectDutyInput).val()
      if(duty_id==''){
        e.item.m.duty_id = ''
        e.item.m.duty = 0.00
      }else{
        self.duties.map(d => {
          if(d.tax_id==duty_id){
            e.item.m.duty_id = duty_id
            e.item.m.duty = Number((Number(sub_total) * Number(d.tax_rate))/100).toFixed(2)
          }
       })
      }
      e.item.m.amount_after_duty= Number(Number(sub_total)+Number(e.item.m.duty)).toFixed(2)
      /*duty end*/

      /*tax1 start*/
      let selectTaxOneInput= '#selectTaxOneInput'+e.item.m.indent_material_map_id
      let tax_one_id = $(selectTaxOneInput).val()
      if(tax_one_id==''){
        e.item.m.tax_one_id = ''
        e.item.m.tax_one = 0.00
      }else{
        self.taxes.map(d => {
          if(d.tax_id==tax_one_id){
            e.item.m.tax_one_id = tax_one_id
            e.item.m.tax_one = Number((Number(e.item.m.amount_after_duty) * Number(d.tax_rate))/100).toFixed(2)
          }
       })
      }
      /*tax1 end*/

      /*tax2 start*/
      let selectTaxTwoInput= '#selectTaxTwoInput'+e.item.m.indent_material_map_id
      let tax_two_id = $(selectTaxTwoInput).val()
      if(tax_two_id==''){
        e.item.m.tax_two_id = ''
        e.item.m.tax_two = 0.00
      }else{
        self.taxes.map(d => {
          if(d.tax_id==tax_two_id){
            e.item.m.tax_two_id = tax_two_id
            e.item.m.tax_two = Number((Number(e.item.m.amount_after_duty) * Number(d.tax_rate))/100).toFixed(2)
          }
       })
      }
      /*tax2 end*/

      /*cess start*/
      let selectCessInput= '#selectCessInput'+e.item.m.indent_material_map_id
      let cess_id = $(selectCessInput).val()
      if(cess_id==''){
        e.item.m.cess_id = ''
        e.item.m.cess = 0.00
      }else{
        self.cess.map(d => {
          if(d.tax_id==cess_id){
            e.item.m.cess_id = cess_id
            e.item.m.cess = Number((Number(e.item.m.amount_after_duty) * Number(d.tax_rate))/100).toFixed(2)
          }
       })
      }
      /*cess end*/

      /*other charges Start*/
      let otherChargesInput= '#otherChargesInput'+e.item.m.indent_material_map_id
      let temp_other_charges_value = $(otherChargesInput).val()
      if(isNaN(temp_other_charges_value)){
        temp_other_charges_value = 0
      }
      let other_charges = Number(temp_other_charges_value).toFixed(2)
      e.item.m.other_charges = other_charges // P&F Value
      /*other charges End*/

      e.item.m.item_total=Number(Number(e.item.m.amount_after_duty)+Number(e.item.m.tax_one)+Number(e.item.m.tax_two)+Number(e.item.m.cess) + Number(e.item.m.other_charges)).toFixed(2)

      console.log(e)
    }

    self.submitPurchaseOrderStepOne = () => {
      if(self.poDateInput.value==''){
        toastr.error('Please Enter PO Date')
        return;
      }

      let str=self.poDateInput.value;
      var d = str.split("/");
      var po_date = moment([d[2].trim()+d[1].trim()+d[0].trim()],'YYYYMMDD')
      var toDay=moment().format('YYYYMMDD')

      let from = moment(po_date, 'YYYYMMDD'); 
      let to = moment(toDay, 'YYYYMMDD');     
      let differnece=to.diff(from, 'days')  

      if(differnece<0){
        toastr.error("PO date can not be greater than today")
        return
      }

      if(!self.selected_party_id){
        toastr.error('Please Enter party name')
        return;
      }

      var materialArray=[]
      self.values.map(i=>{//colletion of selected material
        if(i.selected){
          materialArray.push(i)
        }
      })

     if (materialArray.length==0) {
      toastr.error('Please select at least one material')
      return
     }

     var count=0
     let error=''
     materialArray.map(i=>{
        count++
        let poDescriptionInput= '#poDescriptionInput'+i.indent_material_map_id
        i.po_description=$(poDescriptionInput).val()

        let temp_po_qty = Number(i.po_qty)
        if(isNaN(temp_po_qty)){
          temp_po_qty = 0
        }

        if(temp_po_qty==0){
          error=error + " Please Enter a valid PO Qty"+count+", ";
        }
     })  
     
     var conditionArray=[]
     self.conditions.map(i=>{ // collection of selected conditions
      if(i.selected){
        conditionArray.push(i)
      }
     })
     if (conditionArray.length==0) {
      toastr.error('Please select at least one condition')
      return
     }
      
    if(error!=''){
        toastr.error(error)
        return
    }else{      
      if(self.title=='Add'){
        if(self.po_without_indent=='N'){
          RiotControl.trigger('add_po', materialArray, conditionArray, self.selected_party_id,self.poRemarks.value,self.quotatoinRefInput.value,self.poDateInput.value,self.selected_stock_type_code)
        }else if(self.po_without_indent=='Y'){
          RiotControl.trigger('add_po_without_indent', materialArray, conditionArray, self.selected_party_id,self.poRemarks.value,self.quotatoinRefInput.value,self.poDateInput.value,self.selectStockTypeFilter.value)
        }
      }else if(self.title=='Edit'){
        if(self.po_without_indent=='N'){
          RiotControl.trigger('edit_po', self.values, conditionArray, self.selected_party_id, self.po_id, self.poRemarks.value,self.quotatoinRefInput.value,self.poDateInput.value,self.selected_stock_type_code)
        }else if(self.po_without_indent=='Y'){
          RiotControl.trigger('edit_po_without_indent', materialArray, conditionArray, self.selected_party_id, self.po_id, self.poRemarks.value,self.quotatoinRefInput.value,self.poDateInput.value)
        }
      }
    }  
  }

     self.refreshPurchaseOrders = () => {
      self.purchaseOrders = []
      self.loading=true
      RiotControl.trigger('read_po',self.selectIndentStatus.value,self.searchPurchaseOrderByStockType.value)
    }

    self.filterPurchaseOrders = () => {
      if(!self.searchPurchaseOrder) return
      self.filteredPurchaseOrders = self.purchaseOrders.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchPurchaseOrder.value.toLowerCase())>=0
      })

      self.paginate(self.filteredPurchaseOrders, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredPurchaseOrders, 1, self.items_per_page)
    }

    
    self.confirmDelete = (e) => {
      self.purchaseOrders.map(c => {
        if(c.po_id != e.item.p.po_id){
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
      RiotControl.trigger('delete_po', e.item.p.po_id, e.item.p.po_without_indent)
    }

    self.viewPurchaseOrder = (p,e) => {
      RiotControl.trigger('view_po', p.po_id)
    }

    self.viewPurchaseOrderWithoutIndent = (p,e) => {
      RiotControl.trigger('view_po_without_indent', p.po_id)
    }

    self.closePurchaseOrderView = () => {
      self.po_view='po_home'
    }

    self.edit = (p,e) => {
      RiotControl.trigger('read_indents_edit', 'F', p.po_id)
      self.party_id=p.party_id
      self.po_id=p.po_id
      self.po_without_indent='N'
      self.fixed_po_stock_type_code=p.stock_type_code
      self.po_no_view=p.po_no
      console.log(p.po_no)
    }

    self.editWithoutIndent = (p,e) => {
      self.po_without_indent='Y'
      self.party_id=p.party_id
      self.po_id=p.po_id
      self.fixed_po_stock_type_code=p.stock_type_code
      self.po_no_view=p.po_no
      RiotControl.trigger('read_edit_po_without_indent', self.po_id)
    }

    self.showPurchaseOrderModal = (p,e) => {
      $("#statusModal").modal('show') 
      self.complete_po_id=p.po_id
    }

    self.completePurchaseOrder = () => {
      RiotControl.trigger('complete_po', self.complete_po_id)
    }

    self.cancelOperation = (e) => {
      self.purchaseOrders.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }
  
  self.getMaterial = () => {
    if(self.searchMaterialInput.value==''){
      if(self.selectItemGroupFilter.value==''){
        toastr.info("Please select Item Group and try again")
        return;
      }
      if(self.selectStockTypeFilter.value==''){
        toastr.info("Please select Stock Type and try again")
        return;
      }
      self.loading=true
      RiotControl.trigger('read_items_for_po',self.selected_item_group_code,self.selectStockTypeFilter.value)
    }else{
      if(self.selectStockTypeFilter.value==''){
        toastr.info("Please select Stock Type and try again")
        return;
      }
      self.loading=true
      RiotControl.trigger('search_items_for_po',self.searchMaterialInput.value,self.selectStockTypeFilter.value)
    }
  }
 
  self.toggles = (e) =>{
    var item = e.item.it
    item.selected =!item.selected
    console.log(self.modelMaterials) 
  }

  self.toggle = (e) =>{
        var item = e.item.it
        item.selected =!item.selected
    }

  self.selectedMaterialForPO = () => {
    console.log('calling this ')
     self.modelMaterials.map(m => {
        if(m.selected){
            self.materials.push(m)
        }
     })

     $("#itemModal").modal('hide') 
     self.update()

     // date element formating
     self.materials.map(m => {
        let deliveryDateForPO= 'deliveryDateForPO'+m.item_id
        dateFormat(deliveryDateForPO)
     })
  }

  self.selectedMaterial = () => {
    console.log('self.selectedMaterial')
     self.update()
     self.values=[]
     let error=''
     self.materials.map(m => {
        if(m.selected){
          self.values.push(m)
          let qtyInputForPO='#qtyInputForPO'+m.item_id
          m.qty=$(qtyInputForPO).val()
          m.po_qty=$(qtyInputForPO).val()
          m.indent_material_map_id=m.item_id//for dynamic data
          m.indent_id=''

          let deliveryDateForPO='#deliveryDateForPO'+m.item_id
          m.delivery_date=$(deliveryDateForPO).val()

          m.checked=true
          if (m.qty=='') {
            error='Please provide qty for material'
            console.log('*'+m.qty+'*')
          }
        }
     })

     if(error!=''){
      toastr.info(error)
      return
     }

     console.log(self.values)

     self.po_no_view=''
     self.po_view='add_po_step_one'
     self.update()
     $('#poDateInput').prop('disabled', false);

     self.selectPartyNameInput.vlaue=''
     self.quotatoinRefInput.vlaue=''
     self.poRemarks.vlaue=''
     self.conditions.map(i=>{
       if(i.condition_id==47 || i.condition_id==71 || i.condition_id==72){
         i.selected=true
         let selectConditionInput= '#selectConditionInput'+i.condition_id
         $(selectConditionInput).prop('checked', true);
       }else{
         i.selected=false
         let selectConditionInput= '#selectConditionInput'+i.condition_id
         $(selectConditionInput).prop('checked', false);
       }
     })
     console.log('self.conditions')
     console.log(self.conditions)

     self.materials.map(m => {
      let selectMaterialInput= '#selectMaterialInput'+m.indent_material_map_id
      $(selectMaterialInput).prop('checked', true); 
     })
     RiotControl.trigger('read_po_no', self.selectStockTypeFilter.value)
  }


  /*chnage start*/
  RiotControl.on('read_indents_for_po_addition_changed', function(indents) {
    self.po_view='add_po'
    self.update()
    self.selectPartyNameInput.vlaue=''
    self.quotatoinRefInput.vlaue=''
    self.poRemarks.vlaue=''
    self.loading = false
    self.indents = indents
    self.update()
  })

  RiotControl.on('purchase_orders_changed', function(po) {
    $("#statusModal").modal('hide') 
    self.loading = false
    self.purchaseOrders=[]
    self.purchaseOrders = po
    self.filteredPurchaseOrders=[]
    self.filteredPurchaseOrders = po

    self.paginate(self.filteredPurchaseOrders, self.items_per_page)
    self.pagedDataItems = self.getPageData(self.filteredPurchaseOrders, 1, self.items_per_page)
    self.update()
  })

  RiotControl.on('purchase_orders_not_deleted', function(po) {
    self.loading = false
    self.purchaseOrders.map(c => {
      c.confirmDelete = false
    })
    self.update()
  })

  RiotControl.on('po_created', function() {

    self.po_view='po_home'
    self.loading = false
    self.update()
  })

  RiotControl.on('po_creation_date_error', function() {
    self.loading = false
    toastr.error('Please Check PO Date newer po date exists for same Stock Type')
    self.update()
  })

  RiotControl.on('read_indents_for_po_changed', function(values,po_no) {
    console.log('read_indents_for_po_changed')
    self.po_view='add_po_step_one'
    self.update()
    $('#poDateInput').prop('disabled', false);
    self.loading = false
    self.selectPartyNameInput.vlaue=''
    self.quotatoinRefInput.vlaue=''
    self.poRemarks.vlaue=''
    self.values=[]
    self.values = values
    self.po_no_view=po_no
    self.conditions.map(i=>{
      if(i.condition_id==47 || i.condition_id==71 || i.condition_id==72){
         i.selected=true
         let selectConditionInput= '#selectConditionInput'+i.condition_id
         $(selectConditionInput).prop('checked', true);
       }else{
         i.selected=false
         let selectConditionInput= '#selectConditionInput'+i.condition_id
         $(selectConditionInput).prop('checked', false);
      }
    })
    console.log(self.conditions)
    self.update()
    self.values.map(i=>{
      let selectDutyInput= '#selectDutyInput'+i.indent_material_map_id
      $(selectDutyInput).on("focus",function() {
          $(selectDutyInput).simulate('mousedown');
      });

      let selectTaxOneInput= '#selectTaxOneInput'+i.indent_material_map_id
      $(selectTaxOneInput).on("focus",function() {
          $(selectTaxOneInput).simulate('mousedown');
      });

      let selectTaxTwoInput= '#selectTaxTwoInput'+i.indent_material_map_id
      $(selectTaxTwoInput).on("focus",function() {
          $(selectTaxTwoInput).simulate('mousedown');
      });

      let selectCessInput= '#selectCessInput'+i.indent_material_map_id
      $(selectCessInput).on("focus",function() {
          $(selectCessInput).simulate('mousedown');
      }); 

    })
    self.update()
  })
  
  RiotControl.on('parties_changed', function(parties) {
    self.loading = false
    self.parties = parties

    $('#selectPartyNameInput').autocomplete({
        source: parties,
        select: function( event, ui ) {
          self.selected_party_id= ui.item.party_id
          console.log(self.selected_party_id)
        }
      });
    //self.update()
  })

  RiotControl.on('taxes_changed', function(taxes) {
    self.loading = false
    self.taxes = []
    self.duties = []
    self.cess = []

    taxes.map(i=>{
      if(i.tax_group=='Duty'){
       self.duties.push(i)
      }else if(i.tax_group=='Tax'){
       self.taxes.push(i)
      }else if(i.tax_group=='Cess'){
       self.cess.push(i)
      }
    })
    self.update()
  })

  RiotControl.on('conditions_changed', function(conditions) {
    self.loading = false
    self.conditions = conditions
    self.update()
  })

  RiotControl.on('purchase_orders_view_changed', function(v) {
    self.loading = false
    self.viewPurchaseOrders = []
    self.viewPurchaseOrders = v.materials

    self.viewPODetails = []
    self.viewPODetails = v.details
    
    self.dutyHeaders = []
    self.dutyHeaders = v.dutyHeaders

    self.taxOneHeaders = []
    self.taxOneHeaders = v.taxOneHeaders

    self.taxTwoHeaders = []
    self.taxTwoHeaders = v.taxTwoHeaders

    self.cessHeaders = []
    self.cessHeaders = v.cessHeaders

    self.viewPOConditions = []
    self.viewPOConditions = v.conditions
    self.po_view='po_view'
    self.update()
  })

  RiotControl.on('purchase_orders_edit_changed', function(v) {
    console.log(self.po_no_view)
    self.loading = false
    self.po_view='add_po_step_one'
    self.values = []
    self.values = v.materials

    self.appliedConditions = v.conditions
    self.details = v.details
    self.update()
    
    self.selectPartyNameInput.value=self.details['party_id']
    self.quotatoinRefInput.value=self.details['quotatoin_ref']
    self.poDateInput.value=self.details['po_date']
    self.poRemarks.value=self.details['remarks']
    $('#poDateInput').prop('disabled', true);

    self.values.map(i=>{        
       let selectDutyInput= '#selectDutyInput'+i.indent_material_map_id
       $(selectDutyInput).val(i.duty_id);

       let selectTaxOneInput= '#selectTaxOneInput'+i.indent_material_map_id
       $(selectTaxOneInput).val(i.tax_one_id);

       let selectTaxTwoInput= '#selectTaxTwoInput'+i.indent_material_map_id
       $(selectTaxTwoInput).val(i.tax_two_id);

       let selectCessInput= '#selectCessInput'+i.indent_material_map_id
       $(selectCessInput).val(i.cess_id);
    })


    /*selected material tick checkbox*/
    self.values.map(i=>{
      let  count=0
      v.selctedMaterials.map(j=>{
        if(i.indent_material_map_id==j.indent_material_map_id){
          let selectMaterialInput= '#selectMaterialInput'+i.indent_material_map_id
          $(selectMaterialInput).prop('checked', true);
          i.selected=true
          count=1
        }
      })
      if(count==0){
        i.selected=false
      }
    })
    
    /*selected condition tick checkbox*/
    self.update()
    self.conditions.map(i=>{
      i.selected=false
      let selectConditionInput= '#selectConditionInput'+i.condition_id
      $(selectConditionInput).prop('checked', false);

      self.appliedConditions.map(j=>{
        if(i.condition_id==j.condition_id){
           $(selectConditionInput).prop('checked', true);
           i.selected=true
        }
      })
    })

    self.parties.map(i=>{
      if(i.party_id==self.party_id){
        self.selectPartyNameInput.value=i.party_name
        self.selected_party_id=i.party_id
      }
    })
    self.update()
  })

  RiotControl.on('purchase_orders_edit_without_indent_error', function() {
    self.loading = false
    toastr.error('Some Docket is there. Please delete Docket first.')
    self.update();
  })

  RiotControl.on('purchase_orders_edit_without_indent_changed', function(v) {
    console.log(self.po_no_view)
    self.loading = false
    self.po_view='add_po_step_one'
    self.title='Edit'   
    self.values = []
    self.values = v.materials


    self.appliedConditions = v.conditions
    self.details = v.details
    self.update()
    
    self.selectPartyNameInput.value=self.details['party_id']
    self.quotatoinRefInput.value=self.details['quotatoin_ref']
    self.poDateInput.value=self.details['po_date']
    self.poRemarks.value=self.details['remarks']
    
    $('#poDateInput').prop('disabled', true);

    self.values.map(i=>{        
       let selectDutyInput= '#selectDutyInput'+i.indent_material_map_id
       $(selectDutyInput).val(i.duty_id);

       let selectTaxOneInput= '#selectTaxOneInput'+i.indent_material_map_id
       $(selectTaxOneInput).val(i.tax_one_id);

       let selectTaxTwoInput= '#selectTaxTwoInput'+i.indent_material_map_id
       $(selectTaxTwoInput).val(i.tax_two_id);

       let selectCessInput= '#selectCessInput'+i.indent_material_map_id
       $(selectCessInput).val(i.cess_id);
    })

    /*selected material tick checkbox*/
    self.values.map(i=>{
      let selectMaterialInput= '#selectMaterialInput'+i.indent_material_map_id
      $(selectMaterialInput).prop('checked', true);
      i.selected=true
    })
    console.log('values')
    console.log(self.values)
     
    /*selected condition tick checkbox*/
    self.update()
    self.conditions.map(i=>{
      i.selected=false
      let selectConditionInput= '#selectConditionInput'+i.condition_id
      $(selectConditionInput).prop('checked', false);
      
      self.appliedConditions.map(j=>{
        if(i.condition_id==j.condition_id){
           $(selectConditionInput).prop('checked', true);
           i.selected=true
        }
      })
    })
    

    self.parties.map(i=>{
      if(i.party_id==self.party_id){
        self.selectPartyNameInput.value=i.party_name
        self.selected_party_id=i.party_id
      }
    })

    self.update()

  })

  self.filterMaterials = () => {
    if(!self.searchMaterials) return
    self.filteredMaterials = self.modelMaterials.filter(c => {
      return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase())>=0
    })

    self.paginate_new(self.filteredMaterials, self.items_per_page_new)
    self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
  }

  RiotControl.on('po_edited', function() {
    self.po_view='po_home'
    
    self.loading = false
    self.update()
  })

  RiotControl.on('indents_edit_changed', function(indents) {
    self.po_view='add_po'
    self.title='Edit'   
    
    self.loading = false
    self.indents = indents.indents
    self.indentIds = indents.indentIds
    self.update()

    self.indents.map(i=>{
      self.indentIds.map(j=>{
        if(i.indent_id==j.indent_id){
           let indentSelectionInput= '#indentSelectionInput'+i.indent_id
           $(indentSelectionInput).prop('checked', true);
           //$(indentSelectionInput).prop("disabled", true);
           i.selected=true
        }
      })
    })

  })

  RiotControl.on('stock_types_changed', function(stock_types) {
    self.stock_types = stock_types
    self.update()
  })

  RiotControl.on('items_for_po_changed', function(items) {
    self.loading = false
    self.loading = false
    self.modelMaterials = []
    let tempMaterials = []
    
    if (self.materials.length==0) {
      self.modelMaterials = items
    }else{
     items.map(sm=>{ //selected materials will be removed from materials
      let count=0
      self.materials.map(i=>{ 
          if(sm.item_id == i.item_id){
            count=1
          }
      })
      if(count==0){
        tempMaterials.push(sm)
      }
    })
    self.modelMaterials = tempMaterials
    }
    self.searchMaterialInput.value=''
      
    self.filteredMaterials=self.modelMaterials
      
    self.paginate_new(self.filteredMaterials, self.items_per_page_new)
    self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
    $("#itemModal").modal('show')  
    self.update()
  })

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

  RiotControl.on('read_po_no_changed', function(po_no) {
    console.log('heree')
     self.po_no_view=po_no
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
      self.pagedDataItems = self.getPageData(self.filteredPurchaseOrders, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredPurchaseOrders, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredPurchaseOrders, 1, self.items_per_page)
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
</po>