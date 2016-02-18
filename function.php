<?php
function I($parem){
	if($_POST[$parem] != null){
		return $_POST[$parem];
	}else{
		return $_GET[$parem]; 
	}
}

function DbConn(){
	$db = new PDO("mysql:host=localhost;dbname=zhihutracker","root","root");
	$db->exec("SET NAMES 'utf8';");
	return $db;
}