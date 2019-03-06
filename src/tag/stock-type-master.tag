<stock-type-master>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Stock Type</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchStockType" class="form-control" placeholder="search" onkeyup={filterStockTypes} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshStockTypes}><i class="material-icons">refresh</i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">

      <tr class="input-row">
        <td colspan="2"><input type="text" name="addStockTypeCodeInput" placeholder="Code" class="form-control" onkeyup={addEnter}></td>
        <td><input type="text" name="addStockTypeInput" placeholder="StockType" class="form-control" onkeyup={addEnter}></td>
        <td class="two-buttons"><button class="btn btn-primary w-100" onclick={add}>Add</button></td>
      </tr>

      <tr>
        <th class="serial-col">#</th>
        <th onclick={sortByCode} style="cursor: pointer;">
          Code
          <hand if={activeSort=='sortCode'}>
           <i class="material-icons" show={sortCode}>arrow_upward</i> 
           <i class="material-icons" hide={sortCode}>arrow_downward</i>
          <hand>
        </th>
        <th onclick={sortByStockType} style="cursor: pointer;">
          Stock Type
           <hand if={activeSort=='sortStockType'}>
            <i class="material-icons" show={sortStockType}>arrow_upward</i> 
            <i class="material-icons" hide={sortStockType}>arrow_downward</i>
           </hand>
        </th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={ch, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>

        <td if={!ch.confirmEdit && !ch.confirmDelete}>
          {ch.stock_type_code}
        </td>
        <td if={!ch.confirmEdit && !ch.confirmDelete}>
          {ch.stock_type}
        </td>

        <td colspan="2" if={ch.confirmDelete}><span class="delete-question">Are you sure?</span></td>

        <td if={ch.confirmEdit}>
          <input type="text" id="editedStockTypeCode" autofocus class="form-control" value={ch.stock_type_code} onkeyup={editEnter.bind(this)}>
        </td>
        <td if={ch.confirmEdit}>
          <input type="text" id="editedStockType"  class="form-control" value={ch.stock_type} onkeyup={editEnter.bind(this)}>
        </td>


        <td>
          <div class="table-buttons" hide={ch.confirmDelete ||  ch.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmEdit}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
          </div>
          <div class="table-buttons" if={ch.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
          <div class="table-buttons" if={ch.confirmEdit}>
            <button disabled={loading} class="btn btn-primary btn-sm" onclick={edit}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
        </td>
      </tr>
      <tfoot>
        <tr>
          <td colspan="4">
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
  <script>
    var self = this
    self.on("mount", function(){
      self.loading = true
      self.sortStockType = true
      self.sortCode = true
      self.activeSort='';
      self.update()
      // RiotControl.trigger('login_init')
      RiotControl.trigger('read_stock_types')
    })

    // RiotControl.on('login_changed', function(login_status) {
    //   if(!login_status.role || login_status.role == 'FAIL'){
    //     riot.route("/home")
    //   }
    // })

    self.refreshStockTypes = () => {
      self.stock_types = []
      self.searchStockType.value;
      RiotControl.trigger('read_stock_types')
    }

    self.filterStockTypes = () => {
      if(!self.searchStockType) return
      self.filteredStockTypes = self.stock_types.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchStockType.value.toLowerCase())>=0
      })

      self.paginate(self.filteredStockTypes, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredStockTypes, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.stock_types.map(c => {
        if(c.stock_type_id != e.item.ch.stock_type_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.confirmEdit = (e) => {
      self.stock_types.map(c => {
        if(c.stock_type_id != e.item.ch.stock_type_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = false
          c.confirmEdit = true
        }
      })
    }

    self.delete = (e) => {
      self.loading = true
      RiotControl.trigger('delete_stock_type', e.item.ch.stock_type_id)
    }

    self.edit = (e) => {
      if(!$("#editedStockTypeCode").val()){
        toastr.info("Please enter a valid stock_type Code and try again")
      }else if(!$("#editedStockType").val()){
        toastr.info("Please enter a valid stock_type and try again")
      }else{
        self.loading = true
        RiotControl.trigger('edit_stock_type', e.item.ch.stock_type_id, $("#editedStockTypeCode").val(),$("#editedStockType").val())
      }
    }

    self.add = () => {
      if(!self.addStockTypeCodeInput.value){
        toastr.info("Please enter a valid stock_type Code and try again")
      }else  if(!self.addStockTypeInput.value){
        toastr.info("Please enter a valid stock_type and try again")
      }else{
        self.loading = true
        RiotControl.trigger('add_stock_type', self.addStockTypeCodeInput.value, self.addStockTypeInput.value)
      }
    }

    self.addEnter = (e) => {
      if(e.which == 13){
        self.add()
      }
    }

    self.editEnter = (e) => {
      if(e.which == 13){
        self.edit(e)
      }  
    }

    self.cancelOperation = (e) => {
      self.stock_types.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.addStockTypeCodeInput.value = ''
      self.addStockTypeInput.value = ''
      self.loading = false
      self.stock_types = stock_types
      self.filteredStockTypes = stock_types

      self.items_per_page = 10
      self.callPaging()
      self.update()
    })

    self.callPaging=()=>{
      self.paginate(self.filteredStockTypes, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredStockTypes, 1, self.items_per_page)
    }

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
      self.pagedDataItems = self.getPageData(self.filteredStockTypes, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredStockTypes, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredStockTypes, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/

    /*sorting Starts*/  
    self.sortByStockType = () =>{

      if(self.sortStockType==true){
        self.stock_types.sort(function(a, b) {
          return (a.stock_type.toUpperCase()).localeCompare((b.stock_type.toUpperCase()));
        });
      }else{
        self.stock_types.reverse()
      }
 
      self.activeSort='sortStockType'      
      self.filteredStockTypes = self.stock_types
      self.callPaging()
      
      self.update();
      self.sortStockType=!self.sortStockType
    }

    self.sortByCode = () =>{

      if(self.sortCode==true){
        self.stock_types.sort(function(a, b) {
          return (a.stock_type_code.toUpperCase()).localeCompare((b.stock_type_code.toUpperCase()));
        });
      }else{
        self.stock_types.reverse()
      }

      self.activeSort='sortCode'
      self.filteredStockTypes = self.stock_types
      self.callPaging()
      
      self.update();
      self.sortCode=!self.sortCode
    }
   
   /*sorting Ends*/

  </script>
</stock-type-master>
