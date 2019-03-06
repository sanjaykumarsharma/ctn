<stock-in-hand>

<div show={stock_in_hand_view =='stock_in_hand_home'}>
 <div class="container-fulid">
  
  <div class="row bgColor no-print">
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
          <option></option>
          <option each={stock_types} value={stock_type_code}>{stock_type}</option>
        </select>
      </div>
    </div>
    <div class="col-sm-3">  
      <div class="form-group">
        <label for="searchMaterialInput">Search Material</label>
        <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px">
      </div>
    </div>
    <div class="col-sm-3">  
     <div class="form-inline">
          <input type="search" name="searchItems" class="form-control" placeholder="search" onkeyup={filterMaterials} style="width:200px;margin-top: 32px;">
        <button type="button" class="btn btn-primary" onclick={getMaterialForStockStatement} style="margin-top: 32px;">GO</button>
      </div>
    </div>
   </div>

  <!-- <div class="row"> -->
    <table class="table table-bordered">
      <tr>
        <th class="serial-col">#</th>
        <th>Material</th>
        <th>UOM</th>
        <th>Group</th>
        <th>Qty</th>
        <!-- <th></th> -->
      </tr>
      <tr each={it, i in pagedDataItems} no-reorder>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td>{it.item_name}-(Code:{it.item_id})</td>
        <td class="text-sm-center">{it.uom_code}</td>
        <td class="text-sm-center">{it.item_group}</td>
        <td class="text-sm-right">{it.stock}</td>
        <!-- <td>
          <button disabled={loading} class="btn btn-secondary btn-sm" onclick={getStockStatement}><i class="material-icons">visibility</i></button>
        </td> -->
      </tr>
      <tfoot class="no-print">
        <tr>
          <td colspan="5">
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
      RiotControl.trigger('read_item_groups')
      self.stock_in_hand_view='stock_in_hand_home'
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

    self.getMaterialForStockStatement = () => {
      console.log('call')
      self.materials = []
      if(self.searchMaterialInput.value==''){
        if(self.selectItemGroupFilter.value==''){
          toastr.info("Please select Item Group and try again")
          return;
        }
        if(self.selectStockTypeFilter.value==''){
          toastr.info("Please select Stock Type and try again")
          return;
        }
        self.loading=true
        RiotControl.trigger('read_items_for_stock_in_hand',self.selected_item_group_code,self.selectStockTypeFilter.value)
      }else{
        if(self.selectStockTypeFilter.value==''){
          toastr.info("Please select Stock Type and try again")
          return;
        }
        self.loading=true
        RiotControl.trigger('search_items_for_stock_in_hand',self.searchMaterialInput.value,self.selectStockTypeFilter.value)
      }
    }

   

    /*method change callback from store*/
    RiotControl.on('item_groups_changed', function(item_groups) {
     $('#selectItemGroupFilter').autocomplete({
        source: item_groups,
        select: function( event, ui ) {
          self.selected_item_group_code= ui.item.item_group_code
          console.log(self.selected_item_group_code)
        }
      });
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })


    RiotControl.on('read_items_for_stock_in_hand_changed', function(items) {
      console.log('herer')
      self.loading = false
      self.materials = []
      self.materials = items
      self.searchMaterialInput.value=''

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
</stock-in-hand>
