<chargehead-master>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Chargeheads</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchChargehead" class="form-control" placeholder="search" onkeyup={filterChargeheads} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshChargeheads}><i class="material-icons">refresh</i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">

      <tr class="input-row">
        <td colspan="2"><input type="text" name="addChargeheadCodeInput" placeholder="Code" class="form-control" onkeyup={addEnter}></td>
        <td><input type="text" name="addChargeheadInput" placeholder="Chargehead" class="form-control" onkeyup={addEnter}></td>
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
        <th onclick={sortByChargeHead} style="cursor: pointer;">
            Chargehead
            <hand if={activeSort=='sortCHead'}>
              <i class="material-icons" show={sortCHead}>arrow_upward</i> 
              <i class="material-icons" hide={sortCHead}>arrow_downward</i>
            </hand>  
        </th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={ch, i in pageDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>

        <td if={!ch.confirmEdit && !ch.confirmDelete}>
          {ch.chargehead_code}
        </td>
        <td if={!ch.confirmEdit && !ch.confirmDelete}>
          {ch.chargehead}
        </td>

        <td colspan="2" if={ch.confirmDelete}><span class="delete-question">Are you sure?</span></td>

        <td if={ch.confirmEdit}>
          <input type="text" id="editedChargeheadCode" autofocus class="form-control" value={ch.chargehead_code} onkeyup={editEnter.bind(this)}>
        </td>
        <td if={ch.confirmEdit}>
          <input type="text" id="editedChargehead"  class="form-control" value={ch.chargehead} onkeyup={editEnter.bind(this)}>
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
      self.sortCHead = true
      self.sortCode = true
      self.activeSort='';
      self.update()
      //RiotControl.trigger('login_init')
      RiotControl.trigger('read_chargeheads')
    })

    // RiotControl.on('login_changed', function(login_status) {
    //   if(!login_status.role || login_status.role == 'FAIL'){
    //     riot.route("/home")
    //   }
    // })

    self.refreshChargeheads = () => {
      self.chargeheads = []
      self.searchChargehead.value;
      RiotControl.trigger('read_chargeheads')
    }

    self.filterChargeheads = () => {
      if(!self.searchChargehead) return
      self.filteredChargeheads = self.chargeheads.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchChargehead.value.toLowerCase())>=0
      })
      self.paginate(self.filteredChargeheads, self.items_per_page)
      self.pageDataItems = self.getPageData(self.filteredChargeheads, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.chargeheads.map(c => {
        if(c.chargehead_id != e.item.ch.chargehead_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.confirmEdit = (e) => {
      self.chargeheads.map(c => {
        if(c.chargehead_id != e.item.ch.chargehead_id){
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
      RiotControl.trigger('delete_chargehead', e.item.ch.chargehead_id)
    }

    self.edit = (e) => {
      if(!$("#editedChargeheadCode").val()){
        toastr.info("Please enter a valid chargehead Code and try again")
      }else if(!$("#editedChargehead").val()){
        toastr.info("Please enter a valid chargehead and try again")
      }else{
        self.loading = true
        RiotControl.trigger('edit_chargehead', e.item.ch.chargehead_id, $("#editedChargeheadCode").val(),$("#editedChargehead").val())
      }
    }

    self.add = () => {
      if(!self.addChargeheadCodeInput.value){
        toastr.info("Please enter a valid chargehead Code and try again")
      }else  if(!self.addChargeheadInput.value){
        toastr.info("Please enter a valid chargehead and try again")
      }else{
        self.loading = true
        RiotControl.trigger('add_chargehead', self.addChargeheadCodeInput.value, self.addChargeheadInput.value)
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
      self.chargeheads.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    RiotControl.on('chargeheads_changed', function(chargeheads) {
      self.addChargeheadCodeInput.value = ''
      self.addChargeheadInput.value = ''
      self.loading = false
      self.chargeheads = chargeheads
      self.filteredChargeheads = chargeheads
      self.items_per_page = 10
      
      self.callPaging()
      self.update()
    })

    self.callPaging=()=>{
      self.paginate(self.filteredChargeheads, self.items_per_page)
      self.pageDataItems = self.getPageData(self.filteredChargeheads, 1, self.items_per_page)
    }
     
   /*sorting Starts*/  
    self.sortByChargeHead = () =>{
      console.log('calling sortByChargeHead')

      if(self.sortCHead==true){
        self.chargeheads.sort(function(a, b) {
          return (a.chargehead.toUpperCase()).localeCompare((b.chargehead.toUpperCase()));
        });
      }else{
        self.chargeheads.reverse()
      }
 
      self.activeSort='sortCHead'      
      self.filteredChargeheads = self.chargeheads
      self.callPaging()
      
      self.update();
      self.sortCHead=!self.sortCHead
    }

    self.sortByCode = () =>{

      if(self.sortCode==true){
        self.chargeheads.sort(function(a, b) {
          return a.chargehead_code - b.chargehead_code;
        });
      }else{
        self.chargeheads.reverse()
      }

      self.activeSort='sortCode'
      self.filteredChargeheads = self.chargeheads
      self.callPaging()
      
      self.update();
      self.sortCode=!self.sortCode
    }
   
   /*sorting Ends*/


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
      self.current_page_no = 1
      self.update()
    }
    self.changePage = (e) => {
      self.pageDataItems = self.getPageData(self.filteredChargeheads, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredChargeheads, self.items_per_page)
      self.pageDataItems = self.getPageData(self.filteredChargeheads, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/



  </script>
</chargehead-master>
