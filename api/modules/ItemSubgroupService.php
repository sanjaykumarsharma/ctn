<?php
require_once 'conf.php';
class ItemSubgroupService{
   public function readItemSubgroups() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select item_subgroup_id, a.item_group_id, b.item_group, item_subgroup
                  from item_subgroup_master a,
                  item_group_master b
                  where a.item_group_id = b.item_group_id
                  order by 3, 4";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['item_subgroups'] = $statement->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function addItemSubgroup($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

          $query = "SELECT item_group from item_group_master
          where item_group_id = :item_group_id";
          $statement = $objPDO->prepare($query);
          $statement->bindParam(':item_group_id', $data->item_group_id);
          $statement->setFetchMode(PDO::FETCH_ASSOC);
          $statement->execute();
          $item_group = $statement->fetchColumn();

         $query = "Insert into item_subgroup_master (item_subgroup, item_group_id,
                    creation_date, created_by, modification_date, modified_by)
                    values (:item_subgroup, :item_group_id,
                    :creation_date, :created_by, :modification_date, :modified_by)";

        $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':item_subgroup', $data->item_subgroup);
         $statement->bindParam(':item_group_id', $data->item_group_id);
         $statement->bindParam(':creation_date', $ts);
         $statement->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $rdata = array();
         $rdata['status'] = 's';
         $rdata['item_subgroup_id'] = $objPDO->lastInsertId();
         $rdata['item_group'] = $item_group;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function editItemSubgroup($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "SELECT item_group from item_group_master
         where item_group_id = :item_group_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':item_group_id', $data->item_group_id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $item_group = $statement->fetchColumn();

         $query = "update item_subgroup_master
                    set item_subgroup = :item_subgroup,
                    item_group_id = :item_group_id,
                    modification_date = :modification_date,
                    modified_by = :modified_by
                    where item_subgroup_id = :item_subgroup_id";

        $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':item_subgroup_id', $data->item_subgroup_id);
         $statement->bindParam(':item_subgroup', $data->item_subgroup);
         $statement->bindParam(':item_group_id', $data->item_group_id);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $rdata = array();
         $rdata['status'] = 's';
         $rdata['item_group'] = $item_group;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function deleteItemSubgroup($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "delete from item_subgroup_master
                    where item_subgroup_id = :item_subgroup_id";

        $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':item_subgroup_id', $data->item_subgroup_id);
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
}
?>
