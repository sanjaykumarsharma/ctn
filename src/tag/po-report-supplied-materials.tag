<po-report-supplied-materials>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">PO Report Supplied Materials</h4>

<div show={po_date_wise =='po_report_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-4">
      <div class="form-group">
        <label for="poRegisterDateWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="poRegisterDateWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-4">
      <div class="form-group">
        <label for="poRegisterDateWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="poRegisterDateWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div>
    <!-- <div class="col-md-3">
       <div class="form-group">
           <label for="selectPOStatus">Status</label>
           <select name="selectPOStatus" class="form-control">
             <option value=""></option>
             <option value="P">Pending</option>
             <option value="A">Approved</option>
             <option value="R">Rejected</option>
             <option value="F">Finalized</option>
             <option value="all">All</option>
           </select>
       </div>
     </div> --> 
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readPO} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-1">
      <div class="form-group">
         <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick={excelExport}>
      </div>   
    </div>
  </div>
  <div class="row">
    <div class="col-sm-4">  
      <div class="form-group">
        <table class="table table-bordered">
          <th></th>  
          <th>Stock Type</th>  
          <tr each={m, i in stock_types}>
              <td style="width:50px"><input type="checkbox" checked={m.selected} id="{i}" class="form-control" onclick={selectStockType.bind(this,m)}></td>
              <td>{m.stock_type}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="col-md-4">
      <div class="form-group">
         <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th><input type="search" name="searchParty" class="form-control" placeholder="Search Party" onkeyup={filterParties}></th>
          </tr>
          <tr each={cat, i in pagedDataItems}>
            <td><input type="checkbox" class="form-control" id="{i}" checked={cat.selected} onclick={selectParty.bind(this, cat)}></td>
            <td>{cat.party_name}</td>
          </tr>
          <tfoot>
            <tr>
              <td colspan="9">
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
    <!-- selected party -->
    <div class="col-md-4">
      <div class="form-group">
        <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th>Party</th>
            <th></th>
          </tr>
          <tr each={cat, i in checkedParties}>
            <td>{i+1}</td>
            <td>{cat.party_name}</td>
            <td>
              <button class="btn btn-secondary" disabled={loading} onclick={removeParty.bind(this, cat)}><i class="material-icons">remove</i></button>
            </td>
          </tr>
        </table>
      </div>
    </div>
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
    
 <table class="table table-bordered bill-info-table print-small">
  <tr>
     <th>Sl</th>
     <th>PO No</th>
     <th>PO Date</th>
     <th>Party Name</th>
     <th>Item</th>
     <th>Location</th>
     <th>Unit</th>
     <th>PO Qty</th>
     <th>Rate</th>
     <th>PO Amount</th>
     <th>Docket No</th>
     <th>Docket Dt</th>
     <th>Bill No</th>
     <th>Bill Date</th>
     <th>Qty</th>
     <th>Amount</th>
     <th>Item Value</th>
  </tr> 
  <tr each={t, k in transactions} no-reorder>
    <td>{k+1}</td>
     <td>{t.po_number}</td>
     <td>{t.po_date}</td>
     <td>{t.party_name}</td>
     <td>{t.item_name}-(Code:{t.item_id})</td>
     <td>{t.location}</td>
     <td>{t.uom_code}</td>
     <td style="text-align:right">{t.po_qty}</td>
     <td style="text-align:right">{t.rate}</td>
     <td style="text-align:right">{t.po_amount}</td>
     <td>{t.stock_type_code}-{t.docket_no}</td>
     <td>{t.docket_date}</td>
     <td>{t.bill_no}</td>
     <td>{t.bill_date}</td>
     <td style="text-align:right">{t.qty}</td>
     <td style="text-align:right">{t.amount}</td>
     <td style="text-align:right">{t.total}</td>
  </tr>
</table>

</div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      dateFormat('poRegisterDateWiseStartDateInput')
      dateFormat('poRegisterDateWiseEndDateInput')
      self.po_date_wise='po_report_home'
      RiotControl.trigger('read_parties')
      RiotControl.trigger('read_stock_types')
      self.update()
    })

    self.filterParties = () => {
      if(!self.searchParty) return
      self.filteredParties = self.parties.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase())>=0
      })

      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
    }

   self.selectParty = (t,e) => {
    self.checkedParties.push(t)
    
    self.parties = self.parties.filter(c => {
      return c.party_id!=t.party_id
    })
    self.pagedDataItems = self.pagedDataItems.filter(c => {
      return c.party_id!=t.party_id
    })

   }

   self.removeParty = (t,e) => {
     self.checkedParties = self.checkedParties.filter(c => {
      return c.party_id!=t.party_id
    })
     console.log(self.checkedParties)
    
    self.parties.push(t)
    self.pagedDataItems.push(t)
   }

   self.selectStockType = (item,e) => {
      item.selected=!e.item.m.selected
    }

    self.excelExport = () => {
      if (self.poRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.poRegisterDateWiseEndDateInput.value=='') {
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

      var selected_party_id=''
    
      self.checkedParties.map(t => {
          if(selected_party_id==''){
            selected_party_id=t.party_id
          }else if(selected_party_id!=''){
            selected_party_id=selected_party_id+','+t.party_id
          }
       })

     var link="csv/po_report_supplied_materials_csv.php?start_date="+self.poRegisterDateWiseStartDateInput.value+"&end_date="+self.poRegisterDateWiseEndDateInput.value+"&party_id="+selected_party_id+"&stock_type="+selectedStockTypeString;
      console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

    self.setStartDate = () => {
      self.sd=self.poRegisterDateWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.poRegisterDateWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.po_date_wise='po_report_home'
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

      var selected_party_id=''
    
      self.checkedParties.map(t => {
          if(selected_party_id==''){
            selected_party_id=t.party_id
          }else if(selected_party_id!=''){
            selected_party_id=selected_party_id+','+t.party_id
          }
       })
      
      self.loading=true
      RiotControl.trigger('read_po_report_supplied_materials',self.poRegisterDateWiseStartDateInput.value,self.poRegisterDateWiseEndDateInput.value,selected_party_id,selectedStockTypeString)
    }

    
    RiotControl.on('read_po_report_supplied_materials_changed', function(data) {
      console.log(data);
      self.loading=false
      self.transactions=[]
      self.transactions=data
      self.po_date_wise='po_date_wise_report'
      self.poFrom=self.poRegisterDateWiseStartDateInput.value
      self.poTo=self.poRegisterDateWiseEndDateInput.value

      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

     RiotControl.on('parties_changed', function(parties, party) {
      self.loading = false
      self.checkedParties= []
      self.parties = party
      self.filteredParties = party

      self.items_per_page = 10
      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
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
      self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/
    

</script>    
</po-report-supplied-materials>
