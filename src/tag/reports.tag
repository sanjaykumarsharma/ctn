<reports>
  <div class="no-print">
    <ul class="nav nav-pills" style="margin:20px 0">
      
      <li class="nav-item">
        <a class="nav-link {active: selected_report == 'docket-register-date-wise'}" href="#reports/docket-register-date-wise">Docket Register(Date Wise)</a>
      </li>



      <!-- <li class="nav-item">
        <a class="nav-link {active: selected_report == 'stock-statement'}" href="#reports/stock-statement">Stock Statement</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_report == 'stock-in-hand'}" href="#reports/stock-in-hand">Stock In Hand</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {active: selected_report == 'pending-po'}" href="#reports/pending-po">Pending PO</a>
      </li> -->
      <!-- <li class="nav-item">
        <a class="nav-link {active: selected_report == 'stock-ledger'}" href="#reports/stock-ledger">Stock Ledger</a>
      </li> -->
    </ul>
  </div>
  <div id="report-view" class="container-fulid"></div>
  <script>

    var self = this
    if(!opts.selected_report){
      self.selected_report = 'stock-statement'
    }else{
      self.selected_report = opts.selected_report
    }

  </script>
</reports>