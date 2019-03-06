<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Docket Register Party Wise.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['selected_party_id']!='')
      $condition='and a.party_id in ('.$_REQUEST['selected_party_id'].')';

         $query = "select docket_id, stock_type_code, docket_no, po_id as po_ids, 
                   date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                   date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no, 
                   date_format(challan_date, '%d/%m/%Y') as challan_date, 
                   transporter_name, transpotation_mode, vehicle_no, lr_no,
                   sub_total_amount, freight_charge,
                   p_and_f_charge, delivery_charge, loading_charge, packing_charge, courier_charge, 
                   round_off_amount, bill_amount, remarks, party_name, a.party_id, gst
                   from docket a
                   join party_master b on a.party_id=b.party_id
                   where (docket_date between :start_date and :end_date) 
                   " .$condition. " 
                   order by a.party_id asc, docket_id asc";
                   
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         //$statement->bindParam(":stock_type_code", $_REQUEST['stock_type_code']);
         //$statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetchAll();
         
         
         $prev_party='';
         $docketArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_party==''){//loop run first time
            $obj=array();
            $prev_party=$value['party_name'];
            $obj[]=$value;
           }else if($prev_party==$value['party_name']){//same date
            $obj[]=$value;
           }else if($prev_party!=$value['party_name']){// new date starts
            $docketArray[$prev_party]=$obj;
            $obj=array();
            $prev_party=$value['party_name'];
            $obj[]=$value;
           }
         }
         $docketArray[$prev_party]=$obj;

         $query = "select docket_id, transaction_id, a.item_id, item_name, uom_code, a.location, po_qty, 
                    qty, rate, format((qty * rate),2) as amount,
                    discount_percentage, discount_amount, p_and_f_charge,
                    amount_after_duty,
                    total, remarks,
                    date_format(transaction_date, '%d/%m/%Y') as transaction_date
                    from transaction a 
                    join item_master b on a.item_id=b.item_id
                    where (transaction_date between :start_date and :end_date)
                    and total>0 
                    and transaction_type='R'
                    order by a.transaction_date asc, docket_id asc";

           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           //$statement->bindParam(":stock_type_code", $_REQUEST['stock_type_code']);
           //$statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();
            
            $qty_grand_total = 0;
            $item_value_grand_total = 0;
            $mainArray=array(); 
           foreach ($docketArray as $key => $value) { //Docket details array

              $docketMain=array();//for one docket transactions
              foreach ($value as $key1 => $value1) { //array of all dockets of one date
                  $docketTransactions=array();
                  foreach ($transactions as $key2 => $value2) { //Docket transactions
                     if($value1['docket_id']==$value2['docket_id']){
                      $docketTransactions[]=$value2; //collecting same docket transactions 
                     }
                  }

                   $obj=array();
                   $obj['date']=$key;
                   $obj['stock_type_code']=$value1['stock_type_code'];
                   $obj['docket_date']=$value1['docket_date'];
                   $obj['docket_no']=$value1['docket_no'];
                   $obj['bill_no']=$value1['bill_no'];
                   $obj['bill_date']=$value1['bill_date'];
                   $obj['challan_no']=$value1['challan_no'];
                   if($value1['challan_date']=='00/00/0000'){
                    $obj['challan_date']='';
                   }else{
                    $obj['challan_date']=$value1['challan_date'];
                   }
                   $obj['transporter_name']=$value1['transporter_name'];
                   $obj['transpotation_mode']=$value1['transpotation_mode'];
                   $obj['vehicle_no']=$value1['vehicle_no'];
                   $obj['lr_no']=$value1['lr_no'];
                   $obj['sub_total_amount']=$value1['sub_total_amount'];
                   $obj['freight_charge']=$value1['freight_charge'];
                   $obj['p_and_f_charge']=$value1['p_and_f_charge'];
                   $obj['delivery_charge']=$value1['delivery_charge'];
                   $obj['loading_charge']=$value1['loading_charge'];
                   $obj['packing_charge']=$value1['packing_charge'];
                   $obj['courier_charge']=$value1['courier_charge'];
                   $obj['round_off_amount']=$value1['round_off_amount'];
                   $obj['bill_amount']=$value1['bill_amount'];
                   $obj['remarks']=$value1['remarks'];
                   $obj['party_name']=$value1['party_name'];
                   $obj['gst']=$value1['gst'];

                   $data1=array();
                   $data1['transactions']=$docketTransactions;
                   $data1['docketDetails']=$obj;

                   $docketMain[]=$data1;

                   foreach ($docketTransactions as $dtkey => $value) {
                     $qty_grand_total = $qty_grand_total + $value['qty'];
                     $item_value_grand_total = $item_value_grand_total + $value['total'];
                   }
              }
                 $ob=array();
                 $ob['date']=$key;
                 $ob['dockets']=$docketMain;
            $mainArray[]=$ob;
           }

      $heading1=array('',  '',  '',  'Docket Register (Party Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number',  'Item Name',  'Location',  'Unit', 'Qty', 'Rate', 'Amount', 'Item Value');
      $blankLine=array();
      $report_total=0;
      foreach ($mainArray as $key => $value) {
        fputcsv($fp, $blankLine);   
        fputcsv($fp, $blankLine);   
        foreach ($value['dockets'] as $k => $v) {
          $obj=array();
          $obj['docket_no']='Docket No: '.$v['docketDetails']['stock_type_code'].'-'.$v['docketDetails']['docket_no'];
          $obj['docket_date']='Docket Date: '.$v['docketDetails']['docket_date'];
          $obj['party_name']='Party: '.$v['docketDetails']['party_name'];
          fputcsv($fp, $obj);

          $obj=array();
          $obj['bill_no']='Bill No: '.$v['docketDetails']['bill_no'];
          $obj['bill_date']='Bill Date: '.$v['docketDetails']['bill_date'];
          $obj['vehicle_no']='Vehicle No: '.$v['docketDetails']['vehicle_no'];
          fputcsv($fp, $obj);

          $obj=array();
          $obj['challan_no']='Challan No: '.$v['docketDetails']['challan_no'];
          $obj['challan_date']='Challan Date: '.$v['docketDetails']['challan_date'];
          $obj['lr_no']='LR No: '.$v['docketDetails']['lr_no'];
          fputcsv($fp, $obj);

          $obj=array();
          $obj['gst']='GST No: '.$v['docketDetails']['gst'];
          fputcsv($fp, $obj);

          fputcsv($fp, $blankLine);     
          fputcsv($fp, $header);     
          $count=0;
          foreach ($v['transactions'] as $key1 => $value1) {
            $count++;
            $ob=array();
            $ob['sl']=$count;
            $ob['item_name']=$value1['item_name'];
            $ob['location']=$value1['location'];
            $ob['uom_code']=$value1['uom_code'];
            $ob['qty']=$value1['qty'];
            $ob['rate']=$value1['rate'];
            $ob['amount']=$value1['amount'];
            $ob['total']=$value1['total'];
            fputcsv($fp, $ob);   
          }

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Sub Total';
            $ob['sub_total_amount']=$v['docketDetails']['sub_total_amount'];
            fputcsv($fp, $ob);

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Insurance Charges';
            if($v['docketDetails']['freight_charge']==0.00){

            }else{
              $ob['freight_charge']=$v['docketDetails']['freight_charge'];
              fputcsv($fp, $ob);   
            }

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='P & F Charges';
            if($v['docketDetails']['p_and_f_charge']==0.00){

            }else{
              $ob['p_and_f_charge']=$v['docketDetails']['p_and_f_charge'];
              fputcsv($fp, $ob);   
            }

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Delivery Charges';
            if($v['docketDetails']['delivery_charge']==0.00){

            }else{
              $ob['delivery_charge']=$v['docketDetails']['delivery_charge'];
              fputcsv($fp, $ob);   
            }

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Loading Charges';
            if($v['docketDetails']['loading_charge']==0.00){

            }else{
              $ob['loading_charge']=$v['docketDetails']['loading_charge'];
              fputcsv($fp, $ob);   
            }

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Packing Charges';
            if($v['docketDetails']['packing_charge']==0.00){

            }else{
              $ob['packing_charge']=$v['docketDetails']['packing_charge'];
              fputcsv($fp, $ob);   
            }

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Courier Charges';
            if($v['docketDetails']['courier_charge']==0.00){

            }else{
              $ob['courier_charge']=$v['docketDetails']['courier_charge'];
              fputcsv($fp, $ob);   
            }

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Round off';
            if($v['docketDetails']['round_off_amount']==0.00){

            }else{
              $ob['round_off_amount']=$v['docketDetails']['round_off_amount'];
              fputcsv($fp, $ob);   
            }

            $ob=array();
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='';
            $ob['total']='Bill Charges';
            if($v['docketDetails']['bill_amount']==0.00){

            }else{
              $ob['bill_amount']=$v['docketDetails']['bill_amount'];
              $report_total=$report_total+$v['docketDetails']['bill_amount'];
              fputcsv($fp, $ob);   
            }

        }
      }

            fputcsv($fp, $blankLine);   
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
            fputcsv($fp, $ob);   

            //Grand Total
            fputcsv($fp, $blankLine);   
            fputcsv($fp, $blankLine);   
            $ob=array();//Report Total
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='Grand Total Qty';
            $ob['amount']=$qty_grand_total;
            $ob['total']='Grand Total Item Value';
            $ob['report_total']=$item_value_grand_total;
            fputcsv($fp, $ob); 
  
      exit;
?>