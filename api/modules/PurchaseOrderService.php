<?php
require_once 'conf.php';
class PurchaseOrderService{

 public function readIndentsForPOAddition($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select indent_id, indent_no, indent_type, indent_type_view, department, stock_type_code,
                  stock_type, status, indent_date,
                  approved_by,finalized_by, fyear from 
                  (

                  ( select indent_id, indent_no,indent_type,
                  (CASE 
                      WHEN indent_type = 'N' THEN 'Normal'
                      WHEN indent_type = 'U' THEN 'Urgent'
                      WHEN indent_type = 'VU' THEN 'Very Urgent'
                      ELSE 1
                  END) AS indent_type_view,
                 department, a.stock_type_code,
                  stock_type, status, DATE_FORMAT(indent_date,'%d/%m/%Y') as indent_date,
                  approved_by,finalized_by, 'false' as fyear
                  from indents a 
                  left join stock_type_master b on a.stock_type_code=b.stock_type_code
                  left join department_master c on a.department_code=c.department_code
                  where status=:status
                  and completed='N'
                  and financial_year_id=:financial_year_id
                  order by 2 ) 

                  UNION 

                  ( select indent_id, indent_no,indent_type,
                  (CASE 
                      WHEN indent_type = 'N' THEN 'Normal'
                      WHEN indent_type = 'U' THEN 'Urgent'
                      WHEN indent_type = 'VU' THEN 'Very Urgent'
                      ELSE 1
                  END) AS indent_type_view,
                 department, a.stock_type_code,
                  stock_type, status, DATE_FORMAT(indent_date,'%d/%m/%Y') as indent_date,
                  approved_by,finalized_by,'true' as fyear
                  from indents a 
                  left join stock_type_master b on a.stock_type_code=b.stock_type_code
                  left join department_master c on a.department_code=c.department_code
                  where status=:status
                  and completed='N'
                  and financial_year_id<:financial_year_id
                  order by 2 ) 
                  
                  ) c

                  ";

        /*$query = "select indent_id, indent_no,indent_type,
                  (CASE 
                      WHEN indent_type = 'N' THEN 'Normal'
                      WHEN indent_type = 'U' THEN 'Urgent'
                      WHEN indent_type = 'VU' THEN 'Very Urgent'
                      ELSE 1
                  END) AS indent_type_view,
                 department, a.stock_type_code,
                  stock_type, status, DATE_FORMAT(indent_date,'%d/%m/%Y') as indent_date,
                  approved_by,finalized_by
                  from indents a 
                  left join stock_type_master b on a.stock_type_code=b.stock_type_code
                  left join department_master c on a.department_code=c.department_code
                  where status=:status
                  and completed='N'
                  and financial_year_id=:financial_year_id
                  order by 2";*/

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':status', $data->indent_status);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 

         $statement->execute();
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['indents'] = $statement->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   } 
 
 public function readPurchaseOrders($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $condition='';
        if($data->stock_type!=''){
          $condition=" and stock_type_code='".$data->stock_type."' ";
        }  

        if($data->purchase_order_status=='all'){
          $query = "select po_id, po_no, stock_type_code, a.party_id, party_name,  status, po_without_indent,
                  date_format(po_date, '%d/%m/%Y') as po_date
                  from purchase_order a 
                  left join party_master b on a.party_id=b.party_id
                  where financial_year_id=:financial_year_id
                  " . $condition . "
                  order by stock_type_code desc, po_id desc";

           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        }else{
          $query = "select po_id, po_no, stock_type_code, a.party_id, party_name, status, po_without_indent,
                  date_format(po_date, '%d/%m/%Y') as po_date
                  from purchase_order a
                  left join party_master b on a.party_id=b.party_id
                  where status=:status
                  and financial_year_id=:financial_year_id
                  " . $condition . "
                  order by stock_type_code desc, po_id desc";

           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':status', $data->purchase_order_status);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
        }
        
         $statement->execute();
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['purchase_orders'] = $statement->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readPurchaseOrderView($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         //duties
        $dutyHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct duty_id
                  from po_materials
                  where po_id=:po_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':po_id', $data->po_id);
        $statement->execute();
        $dutyHeader=$statement->fetchAll();

        //taxes one
        $taxOneHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct tax_one_id
                  from po_materials
                  where po_id=:po_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':po_id', $data->po_id);
        $statement->execute();
        $taxOneHeader=$statement->fetchAll();

        //taxes two
        $taxTwoHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct tax_two_id
                  from po_materials
                  where po_id=:po_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':po_id', $data->po_id);
        $statement->execute();
        $taxTwoHeader=$statement->fetchAll();

        //cess
        $cessHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct cess_id
                  from po_materials
                  where po_id=:po_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':po_id', $data->po_id);
        $statement->execute();
        $cessHeader=$statement->fetchAll();

        
        //materials 

        $query = "select a.item_id, item_name, uom_code,
                  description, a.po_qty, a.unit_value, 
                  ((a.po_qty * a.unit_value)-discount_amount) as amount,
                  discount_percentage, discount_amount, p_and_f_charges, sub_total,
                  duty_id, duty, amount_after_duty,
                  tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges, item_total
                  from po_materials a
                  join item_master b on b.item_id = a.item_id
                  where po_id=:po_id
                  and a.financial_year_id=:financial_year_id";
                  /*date_format(delivery_date, '%d/%m/%Y') as delivery_date, 
                   join indent_material_map b on (a.indent_material_map_id=b.indent_material_map_id 
                                                 and a.financial_year_id=b.financial_year_id)*/
         $val=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->execute();
         $val=$statement->fetchAll();
         $materialsArray=array();
         $total=0;
         $other_charges=false;
         $p_and_f_charges=false;
         foreach ($val as $key => $value) {
           $obj=array();
           //$obj['delivery_date']=$value['delivery_date'];
           $obj['item_id']=$value['item_id'];
           $obj['item_name']=utf8_encode($value['item_name']);
           $obj['uom_code']=$value['uom_code'];
           $obj['description']=$value['description'];
           $obj['po_qty']=$value['po_qty'];
           $obj['unit_value']=$value['unit_value'];
           $obj['discount_amount']=$value['discount_amount'];
           $obj['amount']=number_format($value['amount'], 2, '.', '');
           $obj['discount_percentage']=$value['discount_percentage'];
           $obj['p_and_f_charges']=$value['p_and_f_charges'];
           $obj['other_charges']=$value['other_charges'];
           if($value['other_charges']>0){
              $other_charges=true;
           }
           if($value['p_and_f_charges']>0){
              $p_and_f_charges=true;
           }
           $obj['item_total']=$value['item_total'];
           $total=$total + $value['item_total'];

           //duties
           $dutyObj=array();
           foreach ($dutyHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['duty_id']){
                $dutyObj[]=$value['duty'];
              }else{
                $dutyObj[]='';
              }
              
           }
           $obj['duties']=$dutyObj;

           //tax one
           $taxOneObj=array();
           foreach ($taxOneHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['tax_one_id']){
                $taxOneObj[]=$value['tax_one'];
              }else{
                $taxOneObj[]='';
              }
              
           }
           $obj['taxone']=$taxOneObj;

           //tax two
           $taxTwoObj=array();
           foreach ($taxTwoHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['tax_two_id']){
                $taxTwoObj[]=$value['tax_two'];
              }else{
                $taxTwoObj[]='';
              }
              
           }
           $obj['taxtwo']=$taxTwoObj;

           //cess
           $cessObj=array();
           foreach ($cessHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['cess_id']){
                $cessObj[]=$value['cess'];
              }else{
                $cessObj[]='';
              }
              
           }
           $obj['cess']=$cessObj;

           $materialsArray[]=$obj;
         }
                  
         //details of purchase order
         $query1 = "select po_id, po_no, quotatoin_ref, a.remarks, stock_type_code,
                   date_format(a.po_date, '%d/%m/%Y') as po_date, authorised_signatory,
                   party_name, phone_office, phone_residence, mobile, email,
                   vat, cst, excise, gst, pan, party_name, add_line1, add_line2, city, state, pin,a.party_id
                   from purchase_order a
                   join party_master b on a.party_id=b.party_id
                   where po_id=:po_id
                   and financial_year_id=:financial_year_id";
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(':po_id', $data->po_id);
         $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement1->execute();
         $row=$statement1->fetch();
         $details=array();
         $details['authorised_signatory']=$row['authorised_signatory'];
         $details['party_name']=utf8_encode($row['party_name']);
         $details['party_id']=$row['party_id'];
         $details['quotatoin_ref']=$row['quotatoin_ref'];
         
         $address='';
         if($row['add_line1']!=''){
          $address=$row['add_line1'];
         }
         if($row['add_line2']!=''){
          if($address==''){
            $address=$row['add_line2'];
          }else{
            $address=$address.", ".$row['add_line2'];
          }
         }
         if($row['city']!=''){
          if($address==''){
            $address=$row['city'];
          }else{
            $address=$address.", ".$row['city'];
          }
         }

         if($row['state']!=''){
          if($address==''){
            $address=$row['state'];
          }else{
            $address=$address.", ".$row['state'];
          }
         }

         if($row['pin']!=''){
          if($address==''){
            $address=$row['pin'];
          }else{
            $address=$address." - ".$row['pin'];
          }
         }

         $details['add_line1']=$row['add_line1'];
         $details['add_line2']=$row['add_line2'];
         $details['city']=$row['city'];
         $details['state']=$row['state'];
         $details['pin']=$row['pin'];

         $details['address']=$address;
         
         $tax_details='';
         if($row['vat']!=''){
          if($tax_details==''){
            $tax_details=$tax_details.'VAT:'.$row['vat'];
          }
         }
         if($row['cst']!=''){
          if($tax_details==''){
            $tax_details=$tax_details.'CST:'.$row['cst'];
          }else{
            $tax_details=$tax_details. " CST:".$row['cst'];
          }
         }
         $tax_details1='';
         if($row['excise']!=''){
          if($tax_details1==''){
            $tax_details1=$tax_details1.'EXCISE:'.$row['excise'];
          }else{
            $tax_details1=$tax_details1. " EXCISE:".$row['excise'];
          }
         }
         if($row['pan']!=''){
          if($tax_details1==''){
            $tax_details1=$tax_details1.'PAN:'.$row['pan'];
          }else{
            $tax_details1=$tax_details1. " EXCISE:".$row['pan'];
          }
         }

         if($row['gst']!=''){
          if($tax_details1==''){
            $tax_details1=$tax_details1.'GSTIN:'.$row['gst'];
          }
         }

         $details['vat']=$row['vat'];
         $details['cst']=$row['cst'];
         $details['pan']=$row['pan'];
         $details['excise']=$row['excise'];
         $details['gst']=$row['gst'];

         $details['tax_details']=$tax_details;
         $details['tax_details1']=$tax_details1;


         $details['po_id']=$row['po_id'];
         $details['po_no']=$row['po_no'];
         $details['po_date']=$row['po_date'];
         $details['stock_type_code']=$row['stock_type_code'];
         $details['remarks']=$row['remarks'];
         $details['total']=number_format($total,'3');

         if($other_charges==true){
          $details['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+8;
         }else{
          $details['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+7;
         }

         if($p_and_f_charges==true){
          $details['colspan']=$details['colspan']+1;
         }
         
         $details['other_charges']=$other_charges;
         $details['p_and_f_charges']=$p_and_f_charges;


         //indents on purchase order
         $query2 = "select indent_no, stock_type_code,
                    date_format(indent_date, '%d/%m/%Y') as indent_date
                    from indents 
                    where indent_id in
                    (select distinct indent_id
                    from po_materials
                    where po_id=:po_id and financial_year_id=:financial_year_id)";

         $statement2 = $objPDO->prepare($query2);
         $statement2->setFetchMode(PDO::FETCH_ASSOC);
         $statement2->bindParam(':po_id', $data->po_id);
         $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement2->execute();
         $indent_ids='';

         foreach ($statement2->fetchAll() as $key => $value) {
            if($indent_ids==''){
            $indent_ids=$value['stock_type_code'].'-'.$value['indent_no'].' Dt.:'.$value['indent_date'];
            }else{
              $indent_ids= $indent_ids . ',' .  $value['stock_type_code'].'-'.$value['indent_no'].' Dt.:'.$value['indent_date'];
            }
         }
         $details['indent_ids']=$indent_ids;

        //conditions
        $conditionArray=array(); 
        $qry="select condition_name
              from po_conditions a
              join condition_master b on a.condition_id=b.condition_id
              where po_id=:po_id";
        $stmt = $objPDO->prepare($qry);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->bindParam(':po_id', $data->po_id);
        $stmt->execute();
        $conditionArray=$stmt->fetchAll();
         

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['purchaseOrders']['materials'] = $materialsArray;
         $rdata['purchaseOrders']['details'] = $details;
         $rdata['purchaseOrders']['conditions'] = $conditionArray;
         $rdata['purchaseOrders']['dutyHeaders'] = $dutyHeader;
         $rdata['purchaseOrders']['taxOneHeaders'] = $taxOneHeader;
         $rdata['purchaseOrders']['taxTwoHeaders'] = $taxTwoHeader;
         $rdata['purchaseOrders']['cessHeaders'] = $cessHeader;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readPurchaseOrderViewWithoutIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         //duties
        $dutyHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct duty_id
                  from po_materials
                  where po_id=:po_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':po_id', $data->po_id);
        $statement->execute();
        $dutyHeader=$statement->fetchAll();

        //taxes one
        $taxOneHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct tax_one_id
                  from po_materials
                  where po_id=:po_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':po_id', $data->po_id);
        $statement->execute();
        $taxOneHeader=$statement->fetchAll();

        //taxes two
        $taxTwoHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct tax_two_id
                  from po_materials
                  where po_id=:po_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':po_id', $data->po_id);
        $statement->execute();
        $taxTwoHeader=$statement->fetchAll();

        //cess
        $cessHeader=array();
        $query = "select concat(tax_type,'@', tax_rate) as tax_name, tax_id
                  from tax_master
                  where tax_id in (select distinct cess_id
                  from po_materials
                  where po_id=:po_id)";
        $val=array();
        $statement = $objPDO->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':po_id', $data->po_id);
        $statement->execute();
        $cessHeader=$statement->fetchAll();


        //materials 
        $query = "select a.item_id, item_name, uom_code,
                  description, a.po_qty, a.unit_value, 
                  ((a.po_qty * a.unit_value)-discount_amount) as amount,
                  discount_percentage, discount_amount, p_and_f_charges, sub_total,
                  duty_id, duty, amount_after_duty,
                  tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges, item_total
                  from po_materials a
                  join item_master b on b.item_id = a.item_id
                  where po_id=:po_id
                  and a.financial_year_id=:financial_year_id";
         $val=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->execute();
         $val=$statement->fetchAll();
         $materialsArray=array();
         $total=0;
         $other_charges=false;
         $p_and_f_charges=false;
         foreach ($val as $key => $value) {
           $obj=array();
           //$obj['delivery_date']=$value['delivery_date'];
           $obj['item_id']=$value['item_id'];
           $obj['item_name']=$value['item_name'];
           $obj['uom_code']=$value['uom_code'];
           $obj['description']=$value['description'];
           $obj['po_qty']=$value['po_qty'];
           $obj['unit_value']=$value['unit_value'];
           $obj['discount_amount']=$value['discount_amount'];
           $obj['amount']=number_format($value['amount'], 2, '.', '');
           $obj['discount_percentage']=$value['discount_percentage'];
           $obj['p_and_f_charges']=$value['p_and_f_charges'];
           $obj['other_charges']=$value['other_charges'];
           if($value['other_charges']>0){
              $other_charges=true;
           }
           if($value['p_and_f_charges']>0){
              $p_and_f_charges=true;
           }
           $obj['item_total']=$value['item_total'];
           $total=$total + $value['item_total'];

           //duties
           $dutyObj=array();
           foreach ($dutyHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['duty_id']){
                $dutyObj[]=$value['duty'];
              }else{
                $dutyObj[]='';
              }
              
           }
           $obj['duties']=$dutyObj;

           //tax one
           $taxOneObj=array();
           foreach ($taxOneHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['tax_one_id']){
                $taxOneObj[]=$value['tax_one'];
              }else{
                $taxOneObj[]='';
              }
              
           }
           $obj['taxone']=$taxOneObj;

           //tax two
           $taxTwoObj=array();
           foreach ($taxTwoHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['tax_two_id']){
                $taxTwoObj[]=$value['tax_two'];
              }else{
                $taxTwoObj[]='';
              }
              
           }
           $obj['taxtwo']=$taxTwoObj;

           //cess
           $cessObj=array();
           foreach ($cessHeader as $v) {//loop same as header order
              if($v['tax_id']==$value['cess_id']){
                $cessObj[]=$value['cess'];
              }else{
                $cessObj[]='';
              }
              
           }
           $obj['cess']=$cessObj;

           $materialsArray[]=$obj;
         }

        
         //details of purchase order
         $query1 = "select po_id, po_no, quotatoin_ref, a.remarks, stock_type_code,
                   date_format(a.po_date, '%d/%m/%Y') as po_date,
                   party_name, phone_office, phone_residence, mobile, email,
                   vat, cst, excise, gst, pan, party_name, add_line1, add_line2, city, state, pin,a.party_id
                   from purchase_order a
                   join party_master b on a.party_id=b.party_id
                   where po_id=:po_id";
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(':po_id', $data->po_id);
         $statement1->execute();
         $row=$statement1->fetch();
         $details=array();
         $details['party_name']=$row['party_name'];
         $details['party_id']=$row['party_id'];
         $details['quotatoin_ref']=$row['quotatoin_ref'];
         
         $address='';
         if($row['add_line1']!=''){
          $address=$row['add_line1'];
         }
         if($row['add_line2']!=''){
          if($address==''){
            $address=$row['add_line2'];
          }else{
            $address=$address.", ".$row['add_line2'];
          }
         }
         if($row['city']!=''){
          if($address==''){
            $address=$row['city'];
          }else{
            $address=$address.", ".$row['city'];
          }
         }

         if($row['state']!=''){
          if($address==''){
            $address=$row['state'];
          }else{
            $address=$address.", ".$row['state'];
          }
         }

         if($row['pin']!=''){
          if($address==''){
            $address=$row['pin'];
          }else{
            $address=" - ".$address.$row['pin'];
          }
         }

         $details['add_line1']=$row['add_line1'];
         $details['add_line2']=$row['add_line2'];
         $details['city']=$row['city'];
         $details['state']=$row['state'];
         $details['pin']=$row['pin'];

         $details['address']=$address;
         
         $tax_details='';
         if($row['vat']!=''){
          if($tax_details==''){
            $tax_details=$tax_details.'VAT:'.$row['vat'];
          }
         }
         if($row['cst']!=''){
          if($tax_details==''){
            $tax_details=$tax_details.'CST:'.$row['cst'];
          }else{
            $tax_details=$tax_details. " CST:".$row['cst'];
          }
         }
         $tax_details1='';
         if($row['excise']!=''){
          if($tax_details1==''){
            $tax_details1=$tax_details1.'EXCISE:'.$row['excise'];
          }else{
            $tax_details1=$tax_details1. " EXCISE:".$row['excise'];
          }
         }
         if($row['pan']!=''){
          if($tax_details1==''){
            $tax_details1=$tax_details1.'PAN:'.$row['pan'];
          }else{
            $tax_details1=$tax_details1. " EXCISE:".$row['pan'];
          }
         }

         if($row['gst']!=''){
          if($tax_details1==''){
            $tax_details1=$tax_details1.'GSTIN:'.$row['gst'];
          }
         }

         $details['vat']=$row['vat'];
         $details['cst']=$row['cst'];
         $details['pan']=$row['pan'];
         $details['excise']=$row['excise'];
         $details['gst']=$row['gst'];

         $details['tax_details']=$tax_details;
         $details['tax_details1']=$tax_details1;


         $details['po_id']=$row['po_id'];
         $details['po_no']=$row['po_no'];
         $details['po_date']=$row['po_date'];
         $details['remarks']=$row['remarks'];
         $details['stock_type_code']=$row['stock_type_code'];
         $details['total']=number_format($total,'3');

         if($other_charges==true){
          $details['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+8;
         }else{
          $details['colspan']=sizeof($dutyHeader)+sizeof($taxOneHeader)+sizeof($taxTwoHeader)+sizeof($cessHeader)+7;
         }

         if($p_and_f_charges==true){
          $details['colspan']=$details['colspan']+1;
         }
         
         $details['other_charges']=$other_charges;
         $details['p_and_f_charges']=$p_and_f_charges;

         $details['indent_ids']='';

         //Conditions
        $conditionArray=array(); 
        $qry="select condition_name
              from po_conditions a
              join condition_master b on a.condition_id=b.condition_id
              where po_id=:po_id";
        $stmt = $objPDO->prepare($qry);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->bindParam(':po_id', $data->po_id);
        $stmt->execute();
        $conditionArray=$stmt->fetchAll();
         

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['purchaseOrders']['materials'] = $materialsArray;
         $rdata['purchaseOrders']['details'] = $details;
         $rdata['purchaseOrders']['conditions'] = $conditionArray;
         $rdata['purchaseOrders']['dutyHeaders'] = $dutyHeader;
         $rdata['purchaseOrders']['taxOneHeaders'] = $taxOneHeader;
         $rdata['purchaseOrders']['taxTwoHeaders'] = $taxTwoHeader;
         $rdata['purchaseOrders']['cessHeaders'] = $cessHeader;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }



   public function readIndentsForPurchaseOrder($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query1 = "select indent_material_map_id, indent_id, item_name, uom_code,
                    po_qty as prev_po_qty, (qty-po_qty) as qty, unit_value, 
                    DATE_FORMAT(delivery_date,'%d/%m/%Y') as delivery_date,
                    party, a.remarks, a.material_id as item_id, stock, lp_price,
                    concat( concat(d.stock_type_code,'-'), d.docket_no) as last_docket_no
                    from indent_material_map a
                    join item_master b on a.material_id=b.item_id
                    left join item_last_purchase c on (a.material_id=c.item_id and a.financial_year_id=c.financial_year_id)
                    left join docket d on c.docket_id=d.docket_id
                    where indent_id=:indent_id and (qty-po_qty)>0";
                    //left join item_last_purchase c on a.material_id=c.item_id
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
 
         $rdata = array();
         $i=0;
         foreach ($data->indentIdArray as $value) {
           
           $statement1->bindParam(':indent_id', $value);
           $statement1->execute();

           foreach ($statement1->fetchAll() as $v) {
            $rdata[] = $v;
           }

         }

         $query = "select max(po_no) as po_no 
                   from purchase_order
                   where stock_type_code=:stock_type_code
                   and financial_year_id=:financial_year_id";
                           
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->execute();
         $poData= $statement->fetch();
         
         $data=array();
         $data['status'] = "s";
         $data['item'] = $rdata;
         $data['po_no'] = $poData['po_no']+1;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readPoNo($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select max(po_no) as po_no 
                   from purchase_order
                   where stock_type_code=:stock_type_code
                   and financial_year_id=:financial_year_id";
                           
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':stock_type_code', $d->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $poData= $statement->fetch();
         
         $data=array();
         $data['status'] = "s";
         $data['po_no'] = $poData['po_no']+1;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function addPurchaseOrderWithoutIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $po_date=implode("-", array_reverse(array_map('trim', explode("/", $data->po_date))));
         $query="select count(po_id) as po_no 
                 from purchase_order 
                 where po_date>:po_date 
                 and stock_type_code=:stock_type_code
                 and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);        
         $statement->setFetchMode(PDO::FETCH_ASSOC);    
         $statement->bindParam(':po_date', $po_date);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $total_po_no=$statement->fetch();

        if($total_po_no['po_no']==0){// any PO with older date not allowed for same stock type 
         
         $objPDO->beginTransaction();

         $query = "select max(po_no) as po_no 
                   from purchase_order
                   where stock_type_code=:stock_type_code
                   and financial_year_id=:financial_year_id";
                           
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $poData= $statement->fetch();
         $data->po_no=$poData['po_no']+1;


         $query = "Insert into purchase_order (financial_year_id,po_no,po_date,stock_type_code,party_id,
                   quotatoin_ref,remarks,po_without_indent,
                   creation_date, created_by, modification_date, modified_by)
                   values (:financial_year_id,:po_no,:po_date,:stock_type_code,:party_id,
                   :quotatoin_ref, :remarks, 'Y',
                   :creation_date, :created_by, :modification_date, :modified_by)";

         $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->bindParam(':po_no', $data->po_no);
         $statement->bindParam(":po_date",$po_date);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':party_id', $data->party_id);
         $statement->bindParam(':quotatoin_ref', $data->quotatoin_ref);
         $statement->bindParam(':remarks', $data->remarks);
         $statement->bindParam(':creation_date', $ts);
         $statement->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $po_id = $objPDO->lastInsertId();


        $query1 = "Insert into po_materials (financial_year_id,po_id, item_id, item_delivery_date,
                   po_qty, unit_value, discount_percentage, discount_amount, p_and_f_charges,
                   sub_total, duty_id, duty, amount_after_duty,
                   tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges,
                   item_total, description,
                   creation_date, created_by, modification_date, modified_by)
                   values(:financial_year_id,:po_id, :item_id, :item_delivery_date,
                   :po_qty, :unit_value, :discount_percentage,:discount_amount, :p_and_f_charges, 
                   :sub_total, :duty_id, :duty, :amount_after_duty,
                   :tax_one_id, :tax_one, :tax_two_id, :tax_two, :cess_id, :cess, :other_charges,
                   :item_total, :description,
                   :creation_date, :created_by, :modification_date, :modified_by)";

         $statement1 = $objPDO->prepare($query1);
         foreach ($data->materialArray as $value) {
           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->bindParam(':po_id', $po_id);
           $statement1->bindParam(':item_id', $value->item_id);

           $delivery_date=implode("-", array_reverse(array_map('trim', explode("/", $value->delivery_date))));
           $statement1->bindParam(":item_delivery_date",$delivery_date);

           $statement1->bindParam(':po_qty', $value->po_qty);
           $statement1->bindParam(':unit_value', $value->unit_value);
           $statement1->bindParam(':discount_percentage', $value->discount_percentage);
           $statement1->bindParam(':discount_amount', $value->discount_amount);
           $statement1->bindParam(':p_and_f_charges', $value->p_and_f);
           $statement1->bindParam(':sub_total', $value->sub_total);
           $statement1->bindParam(':duty_id', $value->duty_id);
           $statement1->bindParam(':duty', $value->duty);
           $statement1->bindParam(':amount_after_duty', $value->amount_after_duty);
           $statement1->bindParam(':tax_one_id', $value->tax_one_id);
           $statement1->bindParam(':tax_one', $value->tax_one);
           $statement1->bindParam(':tax_two_id', $value->tax_two_id);
           $statement1->bindParam(':tax_two', $value->tax_two);
           $statement1->bindParam(':cess_id', $value->cess_id);
           $statement1->bindParam(':cess', $value->cess);
           $statement1->bindParam(':other_charges', $value->other_charges);
           $statement1->bindParam(':item_total', $value->item_total);
           $statement1->bindParam(':description', $value->po_description);
           $statement1->bindParam(':creation_date', $ts);
           $statement1->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement1->bindParam(':modification_date', $ts);
           $statement1->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement1->execute();
         }

         $query2 = "Insert into po_conditions (financial_year_id, po_id, condition_id,
                   creation_date, created_by, modification_date, modified_by)
                   values (:financial_year_id, :po_id, :condition_id,
                   :creation_date, :created_by, :modification_date, :modified_by)";

         $statement2 = $objPDO->prepare($query2);
         foreach ($data->conditionArray as $value) {
           $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement2->bindParam(':po_id', $po_id);
           $statement2->bindParam(':condition_id', $value->condition_id);
           $statement2->bindParam(':creation_date', $ts);
           $statement2->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement2->bindParam(':modification_date', $ts);
           $statement2->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement2->execute();
         }
         
         $objPDO->commit();
         
         $rdata = array();
         $rdata['status'] = 's';
         $rdata['indent_id'] = $rdata;
         return $rdata;
        }else{
         $rdata = array();
         $rdata['status'] = "date_error";
         return $rdata;
        }   
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function addPurchaseOrder($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $po_date=implode("-", array_reverse(array_map('trim', explode("/", $data->po_date))));
         $query="select count(po_id) as po_no 
                 from purchase_order 
                 where po_date>:po_date 
                 and stock_type_code=:stock_type_code
                 and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);        
         $statement->setFetchMode(PDO::FETCH_ASSOC);    
         $statement->bindParam(':po_date', $po_date);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $total_po_no=$statement->fetch();

        if($total_po_no['po_no']==0){// any PO with older date not allowed for same stock type 
         
         $objPDO->beginTransaction();

         $query = "select max(po_no) as po_no 
                   from purchase_order
                   where stock_type_code=:stock_type_code
                   and financial_year_id=:financial_year_id";
                           
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $poData= $statement->fetch();
         $data->po_no=$poData['po_no']+1;
         

         $query = "Insert into purchase_order (financial_year_id,po_no,po_date,stock_type_code,party_id,
                   quotatoin_ref,remarks,po_without_indent,
                   creation_date, created_by, modification_date, modified_by)
                   values (:financial_year_id,:po_no, :po_date, :stock_type_code, :party_id, 
                   :quotatoin_ref, :remarks, 'N',
                   :creation_date, :created_by, :modification_date, :modified_by)";

         $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->bindParam(':po_no', $data->po_no);
         $statement->bindParam(":po_date",$po_date);
         $statement->bindParam(':stock_type_code', $data->stock_type_code); 
         $statement->bindParam(':party_id', $data->party_id);
         $statement->bindParam(':quotatoin_ref', $data->quotatoin_ref);
         $statement->bindParam(':remarks', $data->remarks);
         $statement->bindParam(':creation_date', $ts);
         $statement->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $po_id = $objPDO->lastInsertId();

        
        $query1 = "Insert into po_materials (financial_year_id, po_id, indent_material_map_id, 
                   indent_id, item_id,po_qty, unit_value,
                   discount_percentage, discount_amount, p_and_f_charges, sub_total,
                   duty_id, duty, amount_after_duty, 
                   tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges,
                   item_total, description,
                   creation_date, created_by, modification_date, modified_by)
                   values(:financial_year_id, :po_id, :indent_material_map_id,
                   :indent_id, :item_id, :po_qty, :unit_value,
                   :discount_percentage,:discount_amount,:p_and_f_charges, :sub_total, 
                   :duty_id, :duty, :amount_after_duty, 
                   :tax_one_id, :tax_one, :tax_two_id, :tax_two, :cess_id, :cess, :other_charges,
                   :item_total, :description,
                   :creation_date, :created_by, :modification_date, :modified_by)";

        $query2 = "update indent_material_map
                   set po_qty = :po_qty
                   where indent_material_map_id = :indent_material_map_id";           

         $ts = date('Y-m-d H:i:s');
         $statement1 = $objPDO->prepare($query1);
         $statement2 = $objPDO->prepare($query2);
         foreach ($data->materialArray as $value) {
           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->bindParam(':po_id', $po_id);
           $statement1->bindParam(':indent_material_map_id', $value->indent_material_map_id);
           $statement1->bindParam(':indent_id', $value->indent_id);
           $statement1->bindParam(':item_id', $value->item_id);
           $statement1->bindParam(':po_qty', $value->po_qty);
           $statement1->bindParam(':unit_value', $value->unit_value);
           $statement1->bindParam(':discount_percentage', $value->discount_percentage);
           $statement1->bindParam(':discount_amount', $value->discount_amount);
           $statement1->bindParam(':p_and_f_charges', $value->p_and_f);
           $statement1->bindParam(':sub_total', $value->sub_total);
           $statement1->bindParam(':duty_id', $value->duty_id);
           $statement1->bindParam(':duty', $value->duty);
           $statement1->bindParam(':amount_after_duty', $value->amount_after_duty);
           $statement1->bindParam(':tax_one_id', $value->tax_one_id);
           $statement1->bindParam(':tax_one', $value->tax_one);
           $statement1->bindParam(':tax_two_id', $value->tax_two_id);
           $statement1->bindParam(':tax_two', $value->tax_two);
           $statement1->bindParam(':cess_id', $value->cess_id);
           $statement1->bindParam(':cess', $value->cess);
           $statement1->bindParam(':other_charges', $value->other_charges);
           $statement1->bindParam(':item_total', $value->item_total);
           $statement1->bindParam(':description', $value->po_description);
           $statement1->bindParam(':creation_date', $ts);
           $statement1->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement1->bindParam(':modification_date', $ts);
           $statement1->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement1->execute();

           $po_qty=$value->po_qty + $value->prev_po_qty;
           $statement2->bindParam(':po_qty', $po_qty);
           $statement2->bindParam(':indent_material_map_id', $value->indent_material_map_id);
           $statement2->execute();
         }

         $query3 = "Insert into po_conditions (financial_year_id, po_id, condition_id,
                   creation_date, created_by, modification_date, modified_by)
                   values (:financial_year_id, :po_id, :condition_id,
                   :creation_date, :created_by, :modification_date, :modified_by)";

         $statement3 = $objPDO->prepare($query3);
         foreach ($data->conditionArray as $value) {
           $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement3->bindParam(':po_id', $po_id);
           $statement3->bindParam(':condition_id', $value->condition_id);
           $statement3->bindParam(':creation_date', $ts);
           $statement3->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement3->bindParam(':modification_date', $ts);
           $statement3->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement3->execute();
         }


         /*update indent for po_qty=indent_qty i.e all items for indent is converted in po start*/
         $query = "select distinct indent_id 
                   from po_materials
                   where po_id=:po_id";
                           
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $po_id);
         $statement->execute();
         $indentIds= $statement->fetchAll();
         
         foreach ($indentIds as $key => $v) {
             $query = "select count(indent_material_map_id) as id 
                       from indent_material_map
                       where qty-po_qty>0
                       and indent_id=:indent_id";
                               
             $statement = $objPDO->prepare($query);
             $statement->setFetchMode(PDO::FETCH_ASSOC);
             $statement->bindParam(':indent_id', $v['indent_id']);
             $statement->execute();
             $completed= $statement->fetch();
             if($completed['id']==0){
                 $query="update indents set completed=:completed
                 where indent_id=:indent_id";
                 $c='Y';
                 $statement = $objPDO->prepare($query);
                 $statement->bindParam(':completed', $c);
                 $statement->bindParam(':indent_id', $v['indent_id']);
                 $statement->execute();
             }
         }
         /*update indent for po_qty=indent_qty i.e all items for indent is converted in po end*/
         
         $objPDO->commit();
         
         $rdata = array();
         $rdata['status'] = 's';
         $rdata['indent_id'] = $rdata;
         return $rdata;
        }else{
         $rdata = array();
         $rdata['status'] = "date_error";
         return $rdata;
        } 
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function deletePurchaseOrder($data) {
      try{

         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         /*check if any docket is accepted fot this po*/

         $objPDO->beginTransaction();

         $query = "select count(docket_id) as total_docket_no
                  from docket
                  where po_id=:po_id";
         $details=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->execute();
         $docket=$statement->fetch();

         if($docket['total_docket_no']==0){

             if($data->po_without_indent=='N'){
               $query = "select indent_material_map_id, po_qty, indent_id
                        from po_materials
                        where po_id=:po_id";
               $details=array();
               $statement = $objPDO->prepare($query);
               $statement->setFetchMode(PDO::FETCH_ASSOC);
               $statement->bindParam(':po_id', $data->po_id);
               $statement->execute();
               $items=$statement->fetchAll();

               foreach ($items as $key=>$value) {

                 $query2 = "update indent_material_map
                           set po_qty = po_qty-:po_qty
                           where indent_material_map_id = :indent_material_map_id";
               
                 $statement2 = $objPDO->prepare($query2);
                 $statement2->bindParam(':po_qty', $value['po_qty']);
                 $statement2->bindParam(':indent_material_map_id', $value['indent_material_map_id']);
                 $statement2->execute();          
               }

               $query = "select distinct indent_id
                        from po_materials
                        where po_id=:po_id";
               $details=array();
               $statement = $objPDO->prepare($query);
               $statement->setFetchMode(PDO::FETCH_ASSOC);
               $statement->bindParam(':po_id', $data->po_id);
               $statement->execute();
               $indentIds=$statement->fetchAll();

               foreach ($indentIds as $key => $v) {
                   $query = "select count(indent_material_map_id) as id 
                             from indent_material_map
                             where qty-po_qty>0
                             and indent_id=:indent_id";
                                     
                   $statement = $objPDO->prepare($query);
                   $statement->setFetchMode(PDO::FETCH_ASSOC);
                   $statement->bindParam(':indent_id', $v['indent_id']);
                   $statement->execute();
                   $completed= $statement->fetch();
                   if($completed['id']!=0){
                       $query="update indents set completed=:completed
                       where indent_id=:indent_id";
                       $c='N';
                       $statement = $objPDO->prepare($query);
                       $statement->bindParam(':completed', $c);
                       $statement->bindParam(':indent_id', $v['indent_id']);
                       $statement->execute();
                   }
               }

             }

             $query = "delete from purchase_order
                     where po_id = :po_id";
             $statement = $objPDO->prepare($query);
             $statement->bindParam(':po_id', $data->po_id);
             $statement->execute();
         }
          

         
         $objPDO->commit();

         $rdata = array();
         $rdata['status'] = 's';
         $rdata['total_docket_no'] = $docket['total_docket_no'];
         return $rdata;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function completePO($data) {
    try{
       $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
       $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

       $query = "update purchase_order
                 set status=:status,
                 authorised_signatory=:authorised_signatory
                 where po_id = :po_id";
       $status='C';
       $statement = $objPDO->prepare($query);
       $statement->bindParam(':status', $status);
       $statement->bindParam(':po_id', $data->po_id);
       $statement->bindParam(':authorised_signatory', $_SESSION['NTC_USER_NAME']);
       if($_SESSION['NTC_USER_ID']=='avijitmaity'){
        $statement->execute();
        $rdata = array();
        $rdata['status'] = 's';
        return $rdata;  
       }else{
        $rdata = array();
        $rdata['status'] = 'e';
        return $rdata; 
       }
       

       
    }catch(PDOException $e){
       $objPDO = null;
       $error['error'] = $e->getMessage();
       return $error;
    }
 }


   public function readPurchaseOrderEdit($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         //purchase order details 
        $query = "select party_id, quotatoin_ref, remarks,
                  date_format(po_date, '%d/%m/%Y') as po_date
                  from purchase_order
                  where po_id=:po_id";
         $details=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->execute();
         $details=$statement->fetch();

         $query1 = "select distinct indent_material_map_id, indent_id, a.material_id as item_id, item_name,
                    uom_code, (qty-po_qty) as qty,
                    po_qty as prev_po_qty,  unit_value, 
                     DATE_FORMAT(delivery_date,'%d/%m/%Y') as delivery_date ,
                    party, remarks
                    from indent_material_map a
                    join item_master b on a.material_id=b.item_id
                    where indent_id=:indent_id and (qty-po_qty)>0
                    and financial_year_id=:financial_year_id";
         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
 
         $data1 = array();
         $i=0;
         foreach ($data->indentIdArray as $value) {
           $statement1->bindParam(':indent_id', $value);
           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->execute();

           foreach ($statement1->fetchAll() as $v) {
            $data1[] = $v;
           }
         }

        //materials 
         /*join indent_material_map b on (a.indent_material_map_id=b.indent_material_map_id
                                                  and a.financial_year_id=b.financial_year_id)*/
        $query = "select a.indent_material_map_id,  a.indent_id, b.material_id as item_id, item_name,
                  uom_code, (qty-b.po_qty) as qty, a.po_qty as po_materails_qty,
                  a.po_qty, b.po_qty as prev_po_qty, a.unit_value,
                  (a.po_qty*b.unit_value) as total_value,
                  discount_percentage, discount_amount,
                  p_and_f_charges as p_and_f, sub_total, duty_id, duty, amount_after_duty,
                  tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges,
                  item_total, description as po_description,
                  date_format(delivery_date, '%d/%m/%Y') as delivery_date, party, lp_price,
                  concat( concat(e.stock_type_code,'-'), e.docket_no) as last_docket_no
                  from po_materials a
                  join indent_material_map b on (a.indent_material_map_id=b.indent_material_map_id)
                  join item_master c on b.material_id = c.item_id
                  left join item_last_purchase d on (a.item_id=d.item_id and b.financial_year_id=d.financial_year_id)
                  left join docket e on d.docket_id=e.docket_id
                  and a.financial_year_id=:financial_year_id
                  where a.po_id=:po_id";
         $materialsArray=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $materialsArray=$statement->fetchAll();

          
         //$materialsArray=array();
         //merging two arrays to make one array

          foreach ($materialsArray as $k => $v) {
            $counter=0;
            foreach ($data1 as $k1 => $v1) {
              if($v['indent_material_map_id']==$v1['indent_material_map_id']){
                unset($data1[$k1]);
              }
            }
          }

         $m= array_merge($materialsArray,$data1);

        //conditions
        $conditions=array(); 
        $qry="select a.condition_id, condition_name
              from po_conditions a
              join condition_master b on a.condition_id=b.condition_id
              where po_id=:po_id";
        $stmt = $objPDO->prepare($qry);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->bindParam(':po_id', $data->po_id);
        $stmt->execute();
        $conditions=$stmt->fetchAll();
           

       $rdata = array();
       $rdata['status'] = "s";
       $rdata['purchaseOrders']['details'] = $details;
       $rdata['purchaseOrders']['materials'] = $m;
       $rdata['purchaseOrders']['selctedMaterials'] = $materialsArray;
       $rdata['purchaseOrders']['conditions'] = $conditions;
       return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function readPurchaseOrderEditWithoutIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*check if any docket is accepted fot this po*/
         $query = "select count(docket_id) as total_docket_no
                  from docket
                  where po_id=:po_id";
         $details=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->execute();
         $docket=$statement->fetch();
         
         //purchase order details 
        $query = "select party_id, quotatoin_ref, remarks,
                  date_format(po_date, '%d/%m/%Y') as po_date
                  from purchase_order
                  where po_id=:po_id";
         $details=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->execute();
         $details=$statement->fetch();

        //materials 
        $query = "select a.item_id as indent_material_map_id, a.item_id as indent_id,
                  a.item_id, item_name,
                  uom_code, a.po_qty as qty, a.po_qty as po_materails_qty,
                  a.po_qty, '' as prev_po_qty, a.unit_value,
                  (a.po_qty*a.unit_value) as total_value,
                  discount_percentage, discount_amount,
                  p_and_f_charges as p_and_f, sub_total, duty_id, duty, amount_after_duty,
                  tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges,
                  item_total, description as po_description,
                  date_format(item_delivery_date, '%d/%m/%Y') as delivery_date, lp_price,
                  concat( concat(e.stock_type_code,'-'), e.docket_no) as last_docket_no
                  from po_materials a
                  join item_master c on a.item_id = c.item_id
                  left join item_last_purchase d on (a.item_id=d.item_id and a.financial_year_id=d.financial_year_id)
                  left join docket e on d.docket_id=e.docket_id
                  and a.financial_year_id=:financial_year_id
                  where a.po_id=:po_id";
                            
         $materialsArray=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $materialsArray=$statement->fetchAll();
          
        //conditions
        $conditions=array(); 
        $qry="select a.condition_id, condition_name
              from po_conditions a
              join condition_master b on a.condition_id=b.condition_id
              where po_id=:po_id";
        $stmt = $objPDO->prepare($qry);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->bindParam(':po_id', $data->po_id);
        $stmt->execute();
        $conditions=$stmt->fetchAll();


         $rdata = array();
         $rdata['status'] = "s";
         $rdata['purchaseOrders']['details'] = $details;
         $rdata['purchaseOrders']['materials'] = $materialsArray;
         $rdata['purchaseOrders']['selctedMaterials'] = $materialsArray;
         $rdata['purchaseOrders']['conditions'] = $conditions;
         $rdata['purchaseOrders']['total_docket_no'] = $docket['total_docket_no'];
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function editPurchaseOrder($data) {
      try{

         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $objPDO->beginTransaction();
         
         $query = "update purchase_order set party_id=:party_id,
                   remarks=:remarks,
                   quotatoin_ref=:quotatoin_ref,
                   modification_date=:modification_date,
                   modified_by=:modified_by
                   where po_id=:po_id";

         $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':party_id', $data->party_id);
         $statement->bindParam(':remarks', $data->remarks);
         $statement->bindParam(':quotatoin_ref', $data->quotatoin_ref);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':po_id', $data->po_id);
         //$po_date=implode("-", array_reverse(array_map('trim', explode("/", $data->po_date))));
         //$statement->bindParam(":po_date",$po_date);
         $statement->execute();

         
         $query = "delete from po_materials
                   where po_id = :po_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":po_id", $data->po_id);
         $statement->execute();


         $query1 = "Insert into po_materials (financial_year_id, po_id, indent_material_map_id, 
                   indent_id, item_id,po_qty, unit_value,
                   discount_percentage, discount_amount, p_and_f_charges, sub_total,
                   duty_id, duty, amount_after_duty, 
                   tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges,
                   item_total, description,
                   creation_date, created_by, modification_date, modified_by)
                   values(:financial_year_id, :po_id, :indent_material_map_id,
                   :indent_id, :item_id, :po_qty, :unit_value,
                   :discount_percentage,:discount_amount,:p_and_f_charges, :sub_total, 
                   :duty_id, :duty, :amount_after_duty, 
                   :tax_one_id, :tax_one, :tax_two_id, :tax_two, :cess_id, :cess, :other_charges,
                   :item_total, :description,
                   :creation_date, :created_by, :modification_date, :modified_by)";          

         $query2 = "update indent_material_map
                   set po_qty = po_qty-:po_qty
                   where indent_material_map_id = :indent_material_map_id";           

         $statement1 = $objPDO->prepare($query1);
         $statement2 = $objPDO->prepare($query2);
         foreach ($data->materialArray as $value){
           if($value->selected){
             
             $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement1->bindParam(':po_id', $data->po_id);
             $statement1->bindParam(':indent_material_map_id', $value->indent_material_map_id);
             $statement1->bindParam(':indent_id', $value->indent_id);
             $statement1->bindParam(':item_id', $value->item_id);
             $statement1->bindParam(':po_qty', $value->po_qty);
             $statement1->bindParam(':unit_value', $value->unit_value);
             $statement1->bindParam(':discount_percentage', $value->discount_percentage);
             $statement1->bindParam(':discount_amount', $value->discount_amount);
             $statement1->bindParam(':p_and_f_charges', $value->p_and_f);
             $statement1->bindParam(':sub_total', $value->sub_total);
             $statement1->bindParam(':duty_id', $value->duty_id);
             $statement1->bindParam(':duty', $value->duty);
             $statement1->bindParam(':amount_after_duty', $value->amount_after_duty);
             $statement1->bindParam(':tax_one_id', $value->tax_one_id);
             $statement1->bindParam(':tax_one', $value->tax_one);
             $statement1->bindParam(':tax_two_id', $value->tax_two_id);
             $statement1->bindParam(':tax_two', $value->tax_two);
             $statement1->bindParam(':cess_id', $value->cess_id);
             $statement1->bindParam(':cess', $value->cess);
             $statement1->bindParam(':other_charges', $value->other_charges);
             $statement1->bindParam(':item_total', $value->item_total);
             $statement1->bindParam(':description', $value->po_description);
             $statement1->bindParam(':creation_date', $ts);
             $statement1->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
             $statement1->bindParam(':modification_date', $ts);
             $statement1->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
             $statement1->execute();

             
             //$po_qty=$value->po_qty - $value->po_materails_qty + $value->prev_po_qty; 
             $diff= $value->prev_po_qty-$value->po_qty;
             $statement2->bindParam(':po_qty', $diff);
             $statement2->bindParam(':indent_material_map_id', $value->indent_material_map_id);
             $statement2->execute();
           }else{
             $statement2->bindParam(':po_qty', $value->po_materails_qty);
             $statement2->bindParam(':indent_material_map_id', $value->indent_material_map_id);
             $statement2->execute();
           }
           
         }

         //po conditions
         $query = "delete from po_conditions
                   where po_id = :po_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":po_id", $data->po_id);
         $statement->execute();

         $query4 = "Insert into po_conditions (po_id, condition_id,
                   creation_date, created_by, modification_date, modified_by)
                   values (:po_id, :condition_id,
                   :creation_date, :created_by, :modification_date, :modified_by)";

         $ts = date('Y-m-d H:i:s');
         $statement4 = $objPDO->prepare($query4);
         foreach ($data->conditionArray as $value) {
           $statement4->bindParam(':po_id', $data->po_id);
           $statement4->bindParam(':condition_id', $value->condition_id);
           $statement4->bindParam(':creation_date', $ts);
           $statement4->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement4->bindParam(':modification_date', $ts);
           $statement4->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement4->execute();
         }

         /*update indent for po_qty=indent_qty i.e all items for indent is converted in po start*/
         $query = "select distinct indent_id 
                   from po_materials
                   where po_id=:po_id";
                           
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->execute();
         $indentIds= $statement->fetchAll();
         
         foreach ($indentIds as $key => $v) {
             $query = "select count(indent_material_map_id) as id 
                       from indent_material_map
                       where qty-po_qty>0
                       and indent_id=:indent_id";
                               
             $statement = $objPDO->prepare($query);
             $statement->setFetchMode(PDO::FETCH_ASSOC);
             $statement->bindParam(':indent_id', $v['indent_id']);
             $statement->execute();
             $completed= $statement->fetch();
             if($completed['id']==0){
                 $query="update indents set completed=:completed
                 where indent_id=:indent_id";
                 $c='Y';
                 $statement = $objPDO->prepare($query);
                 $statement->bindParam(':completed', $c);
                 $statement->bindParam(':indent_id', $v['indent_id']);
                 $statement->execute();
             }else if($completed['id']>0){
                 $query="update indents set completed=:completed
                 where indent_id=:indent_id";
                 $c='N';
                 $statement = $objPDO->prepare($query);
                 $statement->bindParam(':completed', $c);
                 $statement->bindParam(':indent_id', $v['indent_id']);
                 $statement->execute();
             }
         }
         /*update indent for po_qty=indent_qty i.e all items for indent is converted in po start*/

         $objPDO->commit();
         
         $rdata = array();
         $rdata['status'] = 's';
         $rdata['indent_id'] = $rdata;
         return $rdata;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function editPOWithoutIndent($data) {
      try{

         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $objPDO->beginTransaction();
         
         $query = "update purchase_order set party_id=:party_id,
                   remarks=:remarks,
                   quotatoin_ref=:quotatoin_ref,
                   modification_date=:modification_date,
                   modified_by=:modified_by
                   where po_id=:po_id";

         $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':party_id', $data->party_id);
         $statement->bindParam(':remarks', $data->remarks);
         $statement->bindParam(':quotatoin_ref', $data->quotatoin_ref);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->execute();
         
         $query = "delete from po_materials
                   where po_id = :po_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":po_id", $data->po_id);
         $statement->execute();
          
         //item_delivery_date 
         $query1 = "Insert into po_materials (financial_year_id,po_id, item_id,
                    po_qty,unit_value,
                    discount_percentage, discount_amount,
                    p_and_f_charges, sub_total, duty_id, duty, amount_after_duty,
                    tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, other_charges,
                    item_total, description,
                    creation_date, created_by, modification_date, modified_by)
                    values (:financial_year_id,:po_id, :item_id,
                    :po_qty, :unit_value,
                    :discount_percentage, :discount_amount,
                    :p_and_f_charges, :sub_total, :duty_id, :duty, :amount_after_duty,
                    :tax_one_id, :tax_one, :tax_two_id, :tax_two, :cess_id, :cess, :other_charges,
                    :item_total, :description,
                    :creation_date, :created_by, :modification_date, :modified_by)";
                  
         $statement1 = $objPDO->prepare($query1);
         foreach ($data->materialArray as $value){
           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->bindParam(':po_id', $data->po_id);
           $statement1->bindParam(':item_id', $value->item_id);
           $statement1->bindParam(':po_qty', $value->po_qty);
           $statement1->bindParam(':unit_value', $value->unit_value);
           $statement1->bindParam(':discount_percentage', $value->discount_percentage);
           $statement1->bindParam(':discount_amount', $value->discount_amount);
           $statement1->bindParam(':p_and_f_charges', $value->p_and_f);
           $statement1->bindParam(':sub_total', $value->sub_total);
           $statement1->bindParam(':duty_id', $value->duty_id);
           $statement1->bindParam(':duty', $value->duty);
           $statement1->bindParam(':amount_after_duty', $value->amount_after_duty);
           $statement1->bindParam(':tax_one_id', $value->tax_one_id);
           $statement1->bindParam(':tax_one', $value->tax_one);
           $statement1->bindParam(':tax_two_id', $value->tax_two_id);
           $statement1->bindParam(':tax_two', $value->tax_two);
           $statement1->bindParam(':cess_id', $value->cess_id);
           $statement1->bindParam(':cess', $value->cess);
           $statement1->bindParam(':other_charges', $value->other_charges);
           $statement1->bindParam(':item_total', $value->item_total);
           $statement1->bindParam(':description', $value->po_description);
           $statement1->bindParam(':creation_date', $ts);
           $statement1->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement1->bindParam(':modification_date', $ts);
           $statement1->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement1->execute(); 
         }

         $query = "delete from po_conditions
                   where po_id = :po_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":po_id", $data->po_id);
         $statement->execute();

         $query2 = "Insert into po_conditions (financial_year_id, po_id, condition_id,
                   creation_date, created_by, modification_date, modified_by)
                   values (:financial_year_id, :po_id, :condition_id,
                   :creation_date, :created_by, :modification_date, :modified_by)";

         $ts = date('Y-m-d H:i:s');
         $statement2 = $objPDO->prepare($query2);
         foreach ($data->conditionArray as $value) {
           $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement2->bindParam(':po_id', $data->po_id);
           $statement2->bindParam(':condition_id', $value->condition_id);
           $statement2->bindParam(':creation_date', $ts);
           $statement2->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement2->bindParam(':modification_date', $ts);
           $statement2->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement2->execute();
         }


         $objPDO->commit();
         
         $rdata = array();
         $rdata['status'] = 's';
         $rdata['indent_id'] = $rdata;
         return $rdata;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readIndentEdit($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         /*check if any docket is accepted fot this po*/
         $query = "select count(docket_id) as total_docket_no
                  from docket
                  where po_id=:po_id";
         $details=array();
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->execute();
         $docket=$statement->fetch(); 

         $query = "select indent_id, indent_no, indent_date, indent_type, department, a.stock_type_code,
                  stock_type, status, DATE_FORMAT(indent_date,'%d/%m/%Y') as indent_date_view
                  from indents a 
                  join stock_type_master b on a.stock_type_code=b.stock_type_code
                  join department_master c on a.department_code=c.department_code
                  where status=:status 
                  and indent_id in(select distinct indent_id from po_materials where po_id=:po_id)
                  UNION
                  select indent_id, indent_no, indent_date, indent_type, department, a.stock_type_code,
                  stock_type, status, DATE_FORMAT(indent_date,'%d/%m/%Y') as indent_date_view
                  from indents a 
                  join stock_type_master b on a.stock_type_code=b.stock_type_code
                  join department_master c on a.department_code=c.department_code
                  where status=:status and completed='N'
                  and financial_year_id=:financial_year_id";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':status', $data->indent_status);
         $statement->bindParam(':po_id', $data->po_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();

         $query1 = "select distinct indent_id
                  from po_materials
                  where po_id=:po_id";

         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(':po_id', $data->po_id);
         $statement1->execute();
         
         $rdata = array();
         $rdata['status'] = "s";
         //$rdata['docket_no'] = 0; //allow edit of PO in all cases
         $rdata['docket_no'] = $docket['total_docket_no'];
         $rdata['indents']['indents'] = $statement->fetchAll();
         $rdata['indents']['indentIds'] = $statement1->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

}
?>