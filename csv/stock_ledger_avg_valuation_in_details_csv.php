<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "stock_ledger_avg_valuation_in_details.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!=''){
          $condition='and stock_type_code in ('.$_REQUEST['stock_type_code'].')';
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
                       and (transaction_date between :start_date and :end_date)
                       and stock_type_code in ('.$_REQUEST['stock_type_code'].')';           

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                       and b.item_id in ('.$_REQUEST['selected_item_id'].')';           

            $statement1 = $objPDO->prepare($query1);
            $statement1->setFetchMode(PDO::FETCH_ASSOC);
            $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
            $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
            $statement1->bindParam(":start_date", $sd);
            $statement1->bindParam(":end_date", $ed);
            $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
            $statement1->execute();
            $item_ids=$statement1->fetchAll();
            
         } 

         $report_data = array();
         foreach ($item_ids as $key => $value) {
                 // print_r($value['item_id']);
                 $query = "select  o_qty, rate, o_amount, r_qty, r_amount, i_qty,  i_amount, transaction_date, transaction_id, running_balance, running_amount, td, details
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

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, qty as r_qty, FORMAT((( ((a.qty* a.rate)+a.p_and_f_charge+a.other_charges)-a.discount_amount )),2) as r_amount,  '' as i_qty, '' as i_amount, transaction_date, transaction_id,
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
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                   $o_qty = $o_qty + $val['o_qty'];
                   //$o_rate = $o_rate + $val['o_rate'];
                   $o_amount = $o_amount + ((float)(str_replace(',', '', $val['o_amount'])));
                   $r_qty = $r_qty + $val['r_qty'];
                   //$r_rate = $r_rate + $val['r_rate'];
                   $r_amount = $r_amount + ((float)(str_replace(',', '', $val['r_amount'])));
                   $i_qty = $i_qty + $val['i_qty'];
                   //$i_rate = $i_rate + $val['i_rate'];
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
     /*******************************************************************/ 
         

      $heading1=array('',  '',  '',  'Stock Ledger Avg Valuation Details', '', '', '', '');
      fputcsv($fp, $heading1);
      $header=array('Sl','Details',  'Date',  'Opening Qty',  'Opening Amount', 'Receive Qty', 'Receive Amount', 'Issue Qty', 'Issue Amount', 'Balance Qty', 'Balance Amount');
      
      $blankLine=array();
      foreach ($report_data as $key => $value) {
          $ob=array();
          $ob['item_name']=$value['item_name'];
          fputcsv($fp, $ob);   
          fputcsv($fp, $header);    
          $count=0;
        foreach ($value['items'] as $key1 => $value1) {
          $ob=array();
          $ob['sl']=$count+1;
          $ob['details']=$value1['details'];
          $ob['td']=$value1['td'];
          $ob['o_qty']=$value1['o_qty'];
          $ob['o_amount']=$value1['o_amount'];
          $ob['r_qty']=$value1['r_qty'];
          $ob['r_amount']=$value1['r_amount'];
          $ob['i_qty']=$value1['i_qty'];
          $ob['i_amount']=$value1['i_amount'];
          $ob['running_balance']=$value1['running_balance'];
          $ob['running_amount']=$value1['running_amount'];
          fputcsv($fp, $ob);   
        }

          $ob=array();
          $ob['sl']='';
          $ob['details']='';
          $ob['td']='Total';
          $ob['o_qty']=$value['o_qty'];
          $ob['o_amount']=$value['o_amount'];
          $ob['r_qty']=$value['r_qty'];
          $ob['r_amount']=$value['r_amount'];
          $ob['i_qty']=$value['i_qty'];
          $ob['i_amount']=$value['i_amount'];
          $ob['running_balance']=$value['running_balance'];
          $ob['running_amount']=$value['running_amount'];
          fputcsv($fp, $ob);   
      }

      exit;
?>