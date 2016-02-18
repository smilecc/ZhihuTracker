<?php
header("Content-type: text/html; charset=utf-8");
require_once('function.php');

$db = DbConn();
$res_json = array('status' => false);

if (I('uhash') == null) {
	$res_json['info'] = 'uhash为空';
	echo json_encode($res_json);
	return;
}

$uhash = I('uhash');
$stmt = $db->prepare('SELECT * FROM user WHERE hash = :hash');
$stmt->execute(array('hash' => $uhash));
$row = $stmt->fetch();

if($row == null){
	$insert = $db->prepare('INSERT INTO user(hash) VALUES(:hash)');
	$insert->bindParam(':hash', $uhash);
	$insert->execute();
}

switch (I('type')) {
	case 'addtrack':
		
		break;
	
	default:
		$res_json['info'] = 'Type未命中';
		break;
}
echo json_encode($res_json);