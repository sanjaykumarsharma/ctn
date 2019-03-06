<?php
require_once 'conf.php';
class PartyService{
   public function readParties() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

          $query = "select party_id, party_code, party_name, party_name as label, add_line1, add_line2, city, state, pin, phone_office, phone_residence, mobile, email, vat, cst, excise, gst, pan, 
            concat(COALESCE(add_line1,' '), ', ' , COALESCE(add_line2,' '), ', ' , COALESCE(city,' '), ', ', COALESCE(state,' '), ', ', COALESCE(pin,' ')) as address
            from party_master
            order by party_name";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $p=$statement->fetchAll();
         $pdatas=array();
         foreach ($p as $key => $value) {
          $tempRow = array();
          $tempRow['party_id'] = $value['party_id']; 
          $tempRow['party_code'] = utf8_encode($value['party_code']);
          $tempRow['party_name'] = utf8_encode($value['party_name']);
          $tempRow['label'] = utf8_encode($value['label']);
          $tempRow['add_line1'] = utf8_encode($value['add_line1']);
          $tempRow['add_line2'] = utf8_encode($value['add_line2']);
          $tempRow['city'] = utf8_encode($value['city']);
          $tempRow['state'] = utf8_encode($value['state']);
          $tempRow['pin'] = utf8_encode($value['pin']);
          $tempRow['phone_office'] = utf8_encode($value['phone_office']);
          $tempRow['phone_residence'] = utf8_encode($value['phone_residence']);
          $tempRow['mobile'] = utf8_encode($value['mobile']);
          $tempRow['email'] = utf8_encode($value['email']);
          $tempRow['vat'] = utf8_encode($value['vat']);
          $tempRow['cst'] = utf8_encode($value['cst']);
          $tempRow['excise'] = utf8_encode($value['excise']);
          $tempRow['gst'] = utf8_encode($value['gst']);
          $tempRow['pan'] = utf8_encode($value['pan']);
          $tempRow['address'] = utf8_encode($value['address']);
          $pdatas[] = $tempRow;
         } 
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['parties'] = $pdatas;
         $parties=array();
         foreach ($rdata['parties'] as $key => $value) {
             $tempRow = array();
             $tempRow['party_id'] = $value['party_id']; 
             $tempRow['party_name'] = utf8_encode($value['party_name']); 
             $parties[] = $tempRow;
         }
         // print_r($parties);
         $rdata['party'] = $parties;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function addParty($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "Insert into party_master (party_code, party_name, add_line1, add_line2, city, state, pin, phone_office, phone_residence, mobile, email, vat, cst, excise, gst, pan,
           creation_date, created_by, modification_date, modified_by)
           values (:party_code, :party_name, :add_line1, :add_line2, :city, :state, :pin, :phone_office,
               :phone_residence, :mobile, :email, :vat, :cst, :excise, :gst, :pan,:creation_date, :created_by, :modification_date, :modified_by)";

        $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':party_code', $data->party_code);
         $statement->bindParam(':party_name', $data->party_name);
         $statement->bindParam(':add_line1', $data->add_line1);
         $statement->bindParam(':add_line2', $data->add_line2);
         $statement->bindParam(':city', $data->city);
         $statement->bindParam(':state', $data->state);
         $statement->bindParam(':pin', $data->pin);
         $statement->bindParam(':phone_office', $data->phone_office);
         $statement->bindParam(':phone_residence', $data->phone_residence);
         $statement->bindParam(':mobile', $data->mobile);
         $statement->bindParam(':email', $data->email);
         $statement->bindParam(':vat', $data->vat);
         $statement->bindParam(':cst', $data->cst);
         $statement->bindParam(':excise', $data->excise);
         $statement->bindParam(':gst', $data->gst);
         $statement->bindParam(':pan', $data->pan);
         $statement->bindParam(':creation_date', $ts);
         $statement->bindParam(':created_by', $_SESSION['NTC_USER_ID']);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $rdata = array();
         $rdata['status'] = 's';
         $rdata['party_id'] = $objPDO->lastInsertId();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function editParty($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "update party_master
                    set party_code = :party_code,
                    party_name = :party_name,
                    add_line1=:add_line1,
                    add_line2=:add_line2,
                    city=:city,
                    state=:state, 
                    pin=:pin,
                    phone_office=:phone_office,
                    phone_residence=:phone_residence,
                    mobile=:mobile, 
                    email=:email,
                    vat=:vat, 
                    cst=:cst,
                    excise=:excise,
                    gst=:gst,
                    pan=:pan,           
                    modification_date = :modification_date,
                    modified_by = :modified_by
                    where party_id = :party_id";

         $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':party_id', $data->party_id);
         $statement->bindParam(':party_code', $data->party_code);
         $statement->bindParam(':party_name', $data->party_name);
         $statement->bindParam(':add_line1', $data->add_line1);
         $statement->bindParam(':add_line2', $data->add_line2);
         $statement->bindParam(':city', $data->city);
         $statement->bindParam(':state', $data->state);
         $statement->bindParam(':pin', $data->pin);
         $statement->bindParam(':phone_office', $data->phone_office);
         $statement->bindParam(':phone_residence', $data->phone_residence);
         $statement->bindParam(':mobile', $data->mobile);
         $statement->bindParam(':email', $data->email);
         $statement->bindParam(':vat', $data->vat);
         $statement->bindParam(':cst', $data->cst);
         $statement->bindParam(':excise', $data->excise);
         $statement->bindParam(':gst', $data->gst);
         $statement->bindParam(':pan', $data->pan);
         $statement->bindParam(':modification_date', $ts);
         $statement->bindParam(':modified_by', $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $rdata = array();
         $rdata['status'] = 's';
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function deleteParty($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "delete from party_master
                    where party_id = :party_id";
        $ts = date('Y-m-d H:i:s');
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':party_id', $data->party_id);
         $statement->execute();
         $rdata = array();
         $rdata['status'] = 's';
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
}
?>