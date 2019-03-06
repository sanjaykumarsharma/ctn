<?php
require_once 'conf.php';
class ReceiveService{
  
  public function readReceiveNumber($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select max(receive_no) as receive_no
                   from receive 
                   where stock_type_code = :stock_type_code
                   and financial_year_id=:financial_year_id";
         
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $receive_no=$statement->fetch();
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['receive_no'] = $receive_no['receive_no']+1;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

  public function readReceivedItems($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          
         if($data->stock_type_code=='all'){
            $query = "select receive_id, receive_no, stock_type_code, 
                   date_format(receive_date, '%d/%m/%Y') as receive_date,
                   approve_by, adjusted_by, remarks   
                   from receive a
                   where financial_year_id=:financial_year_id
                   order by receive_id desc";         

           
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         }else{
           $query = "select receive_id, receive_no, stock_type_code, 
                   date_format(receive_date, '%d/%m/%Y') as receive_date,
                   approve_by, adjusted_by, remarks   
                   from receive a
                   where stock_type_code = :stock_type_code
                   and financial_year_id=:financial_year_id
                   order by receive_id desc";         

           
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(":stock_type_code", $data->stock_type_code);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         } 
          
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

  public function addReceive($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $receive_date=implode("-", array_reverse(array_map('trim', explode("/", $m->receive_date))));
         //check if any transaction is received after the given date
         $query="select count(receive_id) as transaction_no 
                 from receive 
                 where receive_date>:receive_date
                 and stock_type_code=:stock_type_code 
                 and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);        
         $statement->setFetchMode(PDO::FETCH_ASSOC);    
         $statement->bindParam(':receive_date', $receive_date);
         $statement->bindParam(':stock_type_code', $m->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $total_transaction_no=$statement->fetch();

         if($total_transaction_no['transaction_no']==0){////back date receive entry restriction
         $objPDO->beginTransaction();

         $dt = date('Y-m-d H:i:s');

         $query = "Insert into receive (financial_year_id, receive_no, stock_type_code,
                   receive_date, remarks, 
                   approve_by, adjusted_by, 
                   creation_date, created_by, modification_date, modified_by)
                   values (:financial_year_id, :receive_no, :stock_type_code,
                   :receive_date, :remarks, 
                   :approve_by, :adjusted_by, :dt, :user, :dt, :user)";

         $statement = $objPDO->prepare($query);         
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->bindParam(':receive_no', $m->receive_no);
         $statement->bindParam(':stock_type_code', $m->stock_type_code);
         $statement->bindParam(':receive_date', $receive_date);
         $statement->bindParam(':remarks', $m->remarks);
         $statement->bindParam(':approve_by', $m->approve_by);
         $statement->bindParam(':adjusted_by', $m->adjusted_by);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $receive_id = $objPDO->lastInsertId();

         $query1 = "Insert into transaction(financial_year_id, receive_id, item_id, transaction_type, qty, remarks, location,  transaction_date,creation_date)
                   values (:financial_year_id, :receive_id , :item_id, 'AR', :qty, :remarks,
                   :location, :transaction_date,curdate())";         
         $statement1 = $objPDO->prepare($query1);

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
           $statement3->bindParam(':transaction_date', $receive_date);
           $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement3->execute();
           $qty=$statement3->fetch();

           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->bindParam(':receive_id', $receive_id);
           $statement1->bindParam(':item_id', $value->item_id);
           $statement1->bindParam(':qty', $value->qty);
           $statement1->bindParam(':remarks', $value->remarks);
           $statement1->bindParam(':location', $value->location);
           $statement1->bindParam(':transaction_date', $receive_date);
           $statement1->execute();
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
            $rb=$value->qty + $qty['qty'];
           }

           $statement4->bindParam(':transaction_id', $transaction_id);
           $statement4->bindParam(':running_balance', $rb);
           $statement4->execute();   

           //update running balace of every transaction of this item after this transaction date
           /*update condition1*/
           $query7="update transaction 
                  set running_balance=running_balance+:running_balance
                  where transaction_date=:transaction_date
                  and item_id=:item_id
                  and transaction_id>:transaction_id
                  and financial_year_id=:financial_year_id";
           $statement7 = $objPDO->prepare($query7); 
           $statement7->bindParam(':running_balance', $value->qty);
           $statement7->bindParam(':transaction_date', $receive_date);
           $statement7->bindParam(':item_id', $value->item_id);
           $statement7->bindParam(':transaction_id', $transaction_id);
           $statement7->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement7->execute();

           /*update condition2*/
           $query8="update transaction 
                  set running_balance=running_balance+:running_balance
                  where transaction_date>:transaction_date
                  and item_id=:item_id
                  and financial_year_id=:financial_year_id";
           $statement8 = $objPDO->prepare($query8); 
           $statement8->bindParam(':running_balance', $value->qty);
           $statement8->bindParam(':transaction_date', $receive_date);
           $statement8->bindParam(':item_id', $value->item_id);
           $statement8->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement8->execute();   
         }

         $objPDO->commit();

          $data = array();
          $data['status'] = "s";
        }else{
          $data = array();
          $data['status'] = "error";
        }  
         return $data;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readReceiveToDepartment($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select transaction_id, a.item_id,  item_name, uom, a.qty, a.remarks, 
                   date_format(transaction_date, '%d/%m/%Y') as transaction_date
                  from transaction a
                  join item_master b on a.item_id = b.item_id
                  join uom_master c on b.uom_code = c.uom_code
                  where item_group_code = :item_group_code
                  and category_code = :category_code
                  and stock_type_code = :stock_type_code
                  and transaction_type='O'
                  order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":item_group_code", $data->item_group_code);
         $statement->bindParam(":category_code", $data->category_code);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);         
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

   public function readItemsForReceiveEdit($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select receive_id, transaction_id, a.item_id, 
                   item_name, uom_code,
                   max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty, a.remarks
                   from transaction a
                   join item_master b on a.item_id = b.item_id
                   join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                   where receive_id = :receive_id
                   and transaction_type='AR'
                   and a.financial_year_id=:financial_year_id
                   order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":receive_id", $data->receive_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();

         $query1 = "select receive_no, stock_type_code,
                    date_format(receive_date, '%d/%m/%Y') as receive_date, 
                    approve_by, adjusted_by, remarks
                    from receive
                    where receive_id = :receive_id";
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(":receive_id", $data->receive_id);
         $statement1->execute();

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $statement->fetchAll();
         $rdata['details'] = $statement1->fetch();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function readView($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select a.item_id, 
                   item_name, uom_code,
                   max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty, a.remarks
                   from transaction a
                   join item_master b on a.item_id = b.item_id
                   join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                   where receive_id = :receive_id
                   and a.financial_year_id=:financial_year_id
                   order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":receive_id", $data->receive_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();

         $query1 = "select receive_no, stock_type_code,
                    date_format(receive_date, '%d/%m/%Y') as receive_date, 
                    approve_by, adjusted_by, remarks
                    from receive a
                    where receive_id = :receive_id";
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(":receive_id", $data->receive_id);
         $statement1->execute();

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $statement->fetchAll();
         $rdata['details'] = $statement1->fetch();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function editReceiveToDepartment($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $objPDO->beginTransaction();

         $dt = date('Y-m-d H:i:s');

         $query = "update receive set remarks=:remarks,
                   approve_by=:approve_by,
                   adjusted_by=:adjusted_by,
                   modification_date=:dt,
                   modified_by=:user
                   where receive_id=:receive_id";

         $statement = $objPDO->prepare($query);         
         
         $receive_date=implode("-", array_reverse(array_map('trim', explode("/", $m->receive_date))));
         // $statement->bindParam(':receive_date', $receive_date);
         $statement->bindParam(':remarks', $m->remarks);
         $statement->bindParam(':approve_by', $m->approve_by);
         $statement->bindParam(':adjusted_by', $m->adjusted_by);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':receive_id', $m->receive_id);
         $statement->execute();

         $query1 = "update transaction set qty=:qty,
                    remarks=:remarks,
                    location=:location
                    where transaction_id=:transaction_id";         
         $statement1 = $objPDO->prepare($query1);

         //update stock in hand start
         $query2 = "update stock_in_hand set qty=qty+:qty
                    where item_id=:item_id
                    and financial_year_id=:financial_year_id";
         $statement2 = $objPDO->prepare($query2);     

         //update transaction table running balance
         $query4="update transaction 
                  set running_balance=running_balance+:running_balance
                  where transaction_id=:transaction_id";
         $statement4 = $objPDO->prepare($query4); 

         foreach ($m->materials as $value) {
           $statement1->bindParam(':qty', $value->qty);
           $statement1->bindParam(':remarks', $value->remarks);
           $statement1->bindParam(':location', $value->location);
           //$statement1->bindParam(':transaction_date', $dt);
           $statement1->bindParam(':transaction_id', $value->transaction_id);
           $statement1->execute();
           
           $diff_qty=$value->qty-$value->prev_qty;

           //update stock in hand start
           $statement2->bindParam(':item_id', $value->item_id);
           $statement2->bindParam(':qty', $diff_qty);
           $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement2->execute();
           
           //$running_balance=$qty['qty']-$value->qty;
           $statement4->bindParam(':transaction_id', $value->transaction_id);
           $statement4->bindParam(':running_balance', $diff_qty);
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
           $statement5->bindParam(':running_balance', $diff_qty);
           $statement5->bindParam(':transaction_date', $receive_date);
           $statement5->bindParam(':item_id', $value->item_id);
           $statement5->bindParam(':transaction_id', $value->transaction_id);
           $statement5->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement5->execute();

           /*update condition2*/
           $query6="update transaction 
                  set running_balance=running_balance-:running_balance
                  where transaction_date>:transaction_date
                  and item_id=:item_id
                  and financial_year_id=:financial_year_id";
           $statement6 = $objPDO->prepare($query6); 
           $statement6->bindParam(':running_balance', $diff_qty);
           $statement6->bindParam(':transaction_date', $receive_date);
           $statement6->bindParam(':item_id', $value->item_id);
           $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement6->execute();
           
         }

         $objPDO->commit();

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

   public function deleteReceive($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $objPDO->beginTransaction();

         $query="select transaction_id, item_id, qty, running_balance, transaction_date
                 from transaction
                 where receive_id=:receive_id
                 and transaction_type='AR'";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':receive_id', $data->receive_id);
         $statement->execute();
         $transactions=$statement->fetchAll();

          foreach ($transactions as $old_value) {
            //update transaction
             $query = "delete from transaction 
                       where transaction_id=:transaction_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':transaction_id', $old_value['transaction_id']);
             $statement->execute();
             
             //update transaction and running balance of item after this transaction date
             /*update condition1*/
             $query = "update transaction set running_balance=running_balance-:running_balance
                       where transaction_date=:transaction_date
                       and transaction_id>:transaction_id
                       and item_id=:item_id
                       and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':running_balance', $old_value['qty']);
             $statement->bindParam(':transaction_date', $old_value['transaction_date']);
             $statement->bindParam(':transaction_id', $old_value['transaction_id']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement->execute();

             /*update condition2*/
             $query = "update transaction set running_balance=running_balance-:running_balance
                       where transaction_date>:transaction_date
                       and item_id=:item_id
                       and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':running_balance', $old_value['qty']);
             $statement->bindParam(':transaction_date', $old_value['transaction_date']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement->execute();

             //update stock in hand
             $query = "update stock_in_hand set qty=qty-:qty
                        where item_id=:item_id
                        and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':qty', $old_value['qty']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement->execute();
             
          }

          $query = "delete from receive
                    where receive_id = :receive_id";
          $statement = $objPDO->prepare($query);
          $statement->bindParam(":receive_id", $data->receive_id);
          $statement->execute();
          
          $objPDO->commit();

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

}
?>
