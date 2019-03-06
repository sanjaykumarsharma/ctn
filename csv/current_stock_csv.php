<?php
session_start();
require_once '../api/modules/conf.php';
    
     $con = getConnection();
     
      $filename = "Stock_".$_REQUEST['date'].".csv";
      $fp = fopen('php://output', 'w');

      
      $header=array('Material',  'UOM',  'Qty', 'Location', 'Stock Type');
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);
      fputcsv($fp, $header);
       
     
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
         
         $transaction_date=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['date']))));

         $statement = $con->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':transaction_date', $transaction_date);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->bindParam(":item_group_code", $_REQUEST['item_group_code']);
         $statement->bindParam(":stock_type_code", $_REQUEST['stock_type_code']);         
         $statement->execute();
         $rs=$statement->fetchAll();
          
         $prev_item_id='';
         $items=array();
         foreach ($rs as $key => $value) {
           if($prev_item_id==''){// loop runs first time
             $obj=array();
             //$obj['item_id']=$value['item_id'];
             $obj['item_name']=$value['item_name'];
             $obj['uom_code']=$value['uom_code'];
             $obj['qty']=$value['qty'];
             $obj['rate']=$value['rate'];
             $obj['amount']=$value['amount'];
             $obj['location']=$value['location'];
             $obj['stock_type_code']=$value['stock_type_code'];
             $prev_item_id=$value['item_id'];
           }else if($prev_item_id==$value['item_id']){
             $prev_item_id=$value['item_id'];
           }else if($prev_item_id!=$value['item_id']){
             $items[]=$obj;
             $prev_item_id=$value['item_id'];
             $obj=array();
             //$obj['item_id']=$value['item_id'];
             $obj['item_name']=$value['item_name'];
             $obj['uom_code']=$value['uom_code'];
             $obj['qty']=$value['qty'];
             $obj['rate']=$value['rate'];
             $obj['amount']=$value['amount'];
             $obj['location']=$value['location'];
             $obj['stock_type_code']=$value['stock_type_code'];
             $prev_item_id=$value['item_id'];
           }
         }

         $items[]=$obj;
      

      foreach ($items as $key => $value) {
        fputcsv($fp, $value);
      }
      exit;
?>