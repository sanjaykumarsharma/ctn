<condition-master>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Conditions</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchCondition" class="form-control" placeholder="search" onkeyup={filterConditions} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshConditions}><i class="material-icons">refresh</i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">

      <tr class="input-row">
        <td colspan="2"><input type="text" name="addConditionInput" placeholder="Condition" class="form-control" onkeyup={addEnter}></td>
        <td class="two-buttons"><button class="btn btn-primary w-100" onclick={add}>Add</button></td>
      </tr>

      <tr>
        <th class="serial-col">#</th>
        <th onclick={sortByCondition} style="cursor: pointer;">
          Condition
           <hand if={activeSort=='sortTC'}>
            <i class="material-icons" show={sortTC}>arrow_upward</i> 
            <i class="material-icons" hide={sortTC}>arrow_downward</i>
           </hand>
        </th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={loc, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td if={!loc.confirmEdit && !loc.confirmDelete}>
          {loc.condition_name}
        </td>

        <td  if={loc.confirmDelete}><span class="delete-question">Are you sure?</span></td>
        <td if={loc.confirmEdit}>
          <input type="text" id="editedCondition"  class="form-control" value={loc.condition_name} onkeyup={editEnter.bind(this)}>
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
      self.sortTC = true
      self.activeSort='';
      self.update()
      //RiotControl.trigger('login_init')
      RiotControl.trigger('read_conditions')
    })

    // RiotControl.on('login_changed', function(login_status) {
    //   if(!login_status.role || login_status.role == 'FAIL'){
    //     riot.route("/home")
    //   }
    // })

    self.refreshConditions = () => {
      self.conditions = []
      self.searchCondition.value;
      RiotControl.trigger('read_conditions')
    }

    self.filterConditions = () => {
      if(!self.searchCondition) return
      self.filteredConditions = self.conditions.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchCondition.value.toLowerCase())>=0
      })
      self.paginate(self.filteredConditions, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredConditions, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.conditions.map(c => {
        if(c.condition_id != e.item.loc.condition_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.confirmEdit = (e) => {
      self.conditions.map(c => {
        if(c.condition_id != e.item.loc.condition_id){
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
      RiotControl.trigger('delete_condition', e.item.loc.condition_id)
    }

    self.edit = (e) => {
      if(!$("#editedCondition").val()){
        toastr.info("Please enter a valid Term & Condition and try again")
      }else{
        self.loading = true
        RiotControl.trigger('edit_condition', e.item.loc.condition_id, $("#editedCondition").val())
      }
    }

    self.add = () => {
      if(!self.addConditionInput.value){
        toastr.info("Please enter a valid Term & Condition and try again")
      }else{
        self.loading = true
        RiotControl.trigger('add_condition', self.addConditionInput.value)
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
      self.conditions.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    RiotControl.on('conditions_changed', function(conditions) {
      self.addConditionInput.value = ''
      self.loading = false
      self.conditions = conditions
      self.filteredConditions = conditions

      self.items_per_page = 10
      self.paginate(self.filteredConditions, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredConditions, 1, self.items_per_page)
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
      self.pagedDataItems = self.getPageData(self.filteredConditions, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredConditions, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredConditions, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/

    /*sorting Starts*/  
    self.sortByCondition = () =>{

      if(self.sortTC==true){
        self.conditions.sort(function(a, b) {
          return (a.condition_name.toUpperCase()).localeCompare((b.condition_name.toUpperCase()));
        });
      }else{
        self.conditions.reverse()
      }
 
      self.activeSort='sortTC'      
      self.filteredConditions = self.conditions
      

      self.paginate(self.filteredConditions, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredConditions, 1, self.items_per_page)
      
      self.update();
      self.sortTC=!self.sortTC
    }
   
   /*sorting Ends*/

  </script>
</condition-master>
