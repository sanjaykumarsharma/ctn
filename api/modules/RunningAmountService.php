<?php
require_once 'conf.php';
/***************************Comman for every module********************************/
function updateRunningAmount($item_ids) {//for each module
  try{
        $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
        $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $report_data = array();
         foreach ($item_ids as $v) {
                 $query = "select  o_qty, o_rate, o_amount, r_qty, r_rate, r_amount, i_qty, i_rate, i_amount, transaction_date, transaction_id, transaction_type, running_balance, running_amount, td, details
                           from
                           (
                              select a.item_id, item_name, qty as o_qty, rate as o_rate, (qty* rate) as o_amount,  '' as r_qty, '' as r_rate, '' as r_amount, '' as i_qty, '' as i_rate, '' as i_amount, transaction_date, transaction_id,
                              running_balance, transaction_type, running_amount,
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, stock_type_code, 'Opening' as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and transaction_type = 'O'

                              UNION

                              select a.item_id, item_name, '' as o_qty, '' as o_rate, '' as o_amount, qty as r_qty, rate as r_rate, (qty* rate) as r_amount,  '' as i_qty, '' as i_rate, '' as i_amount, transaction_date, transaction_id,
                              running_balance, transaction_type, running_amount,
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(c.stock_type_code, '-'), c.docket_no) as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join docket c on (a.docket_id = c.docket_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and transaction_type = 'R'

                              UNION

                              select a.item_id, item_name, '' as o_qty, '' as o_rate, '' as o_amount, '' as r_qty, '' as r_rate, '' as r_amount, qty as i_qty, rate as i_rate, (qty* rate) as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(c.stock_type_code, '-'), c.issue_no) as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join issue_to_department c on (a.issue_id = c.issue_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and transaction_type = 'I'

                              UNION

                              select a.item_id, item_name, '' as o_qty, '' as o_rate, '' as o_amount, reject_to_party_qty as r_qty, rate as r_rate, (reject_to_party_qty* rate) as r_amount , '' as i_qty, '' as i_rate, '' as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(concat(c.stock_type_code, '-'), c.reject_to_party_no),'-RP') as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join reject_to_party c on (a.reject_to_party_id = c.reject_to_party_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and transaction_type = 'RP'

                              UNION

                              select a.item_id, item_name, '' as o_qty, '' as o_rate, '' as o_amount, '' as r_qty, '' as r_rate, '' as r_amount, return_to_stock_qty as i_qty, rate as i_rate, (return_to_stock_qty* rate) as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(concat(c.stock_type_code, '-'), c.return_to_stock_no),'-RS') as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join return_to_stock c on (a.return_to_stock_id = c.return_to_stock_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = :financial_year_id
                              and a.item_id = :item_id
                              and transaction_type = 'RS'
                              
                            ) a order by transaction_date asc, transaction_id asc";

             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $statement->bindParam(':item_id', $v);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement->execute();
                 $rs=$statement->fetchAll();

                 $items = array();
                 $items['items'] = $rs;   
                 $report_data[] = $items;
             }

         foreach ($report_data as $key => $value) {
           $prev_running_amount=0;
           $prev_rb=0;
           $current_amount=0;
           $counter=0;
           foreach ($value['items'] as $key1 => $v1) {
             switch($v1['transaction_type']){
                case 'O':
                    $current_amount=$v1['o_amount'];
                    if($counter==0){
                      $counter=1;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                    }
                break;
                case 'I':
                    $rate=0;
                    if($counter==0){
                      $counter=1;
                      $current_amount=0;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                     }else{
                        if($prev_rb!=0){
                          $rate=number_format(($prev_running_amount/$prev_rb), 2, '.', '');
                          $current_amount=$v1['i_qty']*($rate);
                        }else{
                         $current_amount=0;
                        }
                       $ra=$prev_running_amount-$current_amount;
                       $prev_running_amount = $ra;
                       $prev_rb = $v1['running_balance'];
                    }
                    $query5="update transaction 
                          set rate = :rate
                          where transaction_id = :transaction_id";
                   $statement5 = $objPDO->prepare($query5); 
                   $statement5->bindParam(':transaction_id', $v1['transaction_id']);
                   $statement5->bindParam(':rate', $rate);
                   $statement5->execute(); 
                break;
                case 'R':
                    $current_amount=$v1['r_amount'];
                    if($counter==0){
                      $counter=1;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                     }else{
                      $ra=$prev_running_amount+$current_amount;
                      $prev_running_amount = $ra;
                      $prev_rb = $v1['running_balance'];
                    }
                break;
                case 'RP':
                    $current_amount=$v1['r_amount'];
                    if($counter==0){
                      $counter=1;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                     }else{
                      $ra=$prev_running_amount-$current_amount;
                      $prev_running_amount = $ra;
                      $prev_rb = $v1['running_balance'];
                    }
                break;
                case 'RS':
                    $rate=0;
                    if($counter==0){
                      $counter=1;
                      $current_amount=0;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                     }else{
                        if($prev_rb!=0){
                          $rate=number_format(($prev_running_amount/$prev_rb), 2, '.', '');
                          $current_amount=$v1['i_qty']*($rate);
                        }else{
                         $current_amount=0;
                        }
                       $ra=$prev_running_amount+$current_amount;
                       $prev_running_amount = $ra;
                       $prev_rb = $v1['running_balance'];
                    }
                    $query5="update transaction 
                          set rate = :rate
                          where transaction_id = :transaction_id";
                   $statement5 = $objPDO->prepare($query5); 
                   $statement5->bindParam(':transaction_id', $v1['transaction_id']);
                   $statement5->bindParam(':rate', $rate);
                   $statement5->execute(); 
                break;
                // case 'AR':
                    
                // break;
            }

             $query6="update transaction 
                    set running_amount = :running_amount
                    where transaction_id = :transaction_id";
             $statement6 = $objPDO->prepare($query6); 
             $statement6->bindParam(':transaction_id', $v1['transaction_id']);
             $statement6->bindParam(':running_amount', $ra);
             $statement6->execute(); 
           }
         }
         // return;
         $r1data = 's';
         //$r1data['status'] = "s";
        // $r1data['items'] = $report_data;
         return $r1data;
      }catch(Shuttle_Exception $e) {
      $error['status'] = "e";
      $error['error'] = $e->getMessage();
      return $error;
      // echo "Couldn't dump database: " . $e->getMessage();
    }
}
?>
