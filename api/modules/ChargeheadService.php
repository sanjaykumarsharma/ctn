<?php
require_once 'conf.php';
class ChargeheadService{
   public function readChargeheads() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select chargehead_id, chargehead_code, chargehead
                    from chargehead_master
                    order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['chargeheads'] = $statement->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function deleteChargehead($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "delete from chargehead_master
                    where chargehead_id = :chargehead_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":chargehead_id", $data->chargehead_id);
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

   public function editChargehead($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "update chargehead_master
                    set chargehead_code = :chargehead_code,
                    chargehead = :chargehead
                    where chargehead_id = :chargehead_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":chargehead_code", $data->chargehead_code);
         $statement->bindParam(":chargehead", $data->chargehead);
         $statement->bindParam(":chargehead_id", $data->chargehead_id);
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
   
   public function addChargehead($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $dt = date('Y-m-d H:i:s');

        $query = "Insert into chargehead_master (chargehead_code, chargehead,
                  creation_date, created_by,
                  modification_date, modified_by)
                  values (:chargehead_code, :chargehead,
                  :dt, :user, :dt, :user)";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":chargehead_code", $data->chargehead_code);
         $statement->bindParam(":chargehead", $data->chargehead);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $chargehead_id = $objPDO->lastInsertId();
          $data = array();
          $data['status'] = "s";
          $data['chargehead_id'] = $chargehead_id;
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
