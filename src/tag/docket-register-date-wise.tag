<docket-register-date-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Docket Register (Date Wise)</h4>

<div show={docket_register_date_wise =='docket_register_date_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="docketRegisterDateWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="docketRegisterDateWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-3">
      <div class="form-group">
        <label for="docketRegisterDateWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="docketRegisterDateWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div> 
    <div class="col-sm-3">  
        <div class="form-group">
          <label for="selectStockTypeFilter">Stock Type</label>
          <table class="table table-bordered">
		    <tr each={m, i in stock_types}>
		        <td style="width:50px"><input type="checkbox" checked={m.selected} id="{'selectStockTypeFilter' + m.stock_type_code}" onclick={selectStockType.bind(this,m)} class="form-control" style="margin-top: 5px;"></td>
		        <td>{m.stock_type}</td>
		    </tr>
	     </table>
        </div>
      </div>
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readDocket} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-1">
      <div class="form-group">
         <!-- <a href="csv/docket_register_date_wise_csv.php?start_date={sd}&end_date={ed}&stock_type_code={stock_type}" target='_blank' class="btn btn-default text-right"><img src="img/excel.png" style="height:30px;margin-top: 23px;"></a> -->
         <img src="img/excel.png" alt="OLD" style="height:30px;margin-top: 33px;" onclick={excelExport}>
         <img src="img/excel.png" alt="NEW" style="height:30px;margin-top: 33px;" onclick={excelExportNew}>
      </div>   
    </div>
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={docket_register_date_wise =='docket_register_date_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
    <!-- Phone: (033) 3019-0506/0509<br>
    Fax: (033) 3019-0520<br>
    Email: purchase@ntcind.com<br>
    Email: stores_ntc@rdbindia.com<br> -->
      
  <div>Docket Register (Date Wise)<br> From {docketFrom} To {docketTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
    <h5>Docket Date: <b>{m.date}</b></h5>
    <div each={d, j in m.dockets}>
        <table class="table print-small">
           <tr>
             <td>Docket No: <b>{d.docketDetails.stock_type_code}-{d.docketDetails.docket_no}</b></td>
             <td>Docket Date: <b>{d.docketDetails.docket_date}</b></td>
             <td>Party: <b>{d.docketDetails.party_name}</b></td>
           </tr>
           <tr>
             <td>Bill No: <b>{d.docketDetails.bill_no}</b></td>
             <td>Bill Date: <b>{d.docketDetails.bill_date}</b></td>
             <td>GST No: <b>{d.docketDetails.gst}</b></td>
           </tr>
           <tr>
             <td>Challan No: <b>{d.docketDetails.challan_no}</b></td>
             <td>Challan Date: <b>{d.docketDetails.challan_date}</b></td>
             <td>LR No: <b>{d.docketDetails.lr_no}</b></td>
           </tr>
           <tr>
             <td colspan="3">Vehicle No: <b>{d.docketDetails.vehicle_no}</b></td>
           </tr>
         </table>
    
         <table class="table table-bordered bill-info-table print-small">
          <tr>
           <th>Sl</th>
           <th>Item Name</th>
           <th>Location</th>
           <th>Unit</th>
           <th>Qty</th>
           <th>Rate</th>
           <th>Amount</th>
           <th>Item Value</th>
          </tr> 
          <tr each={t, k in d.transactions} no-reorder>
           <td>{k+1}</td>
           <td>{t.item_name}</td>
           <td>{t.location}</td>
           <td>{t.uom_code}</td>
           <td style="text-align:right">{t.qty}</td>
           <td style="text-align:right">{t.rate}</td>
           <td style="text-align:right">{t.amount}</td>
           <td style="text-align:right">{t.total}</td>
          </tr>
          <tr>
            <td colspan=7 style="text-align:right">Sub Total</td>
            <td class="text-xs-right">{d.docketDetails.sub_total_amount}</td>
          </tr>
          <tr hide={d.docketDetails.freight_charge==0.00}>
            <td colspan=7 style="text-align:right">Insurance Charges</td>
            <td class="text-xs-right">{d.docketDetails.freight_charge}</td>
          </tr>
          <tr hide={d.docketDetails.p_and_f_charge==0.00}>
            <td colspan=7 style="text-align:right">P & F Charges</td>
            <td class="text-xs-right">{d.docketDetails.p_and_f_charge}</td>
          </tr>
          <tr hide={d.docketDetails.delivery_charge==0.00}>
            <td colspan=7 style="text-align:right">Delivery Charges</td>
            <td class="text-xs-right">{d.docketDetails.delivery_charge}</td>
          </tr>
          <tr hide={d.docketDetails.loading_charge==0.00}>
            <td colspan=7 style="text-align:right">Loading Charges</td>
            <td class="text-xs-right">{d.docketDetails.loading_charge}</td>
          </tr>
          <tr hide={d.docketDetails.packing_charge==0.00}>
            <td colspan=7 style="text-align:right">Packing Charges</td>
            <td class="text-xs-right">{d.docketDetails.packing_charge}</td>
          </tr>
          <tr hide={d.docketDetails.courier_charge==0.00}>
            <td colspan=7 style="text-align:right">Courier Charges</td>
            <td class="text-xs-right">{d.docketDetails.courier_charge}</td>
          </tr>
          <tr hide={d.docketDetails.round_off_amount==0.00}>
            <td colspan=7 style="text-align:right">Round off</td>
            <td class="text-xs-right">{d.docketDetails.round_off_amount}</td>
          </tr>
          <tr>
            <td colspan=7 style="text-align:right">Bill Amount</td>
            <td class="text-xs-right">{d.docketDetails.bill_amount}</td>
          </tr>
        </table>
    </div>
  </div> <!-- report main loop -->

  <table class="table table-bordered bill-info-table print-small">
    <tr>
      <td colspan=5 style="text-align:right">Grand Total Qty</td>
      <td class="text-xs-right">{qty_grand_total}</td>
      <td style="text-align:right">Grand Total Item Value</td>
      <td class="text-xs-right">{item_value_grand_total}</td>
    </tr>
  </table>  

 </div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      dateFormat('docketRegisterDateWiseStartDateInput')
      dateFormat('docketRegisterDateWiseEndDateInput')
      self.docket_register_date_wise='docket_register_date_wise_home'
      RiotControl.trigger('read_stock_types')
      self.update()
    })

    self.excelExport = () => {
      if (self.docketRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.docketRegisterDateWiseEndDateInput.value=='') {
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

     var link="csv/docket_register_date_wise_csv.php?start_date="+self.docketRegisterDateWiseStartDateInput.value+"&end_date="+self.docketRegisterDateWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString;
     console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

    self.excelExportNew = () => {
      if (self.docketRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.docketRegisterDateWiseEndDateInput.value=='') {
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

     var link="csv/docket_register_date_wise_csv_new.php?start_date="+self.docketRegisterDateWiseStartDateInput.value+"&end_date="+self.docketRegisterDateWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString;
     console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

    self.setStartDate = () => {
      self.sd=self.docketRegisterDateWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.docketRegisterDateWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.docket_register_date_wise='docket_register_date_wise_home'
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

    self.readDocket = () => {
      if (self.docketRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.docketRegisterDateWiseEndDateInput.value=='') {
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

      if (selectedStockTypeString=='') {
        toastr.info("Please Select Stock Type")
        return
      }
      
      self.loading=true
      RiotControl.trigger('read_docket_register_date_wise',self.docketRegisterDateWiseStartDateInput.value,self.docketRegisterDateWiseEndDateInput.value,selectedStockTypeString)
    }

    
    RiotControl.on('read_docket_register_date_wise_changed', function(mainArray,qty_grand_total,item_value_grand_total) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.qty_grand_total=qty_grand_total
      self.item_value_grand_total=item_value_grand_total
      self.docket_register_date_wise='docket_register_date_wise_report'
      self.docketFrom=self.docketRegisterDateWiseStartDateInput.value
      self.docketTo=self.docketRegisterDateWiseEndDateInput.value
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })
    

</script>    
</docket-register-date-wise>
