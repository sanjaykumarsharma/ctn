<?php
require_once 'conf.php';
class LeadStatusService
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
   public function readLeadDetail($id){
      $this->connect();
      
      try{
         $query ="select  a.lead_id,name, source, city, nature,
                  address_line1, address_line2, city,state,zip, country,
                  phone, bag_type, bag_quantity,conversion_chance,
                  date_format(purchase_date,'%d/%m/%Y') as purchase_date,
                  conversion_chance,point_of_contacts 
                  from lead_master a, source_master c
                  where a.source_id = c.source_id
                  and a.lead_id = :lead_id";
         $statement = $this->objPDO->prepare($query);
         $statement->bindParam(':lead_id', $id);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $error = 1;
         $statement->execute();
         $leadData = array();
         while($lead = $statement->fetch()){
            $lead['pointofContacts'] = json_decode($lead['point_of_contacts']);
            $leadData[] = $lead;
           }
         //$std = $statement->fetchAll();
         return $leadData;
      }catch(PDOException $e){
         $this->objPDO = null;
         $error = array();
            $error['error'] = $e->getMessage();
        return $error;
      }
 } 
 public function readLeadStatus($id){
      $this->connect();
      try{
         $query ="select  lead_id, status, date_format(modification_date,'%d-%m-%Y %r') as status_date 
                 from lead_status_map
                 where lead_id = :lead_id 
                 order by modification_date desc";
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
// Read Payment Term Order wise
	public function readPaymentTermOrder($type)
   {
		$this->connect();
		try{
			$query = "select payment_term_id,payment_term
                from payment_terms_master
                where order_type=:order_type
                order by payment_term_id";
			$statement = $this->objPDO->prepare($query);
			$statement->bindParam(':order_type', $type);
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
 public function addLeadStatus($status){
  $this->connect();
  date_default_timezone_set('Asia/Kolkata');
  $dt = date("Y-m-d");
  $m_dt = date("Y-m-d H:i:s");
    try{
     $this->objPDO->beginTransaction();
     switch($status->type){
      case "Lead":
       
       $query ="insert into lead_status_map(lead_id, status, creation_date, modification_date, modified_by)
           value(:lead_id, :status, :creation_date, :modification_date, :modified_by)";
       
          $statement = $this->objPDO->prepare($query);
          $statement->bindParam(':lead_id', $status->lead_id);
          $statement->bindParam(':status',$status->status);
          $statement->bindParam(':creation_date', $dt);
          $statement->bindParam(':modification_date', $m_dt);
          $statement->bindParam(':modified_by', $_SESSION['user_id']);
          $statement->execute(); 
          $this->objPDO->commit();           
          return $status;
      break ;
      case "Contact":
         $s_code= "";
         $sql="select contact_id, short_code
                  from contact_master
                  order by 1 desc
                  limit 1";
			   $statement = $this->objPDO->prepare($sql);
			   $statement->setFetchMode(PDO::FETCH_ASSOC);
			   $statement->execute();
            if($val = $statement->fetch()){
            	$s_code = $val['short_code'];
            }
         if($s_code ==""){
            $short_code = "aa";
         }else
         {
           $s_code ++;
           $short_code = $s_code;
         }  
         $query ="insert into contact_master(short_code,company_name,company_nature,pointofContacts,
                  address_line1,address_line2,city, state,zip, country,same_as_billing,
                  f_address_line1,f_address_line2,f_city, f_state,f_zip, f_country, delivery_address,
                  land_phone,email, website,pan_no,vat_no,cst_no, contact_type,ecc_no,ranges,
                  division, commisionarate, c_period, interest, party_handler,party_handler_short_name,
                  parent_trader,created_by, creation_date, modification_date, modified_by)
            values(:short_code, :company_name, :company_nature,:pointofContacts,
                   :address_line1, :address_line2, :city, :state, :zip, :country,:same_as_billing,
                   :f_address_line1,:f_address_line2,:f_city, :f_state,:f_zip, :f_country,:delivery_address, 
                   :land_phone,:email, :website,:pan_no,:vat_no,:cst_no, :contact_type,
                   :ecc_no,:range, :division, :commisionarate, :c_period, :interest,:party_handler,:party_handler_short_name,
                   :parent_trader,:created_by, :creation_date, :modification_date, :modified_by)";
                  
            $statement = $this->objPDO->prepare($query);
            $statement->bindParam(':short_code', $short_code);
            $statement->bindParam(':company_name', $status->company_name);
            $statement->bindParam(':company_nature', $status->company_nature);
            $pointOfContact = json_encode($status->poc);
            $statement->bindParam(':pointofContacts', $pointOfContact);
            $statement->bindParam(':address_line1', $status->address_line1);
            $statement->bindParam(':address_line2', $status->address_line2);
            $statement->bindParam(':city', $status->city);
            $statement->bindParam(':state', $status->state);
            $statement->bindParam(':zip', $status->zip);
            $statement->bindParam(':country', $status->country);
            
            $statement->bindParam(':same_as_billing', $status->same_as_billing);
            $statement->bindParam(':f_address_line1', $status->f_address_line1);
            $statement->bindParam(':f_address_line2', $status->f_address_line2);
            $statement->bindParam(':f_city', $status->f_city);
            $statement->bindParam(':f_state', $status->f_state);
            $statement->bindParam(':f_zip', $status->f_zip);
            $statement->bindParam(':f_country', $status->f_country);
            
            $factory_address = json_encode($status->delivery_address);
            $statement->bindParam(':delivery_address', $factory_address);
            
            $statement->bindParam(':land_phone', $status->land_phone);
            $statement->bindParam(':email', $status->email);
            $statement->bindParam(':website', $status->website);
            $statement->bindParam(':pan_no', $status->pan_no);
            $statement->bindParam(':vat_no', $status->vat_no);
            $statement->bindParam(':cst_no', $status->cst_no);
            $statement->bindParam(':contact_type', $status->contact_type);
            
            $statement->bindParam(':ecc_no', $status->ecc_no);
            $statement->bindParam(':range', $status->range);
            $statement->bindParam(':division', $status->division);
            $statement->bindParam(':commisionarate', $status->commisionarate);
            $statement->bindParam(':c_period', $status->c_period);
            $statement->bindParam(':interest', $status->interest);
            $statement->bindParam(':party_handler', $status->party_handler);
            $statement->bindParam(':party_handler_short_name', $status->party_handler_short_name);

            $statement->bindParam(':parent_trader', $status->parent_trader);
            $statement->bindParam(':creation_date', $dt);
            $statement->bindParam(':modification_date', $m_dt);
            $statement->bindParam(':created_by', $_SESSION['user_id']);
            $statement->bindParam(':modified_by', $_SESSION['user_id']);
            $statement->execute();
            
            $query = "update lead_master set lead_status='C', converted_date='" . $m_dt . "'
                      where lead_id = :lead_id";
            $stmt = $this->objPDO->prepare($query);
            $stmt->bindParam(':lead_id', $status->lead_id);
            $stmt->execute();      
                     
            $status = array();
            $status['status'] ="success";
            $this->objPDO->commit();
            return $status;
      break;
    }
    }catch(PDOException $e){
       $this->objPDO->rollback();
       $this->objPDO = null;
       $error['error'] = $e->getMessage();
    return $error;
    }
 }
 public function deleteLeadStatus($status){
   $this->connect();
      try{
         $query ="delete from lead_status_map
            where lead_id= :lead_id
            and status = :status";
         $statement = $this->objPDO->prepare($query);
         $statement->bindParam(':lead_id', $status->lead_id);
          $statement->bindParam(':status',$status->status);
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
