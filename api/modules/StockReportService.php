<?php
require_once 'conf.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
class StockReportService{
  public function readStockDateWise($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select a.item_id, transaction_id, item_name, running_balance as qty,
                    rate, FORMAT((( ((qty* rate)+p_and_f_charge+other_charges)-discount_amount )),2) as amount, uom_code,
                    b.location, stock_type_code
                    from transaction a
                    join item_master b on a.item_id=b.item_id
                    where transaction_date<=:transaction_date
                    and item_group_code = :item_group_code
                    and stock_type_code = :stock_type_code
                    and financial_year_id = :financial_year_id
                    order by a.item_id, transaction_date desc, transaction_id desc";         
         
         $transaction_date=implode("-", array_reverse(array_map('trim', explode("/", $data->transaction_date))));

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':transaction_date', $transaction_date);
         $statement->bindParam(":item_group_code", $data->item_group_code);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);       
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);  
         $statement->execute();
         $rs=$statement->fetchAll();
          
         $prev_item_id='';
         $items=array();
         //a.item_id, transaction_id, item_name, running_balance as qty, uom_code,b.location, stock_type_code
         $obj=array();
         foreach ($rs as $key => $value) {
           //print_r($value['stock_type_code']);
           if($prev_item_id==''){// loop runs first time
             $obj=array();
             $obj['item_id']=$value['item_id'];
             $obj['item_name']=utf8_encode($value['item_name']);
             $obj['qty']=$value['qty'];
             $obj['rate']=$value['rate'];
             $obj['amount']=$value['amount'];
             $obj['uom_code']=$value['uom_code'];
             $obj['location']=$value['location'];
             $obj['stock_type_code']=$value['stock_type_code'];
             $prev_item_id=$value['item_id'];
           }else if($prev_item_id==$value['item_id']){
             $prev_item_id=$value['item_id'];
           }else if($prev_item_id!=$value['item_id']){
             $items[]=$obj;
             $prev_item_id=$value['item_id'];
             $obj=array();
             $obj['item_id']=$value['item_id'];
             $obj['item_name']=utf8_encode($value['item_name']);
             $obj['qty']=$value['qty'];
             $obj['rate']=$value['rate'];
             $obj['amount']=$value['amount'];
             $obj['uom_code']=$value['uom_code'];
             $obj['location']=$value['location'];
             $obj['stock_type_code']=$value['stock_type_code'];
             $prev_item_id=$value['item_id'];
           }
         }

         $items[]=$obj;

         $r1data = array();
         $r1data['status'] = "s";
         $r1data['items'] = $items;
         return $r1data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readStockMovementRegisterItemWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
          if($d->stock_type_code!=''){
              $condition='and stock_type_code in ('.$d->stock_type_code.')';
          }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and a.item_id in ('.$d->selected_item_id.')';
          }  
         
         $item_ids= array();
         $report_data = array();
         if($item_condition==''){
            $query1 = 'select distinct a.item_id 
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and (transaction_date between :start_date and :end_date)
                       and stock_type_code in ('.$d->stock_type_code.')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
            $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();

            
         }else if($item_condition!=''){
            $query1 = 'select distinct a.item_id 
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and (transaction_date between :start_date and :end_date)
                       and b.item_id in ('.$d->selected_item_id.')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
            $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();
            
         } 


         foreach ($item_ids as $key => $value) {
                 // print_r($value['item_id']);
                 $query = "select a.item_id, transaction_id, item_name, qty, rate, 
                      running_balance, transaction_type,
                      date_format(transaction_date, '%d/%m/%Y') as td, 
                      uom_code, b.location, stock_type_code
                      from transaction a
                      join item_master b on a.item_id = b.item_id
                      where a.financial_year_id = :financial_year_id
                      and a.item_id = :item_id
                      and (transaction_date between :start_date and :end_date)
                      order by transaction_date asc, transaction_id desc";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rs=$statement->fetchAll();
                 
                 $items = array();
                 $items['item_name']=utf8_encode($rs[0]['item_name']) . '('. $rs[0]['item_id'] .')';   
                 $items['items']=$rs;   
                 $report_data[] = $items;
             }

         
         
         // print_r($_SESSION['NTC_FINANCIAL_YEAR_ID']);
         // print_r($query);
         // var_dump($rs);

         $r1data = array();
         $r1data['status'] = "s";
         $r1data['items'] = $report_data;
         return $r1data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readStockValuationSummryStoreTypeWise($d) {
      try{

         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
          if($d->stock_type_code!=''){
              $condition='and stock_type_code in ('.$d->stock_type_code.')';
          }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and a.item_id in ('.$d->selected_item_id.')';
          }  
         
         $item_ids= array();
         if($item_condition==''){
            $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and transaction_date <= :end_date
                       and stock_type_code in ('.$d->stock_type_code.')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            // $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
            // $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();

            
         }else if($item_condition!=''){
            $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and transaction_date <= :end_date
                       and b.item_id in ('.$d->selected_item_id.')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            // $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
            // $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();
            
         } 

         $report_data = array();
         foreach ($item_ids as $key => $value) {
                 // print_r($value['item_id']);
                 $query = "select item_id, qty
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'O'
                          and transaction_date <=:end_date";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 // $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 // $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $opening=$statement->fetch();

                 //Receive
                 $query = "select item_id, sum(qty) as qty
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'R'
                          and transaction_date <=:end_date";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $receive=$statement->fetch();

                 //Issue
                 $query = "select item_id, sum(qty) as qty
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'I'
                          and transaction_date <=:end_date";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $issue=$statement->fetch();

                 //Return to party
                 $query = "select item_id, sum(reject_to_party_qty) as qty
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'RP'
                          and transaction_date <=:end_date";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rp=$statement->fetch();

                 //Return to stock
                 $query = "select item_id, sum(return_to_stock_qty) as qty
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'RS'
                          and transaction_date <=:end_date";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rs=$statement->fetch();

                 //receive qty
                 $items = array();
                 $items['item_name']=utf8_encode($value['item_name']) . '('. $value['item_id'] .')';   
                 $items['stock_type_code']=utf8_encode($value['stock_type_code']);   
                 $items['uom_code']=$value['uom_code'];   
                 $items['o_qty'] = $opening['qty'];   
                 $items['r_qty'] = $receive['qty'];   
                 $items['i_qty'] = $issue['qty'];   
                 $items['rp_qty'] = $rp['qty'];   
                 $items['rs_qty'] = $rs['qty'];   
                 $items['closing_qty'] = ($opening['qty'] + $receive['qty'] + $rs['qty']) - $issue['qty'] -$rp['qty'];   
                 $report_data[] = $items;
             }

             
             $o_qty = 0; 
             $r_qty = 0;
             $i_qty = 0;
             $rp_qty = 0;
             $rs_qty = 0;
             $closing_qty = 0;

             foreach ($report_data as $k => $val) {
               $o_qty = $o_qty + $val['o_qty'];
               $r_qty = $r_qty + $val['r_qty'];
               $i_qty = $i_qty + $val['i_qty'];
               $rp_qty = $rp_qty + $val['rp_qty'];
               $rs_qty = $rs_qty + $val['rs_qty'];
               $closing_qty = $closing_qty + $val['closing_qty'];
             }

             $obj = array();
             $obj['o_qty'] = $o_qty; 
             $obj['r_qty'] = $r_qty;
             $obj['i_qty'] = $i_qty;
             $obj['rp_qty'] = $rp_qty;
             $obj['rs_qty'] = $rs_qty;
             $obj['closing_qty'] = $closing_qty; 

          $r1data = array();
          $r1data['status'] = "s";
          $r1data['items'] = $report_data;
          $r1data['total'] = $obj;

         return $r1data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readStockValuationSummryLocationWise($d) {
      try{

         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
          if($d->location!=''){
              $condition='and stock_type_code in ('.$d->location.')'; //location==stock_type_code
          }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and a.location in ('.$d->selected_item_id.')';//item_id = location
          }  
         
         $item_ids= array();
         
          $query1 = "select distinct a.item_id, item_name, a.stock_type_code, a.location, uom_code
                     from item_master a
                     join transaction b on a.item_id=b.item_id
                     where b.financial_year_id = :financial_year_id
                     and transaction_date <= :end_date
                     " . $condition . $item_condition  ;

          $statement1 = $objPDO->prepare($query1);
          $statement1->setFetchMode(PDO::FETCH_ASSOC);
          // $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
          $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
          // $statement1->bindParam(":start_date", $sd);
          $statement1->bindParam(":end_date", $ed);
          $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
          $statement1->execute();
          $item_ids=$statement1->fetchAll();

         $report_data = array();
         foreach ($item_ids as $key => $value) {
                 // print_r($value['item_id']);
                 $query = "select item_id, qty
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'O'
                          and transaction_date <=:end_date";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 // $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 // $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $opening=$statement->fetch();

                 //Receive
                 $query = "select item_id, sum(qty) as qty
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'R'
                          and transaction_date <=:end_date";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $receive=$statement->fetch();

                 //Issue
                 $query = "select item_id, sum(qty) as qty
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'I'
                          and transaction_date <=:end_date";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $issue=$statement->fetch();

                 //receive qty
                 $items = array();
                 $items['item_name']=utf8_encode($value['item_name']) . '('. $value['item_id'] .')';   
                 $items['stock_type_code']=utf8_encode($value['stock_type_code']);   
                 $items['uom_code']=$value['uom_code'];   
                 $items['location']=$value['location'];   
                 $items['o_qty'] = $opening['qty'];   
                 $items['r_qty'] = $receive['qty'];   
                 $items['i_qty'] = $issue['qty'];   
                 $items['closing_qty'] = ($opening['qty'] + $receive['qty']) - $issue['qty'];   
                 $report_data[] = $items;
             }

             
             $o_qty = 0; 
             $r_qty = 0;
             $i_qty = 0;
             $closing_qty = 0;

             foreach ($report_data as $k => $val) {
               $o_qty = $o_qty + $val['o_qty'];
               $r_qty = $r_qty + $val['r_qty'];
               $i_qty = $i_qty + $val['i_qty'];
               $closing_qty = $closing_qty + $val['closing_qty'];
             }

             $obj = array();
             $obj['o_qty'] = $o_qty; 
             $obj['r_qty'] = $r_qty;
             $obj['i_qty'] = $i_qty;
             $obj['closing_qty'] = $closing_qty; 

          $r1data = array();
          $r1data['status'] = "s";
          $r1data['items'] = $report_data;
          $r1data['total'] = $obj;

         return $r1data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

public function readStockLedgerAvgValuationDetails($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
          if($d->stock_type_code!=''){
              $condition='and stock_type_code in ('.$d->stock_type_code.')';
          }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and a.item_id in ('.$d->selected_item_id.')';
          }  
         
         $item_ids= array();
         if($item_condition==''){
            $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and (transaction_date between :start_date and :end_date)
                       and stock_type_code in ('.$d->stock_type_code.')';
                       // and b.item_id=14741';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
            $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();

            
         }else if($item_condition!=''){
            $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and (transaction_date between :start_date and :end_date)
                       and b.item_id in ('.$d->selected_item_id.')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
            $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();
            
         } 

         $report_data = array();
         foreach ($item_ids as $key => $value) {
                 // print_r($value['item_id']);
                 $query = "select  o_qty, rate, o_amount, r_qty, r_amount, i_qty,  i_amount, transaction_date, transaction_id, running_balance, running_amount, td, details, transaction_type
                           from
                           (
                              select a.item_id, item_name, qty as o_qty, rate, FORMAT((qty* rate),2) as o_amount,  '' as r_qty, '' as r_amount, '' as i_qty,  '' as i_amount, transaction_date, transaction_id,
                              running_balance, transaction_type, running_amount,
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, stock_type_code, 'Opening' as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and (transaction_date between :start_date and :end_date)
                              and transaction_type = 'O'

                              UNION

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, qty as r_qty, FORMAT((( ((qty* rate)+a.p_and_f_charge+a.other_charges)-discount_amount )),2) as r_amount,  '' as i_qty, '' as i_amount, transaction_date, transaction_id,
                              running_balance, transaction_type, running_amount,
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(c.stock_type_code, '-'), c.docket_no) as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join docket c on (a.docket_id = c.docket_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and (transaction_date between :start_date and :end_date)
                              and transaction_type = 'R'

                              UNION

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, '' as r_qty, '' as r_amount, qty as i_qty, FORMAT((qty* rate),2) as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(c.stock_type_code, '-'), c.issue_no) as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join issue_to_department c on (a.issue_id = c.issue_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and (transaction_date between :start_date and :end_date)
                              and transaction_type = 'I'

                              UNION

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, concat('-',reject_to_party_qty) as r_qty, 
                              concat('-',FORMAT((reject_to_party_qty* rate),2)) as r_amount , '' as i_qty, '' as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(concat(c.stock_type_code, '-'), c.reject_to_party_no),'-RP') as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join reject_to_party c on (a.reject_to_party_id = c.reject_to_party_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and transaction_type = 'RP'

                              UNION

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, '' as r_qty, '' as r_amount, 
                              concat('-',return_to_stock_qty) as i_qty, concat('-',FORMAT((return_to_stock_qty* rate),2)) as i_amount, 
                              transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(concat(c.stock_type_code, '-'), c.return_to_stock_no),'-RS') as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join return_to_stock c on (a.return_to_stock_id = c.return_to_stock_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and transaction_type = 'RS'
                              
                            ) a order by transaction_date asc, transaction_id asc";

             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rs=$statement->fetchAll();


                  
                   $o_qty = 0; 
                   //$o_rate = 0; 
                   $o_amount = 0; 
                   $r_qty = 0;
                   //$r_rate = 0;
                   $r_amount = 0;
                   $i_qty = 0;
                   //$i_rate = 0; 
                   $i_amount = 0;
                   $running_balance = 0;
                   $running_amount = 0;
                 foreach ($rs as $k => $val) {
                   //$o_rate = $o_rate + $val['o_rate'];
                   //$r_rate = $r_rate + $val['r_rate'];
                   //$i_rate = $i_rate + $val['i_rate'];
                   
                   $o_qty = $o_qty + $val['o_qty'];
                   $o_amount = $o_amount + ((float)(str_replace(',', '', $val['o_amount'])));
                   
                   $r_qty = $r_qty + $val['r_qty'];
                   $r_amount = $r_amount + ((float)(str_replace(',', '', $val['r_amount'])));

                   $i_qty = $i_qty + $val['i_qty'];
                   $i_amount = $i_amount + ((float)(str_replace(',', '', $val['i_amount'])));

                   $running_balance = $val['running_balance']; //$running_balance + 
                   $running_amount = $val['running_amount']; //$running_amount + 
                              
                 }

                 $items = array();
                 $items['o_qty'] = $o_qty; 
                 //$items['o_rate'] = $o_rate; 
                 $items['o_amount'] = $o_amount; 
                 $items['r_qty'] = $r_qty;
                 //$items['r_rate'] = $r_rate;
                 $items['r_amount'] = $r_amount;
                 $items['i_qty'] = $i_qty;
                 //$items['i_rate'] = $i_rate;
                 $items['i_amount'] = $i_amount;
                 $items['running_balance'] = $running_balance;
                 $items['running_amount'] = $running_amount;
                 if($running_balance!=0){
                   $items['rate'] = number_format(($running_amount/$running_balance), 2, '.', '');
                 }else{
                   $items['rate'] = 0;
                 }
                 $items['item_name']=utf8_encode($value['item_name']) . '('. $value['item_id'] .') - ' . $value['stock_type_code'];   
                 $items['items'] = $rs;   
                 $report_data[] = $items;
             }


         // print_r($_SESSION['NTC_FINANCIAL_YEAR_ID']);
         // print_r($query);
         // var_dump($rs);

         $r1data = array();
         $r1data['status'] = "s";
         $r1data['items'] = $report_data;
         return $r1data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

public function readStockLedgerAvgValuationSummry($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
          if($d->stock_type_code!=''){
              $condition='and stock_type_code in ('.$d->stock_type_code.')';
          }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and a.item_id in ('.$d->selected_item_id.')';
          }  
         
         $item_ids= array();
         if($item_condition==''){
            $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and (transaction_date between :start_date and :end_date)
                       and stock_type_code in ('.$d->stock_type_code.')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
            $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();

            
         }else if($item_condition!=''){
            $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and (transaction_date between :start_date and :end_date)
                       and b.item_id in ('.$d->selected_item_id.')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
            $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();
            
         } 

         $report_data = array();
         foreach ($item_ids as $key => $value) {
                 // print_r($value['item_id']);
                 $query = "select item_id, qty, FORMAT((qty* rate),2) as amount
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'O'
                          and (transaction_date between :start_date and :end_date)";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $opening=$statement->fetch();



                 //Receive
                 $query = "select item_id, qty, FORMAT((( ((qty* rate)+p_and_f_charge+other_charges)-discount_amount )),2) as amount
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'R'
                          and (transaction_date between :start_date and :end_date)";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $receive=$statement->fetchAll();

                 //Issue
                 $query = "select item_id, qty, FORMAT((qty* rate),2) as amount
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'I'
                          and (transaction_date between :start_date and :end_date)";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $issue=$statement->fetchAll();


                 //Reject to party
                 $query = "select item_id, reject_to_party_qty, 
                           FORMAT((( ((reject_to_party_qty* rate)+p_and_f_charge+other_charges)-discount_amount )),2) as amount
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'RP'
                          and (transaction_date between :start_date and :end_date)";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rtp=$statement->fetchAll();

                 //Return to stock
                 $query = "select item_id, return_to_stock_qty, FORMAT((return_to_stock_qty* rate),2) as amount
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'RS'
                          and (transaction_date between :start_date and :end_date)";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->ed))));
                 $statement->bindParam(":start_date", $sd);
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rts=$statement->fetchAll();

                 //receive qty
                 $items = array();
                 $items['item_name']=utf8_encode($value['item_name']) . '('. $value['item_id'] .')';   
                 $items['stock_type_code']=$value['stock_type_code'];   
                 $items['uom_code']=$value['uom_code'];   
                 
                 $items['o_qty'] = $opening['qty'];   
                 $items['o_amount'] = $opening['amount'];   
                  
                 //receive 
                 $rq=0;
                 $ra=0; 
                 foreach ($receive as $rk => $rv) {
                    $rq = $rq + $rv['qty'];
                    $ra = $ra + (float)(str_replace(',', '', $rv['amount']));
                 }

                 $items['r_qty'] = $rq;   
                 $items['r_amount'] = $ra;   
                 
                 //issue
                 $iq=0;
                 $ia=0; 
                 foreach ($issue as $ik => $iv) {
                    $iq = $iq + $iv['qty'];
                    $ia = $ia + (float)(str_replace(',', '', $iv['amount']));
                 }

                 $items['i_qty'] = $iq;   
                 $items['i_amount'] = $ia;   

                 //reject to party  
                 $rtpq=0;
                 $rtpa=0; 
                 foreach ($rtp as $rk => $rv) {
                    $rtpq = $rtpq + $rv['reject_to_party_qty'];
                    $rtpa = $rtpa + (float)(str_replace(',', '', $rv['amount']));
                 }

                 $items['rp_qty'] = $rtpq;   
                 $items['rp_amount'] = $rtpa;   
                 
                 //return to stock
                 $rsq=0;
                 $rsa=0; 
                 foreach ($rts as $ik => $iv) {
                    $rsq = $rsq + $iv['return_to_stock_qty'];
                    $rsa = $rsa + (float)(str_replace(',', '', $iv['amount']));
                 }

                 $items['rs_qty'] = $rsq;   
                 $items['rs_amount'] = $rsa;   

                 $items['closing_qty'] = number_format((($items['o_qty'] + $items['r_qty']+ $items['rs_qty']) - $items['i_qty'] - $items['rp_qty']),2); 

                 $temp_oa = (float)(str_replace(',', '', $items['o_amount']));
                 $temp_ra = (float)(str_replace(',', '', $items['r_amount']));
                 $temp_ia = (float)(str_replace(',', '', $items['i_amount']));
                 $temp_rp = (float)(str_replace(',', '', $items['rp_amount']));
                 $temp_rs = (float)(str_replace(',', '', $items['rs_amount']));

                 
                   
                 $items['closing_amount'] = number_format(($temp_oa + $temp_ra + $temp_rs - $temp_ia - $temp_rp),2);   
                 $c_qty = (float)(str_replace(',', '', $items['closing_qty']));
                 if($c_qty!=0){
                   $items['closing_rate'] = number_format(((float)(str_replace(',', '', $items['closing_amount'])))/$c_qty,2);   
                 }else{
                  $items['closing_rate'] = 0;   
                 }
                 $report_data[] = $items;
             }

             $o_qty = 0; 
             $o_amount = 0; 
             $r_qty = 0;
             $r_amount = 0;
             $i_qty = 0;
             $i_amount = 0;
             $closing_qty = 0;
             $rp_amount = 0;
             $rs_amount = 0;
             $closing_amount = 0;
              

             foreach ($report_data as $k => $val) {
               $o_qty = '';
               $o_amount = $o_amount + (float)(str_replace(',', '', $val['o_amount']));
               $r_qty = '';
               //print_r($val['r_amount']);
               $r_amount = $r_amount + (float)(str_replace(',', '', $val['r_amount']));
               $i_qty = '';
               $i_amount = $i_amount + (float)(str_replace(',', '', $val['i_amount']));

               $rp_amount = $rp_amount + (float)(str_replace(',', '', $val['rp_amount']));
               
               $rs_amount = $rs_amount + (float)(str_replace(',', '', $val['rs_amount']));

               $closing_qty = '';
               //$closing_qty = $val['closing_qty'];
               $closing_amount = $closing_amount + (float)(str_replace(',', '', $val['closing_amount']));
             }

             $obj = array();
             $obj['o_qty'] = $o_qty; 
             $obj['o_amount'] = $o_amount; 
             $obj['r_qty'] = $r_qty;
             $obj['r_amount'] = $r_amount;
             $obj['i_qty'] = $i_qty;
             $obj['i_amount'] = $i_amount;
             $obj['closing_qty'] = $closing_qty;
             $obj['rp_amount'] = $rp_amount;
             $obj['rs_amount'] = $rs_amount;
             $obj['closing_amount'] = $closing_amount;
             if($closing_qty!=0){
               $obj['closing_rate'] = '';   
               //$obj['closing_rate'] = ((float)(str_replace(',', '', $closing_amount)))/$closing_qty;   
             }else{
               $obj['closing_rate'] = '';   
               //$obj['closing_rate'] = 0;   
             }
             

         // print_r($_SESSION['NTC_FINANCIAL_YEAR_ID']);
         // print_r($query);
         // var_dump($rs);

         $r1data = array();
         $r1data['status'] = "s";
         $r1data['items'] = $report_data;
         $r1data['total'] = $obj;
         return $r1data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

}
?>
