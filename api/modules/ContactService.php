<?php
require_once 'conf.php';
class ContactService
{
  public function addContact($data)
   {
      $con = getConnection();
      $con->beginTransaction();
      date_default_timezone_set('Asia/Kolkata');
      $dt = date("Y-m-d");
      $mdt = date("Y-m-d H:i:s");

      try{
        $query ="INSERT into contactMaster (companyName, mappingName, companyNature, contactType,
          eccNo, exciseRange, division, commisionerate,
          panNo, vatNo, cstNo, creditLimit, creditPeriod, interest,
          landPhone, email, website, partyHandler,
          creationDate, createdBy, modificationDate, modifiedBy)
          values (:companyName, :mappingName, :companyNature, :contactType,
            :eccNo, :exciseRange, :division, :commisionerate,
            :panNo, :vatNo, :cstNo, :creditLimit, :creditPeriod, :interest,
            :landPhone, :email, :website, :partyHandler,
            :creationDate, :createdBy, :modificationDate, :modifiedBy)";

        $contact = $data->contact;
        $statement = $con->prepare($query);
        $statement->bindParam(":companyName", $contact->companyName);
        $statement->bindParam(":mappingName", $contact->mappingName);
        $statement->bindParam(":companyNature", $contact->companyNature);
        $statement->bindParam(":contactType", $contact->contactType);
        $statement->bindParam(":eccNo", $contact->eccNo);
        $statement->bindParam(":exciseRange", $contact->exciseRange);
        $statement->bindParam(":division", $contact->division);
        $statement->bindParam(":commisionerate", $contact->commisionerate);
        $statement->bindParam(":panNo", $contact->panNo);
        $statement->bindParam(":vatNo", $contact->vatNo);
        $statement->bindParam(":cstNo", $contact->cstNo);
        $statement->bindParam(":creditLimit", $contact->creditLimit);
        $statement->bindParam(":creditPeriod", $contact->creditPeriod);
        $statement->bindParam(":interest", $contact->interest);
        $statement->bindParam(":landPhone", $contact->landPhone);
        $statement->bindParam(":email", $contact->email);
        $statement->bindParam(":website", $contact->website);
        $statement->bindParam(":partyHandler", $contact->partyHandler);
        $statement->bindParam(":creationDate", $mdt);
        $statement->bindParam(":createdBy", $_SESSION['NTC_USER_ID']);
        $statement->bindParam(":modificationDate", $mdt);
        $statement->bindParam(":modifiedBy", $_SESSION['NTC_USER_ID']);
        $statement->execute();
        $contactId = $con->lastInsertId();

        $query1 = "Insert into contactPOC (contactId, name, email, mobile, role)
          values (:contactId, :name, :email, :mobile, :role)";
        $statement1 = $con->prepare($query1);
        foreach($contact->poc as $poc){
          $statement1->bindParam(":contactId", $contactId);
          $statement1->bindParam(":name", $poc->name);
          $statement1->bindParam(":email", $poc->email);
          $statement1->bindParam(":mobile", $poc->mobile);
          $statement1->bindParam(":role", $poc->role);
          $statement1->execute();
        }

        $query2 = "INSERT into contactBillingAddress (contactId, addressLine1, addressLine2,
          city, state, zip, country)
          values (:contactId, :addressLine1, :addressLine2,
            :city, :state, :zip, :country)";
          $statement2 = $con->prepare($query2);
        foreach($contact->billingAddresses as $add){
          $statement2->bindParam(":contactId", $contactId);
          $statement2->bindParam(":addressLine1", $add->addressLine1);
          $statement2->bindParam(":addressLine2", $add->addressLine2);
          $statement2->bindParam(":city", $add->city);
          $statement2->bindParam(":state", $add->state);
          $statement2->bindParam(":zip", $add->zip);
          $statement2->bindParam(":country", $add->state);
          $statement2->execute();
        }

        $query3 = "INSERT into contactDeliveryAddress (contactId, addressLine1, addressLine2,
          city, state, zip, country)
          values (:contactId, :addressLine1, :addressLine2,
            :city, :state, :zip, :country)";
          $statement3 = $con->prepare($query3);
        foreach($contact->deliveryAddresses as $add){
          $statement3->bindParam(":contactId", $contactId);
          $statement3->bindParam(":addressLine1", $add->addressLine1);
          $statement3->bindParam(":addressLine2", $add->addressLine2);
          $statement3->bindParam(":city", $add->city);
          $statement3->bindParam(":state", $add->state);
          $statement3->bindParam(":zip", $add->zip);
          $statement3->bindParam(":country", $add->state);
          $statement3->execute();
        }
        $con->commit();
        $status = array();
        $status['status'] ="s";
        $status['contactId'] = $contactId;
        return $status;
      }catch(PDOException $e){
         $con->rollBack();
         $con = null;
         $status = array();
         $status['status'] ="e";
         $status['error'] = $e->getMessage();
         return $status;
      }
   }

   public function editContact($data){
     $con = getConnection();
     $con->beginTransaction();
     date_default_timezone_set('Asia/Kolkata');
     $dt = date("Y-m-d");
     $mdt = date("Y-m-d H:i:s");

     try{
       $query ="UPDATE contactMaster
          set companyName = :companyName,
          mappingName = :mappingName,
          companyNature = :companyNature,
          contactType = :contactType,
          eccNo = :eccNo,
          exciseRange = :exciseRange,
          division = :division,
          commisionerate = :commisionerate,
          panNo = :panNo,
          vatNo = :vatNo,
          cstNo = :cstNo,
          creditLimit = :creditLimit,
          creditPeriod = :creditPeriod,
          interest = :interest,
          landPhone = :landPhone,
          email = :email,
          website = :website,
          partyHandler = :partyHandler,
          modificationDate = :modificationDate,
          modifiedBy = :modifiedBy
          where contactId = :contactId";

       $contact = $data->contact;
       $statement = $con->prepare($query);
       $statement->bindParam(":companyName", $contact->companyName);
       $statement->bindParam(":mappingName", $contact->mappingName);
       $statement->bindParam(":companyNature", $contact->companyNature);
       $statement->bindParam(":contactType", $contact->contactType);
       $statement->bindParam(":eccNo", $contact->eccNo);
       $statement->bindParam(":exciseRange", $contact->exciseRange);
       $statement->bindParam(":division", $contact->division);
       $statement->bindParam(":commisionerate", $contact->commisionerate);
       $statement->bindParam(":panNo", $contact->panNo);
       $statement->bindParam(":vatNo", $contact->vatNo);
       $statement->bindParam(":cstNo", $contact->cstNo);
       $statement->bindParam(":creditLimit", $contact->creditLimit);
       $statement->bindParam(":creditPeriod", $contact->creditPeriod);
       $statement->bindParam(":interest", $contact->interest);
       $statement->bindParam(":landPhone", $contact->landPhone);
       $statement->bindParam(":email", $contact->email);
       $statement->bindParam(":website", $contact->website);
       $statement->bindParam(":partyHandler", $contact->partyHandler);
       $statement->bindParam(":modificationDate", $mdt);
       $statement->bindParam(":modifiedBy", $_SESSION['NTC_USER_ID']);
       $statement->bindParam(":contactId", $contact->contactId);
       $statement->execute();
       $contactId = $con->lastInsertId();

       $query1 = "DELETE FROM contactPOC where contactId = :contactId";
       $statement1 = $con->prepare($query1);
       $statement1->bindParam(":contactId", $contact->contactId);
       $statement1->execute();

       $query1 = "Insert into contactPOC (contactId, name, email, mobile, role)
         values (:contactId, :name, :email, :mobile, :role)";
       $statement1 = $con->prepare($query1);
       foreach($contact->poc as $poc){
         $statement1->bindParam(":contactId", $contact->contactId);
         $statement1->bindParam(":name", $poc->name);
         $statement1->bindParam(":email", $poc->email);
         $statement1->bindParam(":mobile", $poc->mobile);
         $statement1->bindParam(":role", $poc->role);
         $statement1->execute();
       }

       $query1 = "DELETE FROM contactBillingAddress where contactId = :contactId";
       $statement1 = $con->prepare($query1);
       $statement1->bindParam(":contactId", $contact->contactId);
       $statement1->execute();

       $query2 = "INSERT into contactBillingAddress (contactId, addressLine1, addressLine2,
         city, state, zip, country)
         values (:contactId, :addressLine1, :addressLine2,
           :city, :state, :zip, :country)";
         $statement2 = $con->prepare($query2);
       foreach($contact->billingAddresses as $add){
         $statement2->bindParam(":contactId", $contact->contactId);
         $statement2->bindParam(":addressLine1", $add->addressLine1);
         $statement2->bindParam(":addressLine2", $add->addressLine2);
         $statement2->bindParam(":city", $add->city);
         $statement2->bindParam(":state", $add->state);
         $statement2->bindParam(":zip", $add->zip);
         $statement2->bindParam(":country", $add->state);
         $statement2->execute();
       }

       $query1 = "DELETE FROM contactDeliveryAddress where contactId = :contactId";
       $statement1 = $con->prepare($query1);
       $statement1->bindParam(":contactId", $contact->contactId);
       $statement1->execute();

       $query3 = "INSERT into contactDeliveryAddress (contactId, addressLine1, addressLine2,
         city, state, zip, country)
         values (:contactId, :addressLine1, :addressLine2,
           :city, :state, :zip, :country)";
         $statement3 = $con->prepare($query3);
       foreach($contact->deliveryAddresses as $add){
         $statement3->bindParam(":contactId", $contact->contactId);
         $statement3->bindParam(":addressLine1", $add->addressLine1);
         $statement3->bindParam(":addressLine2", $add->addressLine2);
         $statement3->bindParam(":city", $add->city);
         $statement3->bindParam(":state", $add->state);
         $statement3->bindParam(":zip", $add->zip);
         $statement3->bindParam(":country", $add->state);
         $statement3->execute();
       }
       $con->commit();
       $status = array();
       $status['status'] ="s";
       return $status;
     }catch(PDOException $e){
        $con->rollBack();
        $con = null;
        $status = array();
        $status['status'] ="e";
        $status['error'] = $e->getMessage();
        return $status;
     }
  }
   public function readContacts($data){
   {
     $con = getConnection();
      $alphabet = $data->alphabet;
      if($alphabet == 'All') $condition = '1';
      else $condition = "a.companyName like concat(:alphabet, '%')";
      $access_condition = "";
      if($_SESSION['LSE_ROLE'] != 'ADMIN' && $_SESSION['LSE_ROLE'] != 'POWERUSER' && $_SESSION['LSE_ROLE'] != 'DIRECTOR' && $_SESSION['LSE_ROLE'] != 'REPORT' ){
        $access_condition = " and (a.createdBy = :user or a.partyHandlerShortName = :user_name) ";
      }
      try{
          $query = "select contactId, companyName, companyNature, email, website,
                  contactType
                  from contactMaster a
                   where " . $condition . $access_condition . "
            order by 2";
         $statement = $con->prepare($query);
          if($condition != '1'){
            $statement->bindParam(':alphabet', $alphabet);
         }
         if($access_condition != ""){
            $statement->bindParam(':user', $_SESSION['user_id']);
            $statement->bindParam(':user_name', $_SESSION['user_id']);
         }
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $error = 1;
         $statement->execute();
         $std = $statement->fetchAll();
         $composite = array();
         $composite['status'] = 's';
         $composite['contacts'] = $std;
         return $composite;
         //return $std;
      }catch(PDOException $e){
         $con = null;
         $error = array();
         $error['status'] = 'e';
         $error['error'] = $e->getMessage();
         return $error;
      }catch(Exception $e){
      	echo json_last_error();
      	echo $e->getMessage();
	}
   }
}
public function readSpecificContact($data){
   $con = getConnection();
      try{
         $query ="select contactId, companyName, mappingName, companyNature,
                  landPhone, email, website,
                  panNo, vatNo, cstNo, eccNo, salesTaxNo, exciseRange, division, commisionerate,
                  creditPeriod, creditLimit, interest, partyHandler, contactType
                  from contactMaster
                  where contactId = :contactId";
         $statement = $con->prepare($query);
         $statement->bindParam(':contactId', $data->contactId);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $ca = $statement->fetchAll();

         $query ="select pocId, name, email, mobile, role
                  from contactPOC
                  where contactId = :contactId
                  order by 2";
         $statement = $con->prepare($query);
         $statement->bindParam(':contactId', $data->contactId);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $pocs = $statement->fetchAll();
         if($pocs == null){
           $pocs[] = array("pocId"=>"-1");
         }
         $ca[0]['poc'] = $pocs;

         //billing addresses
         $query ="select addressId, addressLine1, addressLine2, city, state, zip, country
                  from contactBillingAddress
                  where contactId = :contactId";
         $statement = $con->prepare($query);
         $statement->bindParam(':contactId', $data->contactId);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $addresses = $statement->fetchAll();
         if($addresses == null){
           $addresses[] = array("addressId"=>"-1");
         }
         $ca[0]['billingAddresses'] = $addresses;

         //delivery addresses
         $query ="select addressId, addressLine1, addressLine2, city, state, zip, country
                  from contactDeliveryAddress
                  where contactId = :contactId";
         $statement = $con->prepare($query);
         $statement->bindParam(':contactId', $data->contactId);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $addresses = $statement->fetchAll();
         if($addresses == null){
           $addresses[] = array("addressId"=>"-1");
         }
         $ca[0]['deliveryAddresses'] = $addresses;

         $rdata['status'] = 's';
         $rdata['contact'] = $ca[0];
         return $rdata;
      }catch(PDOException $e){
         $con = null;
         $error = array();
         $error['status'] = 'e';
         $error['error'] = $e->getMessage();
         return $error;
      }
}

  public function deleteContact($data){
    $con = getConnection();
    try{
       $query = "delete from contactMaster
          where contactId= :contactId";
       $statement = $con->prepare($query);
       $statement->bindParam(':contactId', $data->contactId);
       $statement->execute();
       $status = array();
       $status['status'] = "s";
       return $status;
    }catch(PDOException $e){
      $con = null;
      $error = array();
      $error['status'] = 'e';
      $error['error'] = $e->getMessage();
      return $error;
    }
  }
}
?>
