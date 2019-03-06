<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Docket Register Date Wise.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!='')
      $condition='and a.stock_type_code in ('.$_REQUEST['stock_type_code'].')';

          $query = "select a.stock_type_code, docket_no, a.po_id as po_ids, 
                    date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                    date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no, 
                    date_format(challan_date, '%d/%m/%Y') as challan_date, 
                    transporter_name, transpotation_mode, vehicle_no, lr_no,
                    sub_total_amount, freight_charge,
                    a.p_and_f_charge, delivery_charge, loading_charge, packing_charge, courier_charge, 
                    round_off_amount, bill_amount, party_name, gst, item_name, uom_code, c.location, po_qty, 
                    qty, rate, format((qty * rate),2) as amount,
                    discount_percentage, discount_amount, c.p_and_f_charge,
                    amount_after_duty,
                    total
                    from docket a
                    join party_master b on a.party_id=b.party_id
                    join transaction c on a.docket_id=c.docket_id
                    join item_master d on c.item_id=d.item_id
                    where (docket_date between :start_date and :end_date) 
                    " .$condition. " 
                    and transaction_type='R'
                    and a.financial_year_id=:financial_year_id
                    and c.total>0
                    order by a.docket_date asc, a.docket_id asc";
                   
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetchAll();
         
         
      $heading1=array('',  '',  '',  'Docket Register (Date Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Docket Date', 'Docket No', 'Party Name', 'Bill No', 'Bill Date', 'Challan No', 'Challan Date', 'LR No', 'Vehicle No', 'GST No', 'Item Name',  'Location',  'Unit', 'Qty', 'Rate', 'Amount', 'Item Value');
      $blankLine=array();
      fputcsv($fp, $header);
      foreach ($details as $key => $value) {
       $obj=array();
       $obj['docket_date']=$value['docket_date'];
       $obj['docket_no']=$value['stock_type_code'].'-'.$value['docket_no'];
       $obj['party_name']=$value['party_name'];
       $obj['bill_no']=$value['bill_no'];
       $obj['bill_date']=$value['bill_date'];
       $obj['challan_no']=$value['challan_no'];
       if($value['challan_date']=='00/00/0000'){
        $obj['challan_date']='';
       }else{
        $obj['challan_date']=$value['challan_date'];
       }
       $obj['lr_no']=$value['lr_no'];
       $obj['vehicle_no']=$value['vehicle_no'];
       $obj['gst']=$value['gst'];

       $obj['item_name']=$value['item_name'];
       $obj['location']=$value['location'];
       $obj['uom_code']=$value['uom_code'];
       $obj['qty']=$value['qty'];
       $obj['rate']=$value['rate'];
       $obj['amount']=$value['amount'];
       $obj['total']=$value['total'];
       fputcsv($fp, $obj);   
      }


  
      exit;
?>