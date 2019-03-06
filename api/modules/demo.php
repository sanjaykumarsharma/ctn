<?php 
include ('dumper.php');

try {
	$dumper = Shuttle_Dumper::create(array(
		'host' => '',
		'username' => 'root',
		'password' => '',
		'db_name' => 'ntc_erp1',
	));

	// dump the database to gzipped file
	$dumper->dump('E:/ntc_db_backup/ntc_erp.sql.gz');

	// dump the database to plain text file
	// $dumper->dump('ntc_erp.sql');

	// $wp_dumper = Shuttle_Dumper::create(array(
	// 	'host' => '',
	// 	'username' => 'root',
	// 	'password' => '',
	// 	'db_name' => 'wordpress',
	// ));

	// Dump only the tables with wp_ prefix
	//$wp_dumper->dump('wordpress.sql', 'wp_');
	
	// $countries_dumper = Shuttle_Dumper::create(array(
	// 	'host' => '',
	// 	'username' => 'root',
	// 	'password' => '',
	// 	'db_name' => 'ntc_erp1',
	// 	'include_tables' => array('country', 'city'), // only include those tables
	// ));
	// $countries_dumper->dump('world.sql.gz');

	// $dumper = Shuttle_Dumper::create(array(
	// 	'host' => '',
	// 	'username' => 'root',
	// 	'password' => '',
	// 	'db_name' => 'ntc_erp1',
	// 	'exclude_tables' => array('city'), 
	// ));
	// $dumper->dump('world-no-cities.sql.gz');

} catch(Shuttle_Exception $e) {
	echo "Couldn't dump database: " . $e->getMessage();
}