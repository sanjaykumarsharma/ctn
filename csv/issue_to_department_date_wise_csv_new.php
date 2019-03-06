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
      $condition='and a.stock_type_code in ('.$_REQUEST['stock_type_code'].')';

      $condition1='and stock_adjustment = :stock_adjustment';

          $query = "select a.stock_type_code, issue_no,
                   date_format(issue_date, '%d/%m/%Y') as issue_date, 
                   department, approve_by, receive_by, stock_adjustment,
                   concat(concat(concat(item_name,'(Code:'),d.item_id),')') as material, uom_code, d.location, 
                   c.qty, rate, FORMAT((c.qty*rate),2) as amount, chargehead
                   from issue_to_department a
                   join department_master b on a.department_id=b.department_id 
                   join transaction c on (c.issue_id=a.issue_id and c.financial_year_id=a.financial_year_id)
                   join item_master d on c.item_id = d.item_id
                   left join stock_in_hand e on (c.item_id=e.item_id and c.financial_year_id=e.financial_year_id)
                   left join chargehead_master f on c.charge_head_id=f.chargehead_id
                   where (issue_date between :start_date and :end_date) 
                   " .$condition. $condition1. " 
                   and transaction_type='I'
                   and a.financial_year_id=:financial_year_id
                   order by a.issue_date asc, a.issue_id asc";
                   
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
         

      $heading1=array('',  '',  '',  'Issue To Department (Date Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Issue No', 'Issue Date', 'Issue By', 'Receive By', 'Department', 'Item Name',  'Location',  'Unit', 'Qty', 'Rate', 'Amount', 'Chargehead');
      $blankLine=array();

      fputcsv($fp, $header);     
      foreach ($details as $key1 => $value1) {
        $ob=array();
        $ob['issue_no']=$value1['stock_type_code'].'-'.$value1['issue_no'];
        $ob['issue_date']=$value1['issue_date'];
        $ob['approve_by']=$value1['approve_by'];
        $ob['receive_by']=$value1['receive_by'];
        $ob['department']=$value1['department'];
        $ob['item_name']=$value1['material'];
        $ob['location']=$value1['location'];
        $ob['uom_code']=$value1['uom_code'];
        $ob['qty']=$value1['qty'];
        $ob['rate']=$value1['rate'];
        $ob['amount']=$value1['amount'];
        $ob['chargehead']=$value1['chargehead'];
        fputcsv($fp, $ob);   
      }

  
      exit;
?>