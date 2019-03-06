<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Reject To Party (Item Wise).csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!='')
      $condition='and e.stock_type_code in ('.$_REQUEST['stock_type_code'].')';

      $party_condition='';
      if($_REQUEST['party_id']!='')
      $party_condition='and e.party_id in ('.$_REQUEST['party_id'].')';


         $query = "select d.reject_to_party_id, a.item_id, item_name, item_description, d.docket_id,
                   reject_to_party_qty, rate, format((reject_to_party_qty*rate),3) as amount,
                   date_format(transaction_date, '%d/%m/%Y') as reject_date, 
                   reject_to_party_remarks, uom_code, max_level, min_level, b.location,
                   d.stock_type_code, reject_to_party_no,
                   d.transporter_name, d.lr_no, d.vehicle_no,  d.mode_of_transport, d.rejected_by,
                   party_name, e.party_id
                   from transaction a 
                   join reject_to_party d on a.reject_to_party_id=d.reject_to_party_id
                   join docket e on d.docket_id=e.docket_id
                   join party_master f on e.party_id=f.party_id
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on (b.item_id = c.item_id and a.financial_year_id=c.financial_year_id)
                   where (transaction_date between :start_date and :end_date)
                  " .$condition. $party_condition. " 
                  and transaction_type='RP'
                  and a.financial_year_id=:financial_year_id
                  order by e.party_id, a.transaction_date asc, d.reject_to_party_id asc";
                   
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         
         $prev_party_id='';
         $party_name='';
         $issueArray=array();
         $obj=array();
         foreach ($transactions as $key => $value) {
           if($prev_party_id==''){//loop run first time
            $obj=array();
            $prev_party_id=$value['party_id'];
            $party_name=$value['party_name'];
            $obj[]=$value;
           }else if($prev_party_id==$value['party_id']){//same date
            $obj[]=$value;
           }else if($prev_party_id!=$value['party_id']){// new date starts
            $issueArray[$party_name]=$obj;
            $obj=array();
            $prev_party_id=$value['party_id'];
            $party_name=$value['party_name'];
            $obj[]=$value;
           }
         }
         $issueArray[$party_name]=$obj;
                   
         
         $mainArray=array(); 
         foreach ($issueArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['party']=$key;
            $ob['issues']=$value;
            $mainArray[]=$ob;
         }

      $heading1=array('',  '',  '',  'Reject To Party (Party Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number', 'Reject No', 'Reject Date',  'Reject By',  'Item', 'Location', 'Unit', 'Qty', 'Rate','Amount');
      $blankLine=array();
      $report_total=0;
      foreach ($mainArray as $key => $value) {
        fputcsv($fp, $blankLine);   
        fputcsv($fp, $blankLine); 

        $obj=array();
        $obj['party']=$value['party'];
        fputcsv($fp, $obj);
        fputcsv($fp, $blankLine);     
        fputcsv($fp, $header);       
          $count=0;
        foreach ($value['issues'] as $k => $value1) {
            $count++;
            $ob=array();
            $ob['sl']=$count;
            $ob['reject_to_party_no']=$value1['stock_type_code'].'-'.$value1['reject_to_party_no'];
            $ob['reject_date']=$value1['reject_date'];
            $ob['rejected_by']=$value1['rejected_by'];
            $ob['item_name']=$value1['item_name'].'-(Code:'.$value1['item_id'].')';
            $ob['location']=$value1['location'];
            $ob['uom_code']=$value1['uom_code'];
            $ob['reject_to_party_qty']=$value1['reject_to_party_qty'];
            $ob['rate']=$value1['rate'];
            $ob['amount']=$value1['amount'];
            $report_total=$report_total+($value1['reject_to_party_qty']*$value1['rate']);
            fputcsv($fp, $ob);   
        }
      }

      $header=array('',  '',  '',  '', '',  '', '','', 'Total');
      $header[]=$report_total;
      fputcsv($fp, $blankLine);     
      fputcsv($fp, $blankLine);     
      fputcsv($fp, $header);
       
      exit;
?>