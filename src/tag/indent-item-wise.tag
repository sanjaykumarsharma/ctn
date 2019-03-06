<indent-item-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Indent (Item Wise)</h4>

<div show={indent_item_wise =='indent_item_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="issueRegisterItemWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="issueRegisterItemWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-3">
      <div class="form-group">
        <label for="issueRegisterItemWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="issueRegisterItemWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div> 
    <div class="col-sm-3">  
        <div class="form-group">
          <label for="selectIndentStatus">Status</label>
          <select name="selectIndentStatus" class="form-control">
            <option value=""></option>
            <option value="P">Pending</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readReturn} id="gobtn">Go</button>
      </div>   
    </div>
  </div>
  <div class="row">
    <div class="col-md-4">
      <div class="form-group">
         <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th><input type="search" name="searchItem" class="form-control" placeholder="Search Item" onkeyup={filterItems}></th>
          </tr>
          <tr each={cat, i in pagedDataItems}>
            <td><input type="checkbox" class="form-control" id="{i}" checked={cat.selected} onclick={selectItem.bind(this, cat)}></td>
            <td>{cat.item_name}-(Code:{cat.item_id})</td>
          </tr>
          <tfoot>
            <tr>
              <td colspan="9">
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
    <!-- selected party -->
    <div class="col-md-4">
      <div class="form-group">
        <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th>Selected Item</th>
            <th></th>
          </tr>
          <tr each={cat, i in checkedItems}>
            <td>{i+1}</td>
            <td>{cat.item_name}-(Code:{cat.item_id})</td>
            <td>
              <button class="btn btn-secondary" disabled={loading} onclick={removeItem.bind(this, cat)}><i class="material-icons">remove</i></button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={indent_item_wise =='indent_item_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>Indent (Item Wise)<br> From {issueFrom} To {issueTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
  <h5>Item: <b>{m.item}</b></h5>
   <table class="table table-bordered bill-info-table print-small">
    <tr>
      <th>Sl</th>
      <th>Indent Date</th>
      <th>Indent Type</th>
      <th>Indent No</th>
      <th>Department</th>
      <th>Material Code</th>
      <th>Material</th>
      <th>UOM</th>
      <th>Qty</th>
      <th>Rate</th>
      <th>Amount</th>
      <th>Remarks</th>
      <th>Stock</th>
    </tr> 
    <tr each={t, k in m.issues} no-reorder>
      <td>{k+1}</td>
      <td>{t.indent_date}</td>
      <td>{t.indent_type}</td>
      <td>{t.stock_type_code}-{t.indent_no}</td>
      <td>{t.department}</td>
      <td>{t.item_id}</td>
      <td>{t.item_name}</td>
      <td>{t.uom_code}</td>
      <td style="text-align:right">{t.qty}</td>
      <td style="text-align:right">{t.unit_value}</td>
      <td style="text-align:right">{t.total_value}</td>
      <td>{t.remarks}</td>
      <td>{t.stock}</td>
    </tr>
  </table>
</div> <!-- report main loop -->
   <table class="table table-bordered bill-info-table print-small">
    <tr>
      <td style="text-align:right">Grand Total Qty</td>
      <td style="text-align:right">{qty_grand_total}</td>
      <td style="text-align:right">Grand Total Amount</td>
      <td style="text-align:right">{item_value_grand_total}</td>
    </tr>
   </table>
 </div><!-- main div -->


<script>
    var self = this
    self.on("mount", function(){
      dateFormat('issueRegisterItemWiseStartDateInput')
      dateFormat('issueRegisterItemWiseEndDateInput')
      self.indent_item_wise='indent_item_wise_home'
      self.loading=true
      RiotControl.trigger('read_items_filter')
      self.update()
    })

    /********************************* department filter start*************************/
    self.filterItems = () => {
      if(!self.searchItem) return
      self.filteredItems = self.items.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchItem.value.toLowerCase())>=0
      })

      self.paginate(self.filteredItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page)
    }

   self.selectItem = (t,e) => {
    self.checkedItems.push(t)
    
    self.items = self.items.filter(c => {
      return c.item_id!=t.item_id
    })
    self.pagedDataItems = self.pagedDataItems.filter(c => {
      return c.item_id!=t.item_id
    })

   }

   self.removeItem = (t,e) => {
     self.checkedItems = self.checkedItems.filter(c => {
      return c.item_id!=t.item_id
    })
     console.log(self.checkedItems)
    
    self.items.push(t)
    self.pagedDataItems.push(t)
   }
    /********************************* department filter end***************************/

    self.setStartDate = () => {
      self.sd=self.issueRegisterItemWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.issueRegisterItemWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.indent_item_wise='indent_item_wise_home'
    }

    self.readReturn = () => {
      if (self.issueRegisterItemWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.issueRegisterItemWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }

       var selected_item_id=''
    
      self.checkedItems.map(t => {
          if(selected_item_id==''){
            selected_item_id=t.item_id
          }else if(selected_item_id!=''){
            selected_item_id=selected_item_id+','+t.item_id
          }
       })
    
      self.loading=true
      RiotControl.trigger('read_indent_item_wise',self.issueRegisterItemWiseStartDateInput.value,self.issueRegisterItemWiseEndDateInput.value,self.selectIndentStatus.value,selected_item_id)
    }

    
    RiotControl.on('read_indent_item_wise_changed', function(mainArray,qty_grand_total,item_value_grand_total) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.qty_grand_total=qty_grand_total
      self.item_value_grand_total=item_value_grand_total
      self.indent_item_wise='indent_item_wise_report'
      self.issueFrom=self.issueRegisterItemWiseStartDateInput.value
      self.issueTo=self.issueRegisterItemWiseEndDateInput.value
      self.update()
    })

    RiotControl.on('items_filter_changed', function(items) {
      self.loading=false
      self.items = items
      self.checkedItems=[]
      self.items = items
      self.filteredItems = items

      self.items_per_page = 10
      self.paginate(self.filteredItems, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredItems, 1, self.items_per_page)
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
</indent-item-wise>
