<?php
require_once 'conf.php';
class ReturnToStockReportService{

  public function readReturnToStockDateWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         $condition='and stock_type_code in ('.$d->stock_type_code.')';

         $query = "select return_to_stock_id, stock_type_code, return_to_stock_no,
                   date_format(return_date, '%d/%m/%Y') as return_date, return_by
                   from return_to_stock 
                   where (return_date between :start_date and :end_date) 
                   " .$condition. " 
                   and financial_year_id=:financial_year_id
                   order by return_date asc, return_to_stock_id asc";

         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetchAll();
         
         $prev_date='';
         $returnArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_date==''){//loop run first time
            $obj=array();
            $prev_date=$value['return_date'];
            $obj[]=$value;
           }else if($prev_date==$value['return_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['return_date']){// new date starts
            $returnArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['return_date'];
            $obj[]=$value;
           }
         }
         $returnArray[$prev_date]=$obj;
                   
         $query = "select return_to_stock_id, a.item_id, item_name, item_description, return_to_stock_qty,
                   date_format(transaction_date, '%d/%m/%Y') as return_date, 
                   remarks, uom_code, max_level, min_level, b.location
                   from transaction a 
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on b.item_id = c.item_id
                   where (transaction_date between :start_date and :end_date)
                  " .$condition. " 
                  and transaction_type='RS'
                  and a.financial_year_id=:financial_year_id
                  order by a.transaction_date asc, return_to_stock_id asc";

           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();
            
            $mainArray=array(); 
           foreach ($returnArray as $key => $value) { //Issue details array

              $issueMain=array();//for one issue transactions
              foreach ($value as $key1 => $value1) { //array of all issues of one date
                  $issueTransactions=array();
                  foreach ($transactions as $key2 => $value2) { //Issue transactions
                     if($value1['return_to_stock_id']==$value2['return_to_stock_id']){
                      $issueTransactions[]=$value2; //collecting same issue transactions 
                     }
                  }

                   $obj=array();
                   $obj['date']=$key;
                   $obj['stock_type_code']=$value1['stock_type_code'];
                   $obj['return_date']=$value1['return_date'];
                   $obj['return_to_stock_no']=$value1['return_to_stock_no'];
                   // $obj['approve_by']=$value1['approve_by'];
                   $obj['return_by']=$value1['return_by'];
                   $data1=array();
                   $data1['transactions']=$issueTransactions;
                   $data1['returnDetails']=$obj;

                   $issueMain[]=$data1;
              }
                 $ob=array();
                 $ob['date']=$key;
                 $ob['issues']=$issueMain;
            $mainArray[]=$ob;
           }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
        
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

  public function readReturnToStockItemWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
          if($d->stock_type_code!=''){
              $condition='and e.stock_type_code in ('.$d->stock_type_code.')';
           }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and a.item_id in ('.$d->selected_item_id.')';
           }  

         $query = "select a.return_to_stock_id, a.item_id, item_name, item_description, return_to_stock_qty,
                   date_format(transaction_date, '%d/%m/%Y') as return_date, 
                   uom_code, max_level, min_level, b.location,
                   e.stock_type_code, return_to_stock_no, return_by, department
                   from transaction a 
                   join return_to_stock e on a.return_to_stock_id=e.return_to_stock_id
                   join issue_to_department i on e.issue_id=i.issue_id
                   join department_master d on i.department_id=d.department_id
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on b.item_id = c.item_id
                   where (transaction_date between :start_date and :end_date)
                  " .$condition. $item_condition. " 
                  and transaction_type='RS'
                  and a.financial_year_id=:financial_year_id
                  order by a.item_id, a.transaction_date asc, return_to_stock_id asc";  
                      
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         $prev_item='';
         $prev_item_name='';
         $issueArray=array();
         $obj=array();
         foreach ($transactions as $key => $value) {
           if($prev_item==''){//loop run first time
            $obj=array();
            $prev_item=$value['item_id'];
            $prev_item_name=$value['item_name']. '(Code:'.$value['item_id'].')';
            $obj[]=$value;
           }else if($prev_item==$value['item_id']){//same date
            $obj[]=$value;
           }else if($prev_item!=$value['item_id']){// new date starts
            $issueArray[$prev_item_name]=$obj;
            $obj=array();
            $prev_item=$value['item_id'];
            $prev_item_name=$value['item_name']. '(Code:'.$value['item_id'].')';
            $obj[]=$value;
           }
         }
         $issueArray[$prev_item_name]=$obj;
                   
         
         $mainArray=array(); 
         foreach ($issueArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['item']=$key;
            $ob['issues']=$value;
            $mainArray[]=$ob;
         }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
  }

  public function readReturnToStockDepartmentWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
          $condition='';
         if($d->stock_type_code!=''){
            $condition=' and e.stock_type_code in ('.$d->stock_type_code.')';
         }
         
         $dept_condition='';
         if($d->selected_department_id!=''){
          $dept_condition=' and i.department_id in ('.$d->selected_department_id.')';
         }

         $query = "select a.return_to_stock_id, a.item_id, item_name, item_description, return_to_stock_qty,
                   date_format(transaction_date, '%d/%m/%Y') as return_date, 
                   uom_code, max_level, min_level, b.location,
                   e.stock_type_code, return_to_stock_no, return_by, i.department_id, department
                   from transaction a 
                   join return_to_stock e on a.return_to_stock_id=e.return_to_stock_id
                   join issue_to_department i on e.issue_id=i.issue_id
                   join department_master d on i.department_id=d.department_id
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on b.item_id = c.item_id
                   where (transaction_date between :start_date and :end_date)
                  " .$condition. $dept_condition. " 
                  and transaction_type='RS'
                  and a.financial_year_id=:financial_year_id
                  order by department, a.transaction_date asc, return_to_stock_id asc";  

                      
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         $prev_department_id='';
         $prev_department_name='';
         $issueArray=array();
         $obj=array();
         foreach ($transactions as $key => $value) {
           if($prev_department_id==''){//loop run first time
            $obj=array();
            $prev_department_id=$value['department_id'];
            $prev_department_name=$value['department'];
            $obj[]=$value;
           }else if($prev_department_id==$value['department_id']){//same date
            $obj[]=$value;
           }else if($prev_department_id!=$value['department_id']){// new date starts
            $issueArray[$prev_department_name]=$obj;
            $obj=array();
            $prev_department_id=$value['department_id'];
            $prev_department_name=$value['department'];
            $obj[]=$value;
           }
         }
         $issueArray[$prev_department_name]=$obj;
                   
         
         $mainArray=array(); 
         foreach ($issueArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['department']=$key;
            $ob['issues']=$value;
            $mainArray[]=$ob;
         }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
  }


}
?>
