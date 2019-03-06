<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Return To Stock (Item Wise).csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!='')
      $condition='and e.stock_type_code in ('.$_REQUEST['stock_type_code'].')';

      $item_condition='';
      if($_REQUEST['item_id']!='')
      $item_condition='and a.item_id in ('.$_REQUEST['item_id'].')';


         $query = "select a.return_to_stock_id, a.item_id, item_name, item_description, return_to_stock_qty,
                   date_format(transaction_date, '%d/%m/%Y') as return_date, 
                   uom_code, max_level, min_level, b.location,
                   e.stock_type_code, return_to_stock_no, return_by, department
                   from transaction a 
                   join return_to_stock e on a.return_to_stock_id=e.return_to_stock_id
                   join issue_to_department i on e.issue_id=i.issue_id
                   join department_master d on i.department_id=d.department_id
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on b.item_id = c.item_id
                   where (transaction_date between :start_date and :end_date)
                  " .$condition. $item_condition. " 
                  and transaction_type='RS'
                  and a.financial_year_id=:financial_year_id
                  order by a.item_id, a.transaction_date asc, return_to_stock_id asc";
                   
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
         

      $heading1=array('',  '',  '',  'Return To Stock (Item Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number', 'Return No', 'Return Date',  'Return By',  'Department', 'Location', 'Unit', 'Qty');
      $blankLine=array();
      //$report_total=0;
      foreach ($mainArray as $key => $value) {
        fputcsv($fp, $blankLine);   
        fputcsv($fp, $blankLine); 

        $obj=array();
        $obj['item']=$value['item'];
        fputcsv($fp, $obj);
        fputcsv($fp, $blankLine);     
        fputcsv($fp, $header);       
          $count=0;
        foreach ($value['issues'] as $k => $value1) {
            $count++;
            $ob=array();
            $ob['sl']=$count;
            $ob['return_to_stock_no']=$value1['stock_type_code'].'-'.$value1['return_to_stock_no'];
            $ob['return_date']=$value1['return_date'];
            $ob['return_by']=$value1['return_by'];
            $ob['department']=$value1['department'];
            $ob['location']=$value1['location'];
            $ob['uom_code']=$value1['uom_code'];
            $ob['return_to_stock_qty']=$value1['return_to_stock_qty'];
            fputcsv($fp, $ob);   
        }
      }

            /*fputcsv($fp, $blankLine);   
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
            fputcsv($fp, $ob);  */ 
  
      exit;
?>