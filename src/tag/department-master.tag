<department-master>
<loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Departments</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchDepartment" class="form-control" placeholder="search" onkeyup={filterDepartments} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshDepartments}><i class="material-icons">refresh</i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">

      <tr class="input-row">
        <td colspan="2"><input type="text" name="addDepartmentCodeInput" placeholder="Code" class="form-control" onkeyup={addEnter}></td>
        <td><input type="text" name="addDepartmentInput" placeholder="Department" class="form-control" onkeyup={addEnter}></td>
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
        <th onclick={sortByDept} style="cursor: pointer;">
          Department
          <hand if={activeSort=='sortDept'}>
            <i class="material-icons" show={sortDept}>arrow_upward</i> 
            <i class="material-icons" hide={sortDept}>arrow_downward</i>
          </hand> 
        </th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={dept, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>

        <td if={!dept.confirmEdit && !dept.confirmDelete}>
          {dept.department_code}
        </td>
        <td if={!dept.confirmEdit && !dept.confirmDelete}>
          {dept.department}
        </td>

        <td colspan="2" if={dept.confirmDelete}><span class="delete-question">Are you sure?</span></td>

        <td if={dept.confirmEdit}>
          <input type="text" id="editedDepartmentCode" autofocus class="form-control" value={dept.department_code} onkeyup={editEnter.bind(this)}>
        </td>
        <td if={dept.confirmEdit}>
          <input type="text" id="editedDepartment"  class="form-control" value={dept.department} onkeyup={editEnter.bind(this)}>
        </td>


        <td>
          <div class="table-buttons" hide={dept.confirmDelete ||  dept.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmEdit}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
          </div>
          <div class="table-buttons" if={dept.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
          <div class="table-buttons" if={dept.confirmEdit}>
            <button disabled={loading} class="btn btn-primary btn-sm" onclick={edit}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
        </td>
      </tr>
      <tfoot class="no-print">
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
      self.sortDept = true
      self.sortCode = true
      self.activeSort='';
      self.update()
      self.items_per_page = 10
      //RiotControl.trigger('login_init')
      RiotControl.trigger('read_departments')
      console.log('here')
    })

    self.refreshDepartments = () => {
      self.departments = []
      self.searchDepartment.value;
      RiotControl.trigger('read_departments')
    }

    self.filterDepartments = () => {
      if(!self.searchDepartment) return
      self.filteredDepartments = self.departments.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchDepartment.value.toLowerCase())>=0
      })

      self.paginate(self.filteredDepartments, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.departments.map(c => {
        if(c.department_id != e.item.dept.department_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.confirmEdit = (e) => {
      self.departments.map(c => {
        if(c.department_id != e.item.dept.department_id){
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
      RiotControl.trigger('delete_department', e.item.dept.department_id)
    }

    self.edit = (e) => {
      if(!$("#editedDepartmentCode").val()){
        toastr.info("Please enter a valid department Code and try again")
      }else if(!$("#editedDepartment").val()){
        toastr.info("Please enter a valid department and try again")
      }else{
        self.loading = true
        RiotControl.trigger('edit_department', e.item.dept.department_id, $("#editedDepartmentCode").val(),$("#editedDepartment").val())
      }
    }

    self.add = () => {
      if(!self.addDepartmentCodeInput.value){
        toastr.info("Please enter a valid department Code and try again")
      }else  if(!self.addDepartmentInput.value){
        toastr.info("Please enter a valid department and try again")
      }else{
        self.loading = true
        RiotControl.trigger('add_department', self.addDepartmentCodeInput.value, self.addDepartmentInput.value)
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
      self.departments.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    RiotControl.on('departments_changed', function(departments) {
      self.addDepartmentCodeInput.value = ''
      self.addDepartmentInput.value = ''
      self.loading = false
      self.departments = departments
      self.filteredDepartments = departments

      self.callPaging()

      self.update()
    })

     self.callPaging=()=>{
      self.paginate(self.filteredDepartments, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page)
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
      self.pagedDataItems = self.getPageData(self.filteredDepartments, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredDepartments, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredDepartments, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/

    /*sorting Starts*/  
    self.sortByDept = () =>{
      console.log('calling sortByDept')

      if(self.sortDept==true){
        self.departments.sort(function(a, b) {
          return (a.department.toUpperCase()).localeCompare((b.department.toUpperCase()));
        });
      }else{
        self.departments.reverse()
      }
 
      self.activeSort='sortDept'      
      self.filteredDepartments = self.departments
      self.callPaging()
      
      self.update();
      self.sortDept=!self.sortDept
    }

    self.sortByCode = () =>{

      if(self.sortCode==true){
        self.departments.sort(function(a, b) {
          return a.department_code - b.department_code;
        });
      }else{
        self.departments.reverse()
      }

      self.activeSort='sortCode'
      self.filteredDepartments = self.departments
      self.callPaging()
      
      self.update();
      self.sortCode=!self.sortCode
    }
   
   /*sorting Ends*/

  </script>
</department-master>
