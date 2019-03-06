<?php
require_once 'conf.php';
class IndentService{
  /*insert into stock_in_hand (item_id,qty,financial_year_id) select item_id,qty,'2' from stock_in_hand where financial_year_id=1 */
   public function readItemsForIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select a.item_id,  a.item_name, a.item_group_code, uom_code, item_group,
                   a.stock_type_code, item_description,
                   max_level, min_level, reorder_level, reorder_qty, location,
                   stock, party_name, lp_price, lp_qty,
                   concat( concat(f.stock_type_code,'-'), f.docket_no) as last_docket_no
                   from item_master a
                   join item_group_master b on a.item_group_code = b.item_group_code
                   join (select qty as stock, item_id 
                        from stock_in_hand 
                        where financial_year_id=:financial_year_id) c on a.item_id = c.item_id

                   left join (select item_id,docket_id, lp_party_id, lp_price, lp_qty
                              from item_last_purchase 
                              where financial_year_id=:financial_year_id) d on a.item_id=d.item_id
                   left join party_master e on d.lp_party_id=e.party_id

                   left join docket f on d.docket_id=f.docket_id
                   where a.item_group_code = :item_group_code
                   and a.stock_type_code = :stock_type_code
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
          $tempRow['last_docket_no'] = $value['last_docket_no'];
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

   public function readIndentNo($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          
         $query = "select max(indent_no) as indent_no
                   from indents
                   where stock_type_code=:stock_type_code
                   and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':stock_type_code', $d->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);   
         $statement->execute();
         $IndentNoData= $statement->fetch();         
        
          $data = array();
          $data['status'] = "s";
          $data['indent_no'] = $IndentNoData['indent_no']+1;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function readIndents($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $condition='';
        if($data->stock_type!=''){
          $condition=" and a.stock_type_code='".$data->stock_type."' ";
        }  

        if($data->indent_status=='all'){
          $query = "select indent_id, indent_no,indent_type,
                  (
                  CASE 
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
                  where financial_year_id=:financial_year_id
                  " . $condition . "
                  order by  a.stock_type_code desc, indent_id desc";

           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);   
        }else{
           $query = "select indent_id, indent_no,indent_type,
                  (
                  CASE 
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
                  and financial_year_id=:financial_year_id
                  " . $condition . "
                  order by  a.stock_type_code desc, indent_id desc";

           $statement = $objPDO->prepare($query);
           $statement->setFetchMode(PDO::FETCH_ASSOC);
           $statement->bindParam(':status', $data->indent_status);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);   
        }
        
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

   public function readIndentEdit($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         /*check if indent is applied on any po*/ 
         $query = "select count(po_id) as total_po
                   from po_materials 
                   where indent_id=:indent_id";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':indent_id', $data->indent_id);
         $statement->execute();
         $po=$statement->fetch();


         $query = "select indent_id, indent_no, date_format(indent_date ,'%d/%m/%Y') as indent_date,
                  indent_type, department_code,
                  a.stock_type_code
                  from indents a 
                  where a.indent_id=:indent_id";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':indent_id', $data->indent_id);
         $statement->execute();

         $query1 = "select indent_material_map_id, item_name, uom_code, qty, unit_value, 
                    total_value, date_format(delivery_date, '%d/%m/%Y') as delivery_date,
                    party, remarks, a.material_id as item_id, stock
                    from indent_material_map a
                    join item_master b on a.material_id=b.item_id
                    where indent_id=:indent_id";

         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(':indent_id', $data->indent_id);
         $statement1->execute();

         $rdata = array();
         $rdata['status'] = "s";
         $rdata["total_po"] = $po['total_po'];
         $rdata["item"] = $statement->fetch();
         $rdata['item']["selectedMaterialsArray"] = $statement1->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function readIndentView($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select indent_id, indent_no, date_format(indent_date,'%d/%m/%Y') as indent_date,
                  (
                  CASE 
                      WHEN indent_type = 'N' THEN 'Normal'
                      WHEN indent_type = 'U' THEN 'Urgent'
                      WHEN indent_type = 'VU' THEN 'Very Urgent'
                      ELSE 1
                  END) AS indent_type,
                  a.department_code, department,
                  a.stock_type_code, stock_type,requested_by,approved_by,finalized_by
                  from indents a 
                  join department_master b on a.department_code=b.department_code
                  join stock_type_master c on a.stock_type_code=c.stock_type_code
                  where a.indent_id=:indent_id";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':indent_id', $data->indent_id);
         $statement->execute();

         $query1 = "select indent_material_map_id, b.item_id, item_name, uom_code, qty, unit_value, 
                    total_value, 
                    IF(delivery_date='0000-00-00','',date_format(delivery_date, '%d/%m/%Y')) as delivery_date,
                    a.remarks, a.material_id, stock, lp_price, lp_qty, party_name,
                    e.docket_no, e.stock_type_code
                    from indent_material_map a
                    join item_master b on a.material_id=b.item_id
                    left join (select item_id,lp_price, lp_qty, lp_party_id, docket_id
                              from item_last_purchase
                              where financial_year_id=:financial_year_id) c on a.material_id=c.item_id
                    left join party_master d on c.lp_party_id=d.party_id
                    left join docket e on c.docket_id=e.docket_id
                    where indent_id=:indent_id";

         $statement1 = $objPDO->prepare($query1);
         $statement1->setFetchMode(PDO::FETCH_ASSOC);
         $statement1->bindParam(':indent_id', $data->indent_id);
         $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);   
         $statement1->execute();

         $rdata = array();
         $rdata['status'] = "s";
         $rdata["item"] = $statement->fetch();
         $rdata['item']["materialArray"] = $statement1->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function addIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $indent_date=implode("-", array_reverse(array_map('trim', explode("/", $data->indent_date))));

         $query="select count(indent_id) as indent_no 
                 from indents 
                 where indent_date>:indent_date 
                 and stock_type_code=:stock_type_code
                 and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);        
         $statement->setFetchMode(PDO::FETCH_ASSOC);    
         $statement->bindParam(':indent_date', $indent_date);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $total_indent_no=$statement->fetch();

        if($total_indent_no['indent_no']==0){// any indent with older date not allowed for same stock type 
         $objPDO->beginTransaction();
         
         $query = "select max(indent_no) as indent_no
                   from indents
                   where stock_type_code=:stock_type_code
                   and financial_year_id=:financial_year_id";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $IndentNoData= $statement->fetch();
         $data->indent_no=$IndentNoData['indent_no']+1;


         $query = "Insert into indents (financial_year_id, indent_no, indent_date, indent_type, 
                   department_code, stock_type_code, 
                   creation_date, requested_by, created_by,  modified_by)
                   values (:financial_year_id, :indent_no, :indent_date, :indent_type, 
                   :department_code, :stock_type_code,
                   :creation_date, :requested_by, :created_by, :modified_by)";

         $ts = date('Y-m-d');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->bindParam(':indent_no', $data->indent_no);
         $statement->bindParam(':indent_date', $indent_date);
         $statement->bindParam(':indent_type', $data->indent_type);
         $statement->bindParam(':department_code', $data->department_code);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':creation_date', $ts);
         $statement->bindParam(':requested_by', $_SESSION['NTC_USER_NAME']);
         $statement->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $indent_id = $objPDO->lastInsertId();


        $query1 = "Insert into indent_material_map (financial_year_id, indent_id, material_id, qty,
                   unit_value, total_value, delivery_date, stock, remarks, 
                   creation_date, created_by, modified_by)
                   values (:financial_year_id, :indent_id, :material_id, :qty,
                   :unit_value, :total_value, :delivery_date, :stock, :remarks,
                   :creation_date, :created_by, :modified_by)";

         $ts = date('Y-m-d H:i:s');
         $statement1 = $objPDO->prepare($query1);
         foreach ($data->materialsArray as $value) {
           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->bindParam(':indent_id', $indent_id);
           $statement1->bindParam(':material_id', $value->item_id);
           $statement1->bindParam(':qty', $value->qty);
           $statement1->bindParam(':unit_value', $value->unit_value);
           $statement1->bindParam(':total_value', $value->total_value);

           $delivery_date=implode("-", array_reverse(array_map('trim', explode("/", $value->delivery_date))));
           $statement1->bindParam(':delivery_date', $delivery_date);
           $statement1->bindParam(':stock', $value->stock);
           $statement1->bindParam(':remarks', $value->remarks);
           $statement1->bindParam(':creation_date', $ts);
           $statement1->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement1->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement1->execute();
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

   public function editIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         $objPDO->beginTransaction();

         $query = "update indents
                   set indent_type = :indent_type,
                   department_code = :department_code,
                   stock_type_code = :stock_type_code,
                   modification_date = :modification_date,
                   modified_by = :modified_by
                   where indent_id = :indent_id";

         $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);

         $indent_date=implode("-", array_reverse(array_map('trim', explode("/", $data->indent_date))));
         //$statement->bindParam(':indent_date', $indent_date);

         $statement->bindParam(':indent_type', $data->indent_type);
         $statement->bindParam(':department_code', $data->department_code);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':indent_id', $data->indent_id);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
          
         $query2 = "delete from indent_material_map
                   where indent_id = :indent_id";

         $statement2 = $objPDO->prepare($query2);
         $statement2->bindParam(':indent_id', $data->indent_id);  
         $statement2->execute();
         
         $query1 = "Insert into indent_material_map (financial_year_id,indent_id, material_id, qty, 
                   unit_value, total_value,
                   delivery_date, stock,  remarks, 
                   creation_date, created_by, modification_date, modified_by)
                   values (:financial_year_id, :indent_id, :material_id, :qty,
                   :unit_value, :total_value,
                   :delivery_date, :stock, :remarks,
                   :creation_date, :created_by, :modification_date, :modified_by)";

         $ts = date('Y-m-d H:i:s');
         $statement1 = $objPDO->prepare($query1);
         foreach ($data->materialsArray as $value) {
           $statement1->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement1->bindParam(':indent_id', $data->indent_id);
           $statement1->bindParam(':material_id', $value->item_id);
           $statement1->bindParam(':qty', $value->qty);
           $statement1->bindParam(':unit_value', $value->unit_value);
           $statement1->bindParam(':total_value', $value->total_value);

           $delivery_date=implode("-", array_reverse(array_map('trim', explode("/", $value->delivery_date))));
           $statement1->bindParam(':delivery_date', $delivery_date);

           $statement1->bindParam(':stock', $value->stock);
           $statement1->bindParam(':remarks', $value->remarks);
           $statement1->bindParam(':creation_date', $ts);
           $statement1->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
           $statement1->bindParam(':modification_date', $ts);
           $statement1->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
           $statement1->execute();
         }
         
         $objPDO->commit();

         $rdata = array();
         $rdata['status'] = 's';
         return $rdata;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function deleteIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $objPDO->beginTransaction();
         
         $query = "delete from indent_material_map
                    where indent_id = :indent_id";

         $statement = $objPDO->prepare($query);
         $statement->bindParam(':indent_id', $data->indent_id);
         $statement->execute();

         $query1 = "delete from indents
                    where indent_id = :indent_id";

         $statement1 = $objPDO->prepare($query1);
         $statement1->bindParam(':indent_id', $data->indent_id);
         $statement1->execute();

         $objPDO->commit();

         $rdata = array();
         $rdata['status'] = 's';
         return $rdata;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function editIndentStatus($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         switch ($data->status) {
           case 'P':
                   $query = "update indents
                   set status = :status,
                   pending_date = :status_date,
                   pending_by = :authority_name,
                   pending_remarks = :status_change_remarks,
                   modification_date = :modification_date,
                   modified_by = :modified_by
                   where indent_id = :indent_id";
             break;
           case 'A':
                   $query = "update indents
                   set status = :status,
                   approval_date = :status_date,
                   approved_by = :authority_name,
                   approval_remarks = :status_change_remarks,
                   modification_date = :modification_date,
                   modified_by = :modified_by
                   where indent_id = :indent_id";
             break;  
           case 'R':
                   $query = "update indents
                   set status = :status,
                   rejection_date = :status_date,
                   rejected_by = :authority_name,
                   rejection_remarks = :status_change_remarks,
                   modification_date = :modification_date,
                   modified_by = :modified_by
                   where indent_id = :indent_id";
             break;
           case 'F':
                   $query = "update indents
                   set status = :status,
                   finaliz_date = :status_date,
                   finalized_by = :authority_name,
                   finaliz_remarks = :status_change_remarks,
                   modification_date = :modification_date,
                   modified_by = :modified_by
                   where indent_id = :indent_id";
             break;  
         }
         

         $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':status', $data->status);
         
         $status_date=implode("-", array_reverse(array_map('trim', explode("/", $data->status_date))));
         $statement->bindParam(':status_date', $status_date);
         $statement->bindParam(':authority_name', $data->authority_name);
         $statement->bindParam(':status_change_remarks', $data->status_change_remarks);
         $statement->bindParam(':indent_id', $data->indent_id);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
          
         $rdata = array();
         $rdata['status'] = 's';
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

          $query = "select a.item_id,  a.item_name, a.item_group_code, uom_code, item_group,
                   a.stock_type_code, item_description,
                   max_level, min_level, reorder_level, reorder_qty, location,
                   stock, party_name, lp_price, lp_qty,
                   concat( concat(f.stock_type_code,'-'), f.docket_no) as last_docket_no
                   from item_master a
                   join item_group_master b on a.item_group_code = b.item_group_code

                   join (select qty as stock, item_id 
                        from stock_in_hand 
                        where financial_year_id=:financial_year_id) c on a.item_id = c.item_id

                   left join (select item_id,docket_id, lp_party_id, lp_price, lp_qty
                              from item_last_purchase 
                              where financial_year_id=:financial_year_id) d on a.item_id=d.item_id
                
                   left join party_master e on d.lp_party_id=e.party_id

                   left join docket f on d.docket_id=f.docket_id
                   where (item_name " . $search_term . " or a.item_id=:item_id)
                   and a.stock_type_code='".$data->stock_type_code."' 
                   order by 2";          
                   
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':item_id', $data->search_term);
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
          $tempRow['last_docket_no'] = $value['last_docket_no'];
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

   public function fetchUserDetailsFromSessionForIndent() {
      try{
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['username'] = $_SESSION['NTC_USER_NAME'];
         $rdata['user_id'] = $_SESSION['NTC_USER_CODE'];
         return $rdata;
      }catch(PDOException $e){
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

}
?>