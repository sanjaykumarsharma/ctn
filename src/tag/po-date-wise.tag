<po-date-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">PO Date Wise</h4>

<div show={po_date_wise =='po_date_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="poRegisterDateWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="poRegisterDateWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-3">
      <div class="form-group">
        <label for="poRegisterDateWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="poRegisterDateWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div>
    <div class="col-md-3">
      <div class="form-group">
          <label for="selectPOStatus">Status</label>
          <select name="selectPOStatus" class="form-control">
            <option value=""></option>
            <option value="P">Pending</option>
            <!-- <option value="A">Approved</option>
            <option value="R">Rejected</option>
            <option value="F">Finalized</option> -->
            <option value="all">All</option>
          </select>
      </div>
    </div> 
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readPO} id="gobtn">Go</button>
      </div>   
    </div>
    <!-- <div class="col-md-1">
      <div class="form-group">
         <a href="csv/po_date_wise_csv.php?start_date={sd}&end_date={ed}&stock_type_code={stock_type}" target='_blank' class="btn btn-default text-right"><img src="img/excel.png" style="height:30px;margin-top: 23px;"></a>
      </div>   
    </div> -->
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={po_date_wise =='po_date_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>PO (Date Wise)<br> From {poFrom} To {poTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
    <h5>PO Date: <b>{m.date}</b></h5>
    <div each={d, j in m.pos}>
        <table class="table print-small">
           <tr>
             <td>PO No: <b>{d.poDetails.stock_type_code}-{d.poDetails.po_no}</b></td>
             <td>PO Date: <b>{d.poDetails.po_date}</b></td>
             <td>Quotatoin Ref: <b>{d.poDetails.quotatoin_ref}</b></td>
           </tr>
           <tr>
             <td>Indent No: <b>{d.poDetails.indent_ids}</b></td>
             <td colspan="2">Party: <b>{d.poDetails.party_name}</b></td>
           </tr>
         </table>
    
         <table class="table table-bordered bill-info-table print-small">
          <tr>
            <th class="serial-col"><strong>Sl</strong></th>
            <th style="width: 250px;"><strong>Description of Goods</strong></th>
            <th><strong>Quantity</strong></th>
            <th><strong>Unit</strong></th>
            <th><strong>Unit Price</strong></th>
            <th><strong>Total</strong></th>
            <th><strong>Discount</strong></th>
            <th show={d.poDetails.p_and_f_charges}><strong>P&F</strong></th>
            <th each={dutyhead, a in d.dutyHeaders}>
               <strong>{dutyhead.tax_name}</strong>
            </th>
            <th each={taxhead, b in d.taxOneHeaders}>
               <strong>{taxhead.tax_name}</strong>
            </th>
            <th each={taxhead, c in d.taxTwoHeaders}>
               <strong>{taxhead.tax_name}</strong>
            </th>
            <th each={cesshead, d in d.cessHeaders}>
               <strong>{cesshead.tax_name}</strong>
            </th>
            <th show={d.poDetails.d.other_charges}><strong>Other Charges</strong></th>
            <th><strong>Amount</strong></th>
          </tr> 
          <tr each={t, k in d.transactions} no-reorder>
            <td>{i+1}</td>
            <td style="width: 250px;">{t.item_name},{t.description}-(Code No:{t.item_id})</td>
            <td class="text-sm-right">{t.po_qty}</td>
            <td class="text-sm-right">{t.uom_code}</td>
            <td class="text-sm-right">{t.unit_value}</td>
            <td class="text-sm-right">{t.amount}</td>
            <td class="text-sm-right">{t.discount_amount} ({t.discount_percentage}%)</td>
            <td class="text-sm-right" show={d.poDetails.p_and_f_charges}>{t.p_and_f_charges}</td>
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
            <td class="text-sm-right" show={d.poDetails.other_charges}>{t.other_charges}</td>
            <td class="text-sm-right">{t.item_total}</td>
          </tr>
          <tr>
          <td colspan={d.poDetails.colspan} align="right">Total</td>
          <td class="text-sm-right">{d.poDetails.total}</td>
        </tr>
        </table>
    </div>
  </div> <!-- report main loop -->

 </div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      dateFormat('poRegisterDateWiseStartDateInput')
      dateFormat('poRegisterDateWiseEndDateInput')
      self.po_date_wise='po_date_wise_home'
      self.update()
    })

    self.setStartDate = () => {
      self.sd=self.poRegisterDateWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.poRegisterDateWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.po_date_wise='po_date_wise_home'
    }

    self.readPO = () => {
      if (self.poRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.poRegisterDateWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }
      if(!self.selectPOStatus.value){
        toastr.info("Please select PO Status and try again")
        return
      }
      
      self.loading=true
      RiotControl.trigger('read_po_date_wise',self.poRegisterDateWiseStartDateInput.value,self.poRegisterDateWiseEndDateInput.value,self.selectPOStatus.value)
    }

    
    RiotControl.on('read_po_date_wise_changed', function(mainArray) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.po_date_wise='po_date_wise_report'
      self.poFrom=self.poRegisterDateWiseStartDateInput.value
      self.poTo=self.poRegisterDateWiseEndDateInput.value

      /*self.viewPurchaseOrders = []
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
      self.viewPOConditions = v.conditions*/
      self.update()
    })
    

</script>    
</po-date-wise>
