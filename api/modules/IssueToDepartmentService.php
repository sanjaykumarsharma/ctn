<?php
require_once 'conf.php';
require_once 'RunningAmountService.php';
class IssueToDepartmentService{
  
  public function readIssueNumber($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select max(issue_no) as issue_no
                   from issue_to_department 
                   where stock_type_code = :stock_type_code
                   and financial_year_id=:financial_year_id";         
         
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $issue_no=$statement->fetch();
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['issue_no'] = $issue_no['issue_no']+1;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
  public function readIssuedItems($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          
         if($data->stock_type_code=='all'){
            $query = "select issue_id, issue_no, stock_type_code, department,
                   date_format(issue_date, '%d/%m/%Y') as issue_date,
                   approve_by, receive_by, requisition_no, stock_adjustment, remarks   
                   from issue_to_department a
                   join department_master b on a.department_id=b.department_id
                   where financial_year_id=:financial_year_id
                   order by issue_id desc";         

           
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         }else{
           $query = "select issue_id, issue_no, stock_type_code, department,
                   date_format(issue_date, '%d/%m/%Y') as issue_date,
                   approve_by, receive_by, requisition_no, stock_adjustment, remarks   
                   from issue_to_department a
                   join department_master b on a.department_id=b.department_id
                   where stock_type_code = :stock_type_code
                   and financial_year_id=:financial_year_id
                   order by issue_id desc";         

           
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

  public function addIssueToDepartment($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for running amount*/
         $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }
         
         $issue_date=implode("-", array_reverse(array_map('trim', explode("/", $m->issue_date))));
         //check if any transaction is issued after the given date
         $query="select count(issue_id) as transaction_no 
                 from issue_to_department 
                 where issue_date>:issue_date
                 and stock_type_code=:stock_type_code 
                 and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);        
         $statement->setFetchMode(PDO::FETCH_ASSOC);    
         $statement->bindParam(':issue_date', $issue_date);
         $statement->bindParam(':stock_type_code', $m->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $total_transaction_no=$statement->fetch();

         if($total_transaction_no['transaction_no']==0){////back date issue entry restriction
         $objPDO->beginTransaction();

         $dt = date('Y-m-d H:i:s');

         $query = "Insert into issue_to_department (financial_year_id, issue_no, stock_type_code,
                   issue_date, remarks, department_id,
                   approve_by, receive_by, requisition_no, stock_adjustment,
                   creation_date, created_by, modification_date, modified_by)
                   values (:financial_year_id, :issue_no, :stock_type_code,
                   :issue_date, :remarks, :department_id,
                   :approve_by, :receive_by, :requisition_no, :stock_adjustment, :dt, :user, :dt, :user)";

         $statement = $objPDO->prepare($query);         
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->bindParam(':issue_no', $m->issue_no);
         $statement->bindParam(':stock_type_code', $m->stock_type_code);
         $statement->bindParam(':issue_date', $issue_date);
         $statement->bindParam(':remarks', $m->remarks);
         $statement->bindParam(':department_id', $m->department_id);
         $statement->bindParam(':approve_by', $m->approve_by);
         $statement->bindParam(':receive_by', $m->receive_by);
         $statement->bindParam(':requisition_no', $m->requisition_no);
         $statement->bindParam(':stock_adjustment', $m->stock_adjustment);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $issue_id = $objPDO->lastInsertId();

         $query1 = "Insert into transaction(financial_year_id, issue_id, item_id, transaction_type, qty, remarks,
                   charge_head_id, location,  transaction_date,creation_date)
                   values (:financial_year_id, :issue_id , :item_id, 'I', :qty, :remarks,
                   :charge_head_id, :location, :transaction_date,curdate())";         
         $statement1 = $objPDO->prepare($query1);

         //update stock in hand start
         $query2 = "update stock_in_hand set qty=qty-:qty
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
           $statement3->bindParam(':transaction_date', $issue_date);
           $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement3->execute();
           $qty=$statement3->fetch();


           /*calculate weighted avg  rate of item start*/
           /*$qry="select qty, rate, transaction_type
                 from transactions
                 where item_id=:item_id
                 and financial_year_id=:financial_year_id
                 order by transaction_date desc";
           $stmt = $objPDO->prepare($qry);
           $stmt->setFetchMode(PDO::FETCH_ASSOC);
           $stmt->bindParam(':item_id', $value->item_id);
           $stmt->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $stmt->execute();
           $rates=$stmt->fetchAll();*/

           /*calculate weighted avg  rate of item end*/
           
           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->bindParam(':issue_id', $issue_id);
           $statement1->bindParam(':item_id', $value->item_id);
           $statement1->bindParam(':qty', $value->qty);
           $statement1->bindParam(':remarks', $value->remarks);
           $statement1->bindParam(':charge_head_id', $value->chargehead_id);
           $statement1->bindParam(':location', $value->location);
           $statement1->bindParam(':transaction_date', $issue_date);
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
            $rb=-$value->qty;
           }else{
            $rb=$qty['qty']-$value->qty;
           }

           $statement4->bindParam(':transaction_id', $transaction_id);
           $statement4->bindParam(':running_balance', $rb);
           $statement4->execute();   

           //update running balace of every transaction of this item after this transaction date
           /*update condition1*/
           $query7="update transaction 
                  set running_balance=running_balance-:running_balance
                  where transaction_date=:transaction_date
                  and item_id=:item_id
                  and transaction_id>:transaction_id
                  and financial_year_id=:financial_year_id";
           $statement7 = $objPDO->prepare($query7); 
           $statement7->bindParam(':running_balance', $value->qty);
           $statement7->bindParam(':transaction_date', $issue_date);
           $statement7->bindParam(':item_id', $value->item_id);
           $statement7->bindParam(':transaction_id', $transaction_id);
           $statement7->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement7->execute();

           /*update condition2*/
           $query8="update transaction 
                  set running_balance=running_balance-:running_balance
                  where transaction_date>:transaction_date
                  and item_id=:item_id
                  and financial_year_id=:financial_year_id";
           $statement8 = $objPDO->prepare($query8); 
           $statement8->bindParam(':running_balance', $value->qty);
           $statement8->bindParam(':transaction_date', $issue_date);
           $statement8->bindParam(':item_id', $value->item_id);
           $statement8->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement8->execute();   
         }

         $objPDO->commit();

         updateRunningAmount($items_array);   

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

   public function readIssueToDepartment($data) {
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
                  and financial_year_id=:financial_year_id
                  order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":item_group_code", $data->item_group_code);
         $statement->bindParam(":category_code", $data->category_code);
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

   public function readItemsForIssueEdit($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select issue_id, transaction_id, a.item_id, charge_head_id as chargehead_id,
                   item_name, uom_code,
                   max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty, a.remarks
                   from transaction a
                   join item_master b on a.item_id = b.item_id
                   join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                   where issue_id = :issue_id
                   and transaction_type='I'
                   and a.financial_year_id=:financial_year_id
                   order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":issue_id", $data->issue_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();

         $query1 = "select issue_no, stock_type_code,
                    date_format(issue_date, '%d/%m/%Y') as issue_date, 
                    department_id, approve_by, receive_by, requisition_no, stock_adjustment, remarks
                    from issue_to_department
                    where issue_id = :issue_id";
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(":issue_id", $data->issue_id);
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

         $query = "select a.item_id, chargehead,
                   item_name, uom_code,
                   max_level, min_level, c.qty as stock, a.qty, a.qty as prev_qty, a.remarks
                   from transaction a
                   join item_master b on a.item_id = b.item_id
                   join stock_in_hand c on (a.item_id=c.item_id and a.financial_year_id=c.financial_year_id)
                   join chargehead_master d on a.charge_head_id=d.chargehead_id
                   where issue_id = :issue_id
                   and a.financial_year_id=:financial_year_id
                   order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":issue_id", $data->issue_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();

         $query1 = "select issue_no, stock_type_code,
                    date_format(issue_date, '%d/%m/%Y') as issue_date, 
                    department, approve_by, receive_by, requisition_no, stock_adjustment, remarks
                    from issue_to_department a
                    join department_master b on a.department_id=b.department_id 
                    where issue_id = :issue_id";
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(":issue_id", $data->issue_id);
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

   public function editIssueToDepartment($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for running amount*/
         $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }
         
         $objPDO->beginTransaction();

         $dt = date('Y-m-d H:i:s');

         $query = "update issue_to_department set remarks=:remarks,
                   department_id=:department_id,
                   approve_by=:approve_by,
                   receive_by=:receive_by,
                   requisition_no=:requisition_no,
                   stock_adjustment=:stock_adjustment,
                   modification_date=:dt,
                   modified_by=:user
                   where issue_id=:issue_id";

         $statement = $objPDO->prepare($query);         
         
         $issue_date=implode("-", array_reverse(array_map('trim', explode("/", $m->issue_date))));
         // $statement->bindParam(':issue_date', $issue_date);
         $statement->bindParam(':remarks', $m->remarks);
         $statement->bindParam(':department_id', $m->department_id);
         $statement->bindParam(':approve_by', $m->approve_by);
         $statement->bindParam(':receive_by', $m->receive_by);
         $statement->bindParam(':requisition_no', $m->requisition_no);
         $statement->bindParam(':stock_adjustment', $m->stock_adjustment);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':issue_id', $m->issue_id);
         $statement->execute();

         $query1 = "update transaction set qty=:qty,
                    remarks=:remarks,
                    charge_head_id=:charge_head_id,
                    location=:location
                    where transaction_id=:transaction_id";         
         $statement1 = $objPDO->prepare($query1);

         //update stock in hand start
         $query2 = "update stock_in_hand set qty=qty-:qty
                    where item_id=:item_id
                    and financial_year_id=:financial_year_id";
         $statement2 = $objPDO->prepare($query2);     

         //update transaction table running balance
         $query4="update transaction 
                  set running_balance=running_balance-:running_balance
                  where transaction_id=:transaction_id";
         $statement4 = $objPDO->prepare($query4); 

         foreach ($m->materials as $value) {
           $statement1->bindParam(':qty', $value->qty);
           $statement1->bindParam(':remarks', $value->remarks);
           $statement1->bindParam(':charge_head_id', $value->chargehead_id);
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
                  set running_balance=running_balance-:running_balance
                  where transaction_date=:transaction_date
                  and item_id=:item_id
                  and transaction_id>:transaction_id
                  and financial_year_id=:financial_year_id";
           $statement5 = $objPDO->prepare($query5); 
           $statement5->bindParam(':running_balance', $diff_qty);
           $statement5->bindParam(':transaction_date', $issue_date);
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
           $statement6->bindParam(':transaction_date', $issue_date);
           $statement6->bindParam(':item_id', $value->item_id);
           $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement6->execute();
           
         }

         /********************************new items strat***************************************/
         $query1 = "Insert into transaction(financial_year_id, issue_id, item_id, transaction_type, qty, remarks,
                   charge_head_id, location,  transaction_date, creation_date)
                   values (:financial_year_id, :issue_id , :item_id, 'I', :qty, :remarks,
                   :charge_head_id, :location, :transaction_date,curdate())";         
         $statement1 = $objPDO->prepare($query1);

         //update stock in hand start
         $query2 = "update stock_in_hand set qty=qty-:qty
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

         foreach ($m->new_materials as $value) {
           //reading running balance of same item on last transaction date
           $statement3->bindParam(':item_id', $value->item_id);
           $statement3->bindParam(':transaction_date', $issue_date);
           $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement3->execute();
           $qty=$statement3->fetch();
           
           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->bindParam(':issue_id', $m->issue_id);
           $statement1->bindParam(':item_id', $value->item_id);
           $statement1->bindParam(':qty', $value->qty);
           $statement1->bindParam(':remarks', $value->remarks);
           $statement1->bindParam(':charge_head_id', $value->chargehead_id);
           $statement1->bindParam(':location', $value->location);
           $statement1->bindParam(':transaction_date', $issue_date);
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
            $rb=-$value->qty;
           }else{
            $rb=$qty['qty']-$value->qty;
           }

           $statement4->bindParam(':transaction_id', $transaction_id);
           $statement4->bindParam(':running_balance', $rb);
           $statement4->execute();   

           //update running balace of every transaction of this item after this transaction date
           /*update condition1*/
           $query7="update transaction 
                  set running_balance=running_balance-:running_balance
                  where transaction_date=:transaction_date
                  and item_id=:item_id
                  and transaction_id>:transaction_id
                  and financial_year_id=:financial_year_id";
           $statement7 = $objPDO->prepare($query7); 
           $statement7->bindParam(':running_balance', $value->qty);
           $statement7->bindParam(':transaction_date', $issue_date);
           $statement7->bindParam(':item_id', $value->item_id);
           $statement7->bindParam(':transaction_id', $transaction_id);
           $statement7->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement7->execute();

           /*update condition2*/
           $query8="update transaction 
                  set running_balance=running_balance-:running_balance
                  where transaction_date>:transaction_date
                  and item_id=:item_id
                  and financial_year_id=:financial_year_id";
           $statement8 = $objPDO->prepare($query8); 
           $statement8->bindParam(':running_balance', $value->qty);
           $statement8->bindParam(':transaction_date', $issue_date);
           $statement8->bindParam(':item_id', $value->item_id);
           $statement8->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement8->execute();   
         }
         /******************************************new items end********************************/

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

   public function deleteIssue($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         /*for running amount*/
         $items_array = array();

         $objPDO->beginTransaction();

         $query="select transaction_id, item_id, qty, running_balance, transaction_date
                 from transaction
                 where issue_id=:issue_id
                 and transaction_type='I'";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':issue_id', $data->issue_id);
         $statement->execute();
         $transactions=$statement->fetchAll();

          foreach ($transactions as $old_value) {
            $items_array [] = $old_value['item_id'];
            //update transaction
             $query = "delete from transaction 
                       where transaction_id=:transaction_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':transaction_id', $old_value['transaction_id']);
             $statement->execute();
             
             //update transaction and running balance of item after this transaction date
             /*update condition1*/
             $query = "update transaction set running_balance=running_balance+:running_balance
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
             $query = "update transaction set running_balance=running_balance+:running_balance
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
             $query = "update stock_in_hand set qty=qty+:qty
                        where item_id=:item_id
                        and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':qty', $old_value['qty']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement->execute();
             
          }

          $query = "delete from issue_to_department
                    where issue_id = :issue_id";
          $statement = $objPDO->prepare($query);
          $statement->bindParam(":issue_id", $data->issue_id);
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
