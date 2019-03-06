<?php
require_once 'conf.php';
require_once 'RunningAmountService.php';
/*update transaction set po_id=(select po_id from docket where docket_id=transaction.docket_id)*//*5957way#*/
class DocketService{
   public function readPOForDocket($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          
             $query = "select * from (

                    select distinct a.po_id,po_no,stock_type_code, 'false' as fyear
                    from purchase_order a
                    join po_materials b on a.po_id=b.po_id
                    where stock_type_code=:stock_type_code
                    and status='C'
                    and a.financial_year_id=:financial_year_id
                    and (b.po_qty-docket_po_qty)>0

                    UNION

                    select distinct a.po_id,po_no,stock_type_code, 'false' as fyear
                    from purchase_order a
                    join po_materials b on a.po_id=b.po_id
                    where stock_type_code=:stock_type_code
                    and status='C'
                    and a.financial_year_id=:financial_year_id
                    and (b.po_qty-docket_po_qty)>0
                    and po_without_indent='Y'

                    UNION

                    select distinct a.po_id,po_no,stock_type_code, 'true' as fyear
                    from purchase_order a
                    join po_materials b on a.po_id=b.po_id
                    where stock_type_code=:stock_type_code
                    and status='C'
                    and a.financial_year_id<:financial_year_id
                    and (b.po_qty-docket_po_qty)>0

                    UNION

                    select distinct a.po_id,po_no,stock_type_code, 'true' as fyear
                    from purchase_order a
                    join po_materials b on a.po_id=b.po_id
                    where stock_type_code=:stock_type_code
                    and status='C'
                    and a.financial_year_id<:financial_year_id
                    and (b.po_qty-docket_po_qty)>0
                    and po_without_indent='Y'
                    
                    )a";       
                    // $query = "select * from (

                    // select distinct a.po_id,po_no,stock_type_code, '' as fyear
                    // from purchase_order a
                    // join po_materials b on a.po_id=b.po_id
                    // where stock_type_code=:stock_type_code
                    // and status='C'
                    // and a.financial_year_id=:financial_year_id
                    // and (b.po_qty-docket_po_qty)>0

                    // UNION

                    // select distinct a.po_id,po_no,stock_type_code, '' as fyear
                    // from purchase_order a
                    // join po_materials b on a.po_id=b.po_id
                    // where stock_type_code=:stock_type_code
                    // and status='C'
                    // and a.financial_year_id=:financial_year_id
                    // and (b.po_qty-docket_po_qty)>0
                    // and po_without_indent='Y'
                    
                    // )a";       
 

         $statement = $objPDO->prepare($query);
         $statement->bindParam(":stock_type_code", $d->stock_type);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();

         $qry1="select max(docket_no) as docket_no
                FROM docket 
                where stock_type_code=:stock_type_code
                and financial_year_id=:financial_year_id";

          $stmt1 = $objPDO->prepare($qry1);
          $stmt1->setFetchMode(PDO::FETCH_ASSOC);
          $stmt1->bindParam(':stock_type_code', $d->stock_type);
          $stmt1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
          $stmt1->execute();
          $docket_no=$stmt1->fetch();
        
          $data = array();
          $data['status'] = "s";
          $data['purchaseOrders'] = $statement->fetchAll();
          $data['docket_no'] = $docket_no['docket_no']+1;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function readMaterials($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $poids=implode(",",$d->poids);
          
         //duties
        $dutyHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct duty_id
                  from po_materials
                  where po_id in(".$poids."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        //$statement->bindParam(':po_id', $poids);
        $statement->execute();
        $dutyHeader=$statement->fetchAll();

        //taxes one
        $taxOneHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct tax_one_id
                  from po_materials
                  where po_id in(".$poids."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $poids);
        $statement->execute();
        $taxOneHeader=$statement->fetchAll();

        //taxes two
        $taxTwoHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct tax_two_id
                  from po_materials
                  where po_id in(".$poids."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $poids);
        $statement->execute();
        $taxTwoHeader=$statement->fetchAll();

        //cess
        $cessHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct cess_id
                  from po_materials
                  where po_id in(".$poids."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $poids);
        $statement->execute();
        $cessHeader=$statement->fetchAll();



        //po no
        $qry="select stock_type_code, po_no, po_id, DATE_FORMAT(po_date,'%d/%m/%Y') as po_date
              from purchase_order
              where po_id in(".$poids.")";
        $stmt = $objPDO->prepare($qry);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        // $stmt->bindParam(':po_id', $poids);
        $stmt->execute();
        $tempPODetails=$stmt->fetchAll();
        $poDetails=array();
        foreach ($tempPODetails as $key => $value) {
          $poDetails[$value['po_id']] = $value['stock_type_code'].'-'.$value['po_no'];
        }
          
        //materials 
        $query = "select po_id, c.item_id, a.indent_material_map_id, item_name, uom_code, location,
                 a.po_qty, (a.po_qty-docket_po_qty) as actual_pending_po, a.unit_value,
                 discount_percentage, discount_amount,
                 p_and_f_charges, sub_total, duty_id, duty, amount_after_duty,
                 tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges
                 from po_materials a
                 join item_master c on a.item_id = c.item_id
                 where po_id in(".$poids.")
                 and (a.po_qty-docket_po_qty)>0";
                             
           $val=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           // $statement->bindParam(':po_id', $poids);
           $statement->execute();
           $val=$statement->fetchAll(); 
           $materialsArray=array();
           $total=0;
           foreach ($val as $key => $value) {
             $obj=array();
             $obj['item_index']=$value['po_id'].$value['item_id'];
             $obj['item_id']=$value['item_id'];
             $obj['item_name']=utf8_encode($value['item_name']);
             $obj['po_id']=$value['po_id'];

             $obj['po_no']=$poDetails[$value['po_id']];

             $obj['indent_material_map_id']=$value['indent_material_map_id'];
             $obj['uom']=$value['uom_code'];
             $obj['location']=$value['location'];
             $obj['po_qty']=$value['actual_pending_po'];
             $obj['qty']='';
             $obj['unit_value']=$value['unit_value'];
             $obj['amount']='';
             $obj['discount_percentage']=$value['discount_percentage'];
             $obj['discount_amount']='';
             $obj['p_and_f_charges']=$value['p_and_f_charges'];
             $obj['other_charges']=$value['other_charges'];
             $obj['amount_after_duty']='';
             $obj['sub_total']='';
             $obj['total']='';
             $obj['remarks']='';
             
             //duties
             $dutyObj=array();
             foreach ($dutyHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['duty_id']){
                  $ob=array();
                  $ob['duty_rate']=$v['tax_rate'];
                  $ob['duty']='';
                  $dutyObj[]=$ob;
                }else{
                  $ob=array();
                  $ob['duty_rate']='';
                  $ob['duty']='';
                  $dutyObj[]=$ob;
                }
             }
             $obj['duties']=$dutyObj;

             //tax one
             $taxOneObj=array();
             foreach ($taxOneHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['tax_one_id']){
                  $ob=array();
                  $ob['tax_one_rate']=$v['tax_rate'];
                  $ob['tax_one']='';
                  $taxOneObj[]=$ob;
                }else{
                  $ob=array();
                  $ob['tax_one_rate']='';
                  $ob['tax_one']='';
                  $taxOneObj[]=$ob;
                }
             }
             $obj['taxone']=$taxOneObj;

             //tax two
             $taxTwoObj=array();
             foreach ($taxTwoHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['tax_two_id']){
                  $ob=array();
                  $ob['tax_two_rate']=$v['tax_rate'];
                  $ob['tax_two']='';
                  $taxTwoObj[]=$ob;
                }else{
                  $ob=array();
                  $ob['tax_two_rate']='';
                  $ob['tax_two']='';
                  $taxTwoObj[]=$ob;
                }
             }
             $obj['taxtwo']=$taxTwoObj;

             //cess
             $cessObj=array();
             foreach ($cessHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['cess_id']){
                  $ob=array();
                  $ob['cess_rate']=$v['tax_rate'];
                  $ob['cess']='';
                  $cessObj[]=$ob;
                }else{
                  $ob=array();
                  $ob['cess_rate']='';
                  $ob['cess']='';
                  $cessObj[]=$ob;
                }
             }
             $obj['cess']=$cessObj;

             $materialsArray[]=$obj;
           }

          //details
          $details=array();
          $qry="select party_id, DATE_FORMAT(po_date,'%d/%m/%Y') as po_date
                from purchase_order
                where po_id in(".$poids.")
                order by po_id asc limit 1";
          $stmt = $objPDO->prepare($qry);
          $stmt->setFetchMode(PDO::FETCH_ASSOC);
          // $stmt->bindParam(':po_id', $poids);
          $stmt->execute();
          $party_id=$stmt->fetch();
          $details['party_id']=$party_id['party_id'];
          $details['po_date']=$party_id['po_date'];
          $details['po_ids']=$poids;

          $details['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+13;

          $data['status'] = "s";
          $data['material']['dutyHeaders'] = $dutyHeader;
          $data['material']['taxOneHeaders'] = $taxOneHeader;
          $data['material']['taxTwoHeaders'] = $taxTwoHeader;
          $data['material']['cessHeaders'] = $cessHeader;
          $data['material']['materials'] = $materialsArray;
          $data['material']['details'] = $details;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   

   public function saveDocket($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for ruuning amount update*/
         $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }

         $objPDO->beginTransaction();

         $docket_date=implode("-", array_reverse(array_map('trim', explode("/", $m->details->docket_date))));

         $query="select count(docket_id) as docket_no 
                 from docket 
                 where docket_date>:docket_date
                 and stock_type_code=:stock_type_code 
                 and financial_year_id=:financial_year_id";

         $statement = $objPDO->prepare($query);        
         $statement->setFetchMode(PDO::FETCH_ASSOC);    
         $statement->bindParam(':docket_date', $docket_date);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->bindParam(":stock_type_code",$m->details->stock_type_code);
         $statement->execute();
         $total_transaction_no=$statement->fetch();

         if($total_transaction_no['docket_no']==0){//back date docket entry restriction 
         
           $dt = date('Y-m-d H:i:s');
           $query = "Insert into docket (financial_year_id, stock_type_code, party_id, po_id, docket_no, docket_date, bill_no, bill_date, challan_no, challan_date, transporter_name, transpotation_mode, vehicle_no, lr_no,
             sub_total_amount, freight_charge,
             p_and_f_charge, delivery_charge, loading_charge, packing_charge, courier_charge,
             round_off_amount,
             bill_amount, remarks, 
             creation_date, created_by, modification_date, modified_by)
             values (:financial_year_id, :stock_type_code, :party_id, :po_id, :docket_no, :docket_date, :bill_no, :bill_date, :challan_no, :challan_date, :transporter_name, :transpotation_mode, :vehicle_no, :lr_no,
               :sub_total_amount, :freight_charge,
               :p_and_f_charge, :delivery_charge, :loading_charge, :packing_charge, :courier_charge,
               :round_off_amount,
               :bill_amount, :remarks, 
               :dt, :user, :dt, :user)";

           $statement = $objPDO->prepare($query);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
           $statement->bindParam(":stock_type_code",$m->details->stock_type_code);
           $statement->bindParam(":party_id",$m->details->party_id);
           $statement->bindParam(":po_id",$m->details->po_id);//poids
           $statement->bindParam(":docket_no",$m->details->docket_no);

           
           $statement->bindParam(":docket_date",$docket_date);

           $statement->bindParam(":bill_no",$m->details->bill_no);
           
           $bill_date=implode("-", array_reverse(array_map('trim', explode("/", $m->details->bill_date))));
           $statement->bindParam(":bill_date",$bill_date);
           
           $statement->bindParam(":challan_no",$m->details->challan_no);
           
           $challan_date=implode("-", array_reverse(array_map('trim', explode("/", $m->details->challan_date))));
           $statement->bindParam(":challan_date",$challan_date);
           
           $statement->bindParam(":transporter_name",$m->details->transporter_name);
           $statement->bindParam(":transpotation_mode",$m->details->transpotation_mode);
           $statement->bindParam(":vehicle_no",$m->details->vehicle_no);
           $statement->bindParam(":lr_no",$m->details->lr_no);
           $statement->bindParam(":sub_total_amount",$m->details->sub_total_amount);
           $statement->bindParam(":freight_charge",$m->details->freight_charge);
           $statement->bindParam(":p_and_f_charge",$m->details->p_and_f_charge);
           $statement->bindParam(":delivery_charge",$m->details->delivery_charge);
           $statement->bindParam(":loading_charge",$m->details->loading_charge);
           $statement->bindParam(":packing_charge",$m->details->packing_charge);
           $statement->bindParam(":courier_charge",$m->details->courier_charge);
           $statement->bindParam(":round_off_amount",$m->details->round_off_amount);
           $statement->bindParam(":bill_amount",$m->details->bill_amount);
           $statement->bindParam(":remarks",$m->details->remarks);
           $statement->bindParam(":dt", $dt);
           $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
           $statement->execute();
           $docket_id = $objPDO->lastInsertId();

           $query1 = "Insert into transaction (financial_year_id, docket_id, po_id, item_id, location, transaction_type,
                      po_qty, qty,  
                      rate, discount_percentage, discount_amount, p_and_f_charge, amount_after_duty,
                      other_charges,total, remarks,transaction_date,creation_date)
                      values (:financial_year_id,:docket_id, :po_id, :item_id, :location, 'R', :po_qty, :qty,
                      :rate, :discount_percentage, :discount_amount, :p_and_f_charge, :amount_after_duty,
                      :other_charges,:total, :remarks,:transaction_date,:creation_date)";
           $statement1 = $objPDO->prepare($query1);
           
           //delete last purchase details
           $query2 = "delete from item_last_purchase
                      where item_id = :item_id and financial_year_id=:financial_year_id";
           $statement2 = $objPDO->prepare($query2);

           //last purchase details
           $query3="Insert into item_last_purchase (financial_year_id, item_id, docket_id, lp_party_id, lp_price,lp_qty)
                    values(:financial_year_id,:item_id, :docket_id, :lp_party_id, :lp_price,:lp_qty)";
           $statement3 = $objPDO->prepare($query3);                      
            
           //update stock in hand start
           $query4 = "update stock_in_hand set qty=qty+:qty
                      where item_id=:item_id and financial_year_id=:financial_year_id";
           $statement4 = $objPDO->prepare($query4);     

           //update transaction table running balance for this transaction
           $query5="select running_balance as qty from transaction
                    where item_id=:item_id
                    and transaction_date<=:transaction_date
                    and financial_year_id=:financial_year_id
                    order by transaction_date desc,transaction_id desc limit 1";
           $statement5 = $objPDO->prepare($query5);
           $statement5->setFetchMode(PDO::FETCH_ASSOC); 


           $query6="update transaction 
                    set running_balance=:running_balance
                    where transaction_id=:transaction_id";
           $statement6 = $objPDO->prepare($query6);      

           foreach ($m->materials as $value) {
             $qty=array();
             //reading running balance of same item on last transaction date
             $statement5->bindParam(':item_id', $value->item_id);
             $statement5->bindParam(':transaction_date', $docket_date);
             $statement5->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement5->execute();
             $qty=$statement5->fetch();
             
             $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement1->bindParam(':docket_id', $docket_id);
             $statement1->bindParam(':po_id', $value->po_id);
             $statement1->bindParam(':item_id', $value->item_id);
             $statement1->bindParam(':location', $value->location);
             $statement1->bindParam(':po_qty', $value->po_qty);
             $statement1->bindParam(':qty', $value->qty);
             $statement1->bindParam(':rate', $value->unit_value);
             $statement1->bindParam(':discount_percentage', $value->discount_percentage);
             $statement1->bindParam(':discount_amount', $value->discount_amount);
             $statement1->bindParam(':p_and_f_charge', $value->p_and_f_charges);
             $statement1->bindParam(':amount_after_duty', $value->amount_after_duty);
             $statement1->bindParam(':other_charges', $value->other_charges);
             $statement1->bindParam(':total', $value->total);
             $statement1->bindParam(':remarks', $value->remarks);
             $statement1->bindParam(':transaction_date', $docket_date);
             $statement1->bindParam(':creation_date', $dt);
             $statement1->execute();
             $transaction_id = $objPDO->lastInsertId();
             
             //delete last purchase details
             $statement2->bindParam(":item_id", $value->item_id);
             $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement2->execute();
             
             //last purchase details
             $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement3->bindParam(':item_id', $value->item_id);
             $statement3->bindParam(':docket_id', $docket_id);
             $statement3->bindParam(':lp_party_id', $m->details->party_id);
             $statement3->bindParam(':lp_price', $value->unit_value);
             $statement3->bindParam(':lp_qty', $value->qty);
             $statement3->execute(); 
             
             //update stock in hand start
             $statement4->bindParam(':item_id', $value->item_id);
             $statement4->bindParam(':qty', $value->qty);
             $statement4->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement4->execute();
             
             //update transaction table running balance for this date
             $rb=$value->qty;
             if($qty['qty']==''){
              $rb=$value->qty;
             }else{
              $rb=$value->qty + $qty['qty'];
             }
             $statement6->bindParam(':transaction_id', $transaction_id);
             $statement6->bindParam(':running_balance', $rb);
             $statement6->execute();     

             //update docket_qty in po_materials
             $condition="item_id=:item_id";
             if($value->indent_material_map_id==null){
              $condition="item_id=:item_id";
             }else{
              $condition="indent_material_map_id=:indent_material_map_id";
             }

             $query = "update po_materials set docket_po_qty=docket_po_qty+:docket_po_qty
                      where po_id=:po_id
                      and ".$condition;

             $statement = $objPDO->prepare($query);  
             $statement->bindParam(':po_id', $value->po_id);
             
             if($value->indent_material_map_id==null){
              $statement->bindParam(':item_id', $value->item_id);
             }else{
              $statement->bindParam(':indent_material_map_id', $value->indent_material_map_id);
             }
             

             $statement->bindParam(':docket_po_qty', $value->qty);
             $statement->execute();

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
             $statement7->bindParam(':transaction_date', $docket_date);
             $statement7->bindParam(':item_id', $value->item_id);
             //$statement7->bindParam(':docket_id', $docket_id);
             $statement7->bindParam(':transaction_id', $transaction_id);
             $statement7->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement7->execute(); 
             /*update condition2*/
             $query7="update transaction 
                    set running_balance=running_balance+:running_balance
                    where transaction_date>:transaction_date
                    and item_id=:item_id
                    and financial_year_id=:financial_year_id";
             $statement7 = $objPDO->prepare($query7); 
             $statement7->bindParam(':running_balance', $value->qty);
             $statement7->bindParam(':transaction_date', $docket_date);
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

   public function editDocket($m) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for ruuning amount update*/
         $items_array = array();
         foreach ($m->materials as $v){
           $items_array [] = $v->item_id;
         }
         
         $objPDO->beginTransaction();

         $dt = date('Y-m-d H:i:s');

         $query = "update docket set stock_type_code=:stock_type_code,
                    party_id=:party_id,
                    po_id=:po_id,
                    docket_no=:docket_no,
                    docket_date=:docket_date,
                    bill_no=:bill_no,
                    bill_date=:bill_date,
                    challan_no=:challan_no,
                    challan_date=:challan_date,
                    transporter_name=:transporter_name,
                    transpotation_mode=:transpotation_mode,
                    vehicle_no=:vehicle_no,
                    lr_no=:lr_no,
                    sub_total_amount=:sub_total_amount,
                    freight_charge=:freight_charge,
                    p_and_f_charge=:p_and_f_charge,
                    delivery_charge=:delivery_charge,
                    loading_charge=:loading_charge,
                    packing_charge=:packing_charge,
                    courier_charge=:courier_charge,
                    round_off_amount=:round_off_amount,
                    bill_amount=:bill_amount,
                    remarks=:remarks,
                    modification_date=:dt,
                    modified_by=:user
                    where docket_id=:docket_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":docket_id",$m->edit_docket_id);
         $statement->bindParam(":stock_type_code",$m->details->stock_type_code);
         $statement->bindParam(":party_id",$m->details->party_id);
         $statement->bindParam(":po_id",$m->details->po_id);
         
         $statement->bindParam(":docket_no",$m->details->docket_no);
         
         $docket_date=implode("-", array_reverse(array_map('trim', explode("/", $m->details->docket_date))));
         $statement->bindParam(":docket_date",$docket_date);
         
         $statement->bindParam(":bill_no",$m->details->bill_no);
         
         $bill_date=implode("-", array_reverse(array_map('trim', explode("/", $m->details->bill_date))));
         $statement->bindParam(":bill_date",$bill_date);
         
         $statement->bindParam(":challan_no",$m->details->challan_no);
         
         $challan_date=implode("-", array_reverse(array_map('trim', explode("/", $m->details->challan_date))));
         $statement->bindParam(":challan_date",$challan_date);
         
         $statement->bindParam(":transporter_name",$m->details->transporter_name);
         $statement->bindParam(":transpotation_mode",$m->details->transpotation_mode);
         $statement->bindParam(":vehicle_no",$m->details->vehicle_no);
         $statement->bindParam(":lr_no",$m->details->lr_no);
         $statement->bindParam(":sub_total_amount",$m->details->sub_total_amount);
         $statement->bindParam(":freight_charge",$m->details->freight_charge);
         $statement->bindParam(":p_and_f_charge",$m->details->p_and_f_charge);
         $statement->bindParam(":delivery_charge",$m->details->delivery_charge);
         $statement->bindParam(":loading_charge",$m->details->loading_charge);
         $statement->bindParam(":packing_charge",$m->details->packing_charge);
         $statement->bindParam(":courier_charge",$m->details->courier_charge);
         $statement->bindParam(":round_off_amount",$m->details->round_off_amount);
         $statement->bindParam(":bill_amount",$m->details->bill_amount);
         $statement->bindParam(":remarks",$m->details->remarks);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();

         //read old items 
         $query="select transaction_id,item_id, po_id, concat(po_id,item_id) as item_index, qty,running_balance,transaction_date 
                 from transaction
                 where docket_id=:docket_id
                 and transaction_type='R'";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':docket_id', $m->edit_docket_id);
         $statement->execute();
         $transactions=$statement->fetchAll();

         foreach ($m->materials as $value) {//checking new items with old items
           $ind=0;
           $counter=0;
           foreach ($transactions as $old_value) {
            if($value->item_index==$old_value['item_index']){//update condition
               $counter=1;//found a match i.e. no need to add item
              //update transaction table //po_qty=:po_qty,
               $query1 = "update transaction set location=:location,
                          qty=:qty,
                          rate=:rate,
                          discount_percentage=:discount_percentage,
                          discount_amount=:discount_amount,
                          p_and_f_charge=:p_and_f_charge,
                          amount_after_duty=:amount_after_duty,
                          other_charges=:other_charges,
                          total=:total,
                          running_balance=:running_balance,
                          remarks=:remarks,
                          transaction_date=:transaction_date
                          where docket_id=:docket_id
                          and item_id=:item_id
                          and transaction_id=:transaction_id";
               $statement1 = $objPDO->prepare($query1);
               $diff_qty=$value->qty-$old_value['qty'];
               $running_balance=$old_value['running_balance']+$diff_qty;

               $statement1->bindParam(':docket_id', $m->edit_docket_id);
               $statement1->bindParam(':item_id', $value->item_id);
               $statement1->bindParam(':location', $value->location);
               $statement1->bindParam(':qty', $value->qty);
               $statement1->bindParam(':rate', $value->unit_value);
               $statement1->bindParam(':discount_percentage', $value->discount_percentage);
               $statement1->bindParam(':discount_amount', $value->discount_amount);
               $statement1->bindParam(':p_and_f_charge', $value->p_and_f_charges);
               $statement1->bindParam(':amount_after_duty', $value->amount_after_duty);
               $statement1->bindParam(':other_charges', $value->other_charges);
               $statement1->bindParam(':total', $value->total);
               $statement1->bindParam(':running_balance', $running_balance);
               $statement1->bindParam(':remarks', $value->remarks);
               $statement1->bindParam(':transaction_id', $value->transaction_id);
               $statement1->bindParam(':transaction_date', $docket_date);
               $statement1->execute();

                 //update transaction and running balance of item after this transaction
                 /*condition1*/
                 $query = "update transaction set running_balance=running_balance+:running_balance
                           where transaction_date=:transaction_date
                           and item_id=:item_id
                           and transaction_id>:transaction_id
                           and financial_year_id=:financial_year_id";
                 $statement = $objPDO->prepare($query);
                 $statement->bindParam(':running_balance', $diff_qty);
                 $statement->bindParam(':transaction_date', $old_value['transaction_date']);
                 $statement->bindParam(':transaction_id', $old_value['transaction_id']);
                 $statement->bindParam(':item_id', $old_value['item_id']);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 //$statement->bindParam(':docket_id', $m->edit_docket_id);
                 $statement->execute();

                 /*condition2*/
                 $query = "update transaction set running_balance=running_balance+:running_balance
                           where transaction_date>:transaction_date
                           and item_id=:item_id
                           and financial_year_id=:financial_year_id";
                 $statement = $objPDO->prepare($query);
                 $statement->bindParam(':running_balance', $diff_qty);
                 $statement->bindParam(':transaction_date', $old_value['transaction_date']);
                 $statement->bindParam(':item_id', $old_value['item_id']);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement->execute();

                 //update stock in hand
                 $query = "update stock_in_hand set qty=qty+:qty
                           where item_id=:item_id
                           and financial_year_id=:financial_year_id";
                 $statement = $objPDO->prepare($query);
                 $statement->bindParam(':qty', $diff_qty);
                 $statement->bindParam(':item_id', $old_value['item_id']);
                 $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                 $statement->execute();  

                 //update docket_qty in po_materials
                 $query = "update po_materials set docket_po_qty=docket_po_qty+:docket_po_qty
                          where po_id=:po_id
                          and item_id=:item_id";
                 $statement = $objPDO->prepare($query);  
                 $statement->bindParam(':po_id', $old_value['po_id']);
                 $statement->bindParam(':item_id', $old_value['item_id']);
                 $statement->bindParam(':docket_po_qty', $diff_qty);
                 $statement->execute();

                 //last purchase details
                $query2="update item_last_purchase set lp_qty=:lp_qty
                         where item_id=:item_id
                         and financial_year_id=:financial_year_id";
                $statement2 = $objPDO->prepare($query2);   
                $statement2->bindParam(':item_id', $value->item_id);
                $statement2->bindParam(':lp_qty', $value->qty);
                $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
                $statement2->execute();
                array_splice($transactions, $ind, 1);//removing element from old item array
            }
            $ind++;
           }


           if($counter==0){//no match with old items i.e. new item to be inserted in the transaction table
               /*$query="Insert into transaction (receive_id, item_id, transaction_type, qty, wsp, rate,
                    discount_percentage, discount_amount, total)
                    values (:receive_id, :item_id, 'R', :qty, :wsp, :rate,
                    :discount_percentage, :discount_amount, :total)";
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':receive_id', $m->obj->receive_id);
               $statement->bindParam(':item_id', $value->item_id);
               $statement->bindParam(':qty', $value->qty);
               $statement->bindParam(':wsp', $value->wsp);
               $statement->bindParam(':rate', $value->rate);
               $statement->bindParam(':discount_percentage', $value->discount_percentage);
               $statement->bindParam(':discount_amount', $value->discount_amount);
               $statement->bindParam(':total', $value->price);
               $statement->execute();
               $transaction_id=$objPDO->lastInsertId();
              
               //read current balance from stock in hand
               $query = "select qty  
                          from stock_in_hand
                          where item_id=:item_id";
               $statement = $objPDO->prepare($query);
               $statement->setFetchMode(PDO::FETCH_ASSOC);
               $statement->bindParam(':item_id', $value->item_id);
               $statement->execute();
               $qty=$statement->fetch();

               //update running balance of same transaction
               $query = "update transaction set running_balance=:running_balance
                         where transaction_id=:transaction_id";
               $statement = $objPDO->prepare($query);
               $running_bal=$qty['qty']+$value->qty;
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':running_balance', $running_bal);
               $statement->bindParam(':transaction_id', $transaction_id);
               $statement->execute();
               
               //update stock in hand
               $query = "update stock_in_hand set qty=qty+:qty
                         where item_id=:item_id";
               $statement = $objPDO->prepare($query);
               $statement->bindParam(':qty', $value->qty);
               $statement->bindParam(':item_id', $value->item_id);
               $statement->execute();*/
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
                       and transaction_id>:transaction_id
                       and item_id=:item_id
                       and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':running_balance', $old_value['qty']);
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

             //select lp_price i.e rate from transaction where transaction_id < $old_value['transaction_id']
             $query= "select rate,qty,docket_id from transaction
                      where transaction_date<=:transaction_date 
                      and item_id=:item_id
                      and financial_year_id=:financial_year_id
                      order by transaction_date desc,transaction_id desc limit 1";
             $statement = $objPDO->prepare($query);
             $statement->setFetchMode(PDO::FETCH_ASSOC);         
             $statement->bindParam(':transaction_date', $old_value['transaction_date']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement->execute();
             $price=$statement->fetch(); 

             //select lp_party_id i.e party_id from docket
             $query= "select party_id from docket
                      where docket_id=:docket_id limit 1";
             $statement = $objPDO->prepare($query);
             $statement->setFetchMode(PDO::FETCH_ASSOC);         
             $statement->bindParam(':docket_id', $price['docket_id']);
             $statement->execute();
             $docket=$statement->fetch();         
 
             //update last purchase details
               $query2="update item_last_purchase set docket_id=:docket_id,
                        lp_party_id=:lp_party_id,
                        lp_price=:lp_price,
                        lp_qty=:lp_qty
                        where item_id=:item_id
                        and financial_year_id=:financial_year_id";
               $statement2 = $objPDO->prepare($query2);   
               $statement2->bindParam(':docket_id', $price['docket_id']);
               $statement2->bindParam(':item_id', $old_value['item_id']);
               $statement2->bindParam(':lp_price', $price['rate']);
               $statement2->bindParam(':lp_qty', $price['qty']);
               $statement2->bindParam(':lp_party_id', $docket['party_id']);
               $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement2->execute();

             //update docket_qty in po_materials
             $query = "update po_materials set docket_po_qty=docket_po_qty-:docket_po_qty
                       where po_id=:po_id
                       and item_id=:item_id";
             $statement = $objPDO->prepare($query);  
             $statement->bindParam(':docket_po_qty', $old_value['qty']);
             $statement->bindParam(':po_id', $old_value['po_id']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->execute();  
            }   
         }

         $objPDO->commit();
          
          updateRunningAmount($items_array); 
          $data = array();
          $data['status'] = "s";
          //$data['uom_id'] = $uom_id;
         return $data;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function readDocket($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         if($d->stock_type_code=='all'){
            $query = "select docket_id, docket_no, po_id, stock_type_code,
                  date_format(docket_date, '%d/%m/%Y') as docket_date, bill_amount,
                  bill_no, date_format(bill_date, '%d/%m/%Y') as bill_date, party_name
                  from docket a
                  join party_master b on a.party_id=b.party_id
                  where financial_year_id=:financial_year_id
                  order by stock_type_code desc, docket_id desc";

           $statement = $objPDO->prepare($query);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         }else{
           $query = "select docket_id, docket_no, po_id, stock_type_code,
                  date_format(docket_date, '%d/%m/%Y') as docket_date, bill_amount,
                  bill_no, date_format(bill_date, '%d/%m/%Y') as bill_date, party_name
                  from docket a
                  join party_master b on a.party_id=b.party_id
                  where stock_type_code = :stock_type_code
                  and financial_year_id=:financial_year_id
                  order by stock_type_code desc, docket_id desc";

           $statement = $objPDO->prepare($query);
           $statement->bindParam(":stock_type_code", $d->stock_type_code);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         }
        
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['dockets'] = $statement->fetchAll();
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

         $query = "select stock_type_code, a.party_id, po_id, docket_no, party_name,
                   date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                   date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no, 
                   date_format(challan_date, '%d/%m/%Y') as challan_date, 
                   transporter_name, transpotation_mode, vehicle_no, lr_no,
                   sub_total_amount, freight_charge,
                   p_and_f_charge, delivery_charge, loading_charge, packing_charge, courier_charge,
                   round_off_amount, bill_amount, remarks
                   from docket a
                   join party_master b on a.party_id=b.party_id
                   where docket_id=:docket_id
                   order by 1";
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


        
          $qry1="select distinct indent_no, stock_type_code, 
                date_format(indent_date, '%d/%m/%Y') as indent_date
                from po_materials a
                join indents b on a.indent_id=b.indent_id
                where po_id in(".$details['po_id'].")";
          $stmt1 = $objPDO->prepare($qry1);
          $stmt1->setFetchMode(PDO::FETCH_ASSOC);
          $stmt1->bindParam(':po_id', $details['po_id']);
          $stmt1->execute();
          $indentnos=$stmt1->fetchAll();
          $indent_no_and_date='';
          foreach ($indentnos as $key => $value) {
             if($indent_no_and_date==''){
                $indent_no_and_date=$value['stock_type_code'].'-'.$value['indent_no'].'('.$value['indent_date'].')';
             }else{
                $indent_no_and_date=$indent_no_and_date.','.$value['stock_type_code'].'-'.$value['indent_no'].'('.$value['indent_date'].')';
             }
          }
          $details['indent_no_and_date']=$indent_no_and_date;

         //duties
        $dutyHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct duty_id
                  from po_materials
                  where po_id in(".$details['po_id']."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $details['po_id']);
        $statement->execute();
        $dutyHeader=$statement->fetchAll();

        //taxes one
        $taxOneHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct tax_one_id
                  from po_materials
                  where po_id in(".$details['po_id']."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $details['po_id']);
        $statement->execute();
        $taxOneHeader=$statement->fetchAll();

        //taxes two
        $taxTwoHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct tax_two_id
                  from po_materials
                  where po_id in(".$details['po_id']."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $details['po_id']);
        $statement->execute();
        $taxTwoHeader=$statement->fetchAll();

        //cess
        $cessHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct cess_id
                  from po_materials
                  where po_id in(".$details['po_id']."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $details['po_id']);
        $statement->execute();
        $cessHeader=$statement->fetchAll();
      
          
          //materials 
           $query = "select distinct transaction_id, a.item_id, item_name, uom_code, a.location, po_qty, 
                    qty, rate, (qty * rate) as amount,format((qty * rate),2) as amount1,
                    discount_percentage, discount_amount, p_and_f_charge,
                    amount_after_duty, other_charges,
                    total, remarks,
                    duty_id, tax_one_id, tax_two_id, cess_id
                    from transaction a 
                    join (select item_id, po_id, duty_id, tax_one_id, tax_two_id, cess_id
                          from po_materials where po_id in(".$details['po_id'].")) b on (a.item_id=b.item_id and a.po_id=b.po_id)
                    join item_master c on a.item_id=c.item_id
                    where docket_id=:docket_id
                    and total>0
                    order by 1";

           $val=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':docket_id', $d->docket_id);
           // $statement->bindParam(':po_id', $details['po_id']);
           $statement->execute();
           $val=$statement->fetchAll();
           $materialsArray=array();
           $total=0;
           $other_charges=false;
           $p_and_f_charges=false;
           foreach ($val as $key => $value) {
             $obj=array();
             $obj['item_id']=$value['item_id'];
             $obj['transaction_id']=$value['transaction_id'];
             $obj['item_name']=$value['item_name'];
             $obj['location']=$value['location'];
             $obj['uom']=$value['uom_code'];
             $obj['po_qty']=$value['po_qty'];
             $obj['qty']=$value['qty'];
             $obj['reject_to_party_qty']='';
             $obj['unit_value']=$value['rate'];
             $obj['amount']=$value['amount1'];
             $obj['discount_percentage']=$value['discount_percentage'];
             $obj['discount_amount']=$value['discount_amount'];
             $obj['p_and_f_charge']=$value['p_and_f_charge'];
             $obj['other_charges']=$value['other_charges'];
             if($value['other_charges']>0){
              $other_charges=true;
             }
             if($value['p_and_f_charge']>0){
              $p_and_f_charges=true;
             }
             $subtotal=$value['amount']-$value['discount_amount'];
             $obj['sub_total']=$value['amount']-$value['discount_amount']+$value['p_and_f_charge']; //total of each item after discount
             $obj['total']=$value['total'];
             $obj['remarks']=$value['remarks'];
             
             $amount_after_duty=$value['amount']-$value['discount_amount']+$value['p_and_f_charge'];

             //duties
             $dutyObj=array();
             foreach ($dutyHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['duty_id']){
                  $dutyObj[]=number_format((($value['amount']*$v['tax_rate'])/100),'2');
                }else{
                  $dutyObj[]='';
                }
             }
             $obj['duties']=$dutyObj;

             //tax one
             $taxOneObj=array();
             foreach ($taxOneHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['tax_one_id']){
                  if($value['amount_after_duty']==0.00){
                    $taxOneObj[]=number_format((($amount_after_duty*$v['tax_rate'])/100),'2');
                  }else{
                    $taxOneObj[]=number_format((($value['amount_after_duty']*$v['tax_rate'])/100),'2');
                  }
                }else{
                  $taxOneObj[]='';
                }
             }
             $obj['taxone']=$taxOneObj;

             //tax two
             $taxTwoObj=array();
             foreach ($taxTwoHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['tax_two_id']){
                  if($value['amount_after_duty']==0.00){
                    $taxTwoObj[]=number_format((($amount_after_duty*$v['tax_rate'])/100),'2');
                  }else{
                    $taxTwoObj[]=number_format((($value['amount_after_duty']*$v['tax_rate'])/100),'2');
                  }
                }else{
                  $taxTwoObj[]='';
                }
             }
             $obj['taxtwo']=$taxTwoObj;

             //cess
             $cessObj=array();
             foreach ($cessHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['cess_id']){
                  if($value['amount_after_duty']==0.00){
                    $cessObj[]=number_format((($amount_after_duty*$v['tax_rate'])/100),'2');
                  }else{
                    $cessObj[]=number_format((($value['amount_after_duty']*$v['tax_rate'])/100),'2');
                  }
                }else{
                  $cessObj[]='';
                }
             }
             $obj['cess']=$cessObj;
             
             $materialsArray[]=$obj;
           }
          

          $details['other_charges']=$other_charges;
          $details['p_and_f_charges']=$p_and_f_charges;

          $data = array();
          $data['status'] = "s";
          $data['dockets']['details'] = $details;
          $data['dockets']['dutyHeaders'] = $dutyHeader;
          $data['dockets']['taxOneHeaders'] = $taxOneHeader;
          $data['dockets']['taxTwoHeaders'] = $taxTwoHeader;
          $data['dockets']['cessHeaders'] = $cessHeader;
          $data['dockets']['items'] = $materialsArray;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   

   public function readDocketDetailsEdit($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         //edit not allowed if docket is rejected to party
         $query="select count(transaction_id) as total_transactions
                 from transaction 
                 where docket_id=:docket_id
                 and transaction_type='RP'";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":docket_id", $d->docket_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $total_transactions=$statement->fetch();        
        if($total_transactions['total_transactions']==0){
         //details 
         $query = "select stock_type_code, party_id, po_id as po_ids, docket_no, docket_date as t_date,
                   date_format(docket_date, '%d/%m/%Y') as docket_date, bill_no, 
                   date_format(bill_date, '%d/%m/%Y') as bill_date, challan_no, 
                   date_format(challan_date, '%d/%m/%Y') as challan_date, 
                   transporter_name, transpotation_mode, vehicle_no, lr_no,
                   sub_total_amount, freight_charge,
                   p_and_f_charge, delivery_charge, loading_charge, packing_charge, courier_charge, 
                   round_off_amount, bill_amount, remarks
                   from docket 
                   where docket_id=:docket_id
                   order by 1";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":docket_id", $d->docket_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $details=$statement->fetch();
         
         /*check any entry after this transaction date*/
         $query = "select count(transaction_id) as total_transaction_no
                   from transaction
                   where transaction_date>:transaction_date 
                   and transaction_type='R'
                   and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":transaction_date", $details['t_date']);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $total_transaction_no=$statement->fetch();

         //duties
        $dutyHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct duty_id
                  from po_materials
                  where po_id in(".$d->po_id."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $details['po_id']);
        $statement->execute();
        $dutyHeader=$statement->fetchAll();

        //taxes one
        $taxOneHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct tax_one_id
                  from po_materials
                  where po_id in(".$d->po_id."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $details['po_id']);
        $statement->execute();
        $taxOneHeader=$statement->fetchAll();

        //taxes two
        $taxTwoHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct tax_two_id
                  from po_materials
                  where po_id in(".$d->po_id."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $details['po_id']);
        $statement->execute();
        $taxTwoHeader=$statement->fetchAll();

        //cess
        $cessHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id, tax_rate
                  from tax_master
                  where tax_id in (select distinct cess_id
                  from po_materials
                  where po_id in(".$d->po_id."))";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        // $statement->bindParam(':po_id', $details['po_id']);
        $statement->execute();
        $cessHeader=$statement->fetchAll();


        //po no
        $qry="select stock_type_code, po_no, po_id, DATE_FORMAT(po_date,'%d/%m/%Y') as po_date
              from purchase_order
              where po_id in(".$d->po_id.")";
              
        $stmt = $objPDO->prepare($qry);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        // $stmt->bindParam(':po_id', $poids);
        $stmt->execute();
        $tempPODetails=$stmt->fetchAll();
        $poDetails=array();
        foreach ($tempPODetails as $key => $value) {
          $poDetails[$value['po_id']] = $value['stock_type_code'].'-'.$value['po_no'];
        }
          
          //materials 

        /* join po_materials c on (c.item_id=a.item_id and c.po_id=a.po_id and a.financial_year_id=c.financial_year_id)*/
           $query = "select distinct a.po_id, transaction_id, a.item_id, item_name, uom_code, a.location,
                    (c.po_qty-c.docket_po_qty) as  po_qty, qty as prev_qty, 
                    qty, rate, (qty * rate) as amount,format((qty * rate),2) as amount1,
                    a.discount_percentage, a.discount_amount,
                    a.p_and_f_charge, a.amount_after_duty, a.total, a.remarks,
                    duty_id, tax_one_id, tax_two_id, cess_id, a.other_charges
                    from transaction a 
                    join po_materials c on (c.item_id=a.item_id and c.po_id=a.po_id)
                    join item_master b on a.item_id=b.item_id
                    where docket_id=:docket_id 
                    and a.po_id in(".$d->po_id.")
                    and transaction_type='R'
                    and a.financial_year_id=:financial_year_id
                    order by 1";
                             
           $val=array();
           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':docket_id', $d->docket_id);
           // $statement->bindParam(':po_id', $d->po_id);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
           $statement->execute();
           $val=$statement->fetchAll();
           $materialsArray=array();
           $total=0;
           foreach ($val as $key => $value) {
             $obj=array();
             $obj['item_index']=$value['po_id'].$value['item_id'];
             $obj['item_id']=$value['item_id'];
             $obj['transaction_id']=$value['transaction_id'];
             $obj['item_name']=$value['item_name'];

             $obj['po_id']=$value['po_id'];
             $obj['po_no']=$poDetails[$value['po_id']];

             $obj['location']=$value['location'];
             $obj['uom']=$value['uom_code'];
             $obj['prev_qty']=$value['prev_qty'];
             $obj['po_qty']=$value['po_qty'];
             $obj['qty']=$value['qty'];
             $obj['reject_to_party_qty']='';
             $obj['unit_value']=$value['rate'];
             $obj['amount']=$value['amount'];
             $obj['discount_percentage']=$value['discount_percentage'];
             $obj['discount_amount']=$value['discount_amount'];
             $obj['p_and_f_charges']=$value['p_and_f_charge'];
             $obj['other_charges']=$value['other_charges'];
             $obj['sub_total']=$value['amount']-$value['discount_amount']+$value['p_and_f_charge']+$value['other_charges']; //total of each item after discount
             $obj['total']=$value['total'];
             $obj['remarks']=$value['remarks'];
             $amount_after_duty=$value['amount']-$value['discount_amount']+$value['p_and_f_charge'];
             //duties
             $dutyObj=array();
             foreach ($dutyHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['duty_id']){
                  $ob=array();
                  $ob['duty_rate']=$v['tax_rate'];
                  $ob['duty']=number_format((($value['amount']*$v['tax_rate'])/100),'2');
                  $dutyObj[]=$ob;
                }else{
                  $ob=array();
                  $ob['duty_rate']='';
                  $ob['duty']='';
                  $dutyObj[]=$ob;
                }
             }
             $obj['duties']=$dutyObj;

             //tax one
             $taxOneObj=array();
             foreach ($taxOneHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['tax_one_id']){
                  $ob=array();
                  $ob['tax_one_rate']=$v['tax_rate'];
                  if($value['amount_after_duty']==0.00){
                    $ob['tax_one']=number_format((($amount_after_duty*$v['tax_rate'])/100),'2');
                  }else{  
                    $ob['tax_one']=number_format((($value['amount_after_duty']*$v['tax_rate'])/100),'2');
                  } 
                  $taxOneObj[]=$ob;
                }else{
                  $ob=array();
                  $ob['tax_one_rate']='';
                  $ob['tax_one']='';
                  $taxOneObj[]=$ob;
                }
             }
             $obj['taxone']=$taxOneObj;

             //tax two
             $taxTwoObj=array();
             foreach ($taxTwoHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['tax_two_id']){
                  $ob=array();
                  $ob['tax_two_rate']=$v['tax_rate'];
                  if($value['amount_after_duty']==0.00){
                    $ob['tax_two']=number_format((($amount_after_duty*$v['tax_rate'])/100),'2');
                  }else{  
                    $ob['tax_two']=number_format((($value['amount_after_duty']*$v['tax_rate'])/100),'2');
                  } 
                  $taxTwoObj[]=$ob;
                }else{
                  $ob=array();
                  $ob['tax_two_rate']='';
                  $ob['tax_two']='';
                  $taxTwoObj[]=$ob;
                }
             }
             $obj['taxtwo']=$taxTwoObj;

             //cess
             $cessObj=array();
             foreach ($cessHeader as $v) {//loop same as header order
                if($v['tax_id']==$value['cess_id']){
                  $ob=array();
                  $ob['cess_rate']=$v['tax_rate'];
                  if($value['amount_after_duty']==0.00){
                    $ob['cess']=number_format((($amount_after_duty*$v['tax_rate'])/100),'2');
                  }else{  
                    $ob['cess']=number_format((($value['amount_after_duty']*$v['tax_rate'])/100),'2');
                  } 
                  $cessObj[]=$ob;
                }else{
                  $ob=array();
                  $ob['cess_rate']='';
                  $ob['cess']='';
                  $cessObj[]=$ob;
                }
             }
             $obj['cess']=$cessObj;

             $materialsArray[]=$obj;
           }

         //purchase orders
         $query = "select stock_type_code, po_no, po_id
                  from purchase_order
                  where po_id in(".$d->po_id.")";
             
         $statement = $objPDO->prepare($query);
         // $statement->bindParam(":po_id", $d->po_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $purchaseOrders=$statement->fetchAll();

          $data = array();
          $data['status'] = "s";
          $data['dockets']['details'] = $details;
          $data['dockets']['dutyHeaders'] = $dutyHeader;
          $data['dockets']['taxOneHeaders'] = $taxOneHeader;
          $data['dockets']['taxTwoHeaders'] = $taxTwoHeader;
          $data['dockets']['cessHeaders'] = $cessHeader;
          $data['dockets']['items'] = $materialsArray;
          $data['dockets']['purchaseOrders'] = $purchaseOrders;
          $data['dockets']['total_transaction_no'] = $total_transaction_no['total_transaction_no'];
         return $data;
       }else{
         $data = array();
         $data['status'] = "return_to_party_error";
         return $data;
       }   
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function deleteDocket($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*for ruuning amount update*/
         $items_array = array();
         

         $objPDO->beginTransaction();

         $query="select transaction_id,po_id,item_id,qty,running_balance,transaction_date
                 from transaction
                 where docket_id=:docket_id
                 and transaction_type='R'";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':docket_id', $data->docket_id);
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
             $query = "update transaction set running_balance=running_balance-:running_balance
                       where transaction_date=:transaction_date
                       and transaction_id>:transaction_id
                       and item_id=:item_id
                       and financial_year_id=:financial_year_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':running_balance', $old_value['qty']);
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

             //select lp_price i.e rate from transaction where transaction_id < $old_value['transaction_id']
             $query= "select rate,qty,docket_id from transaction
                      where transaction_date<=:transaction_date 
                      and item_id=:item_id
                      and financial_year_id=:financial_year_id
                      order by transaction_date desc,transaction_id desc limit 1";
             $statement = $objPDO->prepare($query);
             $statement->setFetchMode(PDO::FETCH_ASSOC);         
             $statement->bindParam(':transaction_date', $old_value['transaction_date']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
             $statement->execute();
             $price=$statement->fetch(); 

             //select lp_party_id i.e party_id from docket
             $query= "select party_id from docket
                      where docket_id=:docket_id limit 1";
             $statement = $objPDO->prepare($query);
             $statement->setFetchMode(PDO::FETCH_ASSOC);         
             $statement->bindParam(':docket_id', $price['docket_id']);
             $statement->execute();
             $docket=$statement->fetch();         
 
             //update last purchase details
               $query2="update item_last_purchase set docket_id=:docket_id,
                        lp_party_id=:lp_party_id,
                        lp_price=:lp_price,
                        lp_qty=:lp_qty
                        where item_id=:item_id
                        and financial_year_id=:financial_year_id";
               $statement2 = $objPDO->prepare($query2);   
               $statement2->bindParam(':docket_id', $price['docket_id']);
               $statement2->bindParam(':item_id', $old_value['item_id']);
               $statement2->bindParam(':lp_price', $price['rate']);
               $statement2->bindParam(':lp_qty', $price['qty']);
               $statement2->bindParam(':lp_party_id', $docket['party_id']);
               $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
               $statement2->execute();

             //update docket_qty in po_materials
             $query = "update po_materials set docket_po_qty=docket_po_qty-:docket_po_qty
                       where po_id=:po_id
                       and item_id=:item_id";
             $statement = $objPDO->prepare($query);  
             $statement->bindParam(':docket_po_qty', $old_value['qty']);
             $statement->bindParam(':po_id', $old_value['po_id']);
             $statement->bindParam(':item_id', $old_value['item_id']);
             $statement->execute();  
          }

          $query = "delete from docket
                    where docket_id = :docket_id";
          $statement = $objPDO->prepare($query);
          $statement->bindParam(":docket_id", $data->docket_id);
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