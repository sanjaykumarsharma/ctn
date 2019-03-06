<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Docket Register Item Wise.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!=''){
          $condition='and c.stock_type_code in ('.$_REQUEST['stock_type_code'].')';
       }

     $item_condition='';
      if($_REQUEST['selected_item_id']!=''){
          $item_condition='and a.item_id in ('.$_REQUEST['selected_item_id'].')';
       } 

         $query = "select transaction_id, a.item_id, item_name, uom_code, a.location, po_qty, 
                    qty, rate, format((qty * rate),2) as amount,
                    discount_percentage, discount_amount, a.p_and_f_charge,
                    amount_after_duty,
                    total, a.remarks,
                    date_format(transaction_date, '%d/%m/%Y') as transaction_date,
                    c.stock_type_code, docket_no, party_name,gst,
                    date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no,
                    date_format(bill_date, '%d/%m/%Y') as bill_date
                    from transaction a 
                    join item_master b on a.item_id=b.item_id
                    join docket c on a.docket_id=c.docket_id
                    join party_master d on c.party_id=d.party_id
                    where (transaction_date between :start_date and :end_date)
                    and total>0
                    " .$condition. $item_condition. " 
                    and transaction_type='R'
                    and a.financial_year_id=:financial_year_id
                    order by a.item_id asc, a.transaction_date asc";


         $transactions=array();          
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         
         $prev_item='';
         $prev_item_name='';
         $qty_grand_total = 0;
         $item_value_grand_total = 0;
         $docketArray=array();
         $obj=array();
         foreach ($transactions as $key => $value) {
           if($prev_item==''){//loop run first time
            $obj=array();
            $prev_item=$value['item_id'];
            $prev_item_name=$value['item_name']. '(Code:'.$value['item_id'].')';
            $obj[]=$value;
           }else if($prev_item==$value['item_id']){//same date
            $obj[]=$value;
           }else if($prev_item!=$value['item_id']){// new date starts
            $docketArray[$prev_item_name]=$obj;
            $obj=array();
            $prev_item=$value['item_id'];
            $prev_item_name=$value['item_name']. '(Code:'.$value['item_id'].')';
            $obj[]=$value;
           }

           $qty_grand_total = $qty_grand_total + $value['qty'];
           $item_value_grand_total = $item_value_grand_total + $value['total'];
         }
         $docketArray[$prev_item_name]=$obj;

         $mainArray=array(); 
         foreach ($docketArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['item']=$key;
            $ob['dockets']=$value;
            $mainArray[]=$ob;
         }

      $heading1=array('',  '',  '',  'Docket Register (Item Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number',  'Docket Dt',  'Docket No',  'Party Name', 'GST No', 'Bill No', 'Bill Date', 'Location','Unit', 'Qty', 'Rate', 'Amount', 'Item Value');
      $blankLine=array();
      $report_total=0;
      foreach ($mainArray as $key => $value) {
        fputcsv($fp, $blankLine);   
        fputcsv($fp, $blankLine);   

        $obj=array();
        $obj['item_name']=$value['item'];
        fputcsv($fp, $obj);          

        fputcsv($fp, $blankLine);     
        fputcsv($fp, $header);     
        $count=0;
        foreach ($value['dockets'] as $k => $value1) {
          $ob=array();
          $ob['sl']=$count+1;
          $ob['docket_date']=$value1['docket_date'];
          $ob['docket_no']=$value1['stock_type_code'].'-'.$value1['docket_no'];
          $ob['party_name']=$value1['party_name'];
          $ob['gst']=$value1['gst'];
          $ob['bill_no']=$value1['bill_no'];
          $ob['bill_date']=$value1['bill_date'];
          $ob['location']=$value1['location'];
          $ob['uom_code']=$value1['uom_code'];
          $ob['qty']=$value1['qty'];
          $ob['rate']=$value1['rate'];
          $ob['amount']=$value1['amount'];
          $ob['total']=$value1['total'];
          $report_total=$report_total+$value1['total'];
          fputcsv($fp, $ob);   
          
        }
      }
            fputcsv($fp, $blankLine);   
            fputcsv($fp, $blankLine);   
            $ob=array();//Report Total
            $ob['sl']='';
            $ob['docket_date']='';
            $ob['docket_no']='';
            $ob['party_name']='';
            $ob['gst']='';
            $ob['bill_no']='';
            $ob['bill_date']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['rate']='';
            $ob['amount']='Grand Total';
            $ob['report_total']=$report_total;
            fputcsv($fp, $ob);   

            //Grand Total
            fputcsv($fp, $blankLine);   
            fputcsv($fp, $blankLine);   
            $ob=array();//Report Total
            $ob['sl']='';
            $ob['docket_date']='';
            $ob['docket_no']='';
            $ob['party_name']='';
            $ob['gst']='';
            $ob['bill_no']='';
            $ob['bill_date']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='Grand Total';
            $ob['rate']=$qty_grand_total;
            $ob['amount']='Grand Total Item Value';
            $ob['report_total']=$item_value_grand_total;
            fputcsv($fp, $ob);
  
      exit;
?>