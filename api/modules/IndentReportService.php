<?php
require_once 'conf.php';
class IndentReportService{

  public function readIndentDateWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
         if($d->status!='all'){
            $condition="and status='".$d->status."'";
         }

         $query = "select indent_id, a.stock_type_code, stock_type, indent_no, status,
                   date_format(indent_date, '%d/%m/%Y') as indent_date,
                   (
                  CASE 
                      WHEN indent_type = 'N' THEN 'Normal'
                      WHEN indent_type = 'U' THEN 'Urgent'
                      WHEN indent_type = 'VU' THEN 'Very Urgent'
                      ELSE 1
                  END) AS indent_type, 
                   a.department_code, department,
                   requested_by, approved_by, finalized_by
                   from indents a 
                   join department_master b on a.department_code=b.department_code
                   join stock_type_master c on a.stock_type_code=c.stock_type_code
                   where (indent_date between :start_date and :end_date) 
                   and financial_year_id=:financial_year_id
                   " .$condition. "
                   order by a.indent_date asc, indent_id asc";
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
         $indentArray=array();
         $obj=array();
         foreach ($details as $key => $value) {
           if($prev_date==''){//loop run first time
            $obj=array();
            $prev_date=$value['indent_date'];
            $obj[]=$value;
           }else if($prev_date==$value['indent_date']){//same date
            $obj[]=$value;
           }else if($prev_date!=$value['indent_date']){// new date starts
            $indentArray[$prev_date]=$obj;
            $obj=array();
            $prev_date=$value['indent_date'];
            $obj[]=$value;
           }
         }
         $indentArray[$prev_date]=$obj;

         $query = "select a.indent_id,indent_material_map_id, b.item_id, item_name, uom_code, qty, unit_value, 
                    total_value, 
                    IF(delivery_date='0000-00-00','',date_format(delivery_date, '%d/%m/%Y')) as delivery_date,
                    a.remarks, a.material_id, stock, lp_price, lp_qty, party_name,
                    e.docket_no, e.stock_type_code
                    from indents a1 
                    join indent_material_map a on a1.indent_id=a.indent_id
                    join item_master b on a.material_id=b.item_id
                    left join (select item_id,lp_price, lp_qty, lp_party_id, docket_id
                              from item_last_purchase
                              where financial_year_id=:financial_year_id) c on a.material_id=c.item_id
                    left join party_master d on c.lp_party_id=d.party_id
                    left join docket e on c.docket_id=e.docket_id
                    where (indent_date between :start_date and :end_date)
                    and a.financial_year_id=:financial_year_id
                    " .$condition. "
                    order by a1.indent_date asc, a1.indent_id asc";

           $transactions=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":start_date", $sd);
           $statement->bindParam(":end_date", $ed);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();
           $transactions=$statement->fetchAll();
            
            $qty_grand_total = 0;
            $item_value_grand_total = 0;
            $mainArray=array(); 
           foreach ($indentArray as $key => $value) { //Issue details array

              $indentMain=array();//for one indent transactions
              foreach ($value as $key1 => $value1) { //array of all indents of one date
                  $indentTransactions=array();
                  foreach ($transactions as $key2 => $value2) { //Issue transactions
                     if($value1['indent_id']==$value2['indent_id']){
                      $indentTransactions[]=$value2; //collecting same indent transactions 
                     }
                  }

                   $obj=array();
                   $obj['date']=$key;
                   $obj['stock_type_code']=$value1['stock_type_code'];
                   $obj['indent_date']=$value1['indent_date'];
                   $obj['indent_no']=$value1['indent_no'];
                   $obj['indent_type']=$value1['indent_type'];
                   $obj['department']=$value1['department'];
                   $obj['requested_by']=$value1['requested_by'];
                   $obj['approved_by']=$value1['approved_by'];
                   $obj['finalized_by']=$value1['finalized_by'];
                   $obj['status']=$value1['status'];
                   $data1=array();
                   $data1['transactions']=$indentTransactions;
                   $data1['indentDetails']=$obj;

                   $indentMain[]=$data1;

                   foreach ($indentTransactions as $dtkey => $value) {
                     $qty_grand_total = $qty_grand_total + $value['qty'];
                     $item_value_grand_total = $item_value_grand_total + $value['total_value'];
                   }
              }
                 $ob=array();
                 $ob['date']=$key;
                 $ob['indents']=$indentMain;
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

  public function readIndentReport($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $condition='';
         if($d->status!='all'){
            $condition="and status='".$d->status."'";
         }

         $sd=implode("-", array_reverse(array_map('trim', explode("/", $d->start_date))));
         $ed=implode("-", array_reverse(array_map('trim', explode("/", $d->end_date))));

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

         $data = array();
         $data['status'] = "s";
         $data['mainArray']=$transactions;
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

   public function readIndentItemWise($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition='';
         if($d->status!='all'){
            $condition="and status='".$d->status."'";
         }

         $item_condition='';
          if($d->selected_item_id!=''){
              $item_condition='and b.item_id in ('.$d->selected_item_id.')';
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
                    " .$condition. $item_condition. "
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
         $qty_grand_total = 0;
         $item_value_grand_total = 0;
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

           $qty_grand_total = $qty_grand_total + $value['qty'];
           $item_value_grand_total = $item_value_grand_total + $value['total_value'];
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
