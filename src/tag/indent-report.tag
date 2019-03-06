<indent-report>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Indent Report</h4>

<div show={indent_report =='indent_report_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="indentRegisterReportStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="indentRegisterReportStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-3">
      <div class="form-group">
        <label for="indentRegisterReportEndDateInput">End Date</label>
        <input type="text" class="form-control" id="indentRegisterReportEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div>
    <div class="col-md-3">
      <div class="form-group">
          <label for="selectIndentStatus">Status</label>
          <select name="selectIndentStatus" class="form-control" onchange={setStatus}>
            <option value=""></option>
            <option value="P">Pending</option>
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
    <div class="col-md-1">
      <div class="form-group">
         <a href="csv/indent_report_csv.php?start_date={sd}&end_date={ed}&status={status}" target='_blank' class="btn btn-default text-right"><img src="img/excel.png" style="height:30px;margin-top: 23px;"></a>
      </div>   
    </div>
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={indent_report =='indent_report_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>Indent<br> From {indentFrom} To {indentTo}</div> <br>
</center>

<!-- <div each={m, i in mainArray} class="reportDiv" no-reorder>
    <h5>Indent Date: <b>{m.date}</b></h5>
    <div each={d, j in m.indents}> -->
        <!-- <table class="table print-small">
           <tr>
             <td>: <b>{d.indentDetails.}-{d.indentDetails.}</b></td>
             <td>: <b>{d.indentDetails.}</b></td>
             <td>: <b>{d.indentDetails.}</b></td>
           </tr>
           <tr>
             <td>Department: <b>{d.indentDetails.department}</b></td>
             <td>Prepared By: <b>{d.indentDetails.requested_by}</b></td>
             <td>Status: <b>{d.indentDetails.status}</b></td>
           </tr>
         </table> -->
    
         <table class="table table-bordered bill-info-table print-small">
          <tr>
            <th class="serial-col"><strong>Sl</strong></th>
            <th>Indent Date</th>
            <th>Indent Type</th>
            <th>Indent No</th>
            <th>Department</th>
            <th>Material Code</th>
            <th>Material</th>
            <th>UOM</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Remarks</th>
            <th>Stock</th>
          </tr> 
          <tr each={t, k in mainArray} no-reorder>
            <td>{k+1}</td>
            <td>{t.indent_date}</td>
            <td>{t.indent_type}</td>
            <td>{t.stock_type_code}-{t.indent_no}</td>
            <td>{t.department}</td>
            <td>{t.item_id}</td>
            <td>{t.item_name}</td>
            <td>{t.uom_code}</td>
            <td style="text-align:right">{t.qty}</td>
            <td style="text-align:right">{t.unit_value}</td>
            <td style="text-align:right">{t.total_value}</td>
            <td>{t.remarks}</td>
            <td>{t.stock}</td>
          </tr>
           <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style="text-align:right">Grand Total Qty</td>
            <td style="text-align:right">{qty_grand_total}</td>
            <td style="text-align:right">Grand Total Amount</td>
            <td style="text-align:right">{item_value_grand_total}</td>
            <td>{t.remarks}</td>
            <td>{t.stock}</td>
          </tr>
        </table>
    <!-- </div>
      </div>  -->

 </div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      dateFormat('indentRegisterReportStartDateInput')
      dateFormat('indentRegisterReportEndDateInput')
      self.indent_report='indent_report_home'
      self.update()
    })

    self.setStartDate = () => {
      self.sd=self.indentRegisterReportStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.indentRegisterReportEndDateInput.value
    }

    self.setStatus = () => {
      self.status=self.selectIndentStatus.value
    }

    self.closeReport = () => {
      self.indent_report='indent_report_home'
    }

    self.readIndent = () => {
      if (self.indentRegisterReportStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.indentRegisterReportEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }
      if(!self.selectIndentStatus.value){
        toastr.info("Please select Indent Status and try again")
        return
      }
      
      self.loading=true
      RiotControl.trigger('read_indent_report',self.indentRegisterReportStartDateInput.value,self.indentRegisterReportEndDateInput.value,self.selectIndentStatus.value)
    }

    
    RiotControl.on('read_indent_report_changed', function(mainArray,qty_grand_total,item_value_grand_total) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.qty_grand_total=qty_grand_total
      self.item_value_grand_total=item_value_grand_total
      self.indent_report='indent_report_report'
      self.indentFrom=self.indentRegisterReportStartDateInput.value
      self.indentTo=self.indentRegisterReportEndDateInput.value
      self.update()
    })
    

</script>    
</indent-report>
