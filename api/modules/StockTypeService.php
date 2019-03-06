<?php
require_once 'conf.php';
class StockTypeService{
   public function readStockTypes() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select stock_type_id, stock_type_code, stock_type
                    from stock_type_master
                    order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['stock_types'] = $statement->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function deleteStockType($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "delete from stock_type_master
                    where stock_type_id = :stock_type_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":stock_type_id", $data->stock_type_id);
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

   public function editStockType($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "update stock_type_master
                    set stock_type_code = :stock_type_code,
                    stock_type = :stock_type
                    where stock_type_id = :stock_type_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);
         $statement->bindParam(":stock_type", $data->stock_type);
         $statement->bindParam(":stock_type_id", $data->stock_type_id);
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
   
   public function addStockType($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $dt = date('Y-m-d H:i:s');

        $query = "Insert into stock_type_master (stock_type_code, stock_type,
                  creation_date, created_by,
                  modification_date, modified_by)
                  values (:stock_type_code, :stock_type,
                  :dt, :user, :dt, :user)";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);
         $statement->bindParam(":stock_type", $data->stock_type);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $stock_type_id = $objPDO->lastInsertId();
          $data = array();
          $data['status'] = "s";
          $data['stock_type_id'] = $stock_type_id;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function readStockTypeDetails() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select stock_type_id, stock_type_code, stock_type
                    from stock_type_master
                    order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['stock_types'] = $statement->fetchAll();
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
