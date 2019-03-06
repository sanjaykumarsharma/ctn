<indents>
<loading-bar if={loading}></loading-bar>
 <div show={indent_view =='indent_home'}>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group row">
          <h1 for="selectIndentStatus" class="col-xs-3 col-form-label">Indent</h1>
          <div class="col-xs-9" style="padding-top: 12px;">
            <select name="selectIndentStatus" onchange={refreshIndents} class="form-control">
              <option value=""></option>
              <option value="A">Approved</option>
              <option value="P">Pending</option>
              <option value="R">Rejected</option>
              <option value="F">Finalized</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-sm-6 text-xs-right" style="padding-top: 12px;">
        <div class="form-inline">
          <input type="search" name="searchIndent" class="form-control" placeholder="search" style="width:200px">
          <!-- <input type="search" name="searchIndent" class="form-control" placeholder="search" onkeyup={filterIndentes} style="width:200px"> -->
          <button class="btn btn-secondary" disabled={loading} onclick={refreshIndents}><i class="material-icons">refresh</i></button>

          <button class="btn btn-secondary" disabled={loading} onclick={showIndentModal}><i class="material-icons">add</i></button>

        </div>
      </div>
    </div>
  </div>
			
  <div class="col-sm-12">
    <table class="table table-bordered">
      <tr>
        <th class="serial-col">Sl</th>
        <th>Indent No</th>
        <th>Indent Date</th>
        <th>Department</th>
        <th>Stock Type</th>
        <th>Indent Type</th>
        <th>Status</th>
        <th>Approved By</th>
        <th>Finalized By</th>
        <th style="width:175px"></th>
      </tr>
      <tr each={cat, i in pagedDataItems}>
        <td>{(current_page_no-1)*items_per_page + i + 1}</td>
        <td>{cat.stock_type_code}-{cat.indent_no}</td>
        <td>{cat.indent_date}</td>
        <td>{cat.department}</td>
        <td>{cat.stock_type}</td>
        <td>{cat.indent_type_view}</td>
        <td>{cat.status}</td>
        <td>{cat.approved_by}</td>
        <td>{cat.finalized_by}</td>
        <td>
          <div class="table-buttons" hide={cat.confirmDelete ||  cat.confirmEdit}>
            <button disabled={loading} class="btn btn-secondary btn-sm" hide={cat.status=='F'} onclick={editIndentStatus.bind(this, cat)}><i class="material-icons">build</i></button>

            <button disabled={loading} class="btn btn-secondary btn-sm" onclick={viewIndent.bind(this, cat)}><i class="material-icons">visibility</i></button>

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
          <td colspan="10">
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
 </div> <!-- indent home end -->

 <div show={indent_view =='add_indent'}>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6"><h4>{title} Indent</h4></div>
      <div class="col-sm-6">
        <button class="btn btn-secondary pull-sm-right" onclick={closeAddIndent}><i class="material-icons">close</i></button>
      </div>
    </div>
    <form>
    	 <div class="row">
    	    <div class="col-sm-3">
    	      <div class="form-group">
  		    <label for="indentDateInput">Indent Date</label>
          <input type="text" class="form-control" id="indentDateInput" placeholder="DD/MM/YYYY">
  		  </div>
    	    </div>
    	 	<div class="col-sm-3">
    	      <div class="form-group">
  		    <label for="departmentInput">Department</label>
  		    <select id="departmentInput" class="form-control">
  	          <option each={departments} value={department_code}>{department}</option>
  	        </select>
  		  </div>
    	    </div>
    	    <div class="col-sm-3">
    	      <div class="form-group">
  		    <label for="stockTypeInput">Stock Type</label>
  		    <select id="stockTypeInput" name="stockTypeInput" class="form-control" onchange={changeStockType}>
              <option></option>
  	          <option each={stock_types} value={stock_type_code}>{stock_type}</option>
  	        </select>
  		  </div>	
    	    </div>
    	    <div class="col-sm-3">
    	     <div class="form-group">
  		    <label for="indentTypeInput">Indent Type</label>
  		    <select id="indentTypeInput" class="form-control">
  	          <option value="N">Normal</option>
  	          <option value="U">Urgent</option>
  	          <option value="VU">Very Urgent</option>
  	        </select>
  		  </div>
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
  	        <select name="selectStockTypeFilter" class="form-control" style="min-width:250px" disabled>
              <option></option>
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
  	        <button type="button" class="btn btn-primary" onclick={getMaterialForIndent} style="margin-top: 32px;">Get Material</button>
  	      </div>
  	    </div>
  	   </div>
  					
      <div class="row">
        <div class="col-sm-3">
          <div class="form-group">
            <label>Indent No: </label>{indent_no_add}
          </div>
        </div>  
        
      </div>    
        			
  	 <div class="row">
  	  <table class="table table-bordered">
  	      <tr>
  	        <th class="serial-col">Sl</th>
  	        <th>Material</th>
  	        <th>UOM</th>
  	        <th>Qty</th>
  	        <th>Unit Value</th>
  	        <th>Total Value</th>
  	        <th>Delivery Date</th>
            <th>Stock</th>
            <th>LP Price</th>
            <th>LP Party</th>
  	        <th>LP Qty</th>
  	        <th>Remarks</th>
  	        <th></th>
  	      </tr>
  	      <tr each={cat, i in selectedMaterialsArray}>
  	        <td>{i+1}</td>
  	        <td>{cat.item_name}</td>
  	        <td>{cat.uom_code}</td>
  	        <td>
              <input type="text"  id="{ 'qtyInput' + cat.item_id }" value={cat.qty} onkeyup={calculateTotalValue.bind(this,cat)} class="form-control"/>
            </td>
  	        <td>
              <input type="text"  id="{ 'unitValueInput' + cat.item_id }" value={cat.unit_value} onkeyup={calculateTotalValue.bind(this,cat)} class="form-control"/>
            </td>
  	        <td>{cat.total_value}</td>
  	        <td>
              <input type="text" id="{ 'deliveryDateInput' + cat.item_id }" value={cat.delivery_date} class="form-control" placeholder="DD/MM/YYYY" />
            </td>
            <td>{cat.stock}</td>
            <td>{cat.lp_price}</td>
            <td>{cat.party_name}</td>
  	        <td>{cat.lp_qty}</td>
  	        <td>
              <input type="text" id="{ 'remarksInput' + cat.item_id }"  value={cat.remarks} class="form-control" />
            </td>
  	        <td>
              <button class="btn btn-secondary" disabled={loading} onclick={removeSelectedMaterial.bind(this, cat)}><i class="material-icons">remove</i></button>
            </td>
  	      </tr>
  	    </table>
  	 </div>

    </form>

    <div class="col-sm-12">
      <button type="button" class="btn btn-primary pull-sm-right" onclick={save}>Save changes</button>
    	<button type="button" class="btn btn-secondary pull-sm-right" onclick={closeAddIndent} style="    margin-right: 10px;">Close</button>
    </div>
  </div>
 </div> <!-- add_indent end -->


 <div show={indent_view =='view_indent'} class="container-fluid print-box">
    <center>
     <div style="font-size:17px;font-weight:bold">NTC INDUSTRIES LTD</div>
        149,Barrackpore Trunk Road<br>
        P.O. : Kamarhati, Agarpara<br>
        Kolkata - 700058<br>
        Indent Details<br><br>
   </center>

    <div class="row">
      <table class="table table-bordered bill-info-table">
        <tr>
          <th>Indent No</th>
          <td>{view_indent_details.stock_type_code}-{view_indent_details.indent_no}</td>
          <th style="width:150px;">Indent Date</th>
          <td>{view_indent_details.indent_date}</td>
        </tr>  
        <tr>
          <th>Stock Type</th>
          <td>{view_indent_details.stock_type}</td>
          <th>Indent Type</th>
          <td>{view_indent_details.indent_type}</td>
        <tr>  
        <tr>
          <th>Department</th>
          <td>{view_indent_details.department}</td>
        </tr>  
      </table>   
    </div>  
                
   <div class="row">
    <table class="table table-bordered bill-info-table print-small">
        <tr>
          <th class="serial-col"><strong>Sl</strong></th>
          <th><strong>Material</strong></th>
          <th><strong>UOM</strong></th>
          <th><strong>Qty</strong></th>
          <th><strong>Unit Value</strong></th>
          <th><strong>Total Value</strong></th>
          <th><strong>Delivery Date</strong></th>
          <th><strong>Stock</strong></th>
          <th><strong>LP Price</strong></th>
          <th><strong>LP Qty</strong></th>
          <th><strong>LP Docket</strong></th>
          <th><strong>LP Party</strong></th>
          <th><strong>Remarks</strong></th>
        </tr>
        <tr each={vm, i in viewMaterialsArray}>
          <td>{i+1}</td>
          <td>{vm.item_name}-(Code No:{vm.item_id})</td>
          <td>{vm.uom_code}</td>
          <td>{vm.qty}</td>
          <td>{vm.unit_value}</td>
          <td>{vm.total_value}</td>
          <td>{vm.delivery_date}</td>
          <td>{vm.stock}</td>
          <td>{vm.lp_price}</td>
          <td>{vm.lp_qty}</td>
          <td>{vm.stock_type_code}-{vm.docket_no}</td>
          <td>{vm.party_name}</td>
          <td>{vm.remarks}</td>
        </tr>
      </table>
   </div>
   
   <br><br>
   <table class="table indent-footer">
     <tr>
       <td><center style="height:21px">{view_indent_details.requested_by}</center><div><center>Prepared By</center></div></td>
       <td><center style="height:21px"></center><div><center>Indent By</center></div></td>
       <td><center style="height:21px">{view_indent_details.approved_by}</center><div><center>Approved By</center></div></td>
       <!-- <td><center style="height:21px">{view_indent_details.finalized_by}</center><div><center>Finalized By</center></div></td> -->
     </tr>
   </table>

  <div class="col-sm-12 no-print">
    <button type="button" class="btn btn-secondary pull-sm-right" onclick={closeviewIndent} style="    margin-right: 10px;">Close</button>
  </div>

 </div> <!-- view_indent end -->


  <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">Select Materiala</h4>

          <div class="text-xs-right form-inline" >
              <input type="search" name="searchMaterials" class="form-control" placeholder="search" onkeyup={filterMaterials} style="width:200px">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" onclick={selectedMaterial}>Submit</button>
          </div>
        </div>
        <div class="modal-body">
        
          <table class="table table-bordered">
		      <tr>
		        <th class="serial-col">Sl</th>
		        <th style="width:75px"></th>
		        <th>Material</th>
		        <th>Group</th>
		      </tr>
		      <tr each={it, i in pagedDataMaterials} no-reorder>
		        <td>{(current_page_no_new-1)*items_per_page_new + i + 1}</td>
		        <td><input type="checkbox" class="form-control"  checked={it.selected} onclick="{parent.toggle}"></td>
		        <td>{it.item_name}-(Code:{it.item_id})</td>
		        <td>{it.item_group}</td>
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
  
  <div class="modal fade" id="indentStatusModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">Change Indent Status</h4>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="indentStatusInput">Status</label>
              <select id="indentStatusInput" class="form-control">
                <option value=""></option>
                <option each={indentStatusArray} value={status_value}>{status}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="statusChangeDateInput">Date</label>
              <input type="text" id="statusChangeDateInput" class="form-control" placeholder="DD/MM/YYYY">
            </div>
            <div class="form-group">
              <label>Authority Name</label>
              <input type="text" id="statusChangeAuthorityNameInput" class="form-control" disabled>
            </div>
            <div class="form-group">
              <label for="statusChnageRemarkInput">Remarks</label>
              <input type="text" id="statusChnageRemarkInput" class="form-control">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick={saveIndentStatus}>Save changes</button>
        </div>
      </div>
    </div>
  </div><!-- change indent modal status end --> 


  <script>
    var self = this
    self.on("mount", function(){
      self.items_per_page = 10
      RiotControl.trigger('login_init')
      RiotControl.trigger('read_departments_for_indent')
      RiotControl.trigger('read_stock_types')


      RiotControl.trigger('read_item_groups')
      //RiotControl.trigger('read_categories')
      //RiotControl.trigger('read_uoms')
      //RiotControl.trigger('read_parties')
      RiotControl.trigger('fetch_user_details_from_session_for_indent')
      self.indent_view='indent_home'
      self.selectedMaterialsArray=[]
      self.indentStatusArray=[{status_value: "A",status: "Approved"},
                              {status_value: "P",status: "Pending"},
                              {status_value: "R",status: "Rejected"},
                              {status_value: "F",status: "Finalized"}
                             ]

      $(document).keypress(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
          e.preventDefault();
          console.log('no action')
          return false;
        }
      });        

      /*$("#departmentInput").on("focus",function() {
          $("#departmentInput").simulate('mousedown');
      }); 

      $("#stockTypeInput").on("focus",function() {
          $("#stockTypeInput").simulate('mousedown');
      });      

      $("#indentTypeInput").on("focus",function() {
          $("#indentTypeInput").simulate('mousedown');
      }); */              

    })
     
     self.changeStockType = () => {
      if(self.title=='Add'){
       self.selectStockTypeFilter.value=self.stockTypeInput.value 
      }
      RiotControl.trigger('read_indent_no',self.stockTypeInput.value)
     }

     self.getMaterialForIndent = () => {
      self.materials = []
      if(self.searchMaterialInput.value==''){
        if(self.selectItemGroupFilter.value==''){
          toastr.info("Please select Item Group and try again")
          return;
        }
        if(self.selectStockTypeFilter.value==''){
          toastr.info("Please select Stock Type and try again")
          return;
        }
        self.loading=true
        RiotControl.trigger('read_items_for_indent',self.selected_item_group_code,self.selectStockTypeFilter.value)
      }else{
        if(self.selectStockTypeFilter.value==''){
          toastr.info("Please select Stock Type and try again")
          return;
        }
        self.loading=true
        RiotControl.trigger('search_items_for_indent',self.searchMaterialInput.value,self.selectStockTypeFilter.value)
      }
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
           m.stock=m.stock
           m.selected=item.selected

           m.qty=''
           m.unit_value=''
           m.total_value=''
           m.delivery_date=''
           m.party=''
           m.remarks=''

          }
          m.confirmEdit = false
          return m
        })
        return true*/
    }
    
    self.selectedMaterial = () => {
       self.materials.map(m => {
          if(m.selected){
              self.selectedMaterialsArray.push(m)
          }
       })

       $("#itemModal").modal('hide') 
       self.update()

       // date element formating
       self.selectedMaterialsArray.map(m => {
          let deliveryDateInput= 'deliveryDateInput'+m.item_id
          dateFormat(deliveryDateInput)
       })
    }

    self.removeSelectedMaterial = (i,e) => { 
      let tempSelectedMaterialsArray = self.selectedMaterialsArray.filter(c => {
        return c.item_id != i.item_id
      })

      self.selectedMaterialsArray=tempSelectedMaterialsArray

    }  

    self.calculateTotalValue = (item, e) => {
      self.selectedMaterialsArray.map(i=>{
        if(item.item_id==i.item_id){
          let unitValueInput= '#unitValueInput'+i.item_id
          let qtyInput= '#qtyInput'+i.item_id

          i.total_value= Number(Number($(unitValueInput).val()) * Number($(qtyInput).val())).toFixed(2)
          i.qty=$(qtyInput).val()
          i.unit_value=$(unitValueInput).val()

        }
      })
      //console.log(self.selectedMaterialsArray)
    }

    self.refreshIndents = () => {
      if(!self.selectIndentStatus.value){
        toastr.info("Please select Indent Status and try again")
        return
      }
      self.indents = []
      //self.searchIndent.value=''
      self.loading=true
      RiotControl.trigger('read_indents',self.selectIndentStatus.value,self.searchIndent.value)
    }

    /*self.filterIndentes = () => {
      if(!self.searchIndent) return
      self.filteredIndents = self.indents.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchIndent.value.toLowerCase())>=0
      })

      self.paginate(self.filteredIndents, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredIndents, 1, self.items_per_page)
    }*/

    self.confirmDelete = (e) => {
      self.indents.map(c => {
        if(c.indent_id != e.item.cat.indent_id){
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
      RiotControl.trigger('delete_indent', e.item.cat.indent_id)
    }

    self.edit = (t,e) => {
      self.title='Edit'   
      RiotControl.trigger('read_edit_indents',t.indent_id)
      self.edit_indent_id=t.indent_id
    }

    self.save = () => {
      if(!self.indentDateInput.value){
        toastr.info("Please enter a indent date")
        return
      }

      let str=self.indentDateInput.value;
      var d = str.split("/");
      var indent_date = moment([d[2].trim()+d[1].trim()+d[0].trim()],'YYYYMMDD')
      var toDay=moment().format('YYYYMMDD')

      let from = moment(indent_date, 'YYYYMMDD'); 
      let to = moment(toDay, 'YYYYMMDD');     
      let differnece=to.diff(from, 'days')  

      if(differnece<0){
        toastr.error("Indent date can not be greater than today")
        return
      }
      

      if(self.selectedMaterialsArray.length==0){
        toastr.info("Please provide some materials")
        return
      }

      var count=0
      let error=''
      self.selectedMaterialsArray.map(i=>{
        count++
        
        let temp_qty = Number(i.qty)
        if(isNaN(temp_qty)){
          temp_qty = 0
        }

        if(temp_qty==0){
          error=error + " Please Enter a valid Qty"+count+", ";
        }

        let temp_unit_value = Number(i.unit_value)
        if(isNaN(temp_unit_value)){
          temp_unit_value = 0
        }

        if(temp_unit_value==0){
          error=error + " Please Enter a valid Unit Value"+count+", ";
        }
        
        let deliveryDateInput= '#deliveryDateInput'+i.item_id
        i.delivery_date=$(deliveryDateInput).val()

        let remarksInput= '#remarksInput'+i.item_id
        i.remarks=$(remarksInput).val()
        
      })
      

      if(error!=''){
        toastr.error(error)
        return
      }else{
        var obj={}
        obj['indent_date']=self.indentDateInput.value
        obj['department_code']=self.departmentInput.value
        obj['stock_type_code']=self.stockTypeInput.value
        obj['indent_type']=self.indentTypeInput.value

        if(self.title=='Add'){  //add data to database after validation
           self.loading = true
            RiotControl.trigger('add_indent', self.selectedMaterialsArray, obj)
        }else if(self.title=='Edit'){
           self.loading = true
           obj['indent_id']=self.indent_id
           RiotControl.trigger('edit_indent', self.selectedMaterialsArray, obj , self.edit_indent_id)
        }
      }   
      
    }

    self.cancelOperation = (e) => {
      self.indents.map(c => {
          c.confirmDelete = false
          c.confirmEdit = false
      })
    }

    self.showIndentModal = () => {
        self.title='Add'  
        self.indent_view='add_indent'
        self.selectedMaterialsArray=[]
        $('#stockTypeInput').prop('disabled', false);
        self.stockTypeInput.value=''
        self.indent_no_add=''
        $("#indentDateInput").prop( "disabled", false );
        self.update()
        dateFormat('indentDateInput')
    }

	  self.closeAddIndent = () => {
        self.indent_view='indent_home'
    }

    self.editIndentStatus = (t,e) => {
      dateFormat('statusChangeDateInput')
      
      //removing status from array
      let tempStatusArray = self.indentStatusArray.filter(c=>{
              return c.status_value!=self.selectIndentStatus.value
      })
      
      self.indentStatusArray=tempStatusArray
      $("#indentStatusModal").modal('show')  
      self.edit_indent_status_id=t.indent_id
      self.statusChangeAuthorityNameInput.value=self.user_name
    }

    self.viewIndent = (t,e) => {
      self.viewMaterialsArray=[]
      RiotControl.trigger('read_view_indents',t.indent_id)
    }

    self.closeviewIndent = (t,e) => {
      self.indent_view='indent_home' 
    }
    
    self.saveIndentStatus = () => {
      var obj={}
      obj['status_date']=self.statusChangeDateInput.value
      obj['authority_name']=self.statusChangeAuthorityNameInput.value
      obj['status_change_remarks']=self.statusChnageRemarkInput.value
      obj['status']=self.indentStatusInput.value
      obj['indent_id']=self.edit_indent_status_id
      RiotControl.trigger('edit_indent_status',obj)
    } 
    
    //changed method
    RiotControl.on('indents_changed', function(indents) {
      self.indent_view='indent_home'
      self.loading = false
      self.indents = indents
      self.filteredIndents = indents

      self.paginate(self.filteredIndents, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredIndents, 1, self.items_per_page)
      self.update()
    })

    RiotControl.on('indents_date_error', function() {
      self.loading = false
      toastr.error('Please Check indent date back date entry date not allowed')
    })
    
   RiotControl.on('item_groups_changed', function(item_groups) {
      /*self.item_groups = item_groups
      self.update()*/

       $('#selectItemGroupFilter').autocomplete({
        source: item_groups,
        select: function( event, ui ) {
          self.selected_item_group_code= ui.item.item_group_code
          console.log(self.selected_item_group_code)
        }
      });

      self.update()
    })

    /*RiotControl.on('categories_changed', function(categories) {
      self.categories = categories
      self.update()
    })*/

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })

    /*RiotControl.on('uoms_changed', function(uoms) {
      self.uoms = uoms
      self.update()
    })*/

    /*RiotControl.on('parties_changed', function(parties) {
      self.loading = false
      self.parties = parties
      self.update()
    })*/
    
    RiotControl.on('read_departments_for_indent_changed', function(departments) {
      self.departments = departments
      self.update()
    })

    
    self.filterMaterials = () => {
      if(!self.searchMaterials) return
      self.filteredMaterials = self.materials.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchMaterials.value.toLowerCase())>=0
      })

      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)
    }


    RiotControl.on('items_for_indent_changed', function(items) {
      self.items_per_page_new = 10
      self.loading = false
      self.materials = []
      let tempMaterials = []
      
      if (self.selectedMaterialsArray.length==0) {
        self.materials = items
      }else{
       items.map(sm=>{ //selected materials will be removed from materials
        let count=0
        self.selectedMaterialsArray.map(i=>{ 
            if(sm.item_id == i.item_id){
              count=1
            }
        })
        if(count==0){
          tempMaterials.push(sm)
        }
      })
      self.materials = tempMaterials
      }
      
      self.filteredMaterials=self.materials;
      self.paginate_new(self.filteredMaterials, self.items_per_page_new)
      self.pagedDataMaterials = self.getPageDataNew(self.filteredMaterials, 1, self.items_per_page_new)


      self.searchMaterialInput.value=''
      $("#itemModal").modal('show')  
      self.update()
    })

     RiotControl.on('read_edit_indents_changed', function(values) {
      self.indent_view='add_indent'
      $('#stockTypeInput').prop('disabled', true);
      $("#indentDateInput").prop( "disabled", true );
      self.loading = false
      self.selectedMaterialsArray=[]
      self.selectedMaterialsArray = values.selectedMaterialsArray
      self.indentDateInput.value=values.indent_date
      self.departmentInput.value=values.department_code
      self.stockTypeInput.value=values.stock_type_code
      self.selectStockTypeFilter.value=values.stock_type_code
      self.indentTypeInput.value=values.indent_type
      self.update()
      dateFormat('indentDateInput')
      // date element formating
       self.selectedMaterialsArray.map(m => {
          let deliveryDateInput= 'deliveryDateInput'+m.item_id
          dateFormat(deliveryDateInput)

          let partyInput= '#partyInput'+m.item_id
          $(partyInput).val(m.party)
       })

       self.indent_no_add=values.indent_no
    
      self.update()
    })

    RiotControl.on('read_view_indents_changed', function(view) {
      self.loading = false
      self.viewMaterialsArray = view.materialArray
      self.view_indent_details=view
      self.view_indent_type=view.indent_type
      self.view_department=view.department
      self.view_stock_type=view.stock_type
      self.indent_view='view_indent'
      self.update()
    })

    RiotControl.on('indents_status_changed', function(indents) {
      $("#indentStatusModal").modal('hide')  
      self.statusChangeDateInput.value=''
      self.statusChangeAuthorityNameInput.value=''
      self.statusChnageRemarkInput.value=''
      self.indentStatusInput.value=''
      self.loading = false
      self.indents = indents
      self.filteredIndents = indents
      self.update()
    })

    RiotControl.on('read_indent_no_changed', function(indent_no) {
      self.loading = false
      self.indent_no_add=indent_no
      self.update()
    })

    RiotControl.on('fetch_user_details_from_session_for_indent_changed', function(user_name,user_id) {
      console.log('here')
      console.log(user_name)
      self.loading = false
      self.user_name=user_name
      self.user_id=user_id
      console.log(self.user_name)
      self.update()
    })


    /**************** pagination for Indents*******************/
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
      self.pagedDataItems = self.getPageData(self.filteredIndents, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredIndents, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredIndents, 1, self.items_per_page)
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
</indents>
