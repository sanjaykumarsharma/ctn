<?php
require_once 'conf.php';
class UserService
{
  protected $objPDO;
   protected function connect()
   {
      try{
         $this->objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER , DB_PASS );
         $this->objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      }catch(PDOException $e){
         $this->objPDO = null;
         if($e->getCode() == -9) throw new Exception("Session Expired. Please relogin.", -9);
         throw new Exception("Unable to connect", -8);
      }
   }
public function addUser($user){
  $this->connect();
  date_default_timezone_set('Asia/Kolkata');
  $dt = date("Y-m-d");
  $m_dt = date("Y-m-d H:i:s");
  try{
     $query ="insert into system_user(first_name, last_name, email_id,
              mobile, user_name, password,role, creation_date, modification_date, modified_by)
         values(:first_name, :last_name,:email_id,
              :mobile, :user_name, md5(:password),:role, :creation_date, :modification_date, :modified_by)";
        $statement = $this->objPDO->prepare($query);
        $statement->bindParam(':first_name', $user->first_name);
        $statement->bindParam(':last_name', $user->last_name);
        $statement->bindParam(':email_id', $user->email_id);
        $statement->bindParam(':mobile', $user->mobile);
        $statement->bindParam(':user_name', $user->user_name);
        $pwd = 'password';
        $statement->bindParam(':password', $pwd);
        $statement->bindParam(':role', $user->role);
        $statement->bindParam(':creation_date', $dt);
        $statement->bindParam(':modification_date', $m_dt);
        $statement->bindParam(':modified_by', $_SESSION['user_id']);
        $statement->execute();     
        $id = $this->objPDO->lastInsertId();        
        $status = array();
        $status['status'] ="success";
        $status['id'] = $id;
        return $status;
  }catch(PDOException $e){
     $this->objPDO = null;
     $error['error'] = $e->getMessage();
  return $error;
  // throw new Exception($e->getMessage(), -1);
  }
}  
public function readUser(){
    $this->connect();
    try{

       $query = "select user_id, first_name, last_name, email_id,
                 mobile, user_name,role
                 from system_user
                 order by 2";
       $statement = $this->objPDO->prepare($query);
       $statement->setFetchMode(PDO::FETCH_ASSOC);
       $error = 1;
       $statement->execute();
       $std = $statement->fetchAll();
       return $std;
    }catch(PDOException $e){
       $this->objPDO = null;
       $error = array();
          $error['error'] = $e->getMessage();
      return $error;
    }
}

public function updateUser($user){
    $this->connect();
    try{
    date_default_timezone_set('Asia/Kolkata');
    $m_dt = date("Y-m-d H:i:s");
    switch($user->type){
      case "Edit":
       $query = "update system_user set first_name =:first_name, last_name =:last_name,
                 email_id =:email_id, mobile =:mobile, role=:role, 
                 modification_date=:modification_date, modified_by=:modified_by
                 where user_id=:user_id";      
            
            $statement = $this->objPDO->prepare($query);
            $statement->bindParam(':first_name', $user->first_name);
            $statement->bindParam(':last_name', $user->last_name);
            $statement->bindParam(':email_id', $user->email_id);
            $statement->bindParam(':mobile', $user->mobile);
            $statement->bindParam(':role', $user->role);
            $statement->bindParam(':user_id', $user->user_id);
            $statement->bindParam(':modification_date', $m_dt);
            $statement->bindParam(':modified_by',$_SESSION['user_id']);
            $statement->execute();  
           
            $status = array();
            $status['status'] = "success";
            return $status;
      break;
      case "Reset":      
          $query ="update system_user set password=md5('password'),
                  modification_date=:modification_date, modified_by=:modified_by 
                  where user_id=:user_id";      
            $statement = $this->objPDO->prepare($query);
            $statement->bindParam(':user_id', $user->user_id);
            $statement->bindParam(':modified_by',$_SESSION['user_id']);
            $statement->bindParam(':modification_date', $m_dt);
            $statement->execute();           
            $status = array();
            $status['status'] = "success";
            return $status;
      break; 
      } 
     }catch(PDOException $e)
     {
      $this->objPDO = null;
       throw new Exception($e->getMessage(), -1);
  }
}
public function deleteUser($id){
  $this->connect();
  try{
     $query = "delete from system_user
        where user_id= :user_id";
     $statement = $this->objPDO->prepare($query);
     $statement->bindParam(':user_id', $id);
     $statement->execute();
     $status = array();
  $status['status'] = "success";
  return $status;
  }catch(PDOException $e){
     $this->objPDO = null;
     throw new Exception($e->getMessage(), -1);
  }
} 
}
?>