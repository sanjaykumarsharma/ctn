<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Issue To Department Date Wise.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!='')
      $condition='and stock_type_code in ('.$_REQUEST['stock_type_code'].')';

      $condition1='and stock_adjustment = :stock_adjustment';

      $condition2='and a1.stock_type_code in ('.$_REQUEST['stock_type_code'].')';

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
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(":stock_adjustment", $_REQUEST['stock_adjustment']);
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
           $statement->bindParam(":stock_adjustment", $_REQUEST['stock_adjustment']);
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
                   $data1=array();
                   $data1['transactions']=$issueTransactions;
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
                   $oj['material']='';
                   $oj['location']='';
                   $oj['chargehead']='';
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

      $heading1=array('',  '',  '',  'Issue To Department (Date Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number',  'Item Name',  'Location',  'Unit', 'Qty', 'Rate', 'Amount', 'Chargehead');
      $blankLine=array();
      //$report_total=0;
      foreach ($mainArray as $key => $value) {
        fputcsv($fp, $blankLine);   
        fputcsv($fp, $blankLine);   
        foreach ($value['issues'] as $k => $v) {
          $obj=array();
          $obj['issue_no']='Issue No: '.$v['issueDetails']['stock_type_code'].'-'.$v['issueDetails']['issue_no'];
          $obj['issue_date']='Issue Date: '.$v['issueDetails']['issue_date'];
          $obj['approve_by']='Issue By: '.$v['issueDetails']['approve_by'];
          fputcsv($fp, $obj);

          $obj=array();
          $obj['receive_by']='Receive By: '.$v['issueDetails']['receive_by'];
          $obj['department']='Department: '.$v['issueDetails']['department'];
          fputcsv($fp, $obj);

          fputcsv($fp, $blankLine);     
          fputcsv($fp, $header);     
          $count=0;
          foreach ($v['transactions'] as $key1 => $value1) {
            $count++;
            $ob=array();
            $ob['sl']=$count;
            $ob['item_name']=$value1['material'];
            $ob['location']=$value1['location'];
            $ob['uom_code']=$value1['uom_code'];
            $ob['qty']=$value1['qty'];
            $ob['rate']=$value1['rate'];
            $ob['amount']=$value1['amount'];
            $ob['chargehead']=$value1['chargehead'];
            fputcsv($fp, $ob);   
          }
        }
      }

            //Report Total
            fputcsv($fp, $blankLine);   
            fputcsv($fp, $blankLine);   
            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['rate']='';
            $ob['qty']='Grand Total Qty';
            $ob['total']=$qty_grand_total;
            $ob['report_total']='Grand Total Amount';
            $ob['amount_grand_total']=$amount_grand_total;
            fputcsv($fp, $ob);   
  
      exit;
?>