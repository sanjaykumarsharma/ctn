<?php
require_once 'conf.php';
require_once 'RunningAmountService.php';
class RejectToPartyService{

  public function readDocketToReject($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          
         //query for getting all docket details 
         $query = "select docket_id, docket_no, po_id, stock_type_code,
                  date_format(docket_date, '%d/%m/%Y') as docket_date, bill_amount,
                  bill_no, date_format(bill_date, '%d/%m/%Y') as bill_date, party_name
                  from docket a
                  join party_master b on a.party_id=b.party_id
                  where stock_type_code = :stock_type_code
                  and financial_year_id=:financial_year_id
                  and docket_id in (select distinct docket_id 
                                    from transaction 
                                    where (qty-reject_to_party_qty)>0
                                    and transaction_type='R'
                                    and financial_year_id=:financial_year_id)
                  order by 1 desc";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":stock_type_code", $d->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();         

          $data = array();
          $data['status'] = "s";
          $data['rejected_dockets'] = $statement->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readRejectedDocket($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        if($d->stock_type_code=='all'){
          $query = "select reject_to_party_id, docket_id, reject_to_party_no, stock_type_code,
                  date_format(reject_date, '%d/%m/%Y') as reject_date, 
                  rejected_by
                  from reject_to_party 
                  where financial_year_id=:financial_year_id
                  order by 1 desc";

         $statement = $objPDO->prepare($query);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        }else{
          $query = "select reject_to_party_id, docket_id, reject_to_party_no, stock_type_code,
                  date_format(reject_date, '%d/%m/%Y') as reject_date, 
                  rejected_by
                  from reject_to_party 
                  where stock_type_code=:stock_type_code
                  and financial_year_id=:financial_year_id
                  order by 1 desc";

         $statement = $objPDO->prepare($query);
         $statement->bindParam(":stock_type_code", $d->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        }
        
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['rejected_dockets'] = $statement->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readDocketDetailsRejectToParty($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $qry1="select max(reject_to_party_no) as reject_to_party_no
               FROM reject_to_party 
               where stock_type_code=:stock_type_code
               and financial_year_id=:financial_year_id";

        $stmt1 = $objPDO->prepare($qry1);
        $stmt1->setFetchMode(PDO::FETCH_ASSOC);
        $stmt1->bindParam(':stock_type_code', $d->stock_type_code);
        $stmt1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        $stmt1->execute();
        $reject_to_party_no=$stmt1->fetch();


                   //date_format(c.creation_date, '%d/%m/%Y') as po_date
         $query = "select a.stock_type_code, a.party_id, a.po_id, party_name, docket_no, 
                   date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                   date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no,
                   date_format(challan_date, '%d/%m/%Y') as challan_date, transporter_name, 
                   transpotation_mode, vehicle_no, lr_no,
                   sub_total_amount, freight_charge, bill_amount, a.remarks
                   from docket a
                   join party_master b on a.party_id=b.party_id
                   where docket_id=:docket_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":docket_id", $d->docket_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetch();
         
         $query = "select stock_type_code, po_no, date_format(po_date, '%d/%m/%Y') as po_date
                   from purchase_order
                   where po_id in (".$details['po_id'].")";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":docket_id", $d->docket_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $poNos=$statement->fetchAll();
          
         $pono='';
          $poDate='';
          foreach ($poNos as $key => $value) {
            if($pono==''){
              $pono=$value['stock_type_code'].'-'.$value['po_no'];
            }else{
              $pono=$pono.','.$value['stock_type_code'].'-'.$value['po_no'];
            }

            if($poDate==''){
              $poDate=$value['po_date'];
            }else{
              $poDate=$poDate.','.$value['po_date'];
            }
            
          }
          $details['po_no']=$pono;
          $details['po_date']=$poDate;
         
        //materials 
         $query = "select transaction_id, a.item_id, item_name, uom_code, a.location,  
                   (qty-reject_to_party_qty) as qty, rate
                   from transaction a 
                   join item_master b on a.item_id=b.item_id
                   where docket_id=:docket_id
                   and (qty-reject_to_party_qty)>0
                   and transaction_type='R'
                   order by 1";
                           
         $val=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':docket_id', $d->docket_id);
         $statement->execute();
         $items=$statement->fetchAll();

        $data = array();
        $data['status'] = "s";
        $data['details'] = $details;
        $data['items'] = $items;
        $data['reject_to_party_no'] = $reject_to_party_no['reject_to_party_no']+1;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readRjectedDocketDetailsEdit($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select a.stock_type_code, a.party_id, a.po_id, party_name, docket_no, 
                   date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                   date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no,
                   date_format(challan_date, '%d/%m/%Y') as challan_date, transporter_name, 
                   transpotation_mode, vehicle_no, lr_no,
                   sub_total_amount, freight_charge, bill_amount, a.remarks
                   from docket a
                   join party_master b on a.party_id=b.party_id
                   where docket_id=:docket_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":docket_id", $d->docket_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetch();

         $qry="select po_no, date_format(po_date, '%d/%m/%Y') as po_date
                from purchase_order
                where po_id in(".$details['po_id'].")";
          $stmt = $objPDO->prepare($qry);
          $stmt->setFetchMode(PDO::FETCH_ASSOC);
          $stmt->bindParam(':po_id', $details['po_id']);
          $stmt->execute();
          $poNos=$stmt->fetchAll();
          $pono='';
          $poDate='';
          foreach ($poNos as $key => $value) {
            if($pono==''){
              $pono=$value['po_no'];
            }else{
              $pono=$pono.','.$value['po_no'];
            }

            if($poDate==''){
              $poDate=$value['po_date'];
            }else{
              $poDate=$poDate.','.$value['po_date'];
            }
            
          }
          $details['po_no']=$pono;
          $details['po_date']=$poDate;


         $query = "select reject_to_party_no, stock_type_code, docket_id, 
                  date_format(reject_date, '%d/%m/%Y') as reject_date, transporter_name, lr_no, 
                  vehicle_no,mode_of_transport, rejected_by
                  from reject_to_party 
                  where reject_to_party_id=:reject_to_party_id
                  and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->bindParam(":reject_to_party_id", $d->reject_to_party_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $detailsRP=$statement->fetch();
         
        //materials 
         $query = "select p.transaction_id, p.item_id, p.item_name, uom_code, location, 
                   remaing_docket_qty as qty, rate, reject_to_party_qty, 
                   reject_to_party_qty as reject_to_party_qty_old, checked, reject_to_party_remarks

                   from

                   (select transaction_id , a.item_id, item_name, uom_code, a.location,  
                   (qty-reject_to_party_qty) as remaing_docket_qty, rate
                   from transaction a 
                   join item_master b on a.item_id=b.item_id
                   where docket_id=:docket_id
                   and transaction_type='R') p

                   left join 

                   (select transaction_id, reject_to_party_qty, item_id, 'true' as checked, reject_to_party_remarks
                   from transaction 
                   where reject_to_party_id=:reject_to_party_id
                   and transaction_type='RP'
                   and docket_id=:docket_id)q on p.item_id=q.item_id

                   ";
                           
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':docket_id', $d->docket_id);
         $statement->bindParam(':reject_to_party_id', $d->reject_to_party_id);
         $statement->execute();
         $items=$statement->fetchAll();

        $data = array();
        $data['status'] = "s";
        $data['details'] = $details;
        $data['detailsRP'] = $detailsRP;
        $data['items'] = $items;
        return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function readDocketDetails($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         //details
         $query = "select a.stock_type_code, reject_to_party_no, b.party_id, b.po_id,
                   party_name, docket_no, 
                  date_format(reject_date, '%d/%m/%Y') as reject_date,
                  date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                  date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no,
                  date_format(challan_date, '%d/%m/%Y') as challan_date, 
                  a.transporter_name, a.mode_of_transport, a.vehicle_no, a.lr_no
                  from reject_to_party a
                  join docket b on (a.docket_id=b.docket_id and a.financial_year_id=b.financial_year_id)
                  join party_master d on b.party_id=d.party_id
                  where reject_to_party_id=:reject_to_party_id";
                           
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":reject_to_party_id", $d->reject_to_party_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetch();


         $qry="select po_no, date_format(po_date, '%d/%m/%Y') as po_date
                from purchase_order
                where po_id in(".$details['po_id'].")";
          $stmt = $objPDO->prepare($qry);
          $stmt->setFetchMode(PDO::FETCH_ASSOC);
          $stmt->bindParam(':po_id', $details['po_id']);
          $stmt->execute();
          $poNos=$stmt->fetchAll();

         $pono='';
          $poDate='';
          foreach ($poNos as $key => $value) {
            if($pono==''){
              $pono=$value['po_no'];
            }else{
              $pono=$pono.','.$value['po_no'];
            }

            if($poDate==''){
              $poDate=$value['po_date'];
            }else{
              $poDate=$poDate.','.$value['po_date'];
            }
            
          }
          $details['po_no']=$pono;
          $details['po_date']=$poDate;
         
         //items
         $items=array();
         $query1 = "select b.item_id, item_name, uom_code, b.location, qty, rate, 
                    reject_to_party_qty, reject_to_party_remarks
                    from transaction b 
                    join item_master c on b.item_id=c.item_id
                    where reject_to_party_id=:reject_to_party_id
                    and transaction_type='RP'
                    order by 1";
         $statement1 = $objPDO->prepare($query1);
         $statement1->bindParam(":reject_to_party_id", $d->reject_to_party_id);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->execute();

          $data = array();
          $data['status'] = "s";
          $data['dockets']['details'] = $details;
          $data['dockets']['items'] = $statement1->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function rejectToParty($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for running amount*/
         $items_array = array();
         foreach ($m->materials as $v){
           $items_array[] = $v->item_id;
         }

         $docket_date=implode("-", array_reverse(array_map('trim', explode("/", $m->docket_date))));
         $reject_date=implode("-", array_reverse(array_map('trim', explode("/", $m->reject_date))));

         $query="select count(reject_to_party_id) as r_no 
                 from reject_to_party 
                 where reject_date>:reject_date 
                 and stock_type_code=:stock_type_code
                 and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);        
         $statement->setFetchMode(PDO::FETCH_ASSOC);    
         $statement->bindParam(':reject_date', $reject_date);
         $statement->bindParam(':stock_type_code', $m->reject_to_party_stock_type);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $total_r_no=$statement->fetch();

        if($total_r_no['r_no']==0){// any reject_to_party with older date not allowed for same stock type 

         $datetime1 = new DateTime($docket_date);
         $datetime2 = new DateTime($reject_date);
         $interval = $datetime1->diff($datetime2);
         $day=$interval->format('%R%d');
         if($day>=0){
           $objPDO->beginTransaction();

           $dt = date('Y-m-d H:i:s');

           $query = "insert into reject_to_party( financial_year_id, reject_to_party_no, stock_type_code,
                     docket_id, reject_date, rejected_by,
                     transporter_name, lr_no, vehicle_no, mode_of_transport,
                     creation_date)
                     values(:financial_year_id, :reject_to_party_no, :stock_type_code,
                     :docket_id, :reject_date, :rejected_by,
                     :transporter_name, :lr_no, :vehicle_no, :mode_of_transport,
                     curdate())";
           $statement = $objPDO->prepare($query);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->bindParam(":reject_to_party_no",$m->reject_to_party_no);
           $statement->bindParam(":stock_type_code",$m->reject_to_party_stock_type);
           $statement->bindParam(":docket_id",$m->reject_docket_id);
           $statement->bindParam(":reject_date",$reject_date);
           $statement->bindParam(":rejected_by",$m->rejected_by);
           $statement->bindParam(":transporter_name",$m->transporter_name);
           $statement->bindParam(":lr_no",$m->lr_no);
           $statement->bindParam(":vehicle_no",$m->vehicle_no);
           $statement->bindParam(":mode_of_transport",$m->mode_of_transport);
           $statement->execute();
           $reject_to_party_id = $objPDO->lastInsertId();

           //insert into transaction
           $query1 = "insert into transaction( financial_year_id, reject_to_party_id, docket_id, 
                      item_id, location, transaction_type, transaction_date, rate, reject_to_party_qty, reject_to_party_remarks)
                      values(:financial_year_id, :reject_to_party_id,:docket_id, 
                      :item_id,:location,'RP',:transaction_date, :rate, :reject_to_party_qty,:reject_to_party_remarks)";
           $statement1 = $objPDO->prepare($query1);

           //update stock in hand start
           $query2 = "update stock_in_hand set qty=qty-:qty
                      where item_id=:item_id
                      and financial_year_id=:financial_year_id";
           $statement2 = $objPDO->prepare($query2);     

           //update transaction table running balance for this transaction
           $query3="select running_balance as qty from transaction
                    where item_id=:item_id
                    and transaction_date<=:transaction_date
                    and financial_year_id=:financial_year_id
                    order by transaction_date desc,transaction_id desc limit 1";
           $statement3 = $objPDO->prepare($query3);
           $statement3->setFetchMode(PDO::FETCH_ASSOC);                       

           $query4="update transaction 
                    set running_balance=:running_balance
                    where transaction_id=:transaction_id";
           $statement4 = $objPDO->prepare($query4); 
           
           //update transaction reject_to_party_qty(to restrict return qty can't be greater than receive qty)
           $query5="update transaction 
                    set reject_to_party_qty=reject_to_party_qty+:reject_to_party_qty
                    where transaction_id=:transaction_id";
           $statement5 = $objPDO->prepare($query5);   

           //update running balace of every transaction of this item after this transaction date
           /*update condition1*/
           $query6="update transaction 
                  set running_balance=running_balance-:running_balance
                  where transaction_date=:transaction_date
                  and item_id=:item_id
                  and transaction_id>:transaction_id
                  and financial_year_id=:financial_year_id";
           $statement6 = $objPDO->prepare($query6); 
           
           /*update condition2*/
           $query7="update transaction 
                  set running_balance=running_balance-:running_balance
                  where transaction_date>:transaction_date
                  and item_id=:item_id
                  and financial_year_id=:financial_year_id";
           $statement7 = $objPDO->prepare($query7); 
           
           
            foreach ($m->materials as $value) {
              $qty=array();
             //reading running balance of same item on last transaction date 
             $statement3->bindParam(':item_id', $value->item_id);
             $statement3->bindParam(':transaction_date', $reject_date);
             $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement3->execute();
             $qty=$statement3->fetch();


             $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement1->bindParam(':reject_to_party_id', $reject_to_party_id);
             $statement1->bindParam(':docket_id', $m->reject_docket_id);
             $statement1->bindParam(':item_id', $value->item_id);
             $statement1->bindParam(':location', $value->location);
             $statement1->bindParam(':transaction_date', $reject_date);
             $statement1->bindParam(':rate', $value->rate);
             $statement1->bindParam(':reject_to_party_qty', $value->reject_to_party_qty);
             $statement1->bindParam(':reject_to_party_remarks', $value->reject_to_party_remarks);
             $statement1->execute();
             $transaction_id = $objPDO->lastInsertId();
             
              //update stock in hand start
             $statement2->bindParam(':item_id', $value->item_id);
             $statement2->bindParam(':qty', $value->reject_to_party_qty);
             $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement2->execute();

             //update transaction table running balance
             $rb=$value->reject_to_party_qty;
             if($qty['qty']==''){
              $rb=-$value->reject_to_party_qty;
             }else{
              $rb=$qty['qty']-$value->reject_to_party_qty;
             }

             $statement4->bindParam(':transaction_id', $transaction_id);
             $statement4->bindParam(':running_balance', $rb);
             $statement4->execute();     

             //update transaction reject_to_party_qty(to restrict return qty can't be greater than receive qty)
             $statement5->bindParam(':transaction_id', $value->transaction_id);
             $statement5->bindParam(':reject_to_party_qty', $value->reject_to_party_qty);
             $statement5->execute(); 
             
             //update running balace of every transaction of this item after this transaction date
             $statement6->bindParam(':running_balance', $value->reject_to_party_qty);
             $statement6->bindParam(':transaction_date', $reject_date);
             $statement6->bindParam(':item_id', $value->item_id);
             $statement6->bindParam(':transaction_id', $transaction_id);
             $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement6->execute(); 

             $statement7->bindParam(':running_balance', $value->reject_to_party_qty);
             $statement7->bindParam(':transaction_date', $reject_date);
             $statement7->bindParam(':item_id', $value->item_id);
             $statement7->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement7->execute(); 

            }


           $objPDO->commit();

           updateRunningAmount($items_array); 

           $data = array();
           $data['status'] = "s";
         }else{
           $data = array();
           $data['status'] = "date_error";//docket_date>reject_date
         }
        }else{
          $data = array();
           $data['status'] = "date_error_1";
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

   public function rejectToPartyEdit($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for running amount*/
         $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }

           $reject_date=implode("-", array_reverse(array_map('trim', explode("/", $m->reject_date))));

           $objPDO->beginTransaction();

           $dt = date('Y-m-d H:i:s');

           $query = "update reject_to_party set transporter_name=:transporter_name,
                    lr_no=:lr_no,
                    vehicle_no=:vehicle_no,
                    mode_of_transport=:mode_of_transport,
                    modification_date=:modification_date
                    where reject_to_party_id=:reject_to_party_id";
           $statement = $objPDO->prepare($query);
           $statement->bindParam(":transporter_name",$m->transporter_name);
           $statement->bindParam(":lr_no",$m->lr_no);
           $statement->bindParam(":vehicle_no",$m->vehicle_no);
           $statement->bindParam(":mode_of_transport",$m->mode_of_transport);
           $statement->bindParam(":modification_date",$dt);
           $statement->bindParam(':reject_to_party_id', $m->reject_to_party_id);
           $statement->execute();

           //read old items
           $query="select transaction_id,item_id,docket_id,reject_to_party_qty,running_balance,
                   transaction_date 
                   from transaction
                   where reject_to_party_id=:reject_to_party_id
                   and transaction_type='RP'";
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':reject_to_party_id', $m->reject_to_party_id);
           $statement->execute();
           $transactions=$statement->fetchAll();

           foreach ($m->materials as $value) {//checking new items with old items
             $ind=0;
             $counter=0;
             foreach ($transactions as $old_value) {
              if($value->item_id==$old_value['item_id']){//update condition
                 $counter=1;//found a match i.e. no need to add item
                //update transaction
                 $diff_qty=$old_value['reject_to_party_qty']-$value->reject_to_party_qty; 

                 $query1 = "update transaction set reject_to_party_qty=:reject_to_party_qty,
                            reject_to_party_remarks=:reject_to_party_remarks,
                            running_balance=running_balance+:running_balance,
                            modification_date=:modification_date,
                            modified_by=:modified_by
                            where transaction_id=:transaction_id";
                 $statement1 = $objPDO->prepare($query1);
                 $statement1->bindParam(':reject_to_party_qty', $value->reject_to_party_qty);
                 $statement1->bindParam(':reject_to_party_remarks', $value->reject_to_party_remarks);
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

                 //update transaction reject_to_party_qty(to restrict return qty can't be greater than receive qty)
                 $query3="update transaction 
                          set reject_to_party_qty=reject_to_party_qty-:reject_to_party_qty
                          where transaction_id=:transaction_id";
                 $statement3 = $objPDO->prepare($query3);   
                 $statement3->bindParam(':transaction_id', $value->transaction_id);
                 $statement3->bindParam(':reject_to_party_qty', $diff_qty);
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
                 $statement4->bindParam(':transaction_date', $reject_date);
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
                 $statement5->bindParam(':transaction_date', $reject_date);
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
                 $statement3->bindParam(':transaction_date', $reject_date);
                 $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement3->execute();
                 $qty=$statement3->fetch();  

                 //insert into transaction
                 $query1 = "insert into transaction( financial_year_id, reject_to_party_id, docket_id, 
                            item_id, location, transaction_type, transaction_date, rate, reject_to_party_qty, reject_to_party_remarks)
                            values(:financial_year_id, :reject_to_party_id,:docket_id, 
                            :item_id,:location,'RP',:transaction_date, :rate, :reject_to_party_qty,:reject_to_party_remarks)";
                 $statement1 = $objPDO->prepare($query1);
                 $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement1->bindParam(':reject_to_party_id', $m->reject_to_party_id);
                 $statement1->bindParam(':docket_id', $m->reject_docket_id);
                 $statement1->bindParam(':item_id', $value->item_id);
                 $statement1->bindParam(':location', $value->location);
                 $statement1->bindParam(':transaction_date', $reject_date);
                 $statement1->bindParam(':rate', $value->rate);
                 $statement1->bindParam(':reject_to_party_qty', $value->reject_to_party_qty);
                 $statement1->bindParam(':reject_to_party_remarks', $value->reject_to_party_remarks);
                 $statement1->execute();
                 $transaction_id = $objPDO->lastInsertId();

                 //update stock in hand start
                 $query2 = "update stock_in_hand set qty=qty-:qty
                            where item_id=:item_id
                            and financial_year_id=:financial_year_id";
                 $statement2 = $objPDO->prepare($query2);     
                 $statement2->bindParam(':item_id', $value->item_id);
                 $statement2->bindParam(':qty', $value->reject_to_party_qty);
                 $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
                 $statement2->execute(); 
                                 
                 //update transaction table running balance
                 $query4="update transaction 
                          set running_balance=:running_balance
                          where transaction_id=:transaction_id";
                 $statement4 = $objPDO->prepare($query4); 
                 $rb=$value->reject_to_party_qty;
                 if($qty['qty']==''){
                  $rb=-$value->reject_to_party_qty;
                 }else{
                  $rb=$qty['qty']-$value->reject_to_party_qty;
                 }

                 $statement4->bindParam(':transaction_id', $transaction_id);
                 $statement4->bindParam(':running_balance', $rb);
                 $statement4->execute();     
                 
                 //update transaction reject_to_party_qty(to restrict return qty can't be greater than receive qty)
                 $query5="update transaction 
                          set reject_to_party_qty=reject_to_party_qty+:reject_to_party_qty
                          where transaction_id=:transaction_id";
                 $statement5 = $objPDO->prepare($query5);   
                 $statement5->bindParam(':transaction_id', $value->transaction_id);
                 $statement5->bindParam(':reject_to_party_qty', $value->reject_to_party_qty);
                 $statement5->execute(); 

                 //update running balace of every transaction of this item after this transaction date
                 /*update condition1*/
                 $query6="update transaction 
                        set running_balance=running_balance-:running_balance
                        where transaction_date=:transaction_date
                        and item_id=:item_id
                        and transaction_id>:transaction_id
                        and financial_year_id=:financial_year_id";
                 $statement6 = $objPDO->prepare($query6); 
                 $statement6->bindParam(':running_balance', $value->reject_to_party_qty);
                 $statement6->bindParam(':transaction_date', $reject_date);
                 $statement6->bindParam(':item_id', $value->item_id);
                 $statement6->bindParam(':transaction_id', $transaction_id);
                 $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement6->execute(); 
                 
                 /*update condition2*/
                 $query7="update transaction 
                        set running_balance=running_balance-:running_balance
                        where transaction_date>:transaction_date
                        and item_id=:item_id
                        and financial_year_id=:financial_year_id";
                 $statement7 = $objPDO->prepare($query7); 
                 $statement7->bindParam(':running_balance', $value->reject_to_party_qty);
                 $statement7->bindParam(':transaction_date', $reject_date);
                 $statement7->bindParam(':item_id', $value->item_id);
                 $statement7->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement7->execute(); 
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
               $query = "update transaction set running_balance=running_balance+:running_balance
                         where transaction_date=:transaction_date
                         and item_id=:item_id
                         and transaction_id>:transaction_id
                         and financial_year_id=:financial_year_id";
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':running_balance', $old_value['reject_to_party_qty']);
               $statement->bindParam(':transaction_date', $old_value['transaction_date']);
               $statement->bindParam(':item_id', $old_value['item_id']);
               $statement->bindParam(':transaction_id', $old_value['transaction_id']);
               $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement->execute();
               
               /*update condition2*/
               $query = "update transaction set running_balance=running_balance+:running_balance
                         where transaction_date>:transaction_date
                         and item_id=:item_id
                         and financial_year_id=:financial_year_id";
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':running_balance', $old_value['reject_to_party_qty']);
               $statement->bindParam(':transaction_date', $old_value['transaction_date']);
               $statement->bindParam(':item_id', $old_value['item_id']);
               $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement->execute();


               //update stock in hand
               $query = "update stock_in_hand set qty=qty+:qty
                         where item_id=:item_id
                         and financial_year_id=:financial_year_id";
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':qty', $old_value['reject_to_party_qty']);
               $statement->bindParam(':item_id', $old_value['item_id']);
               $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement->execute();

               //update reject_to_party_qty of docket items 
               $query="update transaction 
                      set reject_to_party_qty=reject_to_party_qty-:reject_to_party_qty
                      where docket_id=:docket_id
                      and item_id=:item_id
                      and transaction_type='R'
                      and financial_year_id=:financial_year_id ";

               $statement = $objPDO->prepare($query);
               $statement->bindParam(':reject_to_party_qty', $old_value['reject_to_party_qty']);
               $statement->bindParam(':item_id', $old_value['item_id']);
               $statement->bindParam(':docket_id', $old_value['docket_id']);
               $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement->execute();       
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

   public function deleteRejectToParty($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for running amount*/
         $items_array = array();
         
         $objPDO->beginTransaction();

         $query="select transaction_id, item_id, reject_to_party_qty, running_balance, transaction_date,
                 docket_id
                 from transaction
                 where reject_to_party_id=:reject_to_party_id
                 and transaction_type='RP'";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':reject_to_party_id', $data->reject_to_party_id);
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
                       and item_id=:item_id
                       and transaction_id>:transaction_id
                       and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':running_balance', $old_value['reject_to_party_qty']);
             $statement->bindParam(':transaction_date', $old_value['transaction_date']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':transaction_id', $old_value['transaction_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement->execute();
             
             /*update condition2*/
             $query = "update transaction set running_balance=running_balance+:running_balance
                       where transaction_date>:transaction_date
                       and item_id=:item_id
                       and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':running_balance', $old_value['reject_to_party_qty']);
             $statement->bindParam(':transaction_date', $old_value['transaction_date']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement->execute();


             //update stock in hand
             $query = "update stock_in_hand set qty=qty+:qty
                       where item_id=:item_id
                       and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':qty', $old_value['reject_to_party_qty']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement->execute();

             //update reject_to_party_qty of docket items 
             $query="update transaction 
                    set reject_to_party_qty=reject_to_party_qty-:reject_to_party_qty
                    where docket_id=:docket_id
                    and item_id=:item_id
                    and transaction_type='R'
                    and financial_year_id=:financial_year_id ";

             $statement = $objPDO->prepare($query);
             $statement->bindParam(':reject_to_party_qty', $old_value['reject_to_party_qty']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':docket_id', $old_value['docket_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement->execute();       
             
          }

          $query = "delete from reject_to_party
                    where reject_to_party_id = :reject_to_party_id";
          $statement = $objPDO->prepare($query);
          $statement->bindParam(":reject_to_party_id", $data->reject_to_party_id);
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
