<opening-stock>
<loading-bar if={loading}></loading-bar>
<div show={opening_stock_view =='opening_stock_home'}>
 <div class="container-fulid">
  <div class="row">
    <div class="col-md-6">
      <h4>Opening Stock</h4>
    </div>
    <div class="col-md-6 text-xs-right">
      <div class="form-inline">
          <input type="search" name="searchOpeningStock" class="form-control" placeholder="search" onkeyup={filterOpeningStocks} style="width:200px;margin-right:10px">
          <button class="btn btn-secondary" disabled={loading} onclick={showOpeningEntryForm}><i class="material-icons">add</i></button>

          <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick={excelExport}>
      </div>          
     <!-- <form action="opening_stock_csv.php" method="post" enctype="multipart/form-data">
         Select image to upload:
         <input type="file" name="fileToUpload" id="fileToUpload">
         <input type="submit" value="Upload " name="submit">
     </form> -->
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
          <label for="searchMaterialInput">Search Material</label>
          <input type="text" name="searchMaterialInput" class="form-control" style="min-width:250px">
        </div>
      </div>
      <div class="col-sm-3">  
        <div class="form-group">
          <button type="button" class="btn btn-primary" onclick={getOpeningStock} style="margin-top: 32px;">Get Material</button>
        </div>
      </div>
  </div>

  <!-- <div class="row"> -->
    <table class="table table-bordered">
        <tr>
          <th class="serial-col">#</th>
          <th>Material</th>
          <th>UOM</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
          <th>Location</th>
          <th>Remarks</th>
          <th>Date</th>
          <th></th>
        </tr>
        <tr each={c, i in pagedDataItems}>
          <td>{(current_page_no-1)*items_per_page + i + 1}</td>
          <td>{c.item_name}-(Code:{c.item_id})</td>
          <td class="text-center">{c.uom_code}</td>
          <td class="text-center">{c.qty}</td>
          <td class="text-center">{c.rate}</td>
          <td class="text-center">{c.running_amount}</td>
          <td class="text-center">{c.location}</td>
          <td class="text-center">{c.remarks}</td>
          <td class="text-center">{c.transaction_date}</td>
          <td>
            <button class="btn btn-secondary" disabled={loading} onclick={edit}><i class="material-icons">create</i></button>
          </td>
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
   <!-- </div> -->
 </div>
</div>

<div show={opening_stock_view =='opening_stock_entry'}>
  <h4>{title} Opening Stock</h4>
  <form>
     <div class="row">
        <div class="col-sm-3">
          <div class="form-group">
            <label for="openingStockDateInput">Date</label>
            <input type="text" class="form-control" id="openingStockDateInput" placeholder="DD/MM/YYYY">
          </div>
        </div>
     </div>   
      
    <div class="row bgColor" show={title=='Add'}>
      <div class="col-sm-3">
        <div class="form-group">
          <label for="selectIndentGroupFilter1">Item Group</label>
          <input id="selectItemGroupFilter1" type="text" class="form-control" />
        </div>
      </div>  
      <div class="col-sm-3">  
        <div class="form-group">
          <label for="selectStockTypeFilter1">Stock Type</label>
          <select name="selectStockTypeFilter1" class="form-control" style="min-width:250px">
            <option each={stock_types} value={stock_type_code}>{stock_type}</option>
          </select>
        </div>
      </div>
      <div class="col-sm-3">  
        <div class="form-group">
          <label for="searchMaterialInput1">Search Material</label>
          <input type="text" name="searchMaterialInput1" class="form-control" style="min-width:250px">
        </div>
      </div>
      <div class="col-sm-3">  
        <div class="form-group">
          <button type="button" class="btn btn-primary" onclick={getMaterial} style="margin-top: 32px;">Get Material</button>
        </div>
      </div>
  </div>
                
   <div class="row">
    <table class="table table-bordered">
        <tr>
          <th class="serial-col">#</th>
          <th>Material</th>
          <th>UOM</th>
          <th>Location</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
          <th>Remarks</th>
          <th show={title=='Add'}></th>
        </tr>
        <tr each={cat, i in selectedMaterialsArray}>
          <td>{i+1}</td>
          <td>{cat.item_name}</td>
          <td>{cat.uom_code}</td>
          <td>
            <select id="{ 'locationInput' + cat.item_id }" class="form-control">
               <option></option>
               <option each={locations} value={location}>{location}</option>
            </select>
          </td>
          <td>
            <input type="text"  id="{ 'qtyInput' + cat.item_id }" value={cat.qty} onchange={calculateAmount} class="form-control"/>
          </td>
          <td>
            <input type="text"  id="{ 'rateInput' + cat.item_id }" value={cat.rate} onchange={calculateAmount} class="form-control"/>
          </td>
          <td>{cat.running_amount}</td>
          <td>
            <input type="text" id="{ 'remarksInput' + cat.item_id }"  value={cat.remarks} class="form-control" />
          </td>
          <td show={title=='Add'}>
            <button class="btn btn-secondary" disabled={loading} onclick={removeSelectedMaterial.bind(this, cat)}><i class="material-icons">remove</i></button>
          </td>
        </tr>
      </table>
   </div>

  </form>

  <div class="col-sm-12">
    <button type="button" class="btn btn-primary pull-sm-right" onclick={save}>Save changes</button>
    <button type="button" class="btn btn-secondary pull-sm-right" onclick={closeAddOpeningStock} style="    margin-right: 10px;">Close</button>
  </div>

 </div> <!-- add_opening end -->

 <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">Select Material</h4>
          <div class="text-xs-right form-inline" >
              <input type="search" name="searchMaterials" class="form-control" placeholder="search" onkeyup={filterMaterials} style="width:200px"> 
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" onclick={selectedMaterial}>Submit</button>
          </div>
        </div>
        <div class="modal-body">
        
          <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th></th>
            <th>Material</th>
            <!-- <th>Description</th> -->
          </tr>
          <tr each={it, i in pagedDataMaterials}>
            <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td>
            <td><input type="checkbox" class="form-control"  checked={it.selected} onclick="{parent.toggle}"></td>
            <td>{it.item_name}-(Code:{it.item_id})</td>
            <!-- <td>{it.description}</td> -->
          </tr>
          <tfoot class="no-print">
            <tr>
              <td colspan="10">
                <div class="right-align">
                  Items Per Page: <select class="p1 mb0 rounded inline" onchange={changeItemsPerPageNew}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  Page No: <select class="p1 mb0 rounded inline" name="page_select_new" onchange={changePageNew}>
                    <option each={pno in page_array_new} value={pno}>{pno}</option>
                  </select>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
                     
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick={selectedMaterial}>Submit</button>
        </div>
      </div>
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
      RiotControl.trigger('read_locations')
      self.opening_stock_view='opening_stock_home'
      dateFormat('openingStockDateInput')
      self.update()

    })

   self.showOpeningEntryForm = () => {
      self.title='Add'  
      self.opening_stock_view='opening_stock_entry'
      self.selectedMaterialsArray=[]
      $("#openingStockDateInput").prop( "disabled", false );
      self.update()
    }
   self.closeAddOpeningStock = () => {
    self.opening_stock_view='opening_stock_home'
   }

   // self.uploadCSV = ($files) => {}
   self.getMaterial = () => {
      self.materials = []
      if(self.searchMaterialInput1.value==''){
        if(self.selectItemGroupFilter1.value==''){
          toastr.info("Please select Item Group and try again")
          return;
        }
        RiotControl.trigger('read_items_for_opening_stock',self.selected_item_group_code1,self.selectStockTypeFilter1.value)
      }else{
        RiotControl.trigger('search_items_for_opening_stock',self.searchMaterialInput1.value,self.selectStockTypeFilter1.value)
      }
    } 

   self.selectedMaterial = () => {
       self.materials = self.materials.map(m => {
        if(m.selected){
            self.selectedMaterialsArray.push(m)
        }
       })
       //assign location name to selected array
       $("#itemModal").modal('hide') 
       self.update()
       self.selectedMaterialsArray.map(i=>{ 
         let locationInput= '#locationInput'+i.item_id
         $(locationInput).val(i.location);
      })

       self.update()
    }

    self.removeSelectedMaterial = (i,e) => { 
      let tempSelectedMaterialsArray = self.selectedMaterialsArray.filter(c => {
        return c.item_id != i.item_id
      })

      self.selectedMaterialsArray=tempSelectedMaterialsArray
    } 

    self.toggle = (e) =>{
        var item = e.item.it
        item.selected = !item.selected

        /*updating selected materials*/
        /*self.materials = self.materials.map(m => {
          if(m.item_id == item.it.item_id){
           m.item_id=m.item_id
           m.item_name=m.item_name
           m.item_group_code=m.item_group_code
           m.uom_code=m.uom_code
           m.uom_id=m.uom_id
           m.uom=m.uom
           m.max_level=m.max_level
           m.reorder_level=m.reorder_level
           m.item_description=m.item_description
           m.category_code=m.category_code
           m.stock_type_code=m.stock_type_code
           m.min_level=m.min_level
           m.reorder_qty=m.reorder_qty
           m.selected=item.selected

           m.qty=''
           m.remarks=''

          }
          m.confirmEdit = false
          return m
        })
        return true*/
    }

     self.excelExport = () => {
     var link="csv/opening_stock_csv.php?item_group_code="+self.selected_item_group_code+"&stock_type_code="+self.selectStockTypeFilter.value;
    
      console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

    self.calculateAmount = (e) => {
      let qtyInput= '#qtyInput'+e.item.cat.item_id
      let qty = $(qtyInput).val()

      let rateInput= '#rateInput'+e.item.cat.item_id
      let rate = $(rateInput).val()

      e.item.cat.running_amount = Number(Number(qty)*Number(rate)).toFixed(3)
      
    }


    self.edit = (e) => {
      console.log(e.item.c)
      self.title='Edit'  
      self.opening_stock_view='opening_stock_entry'
      self.selectedMaterialsArray=[]
      self.selectedMaterialsArray.push(e.item.c)
      self.openingStockDateInput.value=e.item.c.transaction_date
      $("#openingStockDateInput").prop( "disabled", true );
      self.update()
      self.selectedMaterialsArray.map(i=>{        
       let locationInput= '#locationInput'+i.item_id
       $(locationInput).val(i.location);
      })
    }
   
    self.save = () => {
      if(self.openingStockDateInput.value==''){
         toastr.info("Please Entet Openign Stock Date")
        return
      }

      let str=self.openingStockDateInput.value;
      var d = str.split("/");
      var po_date = moment([d[2].trim()+d[1].trim()+d[0].trim()],'YYYYMMDD')
      var toDay=moment().format('YYYYMMDD')

      let from = moment(po_date, 'YYYYMMDD'); 
      let to = moment(toDay, 'YYYYMMDD');     
      let differnece=to.diff(from, 'days')  

      if(differnece<0){
        toastr.error("Opening date can not be greater than today")
        return
      }
      
      let error='' 
      let count=1 
      self.selectedMaterialsArray.map(i=>{
        let locationInput= '#locationInput'+i.item_id
        i.location=$(locationInput).val()

        if(i.location==''){
          error=error+ 'Please select location' + count +', '
        }

       let qtyInput= '#qtyInput'+i.item_id
        i.qty=$(qtyInput).val()

        if(i.qty==''){
          error=error+ 'Please select qty' + count +', '
        }

        let rateInput= '#rateInput'+i.item_id
        i.rate=$(rateInput).val()

        let remarksInput= '#remarksInput'+i.item_id
        i.remarks=$(remarksInput).val()
        
        count++
      })
      
      if(self.selectedMaterialsArray.length==0){
        toastr.info("No item to insert")
        return;
      }

      var obj={}
      obj['opening_stock_date']=self.openingStockDateInput.value
      if(error!=''){
        toastr.info(error)
      }else if(self.title=='Add'){  //add data to database after validation
         self.loading = true
          RiotControl.trigger('add_opening_stock', self.selectedMaterialsArray, obj)
      }else if(self.title=='Edit'){
         self.loading = true
         RiotControl.trigger('edit_opening_stock', self.selectedMaterialsArray, obj )
      }
      
    }

    self.getOpeningStock = () => {
      self.materials = []
      if(self.searchMaterialInput.value==''){
        if(self.selectItemGroupFilter.value==''){
          //toastr.info("Please select Item Group and try again")
          //return;
          self.selected_item_group_code = '';
        }
        RiotControl.trigger('read_opening_stock_items',self.selected_item_group_code,self.selectStockTypeFilter.value)
      }else{
        RiotControl.trigger('search_items_of_opening_stock',self.searchMaterialInput.value,self.selectStockTypeFilter.value)
      }
    } 

    self.filterOpeningStocks = () => {
      if(!self.searchOpeningStock) return
      self.filteredOpeningStocks = self.openingStocks.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchOpeningStock.value.toLowerCase())>=0
      })

      self.paginate(self.filteredOpeningStocks, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page)
    }

    self.filterMaterials = () => {
      if(!self.searchMaterials) return
      self.filteredMaterials = self.materials.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase())>=0
      })

      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
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

    RiotControl.on('locations_changed', function(locations) {
      self.locations = locations
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

    RiotControl.on('read_opening_stock_items_changed', function(items) {
      self.loading = false
      self.openingStocks = []
      self.openingStocks = items

      self.filteredOpeningStocks=self.openingStocks

      self.paginate(self.filteredOpeningStocks, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredOpeningStocks, 1, self.items_per_page)
      self.update()
    })


    RiotControl.on('add_opening_stock_changed', function() {
      self.loading = false
      self.opening_stock_view ='opening_stock_home'
      self.getOpeningStock()
      self.update()
    })

    RiotControl.on('edit_opening_stock_changed', function() {
      self.loading = false
      self.opening_stock_view ='opening_stock_home'
      self.getOpeningStock()
      self.update()
    })

    
    RiotControl.on('read_items_for_opening_stock_changed', function(items) {
      $("#itemModal").modal('show')  
      self.loading = false
      self.materials = items
      
      self.filteredMaterials=self.materials
      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
      self.update()
    })

    RiotControl.on('search_items_for_opening_stock_changed', function(items) {
      $("#itemModal").modal('show')  
      self.loading = false
      self.materials = items
      self.searchMaterialInput1.value=''
      
      self.filteredMaterials=self.materials
      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
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

    /**************** pagination for items*******************/
    self.getPageDataNew = (full_data, page_no, items_per_page_new) => {
      let start_index = (page_no - 1)*items_per_page_new
      let end_index = page_no * items_per_page_new
      let items = full_data.filter((fd, i) => {
        if(i >= start_index && i < end_index) return true
      })
      return items
    }

    self.paginate_new = (full_data, items_per_page_new) => {
      let total_pages = Math.ceil(full_data.length/items_per_page_new)
      let pages = []
      for(var i = 1; i <= total_pages; i++){
        pages.push(i)
      }
      self.page_array_new = pages
      self.current_page_no_new = 1;
      self.update()
    }
    self.changePageNew = (e) => {
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, e.target.value, self.items_per_page_new)
      self.current_page_no_new = e.target.value
    }
    self.changeItemsPerPageNew = (e) => {
      self.items_per_page_new = e.target.value
      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
      self.current_page_no_new = 1
      self.page_select_new.value = 1
    }
    /**************** pagination ends*******************/
    
 </script>

</opening-stock>
