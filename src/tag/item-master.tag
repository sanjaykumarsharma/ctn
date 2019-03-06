<item-master>
<loading-bar if={loading}></loading-bar>
<div show={item_view =='item_home'}>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Item</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchItem" class="form-control" placeholder="search" onkeyup={filterItemes} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={showItemModal}><i class="material-icons">add</i></button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="col-sm-12" style="margin-bottom:20px">
    <div class="form-inline">
      <div class="form-group">
        <label>Item Group</label>
        <input id="selectItemGroup" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Stock Type</label>
        <select name="selectStockType" class="form-control" style="min-width:250px">
          <option></option>
          <option each={stock_types} value={stock_type_code}>{stock_type}</option>
        </select>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-primary" onclick={refreshItems}>Go</button>
      </div>
    </div>
  </div>   

  <div class="col-sm-12">
    <ul class="alphabet-list">
      <li each={a, i in alphabet} class={active: selected_alphabet == a} onclick={readItemsByAlphabet.bind(this, a)} >{a}</li>
    </ul>
    <table class="table table-bordered">
      <tr>
        <th class="serial-col">#</th>
        <th>Material</th>
        <th>Code</th>
        <th>Description</th>
        <th>G code</th>
        <th>Uom</th>
        <th>Location</th>
        <th>ST Code</th>
        <th>Max Level</th>
        <th>Min Level</th>
        <th>ROL</th>
        <th>ROQ</th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={cat, i in pagedDataItems} no-reorder>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td>{cat.item_name}</td>
        <td>{cat.item_id}</td>
        <td>{cat.item_description}</td>
        <td>{cat.item_group_code}</td>
        <td>{cat.uom_code}</td>
        <td>{cat.location}</td>
        <td>{cat.stock_type_code}</td>
        <td>{cat.max_level}</td>
        <td>{cat.min_level}</td>
        <td>{cat.reorder_level}</td>
        <td>{cat.reorder_qty}</td>
        <td>
          <div class="table-buttons" hide={cat.confirmDelete ||  cat.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={edit.bind(this, cat)}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
          </div>
          <div class="table-buttons" if={cat.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
        </td>
      </tr>
      <tfoot class="no-print">
        <tr>
          <td colspan="12">
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

<div show={item_view =='item_add'}>

  <h4 class="modal-title" id="myModalLabel">{title} Material</h4>

  <div class="row">
     <div class="col-md-6">
        <div class="form-group row">
          <label for="itemNameInput" class="col-xs-4 col-form-label">Name</label>
          <div class="col-xs-8">
            <input class="form-control" type="text" id="itemNameInput">
          </div>
        </div>

        <div class="form-group row">
          <label for="itemGroupCodeInput" class="col-xs-4 col-form-label">Item Group Code</label>
          <div class="col-xs-8">
             <input id="itemGroupCodeInput" type="text" class="form-control">
          </div>
        </div>

        <div class="form-group row">
          <label for="uomCodeInput" class="col-xs-4 col-form-label">Uom Code</label>
          <div class="col-xs-8">
            <select name="uomCodeInput" class="form-control">
              <option each={uoms} value={uom}>{uom}</option>
            </select>
          </div>
        </div>

        <div class="form-group row">
          <label for="maxLevelInput" class="col-xs-4 col-form-label">Max Level</label>
          <div class="col-xs-8">
            <input class="form-control" type="text" id="maxLevelInput">
          </div>
        </div>

        <div class="form-group row">
          <label for="rolInput" class="col-xs-4 col-form-label">ROL</label>
          <div class="col-xs-8">
            <input class="form-control" type="text" id="rolInput">
          </div>
        </div>

        <div class="form-group row">
          <label for="locationInput" class="col-xs-4 col-form-label">Location</label>
          <div class="col-xs-8">
            <select name="locationInput" class="form-control">
              <option each={locations} value={location}>{location}</option>
            </select>
          </div>
        </div>

     </div>


     <div class="col-md-6">
        <div class="form-group row">
          <label for="itemDescriptionInput" class="col-xs-4 col-form-label">Item Description</label>
          <div class="col-xs-8">
            <input class="form-control" type="text" id="itemDescriptionInput">
          </div>
        </div>

        <div class="form-group row">
          <label for="stockTypeInput" class="col-xs-4 col-form-label">Stock Type Code</label>
          <div class="col-xs-8">
            <select name="stockTypeInput" class="form-control">
              <option each={stock_types} value={stock_type_code}>{stock_type}</option>
            </select>
          </div>
        </div>

        <div class="form-group row">
          <label for="minLevelInput" class="col-xs-4 col-form-label">Min Level</label>
          <div class="col-xs-8">
            <input class="form-control" type="text" id="minLevelInput">
          </div>
        </div>

        <div class="form-group row">
          <label for="roqInput" class="col-xs-4 col-form-label">ROQ</label>
          <div class="col-xs-8">
            <input class="form-control" type="text" id="roqInput">
          </div>
        </div>
     </div>
  </div>
  
  <div class="row text-right">
    <button type="button" class="btn btn-secondary" onclick={hideItemModal} style="margin-right:10px">Close</button>
    <button type="button" class="btn btn-primary" onclick={save}>Save changes</button>
  </div>
</div>

  <script>
    var self = this
    self.on("mount", function(){
      self.loading = true
      self.items_per_page = 10
      RiotControl.trigger('login_init')
      RiotControl.trigger('read_item_groups')
      RiotControl.trigger('read_categories')
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('read_uoms')
      RiotControl.trigger('read_locations')
      self.item_view='item_home'

      self.alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "All"]
      self.selected_alphabet = "A"
      //self.readContacts(self.selected_alphabet)
    })



     self.readItemsByAlphabet = (alphabet,e) => {
      self.selected_alphabet = alphabet
      self.refreshItems()
     }
     self.refreshItems = () => {
      self.items = []
      self.searchItem.value=''
       
      if(self.selectItemGroup.value==''){
        self.selected_item_group_code=''
      } 

      if(!self.selected_item_group_code){
        self.selected_item_group_code=''
      }

      if(self.selected_item_group_code=='' && self.selectStockType.value==''){
        toastr.error("Please select item gropu or stock type")
        return
      }


      self.loading=true
      RiotControl.trigger('read_items',self.selected_item_group_code,self.selectStockType.value,self.selected_alphabet)
      //RiotControl.trigger('read_items',self.selectItemGroup.value,self.selectStockType.value)
    }

    self.filterItemes = () => {
      if(!self.searchItem) return
      self.filteredItems = self.items.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase())>=0
      })

      self.paginate(self.filteredItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.items.map(c => {
        if(c.item_id != e.item.cat.item_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.delete = (e) => {
      self.loading = true
      RiotControl.trigger('delete_item', e.item.cat.item_id)
    }

    self.edit = (t,e) => {
      console.log(t)
      self.title='Edit'   
      self.item_view='item_add'

      self.itemNameInput.value=t.item_name
      self.itemGroupCodeInput.value=t.item_group
      self.selected_item_group_code_input=t.item_group_code
      self.uomCodeInput.value=t.uom_code
      self.locationInput.value=t.location
      self.maxLevelInput.value=t.max_level
      self.rolInput.value=t.reorder_level
      self.itemDescriptionInput.value=t.item_description
      self.stockTypeInput.value=t.stock_type_code
      self.minLevelInput.value=t.min_level
      self.roqInput.value=t.reorder_qty
      self.item_id=t.item_id // id to update the item
    }

    self.save = () => {
      if(!self.itemNameInput.value){
        toastr.info("Please enter a valid Item Nmae and try again")
        return
      }
      
      var obj={}
      obj['itemNameInput']=self.itemNameInput.value
      obj['itemGroupCodeInput']=self.selected_item_group_code_input
      obj['uomCodeInput']=self.uomCodeInput.value
      obj['locationInput']=self.locationInput.value
      obj['maxLevelInput']=self.maxLevelInput.value
      obj['rolInput']=self.rolInput.value
      obj['itemDescriptionInput']=self.itemDescriptionInput.value
      obj['stockTypeInput']=self.stockTypeInput.value
      obj['minLevelInput']=self.minLevelInput.value
      obj['roqInput']=self.roqInput.value

      if(self.title=='Add'){  //add data to database after validation
         self.loading = true
          RiotControl.trigger('add_item', obj)
      }else if(self.title=='Edit'){
         self.loading = true
         obj['item_id']=self.item_id
         RiotControl.trigger('edit_item', obj)
      }
      
    }

    self.cancelOperation = (e) => {
      self.items.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    self.showItemModal = () => {
      self.title='Add'  
      self.item_view='item_add'
    }

    self.hideItemModal = () => {
      self.item_view='item_home'
    }

    RiotControl.on('items_changed', function(items) {
      self.item_view='item_home'
      self.loading = false
      /*if(items.length==0){
        toastr.info("No Data Found")
      }*/
      self.items=[]
      self.items = items
      self.filteredItems = items

      self.paginate(self.filteredItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page)

      self.itemNameInput.value=''
      self.locationInput.value=''
      self.maxLevelInput.value=''
      self.rolInput.value=''
      self.itemDescriptionInput.value=''
      self.stockTypeInput.value=''
      self.minLevelInput.value=''
      self.roqInput.value=''

      self.update()
    })
    
   RiotControl.on('item_groups_changed', function(item_groups) {
      self.loading = false
      self.item_groups = item_groups

      $('#selectItemGroup').autocomplete({
        source: item_groups,
        select: function( event, ui ) {
          self.selected_item_group_code= ui.item.item_group_code
          console.log(self.selected_item_group_code)
        }
      });

      $('#itemGroupCodeInput').autocomplete({
        source: item_groups,
        select: function( event, ui ) {
          self.selected_item_group_code_input= ui.item.item_group_code
          console.log(self.selected_item_group_code_input)
        }
      });



      self.update()
    })

    RiotControl.on('categories_changed', function(categories) {
      self.loading = false
      self.categories = categories
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.loading = false
      self.stock_types = stock_types
      self.update()
    })

    RiotControl.on('uoms_changed', function(uoms) {
      self.loading = false
      self.uoms = uoms
      self.update()
    })

    RiotControl.on('locations_changed', function(locations) {
      self.loading = false
      self.locations = locations
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
</item-master>
