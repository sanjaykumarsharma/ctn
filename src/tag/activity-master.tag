<activity-master>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <h1>Activities</h1>
      </div>
      <div class="col-sm-6 text-xs-right">
        <div class="form-inline">
          <input type="search" name="searchActivity" class="form-control" placeholder="search" onkeyup={filterCategories} style="width:200px">
          <button class="btn btn-secondary" disabled={loading} onclick={refreshActivities}><i class="material-icons">refresh</i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-12">
    <table class="table table-bordered">
      <tr class="input-row">
        <td colspan="2"><input type="text" name="addActivityInput" placeholder="Add new Activity" class="form-control" onkeyup={addEnter}></td>
        <td class="two-buttons"><button class="btn btn-primary w-100" onclick={add}>Add</button></td>
      </tr>
      <tr>
        <th class="serial-col">#</th>
        <th>Activity</th>
        <th class="two-buttons"></th>
      </tr>
      <tr each={activity, i in filteredCategories}>
        <td>{i+1}</td>
        <td>
          <virtual hide={activity.confirmDelete || activity.confirmEdit}>{activity.activity}</virtual>
          <virtual if={activity.confirmDelete}>Are you sure?</virtual>
          <virtual if={activity.confirmEdit}><input type="text" id="editedActivity" class="form-control" value={activity.activity} onkeyup={editEnter.bind(this, activity.activity_id)}></virtual>
        </td>
        <td>
          <div class="table-buttons" hide={activity.confirmDelete ||  activity.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmEdit}><i class="material-icons">create</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={confirmDelete}><i class="material-icons">delete</i></button>
          </div>
          <div class="table-buttons" if={activity.confirmDelete}>
            <button disabled={loading} class="btn btn-danger btn-sm" onclick={delete}><i class="material-icons">done</i></button>
            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={cancelOperation}><i class="material-icons">clear</i></button>
          </div>
          <div class="table-buttons" if={activity.confirmEdit}>
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
      RiotControl.trigger('read_activities')
    })

    // RiotControl.on('login_changed', function(login_status) {
    //   if(!login_status.role || login_status.role == 'FAIL'){
    //     riot.route("/home")
    //   }
    // })

    self.refreshActivities = () => {
      self.activities = []
      self.searchActivity.value;
      RiotControl.trigger('read_activities')
    }

    self.filterCategories = () => {
      if(!self.searchActivity) return
      self.filteredCategories = self.activities.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchActivity.value.toLowerCase())>=0
      })
    }

    self.confirmDelete = (e) => {
      self.activities.map(c => {
        if(c.activity_id != e.item.activity.activity_id){
          c.confirmDelete = false
          c.confirmEdit = false
        }else{
          c.confirmDelete = true
          c.confirmEdit = false
        }
      })
    }

    self.confirmEdit = (e) => {
      self.activities.map(c => {
        if(c.activity_id != e.item.activity.activity_id){
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
      RiotControl.trigger('delete_activity', e.item.activity.activity_id)
    }

    self.edit = (e) => {
      console.log(self)
      if(!$("#editedActivity").val()){
        toastr.info("Please enter a valid activity and try again")
      }else{
        self.loading = true
        RiotControl.trigger('edit_activity', e.item.activity.activity_id, $("#editedActivity").val())
      }
    }

    self.add = () => {
      if(!self.addActivityInput.value){
        toastr.info("Please enter a valid activity and try again")
      }else{
        self.loading = true
        RiotControl.trigger('add_activity', self.addActivityInput.value)
      }
    }

    self.addEnter = (e) => {
      if(e.which == 13){
        self.add()
      }
    }

    self.editEnter = (a, e) => {
      if(e.which == 13){
        if(!$("#editedActivity").val()){
          toastr.info("Please enter a valid activity and try again")
        }else{
          self.loading = true
          RiotControl.trigger('edit_activity', e.item.activity.activity_id, $("#editedActivity").val())
        }
      }
    }

    self.cancelOperation = (e) => {
      self.activities.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    RiotControl.on('activities_changed', function(activities) {
      self.addActivityInput.value = ''
      self.loading = false
      self.activities = activities
      self.filteredCategories = activities
      self.update()
    })

  </script>
</activity-master>
