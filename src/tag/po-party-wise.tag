<po-party-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">PO Party Wise</h4>

<div show={po_party_wise =='po_party_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-4">
      <div class="form-group">
        <label for="poRegisterDateWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="poRegisterDateWiseStartDateInput" onchange={setStartDate} placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-4">
      <div class="form-group">
        <label for="poRegisterDateWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="poRegisterDateWiseEndDateInput" onchange={setEndDate} placeholder="DD/MM/YYYY">
      </div>
    </div>
    <!-- <div class="col-md-3">
      <div class="form-group">
          <label for="selectPOStatus">Status</label>
          <select name="selectPOStatus" class="form-control">
            <option value=""></option>
            <option value="P">Pending</option>
            <option value="all">All</option>
          </select>
      </div>
    </div>  -->
    <!-- <div class="col-md-4">
      <div class="form-group">
        <label for="selectPartyNameInput">Party</label>
        <input type="text" id="selectPartyNameInput" class="form-control" >
      </div>
    </div> -->
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readPO} id="gobtn">Go</button>
      </div>   
    </div>
  </div>
  <div class="row">
    <div class="col-md-4">
      <div class="form-group">
         <table class="table table-bordered">
          <tr>
            <th class="serial-col">#</th>
            <th><input type="search" name="searchParty" class="form-control" placeholder="Search Party" onkeyup={filterParties}></th>
          </tr>
          <tr each={cat, i in pagedDataItems}>
            <td><input type="checkbox" class="form-control" id="{i}" checked={cat.selected} onclick={selectParty.bind(this, cat)}></td>
            <td>{cat.party_name}</td>
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
            <th>Party</th>
            <th></th>
          </tr>
          <tr each={cat, i in checkedParties}>
            <td>{i+1}</td>
            <td>{cat.party_name}</td>
            <td>
              <button class="btn btn-secondary" disabled={loading} onclick={removeParty.bind(this, cat)}><i class="material-icons">remove</i></button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
 </div>

</div>


<div  class="container-fluid print-box" show={po_party_wise =='po_party_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
      
  <div>PO (Party Wise)<br> From {poFrom} To {poTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
    <h5>Party: <b>{m.date}</b></h5>
    <div each={d, j in m.pos}>
        <table class="table print-small">
           <tr>
             <td>PO No: <b>{d.poDetails.stock_type_code}-{d.poDetails.po_no}</b></td>
             <td>PO Date: <b>{d.poDetails.po_date}</b></td>
             <td>Quotatoin Ref: <b>{d.poDetails.quotatoin_ref}</b></td>
           </tr>
           <tr>
             <td>Indent No: <b>{d.poDetails.indent_ids}</b></td>
             <td colspan="2">Party: <b>{d.poDetails.party_name}</b></td>
           </tr>
         </table>
    
         <table class="table table-bordered bill-info-table print-small">
          <tr>
            <th class="serial-col"><strong>Sl</strong></th>
            <th style="width: 250px;"><strong>Description of Goods</strong></th>
            <th><strong>Quantity</strong></th>
            <th><strong>Unit</strong></th>
            <th><strong>Unit Price</strong></th>
            <th><strong>Total</strong></th>
            <th><strong>Discount</strong></th>
            <th show={d.poDetails.p_and_f_charges}><strong>P&F</strong></th>
            <th each={dutyhead, a in d.dutyHeaders}>
               <strong>{dutyhead.tax_name}</strong>
            </th>
            <th each={taxhead, b in d.taxOneHeaders}>
               <strong>{taxhead.tax_name}</strong>
            </th>
            <th each={taxhead, c in d.taxTwoHeaders}>
               <strong>{taxhead.tax_name}</strong>
            </th>
            <th each={cesshead, d in d.cessHeaders}>
               <strong>{cesshead.tax_name}</strong>
            </th>
            <th show={d.poDetails.d.other_charges}><strong>Other Charges</strong></th>
            <th><strong>Amount</strong></th>
          </tr> 
          <tr each={t, k in d.transactions} no-reorder>
            <td>{i+1}</td>
            <td style="width: 250px;">{t.item_name},{t.description}-(Code No:{t.item_id})</td>
            <td class="text-sm-right">{t.po_qty}</td>
            <td class="text-sm-right">{t.uom_code}</td>
            <td class="text-sm-right">{t.unit_value}</td>
            <td class="text-sm-right">{t.amount}</td>
            <td class="text-sm-right">{t.discount_amount} ({t.discount_percentage}%)</td>
            <td class="text-sm-right" show={d.poDetails.p_and_f_charges}>{t.p_and_f_charges}</td>
            <td each={d, j in t.duties} class="text-sm-right">
             {d}
            </td>
            <td each={tone, k in t.taxone} class="text-sm-right">
             {tone}
            </td>
            <td each={ttwo, l in t.taxtwo} class="text-sm-right">
             {ttwo}
            </td>
            <td each={c, m in t.cess} class="text-sm-right">
             {c}
            </td>
            <td class="text-sm-right" show={d.poDetails.other_charges}>{t.other_charges}</td>
            <td class="text-sm-right">{t.item_total}</td>
          </tr>
          <tr>
          <td colspan={d.poDetails.colspan} align="right">Total</td>
          <td class="text-sm-right">{d.poDetails.total}</td>
        </tr>
        </table>
    </div>
  </div> <!-- report main loop -->

 </div><!-- main div -->


<script>
    var self = this
    self.checkedParties=[]
    self.on("mount", function(){
      dateFormat('poRegisterDateWiseStartDateInput')
      dateFormat('poRegisterDateWiseEndDateInput')
      self.po_party_wise='po_party_wise_home'
      RiotControl.trigger('read_parties')
      self.update()
    })

    self.filterParties = () => {
      if(!self.searchParty) return
      self.filteredParties = self.parties.filter(c => {
        return JSON.stringify(c).toLowerCase().indexOf(self.searchParty.value.toLowerCase())>=0
      })

      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
    }

   self.selectParty = (t,e) => {
    self.checkedParties.push(t)
    
    self.parties = self.parties.filter(c => {
      return c.party_id!=t.party_id
    })
    self.pagedDataItems = self.pagedDataItems.filter(c => {
      return c.party_id!=t.party_id
    })

   }

   self.removeParty = (t,e) => {
     self.checkedParties = self.checkedParties.filter(c => {
      return c.party_id!=t.party_id
    })
     console.log(self.checkedParties)
    
    self.parties.push(t)
    self.pagedDataItems.push(t)
   }

    self.setStartDate = () => {
      self.sd=self.poRegisterDateWiseStartDateInput.value
    }

    self.setEndDate = () => {
      self.ed=self.poRegisterDateWiseEndDateInput.value
    }

    self.closeReport = () => {
      self.po_party_wise='po_party_wise_home'
    }

    self.readPO = () => {
      if (self.poRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.poRegisterDateWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }

      var selected_party_id=''
    
      self.checkedParties.map(t => {
          if(selected_party_id==''){
            selected_party_id=t.party_id
          }else if(selected_party_id!=''){
            selected_party_id=selected_party_id+','+t.party_id
          }
       })
      
      
      self.loading=true
      RiotControl.trigger('read_po_party_wise',self.poRegisterDateWiseStartDateInput.value,self.poRegisterDateWiseEndDateInput.value,selected_party_id)
    }

    
    RiotControl.on('read_po_party_wise_changed', function(mainArray) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.po_party_wise='po_party_wise_report'
      self.poFrom=self.poRegisterDateWiseStartDateInput.value
      self.poTo=self.poRegisterDateWiseEndDateInput.value
      self.update()
    })

     RiotControl.on('parties_changed', function(parties, party) {
      self.loading = false
      self.checkedParties= []
      self.parties = party
      self.filteredParties = party

      self.items_per_page = 10
      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
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
      self.pagedDataItems = self.getPageData(self.filteredParties, e.target.value, self.items_per_page)
      self.current_page_no = e.target.value
    }
    self.changeItemsPerPage = (e) => {
      self.items_per_page = e.target.value
      self.paginate(self.filteredParties, self.items_per_page)
      self.pagedDataItems = self.getPageData(self.filteredParties, 1, self.items_per_page)
      self.current_page_no = 1
      self.page_select.value = 1
    }
    /**************** pagination ends*******************/
    

</script>    
</po-party-wise>
