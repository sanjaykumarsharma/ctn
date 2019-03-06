<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

require 'modules/LoginService.php';
require 'modules/IndentService.php';

/*masters*/
require 'modules/DepartmentService.php';
require 'modules/LocationService.php';
require 'modules/ChargeheadService.php';
require 'modules/StockTypeService.php';
require 'modules/UomService.php';
require 'modules/ConditionService.php';
require 'modules/TaxService.php';
require 'modules/BlendService.php';
require 'modules/ItemGroupService.php';
require 'modules/ItemSubgroupService.php';
require 'modules/PartyService.php';
require 'modules/ItemService.php';
require 'modules/FinancialYearService.php';

require 'modules/PurchaseOrderService.php';
require 'modules/DocketService.php';
require 'modules/RejectToPartyService.php';
require 'modules/OpeningStockService.php';
require 'modules/IssueToDepartmentService.php';
require 'modules/ReceiveService.php';
require 'modules/ReturnToStockService.php';

/*reports*/
require 'modules/StockSummaryService.php';
require 'modules/StockStatementService.php';
require 'modules/DocketReportService.php';
require 'modules/StockReportService.php';
require 'modules/IssueToDepartmentReportService.php';
require 'modules/ReturnToStockReportService.php';
require 'modules/RejectToPartyReportService.php';
require 'modules/IndentReportService.php';
require 'modules/POReportService.php';

$app = new \Slim\Slim();
$app->post('/login', 'performLoginAction');
$app->post('/indent', 'performIndentAction');
$app->post('/po', 'performPurchaseOrderAction');
$app->post('/docket', 'performDocketAction');
$app->post('/rejecttoparty', 'performRejectToPartyAction');
$app->post('/openingstock', 'performOpeningStockAction');
$app->post('/issuetodepartment', 'performIssueToDepartmentAction');
$app->post('/receive', 'performReceivetAction');
$app->post('/returntostock', 'performReturnToStockAction');


/*masters*/
$app->post('/category', 'performCategoryAction');
$app->post('/department', 'performDepartmentAction');
$app->post('/location', 'performLocationAction');
$app->post('/chargehead', 'performChargeheadAction');
$app->post('/stock-type', 'performStockTypeAction');
$app->post('/uom', 'performUomAction');
$app->post('/condition', 'performConditionAction');
$app->post('/tax', 'performTaxAction');
$app->post('/blend', 'performBlendAction');
$app->post('/item-group', 'performItemGroupAction');
$app->post('/item-subgroup', 'performItemSubgroupAction');
$app->post('/party', 'performPartyAction');
$app->post('/item', 'performItemAction');
$app->post('/activity', 'performActivityAction');
$app->post('/expense-type', 'performExpenseTypeAction');
$app->post('/financial-year', 'performFinancialYearAction');

/*reports*/
$app->post('/docket-report', 'performDocketReportAction');
$app->post('/stock-report', 'performStockReportAction');
$app->post('/issuetodepartment-report', 'performIssuetodepartmentReportAction');
$app->post('/returntostock-report', 'performReturnToStockReportAction');
$app->post('/rejecttoparty-report', 'performRejectToPartyReportAction');
$app->post('/indent-report', 'performIndentReportAction');
$app->post('/po-report', 'performPOReportAction');
$app->post('/stock-statement', 'performStockStatementAction');
$app->post('/stock-summery', 'performStockSummaryAction');

date_default_timezone_set('Asia/Kolkata');
$app->run();

function performLoginAction(){
    //checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new LoginService();
    $data = json_decode($body);
    switch($data->action){
        case 'login':
            $ts = $dm->checkLogin($data);
        break;
        case 'logout':
            $ts = $dm->doLogout($data);
        break;
        case 'changePassword':
            $ts = $dm->changePassword($data);
        break;
        case 'login_status':{
          $ts = array();
          $ts['status'] = "s";
          if(isset($_SESSION['LSE_USER_ID'])){
            $ts['username'] = $_SESSION['LSE_USER_ID'];
    				$ts['role'] = $_SESSION['LSE_ROLE'];
          }else{
            $ts['role'] = 'NA';
          }
        }
    }
    $output = json_encode($ts);
    echo $output;
};

function performIndentAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new IndentService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readIndents($data);
        break;
        case 'readIndentNo':
            $ts = $dm->readIndentNo($data);
        break;
        case 'readItemsForIndent':
            $ts = $dm->readItemsForIndent($data);
        break;
        case 'readIndentEdit':
            $ts = $dm->readIndentEdit($data);
        break;
        case 'readIndentView':
            $ts = $dm->readIndentView($data);
        break;
        case 'delete':
            $ts = $dm->deleteIndent($data);
        break;
        case 'edit':
            $ts = $dm->editIndent($data);
        break;
        case 'editIndentStatus':
            $ts = $dm->editIndentStatus($data);
        break;
        case 'add':
            $ts = $dm->addIndent($data);
        break;
        case 'search_items':
            $ts = $dm->searchItems($data);
        break;
        case 'fetchUserDetailsFromSessionForIndent':
            $ts = $dm->fetchUserDetailsFromSessionForIndent();
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performPurchaseOrderAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new PurchaseOrderService();
    $data = json_decode($body);
    switch($data->action){
        case 'readIndentsForPOAddition':
            $ts = $dm->readIndentsForPOAddition($data);
        break;
        case 'read':
            $ts = $dm->readPurchaseOrders($data);
        break;
        case 'readPoNo':
            $ts = $dm->readPoNo($data);
        break;
        case 'readIndentsForPurchaseOrder':
            $ts = $dm->readIndentsForPurchaseOrder($data);
        break;
        case 'readPurchaseOrderView':
            $ts = $dm->readPurchaseOrderView($data);
        break;
        case 'readPurchaseOrderViewWithoutIndent':
            $ts = $dm->readPurchaseOrderViewWithoutIndent($data);
        break;
        case 'readPurchaseOrderEdit':
            $ts = $dm->readPurchaseOrderEdit($data);
        break;
        case 'readIndentEdit':
            $ts = $dm->readIndentEdit($data);
        break;
        case 'readPurchaseOrderEditWithoutIndent':
            $ts = $dm->readPurchaseOrderEditWithoutIndent($data);
        break;
        case 'delete':
            $ts = $dm->deletePurchaseOrder($data);
        break;
        case 'completePO':
            $ts = $dm->completePO($data);
        break;
        case 'edit':
            $ts = $dm->editPurchaseOrder($data);
        break;
        case 'editPOWithoutIndent':
            $ts = $dm->editPOWithoutIndent($data);
        break;
        case 'editPurchaseOrderStatus':
            $ts = $dm->editPurchaseOrderStatus($data);
        break;
        case 'add':
            $ts = $dm->addPurchaseOrder($data);
        break;
        case 'addPurchaseOrderWithoutIndent':
            $ts = $dm->addPurchaseOrderWithoutIndent($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};


function performDocketAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new DocketService();
    $data = json_decode($body);
    switch($data->action){
        case 'readPOForDocket':
            $ts = $dm->readPOForDocket($data);
        break;
        case 'readMaterials':
            $ts = $dm->readMaterials($data);
        break;
        case 'saveDocket':
            $ts = $dm->saveDocket($data);
        break;
        case 'editDocket':
            $ts = $dm->editDocket($data);
        break;
        case 'readDocket':
            $ts = $dm->readDocket($data);
        break;
        case 'readDocketDetails':
            $ts = $dm->readDocketDetails($data);
        break;
        case 'readDocketDetailsEdit':
            $ts = $dm->readDocketDetailsEdit($data);
        break;
        case 'deleteDocket':
            $ts = $dm->deleteDocket($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performRejectToPartyAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new RejectToPartyService();
    $data = json_decode($body);
    switch($data->action){
        case 'readRejectedDocket':
            $ts = $dm->readRejectedDocket($data);
        break;
        case 'readDocketToReject':
            $ts = $dm->readDocketToReject($data);
        break;
        case 'readDocketDetails':
            $ts = $dm->readDocketDetails($data);
        break;
        case 'readDocketDetailsRejectToParty':
            $ts = $dm->readDocketDetailsRejectToParty($data);
        break;
        case 'rejectToParty':
            $ts = $dm->rejectToParty($data);
        break;
        case 'deleteRejectToParty':
            $ts = $dm->deleteRejectToParty($data);
        break;
        case 'readRjectedDocketDetailsEdit':
            $ts = $dm->readRjectedDocketDetailsEdit($data);
        break;
        case 'rejectToPartyEdit':
            $ts = $dm->rejectToPartyEdit($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performOpeningStockAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new OpeningStockService();
    $data = json_decode($body);
    switch($data->action){
        case 'addOpeningStock':
            $ts = $dm->addOpeningStock($data);
        break;
        case 'editOpeningStock':
            $ts = $dm->editOpeningStock($data);
        break;
        case 'readItems':
            $ts = $dm->readItems($data);
        break;
        case 'readOpeningStock':
            $ts = $dm->readOpeningStock($data);
        break;
        case 'searchItemsOfOpeningStock':
            $ts = $dm->searchItems($data);
        break;
        case 'searchItemsForOpeningStock':
            $ts = $dm->searchItemsForOpeningStock($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performIssueToDepartmentAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new IssueToDepartmentService();
    $data = json_decode($body);
    switch($data->action){
        case 'addIssueToDepartment':
            $ts = $dm->addIssueToDepartment($data);
        break;
        case 'readItems':
            $ts = $dm->readItems($data);
        break;
        case 'readIssuedItems':
            $ts = $dm->readIssuedItems($data);
        break;
        case 'readIssueToDepartment':
            $ts = $dm->readIssueToDepartment($data);
        break;
        case 'readItemsForIssueEdit':
            $ts = $dm->readItemsForIssueEdit($data);
        break;
        case 'editIssueToDepartment':
            $ts = $dm->editIssueToDepartment($data);
        break;
        case 'readIssueNumber':
            $ts = $dm->readIssueNumber($data);
        break;
        case 'readView':
            $ts = $dm->readView($data);
        break;
        case 'deleteIssue':
            $ts = $dm->deleteIssue($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performReceivetAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ReceiveService();
    $data = json_decode($body);
    switch($data->action){
        case 'addReceive':
            $ts = $dm->addReceive($data);
        break;
        case 'readItems':
            $ts = $dm->readItems($data);
        break;
        case 'readReceivedItems':
            $ts = $dm->readReceivedItems($data);
        break;
        case 'readReceiveToDepartment':
            $ts = $dm->readReceiveToDepartment($data);
        break;
        case 'readItemsForReceiveEdit':
            $ts = $dm->readItemsForReceiveEdit($data);
        break;
        case 'editReceiveToDepartment':
            $ts = $dm->editReceiveToDepartment($data);
        break;
        case 'readReceiveNumber':
            $ts = $dm->readReceiveNumber($data);
        break;
        case 'readView':
            $ts = $dm->readView($data);
        break;
        case 'deleteReceive':
            $ts = $dm->deleteReceive($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performReturnToStockAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ReturnToStockService();
    $data = json_decode($body);
    switch($data->action){
        case 'readIssuedItems':
            $ts = $dm->readIssuedItems($data);
        break;
        case 'readReturnedItems':
            $ts = $dm->readReturnedItems($data);
        break;
        case 'returnToStock':
            $ts = $dm->returnToStock($data);
        break;
        case 'readIssuedItemsForReturn':
            $ts = $dm->readIssuedItemsForReturn($data);
        break;
        case 'readReturnToStockView':
            $ts = $dm->readReturnToStockView($data);
        break;
        case 'deleteReturnToStock':
            $ts = $dm->deleteReturnToStock($data);
        break;
        case 'readReturnToStockEdit':
            $ts = $dm->readReturnToStockEdit($data);
        break;
        case 'returnToStockEdit':
            $ts = $dm->returnToStockEdit($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performCategoryAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new CategoryService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readCategories();
        break;
        case 'delete':
            $ts = $dm->deleteCategory($data);
        break;
        case 'edit':
            $ts = $dm->editCategory($data);
        break;
        case 'add':
            $ts = $dm->addCategory($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performDepartmentAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new DepartmentService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readDepartments();
        break;
        case 'delete':
            $ts = $dm->deleteDepartment($data);
        break;
        case 'edit':
            $ts = $dm->editDepartment($data);
        break;
        case 'add':
            $ts = $dm->addDepartment($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};


function performLocationAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new LocationService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readLocations();
        break;
        case 'delete':
            $ts = $dm->deleteLocation($data);
        break;
        case 'edit':
            $ts = $dm->editLocation($data);
        break;
        case 'add':
            $ts = $dm->addLocation($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};


function performChargeheadAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ChargeheadService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readChargeheads();
        break;
        case 'delete':
            $ts = $dm->deleteChargehead($data);
        break;
        case 'edit':
            $ts = $dm->editChargehead($data);
        break;
        case 'add':
            $ts = $dm->addChargehead($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performStockTypeAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new StockTypeService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readStockTypes();
        break;
        case 'readStockTypeDetails':
            $ts = $dm->readStockTypeDetails();
        break;
        case 'delete':
            $ts = $dm->deleteStockType($data);
        break;
        case 'edit':
            $ts = $dm->editStockType($data);
        break;
        case 'add':
            $ts = $dm->addStockType($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performUomAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new UomService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readUoms();
        break;
        case 'delete':
            $ts = $dm->deleteUom($data);
        break;
        case 'edit':
            $ts = $dm->editUom($data);
        break;
        case 'add':
            $ts = $dm->addUom($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performConditionAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ConditionService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readConditions();
        break;
        case 'delete':
            $ts = $dm->deleteCondition($data);
        break;
        case 'edit':
            $ts = $dm->editCondition($data);
        break;
        case 'add':
            $ts = $dm->addCondition($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performTaxAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new TaxService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readTaxes();
        break;
        case 'delete':
            $ts = $dm->deleteTax($data);
        break;
        case 'edit':
            $ts = $dm->editTax($data);
        break;
        case 'add':
            $ts = $dm->addTax($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performFinancialYearAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new FinancialYearService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readFinancialYear();
        break;
        case 'delete':
            $ts = $dm->deleteFinancialYear($data);
        break;
        case 'edit':
            $ts = $dm->editFinancialYear($data);
        break;
        case 'add':
            $ts = $dm->addFinancialYear($data);
        break;
        case 'activateFinancialYear':
            $ts = $dm->activateFinancialYear($data);
        break;
        case 'db_backup':
            $ts = $dm->dbBackup();
        break;
        case 'db_store':
            $ts = $dm->dbStore();
        break;
        case 'db_running_amount':
            $ts = $dm->dbRunningAmount();
        break;
        case 'db_opening_stock':
            $ts = $dm->dbOpeningStock();
        break;
    }
    $output = json_encode($ts);
    echo $output;
};


function performBlendAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new BlendService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readBlends();
        break;
        case 'delete':
            $ts = $dm->deleteBlend($data);
        break;
        case 'edit':
            $ts = $dm->editBlend($data);
        break;
        case 'add':
            $ts = $dm->addBlend($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};


function performItemGroupAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ItemGroupService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readItemGroups();
        break;
        case 'delete':
            $ts = $dm->deleteItemGroup($data);
        break;
        case 'edit':
            $ts = $dm->editItemGroup($data);
        break;
        case 'add':
            $ts = $dm->addItemGroup($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performItemSubgroupAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ItemSubgroupService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readItemSubgroups();
        break;
        case 'delete':
            $ts = $dm->deleteItemSubgroup($data);
        break;
        case 'edit':
            $ts = $dm->editItemSubgroup($data);
        break;
        case 'add':
            $ts = $dm->addItemSubgroup($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performPartyAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new PartyService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readParties();
        break;
        case 'delete':
            $ts = $dm->deleteParty($data);
        break;
        case 'edit':
            $ts = $dm->editParty($data);
        break;
        case 'add':
            $ts = $dm->addParty($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};


function performItemAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ItemService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readItems($data);
        break;
        case 'read_items_filter':
            $ts = $dm->readItemsFilter($data);
        break;
        case 'delete':
            $ts = $dm->deleteItem($data);
        break;
        case 'edit':
            $ts = $dm->editItem($data);
        break;
        case 'add':
            $ts = $dm->addItem($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

 function performActivityAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ActivityService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readActivities();
        break;
        case 'delete':
            $ts = $dm->deleteActivity($data);
        break;
        case 'edit':
            $ts = $dm->editActivity($data);
        break;
        case 'add':
            $ts = $dm->addActivity($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performExpenseTypeAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ExpenseTypeService();
    $data = json_decode($body);
    switch($data->action){
        case 'read':
            $ts = $dm->readExpenseTypes();
        break;
        case 'delete':
            $ts = $dm->deleteExpenseType($data);
        break;
        case 'edit':
            $ts = $dm->editExpenseType($data);
        break;
        case 'add':
            $ts = $dm->addExpenseType($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performStockSummaryAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new StockSummaryService();
    $data = json_decode($body);
    switch($data->action){
        case 'readStockSummary':
            $ts = $dm->readStockSummary($data);
        break;
        case 'readItemsForIndent':
            $ts = $dm->readItemsForIndent($data);
        break;
         case 'searchItems':
            $ts = $dm->searchItems($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performStockStatementAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new StockStatementService();
    $data = json_decode($body);
    switch($data->action){
        case 'readStockStatement':
            $ts = $dm->readStockStatement($data);
        break;
        case 'readPendingPO':
            $ts = $dm->readPendingPO($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performDocketReportAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new DocketReportService();
    $data = json_decode($body);
    switch($data->action){
        case 'readDocketRegisterDateWise':
            $ts = $dm->readDocketRegisterDateWise($data);
        break;
        case 'readDocketReport':
            $ts = $dm->readDocketReport($data);
        break;
        case 'readDocketRegisterPartyWise':
            $ts = $dm->readDocketRegisterPartyWise($data);
        break;
        case 'readDocketRegisterItemWise':
            $ts = $dm->readDocketRegisterItemWise($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performIssuetodepartmentReportAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new IssueToDepartmntReportService();
    $data = json_decode($body);
    switch($data->action){
        case 'readIssueToDepartmentDateWise':
            $ts = $dm->readIssueToDepartmentDateWise($data);
        break;
        case 'readIssueToDepartmentItemWise':
            $ts = $dm->readIssueToDepartmentItemWise($data);
        break;
        case 'readIssueToDepartmentDeptWise':
            $ts = $dm->readIssueToDepartmentDeptWise($data);
        break;
        case 'readIssueToDepartmentLocationWise':
            $ts = $dm->readIssueToDepartmentLocationWise($data);
        break;
        case 'readIssueToDepartmentChargeHeadWise':
            $ts = $dm->readIssueToDepartmentChargeHeadWise($data);
        break;
        case 'readReceiveForStockAdjustment':
            $ts = $dm->readReceiveForStockAdjustment($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performReturnToStockReportAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new ReturnToStockReportService();
    $data = json_decode($body);
    switch($data->action){
        case 'readReturnToStockDateWise':
            $ts = $dm->readReturnToStockDateWise($data);
        break;
        case 'readReturnToStockItemWise':
            $ts = $dm->readReturnToStockItemWise($data);
        break;
        case 'readReturnToStockDepartmentWise':
            $ts = $dm->readReturnToStockDepartmentWise($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performRejectToPartyReportAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new RejectToPartyReportService();
    $data = json_decode($body);
    switch($data->action){
        case 'readRejectToPartyDateWise':
            $ts = $dm->readRejectToPartyDateWise($data);
        break;
        case 'readRejectToPartyDocketDateWise':
            $ts = $dm->readRejectToPartyDocketDateWise($data);
        break;
        case 'readRejectToPartyItemWise':
            $ts = $dm->readRejectToPartyItemWise($data);
        break;
        case 'readRejectToPartyPartyWise':
            $ts = $dm->readRejectToPartyPartyWise($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performIndentReportAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new IndentReportService();
    $data = json_decode($body);
    switch($data->action){
        case 'readIndentDateWise':
            $ts = $dm->readIndentDateWise($data);
        break;
        case 'readIndentItemWise':
            $ts = $dm->readIndentItemWise($data);
        break;
        case 'readIndentReport':
            $ts = $dm->readIndentReport($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performPOReportAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new POReportService();
    $data = json_decode($body);
    switch($data->action){
        case 'readPODateWise':
            $ts = $dm->readPODateWise($data);
        break;
        case 'readPOReport':
            $ts = $dm->readPOReport($data);
        break;
        case 'readPOPartyWise':
            $ts = $dm->readPOPartyWise($data);
        break;
        case 'readPOItemWise':
            $ts = $dm->readPOItemWise($data);
        break;
        case 'readPOSuppliedMaterial':
            $ts = $dm->readPOSuppliedMaterial($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};

function performStockReportAction(){
    checkLoginStatusFromSession();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dm = new StockReportService();
    $data = json_decode($body);
    switch($data->action){
        case 'readStockDateWise':
            $ts = $dm->readStockDateWise($data);
        break;
        case 'readStockMovementRegisterItemWise':
            $ts = $dm->readStockMovementRegisterItemWise($data);
        break;
        case 'readStockValuationSummryStoreTypeWise':
            $ts = $dm->readStockValuationSummryStoreTypeWise($data);
        break;
        case 'readStockValuationSummryLocationWise':
            $ts = $dm->readStockValuationSummryLocationWise($data);
        break;
        case 'readStockLedgerAvgValuationDetails':
            $ts = $dm->readStockLedgerAvgValuationDetails($data);
        break;
        case 'readStockLedgerAvgValuationSummry':
            $ts = $dm->readStockLedgerAvgValuationSummry($data);
        break;
    }
    $output = json_encode($ts);
    echo $output;
};


function checkLoginStatusFromSession(){
    if(isset($_SESSION['NTC_USER_ID'])){
        //echo json_encode('checkLoginStatusFromSession');
       return true;
    }else {
       $wrapper['status'] = 'e';
       $wrapper['error'] = 'Session expired! Please relogin';
       echo json_encode($wrapper);
       exit (0);
    }
}
/*make item_id + financial_year_id as primary key*/
/*insert into stock_in_hand (item_id,qty,financial_year_id) select item_id,qty,'2' from stock_in_hand where financial_year_id=1*/
/*insert into transaction (financial_year_id, item_id, qty, running_balance, transaction_date, transaction_type) 
 select '2', item_id, qty, qty, '2018-04-01', 'O' from stock_in_hand where financial_year_id=1 and item_id in(select item_id from item_master)*/
/*make docket_no + stock_type_code + financial_year_id as primary key*/

/*insert into stock_in_hand (item_id,qty,financial_year_id)
select item_id, '0' as qty, '2' as financial_year_id  from item_master where item_id not in (SELECT item_id FROM stock_in_hand WHERE financial_year_id=2)*/

/*
query to check indent status
SELECT a.indent_id, indent_no, stock_type_code,b.qty, b.po_qty
FROM indents a
JOIN indent_material_map b ON a.indent_id = b.indent_id
AND a.financial_year_id =2
AND completed =  'Y'
AND b.qty != b.po_qty*/
?>

