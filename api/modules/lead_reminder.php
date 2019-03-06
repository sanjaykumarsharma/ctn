<?php
require_once 'conf.php';
require_once 'Notify.php';
  try{
     $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER , DB_PASS );
     $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
     date_default_timezone_set('Asia/Kolkata');
     $sd = date("Y-m-d");
     $ed = date('Y-m-d', strtotime($sd. ' + 1 days'));
     $query ="select name, remarks, email_id
              from lead_reminder a,
              lead_master b,
              system_user c
              where a.lead_id = b.lead_id
              and b.created_by = c.user_name
              and reminder_date between :sd and :ed
              and email_id is not null
              and email_id != ''";
     $statement = $objPDO->prepare($query);
     $statement->bindParam(':sd', $sd);
     $statement->bindParam(':ed', $ed);
     $statement->execute();
     $statement->setFetchMode(PDO::FETCH_ASSOC);
     $error = 1;
     while($row = $statement->fetch()){
     $error = 0;
      $email = array($row['email_id']);
      $remarks = $row['remarks'];
      $lead_name  = $row['name'];
      $sub = "Reminder for lead @Dinman ERP";
      $msg = "Reminder for lead: <strong>" . $lead_name ."</strong> .<br>Remarks:<br>" . $remarks;
      $notify = new Notify();
      $res = $notify->sendNotification($email, $sub, $msg);
      if($res == 1) echo "Reminder Mail sent:" . $row['email_id'];
      else echo "Mail not sent:" . $row['email_id'];
     }
     if($error == 1){
      echo "No reminders found.";
     }
  }catch(PDOException $e){
     $objPDO = null;
     $error = array();
     $error['error'] = $e->getMessage();
     return $error;
  }
?>