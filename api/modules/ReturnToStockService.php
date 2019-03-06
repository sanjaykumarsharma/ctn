<?php
require_once 'conf.php';
require_once 'RunningAmountService.php';
class ReturnToStockService{

 public function readIssuedItems($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select issue_id, issue_no, stock_type_code, department,
                   date_format(issue_date, '%d/%m/%Y') as issue_date,
                   approve_by, receive_by   
                   from issue_to_department a
                   join department_master b on a.department_id=b.department_id
                   where stock_type_code = :stock_type_code
                   and financial_year_id=:financial_year_id
                   order by issue_id desc";         

         
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
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

   public function readReturnedItems($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        if($data->stock_type_code=='all'){
          $query = "select return_to_stock_id, stock_type_code, return_to_stock_no,
                   date_format(return_date, '%d/%m/%Y') as return_date, return_by, issue_id
                   from return_to_stock 
                   where financial_year_id=:financial_year_id
                   order by return_to_stock_no";          

         
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
        }else{
          $query = "select return_to_stock_id, stock_type_code, return_to_stock_no,
                   date_format(return_date, '%d/%m/%Y') as return_date, return_by, issue_id
                   from return_to_stock 
                   where stock_type_code = :stock_type_code
                   and financial_year_id=:financial_year_id
                   order by return_to_stock_no";          

         
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

   public function readIssuedItemsForReturn($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $query = "select issue_id, transaction_id, a.item_id, charge_head_id as chargehead_id,
                   item_name, uom_code, date_format(transaction_date, '%d/%m/%Y') as issue_date,
                   max_level, min_level, c.qty as stock, a.qty-return_to_stock_qty as qty, a.qty as prev_qty
                   from transaction a
                   join item_master b on a.item_id = b.item_id
                   join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                   where issue_id = :issue_id
                   and transaction_type='I'
                   and (a.qty-return_to_stock_qty)>0
                   and a.financial_year_id=:financial_year_id
                   order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":issue_id", $data->issue_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();

         $query1 = "select max(return_to_stock_no) as return_to_stock_no
                   from return_to_stock 
                   where stock_type_code = :stock_type_code
                   and financial_year_id=:financial_year_id";         
         
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(":stock_type_code", $data->stock_type_code);
         $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement1->execute();
         $return_to_stock_no=$statement1->fetch();

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $statement->fetchAll();
         $rdata['return_to_stock_no'] = $return_to_stock_no['return_to_stock_no']+1;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readReturnToStockView($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $query = "select a.item_id, item_name, item_description, return_to_stock_qty,
                   date_format(transaction_date, '%d/%m/%Y') as return_date, 
                   remarks, uom_code, max_level, min_level, b.location
                   from transaction a 
                   join item_master b on a.item_id=b.item_id
                   join stock_in_hand c on (b.item_id = c.item_id and a.financial_year_id=c.financial_year_id)
                   where return_to_stock_id = :return_to_stock_id
                   and a.financial_year_id=:financial_year_id
                   order by return_date";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":return_to_stock_id", $data->return_to_stock_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();

         $query1 = "select date_format(return_date, '%d/%m/%Y') as return_date, return_by,
                   stock_type_code, return_to_stock_no
                   from return_to_stock 
                   where return_to_stock_id = :return_to_stock_id
                   order by return_date";        
         
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(":return_to_stock_id", $data->return_to_stock_id);
         $statement1->execute();

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $statement->fetchAll();
         $rdata['details'] = $statement1->fetch();;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readReturnToStockEdit($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $query = "select issue_transaction_id, issue_id, p.item_id, p.item_name, 
                   uom_code, remaing_issue_qty as qty,
                   return_to_stock_qty, return_to_stock_qty as old_return_to_stock_qty

                   from
       
                   (select issue_id, transaction_id as issue_transaction_id, a.item_id, item_name, uom_code,
                   (a.qty-return_to_stock_qty) as remaing_issue_qty
                   from transaction a
                   join item_master b on a.item_id = b.item_id
                   where issue_id = :issue_id
                   and transaction_type='I'
                   and a.financial_year_id=:financial_year_id) p 

                   left join 

                   (select item_id, return_to_stock_qty
                   from transaction 
                   where return_to_stock_id = :return_to_stock_id
                   and financial_year_id=:financial_year_id
                   and transaction_type='RS') q on p.item_id=q.item_id
                   ";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":issue_id", $data->issue_id);
         $statement->bindParam(":return_to_stock_id", $data->return_to_stock_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();

         $query1 = "select return_to_stock_id, date_format(return_date, '%d/%m/%Y') as return_date,
                   return_by, stock_type_code, return_to_stock_no
                   from return_to_stock 
                   where return_to_stock_id = :return_to_stock_id
                   order by return_date";        
         
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(":return_to_stock_id", $data->return_to_stock_id);
         $statement1->execute();

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $statement->fetchAll();
         $rdata['details'] = $statement1->fetch();;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function returnToStock($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          
          /*for running amount*/
          $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }

          $return_date=implode("-", array_reverse(array_map('trim', explode("/", $m->return_date))));
         //check if any transaction is returned after the given date
         $query="select count(return_to_stock_id) as transaction_no 
                 from return_to_stock 
                 where return_date>:return_date
                 and stock_type_code=:stock_type_code 
                 and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);        
         $statement->setFetchMode(PDO::FETCH_ASSOC);    
         $statement->bindParam(':return_date', $return_date);
         $statement->bindParam(':stock_type_code', $m->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $total_transaction_no=$statement->fetch();

         if($total_transaction_no['transaction_no']==0){//back date return entry restriction
           $objPDO->beginTransaction();
           $dt = date('Y-m-d H:i:s');

           $query = "insert into return_to_stock(financial_year_id, return_to_stock_no, stock_type_code,
                     issue_id,return_date,return_by,
                     creation_date,created_by,modification_date,modified_by)
                     values(:financial_year_id, :return_to_stock_no, :stock_type_code,
                     :issue_id,:return_date,:return_by,
                     :creation_date,:created_by,:modification_date,:modified_by)";
           $statement = $objPDO->prepare($query);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           // $statement->bindParam(":department_id",$m->department_id);
           $statement->bindParam(':return_to_stock_no', $m->return_to_stock_no);
           $statement->bindParam(':stock_type_code', $m->stock_type_code);
           $statement->bindParam(":issue_id",$m->issue_id);
           $statement->bindParam(":return_date",$return_date);
           $statement->bindParam(":return_by",$m->return_by);
           $statement->bindParam(":creation_date",$dt);
           $statement->bindParam(":created_by",$_SESSION['NTC_USER_ID']);
           $statement->bindParam(":modification_date",$dt);
           $statement->bindParam(":modified_by",$_SESSION['NTC_USER_ID']);
           $statement->execute();
           $return_to_stock_id = $objPDO->lastInsertId();

           //insert into transaction
           $query1 = "insert into transaction(financial_year_id, return_to_stock_id, issue_id, 
                      item_id, location, transaction_type, return_to_stock_qty, remarks, transaction_date)
                      values(:financial_year_id, :return_to_stock_id,:issue_id, 
                      :item_id,:location,'RS', :return_to_stock_qty,:remarks, :transaction_date)";
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
             $statement3->bindParam(':transaction_date', $return_date);
             $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement3->execute();
             $qty=$statement3->fetch();

             $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement1->bindParam(':return_to_stock_id', $return_to_stock_id);
             $statement1->bindParam(':issue_id',$value->issue_id);
             $statement1->bindParam(':item_id', $value->item_id);
             $statement1->bindParam(':location', $value->location);
             $statement1->bindParam(':return_to_stock_qty', $value->return_to_stock_qty);
             $statement1->bindParam(':remarks', $value->return_to_stock_remarks);
             $statement1->bindParam(':transaction_date', $return_date);
             $statement1->execute();
             $transaction_id = $objPDO->lastInsertId();
             
              //update stock in hand start
             $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement2->bindParam(':item_id', $value->item_id);
             $statement2->bindParam(':qty', $value->return_to_stock_qty);
             $statement2->execute();
              
             //update transaction table running balance
             $rb=$value->return_to_stock_qty;
             if($qty['qty']==''){
              $rb=$value->return_to_stock_qty;
             }else{
              $rb=$qty['qty']+$value->return_to_stock_qty;
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
             $statement5->bindParam(':transaction_date', $return_date);
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
             $statement6->bindParam(':transaction_date', $return_date);
             $statement6->bindParam(':item_id', $value->item_id);
             $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement6->execute();   

             //update return_to_stock_qty in transaction for issed items(issue_id,item_id)
             $query7 = "update transaction set return_to_stock_qty=return_to_stock_qty+:return_to_stock_qty
                      where transaction_id=:transaction_id";
             $statement7 = $objPDO->prepare($query7);  
             $statement7->bindParam(':transaction_id', $value->transaction_id);
             $statement7->bindParam(':return_to_stock_qty', $value->return_to_stock_qty);
             $statement7->execute();

            }


           $objPDO->commit();

           updateRunningAmount($items_array);

           $data = array();
           $data['status'] = "s";
           return $data;
        }else{
          $data = array();
          $data['status'] = "error";
        }   
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function returnToStockEdit($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for running amount*/
          $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }

           $return_date=implode("-", array_reverse(array_map('trim', explode("/", $m->return_date))));

           $objPDO->beginTransaction();

           $dt = date('Y-m-d H:i:s');

           //read old items
           $query="select transaction_id, item_id, issue_id, return_to_stock_qty, running_balance,
                   transaction_date 
                   from transaction
                   where return_to_stock_id=:return_to_stock_id
                   and transaction_type='RS'";
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':return_to_stock_id', $m->return_to_stock_id);
           $statement->execute();
           $transactions=$statement->fetchAll();

           foreach ($m->materials as $value) {//checking new items with old items
             $ind=0;
             $counter=0;
             foreach ($transactions as $old_value) {
              if($value->item_id==$old_value['item_id']){//update condition
                 $counter=1;//found a match i.e. no need to add item
                //update transaction
                 $diff_qty=$value->return_to_stock_qty - $old_value['return_to_stock_qty'];

                 $query1 = "update transaction set return_to_stock_qty=:return_to_stock_qty,
                            remarks=:remarks,
                            running_balance=running_balance+:running_balance,
                            modification_date=:modification_date,
                            modified_by=:modified_by
                            where transaction_id=:transaction_id";
                 $statement1 = $objPDO->prepare($query1);
                 $statement1->bindParam(':return_to_stock_qty', $value->return_to_stock_qty);
                 $statement1->bindParam(':remarks', $value->return_to_stock_remarks);
                 $statement1->bindParam(':running_balance', $diff_qty);
                 $statement1->bindParam(':modification_date', $dt);
                 $statement1->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
                 $statement1->bindParam(':transaction_id', $old_value['transaction_id']);
                 $statement1->execute();
                  
                 //update stock in hand start
                 $query2 = "update stock_in_hand set qty=qty+:qty
                            where item_id=:item_id
                            and financial_year_id=:financial_year_id";
                 $statement2 = $objPDO->prepare($query2); 
                 $statement2->bindParam(':qty', $diff_qty);
                 $statement2->bindParam(':item_id', $value->item_id);
                 $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement2->execute();

                 //update transaction return_to_stock_qty(to restrict return qty can't be greater than receive qty)
                 $query3="update transaction 
                          set return_to_stock_qty=return_to_stock_qty+:return_to_stock_qty
                          where transaction_id=:transaction_id";
                 $statement3 = $objPDO->prepare($query3);   
                 $statement3->bindParam(':transaction_id', $value->issue_transaction_id);
                 $statement3->bindParam(':return_to_stock_qty', $diff_qty);
                 $statement3->execute(); 

                 //update running balace of every transaction of this item after this transaction date
                 /*update condition1*/
                 $query4="update transaction 
                        set running_balance=running_balance+:running_balance
                        where transaction_date=:transaction_date
                        and item_id=:item_id
                        and transaction_id>:transaction_id
                        and financial_year_id=:financial_year_id";
                 $statement4 = $objPDO->prepare($query4); 
                 $statement4->bindParam(':running_balance', $diff_qty);
                 $statement4->bindParam(':transaction_date', $return_date);
                 $statement4->bindParam(':item_id', $value->item_id);
                 $statement4->bindParam(':transaction_id', $old_value['transaction_id']);
                 $statement4->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement4->execute();
                 
                 /*update condition2*/
                 $query5="update transaction 
                        set running_balance=running_balance+:running_balance
                        where transaction_date>:transaction_date
                        and item_id=:item_id
                        and financial_year_id=:financial_year_id";
                 $statement5 = $objPDO->prepare($query5);  
                 $statement5->bindParam(':running_balance', $diff_qty);
                 $statement5->bindParam(':transaction_date', $return_date);
                 $statement5->bindParam(':item_id', $value->item_id);
                 $statement5->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement5->execute();

                 array_splice($transactions, $ind, 1);//removing element from old item array
              }
              $ind++;
             }
             if($counter==0){//no match with old items i.e. new item to be inserted in the transaction table
                  //update transaction table running balance for this transaction
                 $qty=array();
                 $query3="select running_balance as qty from transaction
                          where item_id=:item_id
                          and transaction_date<=:transaction_date
                          and financial_year_id=:financial_year_id
                          order by transaction_date desc,transaction_id desc limit 1";
                 $statement3 = $objPDO->prepare($query3);
                 $statement3->setFetchMode(PDO::FETCH_ASSOC);    
                 $statement3->bindParam(':item_id', $value->item_id);
                 $statement3->bindParam(':transaction_date', $return_date);
                 $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement3->execute();
                 $qty=$statement3->fetch();  

                 //insert into transaction
                 $query1 = "insert into transaction(financial_year_id, return_to_stock_id, issue_id, 
                      item_id, location, transaction_type, return_to_stock_qty, remarks, transaction_date)
                      values(:financial_year_id, :return_to_stock_id,:issue_id, 
                      :item_id,:location,'RS', :return_to_stock_qty,:remarks, :transaction_date)";
                 $statement1 = $objPDO->prepare($query1);

                 $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement1->bindParam(':return_to_stock_id', $m->return_to_stock_id);
                 $statement1->bindParam(':issue_id',$value->issue_id);
                 $statement1->bindParam(':item_id', $value->item_id);
                 $statement1->bindParam(':location', $value->location);
                 $statement1->bindParam(':return_to_stock_qty', $value->return_to_stock_qty);
                 $statement1->bindParam(':remarks', $value->return_to_stock_remarks);
                 $statement1->bindParam(':transaction_date', $return_date);
                 $statement1->execute();
                 $transaction_id = $objPDO->lastInsertId();

                 //update stock in hand start
                 $query2 = "update stock_in_hand set qty=qty+:qty
                           where item_id=:item_id
                           and financial_year_id=:financial_year_id";
                 $statement2 = $objPDO->prepare($query2);      
                 $statement2->bindParam(':item_id', $value->item_id);
                 $statement2->bindParam(':qty', $value->return_to_stock_qty);
                 $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement2->execute(); 
                                 
                 //update transaction table running balance
                 $query4="update transaction 
                          set running_balance=:running_balance
                          where transaction_id=:transaction_id";
                 $statement4 = $objPDO->prepare($query4); 
                 $rb=$value->return_to_stock_qty;
                 if($qty['qty']==''){
                  $rb=-$value->return_to_stock_qty;
                 }else{
                  $rb=$qty['qty']+$value->return_to_stock_qty;
                 }

                 $statement4->bindParam(':transaction_id', $transaction_id);
                 $statement4->bindParam(':running_balance', $rb);
                 $statement4->execute();     
                 
                 //update running balace of every transaction of this item after this transaction date
                 /*update condition1*/
                 $query6="update transaction 
                        set running_balance=running_balance+:running_balance
                        where transaction_date=:transaction_date
                        and item_id=:item_id
                        and transaction_id>:transaction_id
                        and financial_year_id=:financial_year_id";
                 $statement6 = $objPDO->prepare($query6); 
                 $statement6->bindParam(':running_balance', $value->return_to_stock_qty);
                 $statement6->bindParam(':transaction_date', $return_date);
                 $statement6->bindParam(':item_id', $value->item_id);
                 $statement6->bindParam(':transaction_id', $transaction_id);
                 $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement6->execute(); 
                 
                 /*update condition2*/
                 $query7="update transaction 
                        set running_balance=running_balance+:running_balance
                        where transaction_date>:transaction_date
                        and item_id=:item_id
                        and financial_year_id=:financial_year_id";
                 $statement7 = $objPDO->prepare($query7); 
                 $statement7->bindParam(':running_balance', $value->return_to_stock_qty);
                 $statement7->bindParam(':transaction_date', $return_date);
                 $statement7->bindParam(':item_id', $value->item_id);
                 $statement7->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement7->execute(); 

                 //update return_to_stock_qty in transaction for issed items(issue_id,item_id)
                 $query8 = "update transaction 
                           set return_to_stock_qty=return_to_stock_qty+:return_to_stock_qty
                           where transaction_id=:transaction_id";
                 $statement8 = $objPDO->prepare($query8);  
                 $statement8->bindParam(':transaction_id', $value->issue_transaction_id);
                 $statement8->bindParam(':return_to_stock_qty', $value->return_to_stock_qty);
                 $statement8->execute();
             }
           }

           if(sizeof($transactions)>0){//old items deleted from transaction 
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
                         and item_id=:item_id
                         and transaction_id>:transaction_id
                         and financial_year_id=:financial_year_id";
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':running_balance', $old_value['return_to_stock_qty']);
               $statement->bindParam(':transaction_date', $old_value['transaction_date']);
               $statement->bindParam(':item_id', $old_value['item_id']);
               $statement->bindParam(':transaction_id', $old_value['transaction_id']);
               $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement->execute();
               
               /*update condition2*/
               $query = "update transaction set running_balance=running_balance-:running_balance
                         where transaction_date>:transaction_date
                         and item_id=:item_id
                         and financial_year_id=:financial_year_id";
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':running_balance', $old_value['return_to_stock_qty']);
               $statement->bindParam(':transaction_date', $old_value['transaction_date']);
               $statement->bindParam(':item_id', $old_value['item_id']);
               $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement->execute();


               //update stock in hand
               $query = "update stock_in_hand set qty=qty-:qty
                         where item_id=:item_id
                         and financial_year_id=:financial_year_id";
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':qty', $old_value['return_to_stock_qty']);
               $statement->bindParam(':item_id', $old_value['item_id']);
               $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement->execute();

               //update return_to_stock_qty in transaction for issed items(issue_id,item_id)
                 $query8 = "update transaction 
                           set return_to_stock_qty=return_to_stock_qty-:return_to_stock_qty
                           where issue_id=:issue_id
                           and item_id=:item_id
                           and transaction_type='I'
                           and financial_year_id=:financial_year_id";
                 $statement8 = $objPDO->prepare($query8);  
                 $statement8->bindParam(':return_to_stock_qty', $old_value['return_to_stock_qty']);
                 $statement8->bindParam(':issue_id', $old_value['issue_id']);
                 $statement8->bindParam(':item_id', $old_value['item_id']);
                 $statement8->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement8->execute();
                    
            }
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

   
   public function deleteReturnToStock($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $items_array = array();

         $objPDO->beginTransaction();

         $query="select transaction_id, issue_id, item_id, return_to_stock_qty as qty, running_balance, transaction_date
                 from transaction
                 where return_to_stock_id=:return_to_stock_id
                 and transaction_type='RS'";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':return_to_stock_id', $data->return_to_stock_id);
         $statement->execute();
         $transactions=$statement->fetchAll();

          foreach ($transactions as $old_value) {
            $items_array[] = $old_value['item_id'];
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

             //update return_to_stock_qty in transaction for issed items(issue_id,item_id)
             $query7 = "update transaction set return_to_stock_qty=return_to_stock_qty-:return_to_stock_qty
                        where issue_id=:issue_id
                        and item_id=:item_id
                        and transaction_type='I'";
             $statement7 = $objPDO->prepare($query7);  
             $statement7->bindParam(':issue_id', $old_value['issue_id']);
             $statement7->bindParam(':item_id', $old_value['item_id']);
             $statement7->bindParam(':return_to_stock_qty', $old_value['qty']);
             $statement7->execute();
             
          }

          $query = "delete from return_to_stock
                    where return_to_stock_id = :return_to_stock_id";
          $statement = $objPDO->prepare($query);
          $statement->bindParam(":return_to_stock_id", $data->return_to_stock_id);
          $statement->execute();
          
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

 

}
?>
