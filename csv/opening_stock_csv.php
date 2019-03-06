<?php
session_start();
require_once '../api/modules/conf.php';
    
     $con = getConnection();
    /*if(isset($_SESSION['NTC_USER_ID'])){//if user is logged in
      
    }else{
      throw new Exception("Sorry you are not authorised.", 1);
    }*/
     
      $filename = "Opening Stock.csv";
      $fp = fopen('php://output', 'w');

      
      $header=array('Material',  'Old Code',  'UOM',  'Qty', 'Rate', 'Amount', 'Location', 'Remarks', 'Stock Type');
      header('Content-type: application/csv');
      header('Content-Disposition: attachment; filename='.$filename);
      fputcsv($fp, $header);

      $item_group_code_condition = '';
         if($_REQUEST['item_group_code'] != ''){
            $item_group_code_condition = " and item_group_code ='".$_REQUEST['item_group_code']."'";
         }

         $query = "select concat( (concat ((concat(item_name,'(Code:-')), a.item_id)), ')'), item_code, uom_code,    
                   a.qty, rate, (a.qty*rate) as amount, b.location, a.remarks, stock_type_code
                   from item_master b
                   join transaction a on a.item_id=b.item_id
                   where stock_type_code = :stock_type_code
                   ". $item_group_code_condition ."
                   and transaction_type='O'
                   and financial_year_id=:financial_year_id
                   order by a.item_id";

                   

      // $query = "select concat( (concat ((concat(item_name,'(Code:-')), a.item_id)), ')'), item_code, uom_code, a.qty, rate,
      //          b.location, a.remarks, stock_type_code
      //          from item_master b
      //          join transaction a on a.item_id=b.item_id
      //          where transaction_type='O'
      //          order by stock_type_code ";

      $statement = $con->prepare($query);
      $statement->bindParam(':stock_type_code', $_REQUEST['stock_type_code']);
      $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);     
      $statement->setFetchMode(PDO::FETCH_ASSOC);
      $statement->execute();
      $row = $statement->fetchAll();

      foreach ($row as $key => $value) {
        fputcsv($fp, $value);
      }
      exit;
?>