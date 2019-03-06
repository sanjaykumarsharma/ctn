<return-to-stock-date-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Return to Stock  (Date Wise)</h4>

<div show={return_to_stock_date_wise =='return_to_stock_date_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="issueRegisterDateWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="issueRegisterDateWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-3">
      <div class="form-group">
        <label for="issueRegisterDateWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="issueRegisterDateWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
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
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readReturn} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-1">
      <div class="form-group">
         <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick={excelExport}>
      </div>   
    </div>
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={return_to_stock_date_wise =='return_to_stock_date_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>Return to Stock  (Date Wise)<br> From {issueFrom} To {issueTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
    <h5>Return Date: <b>{m.date}</b></h5>
    <div each={d, j in m.issues}>
        <table class="table print-small">
           <tr>
             <td>Return No: <b>{d.returnDetails.stock_type_code}-{d.returnDetails.return_to_stock_no}</b></td>
             <td>Return Date: <b>{d.returnDetails.return_date}</b></td>
             <td>Return By: <b>{d.returnDetails.return_by}</b></td>
           </tr>
         </table>
    
         <table class="table table-bordered bill-info-table print-small">
          <tr>
           <th>Sl</th>
           <th>Item Name</th>
           <th>Location</th>
           <th>Unit</th>
           <th>Qty</th>
          </tr> 
          <tr each={t, k in d.transactions} no-reorder>
           <td>{k+1}</td>
           <td>{t.item_name}(Code:{t.item_id})</td>
           <td>{t.location}</td>
           <td>{t.uom_code}</td>
           <td style="text-align:right">{t.return_to_stock_qty}</td>
          </tr>
        </table>
    </div>
  </div> <!-- report main loop -->

 </div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      dateFormat('issueRegisterDateWiseStartDateInput')
      dateFormat('issueRegisterDateWiseEndDateInput')
      self.return_to_stock_date_wise='return_to_stock_date_wise_home'
      RiotControl.trigger('read_stock_types')
      self.update()
    })

    self.excelExport = () => {
      if (self.issueRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.issueRegisterDateWiseEndDateInput.value=='') {
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


     var link="csv/return_to_stock_date_wise_csv.php?start_date="+self.issueRegisterDateWiseStartDateInput.value+"&end_date="+self.issueRegisterDateWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString;
      console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

    self.setStartDate = () => {
      self.sd=self.issueRegisterDateWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.issueRegisterDateWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.return_to_stock_date_wise='return_to_stock_date_wise_home'
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

    self.readReturn = () => {
      if (self.issueRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.issueRegisterDateWiseEndDateInput.value=='') {
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
      RiotControl.trigger('read_return_to_stock_date_wise',self.issueRegisterDateWiseStartDateInput.value,self.issueRegisterDateWiseEndDateInput.value,selectedStockTypeString)
    }

    
    RiotControl.on('read_return_to_stock_date_wise_changed', function(mainArray) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.return_to_stock_date_wise='return_to_stock_date_wise_report'
      self.issueFrom=self.issueRegisterDateWiseStartDateInput.value
      self.issueTo=self.issueRegisterDateWiseEndDateInput.value
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })
    

</script>    
</return-to-stock-date-wise>
