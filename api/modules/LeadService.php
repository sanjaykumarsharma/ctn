<?php
require_once 'conf.php';
//require_once 'Notify.php';
class LeadService
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
  public function addLead($lead)
   {
      //print_r($lead);
      //return;
      $this->connect();
      date_default_timezone_set('Asia/Kolkata');
      $dt = date("Y-m-d");
      $m_dt = date("Y-m-d H:i:s");
      try{
         $this->objPDO->beginTransaction();
         $query ="insert into lead_master(name,source_id,bag_type,bag_quantity,nature,
                  purchase_date,lead_status, conversion_chance, 
                  address_line1,address_line2,city,state,zip,country,phone,
                  point_of_contacts, active_date, creation_date, modification_date, modified_by, created_by)
             value(:name,:source_id, :bag_type, :bag_quantity,:nature, :purchase_date,
             :lead_status, :conversion_chance,:address_line1, :address_line2, :city, :state, :zip, 
             :country, :phone,:point_of_contacts, :active_date, :creation_date, :modification_date, :modified_by,:created_by)";
         
            $statement = $this->objPDO->prepare($query);
            $statement->bindParam(':name', $lead->name);
            $statement->bindParam(':source_id',$lead->source_id);
            $statement->bindParam(':bag_type',$lead->bag_type);
            $statement->bindParam(':bag_quantity',$lead->bag_quantity);
            $statement->bindParam(':nature',$lead->nature);
            $statement->bindParam(':purchase_date',$lead->purchase_date);
            $statement->bindParam(':lead_status',$lead->lead_status);
            $statement->bindParam(':conversion_chance',$lead->conversion_chance);
            $statement->bindParam(':address_line1',$lead->address_line1);
            $statement->bindParam(':address_line2',$lead->address_line2);
            $statement->bindParam(':city',$lead->city);
            $statement->bindParam(':state',$lead->state);
            $statement->bindParam(':zip',$lead->zip);
            $statement->bindParam(':country',$lead->country);
            $statement->bindParam(':phone',$lead->phone);
            
            $pointOfContact = json_encode($lead->poc);
            $statement->bindParam(':point_of_contacts', $pointOfContact);
            $statement->bindParam(':active_date', $m_dt);                  
            $statement->bindParam(':creation_date', $dt);
            $statement->bindParam(':modification_date', $m_dt);
            $statement->bindParam(':modified_by', $_SESSION['user_id']);
            $statement->bindParam(':created_by', $_SESSION['user_id']);
            $statement->execute();            
            $id = $this->objPDO->lastInsertId(); 
            
            //=============== Add Lead Stauts================
          $query1 ="insert into lead_status_map(lead_id, status, creation_date, modification_date, modified_by)
           value(:lead_id, :status, :creation_date, :modification_date, :modified_by)";
          $stmt = $this->objPDO->prepare($query1);
          $stmt->bindParam(':lead_id', $id);
          $stmt->bindParam(':status',$lead->status);
          $stmt->bindParam(':creation_date', $dt);
          $stmt->bindParam(':modification_date', $m_dt);
          $stmt->bindParam(':modified_by', $_SESSION['user_id']);
          $stmt->execute();
          $this->objPDO->commit();
          
          
         /*$notify = new Notify();
         $msg = "<p>A new Lead has been created as Lead Name :<b>" .$lead->name ."</b> by <b><em>" . $_SESSION['user_id'] . "</em></b> for bag type :<b>" . $lead->bag_type . ".</b> Quantity : <b>" . $lead->bag_quantity . 
         "</b> and Expected Purchase Date : <b>" . $lead->purchase_date . "</b>  with chance of Conversion: <b>" . $lead->conversion_chance . ".</b></p>";
         $msg .= "<p>You can view further details at - <a href='http://www.slicedmango.com/projects/dinman/#/lead'>Dinman ERP</a></p>";
         $st = $notify->sendNotification(array('manjeet@smitabh.com','erpreports@slicedmango.com'), 'New Lead created - Dinman ERP',   $msg);*/ 
                    
          $status = array();
          $status['status'] ="success";
          $status['id'] = $id;
          return $status;
      }catch(PDOException $e){
         $this->objPDO->rollback();
         $this->objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      // throw new Exception($e->getMessage(), -1);
      }
   }  
   
public function readLead() {
    $this->connect();
      try{
         if(!isset($_GET['stage'])) throw new PDOException("Please enter a valid Lead Stage");
         if(!isset($_GET['range'])) throw new PDOException("Please enter a valid range");
         if(!isset($_GET['sd'])) throw new PDOException("Please enter a valid Start Date");
         if(!isset($_GET['ed'])) throw new PDOException("Please enter a valid End Date");
         $ls = strip_tags(trim($_GET['stage']));
         $range = strip_tags(trim($_GET['range']));
         $sd = strip_tags(trim($_GET['sd']));
         $ed = strip_tags(trim($_GET['ed']));

         $endcondition = " and lead_status = :status ";
         if($range == 'YTD') $endcondition = $endcondition . " and year(a.creation_date) = year(curDate())";
         else $endcondition = $endcondition . " and a.creation_date between :sd and :ed";

         $condition ="";
         if($_SESSION['type'] != 'ADMIN' && $_SESSION['type'] != 'POWERUSER') $condition = " and a.created_by = :user ";
         $query ="select  a.lead_id,a.name, a.source_id, nature, source, bag_type,nature,
                  bag_quantity, date_format(purchase_date,'%d/%m/%Y') as purchase_date, lead_status,
                  a.created_by, date_format(a.creation_date	,'%d/%m/%Y') as creation_date,	
                  conversion_chance,address_line1,address_line2,city,state,zip,country,phone,point_of_contacts,
                  (select status from lead_status_map d where a.lead_id = d.lead_id and d.modification_date=(select max(d.modification_date) from lead_status_map d where a.lead_id = d.lead_id)) as status 
                  from lead_master a
                  left join source_master c on a.source_id = c.source_id
                  where 1 " . $condition . $endcondition . " 
                  group by a.lead_id
                  order by a.creation_date desc, 3";
         // echo $query;
         $statement = $this->objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         if($condition != "") $statement->bindParam(':user', $_SESSION['user_id']);
         $statement->bindParam(':status', $ls);
         if($range == 'DR'){
            $statement->bindParam(':sd', $sd);
            $statement->bindParam(':ed', $ed);
         }
         $error = 1;
         $statement->execute();
         $leadData = array();
         while($lead = $statement->fetch()){
            $lead['pointofContacts'] = json_decode($lead['point_of_contacts']);
            $leadData[] = $lead;
           }
         return $leadData;
         
         //$std = $statement->fetchAll();
         //return $std;
      }catch(PDOException $e){
         $this->objPDO = null;
         $error = array();
         $error['error'] = $e->getMessage();
         $wrapper[] = $error;
         return $wrapper;
      }
}
public function updateLead($lead){     
    $this->connect();
    date_default_timezone_set('Asia/Kolkata');
    $m_dt = date("Y-m-d H:i:s");
    try{
       if($lead->lead_status == 'A') $append = " active_date = '" . $m_dt . "'";
       else if($lead->lead_status == 'D') $append = " dormant_date = '" . $m_dt . "'";
       $query ="update lead_master set name=:name, source_id=:source_id,
                 bag_type=:bag_type, bag_quantity=:bag_quantity, nature=:nature,
                 purchase_date =:purchase_date,lead_status=:lead_status,
                 conversion_chance=:conversion_chance,
                 address_line1=:address_line1, address_line2=:address_line2, city=:city, state=:state,
                 zip=:zip, country=:country, phone=:phone, point_of_contacts=:point_of_contacts,
                 " . $append . " , modification_date =:modification_date, modified_by=:modified_by
                 where lead_id=:lead_id";      
          $statement = $this->objPDO->prepare($query);
          $statement->bindParam(':name', $lead->name);
          $statement->bindParam(':source_id',$lead->source_id);
          $statement->bindParam(':bag_type',$lead->bag_type);
          $statement->bindParam(':bag_quantity',$lead->bag_quantity);
          $statement->bindParam(':nature',$lead->nature);
          $statement->bindParam(':purchase_date',$lead->purchase_date);
          $statement->bindParam(':lead_status',$lead->lead_status);
          $statement->bindParam(':conversion_chance',$lead->conversion_chance);
          $statement->bindParam(':address_line1',$lead->address_line1);
          $statement->bindParam(':address_line2',$lead->address_line2);
          $statement->bindParam(':city',$lead->city);
          $statement->bindParam(':state',$lead->state);
          $statement->bindParam(':zip',$lead->zip);
          $statement->bindParam(':country',$lead->country);
          $statement->bindParam(':phone',$lead->phone);
          
          $pointOfContact = json_encode($lead->poc);
          $statement->bindParam(':point_of_contacts', $pointOfContact);
          $statement->bindParam(':modification_date', $m_dt);
          $statement->bindParam(':modified_by',$_SESSION['user_id']);
          $statement->bindParam(':lead_id', $lead->lead_id);
          
          $statement->execute();           
          $status = array();
          $status['status'] = "success";
          return $status;
     }catch(PDOException $e){
       $this->objPDO = null;
       $error['error'] = $e->getMessage();
       return $error;
   }
}
public function deleteLead($id)
 {
      $this->connect();
      try{
         $query = "delete from lead_master
            where lead_id= :lead_id";
         $statement = $this->objPDO->prepare($query);
         $statement->bindParam(':lead_id', $id);
         $statement->execute();
         $status = array();
         $status['status'] = "success";
         return $status;
      }catch(PDOException $e){
         $this->objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   } 
}
?>
