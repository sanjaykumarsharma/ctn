<stock-date-wise>
<loading-bar if={loading}></loading-bar>
<div show={date_wise_stock_view =='date_wise_stock_home'}>
 <div class="container-fulid">
  <div class="row">
    <div class="col-md-6">
      <h4>Stock Date Wise</h4>
    </div>
    <div class="col-md-6 text-xs-right">
      <div class="form-inline">
          <input type="search" name="searchOpeningStock" class="form-control" placeholder="search" onkeyup={filterOpeningStocks} style="width:200px;margin-right:10px">

          <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick={excelExport}>
      </div>          
    </div>
  </div>

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
          <label for="transactionDateInput">Date</label>
          <input type="text" class="form-control" id="transactionDateInput" placeholder="DD/MM/YYYY" onkeyup={setDate}>
        </div>
      </div>

      <!-- <div class="col-sm-3">  
        <div class="form-group">
          <label for="searchMaterialInput">Search Material</label>
          <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px">
        </div>
      </div> -->
      <div class="col-sm-3">  
        <div class="form-group">
          <button type="button" class="btn btn-primary" onclick={getOpeningStock} style="margin-top: 32px;">Get Material</button>
        </div>
      </div>
  </div>

    <table class="table table-bordered">
        <tr>
          <th class="serial-col">#</th>
          <th>Material</th>
          <th>UOM</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
          <th>Location</th>
          <th>Stock Type</th>
        </tr>
        <tr each={c, i in pagedDataItems}>
          <td>{(current_page_no-1)*items_per_page + i + 1}</td>
          <td>{c.item_name}-(Code:{c.item_id})</td>
          <td class="text-center">{c.uom_code}</td>
          <td class="text-center">{c.qty}</td>
          <td class="text-center">{c.rate}</td>
          <td class="text-center">{c.amount}</td>
          <td class="text-center">{c.location}</td>
          <td class="text-center">{c.stock_type_code}</td>
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

<script>
    var self = this
    self.on("mount", function(){
      //RiotControl.trigger('login_init')
      self.items_per_page = 10
      self.items_per_page_new = 10
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('read_item_groups')
      self.date_wise_stock_view='date_wise_stock_home'
      self.update()
      dateFormat('transactionDateInput')

    })

    self.setDate = () => {
      self.transactionDate=self.transactionDateInput.value
    }

    self.getOpeningStock = () => {
      self.materials = []
      //if(self.searchMaterialInput.value==''){
        if(self.selectItemGroupFilter.value==''){
          toastr.info("Please select Item Group and try again")
          return;
        }
        if(self.transactionDateInput.value==''){
          toastr.info("Please enter date and try again")
          return;
        }
        RiotControl.trigger('read_stock_wise_date',self.selected_item_group_code,self.selectStockTypeFilter.value,self.transactionDateInput.value)
        //RiotControl.trigger('read_stock_wise_date',self.transactionDateInput.value)
      /*}else{
         RiotControl.trigger('search_items_of_opening_stock',self.searchMaterialInput.value,self.selectStockTypeFilter.value)
      }*/
    } 

    self.excelExport = () => {

     if (self.selectItemGroupFilter.value=='') {
        toastr.info("Please select Item Group")
        return
      }      

     var link="csv/current_stock_csv.php?date="+self.transactionDateInput.value+"&item_group_code="+self.selected_item_group_code+"&stock_type_code="+self.selectStockTypeFilter.value;
    
     console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

    self.filterOpeningStocks = () => {
      if(!self.searchOpeningStock) return
      self.filteredOpeningStocks = self.openingStocks.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchOpeningStock.value.toLowerCase())>=0
      })

      self.paginate(self.filteredOpeningStocks, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page)
    }

   /*method change callback from store*/
    RiotControl.on('item_groups_changed', function(item_groups) {
      //self.item_groups = item_groups
      $('#selectItemGroupFilter').autocomplete({
        source: item_groups,
        select: function( event, ui ) {
          self.selected_item_group_code= ui.item.item_group_code
        }
      });

      $('#selectItemGroupFilter1').autocomplete({
        source: item_groups,
        select: function( event, ui ) {
          self.selected_item_group_code1= ui.item.item_group_code
        }
      });
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('search_items_of_opening_stock_changed', function(items) {
      //$("#itemModal").modal('show')  
      self.loading = false
      self.openingStocks = []
      self.openingStocks = items
      self.searchMaterialInput.value=''

      self.filteredOpeningStocks = self.openingStocks

      console.log(self.filteredOpeningStocks)

      self.paginate(self.filteredOpeningStocks, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page)
      self.update()
    })

    RiotControl.on('read_stock_wise_date_changed', function(items) {
      self.loading = false
      self.openingStocks = []
      self.openingStocks = items

      self.filteredOpeningStocks=self.openingStocks

      self.paginate(self.filteredOpeningStocks, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page)
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
      self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredOpeningStocks, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/
    
 </script>

</stock-date-wise>
