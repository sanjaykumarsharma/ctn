<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "stock_valuation_summry_store_type_wise.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!=''){
          $condition='and c.stock_type_code in ('.$_REQUEST['stock_type_code'].')';
       }

     $item_condition='';
      if($_REQUEST['selected_item_id']!=''){
          $item_condition='and a.item_id in ('.$_REQUEST['selected_item_id'].')';
       } 

     /*******************************************************************/ 
     $item_ids= array();
         if($item_condition==''){
            $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and transaction_date <= :end_date
                       and stock_type_code in ('.$_REQUEST['stock_type_code'].')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            // $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                       and b.item_id in ('.$_REQUEST['selected_item_id'].')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            // $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->sd))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
                 $statement->bindParam(":end_date", $ed);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rs=$statement->fetch();

                 //receive qty
                 $items = array();
                 $items['item_name']=$value['item_name'] . '('. $value['item_id'] .')';   
                 $items['stock_type_code']=$value['stock_type_code'];   
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
             $obj['item_name'] = ''; 
             $obj['stock_type_code'] = ''; 
             $obj['uom_code'] = ''; 
             $obj['o_qty'] = $o_qty; 
             $obj['r_qty'] = $r_qty;
             $obj['i_qty'] = $i_qty;
             $obj['rp_qty'] = $rp_qty;
             $obj['rs_qty'] = $rs_qty;
             $obj['closing_qty'] = $closing_qty;


     /*******************************************************************/ 
         

      $heading1=array('',  '',  '',  'Stock Valuation Summry Store Type Wise', '', '', '', '');
      fputcsv($fp, $heading1);
      $header=array('Item',  'Stock Type',  'Unit',  'Opening Qty', 'Receive Qty', 'Issue Qty', 'Reject to Party', 'Return to Stock', 'Closing Balance');
      
      $blankLine=array();
      fputcsv($fp, $header);     
      foreach ($report_data as $key => $value1) {
        
          $ob=array();
          $ob['item_name']=$value1['item_name'];
          $ob['stock_type_code']=$value1['stock_type_code'];
          $ob['uom_code']=$value1['uom_code'];
          $ob['o_qty']=$value1['o_qty'];
          $ob['r_qty']=$value1['r_qty'];
          $ob['i_qty']=$value1['i_qty'];
          $ob['rp_qty']=$value1['rp_qty'];
          $ob['rs_qty']=$value1['rs_qty'];
          $ob['closing_qty']=$value1['closing_qty'];
          fputcsv($fp, $ob);   
        
      }
         fputcsv($fp, $obj);   
      exit;
?>