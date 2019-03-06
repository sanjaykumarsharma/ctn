<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "stock_movement_register_item_wise.csv";
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
         $report_data = array();
         if($item_condition==''){
            $query1 = 'select a.item_id 
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and stock_type_code in ('.$_REQUEST['stock_type_code'].')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();

            
         }else if($item_condition!=''){
            $query1 = 'select a.item_id 
                       from item_master a
                       join transaction b on a.item_id=b.item_id
                       where b.financial_year_id = :financial_year_id
                       and b.item_id in ('.$_REQUEST['selected_item_id'].')';

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
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
                  order by transaction_date asc, transaction_id desc";         
         
             $statement = $objPDO->prepare($query);
             $statement->setFetchMode(PDO::FETCH_ASSOC);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement->bindParam(':item_id', $value['item_id']);
             $statement->execute();
             $rs=$statement->fetchAll();
             
             //$items = array();
             //$items['item_name']=$rs[0]['item_name'] . '('. $rs[0]['item_id'] .')';   
             //$items['items']=$rs;   
             $report_data[] = $rs;
         }
     /*******************************************************************/ 
         

      $heading1=array('',  '',  '',  'Stock Movement Register Item Wise (Item Wise)', '', '', '', '');
      fputcsv($fp, $heading1);
      $header=array('Item',  'Transaction Dt',  'Stock Type',  'Transaction Type', 'Unit', 'Qty', 'Rate');
      $blankLine=array();
      fputcsv($fp, $header);     
      foreach ($report_data as $key => $value) {
        foreach ($value as $key1 => $value1) {
          $ob=array();
          $ob['item_name']=$value1['item_name'] .'('. $value1['item_id'] .')';
          $ob['td']=$value1['td'];
          $ob['stock_type_code']=$value1['stock_type_code'];
          $ob['transaction_type']=$value1['transaction_type'];
          $ob['uom_code']=$value1['uom_code'];
          $ob['qty']=$value1['qty'];
          $ob['rate']=$value1['rate'];
          fputcsv($fp, $ob);   
        }
      }

      exit;
?>