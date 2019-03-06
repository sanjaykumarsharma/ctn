<docket-register-party-wise>
<loading-bar if={loading}></loading-bar>
<h4 class="no-print">Docket Register Party Wise</h4>

<div show={docket_register_party_wise =='docket_register_party_wise_home'} class="no-print">
 <div class="container-fulid no-print" >
  <div class="row">
    <div class="col-md-4">
      <div class="form-group">
        <label for="docketRegisterDateWiseStartDateInput">Start Date</label>
        <input type="text" class="form-control" id="docketRegisterDateWiseStartDateInput" placeholder="DD/MM/YYYY">
      </div>
    </div>  
    <div class="col-md-4">
      <div class="form-group">
        <label for="docketRegisterDateWiseEndDateInput">End Date</label>
        <input type="text" class="form-control" id="docketRegisterDateWiseEndDateInput" placeholder="DD/MM/YYYY">
      </div>
    </div> 
    <div class="col-md-1">
      <div class="form-group">
        <label for="gobtn"></label>
         <button class="btn btn-primary form-control" style="margin-top: 6px;" disabled={loading} onclick={readDocket} id="gobtn">Go</button>
      </div>   
    </div>
    <div class="col-md-1">
      <div class="form-group">
         <img src="img/excel.png" style="height:30px;margin-top: 33px;" onclick={excelExport}>
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


<div  class="container-fluid print-box" show={docket_register_party_wise =='docket_register_party_wise_report'}>
<button type="button" class="btn btn-secondary pull-sm-right no-print" onclick={closeReport} style="margin-bottom:5px;">Close</button> <br>
<center>
    <img src="dist/img/logo.png" style="height: 30px;"><br>
    <img src="dist/img/ntc.png" style="width:250px;padding-bottom:10px"><br>
      
    149,Barrackpore Trunk Road<br>
    P.O. : Kamarhati, Agarpara<br>
    Kolkata - 700058<br>
    <!-- Phone: (033) 3019-0506/0509<br>
    Fax: (033) 3019-0520<br>
    Email: purchase@ntcind.com<br>
    Email: stores_ntc@rdbindia.com<br> -->
      
  <div>Docket Register (Date Wise)<br> From {docketFrom} To {docketTo}</div> <br>
</center>

<div each={m, i in mainArray} class="reportDiv" no-reorder>
    <h5>Party: <b>{m.date}</b></h5>
    <div each={d, j in m.dockets}>
        <table class="table print-small">
           <tr>
             <td>Docket No: <b>{d.docketDetails.stock_type_code}-{d.docketDetails.docket_no}</b></td>
             <td>Docket Date: <b>{d.docketDetails.docket_date}</b></td>
             <td>Party: <b>{d.docketDetails.party_name}</b></td>
           </tr>
           <tr>
             <td>Bill No: <b>{d.docketDetails.bill_no}</b></td>
             <td>Bill Date: <b>{d.docketDetails.bill_date}</b></td>
             <td>GST No: <b>{d.docketDetails.gst}</b></td>
           </tr>
           <tr>
             <td>Challan No: <b>{d.docketDetails.challan_no}</b></td>
             <td>Challan Date: <b>{d.docketDetails.challan_date}</b></td>
             <td>LR No: <b>{d.docketDetails.lr_no}</b></td>
           </tr>
           <tr>
             <td colspan="3">Vehicle No: <b>{d.docketDetails.vehicle_no}</b></td>
           </tr>
         </table>
    
         <table class="table table-bordered bill-info-table print-small">
          <tr>
           <th>Sl</th>
           <th>Item Name</th>
           <th>Location</th>
           <th>Unit</th>
           <th>Qty</th>
           <th>Rate</th>
           <th>Amount</th>
           <th>Item Value</th>
          </tr> 
          <tr each={t, k in d.transactions} no-reorder>
           <td>{k+1}</td>
           <td>{t.item_name}</td>
           <td>{t.location}</td>
           <td>{t.uom_code}</td>
           <td style="text-align:right">{t.qty}</td>
           <td style="text-align:right">{t.rate}</td>
           <td style="text-align:right">{t.amount}</td>
           <td style="text-align:right">{t.total}</td>
          </tr>
          <tr>
            <td colspan=7 style="text-align:right">Sub Total</td>
            <td class="text-xs-right">{d.docketDetails.sub_total_amount}</td>
          </tr>
          <tr hide={d.docketDetails.freight_charge==0.00}>
            <td colspan=7 style="text-align:right">Insurance Charges</td>
            <td class="text-xs-right">{d.docketDetails.freight_charge}</td>
          </tr>
          <tr hide={d.docketDetails.p_and_f_charge==0.00}>
            <td colspan=7 style="text-align:right">P & F Charges</td>
            <td class="text-xs-right">{d.docketDetails.p_and_f_charge}</td>
          </tr>
          <tr hide={d.docketDetails.delivery_charge==0.00}>
            <td colspan=7 style="text-align:right">Delivery Charges</td>
            <td class="text-xs-right">{d.docketDetails.delivery_charge}</td>
          </tr>
          <tr hide={d.docketDetails.loading_charge==0.00}>
            <td colspan=7 style="text-align:right">Loading Charges</td>
            <td class="text-xs-right">{d.docketDetails.loading_charge}</td>
          </tr>
          <tr hide={d.docketDetails.packing_charge==0.00}>
            <td colspan=7 style="text-align:right">Packing Charges</td>
            <td class="text-xs-right">{d.docketDetails.packing_charge}</td>
          </tr>
          <tr hide={d.docketDetails.courier_charge==0.00}>
            <td colspan=7 style="text-align:right">Courier Charges</td>
            <td class="text-xs-right">{d.docketDetails.courier_charge}</td>
          </tr>
          <tr hide={d.docketDetails.round_off_amount==0.00}>
            <td colspan=7 style="text-align:right">Round off</td>
            <td class="text-xs-right">{d.docketDetails.round_off_amount}</td>
          </tr>
          <tr>
            <td colspan=7 style="text-align:right">Bill Amount</td>
            <td class="text-xs-right">{d.docketDetails.bill_amount}</td>
          </tr>
        </table>
    </div>
  </div> <!-- report main loop -->

  <table class="table table-bordered bill-info-table print-small">
    <tr>
      <td colspan=5 style="text-align:right">Grand Total Qty</td>
      <td class="text-xs-right">{qty_grand_total}</td>
      <td style="text-align:right">Grand Total Item Value</td>
      <td class="text-xs-right">{item_value_grand_total}</td>
    </tr>
  </table>

 </div><!-- main div -->


<script>
    var self = this
    self.selected_party_id=''
    self.checkedParties=[]
    self.on("mount", function(){
      dateFormat('docketRegisterDateWiseStartDateInput')
      dateFormat('docketRegisterDateWiseEndDateInput')
      self.docket_register_party_wise='docket_register_party_wise_home'
      RiotControl.trigger('read_parties')
    })

    self.excelExport = () => {
      if (self.docketRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.docketRegisterDateWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }

      self.selected_party_id=''
    
      self.checkedParties.map(t => {
          if(self.selected_party_id==''){
            self.selected_party_id=t.party_id
          }else if(self.selected_party_id!=''){
            self.selected_party_id=self.selected_party_id+','+t.party_id
          }
       })

     var link="csv/docket_register_party_wise_csv.php?start_date="+self.docketRegisterDateWiseStartDateInput.value+"&end_date="+self.docketRegisterDateWiseEndDateInput.value+"&selected_party_id="+self.selected_party_id;
     console.log(link)
      var win = window.open(link, '_blank');
      win.focus();
    }

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

    self.closeReport = () => {
      self.docket_register_party_wise='docket_register_party_wise_home'
    }

    self.readDocket = () => {
      if (self.docketRegisterDateWiseStartDateInput.value=='') {
        toastr.info("Please Entet Start Date")
        return
      }
      if (self.docketRegisterDateWiseEndDateInput.value=='') {
        toastr.info("Please Entet End Date")
        return
      }

      self.selected_party_id=''
    
      self.checkedParties.map(t => {
          if(self.selected_party_id==''){
            self.selected_party_id=t.party_id
          }else if(self.selected_party_id!=''){
            self.selected_party_id=self.selected_party_id+','+t.party_id
          }
       })

      self.loading=true
      RiotControl.trigger('read_docket_register_party_wise',self.docketRegisterDateWiseStartDateInput.value,self.docketRegisterDateWiseEndDateInput.value,self.selected_party_id)
    }

    
    RiotControl.on('read_docket_register_party_wise_changed', function(mainArray,qty_grand_total,item_value_grand_total) {
      self.loading=false
      self.mainArray=[]
      self.mainArray=mainArray
      self.qty_grand_total=qty_grand_total
      self.item_value_grand_total=item_value_grand_total
      self.docket_register_party_wise='docket_register_party_wise_report'
      self.docketFrom=self.docketRegisterDateWiseStartDateInput.value
      self.docketTo=self.docketRegisterDateWiseEndDateInput.value
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

    /*$('#selectPartyNameInput').autocomplete({
        source: parties,
        select: function( event, ui ) {
          self.selected_party_id= ui.item.party_id
          console.log(self.selected_party_id)
      });*/
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
</docket-register-party-wise>
