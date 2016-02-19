<?php
header("Content-type: text/html; charset=utf-8");
require_once('function.php');

$user = new User();
$track = new Track();

// 所有p开头意为param
$pHash = @I('uhash');
$uid = $user->GetUserId($pHash);

if($uid == null){
	$user->AddUser($pHash);
}

$res_json = array('status' => false);

// 分发
switch (@I('type')) {
	// 增加追踪
	case 'addtrack':
		$pQuestionid = @I('qid');
		$pAnswerid = @I('aid');

		if($pAnswerid == null || $pQuestionid == null){
			$res_json['info'] = 'Aid or Qid 未命中';
			break;
		}

		if($track->AddTrack($uid,$pQuestionid,$pAnswerid) > 0){
			$res_json['status'] = true;
		}
		break;
	
	default:
		$res_json['info'] = 'Type未命中';
		break;
}

echo json_encode($res_json);