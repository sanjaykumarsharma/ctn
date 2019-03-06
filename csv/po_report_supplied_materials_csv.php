<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "PO Report.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

     $party_condition='';
     if($_REQUEST['party_id']!=''){
        $party_condition='and party_id in('.$_REQUEST['party_id'].')';
      }

     $stock_type_condition='';
      if($_REQUEST['stock_type']!=''){
        $stock_type_condition='and stock_type_code in ('.$_REQUEST['stock_type'].')';
      }
       
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
         $query = "select distinct po_id, concat(stock_type_code,'-', po_no) as po_number,
                   date_format(po_date, '%d/%m/%Y') as po_date
                   from purchase_order 
                   where po_id in (select DISTINCT po_id from docket)
                   and financial_year_id=:financial_year_id
                   and po_date between :start_date and :end_date
                  " .$party_condition. $stock_type_condition ;

        $pidsArray=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(":start_date", $sd);
        $statement->bindParam(":end_date", $ed);
        $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        $statement->execute();
        $pidsArray=$statement->fetchAll();
        
        $pids=0; 
        $poNumberArray=array();
        $poDateArray=array();
        foreach ($pidsArray as $key => $value) {
          if($pids==0){
            $pids=$value['po_id'];
          }else{
            $pids=$pids.','.$value['po_id'];
          }
          $poNumberArray[$value['po_id']]=$value['po_number'];
          $poDateArray[$value['po_id']]=$value['po_date'];
        }           

         $query = "select transaction_id, a.item_id, item_name, a.po_id,
                    uom_code, a.location, po_qty, format((po_qty * rate),2) as po_amount,
                    qty, rate, format((qty * rate),2) as amount,
                    discount_percentage, discount_amount, a.p_and_f_charge,
                    amount_after_duty,
                    total, a.remarks,
                    date_format(transaction_date, '%d/%m/%Y') as transaction_date,
                    c.stock_type_code, docket_no, party_name, gst,
                    date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no,
                    date_format(bill_date, '%d/%m/%Y') as bill_date
                    from (select po_id, docket_id, stock_type_code, docket_no, docket_date, bill_no, bill_date, party_id
                          from docket where po_id in (".$pids.")) c 
                    join (select  po_id, transaction_id, docket_id, item_id, location, po_qty, qty, rate, discount_percentage, discount_amount, p_and_f_charge, amount_after_duty, total, remarks, transaction_date
                         from transaction where po_id in (".$pids.")
                         and transaction_type='R'
                         and total>0
                         and financial_year_id=:financial_year_id) a on c.docket_id=a.docket_id
                    join item_master b on a.item_id=b.item_id
                    join party_master d on c.party_id=d.party_id
                    order by a.item_id asc, a.transaction_date asc";

           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();

         $mainArray=array(); 
         foreach ($transactions as $key => $value) {
           $ob=array();
           $i=$value['po_id'];
           $ob['po_number']=$poNumberArray[$i];
           $ob['po_date']=$poDateArray[$i];
           $ob['item_id']=$value['item_id'];
           $ob['item_name']=$value['item_name'];
           $ob['po_id']=$value['po_id'];
           $ob['uom_code']=$value['uom_code'];
           $ob['location']=$value['location'];
           $ob['po_qty']=$value['po_qty'];
           $ob['qty']=$value['qty'];
           $ob['rate']=$value['rate'];
           $ob['po_amount']=$value['po_amount'];
           $ob['amount']=$value['amount'];
           $ob['discount_percentage']=$value['discount_percentage'];
           $ob['discount_amount']=$value['discount_amount'];
           $ob['p_and_f_charge']=$value['p_and_f_charge'];
           $ob['amount_after_duty']=$value['amount_after_duty'];
           $ob['total']=$value['total'];
           $ob['remarks']=$value['remarks'];
           $ob['transaction_date']=$value['transaction_date'];
           $ob['stock_type_code']=$value['stock_type_code'];
           $ob['docket_no']=$value['docket_no'];
           $ob['party_name']=$value['party_name'];
           $ob['gst']=$value['gst'];
           $ob['docket_date']=$value['docket_date'];
           $ob['bill_no']=$value['bill_no'];
           $ob['bill_date']=$value['bill_date'];
           $mainArray[]=$ob;
         }

      $heading1=array('',  '',  '',  'PO Report', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('PO No',  'PO Date', 'Party Name', 'Item', 'Location', 'Unit', 'PO Qty', 'Rate','PO Amount', 'Docket No', 'Docket Dt', 'Bill No', 'Bill Date', 'Qty', 'Amount', 'Item Value');
     
      $blankLine=array();
      $report_total=0;
      fputcsv($fp, $header);     
      foreach ($mainArray as $key => $value) {
       $ob=array();
       $i=$value['po_id'];
       $ob['po_number']=$poNumberArray[$i];
       $ob['po_date']=$poDateArray[$i];
       $ob['party_name']=$value['party_name'];
       $ob['item_name']=$value['item_name'].'(Code-'.$value['item_id'].')';
       $ob['location']=$value['location'];
       $ob['uom_code']=$value['uom_code'];
       $ob['po_qty']=$value['po_qty'];
       $ob['rate']=$value['rate'];
       $ob['po_amount']=$value['po_amount'];
       $ob['docket_no']=$value['stock_type_code'].'-'.$value['docket_no'];
       $ob['docket_date']=$value['docket_date'];
       $ob['bill_no']=$value['bill_no'];
       $ob['bill_date']=$value['bill_date'];
       $ob['qty']=$value['qty'];
       $ob['amount']=$value['amount'];
       $ob['total']=$value['total'];
       $report_total=$report_total+$value['total'];
       fputcsv($fp, $ob);   
      }
      $footer=array('',  '', '', '', '', '', '', '', '','', '', '', '','');
      $footer[]='Grand Total';
      $footer[]=$report_total;
      fputcsv($fp, $footer);   
  
      exit;
?>