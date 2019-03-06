<pending-po>

<div show={pending_po_view =='pending_po_home'}>
 <div class="container-fulid">
  
  <div class="row bgColor no-print">
    <div class="col-sm-3">  
      <div class="form-group">
        <label for="selectStockTypeFilter">Stock Type</label>
        <select name="selectStockTypeFilter" class="form-control" style="min-width:250px" onchange={getPendingPO}>
          <option></option>
          <option each={stock_types} value={stock_type_code}>{stock_type}</option>
        </select>
      </div>
    </div>
    <!-- <div class="col-sm-3">  
     <div class="form-inline">
        <button type="button" class="btn btn-primary" onclick={getPendingPO} style="margin-top: 32px;">GO</button>
      </div>
    </div> -->
   </div>

  <!-- <div class="row"> -->
    <table class="table table-bordered">
      <tr>
        <th class="serial-col">#</th>
        <th>PO Number</th>      
        <th>PO Date</th>
        <th>Material</th>
        <th>PO qty</th>
        <th>Docket Qty</th>
        <!-- <th></th> -->
      </tr>
      <tr each={it, i in pagedDataItems} no-reorder>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td class="text-sm-center">{it.po_no}</td>
        <td class="text-sm-center">{it.po_date}</td>
        <td>{it.item_name}</td>
        <td class="text-sm-right">{it.po_qty}</td>
        <td class="text-sm-right">{it.docket_po_qty}</td>
        <!-- <td>
          <button disabled={loading} class="btn btn-secondary btn-sm" onclick={getStockStatement}><i class="material-icons">visibility</i></button>
        </td> -->
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
   <!-- </div> -->
 </div>
</div>


<script>
    var self = this
    self.on("mount", function(){
      RiotControl.trigger('read_stock_types')
      self.pending_po_view='pending_po_home'
      self.update()

    })

    self.filterMaterials = () => {
      if(!self.searchItems) return
      self.filteredMaterials = self.materials.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchItems.value.toLowerCase())>=0
      })
      self.paginate(self.filteredMaterials, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page)
    }

    self.getPendingPO = () => {
      console.log('call')
      self.materials = []

      if(self.selectStockTypeFilter.value==''){
        toastr.info("Please select Stock Type and try again")
        return;
      }

      self.loading=true
      RiotControl.trigger('read_pending_po',self.selectStockTypeFilter.value)
      
    }

   

    /*method change callback from store*/

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })


    RiotControl.on('read_pending_po_changed', function(items) {
      console.log('herer')
      self.loading = false
      self.materials = []
      self.materials = items

      self.filteredMaterials = items
      
      self.items_per_page = 10
      self.paginate(self.filteredMaterials, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page)

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
      self.pagedDataItems = self.getPageData(self.filteredMaterials, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredMaterials, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredMaterials, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/
    
 </script>
</pending-po>
