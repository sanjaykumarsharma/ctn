<?php
require_once 'conf.php';
class DocketReportService{

  public function readDocketRegisterDateWise($d) {
      try{
         /*print_r($d->start_date);
         return;*/
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         $condition='and stock_type_code in ('.$d->stock_type_code.')';


         $query = "select docket_id, stock_type_code, docket_no, po_id as po_ids, 
                   date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                   date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no, 
                   date_format(challan_date, '%d/%m/%Y') as challan_date, 
                   transporter_name, transpotation_mode, vehicle_no, lr_no,
                   sub_total_amount, freight_charge,
                   p_and_f_charge, delivery_charge, loading_charge, packing_charge, courier_charge, 
                   round_off_amount, bill_amount, remarks, party_name, gst
                   from docket a
                   join party_master b on a.party_id=b.party_id
                   where (docket_date between :start_date and :end_date) 
                   " .$condition. " 
                   and financial_year_id=:financial_year_id
                   order by a.docket_date asc, docket_id asc";
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetchAll();

         // $details=array();
         // foreach ($details_temp as $key => $val) {
         //  $tempRow = array();
         //           , delivery_charge, loading_charge, packing_charge, courier_charge, 
         //           round_off_amount, bill_amount, remarks, party_name, gst
         //  $tempRow['docket_id'] = $val['docket_id']; 
         //  $tempRow['stock_type_code'] = $val['stock_type_code']; 
         //  $tempRow['docket_no'] = $val['docket_no']; 
         //  $tempRow['po_ids'] = $val['po_ids']; 
         //  $tempRow['docket_date'] = $val['docket_date']; 
         //  $tempRow['bill_no'] = $val['bill_no']; 
         //  $tempRow['bill_date'] = $val['bill_date']; 
         //  $tempRow['challan_no'] = $val['challan_no']; 
         //  $tempRow['challan_date'] = $val['challan_date']; 
         //  $tempRow['transporter_name'] = utf8_encode($val['transporter_name']);
         //  $tempRow['transpotation_mode'] = utf8_encode($val['transpotation_mode']);
         //  $tempRow['vehicle_no'] = utf8_encode($val['vehicle_no']);
         //  $tempRow['party_name'] = utf8_encode($val['party_name']);
         //  $tempRow['lr_no'] = $val['lr_no'];
         //  $tempRow['sub_total_amount'] = $val['sub_total_amount'];
         //  $tempRow['freight_charge'] = $val['freight_charge'];
         //  $tempRow['p_and_f_charge'] = $val['p_and_f_charge'];
         //  $tempRow['loading_charge'] = $val['loading_charge'];
         //  $tempRow['packing_charge'] = $val['packing_charge'];
         //  $tempRow['courier_charge'] = $val['courier_charge'];
         //  $tempRow['round_off_amount'] = $val['round_off_amount'];
         //  $tempRow['bill_amount'] = $val['bill_amount'];
         //  $tempRow['remarks'] = $val['remarks'];
         //  $tempRow['gst'] = $val['gst'];
         //  $details[] = $tempRow;
         // } 
         
         $prev_date='';
         $docketArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_date==''){//loop run first time
            $obj=array();
            $prev_date=$value['docket_date'];
            $obj[]=$value;
           }else if($prev_date==$value['docket_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['docket_date']){// new date starts
            $docketArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['docket_date'];
            $obj[]=$value;
           }
         }
         $docketArray[$prev_date]=$obj;

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
                    " .$condition. " 
                    and transaction_type='R'
                    and financial_year_id=:financial_year_id
                    order by a.transaction_date asc, docket_id asc";

           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();
           
           $qty_grand_total=0; 
           $item_value_grand_total=0; 
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
                   $obj['party_name']=utf8_encode($value1['party_name']);
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

          foreach ($mainArray as $k => $v) {
             foreach ($v['dockets'] as $k1 => $v1) {
             $qty_total = 0;
             $amount_total = 0;
               foreach ($v1['transactions'] as $k2 => $v2) {
                 $qty_total = $qty_total + ((float)(str_replace(',', '', $v2['qty'])));
                 $amount_total = $amount_total + ((float)(str_replace(',', '', $v2['amount'])));
               } 
               $oj=array(); //item wise total
               $oj['uom_code']='Total';
               $oj['qty']=$qty_total;
               $oj['amount']=$amount_total;
               if($qty_total>0){
                 $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
               }else{
                 $oj['rate']=0;
               }
               $mainArray[$k]['dockets'][$k1]['transactions'][]=$oj;
             }        
        }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
         $data['qty_grand_total']=$qty_grand_total;
         $data['item_value_grand_total']=$item_value_grand_total;
        
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

 public function readDocketReport($d) {
      try{
         /*print_r($d->start_date);
         return;*/
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         $condition='and stock_type_code in ('.$d->stock_type_code.')';


         $query = "select docket_id, stock_type_code, docket_no, po_id as po_ids, 
                   date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                   date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no, 
                   date_format(challan_date, '%d/%m/%Y') as challan_date, 
                   transporter_name, transpotation_mode, vehicle_no, lr_no,
                   sub_total_amount, freight_charge,
                   p_and_f_charge, delivery_charge, loading_charge, packing_charge, courier_charge, 
                   round_off_amount, bill_amount, remarks, party_name, gst
                   from docket a
                   join party_master b on a.party_id=b.party_id
                   where (docket_date between :start_date and :end_date) 
                   " .$condition. " 
                   and financial_year_id=:financial_year_id
                   order by a.docket_date asc, docket_id asc";
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetchAll();
         
         $prev_date='';
         $docketArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_date==''){//loop run first time
            $obj=array();
            $prev_date=$value['docket_date'];
            $obj[]=$value;
           }else if($prev_date==$value['docket_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['docket_date']){// new date starts
            $docketArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['docket_date'];
            $obj[]=$value;
           }
         }
         $docketArray[$prev_date]=$obj;

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
                    " .$condition. " 
                    and transaction_type='R'
                    and financial_year_id=:financial_year_id
                    order by a.transaction_date asc, docket_id asc";

           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();
            
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
              }
                 $ob=array();
                 $ob['date']=$key;
                 $ob['dockets']=$docketMain;
            $mainArray[]=$ob;
           }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
        
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }   


   public function readDocketRegisterPartyWise($d) {
      try{
         /*print_r($d->start_date);
         return;*/
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         if(isset($d->party_id)){
           if($d->party_id!=''){
              $condition='and a.party_id in('.$d->party_id.')';
           }
         } 

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
                   //echo $query;
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         /*if(isset($d->party_id) && $d->party_id!=''){
            $statement->bindParam(":party_id", $d->party_id);
         }*/
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetchAll();
         
         $prev_party='';
         $docketArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_party==''){//loop run first time
            $obj=array();
            $prev_party=utf8_encode($value['party_name']);
            $obj[]=$value;
           }else if($prev_party==utf8_encode($value['party_name'])){//same date
            $obj[]=$value;
           }else if($prev_party!=utf8_encode($value['party_name'])){// new date starts
            $docketArray[$prev_party]=$obj;
            $obj=array();
            $prev_party=utf8_encode($value['party_name']);
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
           /*if(isset($d->party_id)){
            $statement->bindParam(":party_id", $d->party_id);
           }*/
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

           foreach ($mainArray as $k => $v) {
             foreach ($v['dockets'] as $k1 => $v1) {
             $qty_total = 0;
             $amount_total = 0;
               foreach ($v1['transactions'] as $k2 => $v2) {
                 $qty_total = $qty_total + ((float)(str_replace(',', '', $v2['qty'])));
                 $amount_total = $amount_total + ((float)(str_replace(',', '', $v2['amount'])));
               } 
               $oj=array(); //item wise total
               $oj['uom_code']='Total';
               $oj['qty']=$qty_total;
               $oj['amount']=$amount_total;
               if($qty_total>0){
                 $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
               }else{
                 $oj['rate']=0;
               }
               $mainArray[$k]['dockets'][$k1]['transactions'][]=$oj;
             }        
        }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
         $data['qty_grand_total']=$qty_grand_total;
         $data['item_value_grand_total']=$item_value_grand_total;
        
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

  public function readDocketRegisterItemWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
          if($d->stock_type_code!=''){
              $condition='and c.stock_type_code in ('.$d->stock_type_code.')';
           }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and a.item_id in ('.$d->selected_item_id.')';
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
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
           $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions_temp=$statement->fetchAll();

           $transactions=array();
         foreach ($transactions_temp as $key => $val) {
          $tempRow = array();
          $tempRow['transaction_id'] = $val['transaction_id']; 
          $tempRow['item_id'] = $val['item_id']; 
          $tempRow['item_name'] = utf8_encode($val['item_name']);
          $tempRow['uom_code'] = utf8_encode($val['uom_code']);
          $tempRow['location'] = utf8_encode($val['location']);
          $tempRow['po_qty'] = $val['po_qty'];
          $tempRow['qty'] = $val['qty'];
          $tempRow['rate'] = $val['rate'];
          $tempRow['amount'] = $val['amount'];
          $tempRow['party_name'] = $val['party_name'];
          
          $tempRow['discount_percentage'] = $val['discount_percentage'];
          $tempRow['discount_amount'] = $val['discount_amount'];
          $tempRow['p_and_f_charge'] = $val['p_and_f_charge'];
          $tempRow['amount_after_duty'] = $val['amount_after_duty'];
          $tempRow['total'] = $val['total'];
          $tempRow['remarks'] = $val['remarks'];
          $tempRow['total'] = $val['total'];
          $tempRow['transaction_date'] = $val['transaction_date'];
          $tempRow['stock_type_code'] = $val['stock_type_code'];
          $tempRow['docket_no'] = $val['docket_no'];
          $tempRow['total'] = $val['total'];
          $tempRow['gst'] = $val['gst'];
          $tempRow['docket_date'] = $val['docket_date'];
          $tempRow['bill_no'] = $val['bill_no'];
          $tempRow['bill_date'] = $val['bill_date'];
          $transactions[] = $tempRow;
         } 
         
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
            $prev_item_name=utf8_encode($value['item_name']). '(Code:'.$value['item_id'].')';
            $obj[]=$value;
           }else if($prev_item==$value['item_id']){//same date
            $obj[]=$value;
           }else if($prev_item!=$value['item_id']){// new date starts
            $docketArray[$prev_item_name]=$obj;
            $obj=array();
            $prev_item=$value['item_id'];
            $prev_item_name=utf8_encode($value['item_name']). '(Code:'.$value['item_id'].')';
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
            // $ob['dockets']=$value;

            $qty_total = 0;
            $amount_total = 0;
            foreach ($value as $k2 => $v2) {
             $qty_total = $qty_total + ((float)(str_replace(',', '', $v2['qty'])));
             $amount_total = $amount_total + ((float)(str_replace(',', '', $v2['amount'])));
            } 
            $oj=array(); //item wise total
            $oj['uom_code']='Total';
            $oj['qty']=$qty_total;
            $oj['amount']=$amount_total;
            if($qty_total>0){
               $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
            }else{
               $oj['rate']=0;
            }
            $value[]=$oj;
            $ob['dockets']=$value;
             
            $mainArray[]=$ob;
         }

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$mainArray;
         $data['qty_grand_total']=$qty_grand_total;
         $data['item_value_grand_total']=$item_value_grand_total;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


}
?>
