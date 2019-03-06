<?php
require_once 'conf.php';
class TaxService{
   public function readTaxes() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select tax_id, tax, tax_type, tax_rate, tax_group
                  from tax_master
                  order by tax";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['taxes'] = $statement->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function deleteTax($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "delete from tax_master
                    where tax_id = :tax_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":tax_id", $data->tax_id);
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

   public function editTax($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "update tax_master
                    set tax = :tax,
                    tax_type = :tax_type,
                    tax_rate = :tax_rate,
                    tax_group = :tax_group
                    where tax_id = :tax_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":tax", $data->tax);
         $statement->bindParam(":tax_type", $data->tax_type);
         $statement->bindParam(":tax_rate", $data->tax_rate);
         $statement->bindParam(":tax_group", $data->tax_group);
         $statement->bindParam(":tax_id", $data->tax_id);
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
   
   public function addTax($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $dt = date('Y-m-d H:i:s');

        $query = "Insert into tax_master (tax, tax_type, tax_rate, tax_group,
                  creation_date, created_by,
                  modification_date, modified_by)
                  values (:tax, :tax_type, :tax_rate, :tax_group,
                  :dt, :user, :dt, :user)";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":tax", $data->tax);
         $statement->bindParam(":tax_type", $data->tax_type);
         $statement->bindParam(":tax_rate", $data->tax_rate);
         $statement->bindParam(":tax_group", $data->tax_group);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $tax_id = $objPDO->lastInsertId();
          $data = array();
          $data['status'] = "s";
          $data['tax_id'] = $tax_id;
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
