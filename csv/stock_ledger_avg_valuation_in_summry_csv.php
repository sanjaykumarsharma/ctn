<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "stock_ledger_avg_valuation_in_summry.csv";
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
                 $query = "select item_id, qty, FORMAT((qty* rate),2) as amount
                          from transaction
                          where financial_year_id = :financial_year_id
                          and item_id = :item_id
                          and transaction_type = 'O'
                          and (transaction_date between :start_date and :end_date)";         
             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                 $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
                 $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                  
                 $rq=0;
                 $ra=0; 
                 foreach ($receive as $rk => $rv) {
                    $rq = $rq + $rv['qty'];
                    $ra = $ra + (float)(str_replace(',', '', $rv['amount']));
                 }

                 $items['r_qty'] = $rq;   
                 $items['r_amount'] = $ra;   
                 
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
             $obj['item_name']='';   
             $obj['stock_type_code']='';   
             $obj['uom_code']='Total'; 
             $obj['o_qty'] = $o_qty; 
             $obj['o_amount'] = $o_amount; 
             $obj['r_qty'] = $r_qty;
             $obj['r_amount'] = $r_amount;
             $obj['i_qty'] = $i_qty;
             $obj['i_amount'] = $i_amount;
             $obj['rp_qty'] = '';
             $obj['rp_amount'] = $rp_amount;
             $obj['rs_qty'] = '';
             $obj['rs_amount'] = $rs_amount;
             if($closing_qty!=0){
               $obj['closing_rate'] = '';   
               //$obj['closing_rate'] = ((float)(str_replace(',', '', $closing_amount)))/$closing_qty;   
             }else{
               $obj['closing_rate'] = '';   
               //$obj['closing_rate'] = 0;   
             }
             $obj['closing_qty'] = $closing_qty;
             $obj['closing_amount'] = $closing_amount;


     /*******************************************************************/ 
         

      $heading1=array('',  '',  '',  'Stock Ledger Avg Valuation Summry', '', '', '', '');
      fputcsv($fp, $heading1);
      $header=array('Item',  'Stock Type',  'Unit',  'Opening Qty', 'Opening Amount', 'Receive Qty', 'Receive Amount', 'Issue Qty', 'Issue Amount', 'RP Qty', 'RP Amount', 'RS Qty', 'RS Amount', 'Closing Avg Rate', 'Closing Qty', 'Closing Amount');
            
      $blankLine=array();
      fputcsv($fp, $header);     
      foreach ($report_data as $key => $value) {
          
          $ob=array();
          $ob['item_name']=$value['item_name'];   
          $ob['stock_type_code']=$value['stock_type_code'];   
          $ob['uom_code']=$value['uom_code'];   
          $ob['o_qty'] = $value['o_qty'];   
          $ob['o_amount'] = $value['o_amount'];   
          $ob['r_qty'] = $value['r_qty'];   
          $ob['r_amount'] = $value['r_amount'];   
          $ob['i_qty'] = $value['i_qty'];   
          $ob['i_amount'] = $value['i_amount'];   
          $ob['rp_qty'] = $value['rp_qty'];   
          $ob['rp_amount'] = $value['rp_amount'];   
          $ob['rs_qty'] = $value['rs_qty'];   
          $ob['rs_amount'] = $value['rs_amount'];   
          $ob['closing_avg_rate'] = $value['closing_rate'];   
          $ob['closing_qty'] = $value['closing_qty'];   
          $ob['closing_amount'] = $value['closing_amount'];   
          fputcsv($fp, $ob);   
        
      }
         fputcsv($fp, $obj);   
      exit;
?>