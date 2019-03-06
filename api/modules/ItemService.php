<?php
require_once 'conf.php';
class ItemService{
   public function readItems($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $condition = '';      
         if(property_exists($data, 'alphabet')){
          $alphabet=$data->alphabet; 
          if($alphabet=='All') $condition = '';
          else $condition = "and item_name like concat(:alphabet, '%')";
         } 

         $cond='';

         if($data->item_group_code!='' && $data->stock_type_code==''){
           $cond="a.item_group_code = :item_group_code and financial_year_id=:financial_year_id";
         }

         if($data->item_group_code=='' && $data->stock_type_code!=''){
           $cond="stock_type_code = :stock_type_code and financial_year_id=:financial_year_id";
         }

         if($data->item_group_code!='' && $data->stock_type_code!=''){
           $cond="a.item_group_code = :item_group_code
                   and stock_type_code = :stock_type_code and financial_year_id=:financial_year_id";
         }
         
        $query = "select a.item_id,  item_name, a.item_group_code, uom_code, item_group,
                 stock_type_code, item_description,
                 max_level, min_level, reorder_level, reorder_qty, location,
                 c.qty as stock
                 from item_master a
                 join item_group_master b on a.item_group_code = b.item_group_code
                 left join stock_in_hand c on a.item_id = c.item_id
                 where ".$cond." 
                 " . $condition . "
                 order by 2";         

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);

         if($data->item_group_code!='' && $data->stock_type_code==''){
           $statement->bindParam(":item_group_code", $data->item_group_code);
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         }

         if($data->item_group_code=='' && $data->stock_type_code!=''){
           $statement->bindParam(":stock_type_code", $data->stock_type_code);   
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         }

         if($data->item_group_code!='' && $data->stock_type_code!=''){
           $statement->bindParam(":item_group_code", $data->item_group_code);
           $statement->bindParam(":stock_type_code", $data->stock_type_code);   
           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         }
         
         if($condition != ''){
            $statement->bindParam(':alphabet', $alphabet);
         } 

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
          
          $tempRow['item_group_code'] = $value['item_group_code'];
          $tempRow['item_group'] = $value['item_group'];
          $tempRow['uom_code'] = $value['uom_code'];
          $tempRow['stock_type_code'] = $value['stock_type_code'];
          $tempRow['stock'] = $value['stock'];
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

   public function readItemsFilter($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
        $query = "select item_id, item_name
                 from item_master
                 order by 2";         

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);

         $statement->execute();
         $materials=$statement->fetchAll();
         $items=array();
         foreach ($materials as $key => $value) {
          $tempRow = array();
          $tempRow['item_id'] = $value['item_id']; 
          $tempRow['item_name'] = utf8_encode($value['item_name']);
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


   public function addItem($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $objPDO->beginTransaction();

         $query = "Insert into item_master (item_name, item_group_code, uom_code, location, stock_type_code, item_description, max_level, min_level, reorder_level, reorder_qty, 
           creation_date, created_by, modification_date, modified_by)
           values (:item_name, :item_group_code, :uom_code, :location, :stock_type_code, :item_description, :max_level, :min_level, :reorder_level, :reorder_qty, :creation_date, :created_by, :modification_date, :modified_by)";

        $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':item_name', $data->item_name);
         $statement->bindParam(':item_group_code', $data->item_group_code);
         $statement->bindParam(':uom_code', $data->uom_code);
         $statement->bindParam(':location', $data->location);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':item_description', $data->item_description);
         $statement->bindParam(':max_level', $data->max_level);
         $statement->bindParam(':min_level', $data->min_level);
         $statement->bindParam(':reorder_level', $data->reorder_level);
         $statement->bindParam(':reorder_qty', $data->reorder_qty);
         $statement->bindParam(':creation_date', $ts);
         $statement->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $item_id=$objPDO->lastInsertId();

         $query = "Insert into stock_in_hand (item_id, qty, financial_year_id)
                   values(:item_id, :qty, :financial_year_id)";

         $statement = $objPDO->prepare($query);
         $statement->bindParam(':item_id', $item_id);
         $qty=0.00;
         $statement->bindParam(':qty', $qty);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);     
         $statement->execute();

         $objPDO->commit();
         $rdata = array();
         $rdata['status'] = 's';
         $rdata['item_id'] = $objPDO->lastInsertId();
         return $rdata;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function editItem($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "update item_master
                    set 
                    item_name = :item_name,
                    item_group_code=:item_group_code,
                    uom_code=:uom_code,
                    location=:location,
                    stock_type_code=:stock_type_code,
                    item_description=:item_description, 
                    max_level=:max_level,
                    min_level=:min_level,
                    reorder_level=:reorder_level,
                    reorder_qty=:reorder_qty, 
                    modification_date = :modification_date,
                    modified_by = :modified_by
                    where item_id = :item_id";

         $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':item_id', $data->item_id);
         $statement->bindParam(':item_name', $data->item_name);
         $statement->bindParam(':item_group_code', $data->item_group_code);
         $statement->bindParam(':uom_code', $data->uom_code);
         $statement->bindParam(':location', $data->location);
         $statement->bindParam(':stock_type_code', $data->stock_type_code);
         $statement->bindParam(':item_description', $data->item_description);
         $statement->bindParam(':max_level', $data->max_level);
         $statement->bindParam(':min_level', $data->min_level);
         $statement->bindParam(':reorder_level', $data->reorder_level);
         $statement->bindParam(':reorder_qty', $data->reorder_qty);
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
   public function deleteItem($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "delete from item_master
                    where item_id = :item_id";
        $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':item_id', $data->item_id);
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

   public function readItemsForIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select item_id,  item_name, uom, a.uom_code
                  from item_master a 
                  left join uom_master b on a.uom_code=b.uom_code
                  order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['itemsForIndent'] = $statement->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
}
?>