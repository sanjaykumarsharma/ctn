<?php
require_once 'conf.php';
class ReminderService
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
  public function addReminder($reminder)
	{
		$this->connect();
		  date_default_timezone_set('Asia/Kolkata');
      $dt = date("Y-m-d");
      $m_dt = date("Y-m-d H:i:s");
		try{
		 
		  $sql = "delete from lead_reminder
                where lead_id= :lead_id";
         $stmt = $this->objPDO->prepare($sql);
         $stmt->bindParam(':lead_id', $reminder->lead_id);
         $stmt->execute(); 
            
			$query ="insert into lead_reminder(lead_id, reminder_date, remarks, creation_date, modification_date, modified_by)
			    values(:lead_id,:reminder_date, :remarks, :creation_date, :modification_date, :modified_by)";
			
            $statement = $this->objPDO->prepare($query);
            $statement->bindParam(':lead_id', $reminder->lead_id);
            $statement->bindParam(':reminder_date', $reminder->reminder_date);
            $statement->bindParam(':remarks', $reminder->remarks);
            $statement->bindParam(':creation_date', $dt);
            $statement->bindParam(':modification_date', $m_dt);
		        $statement->bindParam(':modified_by', $_SESSION['user_id']);
            $statement->execute();
                 
            $status = array();
            $status['status'] ="success";
            return $status;
  		}catch(PDOException $e){
  			$this->objPDO = null;
  			$error['error'] = $e->getMessage();
        return $error;
  		//	throw new Exception($e->getMessage(), -1);
  		}
	}	
	
   public function readReminder($id){
   {
		$this->connect();         
		try{
			$query = "select  lead_id, date_format(reminder_date,'%d/%m/%Y')as reminder_date,remarks
                from lead_reminder
                where lead_id = :lead_id";
			$statement = $this->objPDO->prepare($query);
			$statement->bindParam(':lead_id', $id);
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
}
}
?>