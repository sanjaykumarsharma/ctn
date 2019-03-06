<po-item-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">PO (Item Wise)</h4>

<div show={po_item_wise =='po_item_wise_home'} class="no-print">
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
    <div class="col-sm-3">  
        <div class="form-group">
          <label for="selectIndentStatus">Status</label>
          <select name="selectIndentStatus" class="form-control">
            <option value=""></option>
            <option value="P">Pending</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readReturn} id="gobtn">Go</button>
      </div>   
    </div>
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={po_item_wise =='po_item_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>PO (Item Wise)<br> From {issueFrom} To {issueTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
  <h5>Item: <b>{m.item}</b></h5>
   <table class="table table-bordered bill-info-table print-small">
    <tr>
      <th>Sl</th>
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
    <tr each={t, k in m.issues} no-reorder>
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
  </table>
</div> <!-- report main loop -->

 </div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      dateFormat('issueRegisterItemWiseStartDateInput')
      dateFormat('issueRegisterItemWiseEndDateInput')
      self.po_item_wise='po_item_wise_home'
      self.update()
    })

    self.setStartDate = () => {
      self.sd=self.issueRegisterItemWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.issueRegisterItemWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.po_item_wise='po_item_wise_home'
    }

    self.readReturn = () => {
      if (self.issueRegisterItemWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.issueRegisterItemWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }
    
      self.loading=true
      RiotControl.trigger('read_po_item_wise',self.issueRegisterItemWiseStartDateInput.value,self.issueRegisterItemWiseEndDateInput.value,self.selectIndentStatus.value)
    }

    
    RiotControl.on('read_po_item_wise_changed', function(mainArray) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.po_item_wise='po_item_wise_report'
      self.issueFrom=self.issueRegisterItemWiseStartDateInput.value
      self.issueTo=self.issueRegisterItemWiseEndDateInput.value
      self.update()
    })
    

</script>    
</po-item-wise>
