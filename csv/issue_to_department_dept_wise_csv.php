<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Issue To Department (Department Wise).csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['stock_type_code']!='')
      $condition='and e.stock_type_code in ('.$_REQUEST['stock_type_code'].')';

      $dept_condition='';
      if($_REQUEST['department_id']!='')
      $dept_condition='and e.department_id in ('.$_REQUEST['department_id'].')';


         $query = "select a.issue_id, transaction_id, a.item_id, item_name, uom_code, b.location, 
                 max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty,
                  rate, FORMAT((a.qty*rate),2) as amount, a.remarks, chargehead,
                 e.stock_type_code, issue_no, e.department_id, department, approve_by, receive_by,
                 date_format(issue_date, '%d/%m/%Y') as issue_date
                 from transaction a
                 join issue_to_department e on a.issue_id=e.issue_id
                 join department_master f on e.department_id=f.department_id 
                 join item_master b on a.item_id = b.item_id
                 left join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                 left join chargehead_master d on a.charge_head_id=d.chargehead_id
                 where (transaction_date between :start_date and :end_date)
                 and stock_adjustment = :stock_adjustment 
                  " .$condition. $dept_condition. " 
                  and transaction_type='I'
                  and a.financial_year_id=:financial_year_id
                  order by e.department_id, a.transaction_date asc, issue_id asc";
                   
         $statement = $objPDO->prepare($query);
         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
         
         $statement->bindParam(":start_date", $sd);
         $statement->bindParam(":end_date", $ed);
         $statement->bindParam(":stock_adjustment", $_REQUEST['stock_adjustment']);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $transactions=$statement->fetchAll();
         
         
         $prev_department_id='';
         $prev_department_name='';
         $qty_grand_total = 0;
         $amount_grand_total=0;
         $issueArray=array();
         $obj=array();
         foreach ($transactions as $key => $value) {
           if($prev_department_id==''){//loop run first time
            $obj=array();
            $prev_department_id=$value['department_id'];
            $prev_department_name=$value['department'];
            $obj[]=$value;
           }else if($prev_department_id==$value['department_id']){//same date
            $obj[]=$value;
           }else if($prev_department_id!=$value['department_id']){// new date starts
            $issueArray[$prev_department_name]=$obj;
            $obj=array();
            $prev_department_id=$value['department_id'];
            $prev_department_name=$value['department'];
            $obj[]=$value;
           }
           $qty_grand_total = $qty_grand_total + ((float)(str_replace(',', '', $value['qty'])));
           $amount_grand_total = $amount_grand_total + ((float)(str_replace(',', '', $value['amount'])));
         }
         $issueArray[$prev_department_name]=$obj;

         //calculate item total
         foreach ($issueArray as $k => $v) {
             $qty_total = 0;
             $amount_total = 0;
             foreach ($v as $k1 => $v1) {
               $qty_total = $qty_total + ((float)(str_replace(',', '', $v1['qty'])));
               $amount_total = $amount_total + ((float)(str_replace(',', '', $v1['amount'])));
             }        
             $oj=array(); //item wise total
             $oj['item_id']='';
             $oj['issue_no']='';
             $oj['stock_type_code']='';
             $oj['issue_date']='';
             $oj['approve_by']='';
             $oj['receive_by']='';
             $oj['department']='';
             $oj['location']='';
             $oj['uom_code']='Total';
             $oj['qty']=$qty_total;
             if($qty_total>0){
                 $oj['rate']=number_format(($amount_total/$qty_total), 2, '.', '');
               }else{
                 $oj['rate']=0;
               }
             $oj['amount']=$amount_total;
             $oj['chargehead']='';
             $oj['item_name']='';
             $oj['item_id']='';
             $issueArray[$k][]=$oj;
         }  
                   
         
         $mainArray=array(); 
         foreach ($issueArray as $key => $value) { //Docket details array
            $ob=array();
            $ob['department']=$key;
            $ob['issues']=$value;
            $mainArray[]=$ob;
         }

      $heading1=array('',  '',  '',  'Issue To Department (Department Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number', 'Issue No', 'Issue Date',  'Issue By',  'Receive By', 'Item', 'Location', 'Unit', 'Qty', 'Rate', 'Amount', 'Chargehead');
      $blankLine=array();
      //$report_total=0;
      foreach ($mainArray as $key => $value) {
        fputcsv($fp, $blankLine);   
        fputcsv($fp, $blankLine); 

        $obj=array();
        $obj['department']=$value['department'];
        fputcsv($fp, $obj);
        fputcsv($fp, $blankLine);     
        fputcsv($fp, $header);       
          $count=0;
        foreach ($value['issues'] as $k => $value1) {
            $count++;
            $ob=array();
            $ob['sl']=$count;
            $ob['issue_no']=$value1['stock_type_code'].'-'.$value1['issue_no'];
            $ob['issue_date']=$value1['issue_date'];
            $ob['approve_by']=$value1['approve_by'];
            $ob['receive_by']=$value1['receive_by'];
            $ob['item_name']=$value1['item_name'].'-(Code:'.$value1['item_id'].')';
            $ob['location']=$value1['location'];
            $ob['uom_code']=$value1['uom_code'];
            $ob['qty']=$value1['qty'];
            $ob['rate']=$value1['rate'];
            $ob['amount']=$value1['amount'];
            $ob['chargehead']=$value1['chargehead'];
            fputcsv($fp, $ob);   
        }
      }

            fputcsv($fp, $blankLine);   
            fputcsv($fp, $blankLine);   
            $ob=array();//Report Total
            $ob['item_name']='';
            $ob['location']='';
            $ob['uom_code']='';
            $ob['qty']='';
            $ob['qty1']='';
            $ob['qty2']='';
            $ob['qty3']='';
            $ob['total']='Grand Total Qty';
            $ob['report_total']=$qty_grand_total;
            $ob['total1']='Grand Total Qty';
            $ob['report_total1']=$amount_grand_total;
            fputcsv($fp, $ob);   
  
      exit;
?>