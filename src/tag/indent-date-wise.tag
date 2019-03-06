<indent-date-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Indent Date Wise</h4>

<div show={indent_date_wise =='indent_date_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="indentRegisterDateWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="indentRegisterDateWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-3">
      <div class="form-group">
        <label for="indentRegisterDateWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="indentRegisterDateWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div>
    <div class="col-md-3">
      <div class="form-group">
          <label for="selectIndentStatus">Status</label>
          <select name="selectIndentStatus" class="form-control">
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
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readIndent} id="gobtn">Go</button>
      </div>   
    </div>
    <!-- <div class="col-md-1">
      <div class="form-group">
         <a href="csv/indent_date_wise_csv.php?start_date={sd}&end_date={ed}&stock_type_code={stock_type}" target='_blank' class="btn btn-default text-right"><img src="img/excel.png" style="height:30px;margin-top: 23px;"></a>
      </div>   
    </div> -->
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={indent_date_wise =='indent_date_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>Indent (Date Wise)<br> From {indentFrom} To {indentTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
    <h5>Indent Date: <b>{m.date}</b></h5>
    <div each={d, j in m.indents}>
        <table class="table print-small">
           <tr>
             <td>Indent No: <b>{d.indentDetails.stock_type_code}-{d.indentDetails.indent_no}</b></td>
             <td>Indent Date: <b>{d.indentDetails.indent_date}</b></td>
             <td>Indent Type: <b>{d.indentDetails.indent_type}</b></td>
           </tr>
           <tr>
             <td>Department: <b>{d.indentDetails.department}</b></td>
             <td>Prepared By: <b>{d.indentDetails.requested_by}</b></td>
             <td>Status: <b>{d.indentDetails.status}</b></td>
           </tr>
         </table>
    
         <table class="table table-bordered bill-info-table print-small">
          <tr>
            <th class="serial-col"><strong>Sl</strong></th>
            <th>Material</th>
            <th>UOM</th>
            <th>Qty</th>
            <th>Unit Value</th>
            <th>Total Value</th>
            <th>Delivery Date</th>
            <th>Stock</th>
            <th>LP Price</th>
            <th>LP Qty</th>
            <th>LP Docket</th>
            <th>LP Party</th>
            <th>Remarks</th>
          </tr> 
          <tr each={t, k in d.transactions} no-reorder>
            <td>{i+1}</td>
            <td>{t.item_name}-(Code No:{t.item_id})</td>
            <td>{t.uom_code}</td>
            <td style="text-align:right">{t.qty}</td>
            <td style="text-align:right">{t.unit_value}</td>
            <td style="text-align:right">{t.total_value}</td>
            <td>{t.delivery_date}</td>
            <td style="text-align:right">{t.stock}</td>
            <td style="text-align:right">{t.lp_price}</td>
            <td style="text-align:right">{t.lp_qty}</td>
            <td>{t.stock_type_code}-{t.docket_no}</td>
            <td>{t.party_name}</td>
            <td>{t.remarks}</td>
          </tr>
        </table>
    </div>
  </div> <!-- report main loop -->
   <table class="table table-bordered bill-info-table print-small">
    <tr>
      <td style="text-align:right">Grand Total Qty</td>
      <td style="text-align:right">{qty_grand_total}</td>
      <td style="text-align:right">Grand Total Value</td>
      <td style="text-align:right">{item_value_grand_total}</td>
    </tr>
   </table>

 </div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      dateFormat('indentRegisterDateWiseStartDateInput')
      dateFormat('indentRegisterDateWiseEndDateInput')
      self.indent_date_wise='indent_date_wise_home'
      self.update()
    })

    self.setStartDate = () => {
      self.sd=self.indentRegisterDateWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.indentRegisterDateWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.indent_date_wise='indent_date_wise_home'
    }

    self.readIndent = () => {
      if (self.indentRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.indentRegisterDateWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }
      if(!self.selectIndentStatus.value){
        toastr.info("Please select Indent Status and try again")
        return
      }
      
      self.loading=true
      RiotControl.trigger('read_indent_date_wise',self.indentRegisterDateWiseStartDateInput.value,self.indentRegisterDateWiseEndDateInput.value,self.selectIndentStatus.value)
    }

    
    RiotControl.on('read_indent_date_wise_changed', function(mainArray,qty_grand_total,item_value_grand_total) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.qty_grand_total=qty_grand_total
      self.item_value_grand_total=item_value_grand_total
      self.indent_date_wise='indent_date_wise_report'
      self.indentFrom=self.indentRegisterDateWiseStartDateInput.value
      self.indentTo=self.indentRegisterDateWiseEndDateInput.value
      self.update()
    })
    

</script>    
</indent-date-wise>
