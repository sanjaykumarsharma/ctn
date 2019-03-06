<item-subgroup-master>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Item Subgroups</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchItemSubgroup" class="form-control" placeholder="search" onkeyup={filterItemSubgroups} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshItemSubgroups}><i class="material-icons">refresh</i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">
      <tr class="input-row">
        <td colspan="2">
          <div class="form-inline">
            <div class="form-group">
              <label>Item Group</label>
              <select name="addItemGroup" class="form-control">
                <option each={item_groups} value={item_group_id}>{item_group}</option>
              </select>
            </div>
          </div>
        </td>
        <td><input type="text" name="addItemSubgroupInput" placeholder="Add new ItemSubgroup" class="form-control" onkeyup={addEnter}></td>
        <td class="two-buttons"><button class="btn btn-primary w-100" onclick={add}>Add</button></td>
      </tr>
      <tr>
        <th class="serial-col">#</th>
        <th>Item Group</th>
        <th>Item Subgroup</th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={item_subgroup, i in filteredItemSubgroups}>
        <td>{i+1}</td>
        <td if={!item_subgroup.confirmEdit && !item_subgroup.confirmDelete}>
          {item_subgroup.item_group}
        </td>
        <td if={!item_subgroup.confirmEdit && !item_subgroup.confirmDelete}>
          {item_subgroup.item_subgroup}
        </td>
        <td colspan="2" if={item_subgroup.confirmDelete}><span class="delete-question">Are you sure?</span></td>
        <td if={item_subgroup.confirmEdit}>
          <select id="editedItemGroup" class="form-control">
            <option each={item_groups} value={item_group_id} selected={item_group_id === item_subgroup.item_group_id}>{item_group}</option>
          </select>
        </td>
        <td if={item_subgroup.confirmEdit}><input type="text" id="editedItemSubgroup" class="form-control" value={item_subgroup.item_subgroup} onkeyup={editEnter.bind(this, item_subgroup.item_subgroup_id)}></td>
        <td>
          <div class="table-buttons" hide={item_subgroup.confirmDelete ||  item_subgroup.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmEdit}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
          </div>
          <div class="table-buttons" if={item_subgroup.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
          <div class="table-buttons" if={item_subgroup.confirmEdit}>
            <button disabled={loading} class="btn btn-primary btn-sm" onclick={edit}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
        </td>
      </tr>
    </table>
  </div>
  <script>
    var self = this
    self.on("mount", function(){
      RiotControl.trigger('login_init')
      RiotControl.trigger('read_item_groups')
      RiotControl.trigger('read_item_subgroups')
    })

    // RiotControl.on('login_changed', function(login_status) {
    //   if(!login_status.role || login_status.role == 'FAIL'){
    //     riot.route("/home")
    //   }
    // })

    self.refreshItemSubgroups = () => {
      self.item_subgroups = []
      self.searchItemSubgroup.value;
      RiotControl.trigger('read_item_subgroups')
    }

    self.filterItemSubgroups = () => {
      if(!self.searchItemSubgroup) return
      self.filteredItemSubgroups = self.item_subgroups.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchItemSubgroup.value.toLowerCase())>=0
      })
    }

    self.confirmDelete = (e) => {
      self.item_subgroups.map(c => {
        if(c.item_subgroup_id != e.item.item_subgroup.item_subgroup_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.confirmEdit = (e) => {
      self.item_subgroups.map(c => {
        if(c.item_subgroup_id != e.item.item_subgroup.item_subgroup_id){
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
      RiotControl.trigger('delete_item_subgroup', e.item.item_subgroup.item_subgroup_id)
    }

    self.edit = (e) => {
      if(!$("#editedItemGroup").val()){
        toastr.info("Please choose item group and try again")
      }else if(!$("#editedItemSubgroup").val()){
        toastr.info("Please enter a valid item_subgroup and try again")
      }else{
        self.loading = true
        RiotControl.trigger('edit_item_subgroup', e.item.item_subgroup.item_subgroup_id, $("#editedItemGroup").val(), $("#editedItemSubgroup").val())
      }
    }

    self.add = () => {
      if(!self.addItemGroup.value){
        toastr.info("Please choose item group and try again")
      }else if(!self.addItemSubgroupInput.value){
        toastr.info("Please enter a valid item subgroup and try again")
      }else{
        self.loading = true
        RiotControl.trigger('add_item_subgroup', self.addItemGroup.value, self.addItemSubgroupInput.value)
      }
    }

    self.addEnter = (e) => {
      if(e.which == 13){
        self.add()
      }
    }

    self.editEnter = (a, e) => {
      if(e.which == 13){
        if(!$("#editedItemGroup").val()){
          toastr.info("Please enter item group and try again")
        }else if(!$("#editedItemSubgroup").val()){
          toastr.info("Please enter a valid item_subgroup and try again")
        }else{
          self.loading = true
          RiotControl.trigger('edit_item_subgroup', e.item.item_subgroup.item_subgroup_id, $("#editedItemGroup").val(), $("#editedItemSubgroup").val())
        }
      }
    }

    self.cancelOperation = (e) => {
      self.item_subgroups.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    RiotControl.on('item_subgroups_changed', function(item_subgroups) {
      self.addItemSubgroupInput.value = ''
      self.loading = false
      self.item_subgroups = item_subgroups
      self.filteredItemSubgroups = item_subgroups
      self.update()
    })
    RiotControl.on('item_groups_changed', function(item_groups) {
      self.item_groups = item_groups
      self.update()
    })

  </script>
</item-subgroup-master>
