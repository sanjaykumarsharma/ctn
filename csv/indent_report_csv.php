<?php
session_start();
require_once '../api/modules/conf.php';
    
     $objPDO = getConnection();
     
      $filename = "Indent Register Date Wise.csv";
      $fp = fopen('php://output', 'w');

      
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);

      $condition='';
      if($_REQUEST['status']!='all'){
        $condition="and status='".$_REQUEST['status']."'";
      }



         $sd=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['start_date']))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $_REQUEST['end_date']))));
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
                    order by a1.indent_date asc, a1.indent_id asc";

           $qty_grand_total = 0;
           $item_value_grand_total = 0;         
           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();
           foreach ($transactions as $dtkey => $value) {
             $qty_grand_total = $qty_grand_total + $value['qty'];
             $item_value_grand_total = $item_value_grand_total + $value['total_value'];
           }

      $heading1=array('',  '',  '',  'Indent Register (Date Wise)', '', '', '', '');
      $heading2=array('',  '',  '',  'From ' .$_REQUEST['start_date'], 'To '.$_REQUEST['end_date'], '', '', '');
      fputcsv($fp, $heading1);
      fputcsv($fp, $heading2);
      $header=array('Serial Number','Indent Date','Indent Type','Indent No','Department','Material Code','Material','UOM','Qty','Rate','Amount','Remarks','Stock');
      fputcsv($fp, $header);     
      $blankLine=array();
      fputcsv($fp, $blankLine);   
      fputcsv($fp, $blankLine);   
      $count=0;
      foreach ($transactions as $value) {
        $count++;
        $ob=array();
        $ob['sl']=$count;
        $ob['indent_date']=$value['indent_date'];
        $ob['indent_type']=$value['indent_type'];
        $ob['indent_no']=$value['stock_type_code'].'-'.$value['indent_no'];
        $ob['department']=$value['department'];
        $ob['item_id']=$value['item_id'];
        $ob['item_name']=$value['item_name'];
        $ob['uom_code']=$value['uom_code'];
        $ob['qty']=$value['qty'];
        $ob['unit_value']=$value['unit_value'];
        $ob['total_value']=$value['total_value'];
        $ob['remarks']=$value['remarks'];
        $ob['stock']=$value['stock'];
        fputcsv($fp, $ob);   
      }

      fputcsv($fp, $blankLine);   
      fputcsv($fp, $blankLine);
      $ob=array();
      $ob['sl']=$count;
      $ob['indent_date']='';
      $ob['indent_type']='';
      $ob['indent_no']='';
      $ob['department']='';
      $ob['item_id']='';
      $ob['item_name']='';
      $ob['uom_code']='Grand Total Qty';
      $ob['qty']=$qty_grand_total;
      $ob['unit_value']='Grand Total Amount';
      $ob['total_value']=$item_value_grand_total;
      $ob['remarks']='';
      $ob['stock']='';
      fputcsv($fp, $ob); 
      exit;
?>

