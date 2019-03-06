<?php
require_once 'conf.php';
class UnitService
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
	public function addUnit($user)
	{
		$this->connect();
		date_default_timezone_set('Asia/Kolkata');
    $dt = date("Y-m-d");
    $m_dt = date("Y-m-d H:i:s");
		try{
			$query = "insert into unit_master(unit,creation_date,modification_date, modified_by)
				        values(:unit, :creation_date, :modification_date, :modified_by)";
			
            $statement = $this->objPDO->prepare($query);
	        $statement->bindParam(':unit', $user->unit);
	        $statement->bindParam(':creation_date', $dt);
          $statement->bindParam(':modification_date', $m_dt);
	        $statement->bindParam(':modified_by', $_SESSION['user_id']);
		    $statement->execute(); 
            $id = $this->objPDO->lastInsertId();        
			$wrapper = array();
			$wrapper['status'] = "success";
			$wrapper['id'] = $id;
        return $wrapper;
		}catch(PDOException $e){
			$this->objPDO = null;
			$status = array();
			$status['error'] = $e->getMessage();
			return $status;
		}
	}	
	 public function readUnit()
   {
		$this->connect();
		try{
			$query = "select unit_id,unit from unit_master";
					
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
	public function updateUnit($user)
	{
		$this->connect();
		date_default_timezone_set('Asia/Kolkata');
    $m_dt = date("Y-m-d H:i:s");
		try{
			$query = "update unit_master set unit =:unit,modification_date =:modification_date,
                modified_by=:modified_by
				        where unit_id=:unit_id";
				        
			$statement = $this->objPDO->prepare($query);
			$statement->bindParam(':unit', $user->unit);
			$statement->bindParam(':unit_id', $user->unit_id);
			$statement->bindParam(':modification_date', $m_dt);
		    $statement->bindParam(':modified_by', $_SESSION['user_id']);	
			$statement->execute();
			//return $name;
		 }catch(PDOException $e)
		 {
		    $this->objPDO = null;
			$status = array();
			$status['error'] = $e->getMessage();
			return $status;
    }
  }
			
	
	public function deleteUnit($id)
	{
		$this->connect();
		try{
			$query = "delete from unit_master
				where unit_id= :unit_id";
			$statement = $this->objPDO->prepare($query);
			$statement->bindParam(':unit_id', $id);
			$statement->execute();
			$status = array();
            $status['status'] = "success";
      return $status;
		}catch(PDOException $e){
			$this->objPDO = null;
			$status = array();
			$status['error'] = $e->getMessage();
			return $status;
		}
	} 
  
} 
?>