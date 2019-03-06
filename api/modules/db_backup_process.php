<?php
require_once 'conf.php';
include ('dumper.php');


    
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

      // $data = array();
      // $data['status'] = "s";
      // return $data;



?>
