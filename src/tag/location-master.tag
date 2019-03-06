<location-master>
  <loading-bar if={loading}></loading-bar>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Locations</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchLocation" class="form-control" placeholder="search" onkeyup={filterLocations} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshLocations}><i class="material-icons">refresh</i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">

      <tr class="input-row">
        <td colspan="2"><input type="text" name="addLocationCodeInput" placeholder="Code" class="form-control" onkeyup={addEnter}></td>
        <td><input type="text" name="addLocationInput" placeholder="Location" class="form-control" onkeyup={addEnter}></td>
        <td class="two-buttons"><button class="btn btn-primary w-100" onclick={addLocation}>Add</button></td>
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
        <th onclick={sortByLocation} style="cursor: pointer;">
          Location
           <hand if={activeSort=='sortlocation'}>
            <i class="material-icons" show={sortlocation}>arrow_upward</i> 
            <i class="material-icons" hide={sortlocation}>arrow_downward</i>
           </hand>
        </th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={loc, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>

        <td if={!loc.confirmEdit && !loc.confirmDelete}>
          {loc.location_code}
        </td>
        <td if={!loc.confirmEdit && !loc.confirmDelete}>
          {loc.location}
        </td>

        <td colspan="2" if={loc.confirmDelete}><span class="delete-question">Are you sure?</span></td>

        <td if={loc.confirmEdit}>
          <input type="text" id="editedLocationCode" autofocus class="form-control" value={loc.location_code} onkeyup={editEnter.bind(this)}>
        </td>
        <td if={loc.confirmEdit}>
          <input type="text" id="editedLocation"  class="form-control" value={loc.location} onkeyup={editEnter.bind(this)}>
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
      self.sortlocation = true
      self.sortCode = true
      self.activeSort='';
      self.update()
      RiotControl.trigger('read_locations')
    })

    // RiotControl.on('login_changed', function(login_status) {
    //   if(!login_status.role || login_status.role == 'FAIL'){
    //     riot.route("/home")
    //   }
    // })

    self.refreshLocations = () => {
      self.locations = []
      self.searchLocation.value;
      RiotControl.trigger('read_locations')
    }

    self.filterLocations = () => {
      if(!self.searchLocation) return
      self.filteredLocations = self.locations.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchLocation.value.toLowerCase())>=0
      })
      self.paginate(self.filteredLocations, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page)
    }

    self.confirmDelete = (e) => {
      self.locations.map(c => {
        if(c.location_id != e.item.loc.location_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.confirmEdit = (e) => {
      self.locations.map(c => {
        if(c.location_id != e.item.loc.location_id){
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
      RiotControl.trigger('delete_location', e.item.loc.location_id)
    }

    self.edit = (e) => {
      if(!$("#editedLocationCode").val()){
        toastr.info("Please enter a valid location Code and try again")
      }else if(!$("#editedLocation").val()){
        toastr.info("Please enter a valid location and try again")
      }else{
        self.loading = true
        RiotControl.trigger('edit_location', e.item.loc.location_id, $("#editedLocationCode").val(),$("#editedLocation").val())
      }
    }

    self.addLocation = () => {
      console.log('calling ad location')
      if(!self.addLocationCodeInput.value){
        toastr.info("Please enter a valid location Code and try again")
      }else  if(!self.addLocationInput.value){
        toastr.info("Please enter a valid location and try again")
      }else{
        self.loading = true
        RiotControl.trigger('add_location', self.addLocationCodeInput.value, self.addLocationInput.value)
      }
    }

    self.addEnter = (e) => {
      if(e.which == 13){
        self.addLocation()
      }
    }

    self.editEnter = (e) => {
      if(e.which == 13){
        self.edit(e)
      }  
    }

    self.cancelOperation = (e) => {
      self.locations.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
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
      self.pagedDataItems = self.getPageData(self.filteredLocations, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredLocations, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/

    RiotControl.on('locations_changed', function(locations) {
      self.addLocationCodeInput.value = ''
      self.addLocationInput.value = ''
      self.loading = false
      self.locations = locations
      self.filteredLocations = locations
      
      self.items_per_page = 10
      self.callPaging()
      self.update()
    })

    self.callPaging=()=>{
      self.paginate(self.filteredLocations, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredLocations, 1, self.items_per_page)
    }

    /*sorting Starts*/  
    self.sortByLocation = () =>{

      if(self.sortlocation==true){
        self.locations.sort(function(a, b) {
          return (a.location.toUpperCase()).localeCompare((b.location.toUpperCase()));
        });
      }else{
        self.locations.reverse()
      }
 
      self.activeSort='sortlocation'      
      self.filteredLocations = self.locations
      self.callPaging()
      
      self.update();
      self.sortlocation=!self.sortlocation
    }

    self.sortByCode = () =>{

      if(self.sortCode==true){
        self.locations.sort(function(a, b) {
          return (a.location_code.toUpperCase()).localeCompare((b.location_code.toUpperCase()));
        });
      }else{
        self.locations.reverse()
      }

      self.activeSort='sortCode'
      self.filteredLocations = self.locations
      self.callPaging()
      
      self.update();
      self.sortCode=!self.sortCode
    }
   
   /*sorting Ends*/

  </script>
</location-master>
