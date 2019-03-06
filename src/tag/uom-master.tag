<uom-master>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>UOM</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchUom" class="form-control" placeholder="search" onkeyup={filterUoms} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshUoms}><i class="material-icons">refresh</i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">

      <tr class="input-row">
        <td colspan="2"><input type="text" name="addUomCodeInput" placeholder="Code" class="form-control" onkeyup={addEnter}></td>
        <td><input type="text" name="addUomInput" placeholder="UOM" class="form-control" onkeyup={addEnter}></td>
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
        <th onclick={sortByUOM} style="cursor: pointer;">
          UOM
           <hand if={activeSort=='sortuom'}>
            <i class="material-icons" show={sortuom}>arrow_upward</i> 
            <i class="material-icons" hide={sortuom}>arrow_downward</i>
           </hand>
        </th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={loc, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>

        <td if={!loc.confirmEdit && !loc.confirmDelete}>
          {loc.uom_code}
        </td>
        <td if={!loc.confirmEdit && !loc.confirmDelete}>
          {loc.uom}
        </td>

        <td colspan="2" if={loc.confirmDelete}><span class="delete-question">Are you sure?</span></td>

        <td if={loc.confirmEdit}>
          <input type="text" id="editedUomCode" autofocus class="form-control" value={loc.uom_code} onkeyup={editEnter.bind(this)}>
        </td>
        <td if={loc.confirmEdit}>
          <input type="text" id="editedUom"  class="form-control" value={loc.uom} onkeyup={editEnter.bind(this)}>
        </td>


        <td>
          <div class="table-buttons" hide={loc.confirmDelete ||  loc.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmEdit}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
          </div>
          <div class="table-buttons" if={loc.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
          <div class="table-buttons" if={loc.confirmEdit}>
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
      self.sortuom = true
      self.sortCode = true
      self.activeSort='';
      self.update()
      //RiotControl.trigger('login_init')
      RiotControl.trigger('read_uoms')
    })

    // RiotControl.on('login_changed', function(login_status) {
    //   if(!login_status.role || login_status.role == 'FAIL'){
    //     riot.route("/home")
    //   }
    // })

    self.refreshUoms = () => {
      self.uoms = []
      self.searchUom.value;
      RiotControl.trigger('read_uoms')
    }

    self.filterUoms = () => {
      if(!self.searchUom) return
      self.filteredUoms = self.uoms.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchUom.value.toLowerCase())>=0
      })
      self.paginate(self.filteredUoms, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredUoms, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.uoms.map(c => {
        if(c.uom_id != e.item.loc.uom_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.confirmEdit = (e) => {
      self.uoms.map(c => {
        if(c.uom_id != e.item.loc.uom_id){
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
      RiotControl.trigger('delete_uom', e.item.loc.uom_id)
    }

    self.edit = (e) => {
      if(!$("#editedUomCode").val()){
        toastr.info("Please enter a valid uom Code and try again")
      }else if(!$("#editedUom").val()){
        toastr.info("Please enter a valid uom and try again")
      }else{
        self.loading = true
        RiotControl.trigger('edit_uom', e.item.loc.uom_id, $("#editedUomCode").val(),$("#editedUom").val())
      }
    }

    self.add = () => {
      if(!self.addUomCodeInput.value){
        toastr.info("Please enter a valid uom Code and try again")
      }else  if(!self.addUomInput.value){
        toastr.info("Please enter a valid uom and try again")
      }else{
        self.loading = true
        RiotControl.trigger('add_uom', self.addUomCodeInput.value, self.addUomInput.value)
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
      self.uoms.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    RiotControl.on('uoms_changed', function(uoms) {
      self.addUomCodeInput.value = ''
      self.addUomInput.value = ''
      self.loading = false
      self.uoms = uoms
      self.filteredUoms = uoms

      self.items_per_page = 10
      self.callPaging()
      self.update()
    })

    self.callPaging=()=>{
      self.paginate(self.filteredUoms, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredUoms, 1, self.items_per_page)
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
      self.pagedDataItems = self.getPageData(self.filteredUoms, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredUoms, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredUoms, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/

    /*sorting Starts*/  
    self.sortByUOM = () =>{

      if(self.sortuom==true){
        self.uoms.sort(function(a, b) {
          return (a.uom.toUpperCase()).localeCompare((b.uom.toUpperCase()));
        });
      }else{
        self.uoms.reverse()
      }
 
      self.activeSort='sortuom'      
      self.filteredUoms = self.uoms
      self.callPaging()
      
      self.update();
      self.sortuom=!self.sortuom
    }

    self.sortByCode = () =>{

      if(self.sortCode==true){
        self.uoms.sort(function(a, b) {
          return a.uom_code - b.uom_code;
        });
      }else{
        self.uoms.reverse()
      }

      self.activeSort='sortCode'
      self.filteredUoms = self.uoms
      self.callPaging()
      
      self.update();
      self.sortCode=!self.sortCode
    }
   
   /*sorting Ends*/

  </script>
</uom-master>
