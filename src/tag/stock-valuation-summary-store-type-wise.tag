<stock-valuation-summary-store-type-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Stock Valuation Summary (Store Type Wise)</h4>

<div show={stock_valution_summry_store_type_wise =='stock_valution_summry_store_type_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
   <!--  <div class="col-md-4">
      <div class="form-group">
        <label for="stockValuationSummryStoreTypeWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="stockValuationSummryStoreTypeWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>   -->
    <div class="col-md-4">
      <div class="form-group">
        <label for="stockValuationSummryStoreTypeWiseEndDateInput">As On Date</label>
        <input type="text" class="form-control" id="stockValuationSummryStoreTypeWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div> 
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readStockValuationSummaryStoreTypeWise} id="gobtn">Go</button>
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
            <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup={filterItems}></th>
          </tr>
          <tr each={cat, i in pagedDataItems}>
            <td><input type="checkbox" class="form-control" id="{i}" checked={cat.selected} onclick={selectItem.bind(this, cat)}></td>
            <td>{cat.item_name}-(Code:{cat.item_id})</td>
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
            <th>Selected Item</th>
            <th></th>
          </tr>
          <tr each={cat, i in checkedItems}>
            <td>{i+1}</td>
            <td>{cat.item_name}-(Code:{cat.item_id})</td>
            <td>
              <button class="btn btn-secondary" disabled={loading} onclick={removeItem.bind(this, cat)}><i class="material-icons">remove</i></button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={stock_valution_summry_store_type_wise =='stock_valution_summry_store_type_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>Stock Valuation Summary (Store Type Wise) <br> As On {docketTo}</div> <br>
</center>

 <table class="table table-bordered bill-info-table print-small">
  <tr>
   <th>Sl</th>
   <th>Item</th>
   <th>Stock Type</th>
   <th>Unit</th>
   <th>Opening Qty</th>
   <th>Receive Qty</th>
   <th>Issue Qty</th>
   <th>Reject to Party Qty</th>
   <th>Return to Stock Qty</th>
   <th>Closing Balance</th>
  </tr> 
  <tr each={t, k in mainArray} no-reorder>
   <td>{k+1}</td>
   <td>{t.item_name}</td>
   <td style="text-align:center">{t.stock_type_code}</td>
   <td style="text-align:center">{t.uom_code}</td>
   <td style="text-align:right">{t.o_qty}</td>
   <td style="text-align:right">{t.r_qty}</td>
   <td style="text-align:right">{t.i_qty}</td>
   <td style="text-align:right">{t.rp_qty}</td>
   <td style="text-align:right">{t.rs_qty}</td>
   <td style="text-align:right">{t.closing_qty}</td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td style="text-align:center"></td>
   <td style="text-align:center"></td>
   <td style="text-align:right">{total.o_qty}</td>
   <td style="text-align:right">{total.r_qty}</td>
   <td style="text-align:right">{total.i_qty}</td>
   <td style="text-align:right">{total.rp_qty}</td>
   <td style="text-align:right">{total.rs_qty}</td>
   <td style="text-align:right">{total.closing_qty}</td>
  </tr>
</table>
  
 </div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      //dateFormat('stockValuationSummryStoreTypeWiseStartDateInput')
      dateFormat('stockValuationSummryStoreTypeWiseEndDateInput')
      self.stock_valution_summry_store_type_wise='stock_valution_summry_store_type_wise_home'
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('read_items_filter')
      self.update()
    })

    self.excelExport = () => {
      // if (self.stockValuationSummryStoreTypeWiseStartDateInput.value=='') {
      //   toastr.info("Please Entet Start Date")
      //   return
      // }
      if (self.stockValuationSummryStoreTypeWiseEndDateInput.value=='') {
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

      var selected_item_id=''
    
      self.checkedItems.map(t => {
          if(selected_item_id==''){
            selected_item_id=t.item_id
          }else if(selected_item_id!=''){
            selected_item_id=selected_item_id+','+t.item_id
          }
       })

     var link="csv/stock_valution_summry_store_type_wise_csv.php?end_date="+self.stockValuationSummryStoreTypeWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString+"&selected_item_id="+selected_item_id;
     // var link="csv/docket_register_item_wise_csv.php?start_date="+self.stockValuationSummryStoreTypeWiseStartDateInput.value+"&end_date="+self.stockValuationSummryStoreTypeWiseEndDateInput.value+"&stock_type_code="+selectedStockTypeString+"&selected_item_id="+selected_item_id;
    
     console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

    /********************************* department filter start*************************/
    self.filterItems = () => {
      if(!self.searchItem) return
      self.filteredItems = self.items.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase())>=0
      })

      self.paginate(self.filteredItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page)
    }

   self.selectItem = (t,e) => {
    self.checkedItems.push(t)
    
    self.items = self.items.filter(c => {
      return c.item_id!=t.item_id
    })
    self.pagedDataItems = self.pagedDataItems.filter(c => {
      return c.item_id!=t.item_id
    })

   }

   self.removeItem = (t,e) => {
     self.checkedItems = self.checkedItems.filter(c => {
      return c.item_id!=t.item_id
    })
     console.log(self.checkedItems)
    
    self.items.push(t)
    self.pagedDataItems.push(t)
   }

   /********************************* department filter end***************************/
    self.selectStockType = (item,e) => {
      item.selected=!e.item.m.selected
    }

    // self.setStartDate = () => {
    //   self.sd=self.stockValuationSummryStoreTypeWiseStartDateInput.value
    // }

    self.setEndDate = () => {
      self.ed=self.stockValuationSummryStoreTypeWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.stock_valution_summry_store_type_wise='stock_valution_summry_store_type_wise_home'
    }

    self.readStockValuationSummaryStoreTypeWise = () => {
      
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

      var selected_item_id=''
    
      self.checkedItems.map(t => {
          if(selected_item_id==''){
            selected_item_id=t.item_id
          }else if(selected_item_id!=''){
            selected_item_id=selected_item_id+','+t.item_id
          }
       })
      
      self.loading=true
      //RiotControl.trigger('read_stock_valution_summry_store_type_wise', selectedStockTypeString,selected_item_id)
       RiotControl.trigger('read_stock_valution_summry_store_type_wise',self.stockValuationSummryStoreTypeWiseEndDateInput.value,selectedStockTypeString,selected_item_id)
    }

    
    RiotControl.on('read_stock_valution_summry_store_type_wise_changed', function(mainArray, total) {
      self.loading = false
      self.mainArray = []
      self.mainArray = mainArray
      self.total = []
      self.total = total
      // self.qty_grand_total = qty_grand_total
      // self.item_value_grand_total = item_value_grand_total
      self.stock_valution_summry_store_type_wise = 'stock_valution_summry_store_type_wise_report'
      //self.docketFrom=self.stockValuationSummryStoreTypeWiseStartDateInput.value
      self.docketTo=self.stockValuationSummryStoreTypeWiseEndDateInput.value
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('items_filter_changed', function(items) {
      self.items = items
      self.checkedItems=[]
      self.items = items
      self.filteredItems = items

      self.items_per_page = 10
      self.paginate(self.filteredItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page)
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
      self.pagedDataItems = self.getPageData(self.filteredItems, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/
    

</script>    
</stock-valuation-summary-store-type-wise>
