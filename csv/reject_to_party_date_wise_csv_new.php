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
      $condition='and a.stock_type_code in ('.$_REQUEST['stock_type_code'].')';

         $query = "select a.stock_type_code, reject_to_party_no, b.item_id,
                   date_format(reject_date, '%d/%m/%Y') as reject_date, 
                   transporter_name, lr_no, vehicle_no,  mode_of_transport, rejected_by,
                   item_name, reject_to_party_qty, rate, format((reject_to_party_qty*rate),3) as amount,
                   reject_to_party_remarks, uom_code, c.location
                   from reject_to_party a 
                   join transaction b on a.reject_to_party_id=b.reject_to_party_id
                   join item_master c on b.item_id=c.item_id
                   where (reject_date between :start_date and :end_date) 
                   " .$condition. " 
                   and a.financial_year_id=:financial_year_id
                   and transaction_type='RP'
                   order by reject_date asc, a.reject_to_party_id asc";
          
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetchAll();
         
         
      $heading1=array('',  '',  '',  'Reject To Party (Docket Date Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Reject No', 'Reject Date', 'Reject By', 'Transporter Name', 'LR No', 'Vehicle No', 'Mode Of Transportation', 'Item Name',  'Location',  'Unit', 'Return Qty', 'Rate', 'Amount', 'Reason for Rejection');
      $blankLine=array();

      fputcsv($fp, $header);     
      foreach ($details as $key1 => $value1) {
        $ob=array();
        $ob['reject_to_party_no']=$value1['stock_type_code'].'-'.$value1['reject_to_party_no'];
        $ob['reject_date']=$value1['reject_date'];
        $ob['rejected_by']=$value1['rejected_by'];
        $ob['transporter_name']=$value1['transporter_name'];
        $ob['lr_no']=$value1['lr_no'];
        $ob['vehicle_no']=$value1['vehicle_no'];
        $ob['mode_of_transport']=$value1['mode_of_transport'];

        $ob['item_name']=$value1['item_name'].'(Code:'.$value1['item_id'].')';
        $ob['location']=$value1['location'];
        $ob['uom_code']=$value1['uom_code'];
        $ob['reject_to_party_qty']=$value1['reject_to_party_qty'];
        $ob['rate']=$value1['rate'];
        $ob['amount']=$value1['amount'];
        $ob['reject_to_party_remarks']=$value1['reject_to_party_remarks'];
        fputcsv($fp, $ob);   
      }

  
      exit;
?>