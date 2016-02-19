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
		$this->db = new PDO("mysql:host=db4free.net;dbname=zhihutracker","zhihutracker","123456");
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
		$stmt = $this->db->prepare('SELECT id FROM user WHERE hash = :hash');
		$stmt->execute(array('hash' => $uhash));
		return $stmt->fetch();
	}

	public function GetUserId($uhash){
		$row = $this->GetUserByHash($uhash);
		return $row['id'];
		}

	public function AddUser($uhash){
		$insert = $this->db->prepare('INSERT INTO user(hash) VALUES(:hash)');
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
		$insert = $this->db->prepare('INSERT INTO track(userid,questionid,answerid) VALUES(:uid,:qid,:aid)');
		$insert->bindParam(':qid', $question_id);
		$insert->bindParam(':aid', $answer_id);
		$insert->bindParam(':uid', $uid);
		return $insert->execute();
	}
}