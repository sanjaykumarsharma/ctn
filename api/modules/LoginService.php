<?php
require_once 'conf.php';
class LoginService{
   public function checkLogin($user) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select user_id,username, role, name, user_code from system_user
           where username = :user_id and password = md5(:password)";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':user_id', $user->username);
         $statement->bindParam(':password', $user->password);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         if($des = $statement->fetch()){

            $query = "select id from financial_year_master
                      where status = 'active' limit 1";
            $statement = $objPDO->prepare($query);
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $statement->execute();
            $financial_year=$statement->fetch();

            $_SESSION['NTC_USER_ROLE'] = $des['role'];
            $_SESSION['NTC_USER_ID'] = $des['username'];
            $_SESSION['NTC_USER_CODE'] = $des['user_id'];
            $_SESSION['NTC_USER_NAME'] = $des['name'];
            $_SESSION['NTC_FINANCIAL_YEAR_ID'] = $financial_year['id'];

            $data = array();
            $data['status'] = "s";
            $data['role'] = $des['role'];
            $data['username'] = $des['username'];
            $data['name'] = $des['name'];
         }else {
           $data = array();
           $data['status'] = "s";
           $data['role'] = 'FAIL';
         }
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function changePassword($user) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "update system_user set password = md5(:new_password)
                   where username = :user_id and password = md5(:old_password)";

         $statement = $objPDO->prepare($query);
         $statement->bindParam(':user_id', $user->username);
         $statement->bindParam(':old_password', $user->old_password);
         $statement->bindParam(':new_password', $user->new_password);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $data = array();
         $data['status'] = "s";
         $data['count'] = $statement->rowCount();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function doLogout($user_id) {
      //if($user_id == $_SESSION['NTC_USER_ID']){
         $_SESSION = array();
         session_destroy();
     // }
   }
}
?>
