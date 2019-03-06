<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Retuen To Stock (Date Wise).csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!='')
      $condition='and stock_type_code in ('.$_REQUEST['stock_type_code'].')';

         $query = "select return_to_stock_id, stock_type_code, return_to_stock_no,
                   date_format(return_date, '%d/%m/%Y') as return_date, return_by
                   from return_to_stock 
                   where (return_date between :start_date and :end_date) 
                   " .$condition. " 
                   and financial_year_id=:financial_year_id
                   order by return_date asc, return_to_stock_id asc";
          
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
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

      $heading1=array('',  '',  '',  'Return To Stock (Date Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number',  'Item Name',  'Location',  'Unit', 'Qty');
      $blankLine=array();
      //$report_total=0;
      foreach ($mainArray as $key => $value) {
        fputcsv($fp, $blankLine);   
        fputcsv($fp, $blankLine);   
        foreach ($value['issues'] as $k => $v) {
          $obj=array();
          $obj['return_to_stock_no']='Return No: '.$v['returnDetails']['stock_type_code'].'-'.$v['returnDetails']['return_to_stock_no'];
          $obj['return_date']='Return Date: '.$v['returnDetails']['return_date'];
          $obj['return_by']='Return By: '.$v['returnDetails']['return_by'];
          fputcsv($fp, $obj);

          fputcsv($fp, $blankLine);     
          fputcsv($fp, $header);     
          $count=0;
          foreach ($v['transactions'] as $key1 => $value1) {
            $count++;
            $ob=array();
            $ob['sl']=$count;
            $ob['item_name']=$value1['item_name'].'(Code:'.$value1['item_id'].')';
            $ob['location']=$value1['location'];
            $ob['uom_code']=$value1['uom_code'];
            $ob['return_to_stock_qty']=$value1['return_to_stock_qty'];
            fputcsv($fp, $ob);   
          }
        }
      }

            /*fputcsv($fp, $blankLine);   
            fputcsv($fp, $blankLine);   
            $ob=array();//Report Total
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Grand Total';
            $ob['report_total']=$report_total;
            fputcsv($fp, $ob);  */ 
  
      exit;
?>