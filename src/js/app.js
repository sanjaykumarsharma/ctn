var showToast = (msg, data) => {
  if(msg == "" || !msg){
    msg = "Something went wrong";
  }
  toastr.error(msg);
  console.log("[ERROR:]");
  console.log(data);
}

var loginStore = new LoginStore() // Create a store instance.
RiotControl.addStore(loginStore) // Register the store in central dispatch.

var indentStore = new IndentStore() 
RiotControl.addStore(indentStore)

/*store for master start*/

var departmentStore = new DepartmentStore() // Create a store instance.
RiotControl.addStore(departmentStore) // Register the store in central dispatch.

var locationStore = new LocationStore() 
RiotControl.addStore(locationStore) 

var chargeheadStore = new ChargeheadStore() 
RiotControl.addStore(chargeheadStore) 

var stockTypeStore = new StockTypeStore() 
RiotControl.addStore(stockTypeStore) 

var taxStore = new TaxStore() 
RiotControl.addStore(taxStore)

var financialYearStore = new FinancialYearStore() 
RiotControl.addStore(financialYearStore) 

var uomStore = new UomStore() 
RiotControl.addStore(uomStore) 

var conditionStore = new ConditionStore() 
RiotControl.addStore(conditionStore) 

var itemGroupStore = new ItemGroupStore() // Create a store instance.
RiotControl.addStore(itemGroupStore) // Register the store in central dispatch.

var partyStore = new PartyStore() // Create a store instance.
RiotControl.addStore(partyStore) // Register the store in central dispatch.

var itemSubgroupStore = new ItemSubgroupStore() // Create a store instance.
RiotControl.addStore(itemSubgroupStore) // Register the store in central dispatch.

var itemStore = new ItemStore() // Create a store instance.
RiotControl.addStore(itemStore) // Register the store in central dispatch.

 var purchaseOrderStore = new PurchaseOrderStore() // Create a store instance.
 RiotControl.addStore(purchaseOrderStore) // Register the store in central dispatch.

 var docketStore = new DocketStore() // Create a store instance.
 RiotControl.addStore(docketStore) // Register the store in central dispatch.

 var rejectToPartyStore = new RejectToPartyStore() // Create a store instance.
 RiotControl.addStore(rejectToPartyStore) // Register the store in central dispatch.

 var issueToDepartmentStore = new IssueToDepartmentStore() // Create a store instance.
 RiotControl.addStore(issueToDepartmentStore) // Register the store in central dispatch.

 var receiveStore = new ReceiveStore() // Create a store instance.
 RiotControl.addStore(receiveStore) // Register the store in central dispatch.

 var returnToStockStore = new ReturnToStockStore() // Create a store instance.
 RiotControl.addStore(returnToStockStore) // Register the store in central dispatch.

 var openingStockStore = new OpeningStockStore() // Create a store instance.
 RiotControl.addStore(openingStockStore) // Register the store in central dispatch.
 
/*store for master end*/

/*store for Report*/
var docketReportStore = new DocketReportStore() 
RiotControl.addStore(docketReportStore) 

var issueToDepartmentReport = new IssueToDepartmentReport() 
RiotControl.addStore(issueToDepartmentReport)

var returnToStockReport = new ReturnToStockReport() 
RiotControl.addStore(returnToStockReport) 

var rejectToPartyReport = new RejectToPartyReport() 
RiotControl.addStore(rejectToPartyReport) 

var stockReportStore = new StockReportStore() 
RiotControl.addStore(stockReportStore) 

var stockSummaryStore = new StockSummaryStore() 
RiotControl.addStore(stockSummaryStore)

var stockStatementStore = new StockStatementStore() 
RiotControl.addStore(stockStatementStore) 

var stockLedgerStore = new StockLedgerStore() 
RiotControl.addStore(stockLedgerStore) 

var indentReport = new IndentReport() 
RiotControl.addStore(indentReport) 

var poReport = new POReport() 
RiotControl.addStore(poReport) 
/*store for Report end*/

var currentPage = null;

let goTo = (path1, path2) => {
  riot.mount('main-nav', {selected_nav_item: path1});
  if (currentPage) {
    currentPage.unmount(true);
  }
  switch(path1) {
    case 'home':
      currentPage = riot.mount('div#view', 'home')[0];
    break;
    case 'indents':
      currentPage = riot.mount('div#view', 'indents')[0];
    break;
    case 'po':
      currentPage = riot.mount('div#view', 'po')[0];
    break;
    case 'docket':
      currentPage = riot.mount('div#view', 'docket')[0];
    break;
    case 'rejecttoparty':
      currentPage = riot.mount('div#view', 'reject-to-party')[0];
    break;
    case 'issuetodepartment':
      currentPage = riot.mount('div#view', 'issue-to-department')[0];
    break;
    case 'returntostock':
      currentPage = riot.mount('div#view', 'return-to-stock')[0];
    break;
    case 'openingstock':
      currentPage = riot.mount('div#view', 'opening-stock')[0];
    break;
    case 'receive':
      currentPage = riot.mount('div#view', 'receive')[0];
    break;
    case 'masters':
      console.log("Found path: " + path1 + " / " + path2);
      currentPage = riot.mount('div#view', 'masters', {selected_master: path2})[0];
      switch(path2){
        case 'department-master':
          riot.mount("div#master-view", 'department-master')
        break;
        case 'location-master':
          riot.mount("div#master-view", 'location-master')
        break;
        case 'chargehead-master':
          riot.mount("div#master-view", 'chargehead-master')
        break;
        case 'stock-type-master':
          riot.mount("div#master-view", 'stock-type-master')
        break;
        case 'tax-master':
          riot.mount("div#master-view", 'tax-master')
        break;
        case 'uom-master':
          riot.mount("div#master-view", 'uom-master')
        break;
        case 'condition-master':
          riot.mount("div#master-view", 'condition-master')
        break;
        case 'item-group':
          riot.mount("div#master-view", 'item-group-master')
        break;
        case 'party-master':
          riot.mount("div#master-view", 'party-master')
        break;
        case 'item':
          riot.mount("div#master-view", 'item-master')
        break;
        case 'financial-year':
          riot.mount("div#master-view", 'financial-year-master')
        break;
        case 'db-backup':
          riot.mount("div#master-view", 'db-backup')
        break;
        default:
          riot.mount("div#master-view", 'item-group-master')
      }
    break;
    case 'docket-register-date-wise':
      currentPage = riot.mount('div#view', 'docket-register-date-wise')[0];
    break;
    case 'docket-register-item-wise':
      currentPage = riot.mount('div#view', 'docket-register-item-wise')[0];
    break;
    case 'docket-register-party-wise':
      currentPage = riot.mount('div#view', 'docket-register-party-wise')[0];
    break;
    case 'docket-report':
      currentPage = riot.mount('div#view', 'docket-report')[0];
    break;
    case 'stock-date-wise':
      currentPage = riot.mount('div#view', 'stock-date-wise')[0];
    break;
    case 'stock-movement-register':
      currentPage = riot.mount('div#view', 'stock-movement-register')[0];
    break;
    case 'stock-valuation-summary-store-type-wise':
      currentPage = riot.mount('div#view', 'stock-valuation-summary-store-type-wise')[0];
    break;
    case 'stock-ledger-avg-valuation-in-details':
      currentPage = riot.mount('div#view', 'stock-ledger-avg-valuation-in-details')[0];
    break;
    case 'stock-ledger-avg-valuation-in-summry':
      currentPage = riot.mount('div#view', 'stock-ledger-avg-valuation-in-summry')[0];
    break;
    case 'stock-valuation-summary-location-wise':
      currentPage = riot.mount('div#view', 'stock-valuation-summary-location-wise')[0];
    break;
    case 'issuetodepartment-date-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-date-wise')[0];
    break;
    case 'issuetodepartment-item-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-item-wise')[0];
    break;
    case 'issuetodepartment-dept-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-dept-wise')[0];
    break;
    case 'issuetodepartment-location-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-location-wise')[0];
    break;
    case 'issuetodepartment-chargehead-wise':
      currentPage = riot.mount('div#view', 'issue-to-department-chargehead-wise')[0];
    break;
    case 'returntostock-date-wise':
      currentPage = riot.mount('div#view', 'return-to-stock-date-wise')[0];
    break;
    case 'returntostock-item-wise':
      currentPage = riot.mount('div#view', 'return-to-stock-item-wise')[0];
    break;
    case 'returntostock-dept-wise':
      currentPage = riot.mount('div#view', 'return-to-stock-dept-wise')[0];
    break;
    case 'rejecttoparty-date-wise':
      currentPage = riot.mount('div#view', 'reject-to-party-date-wise')[0];
    break;
    case 'rejecttoparty-docket-date-wise':
      currentPage = riot.mount('div#view', 'reject-to-party-docket-date-wise')[0];
    break;
    case 'rejecttoparty-item-wise':
      currentPage = riot.mount('div#view', 'reject-to-party-item-wise')[0];
    break;
    case 'rejecttoparty-party-wise':
      currentPage = riot.mount('div#view', 'reject-to-party-party-wise')[0];
    break;
    case 'indent-date-wise':
      currentPage = riot.mount('div#view', 'indent-date-wise')[0];
    break;
    case 'indent-item-wise':
      currentPage = riot.mount('div#view', 'indent-item-wise')[0];
    break;
    case 'indent-report':
      currentPage = riot.mount('div#view', 'indent-report')[0];
    break;
    case 'po-date-wise':
      currentPage = riot.mount('div#view', 'po-date-wise')[0];
    break;
    case 'po-report':
      currentPage = riot.mount('div#view', 'po-report')[0];
    break;
    case 'po-party-wise':
      currentPage = riot.mount('div#view', 'po-party-wise')[0];
    break;
    case 'po-item-wise':
      currentPage = riot.mount('div#view', 'po-item-wise')[0];
    break;
    case 'po-report-supplied-materials':
      currentPage = riot.mount('div#view', 'po-report-supplied-materials')[0];
    break;
    case 'receive-for-stock-adjustment-report':
      currentPage = riot.mount('div#view', 'receive-for-stock-adjustment-report')[0];
    break;
    /*case 'reports':
      console.log("Found path for reports: " + path1 + " / " + path2);
      currentPage = riot.mount('div#view', 'reports', {selected_report: path2})[0];
      switch(path2){
        case 'docket-register-date-wise':
          riot.mount("div#report-view", 'docket-register-date-wise')
        break;
        case 'stock-summary':
          riot.mount("div#report-view", 'stock-summary')
        break;
        case 'stock-statement':
          riot.mount("div#report-view", 'stock-statement')
        break;
        case 'stock-in-hand':
          riot.mount("div#report-view", 'stock-in-hand')
        break;
        case 'pending-po':
          riot.mount("div#report-view", 'pending-po')
        break;
        case 'stock-ledger':
          riot.mount("div#report-view", 'stock-ledger')
        break;
        default:
          riot.mount("div#report-view", 'stock-statement')
      }
    break;*/
    default:
    
      currentPage = riot.mount('div#view', 'home')[0];
  }
}


riot.route.stop()
//riot.route.base('/#!')
//riot.route.base('/ntc')
riot.route.start(true)
riot.route(goTo);
