<?php
session_start();
include ('api/modules/conf.php');

error_reporting(E_ALL);
ini_set('display_errors', '1');


/*if(isset($_POST["submit"])) {
  var_dump($_FILES["fileToUpload"]);
    
}*/


if ($_FILES["fileToUpload"]["error"] > 0) {
    echo "ERROR: " . $_FILES["fileToUpload"]["error"] . "<br>";
}else if (($handle = fopen($_FILES["fileToUpload"]["tmp_name"], "r")) !== FALSE){
    $header = fgetcsv($handle); 
    //$header = fgetcsv($handle, 10000, ";"); 

    if(count($header) != 3) {
       echo "Invalid File header : " . count($header) . " -- Field Mismatch";
       exit (1);
    } 

   
    $fields = array("item_code","rate","qty");
    try{
        $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
        $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $objPDO->beginTransaction();
        $count=1;
        
        $dt = date('Y-m-d H:i:s');
        while (($row = fgetcsv($handle, 10000, ",")) !== FALSE) {
          //echo "<br>--------Data Row=". $count."--------<br>"; 
          $count++;
         if(count($row) != 3) {
            echo "<error>Invalid File</error>";
            exit (1);
         }
         $data=array_combine($fields, $row);
         //print_r($data);

         $qry="select item_id, location from item_master where 
               item_code='".$data['item_code']."'";
         $statement = $objPDO->prepare($qry);
         $statement->setFetchMode(PDO::FETCH_ASSOC);      
         $statement->execute();
         $itemid=$statement->fetch();   

        $opening_stock_date='2017-04-01';
        $remarks='';


        $query = "Insert into transaction (financial_year_id, item_id, transaction_type, qty, rate, location,
                   remarks, transaction_date,
                   creation_date, modification_date, modified_by)
                   values (:financial_year_id, :item_id, 'O', :qty, :rate, :location, :remarks, :transaction_date,
                   :dt, :dt, :user)";
         $statement = $objPDO->prepare($query);

         //update stock in hand start
         $query2 = "update stock_in_hand set qty=qty+:qty
                    where item_id=:item_id
                    and financial_year_id=:financial_year_id";
         $statement2 = $objPDO->prepare($query2);     

         //update transaction table running balance
         $query3="select running_balance as qty from transaction
                where item_id=:item_id
                and transaction_date<=:transaction_date
                and financial_year_id=:financial_year_id
                order by transaction_date desc, transaction_id desc limit 1";
         $statement3 = $objPDO->prepare($query3);
         $statement3->setFetchMode(PDO::FETCH_ASSOC);                            

         $query4="update transaction 
                  set running_balance=:running_balance
                  where transaction_id=:transaction_id";
         $statement4 = $objPDO->prepare($query4);

         //foreach ($m->materials as $value) {
           //reading running balance of same item on last transaction date
           $statement3->bindParam(':item_id', $itemid['item_id']);
           $statement3->bindParam(':transaction_date', $opening_stock_date);
           $statement3->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement3->execute();
           $qty=$statement3->fetch();

           $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement->bindParam(':item_id', $itemid['item_id']);
           $statement->bindParam(':qty', $data['qty']);
           $statement->bindParam(':rate', $data['rate']);
           $statement->bindParam(':location', $itemid['location']);
           $statement->bindParam(':remarks', $remarks);
           $statement->bindParam(':transaction_date', $opening_stock_date);
           $statement->bindParam(":dt", $dt);
           $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
           $statement->execute();
           $transaction_id = $objPDO->lastInsertId();

           //update stock in hand start
           $statement2->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
           $statement2->bindParam(':item_id', $itemid['item_id']);
           $statement2->bindParam(':qty', $data['qty']);
           $statement2->execute();

           //update transaction table running balance
           $rb=$data['qty'];
           if($qty['qty']==''){
            $rb=$data['qty'];
           }else{
            $rb=$qty['qty']+$data['qty'];
           }


           $statement4->bindParam(':transaction_id', $transaction_id);
           $statement4->bindParam(':running_balance', $rb);
           $statement4->execute(); 

           //update running balace of every transaction of this item after this transaction date
             //update condition1
             $query5="update transaction 
                    set running_balance=running_balance+:running_balance
                    where transaction_date=:transaction_date
                    and item_id=:item_id
                    and transaction_id>:transaction_id
                    and financial_year_id=:financial_year_id";
             $statement5 = $objPDO->prepare($query5); 
             $statement5->bindParam(':running_balance', $data['qty']);
             $statement5->bindParam(':transaction_date', $opening_stock_date);
             $statement5->bindParam(':item_id', $itemid['item_id']);
             $statement5->bindParam(':transaction_id', $transaction_id);
             $statement5->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement5->execute();

             //update condition2
             $query6="update transaction 
                    set running_balance=running_balance+:running_balance
                    where transaction_date>:transaction_date
                    and item_id=:item_id
                    and financial_year_id=:financial_year_id";
             $statement6 = $objPDO->prepare($query6); 
             $statement6->bindParam(':running_balance', $data['qty']);
             $statement6->bindParam(':transaction_date', $opening_stock_date);
             $statement6->bindParam(':item_id', $itemid['item_id']);
             $statement6->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
             $statement6->execute();   
         //}
         
             
        }
        $objPDO->commit();
    }catch(PDOException $e){
        echo "ERROR: Failed to upload fileToUpload! " . $e->getMessage();
    }
}
?>