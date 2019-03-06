<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "PO Report.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      /*if($_REQUEST['status']!='all')
      $condition="and status='".$_REQUEST['status']."'"; 
*/   
      $stock_type_condition='';
      if($_REQUEST['stock_type']!=''){
        $stock_type_condition='and stock_type_code in ('.$_REQUEST['stock_type'].')';
      }

     $party_condition0='';
     if($_REQUEST['party_id']!=''){
        $party_condition0='and party_id in('.$_REQUEST['party_id'].')';
      }

     $party_condition='';
     if($_REQUEST['party_id']!=''){
        $party_condition='and a.party_id in('.$_REQUEST['party_id'].')';
      }

     $party_condition1='';
     if($_REQUEST['party_id']!=''){
        $party_condition1='and a1.party_id in('.$_REQUEST['party_id'].')';
      }

         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));

         //details of purchase order
         if($_REQUEST['status']!='all'){
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
                  " .$condition. $party_condition0 . $stock_type_condition ;
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
                  and a.financial_year_id=".$_SESSION['NTC_FINANCIAL_YEAR_ID'].")";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->bindParam(":start_date", $sd);
        $statement->bindParam(":end_date", $ed);
        //$statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        $statement->setFetchMode(PDO::FETCH_ASSOC);
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

           $materialsArray[]=$obj;
         }
         

      $heading1=array('',  '',  '',  'PO Report', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('PO NO', 'PO Date', 'Party Name',  'Item Code',  'Description of Goods', 'Location', 'Unit', 'Quantity','Unit Price','Total','Discount','P&F');
      foreach ($dutyHeader as $key => $value) {
        $header[]=$value['tax_name'];
      }
      foreach ($taxOneHeader as $key => $value) {
        $header[]=$value['tax_name'];
      }
      foreach ($taxTwoHeader as $key => $value) {
        $header[]=$value['tax_name'];
      }
      foreach ($cessHeader as $key => $value) {
        $header[]=$value['tax_name'];
      }
      $header[]='Other Charges';
      $header[]='Amount';
      $blankLine=array();
      //$report_total=0;
      fputcsv($fp, $blankLine);   
      fputcsv($fp, $header);       
      foreach ($materialsArray as $key => $value1) {
        $ob=array();
        $ob['po_no']=$value1['stock_type_code'].'-'.$value1['po_no'];
        $ob['po_date']=$value1['po_date'];
        $ob['party_name']=$value1['party_name'];
        $ob['item_id']=$value1['item_id'];
        $ob['item_name']=$value1['item_name'];
        $ob['location']=$value1['location'];
        $ob['uom_code']=$value1['uom_code'];
        $ob['po_qty']=$value1['po_qty'];
        $ob['unit_value']=$value1['unit_value'];
        $ob['amount']=$value1['amount'];
        $ob['discount_amount']=$value1['discount_amount'].'('.$value1['discount_percentage'].'%)';
        $ob['p_and_f_charges']=$value1['p_and_f_charges'];
        $c=0;
        foreach ($value1['duties'] as $v) {
          $d='d'.$c++;
          $ob[$d]=$v;
        }
        foreach ($value1['taxone'] as $v) {
          $d='t'.$c++;
          $ob[$d]=$v;
        }
        foreach ($value1['taxtwo'] as $v) {
          $d='tt'.$c++;
          $ob[$d]=$v;
        }
        foreach ($value1['cess'] as $v) {
          $d='c'.$c++;
          $ob[$d]=$v;
        }
        $ob['other_charges']=$value1['other_charges'];
        $ob['item_total']=$value1['item_total'];
        fputcsv($fp, $ob);   
      }

        $footer=array('', '', '',  '',  '', '', '', '','','','','');
      foreach ($dutyHeader as $key => $value) {
        $footer[]='';
      }
      foreach ($taxOneHeader as $key => $value) {
        $footer[]='';
      }
      foreach ($taxTwoHeader as $key => $value) {
        $footer[]='';
      }
      foreach ($cessHeader as $key => $value) {
        $footer[]='';
      }
      $footer[]='Total';
      $footer[]=$total;
      fputcsv($fp, $footer);   
  
      exit;
?>