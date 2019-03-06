<?php
require_once 'conf.php';
class ActivityService{
   public function readActivities() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select activity_id, activity
                    from activity_master
                    order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['activities'] = $statement->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function deleteActivity($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "delete from activity_master
                    where activity_id = :activity_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":activity_id", $data->activity_id);
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
   public function editActivity($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "update activity_master
                    set activity = :activity
                    where activity_id = :activity_id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":activity", $data->activity);
         $statement->bindParam(":activity_id", $data->activity_id);
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
   public function addActivity($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $dt = date('Y-m-d H:i:s');

        $query = "Insert into activity_master (activity,
                  creation_date, created_by,
                  modification_date, modified_by)
                  values (:activity,
                  :dt, :user, :dt, :user)";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":activity", $data->activity);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $activity_id = $objPDO->lastInsertId();
          $data = array();
          $data['status'] = "s";
          $data['activity_id'] = $activity_id;
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
