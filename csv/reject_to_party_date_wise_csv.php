<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Reject To Party (Date Wise).csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!='')
      $condition='and stock_type_code in ('.$_REQUEST['stock_type_code'].')';

         $query = "select reject_to_party_id, stock_type_code, reject_to_party_no,
                   date_format(reject_date, '%d/%m/%Y') as reject_date, 
                   transporter_name, lr_no, vehicle_no,  mode_of_transport, rejected_by
                   from reject_to_party 
                   where (reject_date between :start_date and :end_date) 
                   " .$condition. " 
                   and financial_year_id=:financial_year_id
                   order by reject_date asc, reject_to_party_id asc";
          
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

      $heading1=array('',  '',  '',  'Reject To Party (Docket Date Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number',  'Item Name',  'Location',  'Unit', 'Return Qty', 'Rate', 'Amount', 'Reason for Rejection');
      $blankLine=array();
      //$report_total=0;
          $report_total=0;
      foreach ($mainArray as $key => $value) {
        fputcsv($fp, $blankLine);   
        fputcsv($fp, $blankLine);   
        foreach ($value['issues'] as $k => $v) {
          $obj=array();
          $obj['reject_to_party_no']='Reject No: '.$v['rejectDetails']['stock_type_code'].'-'.$v['rejectDetails']['reject_to_party_no'];
          $obj['reject_date']='Reject Date: '.$v['rejectDetails']['reject_date'];
          $obj['rejected_by']='Reject By: '.$v['rejectDetails']['rejected_by'];
          fputcsv($fp, $obj);

          $obj=array();
          $obj['transporter_name']='Transporter Name: '.$v['rejectDetails']['transporter_name'];
          $obj['lr_no']='LR No: '.$v['rejectDetails']['lr_no'];
          $obj['vehicle_no']='Vehicle No: '.$v['rejectDetails']['vehicle_no'];
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
            $ob['reject_to_party_qty']=$value1['reject_to_party_qty'];
            $ob['rate']=$value1['rate'];
            $ob['amount']=$value1['amount'];
            $report_total=$report_total+($value1['reject_to_party_qty']*$value1['rate']);
            $ob['reject_to_party_remarks']=$value1['reject_to_party_remarks'];
            fputcsv($fp, $ob);   
          }
        }
      }

      $header=array('',  '',  '',  '', '', 'Total');
      $header[]=$report_total;
      fputcsv($fp, $blankLine);     
      fputcsv($fp, $blankLine);     
      fputcsv($fp, $header);
  
      exit;
?>