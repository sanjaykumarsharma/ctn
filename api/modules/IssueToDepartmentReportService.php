<?php
require_once 'conf.php';
class IssueToDepartmntReportService{

  public function readIssueToDepartmentDateWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         $condition='and stock_type_code in ('.$d->stock_type_code.')';

         $condition1='';
         $condition1='and stock_adjustment = :stock_adjustment';

         $condition2='';
         $condition2='and a1.stock_type_code in ('.$d->stock_type_code.')';


         $query = "select issue_id, stock_type_code, issue_no,
                   date_format(issue_date, '%d/%m/%Y') as issue_date, 
                   department, approve_by, receive_by, stock_adjustment
                   from issue_to_department a
                   join department_master b on a.department_id=b.department_id 
                   where (issue_date between :start_date and :end_date) 
                   " .$condition. $condition1. " 
                   and financial_year_id=:financial_year_id
                   order by a.issue_date asc, issue_id asc";
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(":stock_adjustment", $d->stock_adjustment);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetchAll();
         
         $prev_date='';
         $issueArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_date==''){//loop run first time
            $obj=array();
            $prev_date=$value['issue_date'];
            $obj[]=$value;
           }else if($prev_date==$value['issue_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['issue_date']){// new date starts
            $issueArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['issue_date'];
            $obj[]=$value;
           }
         }
         $issueArray[$prev_date]=$obj;
                   
         $query = "select a.issue_id, transaction_id, a.item_id, 
                   concat(concat(concat(item_name,'(Code:'),a.item_id),')') as material, uom_code, b.location, 
                   max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty, 
                   rate, FORMAT((a.qty*rate),2) as amount, a.remarks, chargehead
                   from transaction a
                   join issue_to_department a1 on (a.issue_id=a1.issue_id and a.financial_year_id=a1.financial_year_id)
                   join item_master b on a.item_id = b.item_id
                   left join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                   left join chargehead_master d on a.charge_head_id=d.chargehead_id
                    where (transaction_date between :start_date and :end_date)
                    " .$condition2. $condition1. " 
                    and transaction_type='I'
                    and a.financial_year_id=:financial_year_id
                    order by a.transaction_date asc, issue_id asc";

           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           $statement->bindParam(":stock_adjustment", $d->stock_adjustment);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();
            
            $qty_grand_total = 0;
            $amount_grand_total = 0;
            $mainArray=array(); 
           foreach ($issueArray as $key => $value) { //Issue details array

              $issueMain=array();//for one issue transactions
              foreach ($value as $key1 => $value1) { //array of all issues of one date
                  $issueTransactions=array();
                  foreach ($transactions as $key2 => $value2) { //Issue transactions
                     if($value1['issue_id']==$value2['issue_id']){
                      $issueTransactions[]=$value2; //collecting same issue transactions 
                     }
                  }

                   $obj=array();
                   $obj['date']=$key;
                   $obj['stock_type_code']=$value1['stock_type_code'];
                   $obj['issue_date']=$value1['issue_date'];
                   $obj['issue_no']=$value1['issue_no'];
                   $obj['department']=$value1['department'];
                   $obj['approve_by']=$value1['approve_by'];
                   $obj['receive_by']=$value1['receive_by'];
                   $obj['stock_adjustment']=$value1['stock_adjustment'];
                   if ($value1['stock_adjustment']=='Y'){
                      $obj['stock_adjustment_view']=true;
                    }else{
                      $obj['stock_adjustment_view']=false;
                    }
                   
                   $data1=array();
                   $data1['issueDetails']=$obj;
                       
                   $qty_total=0;
                   $amount_total=0;
                   foreach ($issueTransactions as $dtkey => $value) {
                       $qty_grand_total = $qty_grand_total + ((float)(str_replace(',', '', $value['qty'])));
                       $amount_grand_total = $amount_grand_total + ((float)(str_replace(',', '', $value['amount'])));
                       $qty_total = $qty_total + ((float)(str_replace(',', '', $value['qty'])));
                       $amount_total = $amount_total + ((float)(str_replace(',', '', $value['amount'])));
                   }


                   $oj=array(); //item wise total
                   $oj['uom_code']='Total';
                   $oj['qty']=$qty_total;
                   $oj['amount']=$amount_total;
                   if($qty_total>0){
                     $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
                   }else{
                     $oj['rate']=0;
                   }
                   $issueTransactions[]=$oj;

                   $data1['transactions']=$issueTransactions;
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
         $data['qty_grand_total']=$qty_grand_total;
         $data['amount_grand_total']=$amount_grand_total;
        
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

  public function readIssueToDepartmentItemWise($d) {
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


       $query = "select a.issue_id, transaction_id, a.item_id, item_name, uom_code, b.location, 
                 max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty,
                 rate, FORMAT((a.qty*rate),2) as amount, a.remarks, chargehead,
                 e.stock_type_code, issue_no, department, approve_by, receive_by,
                 date_format(issue_date, '%d/%m/%Y') as issue_date
                 from transaction a
                 join issue_to_department e on (a.issue_id=e.issue_id and a.financial_year_id=e.financial_year_id)
                 join department_master f on e.department_id=f.department_id 
                 join item_master b on a.item_id = b.item_id
                 left join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                 left join chargehead_master d on a.charge_head_id=d.chargehead_id
                 where (transaction_date between :start_date and :end_date)
                 and stock_adjustment = :stock_adjustment 
                  " .$condition. $item_condition. " 
                  and transaction_type='I'
                  and a.financial_year_id=:financial_year_id
                  order by a.item_id, a.transaction_date asc, issue_id asc";      
                      
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(":stock_adjustment", $d->stock_adjustment);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         

         $prev_item='';
         $prev_item_name='';
         $qty_grand_total=0;
         $amount_grand_total=0;
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


            $qty_grand_total = $qty_grand_total + ((float)(str_replace(',', '', $value['qty'])));
            $amount_grand_total = $amount_grand_total + ((float)(str_replace(',', '', $value['amount'])));
         }
         $issueArray[$prev_item_name]=$obj;

         //calculate item total
         foreach ($issueArray as $k => $v) {
             $qty_total = 0;
             $amount_total = 0;
             foreach ($v as $k1 => $v1) {
               $qty_total = $qty_total + ((float)(str_replace(',', '', $v1['qty'])));
               $amount_total = $amount_total + ((float)(str_replace(',', '', $v1['amount'])));
             }        
             $oj=array(); //item wise total
             $oj['uom_code']='Total';
             $oj['qty']=$qty_total;
             $oj['amount']=$amount_total;
             if($qty_total>0){
               $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
             }else{
               $oj['rate']=0;
             }
             $issueArray[$k][]=$oj;
        }  
                   
         
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
         $data['qty_grand_total']=$qty_grand_total;
         $data['amount_grand_total']=$amount_grand_total;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readIssueToDepartmentDeptWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         if($d->stock_type_code!=''){
            $condition=' and e.stock_type_code in ('.$d->stock_type_code.')';
         }
         
         $dept_condition='';
         if($d->selected_department_id!=''){
          $dept_condition=' and e.department_id in ('.$d->selected_department_id.')';
         }

       $query = "select a.issue_id, transaction_id, a.item_id, item_name, uom_code, b.location, 
                 max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty,
                 rate, FORMAT((a.qty*rate),2) as amount, a.remarks, chargehead,
                 e.stock_type_code, issue_no, e.department_id, department, approve_by, receive_by,
                 date_format(issue_date, '%d/%m/%Y') as issue_date
                 from transaction a
                 join issue_to_department e on (a.issue_id=e.issue_id and a.financial_year_id=e.financial_year_id)
                 join department_master f on e.department_id=f.department_id 
                 join item_master b on a.item_id = b.item_id
                 left join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                 left join chargehead_master d on a.charge_head_id=d.chargehead_id
                 where (transaction_date between :start_date and :end_date)
                 and stock_adjustment = :stock_adjustment 
                  " .$condition. $dept_condition. " 
                  and transaction_type='I'
                  and a.financial_year_id=:financial_year_id
                  order by e.department_id, a.transaction_date asc, issue_id asc";      
                      
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(":stock_adjustment", $d->stock_adjustment);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         $prev_department_id='';
         $prev_department_name='';
         $qty_grand_total = 0;
         $amount_grand_total=0;
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
           $qty_grand_total = $qty_grand_total + ((float)(str_replace(',', '', $value['qty'])));
           $amount_grand_total = $amount_grand_total + ((float)(str_replace(',', '', $value['amount'])));
         }
         $issueArray[$prev_department_name]=$obj;
                   
         //calculate item total
         foreach ($issueArray as $k => $v) {
             $qty_total = 0;
             $amount_total = 0;
             foreach ($v as $k1 => $v1) {
               $qty_total = $qty_total + ((float)(str_replace(',', '', $v1['qty'])));
               $amount_total = $amount_total + ((float)(str_replace(',', '', $v1['amount'])));
             }        
             $oj=array(); //item wise total
             $oj['uom_code']='Total';
             $oj['qty']=$qty_total;
             $oj['amount']=$amount_total;
             if($qty_total>0){
               $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
             }else{
               $oj['rate']=0;
             }
             $issueArray[$k][]=$oj;
         }            
         
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
         $data['qty_grand_total']=$qty_grand_total;
         $data['amount_grand_total']=$amount_grand_total;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   } 

   public function readIssueToDepartmentLocationWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         if($d->stock_type_code!=''){
            $condition=' and e.stock_type_code in ('.$d->stock_type_code.')';
         }
         
         $location_condition='';
         if($d->selected_location_id!=''){
          $location_condition=' and b.location in ('.$d->selected_location_id.')';
         }


       $query = "select a.issue_id, transaction_id, a.item_id, item_name, uom_code, b.location, 
                 max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty,
                 rate, FORMAT((a.qty*rate),2) as amount, a.remarks, chargehead,
                 e.stock_type_code, issue_no, e.department_id, department, approve_by, receive_by,
                 date_format(issue_date, '%d/%m/%Y') as issue_date
                 from transaction a
                 join issue_to_department e on (a.issue_id=e.issue_id and a.financial_year_id=e.financial_year_id)
                 join department_master f on e.department_id=f.department_id 
                 join item_master b on a.item_id = b.item_id
                 left join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                 left join chargehead_master d on a.charge_head_id=d.chargehead_id
                 where (transaction_date between :start_date and :end_date)
                 and stock_adjustment = :stock_adjustment 
                  " .$condition. $location_condition. " 
                  and transaction_type='I'
                  and a.financial_year_id=:financial_year_id
                  order by b.location, a.transaction_date asc, issue_id asc";      
                      
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(":stock_adjustment", $d->stock_adjustment);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         $prev_location_id='';
         $prev_location_name='';
         $qty_grand_total = 0;
         $amount_grand_total=0;
         $issueArray=array();
         $obj=array();
         foreach ($transactions as $key => $value) {
           if($prev_location_id==''){//loop run first time
            $obj=array();
            $prev_location_id=$value['location'];
            $prev_location_name=$value['location'];
            $obj[]=$value;
           }else if($prev_location_id==$value['location']){//same date
            $obj[]=$value;
           }else if($prev_location_id!=$value['location']){// new date starts
            $issueArray[$prev_location_name]=$obj;
            $obj=array();
            $prev_location_id=$value['location'];
            $prev_location_name=$value['location'];
            $obj[]=$value;
           }
           $qty_grand_total = $qty_grand_total + ((float)(str_replace(',', '', $value['qty'])));
           $amount_grand_total = $amount_grand_total + ((float)(str_replace(',', '', $value['amount'])));
         }
         $issueArray[$prev_location_name]=$obj;
                   
         //calculate item total
         foreach ($issueArray as $k => $v) {
             $qty_total = 0;
             $amount_total = 0;
             foreach ($v as $k1 => $v1) {
               $qty_total = $qty_total + ((float)(str_replace(',', '', $v1['qty'])));
               $amount_total = $amount_total + ((float)(str_replace(',', '', $v1['amount'])));
             }        
             $oj=array(); //item wise total
             $oj['uom_code']='Total';
             $oj['qty']=$qty_total;
             $oj['amount']=$amount_total;
             if($qty_total>0){
               $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
             }else{
               $oj['rate']=0;
             }
             $issueArray[$k][]=$oj;
         }    

         $mainArray=array(); 
         foreach ($issueArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['location']=$key;
            $ob['issues']=$value;
            $mainArray[]=$ob;
         }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
         $data['qty_grand_total']=$qty_grand_total;
         $data['amount_grand_total']=$amount_grand_total;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readIssueToDepartmentChargeHeadWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         if($d->stock_type_code!=''){
            $condition=' and e.stock_type_code in ('.$d->stock_type_code.')';
         }
         
         $chargehead_condition='';
         if($d->selected_chargehead_id!=''){
          $chargehead_condition=' and chargehead in ('.$d->selected_chargehead_id.')';
         }


       $query = "select a.issue_id, transaction_id, a.item_id, item_name, uom_code, b.location, 
                 max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty,
                 rate, FORMAT((a.qty*rate),2) as amount, a.remarks, chargehead,
                 e.stock_type_code, issue_no, e.department_id, department, approve_by, receive_by,
                 date_format(issue_date, '%d/%m/%Y') as issue_date
                 from transaction a
                 join issue_to_department e on (a.issue_id=e.issue_id and a.financial_year_id=e.financial_year_id)
                 join department_master f on e.department_id=f.department_id 
                 join item_master b on a.item_id = b.item_id
                 left join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                 left join chargehead_master d on a.charge_head_id=d.chargehead_id
                 where (transaction_date between :start_date and :end_date)
                 and stock_adjustment = :stock_adjustment 
                  " .$condition. $chargehead_condition. " 
                  and transaction_type='I'
                  and a.financial_year_id=:financial_year_id
                  order by chargehead, a.transaction_date asc, issue_id asc";      
                      
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(":stock_adjustment", $d->stock_adjustment);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         $prev_chargehead_id='';
         $prev_chargehead_name='';
         $qty_grand_total = 0;
         $amount_grand_total=0;
         $issueArray=array();
         $obj=array();
         foreach ($transactions as $key => $value) {
           if($prev_chargehead_id==''){//loop run first time
            $obj=array();
            $prev_chargehead_id=$value['chargehead'];
            $prev_chargehead_name=$value['chargehead'];
            $obj[]=$value;
           }else if($prev_chargehead_id==$value['chargehead']){//same date
            $obj[]=$value;
           }else if($prev_chargehead_id!=$value['chargehead']){// new date starts
            $issueArray[$prev_chargehead_name]=$obj;
            $obj=array();
            $prev_chargehead_id=$value['chargehead'];
            $prev_chargehead_name=$value['chargehead'];
            $obj[]=$value;
           }
           $qty_grand_total = $qty_grand_total + ((float)(str_replace(',', '', $value['qty'])));
           $amount_grand_total = $amount_grand_total + ((float)(str_replace(',', '', $value['amount'])));
         }
         $issueArray[$prev_chargehead_name]=$obj;

         //calculate item total
         foreach ($issueArray as $k => $v) {
             $qty_total = 0;
             $amount_total = 0;
             foreach ($v as $k1 => $v1) {
               $qty_total = $qty_total + ((float)(str_replace(',', '', $v1['qty'])));
               $amount_total = $amount_total + ((float)(str_replace(',', '', $v1['amount'])));
             }        
             $oj=array(); //item wise total
             $oj['uom_code']='Total';
             $oj['qty']=$qty_total;
             $oj['amount']=$amount_total;
             if($qty_total>0){
               $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
             }else{
               $oj['rate']=0;
             }
             $issueArray[$k][]=$oj;
         }
                   
         
         $mainArray=array(); 
         foreach ($issueArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['chargehead']=$key;
            $ob['issues']=$value;
            $mainArray[]=$ob;
         }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
         $data['qty_grand_total']=$qty_grand_total;
         $data['amount_grand_total']=$amount_grand_total;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function readReceiveForStockAdjustment($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         $condition='and stock_type_code in ('.$d->stock_type_code.')';

         $condition2='';
         $condition2='and a1.stock_type_code in ('.$d->stock_type_code.')';


         $query = "select receive_id, stock_type_code, receive_no,
                   date_format(receive_date, '%d/%m/%Y') as receive_date, 
                   approve_by, adjusted_by
                   from receive a
                   where (receive_date between :start_date and :end_date) 
                   " .$condition.  " 
                   and financial_year_id=:financial_year_id
                   order by a.receive_date asc, receive_id asc";
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
         $issueArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_date==''){//loop run first time
            $obj=array();
            $prev_date=$value['receive_date'];
            $obj[]=$value;
           }else if($prev_date==$value['receive_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['receive_date']){// new date starts
            $issueArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['receive_date'];
            $obj[]=$value;
           }
         }
         $issueArray[$prev_date]=$obj;
                   
         $query = "select a.receive_id, transaction_id, a.item_id, item_name, uom_code, b.location, 
                   max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty, a.remarks, chargehead
                   from transaction a
                   join receive a1 on a.receive_id=a1.receive_id
                   join item_master b on a.item_id = b.item_id
                   left join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                   left join chargehead_master d on a.charge_head_id=d.chargehead_id
                    where (transaction_date between :start_date and :end_date)
                    " .$condition2.  " 
                    and transaction_type='AR'
                    and a.financial_year_id=:financial_year_id
                    order by a.transaction_date asc, receive_id asc";

           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();
            
            $mainArray=array(); 
           foreach ($issueArray as $key => $value) { //Issue details array

              $issueMain=array();//for one issue transactions
              foreach ($value as $key1 => $value1) { //array of all issues of one date
                  $issueTransactions=array();
                  foreach ($transactions as $key2 => $value2) { //Issue transactions
                     if($value1['receive_id']==$value2['receive_id']){
                      $issueTransactions[]=$value2; //collecting same issue transactions 
                     }
                  }

                   $obj=array();
                   $obj['date']=$key;
                   $obj['stock_type_code']=$value1['stock_type_code'];
                   $obj['receive_date']=$value1['receive_date'];
                   $obj['receive_no']=$value1['receive_no'];
                   //$obj['department']=$value1['department'];
                   $obj['approve_by']=$value1['approve_by'];
                   $obj['adjusted_by']=$value1['adjusted_by'];
                   
                   $data1=array();
                   $data1['transactions']=$issueTransactions;
                   $data1['receiveDetails']=$obj;

                   $issueMain[]=$data1;
              }
                 $ob=array();
                 $ob['date']=$key;
                 $ob['receives']=$issueMain;
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
