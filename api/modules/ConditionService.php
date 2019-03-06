<?php
require_once 'conf.php';
class ConditionService{
   public function readConditions() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select condition_id, condition_name
                  from condition_master
                  order by condition_name";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['conditions'] = $statement->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   
   public function deleteCondition($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "delete from condition_master
                    where condition_id = :condition_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":condition_id", $data->condition_id);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function editCondition($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "update condition_master
                    set condition_name = :condition_name
                    where condition_id = :condition_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":condition_name", $data->condition_name);
         $statement->bindParam(":condition_id", $data->condition_id);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   
   public function addCondition($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $dt = date('Y-m-d H:i:s');

        $query = "Insert into condition_master (condition_name, 
                  creation_date, created_by,
                  modification_date, modified_by)
                  values (:condition_name,
                  :dt, :user, :dt, :user)";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":condition_name", $data->condition_name);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $condition_id = $objPDO->lastInsertId();
          $data = array();
          $data['status'] = "s";
          $data['condition_id'] = $condition_id;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
}
?>
