<?php
require_once 'conf.php';
class RejectToPartyReportService{

  public function readRejectToPartyDateWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         $condition='and stock_type_code in ('.$d->stock_type_code.')';

         $query = "select reject_to_party_id, stock_type_code, reject_to_party_no,
                   date_format(reject_date, '%d/%m/%Y') as reject_date, 
                   transporter_name, lr_no, vehicle_no,  mode_of_transport, rejected_by
                   from reject_to_party 
                   where (reject_date between :start_date and :end_date) 
                   " .$condition. " 
                   and financial_year_id=:financial_year_id
                   order by reject_date asc, reject_to_party_id asc";

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
            $prev_date=$value['reject_date'];
            $obj[]=$value;
           }else if($prev_date==$value['reject_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['reject_date']){// new date starts
            $returnArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['reject_date'];
            $obj[]=$value;
           }
         }
         $returnArray[$prev_date]=$obj;
                   
         $query = "select reject_to_party_id, a.item_id, item_name, item_description, docket_id,
                   reject_to_party_id, reject_to_party_qty, rate, format((reject_to_party_qty*rate),3) as amount,
                   date_format(transaction_date, '%d/%m/%Y') as reject_date, 
                   reject_to_party_remarks, uom_code, max_level, min_level, b.location
                   from transaction a 
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on (b.item_id = c.item_id and a.financial_year_id=c.financial_year_id)
                   where (transaction_date between :start_date and :end_date)
                  " .$condition. " 
                  and transaction_type='RP'
                  and a.financial_year_id=:financial_year_id
                  order by a.transaction_date asc, reject_to_party_id asc";

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
                     if($value1['reject_to_party_id']==$value2['reject_to_party_id']){
                      $issueTransactions[]=$value2; //collecting same issue transactions 
                     }
                  }

                   $obj=array();
                   $obj['date']=$key;
                   $obj['stock_type_code']=$value1['stock_type_code'];
                   $obj['reject_date']=$value1['reject_date'];
                   $obj['reject_to_party_no']=$value1['reject_to_party_no'];
                   $obj['transporter_name']=$value1['transporter_name'];
                   $obj['lr_no']=$value1['lr_no'];
                   $obj['vehicle_no']=$value1['vehicle_no'];
                   $obj['mode_of_transport']=$value1['mode_of_transport'];
                   $obj['rejected_by']=$value1['rejected_by'];
                   $data1=array();
                   $data1['transactions']=$issueTransactions;
                   $data1['rejectDetails']=$obj;

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

  public function readRejectToPartyDocketDateWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         $condition=' and a.stock_type_code in ('.$d->stock_type_code.')';

         $condition1='';
         $condition1=' and stock_type_code in ('.$d->stock_type_code.')';

         $query = "select reject_to_party_id, a.stock_type_code, reject_to_party_no,
                   date_format(docket_date, '%d/%m/%Y') as docket_date, 
                   a.transporter_name, a.lr_no, a.vehicle_no,  a.mode_of_transport, a.rejected_by
                   from reject_to_party a
                   join docket b on a.docket_id=b.docket_id
                   where (docket_date between :start_date and :end_date) 
                   " .$condition. " 
                   and a.financial_year_id=:financial_year_id
                   order by docket_date asc, reject_to_party_id asc";

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
            $prev_date=$value['docket_date'];
            $obj[]=$value;
           }else if($prev_date==$value['docket_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['docket_date']){// new date starts
            $returnArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['docket_date'];
            $obj[]=$value;
           }
         }
         $returnArray[$prev_date]=$obj;
                   
         $query = "select reject_to_party_id, a.item_id, item_name, item_description, docket_id,
                   reject_to_party_id, reject_to_party_qty, rate, format((reject_to_party_qty*rate),3) as amount,
                   date_format(transaction_date, '%d/%m/%Y') as docket_date, 
                   reject_to_party_remarks, uom_code, max_level, min_level, b.location
                   from transaction a 
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on (b.item_id = c.item_id and a.financial_year_id=c.financial_year_id)
                   where (transaction_date between :start_date and :end_date)
                  " .$condition1. " 
                  and transaction_type='RP'
                  and a.financial_year_id=:financial_year_id
                  order by a.transaction_date asc, reject_to_party_id asc";

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
                     if($value1['reject_to_party_id']==$value2['reject_to_party_id']){
                      $issueTransactions[]=$value2; //collecting same issue transactions 
                     }
                  }

                   $obj=array();
                   $obj['date']=$key;
                   $obj['stock_type_code']=$value1['stock_type_code'];
                   $obj['docket_date']=$value1['docket_date'];
                   $obj['reject_to_party_no']=$value1['reject_to_party_no'];
                   $obj['transporter_name']=$value1['transporter_name'];
                   $obj['lr_no']=$value1['lr_no'];
                   $obj['vehicle_no']=$value1['vehicle_no'];
                   $obj['mode_of_transport']=$value1['mode_of_transport'];
                   $obj['rejected_by']=$value1['rejected_by'];
                   $data1=array();
                   $data1['transactions']=$issueTransactions;
                   $data1['rejectDetails']=$obj;

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

  public function readRejectToPartyItemWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
          if($d->stock_type_code!=''){
              $condition='and d.stock_type_code in ('.$d->stock_type_code.')';
           }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and a.item_id in ('.$d->selected_item_id.')';
           }  

         $query = "select d.reject_to_party_id, a.item_id, item_name, item_description, d.docket_id,
                   reject_to_party_qty, rate, format((reject_to_party_qty*rate),3) as amount,
                   date_format(transaction_date, '%d/%m/%Y') as reject_date, 
                   reject_to_party_remarks, uom_code, max_level, min_level, b.location,
                   d.stock_type_code, reject_to_party_no,
                   d.transporter_name, d.lr_no, d.vehicle_no,  d.mode_of_transport, d.rejected_by,
                   party_name
                   from transaction a 
                   join reject_to_party d on a.reject_to_party_id=d.reject_to_party_id
                   join docket e on d.docket_id=e.docket_id
                   join party_master f on e.party_id=f.party_id
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on (b.item_id = c.item_id and a.financial_year_id=c.financial_year_id)
                   where (transaction_date between :start_date and :end_date)
                   " .$condition. $item_condition. " 
                  and transaction_type='RP'
                  and a.financial_year_id=:financial_year_id
                  order by a.item_id, a.transaction_date asc, d.reject_to_party_id asc";
                      
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


  public function readRejectToPartyPartyWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         if($d->stock_type_code!=''){
            $condition=' and d.stock_type_code in ('.$d->stock_type_code.')';
         }
         
         $party_condition='';
         if($d->selected_party_id!=''){
          $party_condition=' and e.party_id in ('.$d->selected_party_id.')';
         }

         $query = "select d.reject_to_party_id, a.item_id, item_name, item_description, d.docket_id,
                   reject_to_party_qty, rate, format((reject_to_party_qty*rate),3) as amount,
                   date_format(transaction_date, '%d/%m/%Y') as reject_date, 
                   reject_to_party_remarks, uom_code, max_level, min_level, b.location,
                   d.stock_type_code, reject_to_party_no,
                   d.transporter_name, d.lr_no, d.vehicle_no,  d.mode_of_transport, d.rejected_by,
                   party_name, e.party_id
                   from transaction a 
                   join reject_to_party d on a.reject_to_party_id=d.reject_to_party_id
                   join docket e on d.docket_id=e.docket_id
                   join party_master f on e.party_id=f.party_id
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on (b.item_id = c.item_id and a.financial_year_id=c.financial_year_id)
                   where (transaction_date between :start_date and :end_date)
                  " .$condition. $party_condition. " 
                  and transaction_type='RP'
                  and a.financial_year_id=:financial_year_id
                  order by e.party_id, a.transaction_date asc, d.reject_to_party_id asc";
                      
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         $prev_party_id='';
         $party_name='';
         $issueArray=array();
         $obj=array();
         foreach ($transactions as $key => $value) {
           if($prev_party_id==''){//loop run first time
            $obj=array();
            $prev_party_id=$value['party_id'];
            $party_name=$value['party_name'];
            $obj[]=$value;
           }else if($prev_party_id==$value['party_id']){//same date
            $obj[]=$value;
           }else if($prev_party_id!=$value['party_id']){// new date starts
            $issueArray[$party_name]=$obj;
            $obj=array();
            $prev_party_id=$value['party_id'];
            $party_name=$value['party_name'];
            $obj[]=$value;
           }
         }
         $issueArray[$party_name]=$obj;
                   
         
         $mainArray=array(); 
         foreach ($issueArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['party']=$key;
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
