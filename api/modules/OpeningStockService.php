<?php
require_once 'conf.php';
require_once 'RunningAmountService.php';
class OpeningStockService{

  public function readItems($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select a.item_id,  a.item_name, a.item_group_code, uom_code, item_group,
                   stock_type_code, item_description,
                   max_level, min_level, reorder_level, reorder_qty, location,
                   c.qty as stock, party_name, lp_price, lp_qty
                   from item_master a
                   join item_group_master b on a.item_group_code = b.item_group_code
                   left join stock_in_hand c on a.item_id = c.item_id
                   left join item_last_purchase d on a.item_id=d.item_id
                   left join party_master e on d.lp_party_id=e.party_id
                   where a.item_group_code = :item_group_code
                   and stock_type_code = :stock_type_code
                   and a.item_id not in (select distinct item_id from transaction where transaction_type='O' and financial_year_id=:financial_year_id)
                   and c.financial_year_id=:financial_year_id
                   order by 2";
       
                            
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":item_group_code", $data->item_group_code);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);    
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);     
         $statement->execute();
         $materials=$statement->fetchAll();
         $items=array();
         foreach ($materials as $key => $value) {
          $tempRow = array();
          $tempRow['item_id'] = $value['item_id']; 
          $tempRow['item_name'] = utf8_encode($value['item_name']);
          $tempRow['item_description'] = utf8_encode($value['item_description']);
          $tempRow['max_level'] = utf8_encode($value['max_level']);
          $tempRow['min_level'] = utf8_encode($value['min_level']);
          $tempRow['reorder_level'] = utf8_encode($value['reorder_level']);
          $tempRow['reorder_qty'] = utf8_encode($value['reorder_qty']);
          $tempRow['location'] = utf8_encode($value['location']);
          $tempRow['party_name'] = utf8_encode($value['party_name']);
          
          $tempRow['item_group_code'] = $value['item_group_code'];
          $tempRow['uom_code'] = $value['uom_code'];
          $tempRow['item_group'] = $value['item_group'];
          $tempRow['stock_type_code'] = $value['stock_type_code'];
          $tempRow['stock'] = $value['stock'];
          $tempRow['lp_price'] = $value['lp_price'];
          $tempRow['lp_qty'] = $value['lp_qty'];
          $items[] = $tempRow;
         } 

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $items;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

  public function addOpeningStock($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }
         
         $objPDO->beginTransaction();
         
         $dt = date('Y-m-d H:i:s');
         $opening_stock_date=implode("-", array_reverse(array_map('trim', explode("/", $m->opening_stock_date))));
         $query = "Insert into transaction (financial_year_id, item_id, transaction_type, qty, location,
                   remarks, transaction_date,
                   creation_date, modification_date, modified_by)
                   values (:financial_year_id, :item_id, 'O', :qty, :location, :remarks, :transaction_date,
                   :dt, :dt, :user)";
         $statement = $objPDO->prepare($query);

         //update stock in hand start
         $query2 = "update stock_in_hand set qty=qty+:qty
                    where item_id=:item_id
                    and financial_year_id=:financial_year_id";
         $statement2 = $objPDO->prepare($query2);     

         //update transaction table running balance
         $query3="select running_balance as qty from transaction
                where item_id=:item_id
                and transaction_date<=:transaction_date
                and financial_year_id=:financial_year_id
                order by transaction_date desc, transaction_id desc limit 1";
         $statement3 = $objPDO->prepare($query3);
         $statement3->setFetchMode(PDO::FETCH_ASSOC);                            

         $query4="update transaction 
                  set running_balance=:running_balance
                  where transaction_id=:transaction_id";
         $statement4 = $objPDO->prepare($query4);

         foreach ($m->materials as $value) {
           //reading running balance of same item on last transaction date
           $statement3->bindParam(':item_id', $value->item_id);
           $statement3->bindParam(':transaction_date', $opening_stock_date);
           $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement3->execute();
           $qty=$statement3->fetch();

           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->bindParam(':item_id', $value->item_id);
           $statement->bindParam(':qty', $value->qty);
           $statement->bindParam(':location', $value->location);
           $statement->bindParam(':remarks', $value->remarks);
           $statement->bindParam(':transaction_date', $opening_stock_date);
           $statement->bindParam(":dt", $dt);
           $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
           $statement->execute();
           $transaction_id = $objPDO->lastInsertId();

           //update stock in hand start
           $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement2->bindParam(':item_id', $value->item_id);
           $statement2->bindParam(':qty', $value->qty);
           $statement2->execute();

           //update transaction table running balance
           $rb=$value->qty;
           if($qty['qty']==''){
            $rb=$value->qty;
           }else{
            $rb=$qty['qty']+$value->qty;
           }


           $statement4->bindParam(':transaction_id', $transaction_id);
           $statement4->bindParam(':running_balance', $rb);
           $statement4->execute(); 

           //update running balace of every transaction of this item after this transaction date
             /*update condition1*/
             $query5="update transaction 
                    set running_balance=running_balance+:running_balance
                    where transaction_date=:transaction_date
                    and item_id=:item_id
                    and transaction_id>:transaction_id
                    and financial_year_id=:financial_year_id";
             $statement5 = $objPDO->prepare($query5); 
             $statement5->bindParam(':running_balance', $value->qty);
             $statement5->bindParam(':transaction_date', $opening_stock_date);
             $statement5->bindParam(':item_id', $value->item_id);
             $statement5->bindParam(':transaction_id', $transaction_id);
             $statement5->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement5->execute();

             /*update condition2*/
             $query6="update transaction 
                    set running_balance=running_balance+:running_balance
                    where transaction_date>:transaction_date
                    and item_id=:item_id
                    and financial_year_id=:financial_year_id";
             $statement6 = $objPDO->prepare($query6); 
             $statement6->bindParam(':running_balance', $value->qty);
             $statement6->bindParam(':transaction_date', $opening_stock_date);
             $statement6->bindParam(':item_id', $value->item_id);
             $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement6->execute();   
         }


         $objPDO->commit();

         updateRunningAmount($items_array); 

          $data = array();
          $data['status'] = "s";
         return $data;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function editOpeningStock($m) {
      try{

         $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }

         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $objPDO->beginTransaction();
         
         $dt = date('Y-m-d H:i:s');

         $query = "update transaction set qty=:qty,
                   rate=:rate,
                   location=:location,
                   remarks=:remarks,
                   running_balance=running_balance+:running_balance,
                   running_amount=:running_amount,
                   modification_date=:modification_date, 
                   modified_by=:user
                   where transaction_id=:transaction_id";
         $statement = $objPDO->prepare($query);

         foreach ($m->materials as $value) {
           $diff_qty=$value->qty-$value->old_qty;
           if($value->qty<$value->old_qty){
              $diff_qty = -$diff_qty;
           }
           $diff_qty=$value->qty-$value->old_qty;

           $statement->bindParam(':transaction_id', $value->transaction_id);
           $statement->bindParam(':qty', $value->qty);
           $statement->bindParam(':rate', $value->rate);
           $statement->bindParam(':location', $value->location);
           $statement->bindParam(':remarks', $value->remarks);
           $statement->bindParam(':running_balance', $diff_qty);
           $running_amount = $value->qty * $value->rate;
           $statement->bindParam(':running_amount', $diff_qty);
           
           $opening_stock_date=implode("-", array_reverse(array_map('trim', explode("/", $m->opening_stock_date))));
           //$statement->bindParam(':transaction_date', $opening_stock_date);
           $statement->bindParam(":modification_date", $dt);
           $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
           $statement->execute();

           //update stock in hand
           $query = "update stock_in_hand set qty=qty+:qty
                     where item_id=:item_id
                     and financial_year_id=:financial_year_id";
           $statement = $objPDO->prepare($query);
           $statement->bindParam(':qty', $diff_qty);
           $statement->bindParam(':item_id', $value->item_id);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->execute();  

           //update running balace of every transaction of this item after this transaction date
             /*update condition1*/
             $query5="update transaction 
                    set running_balance=running_balance+:running_balance
                    where transaction_date=:transaction_date
                    and item_id=:item_id
                    and transaction_id>:transaction_id
                    and financial_year_id=:financial_year_id";
             $statement5 = $objPDO->prepare($query5); 
             $statement5->bindParam(':running_balance', $diff_qty);
             $statement5->bindParam(':transaction_date', $opening_stock_date);
             $statement5->bindParam(':item_id', $value->item_id);
             $statement5->bindParam(':transaction_id', $transaction_id);
             $statement5->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement5->execute();

             /*update condition2*/
             $query6="update transaction 
                    set running_balance=running_balance+:running_balance
                    where transaction_date>:transaction_date
                    and item_id=:item_id
                    and financial_year_id=:financial_year_id";
             $statement6 = $objPDO->prepare($query6); 
             $statement6->bindParam(':running_balance', $diff_qty);
             $statement6->bindParam(':transaction_date', $opening_stock_date);
             $statement6->bindParam(':item_id', $value->item_id);
             $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement6->execute();  
         }


         $objPDO->commit();

         updateRunningAmount($items_array); 

          $data = array();
          $data['status'] = "s";
         return $data;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readOpeningStock($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $item_group_code_condition = '';
         if($data->item_group_code != ''){
            $item_group_code_condition = " and item_group_code ='".$data->item_group_code."'";
         }

         $query = "select transaction_id, a.item_id, item_name, uom_code, a.qty, a.qty as old_qty, 
                   b.location, a.remarks, rate, running_amount,
                   date_format(transaction_date, '%d/%m/%Y') as transaction_date,
                   transaction_date as opening_date
                   from item_master b
                   join transaction a on a.item_id=b.item_id
                   where stock_type_code = :stock_type_code
                   " . $item_group_code_condition . "
                   and transaction_type='O'
                   and financial_year_id=:financial_year_id
                   order by 2";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         //$statement->bindParam(":item_group_code", $data->item_group_code);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);   
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);      
         $statement->execute();
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $statement->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function searchItems($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $search_term=" like '%".$data->search_term."%'";
         $query = "select transaction_id, a.item_id,  item_name, uom_code, a.qty, a.qty as old_qty,
                   a.location, a.remarks, rate,
                   date_format(transaction_date, '%d/%m/%Y') as transaction_date
                   from transaction a
                   join item_master b on a.item_id = b.item_id
                   where (item_name " . $search_term . " or a.item_id=:item_id) 
                   and transaction_type='O' 
                   and stock_type_code=:stock_type_code 
                   and financial_year_id=:financial_year_id order by 2";
                   
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":stock_type_code", $data->stock_type_code); 
         $statement->bindParam(':item_id', $data->search_term);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $materials=$statement->fetchAll();
         $items=array();
         foreach ($materials as $key => $value) {
          $tempRow = array();
          $tempRow['transaction_id'] = $value['transaction_id']; 
          $tempRow['item_id'] = $value['item_id']; 
          $tempRow['item_name'] = utf8_encode($value['item_name']);
          $tempRow['uom_code'] = utf8_encode($value['uom_code']);
          $tempRow['qty'] = utf8_encode($value['qty']);
          $tempRow['rate'] = utf8_encode($value['rate']);
          $tempRow['old_qty'] = utf8_encode($value['old_qty']);
          $tempRow['location'] = utf8_encode($value['location']);
          $tempRow['remarks'] = utf8_encode($value['remarks']);
          $tempRow['transaction_date'] = utf8_encode($value['transaction_date']);
          $items[] = $tempRow;
         }

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $items;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function searchItemsForOpeningStock($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $search_term=" like '%".$data->search_term."%'";

          $query = "select a.item_id,  a.item_name, a.item_group_code, uom_code, item_group,
                   stock_type_code, item_description,
                   max_level, min_level, reorder_level, reorder_qty, location,
                   c.qty as stock, party_name, lp_price, lp_qty
                   from item_master a
                   join item_group_master b on a.item_group_code = b.item_group_code
                   join stock_in_hand c on a.item_id = c.item_id
                   left join item_last_purchase d on a.item_id=d.item_id
                   left join party_master e on d.lp_party_id=e.party_id
                   where (item_name " . $search_term . " or a.item_id=:item_id) 
                   and stock_type_code='".$data->stock_type_code."' 
                   and a.item_id not in (select distinct item_id from transaction where transaction_type='O')
                   and financial_year_id = :financial_year_id
                   order by 2";          
                   
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':item_id', $data->search_term);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         //$statement->bindParam(":stock_type_code", $data->stock_type_code);        
         $statement->execute();
         $materials=$statement->fetchAll();
         $items=array();
         foreach ($materials as $key => $value) {
          $tempRow = array();
          $tempRow['item_id'] = $value['item_id']; 
          $tempRow['item_name'] = utf8_encode($value['item_name']);
          $tempRow['item_description'] = utf8_encode($value['item_description']);
          $tempRow['max_level'] = utf8_encode($value['max_level']);
          $tempRow['min_level'] = utf8_encode($value['min_level']);
          $tempRow['reorder_level'] = utf8_encode($value['reorder_level']);
          $tempRow['reorder_qty'] = utf8_encode($value['reorder_qty']);
          $tempRow['location'] = utf8_encode($value['location']);
          $tempRow['party_name'] = utf8_encode($value['party_name']);
          
          $tempRow['item_group_code'] = $value['item_group_code'];
          $tempRow['uom_code'] = $value['uom_code'];
          $tempRow['item_group'] = $value['item_group'];
          $tempRow['stock_type_code'] = $value['stock_type_code'];
          $tempRow['stock'] = $value['stock'];
          $tempRow['lp_price'] = $value['lp_price'];
          $tempRow['lp_qty'] = $value['lp_qty'];
          $items[] = $tempRow;
         } 

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $items;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

}
?>
