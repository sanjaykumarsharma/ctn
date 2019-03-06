<?php
require_once 'conf.php';
class POReportService{

  public function readPODateWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
         if($d->status!='all'){
            $condition="and status='".$d->status."'";
         }
         /*all pos details date wise*/
         //details of purchase order
         $query = "select po_id, po_no, quotatoin_ref, a.remarks, stock_type_code,
                   date_format(a.po_date, '%d/%m/%Y') as po_date, authorised_signatory,
                   party_name, phone_office, phone_residence, mobile, email,
                   vat, cst, excise, gst, pan, party_name, add_line1, add_line2, city, state, pin,a.party_id
                   from purchase_order a
                   join party_master b on a.party_id=b.party_id
                   where (po_date between :start_date and :end_date) 
                   " .$condition. "
                   and financial_year_id=:financial_year_id
                   order by po_date";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $rows=$statement->fetchAll();
         $details=array();
         foreach ($rows as $key => $value) {
           $obj=array();
           $obj['authorised_signatory']=$value['authorised_signatory'];
           $obj['party_name']=$value['party_name'];
           $obj['party_id']=$value['party_id'];
           $obj['quotatoin_ref']=$value['quotatoin_ref'];
           
           $address='';
           if($value['add_line1']!=''){
            $address=$value['add_line1'];
           }
           if($value['add_line2']!=''){
            if($address==''){
              $address=$value['add_line2'];
            }else{
              $address=$address.", ".$value['add_line2'];
            }
           }
           if($value['city']!=''){
            if($address==''){
              $address=$value['city'];
            }else{
              $address=$address.", ".$value['city'];
            }
           }

           if($value['state']!=''){
            if($address==''){
              $address=$value['state'];
            }else{
              $address=$address.", ".$value['state'];
            }
           }

           if($value['pin']!=''){
            if($address==''){
              $address=$value['pin'];
            }else{
              $address=$address." - ".$value['pin'];
            }
           }

           $obj['add_line1']=$value['add_line1'];
           $obj['add_line2']=$value['add_line2'];
           $obj['city']=$value['city'];
           $obj['state']=$value['state'];
           $obj['pin']=$value['pin'];

           $obj['address']=$address;
           
           $tax_details='';
           if($value['vat']!=''){
            if($tax_details==''){
              $tax_details=$tax_details.'VAT:'.$value['vat'];
            }
           }
           if($value['cst']!=''){
            if($tax_details==''){
              $tax_details=$tax_details.'CST:'.$value['cst'];
            }else{
              $tax_details=$tax_details. " CST:".$value['cst'];
            }
           }
           $tax_details1='';
           if($value['excise']!=''){
            if($tax_details1==''){
              $tax_details1=$tax_details1.'EXCISE:'.$value['excise'];
            }else{
              $tax_details1=$tax_details1. " EXCISE:".$value['excise'];
            }
           }
           if($value['pan']!=''){
            if($tax_details1==''){
              $tax_details1=$tax_details1.'PAN:'.$value['pan'];
            }else{
              $tax_details1=$tax_details1. " EXCISE:".$value['pan'];
            }
           }

           if($value['gst']!=''){
            if($tax_details1==''){
              $tax_details1=$tax_details1.'GSTIN:'.$value['gst'];
            }
           }

           $obj['vat']=$value['vat'];
           $obj['cst']=$value['cst'];
           $obj['pan']=$value['pan'];
           $obj['excise']=$value['excise'];
           $obj['gst']=$value['gst'];
           $obj['tax_details']=$tax_details;
           $obj['tax_details1']=$tax_details1;
           $obj['po_id']=$value['po_id'];
           $obj['po_no']=$value['po_no'];
           $obj['po_date']=$value['po_date'];
           $obj['stock_type_code']=$value['stock_type_code'];
           $obj['remarks']=$value['remarks'];
           $details[]=$obj;
         }

         $prev_date='';
         $poDetailsArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_date==''){//loop run first time
            $obj=array();
            $prev_date=$value['po_date'];
            $obj[]=$value;
           }else if($prev_date==$value['po_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['po_date']){// new date starts
            $poDetailsArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['po_date'];
            $obj[]=$value;
           }
         }
         $poDetailsArray[$prev_date]=$obj;
         
            
        $mainArray=array(); 
        foreach ($poDetailsArray as $datekey => $value) { //PO details array
          $poMain=array();                            //for one date transactions
          foreach ($value as $key1 => $value1) {      //array of all indents of one date
               /*******************************PO Items Details Start************************/
                //duties
                $dutyHeader=array();
                $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                          from tax_master
                          where tax_id in (select distinct duty_id
                          from po_materials
                          where po_id=:po_id)";
                $val=array();
                $statement = $objPDO->prepare($query);
                $statement->setFetchMode(PDO::FETCH_ASSOC);
                $statement->bindParam(':po_id', $value1['po_id']);
                $statement->execute();
                $dutyHeader=$statement->fetchAll();

                //taxes one
                $taxOneHeader=array();
                $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                          from tax_master
                          where tax_id in (select distinct tax_one_id
                          from po_materials
                          where po_id=:po_id)";
                $val=array();
                $statement = $objPDO->prepare($query);
                $statement->setFetchMode(PDO::FETCH_ASSOC);
                $statement->bindParam(':po_id', $value1['po_id']);
                $statement->execute();
                $taxOneHeader=$statement->fetchAll();

                //taxes two
                $taxTwoHeader=array();
                $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                          from tax_master
                          where tax_id in (select distinct tax_two_id
                          from po_materials
                          where po_id=:po_id)";
                $val=array();
                $statement = $objPDO->prepare($query);
                $statement->setFetchMode(PDO::FETCH_ASSOC);
                $statement->bindParam(':po_id', $value1['po_id']);
                $statement->execute();
                $taxTwoHeader=$statement->fetchAll();

                //cess
                $cessHeader=array();
                $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                          from tax_master
                          where tax_id in (select distinct cess_id
                          from po_materials
                          where po_id=:po_id)";
                $val=array();
                $statement = $objPDO->prepare($query);
                $statement->setFetchMode(PDO::FETCH_ASSOC);
                $statement->bindParam(':po_id', $value1['po_id']);
                $statement->execute();
                $cessHeader=$statement->fetchAll();

                //materials 
                $query = "select a.item_id, item_name, uom_code,
                          description, a.po_qty, a.unit_value, 
                          ((a.po_qty * a.unit_value)-discount_amount) as amount,
                          discount_percentage, discount_amount, p_and_f_charges, sub_total,
                          duty_id, duty, amount_after_duty,
                          tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges, item_total
                          from po_materials a
                          join item_master b on b.item_id = a.item_id
                          where po_id=:po_id
                          and a.financial_year_id=:financial_year_id";
                          
                 $val=array();
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $statement->bindParam(':po_id', $value1['po_id']);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement->execute();
                 $val=$statement->fetchAll();
                 $materialsArray=array();
                 $total=0;
                 $other_charges=false;
                 $p_and_f_charges=false;
                 foreach ($val as $key => $value) {
                   $obj=array();
                   $obj['item_id']=$value['item_id'];
                   $obj['item_name']=$value['item_name'];
                   $obj['uom_code']=$value['uom_code'];
                   $obj['description']=$value['description'];
                   $obj['po_qty']=$value['po_qty'];
                   $obj['unit_value']=$value['unit_value'];
                   $obj['discount_amount']=$value['discount_amount'];
                   $obj['amount']=number_format($value['amount'], 2, '.', '');
                   $obj['discount_percentage']=$value['discount_percentage'];
                   $obj['p_and_f_charges']=$value['p_and_f_charges'];
                   $obj['other_charges']=$value['other_charges'];
                   if($value['other_charges']>0){
                      $other_charges=true;
                   }
                   if($value['p_and_f_charges']>0){
                      $p_and_f_charges=true;
                   }
                   $obj['item_total']=$value['item_total'];
                   $total=$total + $value['item_total'];

                   //duties
                   $dutyObj=array();
                   foreach ($dutyHeader as $v) {//loop same as header order
                      if($v['tax_id']==$value['duty_id']){
                        $dutyObj[]=$value['duty'];
                      }else{
                        $dutyObj[]='';
                      }
                   }
                   $obj['duties']=$dutyObj;

                   //tax one
                   $taxOneObj=array();
                   foreach ($taxOneHeader as $v) {//loop same as header order
                      if($v['tax_id']==$value['tax_one_id']){
                        $taxOneObj[]=$value['tax_one'];
                      }else{
                        $taxOneObj[]='';
                      }
                   }
                   $obj['taxone']=$taxOneObj;

                   //tax two
                   $taxTwoObj=array();
                   foreach ($taxTwoHeader as $v) {//loop same as header order
                      if($v['tax_id']==$value['tax_two_id']){
                        $taxTwoObj[]=$value['tax_two'];
                      }else{
                        $taxTwoObj[]='';
                      }
                   }
                   $obj['taxtwo']=$taxTwoObj;

                   //cess
                   $cessObj=array();
                   foreach ($cessHeader as $v) {//loop same as header order
                      if($v['tax_id']==$value['cess_id']){
                        $cessObj[]=$value['cess'];
                      }else{
                        $cessObj[]='';
                      }
                   }
                   $obj['cess']=$cessObj;

                   $materialsArray[]=$obj;
                 }
               /*******************************PO Items Details End************************/
               $ob=array();
               $ob['date']=$datekey;
               $ob['authorised_signatory']=$value1['authorised_signatory'];
               $ob['party_name']=$value1['party_name'];
               $ob['party_id']=$value1['party_id'];
               $ob['quotatoin_ref']=$value1['quotatoin_ref'];
               $ob['add_line1']=$value1['add_line1'];
               $ob['add_line2']=$value1['add_line2'];
               $ob['city']=$value1['city'];
               $ob['state']=$value1['state'];
               $ob['pin']=$value1['pin'];
               $ob['address']=$value1['address'];
               $ob['vat']=$value1['vat'];
               $ob['cst']=$value1['cst'];
               $ob['pan']=$value1['pan'];
               $ob['excise']=$value1['excise'];
               $ob['gst']=$value1['gst'];
               $ob['tax_details']=$value1['tax_details'];
               $ob['tax_details1']=$value1['tax_details1'];
               $ob['po_id']=$value1['po_id'];
               $ob['po_no']=$value1['po_no'];
               $ob['po_date']=$value1['po_date'];
               $ob['stock_type_code']=$value1['stock_type_code'];
               $ob['remarks']=$value1['remarks'];
               $ob['total']=number_format($total,'3');

               if($other_charges==true){
                $ob['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+8;
               }else{
                $ob['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+7;
               }

               if($p_and_f_charges==true){
                $ob['colspan']=$ob['colspan']+1;
               }
               
               $ob['other_charges']=$other_charges;
               $ob['p_and_f_charges']=$p_and_f_charges;


               //indents on purchase order
               $query2 = "select indent_no, stock_type_code,
                          date_format(indent_date, '%d/%m/%Y') as indent_date
                          from indents 
                          where indent_id in
                          (select distinct indent_id
                          from po_materials
                          where po_id=:po_id and financial_year_id=:financial_year_id)";

               $statement2 = $objPDO->prepare($query2);
               $statement2->setFetchMode(PDO::FETCH_ASSOC);
               $statement2->bindParam(':po_id', $value1['po_id']);
               $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement2->execute();
               $indent_ids='';

               foreach ($statement2->fetchAll() as $k => $val) {
                  if($indent_ids==''){
                  $indent_ids=$val['stock_type_code'].'-'.$val['indent_no'].' Dt.:'.$val['indent_date'];
                  }else{
                    $indent_ids= $indent_ids . ',' .  $val['stock_type_code'].'-'.$val['indent_no'].' Dt.:'.$val['indent_date'];
                  }
               }
               $ob['indent_ids']=$indent_ids;
             
               $data1=array();
               $data1['transactions']=$materialsArray;
               $data1['poDetails']=$ob;
               $data1['dutyHeaders'] = $dutyHeader;
               $data1['taxOneHeaders'] = $taxOneHeader;
               $data1['taxTwoHeaders'] = $taxTwoHeader;
               $data1['cessHeaders'] = $cessHeader;

               $poMain[]=$data1;
          }
             $ob=array();
             $ob['date']=$datekey;
             $ob['pos']=$poMain;
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

  public function readPOReport($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
         /*if($d->status!='all'){
            $condition="and status='".$d->status."'";
         }*/

         $stock_type_condition='';
          if($d->stock_type_code!=''){
            $stock_type_condition='and stock_type_code in ('.$d->stock_type_code.')';
          } 
         
         $party_condition0='';
         if($d->party_id!=''){
            $party_condition0='and party_id in('.$d->party_id.')';
          }

         $party_condition='';
         if($d->party_id!=''){
            $party_condition='and a.party_id in('.$d->party_id.')';
          }

          $party_condition1='';
         if($d->party_id!=''){
            $party_condition1='and a1.party_id in('.$d->party_id.')';
          }
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         
         //details of purchase order
         if($d->status!='all'){
            $query = "select distinct po_id
                   from purchase_order 
                   where po_id not in (select DISTINCT po_id from docket)
                   and financial_year_id=:financial_year_id
                   and po_date between :start_date and :end_date
                  " .$condition. $party_condition0 . $stock_type_condition ;
         }else{
             $query = "select distinct po_id
                   from purchase_order 
                   where financial_year_id=:financial_year_id
                   and po_date between :start_date and :end_date
                  " .$condition. $party_condition0 . $stock_type_condition;
         }
                  
        $pidsArray=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(":start_date", $sd);
        $statement->bindParam(":end_date", $ed);
        $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        $statement->execute();
        $pidsArray=$statement->fetchAll();
        
        $pids=0; 
        foreach ($pidsArray as $key => $value) {
          if($pids==0){
            $pids=$value['po_id'];
          }else{
            $pids=$pids.','.$value['po_id'];
          }
        }

        //duties
        $dutyHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct duty_id
                  from purchase_order a
                  join po_materials b on a.po_id=b.po_id
                  where (po_date between :start_date and :end_date)
                  and a.po_id in(".$pids.")
                  " .$condition. $party_condition. "
                  and a.financial_year_id=:financial_year_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(":start_date", $sd);
        $statement->bindParam(":end_date", $ed);
        $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        $statement->execute();
        $dutyHeader=$statement->fetchAll();

        //taxes one
        $taxOneHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct tax_one_id
                  from purchase_order a
                  join po_materials b on a.po_id=b.po_id
                  where (po_date between :start_date and :end_date)
                  and a.po_id in(".$pids.")
                  " .$condition. $party_condition. "
                  and a.financial_year_id=:financial_year_id
                  )";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(":start_date", $sd);
        $statement->bindParam(":end_date", $ed);
        $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        $statement->execute();
        $taxOneHeader=$statement->fetchAll();

        //taxes two
        $taxTwoHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct tax_two_id
                  from purchase_order a
                  join po_materials b on a.po_id=b.po_id
                  where (po_date between :start_date and :end_date)
                  and a.po_id in(".$pids.")
                  " .$condition. $party_condition. "
                  and a.financial_year_id=:financial_year_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(":start_date", $sd);
        $statement->bindParam(":end_date", $ed);
        $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        $statement->execute();
        $taxTwoHeader=$statement->fetchAll();

        //cess
        $cessHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct cess_id
                  from purchase_order a
                  join po_materials b on a.po_id=b.po_id
                  where (po_date between :start_date and :end_date)
                  and a.po_id in(".$pids.")
                  " .$condition. $party_condition. "
                  and a.financial_year_id=:financial_year_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(":start_date", $sd);
        $statement->bindParam(":end_date", $ed);
        $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        $statement->execute();
        $cessHeader=$statement->fetchAll();

        //materials 
        $query = "select a.item_id, item_name, uom_code, location,
                  description, a.po_qty, a.unit_value, 
                  ((a.po_qty * a.unit_value)-discount_amount) as amount,
                  discount_percentage, discount_amount, p_and_f_charges, sub_total,
                  duty_id, duty, amount_after_duty,
                  tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges, item_total,
                  po_no, a1.stock_type_code,
                  date_format(a1.po_date, '%d/%m/%Y') as po_date, party_name
                  from purchase_order a1
                  join party_master b1 on a1.party_id=b1.party_id
                  join po_materials a on a.po_id=a1.po_id
                  join item_master b on b.item_id = a.item_id
                  where (po_date between :start_date and :end_date)
                  and a.po_id in(".$pids.")
                  " .$condition. $party_condition1. "
                  and a.financial_year_id=:financial_year_id";
                  
         $val=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->execute();
         $val=$statement->fetchAll();
         $materialsArray=array();
         $total=0;
         $total_po_qty=0;
         $other_charges=false;
         $p_and_f_charges=false;
         foreach ($val as $key => $value) {
           $obj=array();
           $obj['item_id']=$value['item_id'];
           $obj['party_name']=$value['party_name'];
           $obj['po_no']=$value['po_no'];
           $obj['stock_type_code']=$value['stock_type_code'];
           $obj['po_date']=$value['po_date'];
           $obj['item_name']=$value['item_name'];
           $obj['uom_code']=$value['uom_code'];
           $obj['location']=$value['location'];
           $obj['description']=$value['description'];
           $obj['po_qty']=$value['po_qty'];
           $obj['unit_value']=$value['unit_value'];
           $obj['discount_amount']=$value['discount_amount'];
           $obj['amount']=number_format($value['amount'], 2, '.', '');
           $obj['discount_percentage']=$value['discount_percentage'];
           $obj['p_and_f_charges']=$value['p_and_f_charges'];
           $obj['other_charges']=$value['other_charges'];
           if($value['other_charges']>0){
              $other_charges=true;
           }
           if($value['p_and_f_charges']>0){
              $p_and_f_charges=true;
           }
           $obj['item_total']=$value['item_total'];
           $total=$total + $value['item_total'];

           //duties
           $dutyObj=array();
           foreach ($dutyHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['duty_id']){
                $dutyObj[]=$value['duty'];
              }else{
                $dutyObj[]='';
              }
           }
           $obj['duties']=$dutyObj;

           //tax one
           $taxOneObj=array();
           foreach ($taxOneHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['tax_one_id']){
                $taxOneObj[]=$value['tax_one'];
              }else{
                $taxOneObj[]='';
              }
           }
           $obj['taxone']=$taxOneObj;

           //tax two
           $taxTwoObj=array();
           foreach ($taxTwoHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['tax_two_id']){
                $taxTwoObj[]=$value['tax_two'];
              }else{
                $taxTwoObj[]='';
              }
           }
           $obj['taxtwo']=$taxTwoObj;

           //cess
           $cessObj=array();
           foreach ($cessHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['cess_id']){
                $cessObj[]=$value['cess'];
              }else{
                $cessObj[]='';
              }
           }
           $obj['cess']=$cessObj;

           $total_po_qty=$total_po_qty+$value['po_qty'];

           $materialsArray[]=$obj;
         }
               
         $ob=array();
         $ob['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+9;
         $ob['other_charges']=$other_charges;
         $ob['p_and_f_charges']=$p_and_f_charges;
       
         $data=array();
         $data['transactions']=$materialsArray;
         $data['poDetails']=$ob;
         $data['dutyHeaders'] = $dutyHeader;
         $data['taxOneHeaders'] = $taxOneHeader;
         $data['taxTwoHeaders'] = $taxTwoHeader;
         $data['cessHeaders'] = $cessHeader;
         $data['grand_total'] = $total;
         $data['grand_total_po_qty'] = $total_po_qty;
         $data['status'] = "s";
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   } 

  public function readPOPartyWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
         if($d->party_id!=''){
           $condition='and a.party_id in ('.$d->party_id.')';
         } 
         /*all pos details date wise*/
         //details of purchase order
         $query = "select po_id, po_no, quotatoin_ref, a.remarks, stock_type_code,
                   date_format(a.po_date, '%d/%m/%Y') as po_date, authorised_signatory,
                   party_name, phone_office, phone_residence, mobile, email,
                   vat, cst, excise, gst, pan, add_line1, add_line2, city, state, pin,a.party_id
                   from purchase_order a
                   join party_master b on a.party_id=b.party_id
                   where (po_date between :start_date and :end_date) 
                   " .$condition. "
                   and financial_year_id=:financial_year_id
                   order by po_id desc, po_date desc";
                   
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $rows=$statement->fetchAll();
         $details=array();
         foreach ($rows as $key => $value) {
           $obj=array();
           $obj['authorised_signatory']=$value['authorised_signatory'];
           $obj['party_name']=$value['party_name'];
           $obj['party_id']=$value['party_id'];
           $obj['quotatoin_ref']=$value['quotatoin_ref'];
           
           $address='';
           if($value['add_line1']!=''){
            $address=$value['add_line1'];
           }
           if($value['add_line2']!=''){
            if($address==''){
              $address=$value['add_line2'];
            }else{
              $address=$address.", ".$value['add_line2'];
            }
           }
           if($value['city']!=''){
            if($address==''){
              $address=$value['city'];
            }else{
              $address=$address.", ".$value['city'];
            }
           }

           if($value['state']!=''){
            if($address==''){
              $address=$value['state'];
            }else{
              $address=$address.", ".$value['state'];
            }
           }

           if($value['pin']!=''){
            if($address==''){
              $address=$value['pin'];
            }else{
              $address=$address." - ".$value['pin'];
            }
           }

           $obj['add_line1']=$value['add_line1'];
           $obj['add_line2']=$value['add_line2'];
           $obj['city']=$value['city'];
           $obj['state']=$value['state'];
           $obj['pin']=$value['pin'];

           $obj['address']=$address;
           
           $tax_details='';
           if($value['vat']!=''){
            if($tax_details==''){
              $tax_details=$tax_details.'VAT:'.$value['vat'];
            }
           }
           if($value['cst']!=''){
            if($tax_details==''){
              $tax_details=$tax_details.'CST:'.$value['cst'];
            }else{
              $tax_details=$tax_details. " CST:".$value['cst'];
            }
           }
           $tax_details1='';
           if($value['excise']!=''){
            if($tax_details1==''){
              $tax_details1=$tax_details1.'EXCISE:'.$value['excise'];
            }else{
              $tax_details1=$tax_details1. " EXCISE:".$value['excise'];
            }
           }
           if($value['pan']!=''){
            if($tax_details1==''){
              $tax_details1=$tax_details1.'PAN:'.$value['pan'];
            }else{
              $tax_details1=$tax_details1. " EXCISE:".$value['pan'];
            }
           }

           if($value['gst']!=''){
            if($tax_details1==''){
              $tax_details1=$tax_details1.'GSTIN:'.$value['gst'];
            }
           }

           $obj['vat']=$value['vat'];
           $obj['cst']=$value['cst'];
           $obj['pan']=$value['pan'];
           $obj['excise']=$value['excise'];
           $obj['gst']=$value['gst'];
           $obj['tax_details']=$tax_details;
           $obj['tax_details1']=$tax_details1;
           $obj['po_id']=$value['po_id'];
           $obj['po_no']=$value['po_no'];
           $obj['po_date']=$value['po_date'];
           $obj['stock_type_code']=$value['stock_type_code'];
           $obj['remarks']=$value['remarks'];
           $details[]=$obj;
         }

         $prev_date='';
         $poDetailsArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_date==''){//loop run first time
            $obj=array();
            $prev_date=$value['party_name'];
            $obj[]=$value;
           }else if($prev_date==$value['party_name']){//same party
            $obj[]=$value;
           }else if($prev_date!=$value['party_name']){// new date starts
            $poDetailsArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['party_name'];
            $obj[]=$value;
           }
         }
         $poDetailsArray[$prev_date]=$obj;
         
            
        $mainArray=array(); 
        foreach ($poDetailsArray as $datekey => $value) { //PO details array
          $poMain=array();                            //for one date transactions
          foreach ($value as $key1 => $value1) {      //array of all indents of one date
               /*******************************PO Items Details Start************************/
                //duties
                $dutyHeader=array();
                $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                          from tax_master
                          where tax_id in (select distinct duty_id
                          from po_materials
                          where po_id=:po_id)";
                $val=array();
                $statement = $objPDO->prepare($query);
                $statement->setFetchMode(PDO::FETCH_ASSOC);
                $statement->bindParam(':po_id', $value1['po_id']);
                $statement->execute();
                $dutyHeader=$statement->fetchAll();

                //taxes one
                $taxOneHeader=array();
                $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                          from tax_master
                          where tax_id in (select distinct tax_one_id
                          from po_materials
                          where po_id=:po_id)";
                $val=array();
                $statement = $objPDO->prepare($query);
                $statement->setFetchMode(PDO::FETCH_ASSOC);
                $statement->bindParam(':po_id', $value1['po_id']);
                $statement->execute();
                $taxOneHeader=$statement->fetchAll();

                //taxes two
                $taxTwoHeader=array();
                $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                          from tax_master
                          where tax_id in (select distinct tax_two_id
                          from po_materials
                          where po_id=:po_id)";
                $val=array();
                $statement = $objPDO->prepare($query);
                $statement->setFetchMode(PDO::FETCH_ASSOC);
                $statement->bindParam(':po_id', $value1['po_id']);
                $statement->execute();
                $taxTwoHeader=$statement->fetchAll();

                //cess
                $cessHeader=array();
                $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                          from tax_master
                          where tax_id in (select distinct cess_id
                          from po_materials
                          where po_id=:po_id)";
                $val=array();
                $statement = $objPDO->prepare($query);
                $statement->setFetchMode(PDO::FETCH_ASSOC);
                $statement->bindParam(':po_id', $value1['po_id']);
                $statement->execute();
                $cessHeader=$statement->fetchAll();

                //materials 
                $query = "select a.item_id, item_name, uom_code,
                          description, a.po_qty, a.unit_value, 
                          ((a.po_qty * a.unit_value)-discount_amount) as amount,
                          discount_percentage, discount_amount, p_and_f_charges, sub_total,
                          duty_id, duty, amount_after_duty,
                          tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges, item_total
                          from po_materials a
                          join item_master b on b.item_id = a.item_id
                          where po_id=:po_id
                          and a.financial_year_id=:financial_year_id";
                          
                 $val=array();
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $statement->bindParam(':po_id', $value1['po_id']);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement->execute();
                 $val=$statement->fetchAll();
                 $materialsArray=array();
                 $total=0;
                 $other_charges=false;
                 $p_and_f_charges=false;
                 foreach ($val as $key => $value) {
                   $obj=array();
                   $obj['item_id']=$value['item_id'];
                   $obj['item_name']=$value['item_name'];
                   $obj['uom_code']=$value['uom_code'];
                   $obj['description']=$value['description'];
                   $obj['po_qty']=$value['po_qty'];
                   $obj['unit_value']=$value['unit_value'];
                   $obj['discount_amount']=$value['discount_amount'];
                   $obj['amount']=number_format($value['amount'], 2, '.', '');
                   $obj['discount_percentage']=$value['discount_percentage'];
                   $obj['p_and_f_charges']=$value['p_and_f_charges'];
                   $obj['other_charges']=$value['other_charges'];
                   if($value['other_charges']>0){
                      $other_charges=true;
                   }
                   if($value['p_and_f_charges']>0){
                      $p_and_f_charges=true;
                   }
                   $obj['item_total']=$value['item_total'];
                   $total=$total + $value['item_total'];

                   //duties
                   $dutyObj=array();
                   foreach ($dutyHeader as $v) {//loop same as header order
                      if($v['tax_id']==$value['duty_id']){
                        $dutyObj[]=$value['duty'];
                      }else{
                        $dutyObj[]='';
                      }
                   }
                   $obj['duties']=$dutyObj;

                   //tax one
                   $taxOneObj=array();
                   foreach ($taxOneHeader as $v) {//loop same as header order
                      if($v['tax_id']==$value['tax_one_id']){
                        $taxOneObj[]=$value['tax_one'];
                      }else{
                        $taxOneObj[]='';
                      }
                   }
                   $obj['taxone']=$taxOneObj;

                   //tax two
                   $taxTwoObj=array();
                   foreach ($taxTwoHeader as $v) {//loop same as header order
                      if($v['tax_id']==$value['tax_two_id']){
                        $taxTwoObj[]=$value['tax_two'];
                      }else{
                        $taxTwoObj[]='';
                      }
                   }
                   $obj['taxtwo']=$taxTwoObj;

                   //cess
                   $cessObj=array();
                   foreach ($cessHeader as $v) {//loop same as header order
                      if($v['tax_id']==$value['cess_id']){
                        $cessObj[]=$value['cess'];
                      }else{
                        $cessObj[]='';
                      }
                   }
                   $obj['cess']=$cessObj;

                   $materialsArray[]=$obj;
                 }
               /*******************************PO Items Details End************************/
               $ob=array();
               $ob['date']=$datekey;
               $ob['authorised_signatory']=$value1['authorised_signatory'];
               $ob['party_name']=$value1['party_name'];
               $ob['party_id']=$value1['party_id'];
               $ob['quotatoin_ref']=$value1['quotatoin_ref'];
               $ob['add_line1']=$value1['add_line1'];
               $ob['add_line2']=$value1['add_line2'];
               $ob['city']=$value1['city'];
               $ob['state']=$value1['state'];
               $ob['pin']=$value1['pin'];
               $ob['address']=$value1['address'];
               $ob['vat']=$value1['vat'];
               $ob['cst']=$value1['cst'];
               $ob['pan']=$value1['pan'];
               $ob['excise']=$value1['excise'];
               $ob['gst']=$value1['gst'];
               $ob['tax_details']=$value1['tax_details'];
               $ob['tax_details1']=$value1['tax_details1'];
               $ob['po_id']=$value1['po_id'];
               $ob['po_no']=$value1['po_no'];
               $ob['po_date']=$value1['po_date'];
               $ob['stock_type_code']=$value1['stock_type_code'];
               $ob['remarks']=$value1['remarks'];
               $ob['total']=number_format($total,'3');

               if($other_charges==true){
                $ob['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+8;
               }else{
                $ob['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+7;
               }

               if($p_and_f_charges==true){
                $ob['colspan']=$ob['colspan']+1;
               }
               
               $ob['other_charges']=$other_charges;
               $ob['p_and_f_charges']=$p_and_f_charges;


               //indents on purchase order
               $query2 = "select indent_no, stock_type_code,
                          date_format(indent_date, '%d/%m/%Y') as indent_date
                          from indents 
                          where indent_id in
                          (select distinct indent_id
                          from po_materials
                          where po_id=:po_id and financial_year_id=:financial_year_id)";

               $statement2 = $objPDO->prepare($query2);
               $statement2->setFetchMode(PDO::FETCH_ASSOC);
               $statement2->bindParam(':po_id', $value1['po_id']);
               $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement2->execute();
               $indent_ids='';

               foreach ($statement2->fetchAll() as $k => $val) {
                  if($indent_ids==''){
                  $indent_ids=$val['stock_type_code'].'-'.$val['indent_no'].' Dt.:'.$val['indent_date'];
                  }else{
                    $indent_ids= $indent_ids . ',' .  $val['stock_type_code'].'-'.$val['indent_no'].' Dt.:'.$val['indent_date'];
                  }
               }
               $ob['indent_ids']=$indent_ids;
             
               $data1=array();
               $data1['transactions']=$materialsArray;
               $data1['poDetails']=$ob;
               $data1['dutyHeaders'] = $dutyHeader;
               $data1['taxOneHeaders'] = $taxOneHeader;
               $data1['taxTwoHeaders'] = $taxTwoHeader;
               $data1['cessHeaders'] = $cessHeader;

               $poMain[]=$data1;
          }
             $ob=array();
             $ob['date']=$datekey;
             $ob['pos']=$poMain;
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


    public function readPOItemWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         if($d->status!='all'){
            $condition="and status='".$d->status."'";
         }

          $query = "select a.indent_id,indent_material_map_id, b.item_id, item_name, uom_code, a.qty, unit_value, 
                    total_value, a.remarks,
                    a1.stock_type_code, indent_no, status,
                   date_format(indent_date, '%d/%m/%Y') as indent_date, department, d.qty as stock,
                   (CASE 
                        WHEN indent_type = 'N' THEN 'Normal'
                        WHEN indent_type = 'U' THEN 'Urgent'
                        WHEN indent_type = 'VU' THEN 'Very Urgent'
                        ELSE 1
                    END) AS indent_type
                    from indents a1 
                    join indent_material_map a on a1.indent_id=a.indent_id
                    join item_master b on a.material_id=b.item_id
                    join department_master c on a1.department_code=c.department_code
                    left join stock_in_hand d on (a.material_id=d.item_id and a.financial_year_id=d.financial_year_id)
                    where (indent_date between :start_date and :end_date)
                    and a.financial_year_id=:financial_year_id
                    " .$condition. "
                    order by b.item_id asc, a1.indent_id asc";        
                      
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         $prev_item='';
         $prev_item_name='';
         $issueArray=array();
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
            $issueArray[$prev_item_name]=$obj;
            $obj=array();
            $prev_item=$value['item_id'];
            $prev_item_name=$value['item_name']. '(Code:'.$value['item_id'].')';
            $obj[]=$value;
           }
         }
         $issueArray[$prev_item_name]=$obj;
                   
         
         $mainArray=array(); 
         foreach ($issueArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['item']=$key;
            $ob['issues']=$value;
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

  public function readPOSuppliedMaterial($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $party_condition='';
         if($d->party_id!=''){
            $party_condition='and party_id in('.$d->party_id.')';
          }

         $stock_type_condition='';
          if($d->stock_type_code!=''){
            $stock_type_condition='and stock_type_code in ('.$d->stock_type_code.')';
          } 

        $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
        $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));  

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



}
?>
