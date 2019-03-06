<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'ntc_erp');
define('DB_USER', 'root');
define('DB_PASS', '');

/*define('DB_HOST', 'localhost');
define('DB_NAME', 'ntc_erp');
define('DB_USER', 'ntc_erp_user');
define('DB_PASS', 'ntc_erp@11');*/

function getConnection(){
   try{
       $con = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER , DB_PASS );
       $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
       return $con;
    }catch(PDOException $e){
       $con = null;
       throw new Exception("Unable to connect", -8);
    }
}



//getConnection();


  function format_number($num){
    $decimal_index = strpos($num, ".");
    if($decimal_index>0){
      $before_decimal = substr($num, 0, $decimal_index);
      $after_decimal = substr($num, $decimal_index+1);
    }else{
    $before_decimal = $num;
    $after_decimal = 0;
    }
    $count = 0;
    if($before_decimal<0){
       $num_receive = substr($before_decimal, 1);
    }else{
      $num_receive = $before_decimal;
    }
    $ch_array = str_split($num_receive);
    $new_str = array();
    for($i = count($ch_array)-1; $i>=0; $i--){
      $new_str[] = $ch_array[$i];
      if($count%2==0 && $count > 0){
        if($count != (count($ch_array)-1))
        $new_str[] = ",";
      }
      $count++;
    }
    $new_str = array_reverse ($new_str);
    $final = implode("", $new_str);
    if($after_decimal>0){
      $final .=  "." . substr($num, $decimal_index+1);
    }
    if($num<0){
      return '-'.$final;
    }else return $final;
  }
?>
