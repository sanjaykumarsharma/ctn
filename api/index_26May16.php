<?php
session_start();
require 'Slim/Slim.php';

require 'modules/login.php';
require 'modules/orderService.php';
require 'modules/orderView.php';
require 'modules/ColorService.php';
require 'modules/PrintColorService.php';
require 'modules/HandleColorService.php';
require 'modules/FreightService.php';
require 'modules/HandleMaterialService.php';
require 'modules/CylinderService.php';
require 'modules/FormService.php';
require 'modules/FabricService.php';
require 'modules/MeshService.php';
require 'modules/Vendor.php';

require 'modules/tempOrderService.php';
require 'modules/BookingReportService.php';
require 'modules/CylinderPrintService.php';
require 'modules/LeadService.php';
require 'modules/LeadStatusService.php';
require 'modules/Contact.php';
require 'modules/OrderType.php';
require 'modules/User.php';
require 'modules/Unit.php';
require 'modules/PrintingMaterial.php';
require 'modules/TaxService.php';
require 'modules/summaryService.php';
require 'modules/DetailReportService.php';
require 'modules/InvoiceService.php';
require 'modules/IndustryService.php';
require 'modules/BankService.php';
require 'modules/InvoiceDataService.php';
require 'modules/SourceService.php';
require 'modules/PaymentTerms.php';
require 'modules/FilterService.php';
require 'modules/CostService.php';
require 'modules/DebtorService.php';
require 'modules/PaymentService.php';
require 'modules/ReportService.php';
require 'modules/ReminderService.php';
require 'modules/InvoiceReportService.php';
require 'modules/PPCostService.php';
require 'modules/LDCostService.php';
require 'modules/BoppCostService.php';
require 'modules/FillerCostService.php';
require 'modules/InvoiceItemService.php';
require 'modules/CopyOrderService.php';
require 'modules/TallyData.php';
require 'modules/InvoiceFreight.php';
require 'modules/InvoiceDebtorService.php';
require 'modules/TallyUserService.php';
require 'modules/BoppStockService.php';
require 'modules/SolventStockService.php';
require 'modules/InkStockService.php';
require 'modules/ItemService.php';
require 'modules/BrandService.php';
require 'modules/StockReportService.php';
require 'modules/IssueStockService.php';
require 'modules/CylinderStockService.php';
require 'modules/DebtorReportService.php';
require 'modules/TruckService.php';
require 'modules/BOPPThicknessService.php';
require 'modules/InvoiceAmmendmentService.php';
require 'modules/TransporterService.php';
require 'modules/costUpdate.php';
require 'modules/CapacityService.php';
require 'modules/HolidayService.php';
require 'modules/WeeklyPlanningService.php';
require 'modules/DespatchPlanningService.php';
require 'modules/FormReceiveService.php';
require 'modules/BoppCostFactorService.php';
require 'modules/HandleCostService.php';
require 'modules/OverheadService.php';
require 'modules/MachineService.php';
require 'modules/BagTypeService.php';
require 'modules/IssueBOPPService.php';
require 'modules/dbbackup.php';
require 'modules/BOPPFinishService.php';
require 'modules/IssueSolventStock.php';
require 'modules/IssueInkStock.php';
require 'modules/WastageService.php';


\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->get('/backup/', 'createBackup');
$app->post('/receiveForm','formReceiveAction');
$app->post('/weeklyPlan','planningAction');
$app->post('/despatchPlan','despatchAction');
$app->post('/issueBopp','boppIssueAction');
$app->post('/issueSolvent','solventIssueAction');
$app->post('/issueInk','inkIssueAction');
//======= Transporter ==============
//$app->get('/transporter','getTransporter');
$app->post('/transporter','addTransporter');
$app->put('/transporter','updateTransporter');
$app->delete('/transporter/:id','deleteTransporter');
//====== Invoice Ammendment ============
$app->get('/ammendment/:id','getInvoiceDetail');
$app->post('/ammendment','addAmmendedInvoice');
$app->put('/ammendment','updateAmmendedInvoice');

//======= Debtor Report =============
$app->get('/debtorReport/:type/:sdate','getDebtor');
$app->post('/debtorReport','getOrderReport');
//======Read Available Cylinder =========
$app->get('/cylinderStock/:id/:status', 'getAvailableStock');
$app->post('/cylinderStock','addIssuedCylinder');
$app->put('/cylinderStock', 'updateIssuedCylinder');
//======== Stock Report ==============
$app->get('/stockReport/:type', 'getStockReprot');
$app->post('/stockReport', 'stockReportAction');
//========= Issue Stock ===============
$app->get('/issue/:id','getIssue');
$app->post('/issue', 'addIssue');
$app->put('/issue', 'deleteIssue');
//$app->delete('/issue/:id', 'deleteIssue');
//=========== Stock Report ==============
//$app->get('/stock/:type/:sdate/:edate/:stock','getStocks');
$app->post('/stock', 'readforIssue');
/**********Bopp Stock*******************************/
$app->get('/bopp','getBopp');
$app->post('/bopp', 'addBopp');
$app->put('/bopp', 'updateBopp');
$app->delete('/bopp/:id', 'deleteBopp');
/**********Solvent Stock*******************************/
$app->get('/solvent','getSolvent');
$app->post('/solvent', 'addSolvent');
$app->put('/solvent', 'updateSolvent');
$app->delete('/solvent/:id', 'deleteSolvent');
/**********Solvent Stock*******************************/
$app->get('/ink','getInk');
$app->post('/ink', 'addInk');
$app->put('/ink', 'updateInk');
$app->delete('/ink/:id', 'deleteInk');
//=========Item Service ==================
$app->get('/brand/:id/:type','getBrand');
$app->post('/brand', 'addBrand');
$app->put('/brand', 'updateBrand');
$app->delete('/brand/:id', 'deleteBrand');
//=========Item Service ==================
$app->get('/items/:id/:type','getItem');
$app->post('/items', 'addItem');
$app->put('/items', 'updateItem');
$app->delete('/items/:id', 'deleteItem');
//================Tally Data=================
$app->post('/tally_invoice','getTallyInvoice');
$app->post('/updateAllCost','updateAllCost');
//================tally user=================
$app->get('/tallyuser','getTallyUser');
$app->post('/tallyuser','addTallyUser');
//================Existing Order==================
$app->post('/copy_order','copyOrder');
//============Invoice Item======================
$app->get('/item','getInvoiceItem');
$app->post('/item', 'addInvoiceItem');
$app->put('/item', 'updateInvoiceItem');
$app->delete('/item/:id', 'deleteInvoiceItem');
//========= Filler Cost ==============
$app->get('/filler','getFillerCost');
$app->post('/filler', 'addFillerCost');
$app->put('/filler', 'updateFillerCost');
$app->delete('/filler/:id', 'deleteFillerCost');
//========= PP Cost ==============
$app->get('/pp','getPPCost');
$app->post('/pp', 'addPPCost');
$app->put('/pp', 'updatePPCost');
$app->delete('/pp/:id', 'deletePPCost');
//========= LD Cost ==============
$app->get('/ld','getLDCost');
$app->post('/ld', 'addLDCost');
$app->put('/ld', 'updateLDCost');
$app->delete('/ld/:id', 'deleteLDCost');
//========= BOPP Cost ==============
$app->get('/bpc','getBoppCost');
$app->post('/bpc', 'addBoppCost');
$app->put('/bpc', 'updateBoppCost');
$app->delete('/bpc/:id', 'deleteBoppCost');
//======= Filter Value ==================
$app->post('/filter', 'getFreightRate');
//======== Invoice Report =============
$app->get('/invoiceReport/:sdate/:edate/:type', 'getInvoiceReport');
$app->post('/invoiceReport','getVatDetail');

/*******Payment*******************/
$app->post('/payment','addPayment');
/*******Lead Reminder *************/
$app->get('/reminder/:id','getReminder');
$app->post('/reminder', 'addReminder');
/**********Debtor*************************/
$app->get('/debtor','getDebt');
$app->post('/debtor', 'addDebt');
$app->put('/debtor', 'updateDebt');
$app->delete('/debtor/:id', 'deleteDebt');
/**********Cost*************************/
$app->get('/cost/:id/:type','getCost');
$app->post('/cost', 'addCost');
$app->put('/cost', 'updateCost');
$app->delete('/cost/:id/:type', 'deleteCost');
/**********Reports********************/
$app->get('/booking/:edate','getBookingOrder');
$app->post('/booking','getPartyBooking');
$app->put('/booking','getCube');
$app->get('/summary/:sdate/:edate/:type/:range','getSummary');
$app->post('/summary','getAllocatedPrintName');

$app->get('/reports/:sdate/:edate/:range','getPlanning');
$app->post('/reports','performReportAction');
/***********Detail Report ************/
$app->get('/detail/:sdate/:edate/:action/:type/:range','getDetail');
$app->post('/detail','packingViewList');
/**************Source***************************/
$app->get('/source','getSource');
$app->post('/source', 'addSource');
$app->put('/source', 'updateSource');
$app->delete('/source/:id', 'deleteSource');
/*************** Bank ***************************/
$app->get('/bank', 'getBank');
$app->post('/bank', 'addBank');
$app->put('/bank', 'updateBank');
$app->delete('/bank/:id', 'deleteBank');
/**********Industry*******************************/
$app->get('/inds','getIndustry');
$app->post('/inds', 'addIndustry');
$app->put('/inds', 'updateIndustry');
$app->delete('/inds/:id', 'deleteIndustry');
/**********Tax*************************/
$app->get('/tax/:id','getTax');
$app->post('/tax', 'addTax');
$app->put('/tax', 'updateTax');
$app->delete('/tax/:id', 'deleteTax');

/**********Vendor*************************/
$app->get('/ven/:id/:type','getVendor');
$app->post('/ven', 'addVendor');
$app->put('/ven', 'updateVendor');
$app->delete('/ven/:id', 'deleteVendor');
/*************Read Letter Data********************/
$app->get('/cylinderLetter/:id','getCylinderLetter');
$app->post('/cylinderLetter','addCylinderRepair');
$app->put('/cylinderLetter', 'updateCylinderStatus');
/**********Cylinder*************************/ 
$app->get('/cylinder/:id','getCylinder');
$app->post('/cylinder', 'addCylinder');
$app->put('/cylinder', 'updateCylinder');
$app->delete('/cylinder/:id', 'deleteCylinder');
/************Temp Order*************************/
$app->get('/temporder/:id/:type', 'getTempOrder');
$app->post('/temporder', 'addTempOrder');
$app->put('/temporder', 'updateTempOrder');
$app->delete('/temporder/:id', 'deleteTempOrder');
/***************Order ***************************/
$app->get('/order/:stage/:type/:search', 'getOrder');
$app->post('/order', 'addOrder');            
$app->put('/order', 'updateOrder');
$app->delete('/order/:id/:type', 'deleteOrder');

/********TruckService*************/
$app->get('/truck','getTruck');
$app->post('/truck', 'addTruck');
$app->put('/truck', 'updateTruck');
$app->delete('/truck/:id', 'deleteTruck');
/********BOPPThicknessService*************/
$app->get('/bopp-thickness','getThickness');
$app->post('/bopp-thickness', 'addThickness');
$app->put('/bopp-thickness', 'updateThickness');
$app->delete('/bopp-thickness/:id', 'deleteThickness');
/********BOPPFinishService*************/
$app->get('/finish','getBOPPFinish');
$app->post('/finish', 'addBOPPFinish');
$app->put('/finish', 'updateBOPPFinish');
$app->delete('/finish/:id', 'deleteBOPPFinish');
/******** wastge percentage *************/
$app->get('/wastage','getWastsage');
$app->post('/wastage', 'addWastsage');
$app->put('/wastage', 'updateWastsage');
$app->delete('/wastage/:id', 'deleteWastsage');
/**********Color*******************************/
$app->get('/color','getColor');
$app->post('/color', 'addColor');
$app->put('/color', 'updateColor');
$app->delete('/color/:id', 'deleteColor');
/**********Print Color*******************************/
$app->get('/printColor','getPrintColor');
$app->post('/printColor', 'addPrintColor');
$app->put('/printColor', 'updatePrintColor');
$app->delete('/printColor/:id', 'deletePrintColor');
/**********Handle Color*******************************/
$app->get('/handleColor','getHandleColor');
$app->post('/handleColor', 'addHandleColor');
$app->put('/handleColor', 'updateHandleColor');
$app->delete('/handleColor/:id', 'deleteHandleColor');

/**********Fabric*******************************/
$app->get('/fabric','getFabric');
$app->post('/fabric', 'addFabric');
$app->put('/fabric', 'updateFabric');
$app->delete('/fabric/:id', 'deleteFabric');
/**********Material*******************************/
$app->get('/material','getMaterial');
$app->post('/material', 'addMaterial');
$app->put('/material', 'updateMaterial');
$app->delete('/material/:id', 'deleteMaterial');
/**********HandleMaterial*******************************/
$app->get('/handlematerial','getHandleMaterial');
$app->post('/handlematerial', 'addHandleMaterial');
$app->put('/handlematerial', 'updateHandleMaterial');
$app->delete('/handlematerial/:id', 'deleteHandleMaterial');
/**********AccMaterial*******************************/
$app->get('/accmaterial','getAccMaterial');
$app->post('/accmaterial', 'addAccMaterial');
$app->put('/accmaterial', 'updateAccMaterial');
$app->delete('/accmaterial/:id', 'deleteAccMaterial');
/*************Contact*******************************/
$app->get('/contact/:id/:type','getContact');
$app->post('/contact', 'addContact');
$app->put('/contact', 'updateContact');
$app->delete('/contact/:id', 'deleteContact');
/**************Lead********************************/
$app->get('/lead','getLead');
$app->post('/lead', 'addLead');
$app->put('/lead', 'updateLead');
$app->delete('/lead/:id', 'deleteLead');
/****************Lead Status**********************/
$app->get('/status/:id/:type','getLeadStatus');
$app->post('/status','addLeadStatus');
$app->put('/status', 'deleteLeadStatus');

$app->get('/vieworder/:id', 'getOrderDetails');
$app->put('/vieworder', 'updateOrderStatus');
$app->post('/vieworder', 'getOrderEditDetails');
//Invoice
$app->get('/invoice/:id/:type','getInvoice');
$app->post('/invoice', 'addInvoice');
$app->put('/invoice', 'readInvoiceOrder');
$app->delete('/invoice/:despatch_id', 'deletePrintList');
//*******************Invoice Detail*************
$app->get('/invoiceData/:id/:limit/:range/:sd/:ed','getInvoiceData');   
$app->put('/invoiceData', 'updateInvoiceStatus');
$app->post('/invoiceData', 'updateApprovedData');
$app->delete('/invoiceData/:id', 'deleteInvoiceData');
/**********   User **********************/
$app->get('/user','getUser');
$app->post('/user', 'addUser');
$app->put('/user', 'updateUser');
$app->delete('/user/:id', 'deleteUser');
/**********   OrderType **********************/
$app->get('/ordertype','getOrderType');
$app->post('/ordertype', 'addOrderType');
$app->put('/ordertype', 'updateOrderType');
$app->delete('/ordertype/:id', 'deleteOrderType');
/**********   PaymentTerm**********************/
$app->get('/paymentterm','getPaymentTerm');
$app->post('/paymentterm', 'addPaymentTerm');
$app->put('/paymentterm', 'updatePaymentTerm');
$app->delete('/paymentterm/:id', 'deletePaymentTerm');
/********************Raw Material*****************/
$app->get('/raw','getRawMaterial');
$app->post('/raw', 'addRawMaterial');
$app->put('/raw', 'updateRawMaterial');
$app->delete('/raw/:id', 'deleteRawMaterial');
/********************Unit*****************/
$app->get('/unit','getUnit');
$app->post('/unit', 'addUnit');
$app->put('/unit', 'updateUnit');
$app->delete('/unit/:id', 'deleteUnit');
/********************Freight*****************/
$app->get('/freight','getFreight');
$app->post('/freight', 'addFreight');
$app->put('/freight', 'updateFreight');
$app->delete('/freight/:id', 'deleteFreight');
/********************Freight*****************/
$app->get('/form','getForm');
$app->post('/form', 'addForm');
$app->put('/form', 'updateForm');
$app->delete('/form/:id', 'deleteForm');
/********************Handle Type*****************/
$app->get('/htype','getHandleType');
$app->post('/htype', 'addHandleType');
$app->put('/htype', 'updateHandleType');
$app->delete('/htype/:id', 'deleteHandleType');
/********************Quality Type*****************/
$app->get('/qtype','getQualityType');
$app->post('/qtype', 'addQualityType');
$app->put('/qtype', 'updateQualityType');
$app->delete('/qtype/:id', 'deleteQualityType');
/********************Thraed Type*****************/
$app->get('/thread','getThreadType');
$app->post('/thread', 'addThreadType');
$app->put('/thread', 'updateThreadType');
$app->delete('/thread/:id', 'deleteThreadType');
/********************Handle*****************/
$app->get('/handle','getHandle');
$app->post('/handle', 'addHandle');
$app->put('/handle', 'updateHandle');
$app->delete('/handle/:id', 'deleteHandle');
/********************Thread*****************/
$app->get('/thr','getThread');
$app->post('/thr', 'addThread');
$app->put('/thr', 'updateThread');
$app->delete('/thr/:id', 'deleteThread');
/********************Accessory*****************/
$app->get('/acc','getAcc');
$app->post('/acc', 'addAcc');
$app->put('/acc', 'updateAcc');
$app->delete('/acc/:id', 'deleteAcc');
/********************printing Material****************/
$app->get('/pmaterial','getPrintingMaterial');
$app->post('/pmaterial', 'addPrintingMaterial');
$app->put('/pmaterial', 'updatePrintingMaterial');
$app->delete('/pmaterial/:id', 'deletePrintingMaterial');
/*========= Capacity ====================*/
$app->get('/capacity','getCapacity');
$app->post('/capacity', 'addCapacity');
$app->put('/capacity', 'updateCapacity');
$app->delete('/capacity/:id', 'deleteCapacity');
/*==== Holiday ========*/
$app->get('/holiday','getHoliday');
$app->post('/holiday', 'addHoliday');
$app->put('/holiday', 'updateHoliday');
$app->delete('/holiday/:id', 'deleteHoliday');
/*======Bopp Cost Factor ===========*/
$app->get('/costFactor','getBoppCostFactor');
$app->post('/costFactor', 'addBoppCostFactor');
$app->put('/costFactor', 'updateBoppCostFactor');
$app->delete('/costFactor/:id', 'deleteBoppCostFactor');
/*======Handle Cost  ===========*/
$app->get('/handleCost','getHandleCost');
$app->post('/handleCost', 'addHandleCost');
$app->put('/handleCost', 'updateHandleCost');
$app->delete('/handleCost/:id', 'deleteHandleCost');
/*======Overhead Cost  ===========*/
$app->get('/overhead','getOverheadCost');
$app->post('/overhead', 'addOverheadCost');
$app->put('/overhead', 'updateOverheadCost');
$app->delete('/overhead/:id', 'deleteOverheadCost');
/*======Machine master  ===========*/
$app->get('/machine','getMachine');
$app->post('/machine', 'addMachine');
$app->put('/machine', 'updateMachine');
$app->delete('/machine/:id', 'deleteMachine');

/*=======Bag Type ==========*/
/*$app->get('/bagType','getBagType');*/
$app->post('/bagType', 'bagTypeAction');
/*$app->put('/bagType', 'updateBagType');
$app->delete('/bagType/:id', 'deleteBagType');*/



/******************************** Login **********/
$app->post('/login', 'checkLogin');
$app->put('/login', 'changePassword');
$app->get('/login', 'getStatus');
$app->delete('/login/:id', 'logout');
/*********************************************************/

$app->run();
//======================
function createBackup(){
   $dm = new BackupService();
   $msg = $dm->createBackup();
   echo json_encode($msg);
}
/*========Ink Stock Issue =========*/
function inkIssueAction(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $item = json_decode($body);
  $dm = new IssueInkStock();
   switch ($item->action){
      case 'IssueInk':
      	$details = $dm->issueInk($item);
      break;
      case 'ReadInk':
      	$details = $dm->readInkData();
      	break;
      case 'DeleteInk':
      	$details = $dm->DeleteIssuedInk($item);
      	break;
      case 'InkBrand':
   	  	$details = $dm->readInkBrand();
   	  	break;
   	  case 'InkStock':
   	  	$details = $dm->readInkStock($item);
   	  	break;
   }
   echo json_encode($details);
}
/*========Solvent Stock Issue =========*/
function solventIssueAction(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $item = json_decode($body);
  $dm = new IssueSolventStock();
   switch ($item->action){
      case 'IssueSolvent':
      	$details = $dm->issueSolvent($item);
      break;
      case 'ReadSolvent':
      	$details = $dm->readSolventData();
      	break;
      case 'DeleteSolvent':
      	$details = $dm->DeleteIssuedSolvent($item);
      	break;
   }
   echo json_encode($details);
}
/*Issue Bopp Stock*/
function boppIssueAction(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $item = json_decode($body);
  $dm = new IssueBOPPService();
   switch ($item->action){
      case 'GetRoll':
       $details = $dm->readRolls($item);
      break;
      case 'ReadRolls':
      	$details = $dm->readAvailableRolls($item);
      break;
      case 'Issue':
      	$details = $dm->issue($item);
      break;
      case 'ReadEditable':
      	$details = $dm->readissuedItem($item);
      break;
      case 'viewData':
        $details = $dm->viewIssued($item);
      break;
      case 'Read':
      	$details = $dm->ReadIssued();
      break;
      case 'DeleteGodown':
      	$details = $dm->deleteIssuedGodown($item);
      break;
      case 'ReadOrders':
   	    $details = $dm->ReadPrintNameOrder($item);
   	  break;
   	  case 'ReadIssuedOrders':
   	  	$details = $dm->ReadIssuedPrintNameOrder($item);
   	  break;
   	  case 'IssuedPrintList':
   	    $details = $dm->readIssuedPrintName();
   	  break;
   	  case 'AddLamination':
   	  	$details = $dm->IssueForLamination($item);
   	  break;
   	  case 'AddManufactured':
   	  	$details = $dm->addManufactured($item);
   	  break;
   	  case 'ReadManufactured':
   	  	$details = $dm->ReadManufacturedData();
   	  break;
   	  case 'deleteManufactured':
   	  	$details = $dm->deleteManufacturedData($item);
   	  break;
   	  case 'viewOrder':
   	    $details = $dm->readOrderForView($item);
   	  break;
   	  case 'SolventBrand':
   	  	$details = $dm->readSolventBrand();
   	  	break;
   	  case 'SolventStock':
   	  	$details = $dm->readSolventStock($item);
   	  	break;
   }
   echo json_encode($details);
}
/*===== Form Receive =========*/
function formReceiveAction(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $item = json_decode($body);
  $dm = new FormReceiveService();
   switch ($item->action) {
      case 'PartyList':
       $details = $dm->readPartyList($item);
      break;
      case 'InvoiceDetail':
       $details = $dm->readInvoiceDetail($item);
      break;
      case 'Save':
      $details = $dm->addFormNumber($item);
      break;
      case 'Report':
      $details = $dm->getFormReceivedDetail($item);
      break;
      case 'Pending':
      $details = $dm->getFormPendingDetail();
      break;
      case 'FormList':
      $details = $dm->getFormList();
      break;
      case 'Delete':
      $details = $dm->deleteForm($item);
      break;
      
   }
   echo json_encode($details); 
}
/*despatch Planning*/
function despatchAction(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $item = json_decode($body);
  $dm = new DespatchPlanningService();
   switch ($item->action) {
      case 'ReadPlanedOrder':
       $details = $dm->readPlanOrders($item);
      break;
      case 'Save':
      $details = $dm->addDespatchPlanning($item);
      break;
      case 'EditDespatch':
      $details = $dm->readEditdata($item);
      break;
      case 'Edit':
      $details = $dm->updateDespatchPlanning($item);
      case 'ViewDespatch':
      $details = $dm->readDespatchedPlan($item);
      break;
      case 'ViewReconciliation':
      $details = $dm->readReconciliationData($item);
      break;
   }
   echo json_encode($details);
}
/*daily Planning*/
function planningAction(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new WeeklyPlanningService();
   switch ($item->action) {
      case 'ReadOrder':
       $details = $dm->readPendingOrders($item);
      break;
      case 'Save':
       $details = $dm->addPlanning($item);
        break;
      case 'PlanData':
       $details = $dm->PlannedData($item);
       break;
      case 'Remove':
       $details = $dm->removePlan($item);
       break;
      case 'EditQuantity':
      $details = $dm->editPlanQuantity($item);
      break;
      case 'ViewPlan':
      $details = $dm->getViewData($item);
      break;
      case 'WeekView':
      $details = $dm->getWeeklyReport($item);
      break;
      case 'Holiday':
      $details = $dm->readHolidayList();
      break;
      case 'Transfer':
      $details = $dm->transferPlan($item);
      break;
      case 'ReconciliationView':
      	$details = $dm->getReconciliationData($item);
      break;
   }
   echo json_encode($details);
}
/*======= Handle Cost ==========*/

function getHandleCost(){
  $dm = new HandleCostService();
  $details = $dm->readHandleCost();
  echo json_encode($details);
}
function addHandleCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new HandleCostService();
   $details = $dm->addHandleCost($item);
   echo json_encode($details);
};
function updateHandleCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new HandleCostService();
   $details = $dm->updateHandleCost($item);
   echo json_encode($details);
};
function deleteHandleCost($id){
   $dm = new HandleCostService();
   $delete = $dm->deleteHandleCost($id);
   echo json_encode($delete);
};
/*======= Bopp Cost Factor ========*/
function getBoppCostFactor(){
  $dm = new BoppCostFactorService();
  $details = $dm->readCostFactor();
  echo json_encode($details);
}
function addBoppCostFactor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new BoppCostFactorService();
   $details = $dm->addCostFactor($item);
   echo json_encode($details);
};
function updateBoppCostFactor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new BoppCostFactorService();
   $details = $dm->updateCostFactor($item);
   echo json_encode($details);
};
function deleteBoppCostFactor($id){
   $dm = new BoppCostFactorService();
   $delete = $dm->deleteCostFactor($id);
   echo json_encode($delete);
};
/*=========Bag Type Master ========*/
function bagTypeAction(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $fr = json_decode($body);
   $dm = new BagTypeService();
    switch($fr->action){
        case 'Read':
           $details = $dm->readBag();
        break;
        case 'Add':
           $details = $dm->addBag($fr);
        break;
        case 'Edit':
           $details = $dm->updateBag($fr);
        break;
        case 'Delete':
           $details = $dm->deleteBagType($fr);
        break;
    }
   echo json_encode($details);	
}
/*function getBagType(){
  $dm = new BagTypeService();
  $details = $dm->readBag();
  echo json_encode($details);
}
function addBagType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new BagTypeService();
   $details = $dm->addBag($item);
   echo json_encode($details);
};
function updateBagType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new BagTypeService();
   $details = $dm->updateBag($item);
   echo json_encode($details);
};
function deleteBagType($id){
   $dm = new BagTypeService();
   $delete = $dm->deleteBag($id);
   echo json_encode($delete);
};*/
/*======= machine master ========*/
function getMachine(){
  $dm = new MachineService();
  $details = $dm->readMachine();
  echo json_encode($details);
}
function addMachine(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new MachineService();
   $details = $dm->addMachine($item);
   echo json_encode($details);
};
function updateMachine(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new MachineService();
   $details = $dm->updateMachine($item);
   echo json_encode($details);
};
function deleteMachine($id){
   $dm = new MachineService();
   $delete = $dm->deleteMachine($id);
   echo json_encode($delete);
};
/*======= overhead Cost ========*/
function getOverheadCost(){
  $dm = new OverheadService();
  $details = $dm->readOverheadCost();
  echo json_encode($details);
}
function addOverheadCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new OverheadService();
   $details = $dm->addOverheadCost($item);
   echo json_encode($details);
};
function updateOverheadCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new OverheadService();
   $details = $dm->updateOverheadCost($item);
   echo json_encode($details);
};
function deleteOverheadCost($id){
   $dm = new OverheadService();
   $delete = $dm->deleteOverheadCost($id);
   echo json_encode($delete);
};
/*===== Holiday ==============*/
function getHoliday(){
  $dm = new HolidayService();
  $details = $dm->readHoliday();
  echo json_encode($details);
}
function addHoliday(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new HolidayService();
   $details = $dm->addHoliday($item);
   echo json_encode($details);
};
function updateHoliday(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new HolidayService();
   $details = $dm->updateHoliday($item);
   echo json_encode($details);
};
function deleteHoliday($id){
   $dm = new HolidayService();
   $delete = $dm->deleteHoliday($id);
   echo json_encode($delete);
};
/*===== Capacity ==============*/
function getCapacity(){
  $dm = new CapacityService();
  $details = $dm->readCapacity();
  echo json_encode($details);
}
function addCapacity(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new CapacityService();
   $details = $dm->addCapacity($item);
   echo json_encode($details);
};
function updateCapacity(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new CapacityService();
   $details = $dm->updateCapacity($item);
   echo json_encode($details);
};
function deleteCapacity($id){
   $dm = new CapacityService();
   $delete = $dm->deleteCapacity($id);
   echo json_encode($delete);
};
/*======= Transporter ===========*/
/*function getTransporter(){
  $dm = new TransporterService();
  $details = $dm->readTransporter();
  echo json_encode($details);
}*/
function addTransporter(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $transport = json_decode($body);
   $dm = new TransporterService();
   switch ($transport->action){
    case 'Add':
        $details = $dm->addTransporter($transport);
       break;
    case 'Read':
       $details = $dm->readTransporter();
       break;
    case 'ReadTransporter':
       $details = $dm->readTransporterName();
       break;
   }
  
   echo json_encode($details);
};
function updateTransporter(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $transport = json_decode($body);
   $dm = new TransporterService();
   $details = $dm->updateTransporter($transport);
   echo json_encode($details);
};
function deleteTransporter($id){
   $dm = new TransporterService();
   $delete = $dm->deleteTransporter($id); 
   echo json_encode($delete);
};
/*======== Ammendment ============*/
function getInvoiceDetail($invoice_id){
  $dm = new InvoiceAmmendmentService();
  $details = $dm->readInvoiceforAmmendment($invoice_id);
  echo json_encode($details);
}
function addAmmendedInvoice(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $invoice = json_decode($body);
  $dm = new InvoiceAmmendmentService();
  $details = $dm->addAmmendedInvoice($invoice);
  echo json_encode($details);
}
function updateAmmendedInvoice(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $invoice = json_decode($body);
  $dm = new InvoiceAmmendmentService();
  $details = $dm->updateAmmendedInvoice($invoice);
  echo json_encode($details); 
}
/*======= order report ================*/
function getOrderReport(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $detail = json_decode($body);
   $dm = new DebtorReportService();
   switch ($detail->action) {
   	case 'Read':
   		$details = $dm->readDebtorSummary($detail);
   		break;
   	case 'ReadDebtor':
   		$details = $dm->readDebtor($detail);
   		break;
   	case 'OrderBooking':
   		$details = $dm->getOrder($detail);
   		break;
   	case 'DespatchSummary':
   		$details = $dm->getDespatchSummary($detail);
   	break;
   }
   echo json_encode($details);
}
/*======== get Debtor ==================*/
function getDebtor($type,$sdate){
 $dm = new DebtorReportService();
 switch ($type) {
   case 'summary':
     $details = $dm->readDebtorSummary($sdate);
     break;
  case 'debtor':
     $details = $dm->readDebtor($sdate);
     break;
  case 'DailyOrder':
     $details = $dm->readDailyOrderBooking($sdate);
     break;
 }
 
 echo json_encode($details);
}
/*========= get available stock ************/
function getAvailableStock($id,$status){
  $dm = new CylinderStockService();
  switch ($id){
    case 'Available':
      $details = $dm->readAvailableCylinder($status);
      break;
    case 'Issued':
      $details = $dm->readIssuedCylinder($status);
      break;
  }
  echo json_encode($details);
}
/*============ Add Issued Cylinder *************/
function addIssuedCylinder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $issue = json_decode($body);
   $dm = new CylinderStockService();
   $details = $dm->addIssueCylinder($issue);
   echo json_encode($details);
} 
/*===== Updated Issued Cylinder ==========*/  
function updateIssuedCylinder(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $issue = json_decode($body);
  $dm = new CylinderStockService();
  $details = $dm->updateReturnedCylinder($issue);
  echo json_encode($details);  
}
function updateAllCost(){
  $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $issue = json_decode($body);
   $dm = new CostUpdateService();
   $details = $dm->updateAllCost();
   echo json_encode($details);
}
/******** Tally Invoice *******************/
function getTallyInvoice(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $user = json_decode($body);
   switch($user->action){
      case 'Invoices':
         $dm = new TallyService();
         $details = $dm->authenticateUser($user);
      break;
      case 'Freight':
      case 'freight':
         $dm = new InvoiceFreightService();
         $details = $dm->addInvoiceFreight($user);
      break;
      case 'Debtors':
         $dm = new InvoiceDebtorService();
         $details = $dm->addDebtorAmount($user);
      break;
      default:
         $status = array();
         $status['status'] = "e";
         $status['error'] = "Invalid action.";
         $details = $status;
         break;
   }
   echo json_encode($details);
};
/**************get Invoice Item **************/
function copyOrder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new CopyOrderService();
   switch($item->action){
      case 'show':
        $details = $dm->getExistingOrders($item);
      break;
      case 'copy':
        $details = $dm->copyOrderDetails($item);
      break;
      case 'related':
        $details = $dm->readRelatedOrdersDetails($item);
      break;
      case 'copyDespatch':
        $details = $dm->copyDespatchDetail($item);
      break;
      case 'DespatchDetail':
        $details = $dm->readInvoiceData($item);
      break;
      case 'InvoiceData':
        $details = $dm->readDataForInvoice($item);
      break;
   }
   echo json_encode($details);
};
//========== get stocks Report =========
function getStockReprot($type){
  $dm = new StockReportService();
  switch ($type){
    case 'solventStock':
      $details = $dm->readSolventStock();
      break;
    case 'boppStock':
      $details = $dm->readBOPPStock();
      break;
    case 'inkStock':
      $details = $dm->readInkStock();
      break;
    case 'cylinderStock':
      $details = $dm->readCylinderStock();
      break;
  }
  echo json_encode($details);
}
function stockReportAction(){
  $request = \Slim\Slim::getInstance()->request();
  $body = $request->getBody();
  $item = json_decode($body);
  $dm = new StockReportService();
   switch ($item->action){
	    case 'solventStock':
	      	$details = $dm->readSolventStock($item);
	     	break;
	    case 'inkStock':
	      	$details = $dm->readInkStock($item);
	      	break;
	    case 'boppStock':
	      	$details = $dm->readBOPPStock($item);
	      	break;
      	case 'boppOrderStatus':
      		$details = $dm->getBoppOrderStatus($item);
      		break;
   }
   echo json_encode($details);
}
// ========= get Stocks =============
/*function getStocks($type,$sdate,$edate,$stock){
  $dm = new StockReportService();
  switch ($type) {
    case 'solventStock':
      $details = $dm->readSolventStock($sdate,$edate);
      break;
    
    default:
      $details = $dm->readStocks($type,$sdate,$edate,$stock);
      break;
  }
  echo json_encode($details);
}*/
function readforIssue(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $issue = json_decode($body);
   $dm = new StockReportService();
   $details = $dm->getData($issue);
   echo json_encode($details);
};
/**************get Brand **************/
function getBrand($id,$type){
  $dm = new BrandService();
  switch ($id) {
    case 'All':
      $details = $dm->readBrand();
      break;
    case 'Type':
      $details = $dm->readBrandByType($type);
      break;
  }
  echo json_encode($details);
}
function addBrand(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $brand = json_decode($body);
   $dm = new BrandService();
   $details = $dm->addBrand($brand);
   echo json_encode($details);
};
function updateBrand(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $brand = json_decode($body);
   $dm = new BrandService();
   $details = $dm->updateBrand($brand);
   echo json_encode($details);
};
function deleteBrand($id){
   $dm = new BrandService();
   $delete = $dm->deleteBrand($id);
   echo json_encode($delete);
};
/**************get Item **************/
function getItem($id,$type){
  $dm = new ItemService();
  switch ($id) {
    case 'All':
      $details = $dm->readItem();
      break;
    case 'Type':
      $details = $dm->readItemByType($type);
      break;
  }
  echo json_encode($details);
}
function addItem(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new ItemService();
   $details = $dm->addItem($item);
   echo json_encode($details);
};
function updateItem(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new ItemService();
   $details = $dm->updateItem($item);
   echo json_encode($details);
};
function deleteItem($id){
   $dm = new ItemService();
   $delete = $dm->deleteItem($id);
   echo json_encode($delete);
};
/*************get tally user ****************/
function getTallyUser(){
  $dm = new TallyUserService();
  $details = $dm->readUser();
  echo json_encode($details);
}
function addTallyUser(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $user = json_decode($body);
   $dm = new TallyUserService();
   $details = $dm->addUser($user);
   echo json_encode($details);
};
/**************get Invoice Item **************/
function getInvoiceItem(){
  $dm = new InvoiceItemService();
  $details = $dm->readItem();
  echo json_encode($details);
}
function addInvoiceItem(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new InvoiceItemService();
   switch ($item->action) {
   	case 'Add':
   		$details = $dm->addItem($item);
   		break;
   	case 'Tax':
   		$details = $dm->readExciseTax();
   		break;
   }
   
   echo json_encode($details);
};
function updateInvoiceItem(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $item = json_decode($body);
   $dm = new InvoiceItemService();
   $details = $dm->updateItem($item);
   echo json_encode($details);
};
function deleteInvoiceItem($id){
   $dm = new InvoiceItemService();
   $delete = $dm->deleteItem($id);
   echo json_encode($delete);
};
/************* Filler Cost **************************/
function getFillerCost(){
  $dm = new FillerCostService();
  $details = $dm->readFillerCost();
  echo json_encode($details);
}
function addFillerCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new FillerCostService();
   $details = $dm->addFillerCost($unit);
   echo json_encode($details);
};
function updateFillerCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new FillerCostService();
   $details = $dm->updateFillerCost($unit);
   echo json_encode($details);
};
function deleteFillerCost($id){
   $dm = new FillerCostService();
   $delete = $dm->deleteFillerCost($id);
   echo json_encode($delete);
};
/************* PP Cost **************************/
function getPPCost(){
  $dm = new PPCostService();
  $details = $dm->readPPCost();
  echo json_encode($details);
}
function addPPCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new PPCostService();
   $details = $dm->addPPCost($unit);
   echo json_encode($details);
};
function updatePPCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new PPCostService();
   $details = $dm->updatePPCost($unit);
   echo json_encode($details);
};
function deletePPCost($id){
   $dm = new PPCostService();
   $delete = $dm->deletePPCost($id);
   echo json_encode($delete);
};
/************* LD Cost **************************/
function getLDCost(){
  $dm = new LDCostService();
  $details = $dm->readLDCost();
  echo json_encode($details);
}
function addLDCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new LDCostService();
   $details = $dm->addLDCost($unit);
   echo json_encode($details);
};
function updateLDCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new LDCostService();
   $details = $dm->updateLDCost($unit);
   echo json_encode($details);
};
function deleteLDCost($id){
   $dm = new LDCostService();
   $delete = $dm->deleteLDCost($id);
   echo json_encode($delete);
};
/************* BOPP Cost **************************/
function getBoppCost(){
  $dm = new BoppCostService();
  $details = $dm->readBoppCost();
  echo json_encode($details);
}
function addBoppCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $bopp = json_decode($body);
   $dm = new BoppCostService();
   $details = $dm->addBoppCost($bopp);
   echo json_encode($details);
};
function updateBoppCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new BoppCostService();
   $details = $dm->updateBoppCost($unit);
   echo json_encode($details);
};
function deleteBoppCost($id){
   $dm = new BoppCostService();
   $delete = $dm->deleteBoppCost($id);
   echo json_encode($delete);
}; 
/************* Filter Data ****************************************/

function getFreightRate(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $fr = json_decode($body);
   $dm = new FilterService();
   $details = $dm->readFreight($fr);
   echo json_encode($details);
}
/************** Invoice Report *************************/
function getVatDetail(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $fr = json_decode($body);
   $dm = new InvoiceReportService();
   $details = $dm->readVatDetail($fr);
   echo json_encode($details);
}
function getInvoiceReport($sdate,$edate,$type){
  $dm = new InvoiceReportService();
  switch($type){
  case "CST":
    $details = $dm->readCstDetail($sdate,$edate);
  break;
  case "Freight":
    $details = $dm->readFreightDetail($sdate,$edate);
  break;
  case "InvoiceData":
    $details = $dm->readInvoiceData($sdate,$edate);
  break;
  }             
  echo json_encode($details);
}

//=========Invoice data================
function getInvoiceData($id,$limit,$range,$sd,$ed){
  $dm = new InvoiceDataService();
  $details = $dm->invoiceData($id,$limit,$range,$sd,$ed);
  echo json_encode($details);
}
function updateInvoiceStatus(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $invoice = json_decode($body);
   $dm = new InvoiceDataService();                          
   $details = $dm->updateInvoiceStatus($invoice);
   echo json_encode($details);
};
function updateApprovedData(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $invoice = json_decode($body);
   $dm = new InvoiceDataService();  
   switch ($invoice->action) {
       	case 'ReadEditable':
           $details = $dm->ReadInvoiceForUpdate($invoice);
       	break;
       	case 'UpdateInvoice':
			$details = $dm->updateApprovedInvoice($invoice);
   		break;
   		case 'UpdateRemoval':
			$details = $dm->updateRemovalInvoice($invoice);
   		break;
   }                        
   echo json_encode($details);
};
function deleteInvoiceData($id){
   $dm = new InvoiceDataService();
   $delete = $dm->deleteInvoiceOrder($id);
   echo json_encode($delete);
};

//========Invoice Print ==================
function getInvoice($id,$type){
  $dm = new InvoiceService();
  switch($type){
      case 'I':
        $details = $dm->invoiceDetail($id);
      break;
      case 'C':
        $details = $dm->challanDetail($id);
      break;
      case 'AI':
        $details = $dm->ammendmentDetail($id);
      break;
   }
  //$details = $dm->invoiceDetail($id);
  echo json_encode($details);
}
function addInvoice(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $contact = json_decode($body);
   $dm = new InvoiceService();
   $details = $dm->addInvoice($contact);
   echo json_encode($details);
};
function readInvoiceOrder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $contact = json_decode($body);
   $dm = new InvoiceService();
   $details = $dm->readSelectedOrderDetail($contact);
   echo json_encode($details);
};
function deletePrintList($despatch_id){
   $dm = new ContactService();
   $delete = $dm->deletePrintList($despatch_id);
   echo json_encode($delete);
}

/******************** Cost ***************************/
function getCost($type){
  $dm = new CostService();
  switch($type){
    case "Cost":
      $details = $dm->readCost();
    break;
    case "New":
      $details = $dm->readNewCost();
    break;
  }
  echo json_encode($details);
}
function addCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $tax = json_decode($body);
   $dm = new CostService();
   $details = $dm->addCost($tax);
   echo json_encode($details);
};
function updateCost(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $tax = json_decode($body);
   $dm = new CostService();
   $details = $dm->updateCost($tax);
   echo json_encode($details);
};
function deleteCost($id,$type){
   $dm = new CostService();
   switch($type){
    case "All":
      $delete = $dm->deleteDateWiseCost($id);
    break;
    case "Each":
      $delete = $dm->deleteCost($id);
    break;
  } 
   echo json_encode($delete);
};
/****************** Payment *************************/
function addPayment(){
  $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $data = json_decode($body);
   $dm = new PaymentService();
   $details = $dm->addInvoicePayment($data);
   echo json_encode($details);
}
/*********** Lead Reminder ***************************/
function getReminder($id){
  $dm = new ReminderService();
  $details = $dm->readReminder($id);
  echo json_encode($details);
}
function addReminder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $data = json_decode($body);
   $dm = new ReminderService();
   $details = $dm->addReminder($data);
   echo json_encode($details);
};
/************************Debtor *****************************/
function getDebt(){
  $dm = new DebtorService();
  $details = $dm->readDebtor();
  echo json_encode($details);
}
function addDebt(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $data = json_decode($body);
   $dm = new DebtorService();
   $details = $dm->addDebtor($data);
   echo json_encode($details);
};
function updateDebt(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $data = json_decode($body);
   $dm = new DebtorService();
   $details = $dm->updateDebtor($data);
   echo json_encode($details);
};
function deleteDebt($id){
   $dm = new DebtorService();
   $delete = $dm->deleteDebtor($id);
   echo json_encode($delete);
};
/************************Source *****************************/
function getSource(){
  $dm = new SourceService();
  $details = $dm->readSource();
  echo json_encode($details);
}
function addSource(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new SourceService();
   $details = $dm->addSource($color);
   echo json_encode($details);
};
function updateSource(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new SourceService();
   $details = $dm->updateSource($color);
   echo json_encode($details);
};
function deleteSource($id){
   $dm = new SourceService();
   $delete = $dm->deleteSource($id);
   echo json_encode($delete);
};
/*************** Bank ***************************/
function getBank(){
  $dm = new BankService();
  $details = $dm->readBank();
  echo json_encode($details);
}
function addBank(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $order = json_decode($body);
   $dm = new BankService();
   $details = $dm->addBank($order);
   echo json_encode($details);
}
function updateBank(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $order = json_decode($body);
   $dm = new BankService();
   $details = $dm->updateBank($order);
   echo json_encode($details);
}
function deleteBank($id){
   $dm = new BankService();
   $delete = $dm->deleteBank($id);
   echo json_encode($delete);
}
/*****************Industry********************************/
function getIndustry(){
  $dm = new IndustryService();
  $details = $dm->readIndustry();
  echo json_encode($details);
}
function addIndustry(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new IndustryService();
   $details = $dm->addIndustry($color);
   echo json_encode($details);
};
function updateIndustry(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new IndustryService();
   $details = $dm->updateIndustry($color);
   echo json_encode($details);
};
function deleteIndustry($id){
   $dm = new IndustryService();
   $delete = $dm->deleteIndustry($id);
   echo json_encode($delete);
};
/********************Tax ***************************/
function getTax($type){
  $dm = new TaxService();
  switch ($type) {
    case 'All':
      $details = $dm->readTax();
      break;
    case 'Applicable':
      $details = $dm->readApplicableTax();
      break;
  }
  
  echo json_encode($details);
}
function addTax(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $tax = json_decode($body);
   $dm = new TaxService();
   $details = $dm->addTax($tax);
   echo json_encode($details);
};
function updateTax(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $tax = json_decode($body);
   $dm = new TaxService();
   $details = $dm->updateTax($tax);
   echo json_encode($details);
};
function deleteTax($id){
   $dm = new TaxService();
   $delete = $dm->deleteTax($id);
   echo json_encode($delete);
};
/**************** Detail Report *******************************/
function getDetail($sdate,$edate,$action,$type,$range){
  $dm = new DetailReportService();
  switch($action){
  case "stateWise":
    $details = $dm->readStateWise($sdate,$edate,$type,$range);             
  break;
  case "itemWise":
    $details = $dm->readItemWise($sdate,$edate,$type,$range);             
  break;
  } 
  echo json_encode($details);
}
function packingViewList(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $view = json_decode($body);
   $dm = new DetailReportService();
   $details = $dm->getPackingView($view);
   echo json_encode($details);
};

/************************ Booking Order*****************************/
function getBookingOrder($edate){
  $dm = new BookingReportService();
  $details = $dm->readBookingStatement($edate);             
  echo json_encode($details);
}
function getPartyBooking(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $fr = json_decode($body);
   $dm = new BookingReportService();
   switch ($fr->action) {
     case 'Edit':
       $details = $dm->updateOrder($fr);
       break;
     case 'BOPP':
       $details = $dm->readPendingBOPP($fr);
       break;  
     default:
       $details = $dm->readPartyWiseDetail($fr);
       break;
   }
   echo json_encode($details);
}
function getCube(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $cube = json_decode($body);
   $dm = new BookingReportService();
   $details = $dm->getCubeData($cube);
   echo json_encode($details);
};
/************** Planning Report*****************************/
function getPlanning($sdate,$edate,$range){
  $dm = new ReportService();
  $details = $dm->readPlanning($sdate,$edate,$range);             
  echo json_encode($details);
}
function performReportAction(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $fr = json_decode($body);
   $dm = new ReportService();
    switch($fr->action){
        case 'ammendment':
           $details = $dm->getAmmendedInvoice($fr);
        break;
        case 'rate_difference':
           $details = $dm->getRateDifference($fr);
        break;
        case 'Due':
           $details = $dm->getCommission($fr);
        break;
        case 'Payment Request':
           $details = $dm->getPaymentRequest($fr);
        break;
        case 'Pending':
           $details = $dm->getPendingCommission($fr);
        break;
        case 'Canceled':
           $details = $dm->getCanceledCommission($fr);
        break;
        case 'Deleted':
           $details = $dm->getDeletedCommission($fr);
        break;
        case 'ConfirmCancel':
           $details = $dm->confirmCancel($fr);
        break;
        case 'ConfirmDelete':
           $details = $dm->confirmDelete($fr);
        break;
        case 'Payment':
           $details = $dm->addPaymentDetail($fr);
        break;
        case 'Paid & Cancelled':
           $details = $dm->getPaymentDetail($fr);
        break;
        case 'PaidDetail':
          $details = $dm->getPaymentModeDetail($fr);
        break;
        case 'DeletePayment':
          $details = $dm->confirmDeletePayment($fr);
        break;
        case 'RemoveCommission':
        	$details = $dm->removeCommission($fr);
        break;
        case 'PaymentRequest':
        	$details = $dm->sendPaymentRequest($fr);
        break;
    }
   echo json_encode($details);
}
/*****************Summary *********************************/
function getAllocatedPrintName(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $fr = json_decode($body);
   $dm = new summaryService();
   switch ($fr->type) {
   	case 'Allocated':
   		$details = $dm->readAllocatedPrintList($fr);
   		break;
   	
   	case 'Unallocated':
   		$details = $dm->readUnallocatedPrintList($fr); 
   		break;
   }
   
   echo json_encode($details);
}
function getSummary($sdate,$edate,$type,$range){
  $dm = new summaryService();
  switch($type){
  case "summary":
    $details = $dm->readSummary($sdate,$edate,$range);
  break;
  case "state":
    $details = $dm->readStateWise($sdate,$edate,$range);
  break;
  case "Despatch":
    $details = $dm->readDespatchDetail($sdate,$edate,$range);
  break;
  case "OrderSummary":
    $details = $dm->readOrderSummary($sdate,$edate,$range);
  break;
  case "OrderSummaryDetail":
    $details = $dm->readOrderSummaryDetail($sdate,$edate,$range);
  break;
  case 'Profitability':
    $details = $dm->readOrderProfitability($sdate,$edate,$range);
    break;
  case "shortClose":
    $details = $dm->readShortClose($sdate,$edate,$range);
  break;
  case "Excess":
    $details = $dm->readExcessSupplied($sdate,$edate,$range);
  break;
  /*case "List":
    $details = $dm->readPrintList($sdate,$edate,$range); 
  break;*/
  case "Allocated":
    $details = $dm->readAllocatedPrintList($sdate,$edate,$range); 
  break;
  case "Unallocated":
    $details = $dm->readUnallocatedPrintList($sdate,$edate,$range); 
  break;

  }             
  echo json_encode($details);
}
// ================ Issue Stock =============================
function getIssue($id){
  $dm = new IssueStockService();
  switch ($id) {
    case 'BOPP':
      $details = $dm->readIssuedByType($id);
      break;
    case 'Solvent':
      $details = $dm->readIssuedByType($id);
      break;
    case 'Ink':
      $details = $dm->readIssuedByType($id);
      break;  
    default:
      $details = $dm->readIssue();
      break;
  }
  
  echo json_encode($details);
}
function addIssue(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $issue = json_decode($body);
   $dm = new IssueStockService();
   $details = $dm->addIssueItem($issue);
   echo json_encode($details);
};
function deleteIssue(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $issue = json_decode($body);
   $dm = new IssueStockService();
   $details = $dm->deleteIssue($issue);
   echo json_encode($details);
};
/*function deleteIssue($id){
   $dm = new IssueStockService();
   $delete = $dm->deleteIssue($id); 
   echo json_encode($delete);
};*/
/************************ Ink Stock*****************************/
function getInk(){
  $dm = new InkStockService();
  $details = $dm->readInk();
  echo json_encode($details);
}
function addInk(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $bops = json_decode($body);
   $dm = new InkStockService();
   switch ($bops->action){
   	case 'Save':
   		$details = $dm->addInk($bops);
   		break;
   	case 'readEditable':
   		$details = $dm->getEditabledata($bops);
   		break;
   }
   echo json_encode($details);
};
function updateInk(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $bops = json_decode($body);
   $dm = new InkStockService();
   $details = $dm->updateInk($bops);
   echo json_encode($details);
};
function deleteInk($id){
   $dm = new InkStockService();
   $delete = $dm->deleteInk($id); 
   echo json_encode($delete);
};
/************************ Solvent Stock*****************************/
function getSolvent(){
  $dm = new SolventStockService();
  $details = $dm->readSolvent();
  echo json_encode($details);
}
function addSolvent(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $bops = json_decode($body);
   $dm = new SolventStockService();
   switch ($bops->action){
   	case 'Save':
   		$details = $dm->addSolvent($bops);
   		break;
   	case 'readEditable':
   		$details = $dm->getEditabledata($bops);
   		break;
   }
   
   echo json_encode($details);
};
function updateSolvent(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $bops = json_decode($body);
   $dm = new SolventStockService();
   $details = $dm->updateSolvent($bops);
   echo json_encode($details);
};
function deleteSolvent($id){
   $dm = new SolventStockService();
   $delete = $dm->deleteSolvent($id); 
   echo json_encode($delete);
};
/************************ Bopp Stock*****************************/
function getBopp(){
  $dm = new BoppStockService();
  $details = $dm->readBopp();
  echo json_encode($details);
}
function addBopp(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $bops = json_decode($body);
   $dm = new BoppStockService();
    switch ($bops->action) {
   	case 'Add':
   		$details = $dm->addBopp($bops);
   		break;
   	case 'Edit':
   	    $details = $dm->addBopp($bops);
   		//$details = $dm->updateBopp($bops);
   		break;
   	case 'ReadEdit':
   		$details = $dm->ReadEditable($bops);
   		break;
   	/*case 'ReadRolls':
   		$details = $dm->ReadRollsDetail($bops);
   		break;*/
   	case 'PrintList':
   		$details = $dm->ReadPendingPrintName($bops);
   		break;

   }
   echo json_encode($details);
};
function updateBopp(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $bops = json_decode($body);
   $dm = new BoppStockService();
   $details = $dm->updateBopp($bops);
   echo json_encode($details);
};
function deleteBopp($id){
   $dm = new BoppStockService();
   $delete = $dm->deleteBopp($id); 
   echo json_encode($delete);
};
/*************Vendor********************/

function getVendor($id,$type){
  $dm = new VendorService();
  switch($type){
  case "Read":
     $details = $dm->readVendorTable();
     break;
  case "Edit":
     $details = $dm->readVendor($id);
     break;
  case "List":
     $details = $dm->readVendorList($id);
     break;
     }
  echo json_encode($details);
}
function addVendor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $vendor = json_decode($body);
   $dm = new VendorService();
   $details = $dm->addVendor($vendor);
   echo json_encode($details);
};
function updateVendor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $vendor = json_decode($body);
   $dm = new VendorService();
   $details = $dm->updateVendor($vendor);
   echo json_encode($details);
};
function deleteVendor($id){
   $dm = new VendorService();
   $delete = $dm->deleteVendor($id);
   echo json_encode($delete);
};
/********* Temp Order *****************************/
function getTempOrder($id,$type) {
   $dm = new tempOrderService();
  switch($type){
   case "Read":
      $details = $dm->readSavedOrder();
   break;
   case "Detail":
      $details = $dm->readTempOrderDetail($id);
   break;
   }
   echo json_encode($details);
};
function addTempOrder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $order = json_decode($body);
   $dm = new tempOrderService();
   $details = $dm->saveOrder($order);
   echo json_encode($details);
};
/*function updateTempOrder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $order = json_decode($body);
   $dm = new tempOrderService();
   $details = $dm->updateTempOrder($order);
   echo json_encode($details);
};*/
function deleteTempOrder($id){
   $dm = new tempOrderService();
   $delete = $dm->deleteTempOrder($id);
  echo json_encode($delete);
}
/*************Order ****************************************/
function getOrderDetails($id){
  $dm = new orderView();
  $details = $dm->readOrderDetail($id);
  echo json_encode($details);
}
function updateOrderStatus(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $order = json_decode($body);
   $dm = new orderView();                          
   $details = $dm->updateOrderStatus($order);
   echo json_encode($details);
};

function getOrderEditDetails(){     
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $order = json_decode($body);
   $dm = new orderView();
   $details = $dm->readOrderEditDetail($order);
   echo json_encode($details);
}

function getOrder($stage,$type,$searh) {
   $dm = new orderService();
   switch($type){
   case 'LeadOrder':
      $details = $dm->readLeadOrder($stage);
    break;
    case 'Read':
      $details = $dm->readOrder($stage);
    break;
    case 'Search':
    $details = $dm->readSearchData($stage,$searh);
    break;
    case 'Detail':
      $details = $dm->readOrderEditDetail($stage);
    break;
   }
   echo json_encode($details);
};

function updateOrder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $order = json_decode($body);
   $dm = new orderService();
   $details = $dm->updateOrder($order);
   echo json_encode($details);
};

function addOrder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $order = json_decode($body);
   $dm = new orderService();
   $details = $dm->addOrder($order);
   echo json_encode($details);
};

function deleteOrder($id,$type){
   $dm = new orderService();
   switch($type){
  case "Detail":
     $delete = $dm->deleteOrder($id);
     break;
  case "Image":
     $delete = $dm->deleteImage($id);
     break;
     }
   echo json_encode($delete);
}
//======== truck type ========
function getTruck(){
  $dm = new TruckService();
  $details = $dm->readTruck();
  echo json_encode($details);
}
function addTruck(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $truck = json_decode($body);
   $dm = new TruckService();
   $details = $dm->addTruck($truck);
   echo json_encode($details);
};
function updateTruck(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $truck = json_decode($body);
   $dm = new TruckService();
   $details = $dm->updateTruck($truck);
   echo json_encode($details);
};
function deleteTruck($id){
   $dm = new TruckService();
   $delete = $dm->deleteTruck($id);
   echo json_encode($delete);
};

//======== wastage Percentage ========
function getWastsage(){
  $dm = new WastageService();
  $details = $dm->readWastagePercentage();
  echo json_encode($details);
}
function addWastsage(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $thickness = json_decode($body);
   $dm = new WastageService();
   switch ($thickness->action) {
   	case 'Add':
   		$details = $dm->addWastagePercentage($thickness);
   		break;
   	case 'Activate':
   		$details = $dm->activateWastagePercentage($thickness);
   		break;
    case 'ReadActive':
        $details = $dm->readActivePercentage();
    break;
   }
   echo json_encode($details);
};
function updateWastsage(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $thickness = json_decode($body);
   $dm = new WastageService();
   $details = $dm->updateWastagePercentage($thickness);
   echo json_encode($details);
};
function deleteWastsage($id){
   $dm = new WastageService();
   $delete = $dm->deleteWastage($id);
   echo json_encode($delete);
};

//======== BOPP Finish ========
function getBOPPFinish(){
  $dm = new BOPPFinishService();
  $details = $dm->readFinish();
  echo json_encode($details);
}
function addBOPPFinish(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $thickness = json_decode($body);
   $dm = new BOPPFinishService();
   $details = $dm->addFinish($thickness);
   echo json_encode($details);
};
function updateBOPPFinish(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $thickness = json_decode($body);
   $dm = new BOPPFinishService();
   $details = $dm->updateFinish($thickness);
   echo json_encode($details);
};
function deleteBOPPFinish($id){
   $dm = new BOPPFinishService();
   $delete = $dm->deleteFinish($id);
   echo json_encode($delete);
};
//======== BOPP Thickness ========
function getThickness(){
  $dm = new BOPPThicknessService();
  $details = $dm->readThickness();
  echo json_encode($details);
}
function addThickness(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $thickness = json_decode($body);
   $dm = new BOPPThicknessService();
   $details = $dm->addThickness($thickness);
   echo json_encode($details);
};
function updateThickness(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $thickness = json_decode($body);
   $dm = new BOPPThicknessService();
   $details = $dm->updateThickness($thickness);
   echo json_encode($details);
};
function deleteThickness($id){
   $dm = new BOPPThicknessService();
   $delete = $dm->deleteThickness($id);
   echo json_encode($delete);
};

function getColor(){
  $dm = new ColorService();
  $details = $dm->readColor();
  echo json_encode($details);
}
function addColor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new ColorService();
   $details = $dm->addColor($color);
   echo json_encode($details);
};
function updateColor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new ColorService();
   $details = $dm->updateColor($color);
   echo json_encode($details);
};
function deleteColor($id){
   $dm = new ColorService();
   $delete = $dm->deleteColor($id);
   echo json_encode($delete);
};
/*****************Print Color********************************/
function getPrintColor(){
  $dm = new PrintColorService();
  $details = $dm->readColor();
  echo json_encode($details);
}
function addPrintColor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new PrintColorService();
   $details = $dm->addColor($color);
   echo json_encode($details);
};
function updatePrintColor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new PrintColorService();
   $details = $dm->updateColor($color);
   echo json_encode($details);
};
function deletePrintColor($id){
   $dm = new PrintColorService();
   $delete = $dm->deleteColor($id);
   echo json_encode($delete);
};
/*****************Handle Color********************************/
function getHandleColor(){
  $dm = new HandleColorService();
  $details = $dm->readHandleColor();
  echo json_encode($details);
}
function addHandleColor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new HandleColorService();
   $details = $dm->addHandleColor($color);
   echo json_encode($details);
};
function updateHandleColor(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new HandleColorService();
   $details = $dm->updateHandleColor($color);
   echo json_encode($details);
};
function deleteHandleColor($id){
   $dm = new HandleColorService();
   $delete = $dm->deleteHandleColor($id);
   echo json_encode($delete);
};

/************************Fabric*****************************/
function getFabric(){
  $dm = new FabricService();
  $details = $dm->readFabric();
  echo json_encode($details);
}
function addFabric(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $fabric = json_decode($body);
   $dm = new FabricService();
   $details = $dm->addFAbric($fabric);
   echo json_encode($details);
};
function updateFabric(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $fabric = json_decode($body);
   $dm = new FabricService();
   $details = $dm->updateFabric($fabric);
   echo json_encode($details);
};
function deleteFabric($id){
   $dm = new FabricService();
   $delete = $dm->deleteFabric($id);
   echo json_encode($delete);
};
/******************Cylinder Letter Data ********************/
function getCylinderLetter($id){
  $dm = new CylinderPrintService();
  $details = $dm->readCylinderLetter($id);
  echo json_encode($details);
}
function addCylinderRepair(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $value = json_decode($body);
   $dm = new CylinderPrintService();
   $details = $dm->addRepairdCylinder($value);
   echo json_encode($details);
};
function updateCylinderStatus(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $value = json_decode($body);
   $dm = new CylinderPrintService();         
   $details = $dm->updateCylinderStatus($value);
   echo json_encode($details);
}
/************************Cylinder*****************************/
function getCylinder($type){
  $dm = new CylinderService();
  $details = $dm->readCylinder($type);
  echo json_encode($details);
}
function addCylinder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $value = json_decode($body);
   $dm = new CylinderService();
   $details = $dm->addCylinder($value);       
   echo json_encode($details);
};
function updateCylinder(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $value = json_decode($body);
   $dm = new CylinderService();
   $details = $dm->updateCylinder($value);
   echo json_encode($details);
};
function deleteCylinder($id){
   $dm = new CylinderService();
   $delete = $dm->deleteCylinder($id);
   echo json_encode($delete);
};
/**************************8Construction Material****************/
function getMaterial(){
  $dm = new MeshService();
  $details = $dm->readMaterial();
  echo json_encode($details);
}
function addMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new MeshService();
   $details = $dm->addMaterial($color);
   echo json_encode($details);
};
function updateMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $color = json_decode($body);
   $dm = new MeshService();
   $details = $dm->updateMaterial($color);
   echo json_encode($details);
};
function deleteMaterial($id){
   $dm = new MeshService();
   $delete = $dm->deleteMaterial($id);
   echo json_encode($delete);
};
/**************************Handle Material****************/
function getHandleMaterial(){
  $dm = new HandleMaterialService();
  $details = $dm->readHandleMaterial();
  echo json_encode($details);
}
function addHandleMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $materials = json_decode($body);
   $dm = new HandleMaterialService();
   $details = $dm->addHandleMaterial($materials);
   echo json_encode($details);
};
function updateHandleMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $materials = json_decode($body);
   $dm = new HandleMaterialService();
   $details = $dm->updateHandleMaterial($materials);
   echo json_encode($details);
};
function deleteHandleMaterial($id){
   $dm = new HandleMaterialService();
   $delete = $dm->deleteHandleMaterial($id);
   echo json_encode($delete);
};
/*************************Acc Material****************/
function getAccMaterial(){
  $dm = new AccMaterialService();
  $details = $dm->readAccMaterial();
  echo json_encode($details);
}
function addAccMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $accmaterials = json_decode($body);
   $dm = new AccMaterialService();
   $details = $dm->addAccMaterial($accmaterials);
   echo json_encode($details);
};
function updateAccMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $accmaterials = json_decode($body);
   $dm = new AccMaterialService();
   $details = $dm->updateAccMaterial($accmaterials);
   echo json_encode($details);
};
function deleteAccMaterial($id){
   $dm = new AccMaterialService();
   $delete = $dm->deleteAccMaterial($id);
   echo json_encode($delete);
};
/********************Lead ********************************/
function getLead(){
  $dm = new LeadService();
  $details = $dm->readLead();
  echo json_encode($details);
}
function addLead(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $lead = json_decode($body);
   $dm = new LeadService();
   $details = $dm->addLead($lead);
   echo json_encode($details);
};
function updateLead(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $lead = json_decode($body);
   $dm = new LeadService();
   $details = $dm->updateLead($lead);
   echo json_encode($details);
};
function deleteLead($id){
   $dm = new LeadService();
   $delete = $dm->deleteLead($id);
   echo json_encode($delete);
};
/***********Contact******************************************/
function getContact($id,$type){
  $dm = new ContactService();
  switch($type){
  case "Detail":
   $details = $dm->readContacts($id);
   break;
  case "List":
    $details = $dm->readTraderList();
    break;
  case "partyList":
    $details = $dm->readContactList();
    break;
  case "View":
    $details = $dm->readDetail($id);
    break;
  case "Print":
     $details = $dm->readPrintName($id);
    break;
  case "Freight":
     $details = $dm->readFreight($id);
    break;
  case "Search":
   $details = $dm->searchContacts($id);
   break;
  case "Invoice":
   $details = $dm->readInoviceDetail($id);
   break;  
  case "Consignee":
   $details = $dm->readConsigneeaddress($id);
   break; 
  case "OrderRate":
   $details = $dm->readSelectedOrderDetail($id);
   break;  
  case "Address":
   $details = $dm->readDeliveryAddress($id);
   break;  
   case "Payment":
   $details = $dm->readPaymentTerms($id);
   break;
   case "User":
   $details = $dm->readPartyHandler();
   break;
   case "InvoiceOrder":  
   $details = $dm->readInvoiceData($id);
   break;
   case "DespatchOrder":  
   $details = $dm->readDespatchOrderData($id);
   break;
  }
  echo json_encode($details);
}
function addContact(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $contact = json_decode($body);
   $dm = new ContactService();
   $details = $dm->addContact($contact);
   echo json_encode($details);
};
function updateContact(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $contact = json_decode($body);
   $dm = new ContactService();
   $details = $dm->updateContact($contact);
   echo json_encode($details);
};
function deleteContact($id){
   $dm = new ContactService();
   $delete = $dm->deleteContact($id);
   echo json_encode($delete);
};
/******=====Lead Status=========****/
function getLeadStatus($id,$type){
  $dm = new LeadStatusService();
  switch($type){
  case "Detail":
    $details = $dm->readLeadDetail($id);
    break;
  case "Status":
    $details = $dm->readLeadStatus($id);
    break;
  }
  echo json_encode($details);
}
function addLeadStatus(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $contact = json_decode($body);
   $dm = new LeadStatusService();
   $details = $dm->addLeadStatus($contact);
   
   echo json_encode($details);
};
function deleteLeadStatus(){
  $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $status = json_decode($body);
   $dm = new LeadStatusService();
   $details = $dm->deleteLeadStatus($status);
   echo json_encode($details);
}
/************************Fabric*****************************/
function getUser(){
  $dm = new UserService();
  $details = $dm->readUser();
  echo json_encode($details);
}
function addUser(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $usr = json_decode($body);
   $dm = new UserService();
   $details = $dm->addUser($usr);
   echo json_encode($details);
};
function updateUser(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $user = json_decode($body);
   $dm = new UserService();
   $details = $dm->updateUser($user);
   echo json_encode($details);
};
function deleteUser($id){
   $dm = new UserService();
   $delete = $dm->deleteUser($id);
   echo json_encode($delete);
};
/****************************Order TYpe**************************/

function getOrderType(){
  $dm = new OrderTypeService();
  $details = $dm->readOrderType();
  echo json_encode($details);
}
function addOrderType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
    $orderType = json_decode($body);
   $dm = new OrderTypeService();
   $details = $dm->addOrderType($orderType);
   echo json_encode($details);
};
function updateOrderType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
    $orderType = json_decode($body);
   $dm = new OrderTypeService();
   $details = $dm->updateOrderType($orderType);
   echo json_encode($details);
};
function deleteOrderType($id){
   $dm = new OrderTypeService();
   $delete = $dm->deleteOrderType($id);
   echo json_encode($delete);
};
/****************************PaymentTerms**************************/

function getPaymentTerm(){
  $dm = new PaymentTermService();
  $details = $dm->readPaymentTerm();
  echo json_encode($details);
}
function addPaymentTerm(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
    $payment = json_decode($body);
   $dm = new PaymentTermService();
   $details = $dm->addPaymentTerm($payment);
   echo json_encode($details);
};
function updatePaymentTerm(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
    $payment = json_decode($body);
   $dm = new PaymentTermService();
   $details = $dm->updatePaymentTerm($payment);
   echo json_encode($details);
};
function deletePaymentTerm($id){
   $dm = new PaymentTermService();
   $delete = $dm->deletePaymentTerm($id);
   echo json_encode($delete);
};
/********************Unit******************************/
function getUnit(){
  $dm = new UnitService();
  $details = $dm->readUnit();
  echo json_encode($details);
}
function addUnit(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new UnitService();
   $details = $dm->addUnit($unit);
   echo json_encode($details);
};
function updateUnit(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new UnitService();
   $details = $dm->updateUnit($unit);
   echo json_encode($details);
};
function deleteUnit($id){
   $dm = new UnitService();
   $delete = $dm->deleteUnit($id);
   echo json_encode($delete);
};
/********************Freight******************************/
function getFreight(){
  $dm = new FreightService();
  $details = $dm->readFreight();
  echo json_encode($details);
}
function addFreight(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new FreightService();
   $details = $dm->addFreight($unit);
   echo json_encode($details);
};
function updateFreight(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new FreightService();
   $details = $dm->updateFreight($unit);
   echo json_encode($details);
};
function deleteFreight($id){
   $dm = new FreightService();
   $delete = $dm->deleteFreight($id);
   echo json_encode($delete);
};
/********************Form Service******************************/
function getForm(){
  $dm = new FormService();
  $details = $dm->readForm();
  echo json_encode($details);
}
function addForm(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new FormService();
   $details = $dm->addForm($unit);
   echo json_encode($details);
};
function updateForm(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $unit = json_decode($body);
   $dm = new FormService();
   $details = $dm->updateForm($unit);
   echo json_encode($details);
};
function deleteForm($id){
   $dm = new FormService();
   $delete = $dm->deleteForm($id);
   echo json_encode($delete);
};
/********************Handle Type*****************************/
function getHandleType(){
  $dm = new HandleTypeService();
  $details = $dm->readHandleType();
  echo json_encode($details);
}
function addHandleType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $handletype = json_decode($body);
   $dm = new HandleTypeService();
   $details = $dm->addHandleType($handletype);
   echo json_encode($details);
};
function updateHandleType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $handletype = json_decode($body);
   $dm = new HandleTypeService();
   $details = $dm->updateHandleType($handletype);
   echo json_encode($details);
};
function deleteHandleType($id){
   $dm = new HandleTypeService();
   $delete = $dm->deleteHandleType($id);
   echo json_encode($delete);
};
/********************Quality Type*****************************/
function getQualityType(){
  $dm = new QualityTypeService();
  $details = $dm->readQualityType();
  echo json_encode($details);
}
function addQualityType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $qualitytype = json_decode($body);
   $dm = new QualityTypeService();
   $details = $dm->addQualityType($qualitytype);
   echo json_encode($details);
};
function updateQualityType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $qualitytype = json_decode($body);
   $dm = new QualityTypeService();
   $details = $dm->updateQualityType($qualitytype);
   echo json_encode($details);
};
function deleteQualityType($id){
   $dm = new QualityTypeService();
   $delete = $dm->deleteQualityType($id);
   echo json_encode($delete);
};
/********************ThreadType*****************************/
function getThreadType(){
  $dm = new ThreadTypeService();
  $details = $dm->readThreadType();
  echo json_encode($details);
}
function addThreadType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $thread = json_decode($body);
   $dm = new ThreadTypeService();
   $details = $dm->addThreadType($thread);
   echo json_encode($details);
};
function updateThreadType(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $thread = json_decode($body);
   $dm = new ThreadTypeService();
   $details = $dm->updateThreadType($thread);
   echo json_encode($details);
};
function deleteThreadType($id){
   $dm = new ThreadTypeService();
   $delete = $dm->deleteThreadType($id);
   echo json_encode($delete);
};
/********************Raw Material*******************************/
function getRawMaterial(){
  $dm = new RawMaterialService();
  $details = $dm->readRawMaterial();
  echo json_encode($details);
}
function addRawMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new RawMaterialService();
   $details = $dm->addRawMaterial($raw);
   echo json_encode($details);
};
function updateRawMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new RawMaterialService();
   $details = $dm->updateRawMaterial($raw);
   echo json_encode($details);
};
function deleteRawMaterial($id){
   $dm = new RawMaterialService();
   $delete = $dm->deleteRawMaterial($id);
   echo json_encode($delete);
};
/********************Raw Material*******************************/
function getHandle(){
  $dm = new HandleService();
  $details = $dm->readHandle();
  echo json_encode($details);
}
function addHandle(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new HandleService();
   $details = $dm->addHandle($raw);
   echo json_encode($details);
};
function updateHandle(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new HandleService();
   $details = $dm->updateHandle($raw);
   echo json_encode($details);
};
function deleteHandle($id){
   $dm = new HandleService();
   $delete = $dm->deleteHandle($id);
   echo json_encode($delete);
};
/********************Thread******************************/
function getThread(){
  $dm = new ThreadService();
  $details = $dm->readThread();
  echo json_encode($details);
}
function addThread(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new ThreadService();
   $details = $dm->addThread($raw);
   echo json_encode($details);
};
function updateThread(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new ThreadService();
   $details = $dm->updateThread($raw);
   echo json_encode($details);
};
function deleteThread($id){
   $dm = new ThreadService();
   $delete = $dm->deleteThread($id);
   echo json_encode($delete);
};
/*******************Accessory******************************/
function getAcc(){
  $dm = new AccService();
  $details = $dm->readAcc();
  echo json_encode($details);
}
function addAcc(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new AccService();
   $details = $dm->addAcc($raw);
   echo json_encode($details);
};
function updateAcc(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new AccService();
   $details = $dm->updateAcc($raw);
   echo json_encode($details);
};
function deleteAcc($id){
   $dm = new AccService();
   $delete = $dm->deleteAcc($id);
   echo json_encode($delete);
};
/*******************printing material*****************************/
function getPrintingMaterial(){
  $dm = new PrintingMaterialService();
  $details = $dm->readPrintingMaterial();
  echo json_encode($details);
}
function addPrintingMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new PrintingMaterialService();
   $details = $dm->addPrintingMaterial($raw);
   echo json_encode($details);
};
function updatePrintingMaterial(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $raw = json_decode($body);
   $dm = new PrintingMaterialService();
   $details = $dm->updatePrintingMaterial($raw);
   echo json_encode($details);
};
function deletePrintingMaterial($id){
   $dm = new PrintingMaterialService();
   $delete = $dm->deletePrintingMaterial($id);
   echo json_encode($delete);
};
/*************************** Login ******************************/
function checkLogin(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $user = json_decode($body);
   $dm = new Login();
   $updated_staff = $dm->checkLogin($user);
   echo json_encode($updated_staff);
};
function getStatus(){
   $dm = new Login();
   $updated_staff = $dm->getStatus();
   echo json_encode($updated_staff);
};
function logout($id){
   $dm = new Login();
   $updated_staff = $dm->logout($id);
};
function changePassword(){
   $request = \Slim\Slim::getInstance()->request();
   $body = $request->getBody();
   $user = json_decode($body);
   $dm = new Login();
   $updated_staff = $dm->changePassword($user);
   echo json_encode($updated_staff);
};
?>
