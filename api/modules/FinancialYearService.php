<?php
require_once 'conf.php';
include ('dumper.php');
class FinancialYearService{
   public function readFinancialYear() {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select id, status, date_format(start_date,'%d/%m/%Y') as start_date, 
                  date_format(end_date,'%d/%m/%Y') as end_date
                  from financial_year_master
                  order by 2";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
          $data['financialYears'] = $statement->fetchAll();
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   public function deleteFinancialYear($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "delete from financial_year_master
                    where id = :id";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(":id", $data->id);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function editFinancialYear($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "update financial_year_master set start_date = :start_date,
                  end_date = :end_date
                  where id = :id";
         $statement = $objPDO->prepare($query);
         $start_date=implode("-", array_reverse(array_map('trim', explode("/", $data->start_date))));
         $statement->bindParam(":start_date", $start_date);

         $end_date=implode("-", array_reverse(array_map('trim', explode("/", $data->end_date))));
         $statement->bindParam(":end_date", $end_date);
         $statement->bindParam(":id", $data->id);
         $statement->execute();
          $data = array();
          $data['status'] = "s";
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

   public function activateFinancialYear($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $objPDO->beginTransaction();

         $query = "update financial_year_master set status='inactive'";
         $statement = $objPDO->prepare($query);
         $statement->execute();

         $query = "update financial_year_master set status='active'
                  where id = :id";

         $statement = $objPDO->prepare($query);
         $statement->bindParam(":id", $data->id);
         $statement->execute();      

         $objPDO->commit();   

         // $_SESSION = array();
         // session_destroy();

          $data = array();
          $data['status'] = "s";
         return $data;
      }catch(PDOException $e){
         $objPDO->rollback(); 
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
   
   public function addFinancialYear($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $dt = date('Y-m-d H:i:s');

        $query = "Insert into financial_year_master (status, start_date, end_date, 
                  creation_date, created_by, modified_by)
                  values ('inactive', :start_date, :end_date,
                  :dt, :user, :user)";
         $statement = $objPDO->prepare($query);
         
         $start_date=implode("-", array_reverse(array_map('trim', explode("/", $data->start_date))));
         $statement->bindParam(":start_date", $start_date);

         $end_date=implode("-", array_reverse(array_map('trim', explode("/", $data->end_date))));
         $statement->bindParam(":end_date", $end_date);
         $statement->bindParam(":dt", $dt);
         $statement->bindParam(":user", $_SESSION['NTC_USER_ID']);
         $statement->execute();
         $id = $objPDO->lastInsertId();
          $data = array();
          $data['status'] = "s";
          $data['id'] = $id;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }

public function dbBackup() {
  try{
    
      $dumper = Shuttle_Dumper::create(array(
        'host' => DB_HOST,
        'username' => DB_USER,
        'password' => DB_PASS,
        'db_name' => DB_NAME,
      ));
      $path='E:/ntc_db_backup/';
      $name=$path.date('d-m-Y').'_'.date("H-i-s").'_'.'ntc_erp.sql.gz';

      // dump the database to gzipped file
      $dumper->dump($name);

      // dump the database to plain text file
      // $dumper->dump('ntc_erp.sql');

      // $wp_dumper = Shuttle_Dumper::create(array(
      //  'host' => '',
      //  'username' => 'root',
      //  'password' => '',
      //  'db_name' => 'wordpress',
      // ));

      // Dump only the tables with wp_ prefix
      //$wp_dumper->dump('wordpress.sql', 'wp_');
      
      // $countries_dumper = Shuttle_Dumper::create(array(
      //  'host' => '',
      //  'username' => 'root',
      //  'password' => '',
      //  'db_name' => 'ntc_erp1',
      //  'include_tables' => array('country', 'city'), // only include those tables
      // ));
      // $countries_dumper->dump('world.sql.gz');

      // $dumper = Shuttle_Dumper::create(array(
      //  'host' => '',
      //  'username' => 'root',
      //  'password' => '',
      //  'db_name' => 'ntc_erp1',
      //  'exclude_tables' => array('city'), 
      // ));
      // $dumper->dump('world-no-cities.sql.gz');

      $data = array();
      $data['status'] = "s";
      return $data;

    }catch(Shuttle_Exception $e) {
      $error['status'] = "e";
      $error['error'] = $e->getMessage();
      return $error;
      // echo "Couldn't dump database: " . $e->getMessage();
    }
}

public function dbStore() {
  try{
        /*
         update party_master a
         join party_master1 b on a.party_id=b.party_id
         set a.party_name=b.party_name,
         a.add_line1=b.add_line1,
         a.add_line2=b.add_line2,
         a.city=b.city,
         a.state=b.state
         */

         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
               
          $query = "select party_id, party_name, add_line1, add_line2, city, state, email
                    from party_master
                    order by party_name";
         
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $p=$statement->fetchAll();
         $pdatas=array();
         foreach ($p as $key => $value) {
           $query = "update party_master
                    set party_name = :party_name,
                    add_line1=:add_line1,
                    add_line2=:add_line2,
                    city=:city,
                    state=:state
                    where party_id = :party_id";
           $statement = $objPDO->prepare($query);
           $party_name = utf8_encode($value['party_name']);
           $statement->bindParam(':party_name', $party_name);
           $add_line1 = utf8_encode($value['add_line1']);
           $statement->bindParam(':add_line1', $add_line1);
           $add_line2 = utf8_encode($value['add_line2']);
           $statement->bindParam(':add_line2', $add_line2);
           $city = utf8_encode($value['city']);
           $statement->bindParam(':city', $city);
           $state = utf8_encode($value['state']);
           $statement->bindParam(':state', $state);
           $statement->bindParam(':party_id', $value['party_id']);
           $statement->execute();
         } 

         $query = "select item_id, item_name, item_description
                    from item_master
                    order by item_id";
         
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $p=$statement->fetchAll();
         $pdatas=array();
         foreach ($p as $key => $value) {
           $query = "update item_master
                    set item_name = :item_name,
                    item_description=:item_description
                    where item_id = :item_id";
           $statement = $objPDO->prepare($query);
           $item_name = utf8_encode($value['item_name']);
           $statement->bindParam(':item_name', $item_name);
           $item_description = utf8_encode($value['item_description']);
           $statement->bindParam(':item_description', $item_description);
           $statement->bindParam(':item_id', $value['item_id']);
           $statement->execute();
         }
         $rdata = array();
         $rdata['status'] = "s";
         return $rdata;
      
  }catch(Shuttle_Exception $e) {
      $error['status'] = "e";
      $error['error'] = $e->getMessage();
      return $error;
      // echo "Couldn't dump database: " . $e->getMessage();
    }
}

public function dbRunningAmount() {
  try{
        $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
        $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
        $item_ids= array();
        $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                   from item_master a
                   join transaction b on a.item_id=b.item_id
                   where b.financial_year_id = 1';
                   //and b.item_id=14741

        $statement1 = $objPDO->prepare($query1);
        $statement1->setFetchMode(PDO::FETCH_ASSOC);
        $statement1->execute();
        $item_ids=$statement1->fetchAll();

         $report_data = array();
         foreach ($item_ids as $key => $value) {
                 $query = "select  o_qty, o_rate, o_amount, r_qty, r_rate, r_amount, i_qty, i_rate, i_amount, transaction_date, transaction_id, transaction_type, running_balance, running_amount, td, details
                           from
                           (
                              select a.item_id, item_name, qty as o_qty, rate as o_rate, (qty* rate) as o_amount,  '' as r_qty, '' as r_rate, '' as r_amount, '' as i_qty, '' as i_rate, '' as i_amount, transaction_date, transaction_id,
                              running_balance, transaction_type, running_amount,
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, stock_type_code, 'Opening' as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'O'

                              UNION

                              select a.item_id, item_name, '' as o_qty, '' as o_rate, '' as o_amount, qty as r_qty, rate as r_rate, (qty* rate) as r_amount,  '' as i_qty, '' as i_rate, '' as i_amount, transaction_date, transaction_id,
                              running_balance, transaction_type, running_amount,
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(c.stock_type_code, '-'), c.docket_no) as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join docket c on (a.docket_id = c.docket_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'R'

                              UNION

                              select a.item_id, item_name, '' as o_qty, '' as o_rate, '' as o_amount, '' as r_qty, '' as r_rate, '' as r_amount, qty as i_qty, rate as i_rate, (qty* rate) as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(c.stock_type_code, '-'), c.issue_no) as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join issue_to_department c on (a.issue_id = c.issue_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'I'

                              UNION

                              select a.item_id, item_name, '' as o_qty, '' as o_rate, '' as o_amount, reject_to_party_qty as r_qty, rate as r_rate, (reject_to_party_qty* rate) as r_amount , '' as i_qty, '' as i_rate, '' as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(concat(c.stock_type_code, '-'), c.reject_to_party_no),'-RP') as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join reject_to_party c on (a.reject_to_party_id = c.reject_to_party_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'RP'

                              UNION

                              select a.item_id, item_name, '' as o_qty, '' as o_rate, '' as o_amount, '' as r_qty, '' as r_rate, '' as r_amount, return_to_stock_qty as i_qty, rate as i_rate, (return_to_stock_qty* rate) as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(concat(c.stock_type_code, '-'), c.return_to_stock_no),'-RS') as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join return_to_stock c on (a.return_to_stock_id = c.return_to_stock_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'RS'
                              
                            ) a order by transaction_date asc, transaction_id asc";

             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rs=$statement->fetchAll();

                 $items = array();
                 $items['items'] = $rs;   
                 $report_data[] = $items;
             }


         // print_r($_SESSION['NTC_FINANCIAL_YEAR_ID']);
          //print_r($report_data);
         // var_dump($rs);

         foreach ($report_data as $key => $value) {
           $prev_running_amount=0;
           $prev_rb=0;
           $current_amount=0;
           $counter=0;
           foreach ($value['items'] as $key1 => $v1) {
             switch($v1['transaction_type']){
                case 'O':
                    $current_amount=$v1['o_amount'];
                    if($counter==0){
                      $counter=1;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                    }
                break;
                case 'I':
                    $rate=0;
                    if($counter==0){
                      $counter=1;
                      $current_amount=0;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                     }else{
                        if($prev_rb!=0){
                          $rate=number_format(($prev_running_amount/$prev_rb), 2, '.', '');
                          $current_amount=$v1['i_qty']*($rate);
                        }else{
                         $current_amount=0;
                        }
                       $ra=$prev_running_amount-$current_amount;
                       $prev_running_amount = $ra;
                       $prev_rb = $v1['running_balance'];
                    }
                    $query5="update transaction 
                          set rate = :rate
                          where transaction_id = :transaction_id";
                   $statement5 = $objPDO->prepare($query5); 
                   $statement5->bindParam(':transaction_id', $v1['transaction_id']);
                   $statement5->bindParam(':rate', $rate);
                   $statement5->execute(); 
                break;
                case 'R':
                    $current_amount=$v1['r_amount'];
                    if($counter==0){
                      $counter=1;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                     }else{
                      $ra=$prev_running_amount+$current_amount;
                      $prev_running_amount = $ra;
                      $prev_rb = $v1['running_balance'];
                    }
                break;
                case 'RP':
                    $current_amount=$v1['r_amount'];
                    if($counter==0){
                      $counter=1;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                     }else{
                      $ra=$prev_running_amount-$current_amount;
                      $prev_running_amount = $ra;
                      $prev_rb = $v1['running_balance'];
                    }
                break;
                case 'RS':
                    $rate=0;
                    if($counter==0){
                      $counter=1;
                      $current_amount=0;
                      $ra=$current_amount;
                      $prev_running_amount = $current_amount;
                      $prev_rb = $v1['running_balance'];
                     }else{
                        if($prev_rb!=0){
                          $rate=number_format(($prev_running_amount/$prev_rb), 2, '.', '');
                          $current_amount=$v1['i_qty']*($rate);
                        }else{
                         $current_amount=0;
                        }
                       $ra=$prev_running_amount+$current_amount;
                       $prev_running_amount = $ra;
                       $prev_rb = $v1['running_balance'];
                    }
                    $query5="update transaction 
                          set rate = :rate
                          where transaction_id = :transaction_id";
                   $statement5 = $objPDO->prepare($query5); 
                   $statement5->bindParam(':transaction_id', $v1['transaction_id']);
                   $statement5->bindParam(':rate', $rate);
                   $statement5->execute(); 
                break;
                // case 'AR':
                    
                // break;
            }

             $query6="update transaction 
                    set running_amount = :running_amount
                    where transaction_id = :transaction_id";
             $statement6 = $objPDO->prepare($query6); 
             $statement6->bindParam(':transaction_id', $v1['transaction_id']);
             $statement6->bindParam(':running_amount', $ra);
             $statement6->execute(); 
           }
         }
         // return;
         $r1data = array();
         $r1data['status'] = "s";
         $r1data['items'] = $report_data;
         return $r1data;
      }catch(Shuttle_Exception $e) {
      $error['status'] = "e";
      $error['error'] = $e->getMessage();
      return $error;
      // echo "Couldn't dump database: " . $e->getMessage();
    }
}


public function dbOpeningStock() {//create opening stock for new financial
  try{
        $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
        $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
        $item_ids= array();
        $query1 = 'select distinct a.item_id, item_name, a.stock_type_code, uom_code
                   from item_master a
                   join transaction b on a.item_id=b.item_id
                   where b.financial_year_id = 1';
                   //and b.item_id=14741

        $statement1 = $objPDO->prepare($query1);
        $statement1->setFetchMode(PDO::FETCH_ASSOC);
        $statement1->execute();
        $item_ids=$statement1->fetchAll();

         $report_data = array();
         foreach ($item_ids as $key => $value) {
                 $query = "select  item_id, o_qty, rate, o_amount, r_qty, r_amount, i_qty,  i_amount, transaction_date, transaction_id, running_balance, running_amount, td, details
                           from
                           (
                              select a.item_id, item_name, qty as o_qty, rate, FORMAT((qty* rate),2) as o_amount,  '' as r_qty, '' as r_amount, '' as i_qty,  '' as i_amount, transaction_date, transaction_id,
                              running_balance, transaction_type, running_amount,
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, stock_type_code, 'Opening' as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'O'

                              UNION

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, qty as r_qty, FORMAT((qty* rate),2) as r_amount,  '' as i_qty, '' as i_amount, transaction_date, transaction_id,
                              running_balance, transaction_type, running_amount,
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(c.stock_type_code, '-'), c.docket_no) as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join docket c on (a.docket_id = c.docket_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'R'

                              UNION

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, '' as r_qty, '' as r_amount, qty as i_qty, FORMAT((qty* rate),2) as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(c.stock_type_code, '-'), c.issue_no) as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join issue_to_department c on (a.issue_id = c.issue_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'I'

                              UNION

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, reject_to_party_qty as r_qty, FORMAT((reject_to_party_qty* rate),2) as r_amount , '' as i_qty, '' as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(concat(c.stock_type_code, '-'), c.reject_to_party_no),'-RP') as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join reject_to_party c on (a.reject_to_party_id = c.reject_to_party_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'RP'

                              UNION

                              select a.item_id, item_name, '' as o_qty, rate, '' as o_amount, '' as r_qty, '' as r_amount, return_to_stock_qty as i_qty, FORMAT((return_to_stock_qty* rate),2) as i_amount, transaction_date, transaction_id, 
                              running_balance, transaction_type, running_amount, 
                              date_format(transaction_date, '%d/%m/%Y') as td, 
                              uom_code, b.location, b.stock_type_code, concat(concat(concat(c.stock_type_code, '-'), c.return_to_stock_no),'-RS') as details
                              from transaction a
                              join item_master b on a.item_id = b.item_id
                              join return_to_stock c on (a.return_to_stock_id = c.return_to_stock_id and a.financial_year_id = c.financial_year_id)
                              where a.financial_year_id = 1
                              and a.item_id = :item_id
                              and transaction_type = 'RS'
                              
                            ) a order by transaction_date desc, transaction_id desc limit 1";

             
                 $statement = $objPDO->prepare($query);
                 $statement->setFetchMode(PDO::FETCH_ASSOC);
                 $statement->bindParam(':item_id', $value['item_id']);
                 $statement->execute();
                 $rs=$statement->fetchAll();

                 $items = array();
                 $items['items'] = $rs;   
                 $report_data[] = $items;
             }


         // print_r($_SESSION['NTC_FINANCIAL_YEAR_ID']);
          //print_r($report_data);
         // var_dump($rs);

         foreach ($report_data as $key => $val) {
           $prev_running_amount=0;
           $prev_rb=0;
           $current_amount=0;
           $counter=0;
           foreach ($val['items'] as $key1 => $v1) {
               /*insert into transaction (financial_year_id, item_id, qty, running_balance, transaction_date, transaction_type) 
 select '2', item_id, qty, qty, '2018-04-01', 'O' from stock_in_hand where financial_year_id=1 and item_id in(select item_id from item_master)*/

             $query6="Insert into transaction(financial_year_id, item_id, qty, running_balance,
                                              running_amount, rate, transaction_date, transaction_type) 
                      values(:financial_year_id, :item_id, :qty, :running_balance, :running_amount, :rate,
                        :transaction_date, :transaction_type)";
             $statement6 = $objPDO->prepare($query6); 
             $financial_year_id=2;
             $statement6->bindParam(':financial_year_id', $financial_year_id);
             $statement6->bindParam(':item_id', $v1['item_id']);
             $statement6->bindParam(':qty', $v1['running_balance']);
             $statement6->bindParam(':running_balance', $v1['running_balance']);
             $statement6->bindParam(':running_amount', $v1['running_amount']);
             $rate = 0;
             if($v1['running_balance']!=0){
                $rate = $v1['running_amount']/$v1['running_balance'];
             }
             
             $statement6->bindParam(':rate', $rate);
             $transaction_date='2018-04-01';
             $statement6->bindParam(':transaction_date', $transaction_date);
             $transaction_type='O';
             $statement6->bindParam(':transaction_type', $transaction_type);
             $statement6->execute(); 
             
             /*insert into stock_in_hand (item_id,qty,financial_year_id) select item_id,qty,'2' from stock_in_hand where financial_year_id=1*/

             $query7="Insert into stock_in_hand(item_id,qty,financial_year_id) 
                      values(:item_id,:qty,:financial_year_id)";
             $statement7 = $objPDO->prepare($query7); 
             $statement7->bindParam(':item_id', $v1['item_id']);
             $statement7->bindParam(':qty', $v1['running_balance']);
             $financial_year_id=2;
             $statement7->bindParam(':financial_year_id', $financial_year_id);
             $statement7->execute(); 

             /*SELECT a.item_id, a.qty, b.qty, running_balance, running_amount, rate FROM `transaction` a
join stock_in_hand b on (a.item_id=b.item_id and a.financial_year_id = b.financial_year_id)
 WHERE a.financial_year_id=2  and a.qty!=b.qty
order by 1*/
           }
         }
         // return;
         $r1data = array();
         $r1data['status'] = "s";
         $r1data['items'] = $report_data;
         return $r1data;
      }catch(Shuttle_Exception $e) {
      $error['status'] = "e";
      $error['error'] = $e->getMessage();
      return $error;
      // echo "Couldn't dump database: " . $e->getMessage();
    }
}




}
?>
