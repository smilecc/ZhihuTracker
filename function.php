<?php
function I($param){
	if($_POST[$param] != null){
		return @$_POST[$param];
	}else{
		return @$_GET[$param]; 
	}
}

class Db
{
	protected $db;

	function __construct()
	{
		// if(isset($_SERVER['HTTP_APPNAME'])){
		// 	$host = SAE_MYSQL_HOST_M;
		// 	$port = SAE_MYSQL_PORT;
		// 	$dbname = 'app_'.$_SERVER['HTTP_APPNAME'];
		// 	$dbuser = SAE_MYSQL_USER;
		// 	$dbpwd = SAE_MYSQL_PASS;
		// }else{
		// 	$host = "db4free.net";
		// 	$port = 3306;
		// 	$dbname = "zhihutracker";
		// 	$dbuser = "zhihutracker";
		// 	$dbpwd = '123456';
		// }

		$host = "localhost";
		$port = 3306;
		$dbname = "zhihutracker";
		$dbuser = "zhihutracker";
		$dbpwd = 'sxcuic';

		$con_str = sprintf("mysql:host=%s;port=%d;dbname=%s",$host,$port,$dbname);

		$this->db = new PDO($con_str,$dbuser, $dbpwd);
		$this->db->exec("SET NAMES 'utf8';");
	}
}

class User extends Db
{
	function __construct()
	{
		parent::__construct();
	}

	public function GetUserByHash($uhash){
		$stmt = $this->db->prepare('SELECT id FROM zh_user WHERE hash = :hash');
		$stmt->execute(array('hash' => $uhash));
		return $stmt->fetch();
	}

	public function GetUserId($uhash){
		$row = $this->GetUserByHash($uhash);
		return $row['id'];
		}

	public function AddUser($uhash){
		$insert = $this->db->prepare('INSERT INTO zh_user(hash) VALUES(:hash)');
		$insert->bindParam(':hash', $uhash);
		return $insert->execute();
	}
}

class Track extends Db
{
	function __construct()
	{
		parent::__construct();
	}

	public function AddTrack($uid,$question_id,$answer_id){
		$insert = $this->db->prepare('INSERT INTO zh_track(userid,questionid,answerid) VALUES(:uid,:qid,:aid)');
		$insert->bindParam(':qid', $question_id);
		$insert->bindParam(':aid', $answer_id);
		$insert->bindParam(':uid', $uid);
		return $insert->execute();
	}

	public function RemoveTrack($uid,$question_id,$answer_id){
		$delete = $this->db->prepare('DELETE FROM zh_track WHERE(userid=:uid AND questionid=:qid AND answerid=:aid)');
		$delete->bindParam(':qid', $question_id);
		$delete->bindParam(':aid', $answer_id);
		$delete->bindParam(':uid', $uid);
		
		if($delete->execute()){
			return $delete->rowCount();
		} else return false;
	}

	public function GetAll($uid){
		$stmt = $this->db->prepare('SELECT * FROM zh_track WHERE userid = :uid');
		$stmt->execute(array('uid' => $uid));
		return $stmt->fetchAll();
	}

	public function UpdateTime($uid){
		$stmt = $this->db->prepare('UPDATE zh_track SET num=num+1 WHERE userid = :uid');
		$stmt->execute(array('uid' => $uid));
	}

	public function UpdateOneTime($uid,$question_id,$answer_id){
		$stmt = $this->db->prepare('UPDATE zh_track SET num=num+1 WHERE(userid = :uid AND questionid = :qid AND answerid = :aid)');
		return $stmt->execute(
				array(
					'uid' => $uid,
					'qid' => $question_id,
					'aid' => $answer_id
			));
	}
}