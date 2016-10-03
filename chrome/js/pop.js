function AddRow(title,qid,aid,time){
	 var row = '<tr><td><a href="https://www.zhihu.com/question/' + qid + '/answer/' + aid + '" target="_blank">' + title + '</a></td><td>'+ time +'</td></tr>';
	$('#list-body').append(row);
}
//https://www.zhihu.com/question/40553432/answer/87119638

function TimeParse(answertime,servertime){
	console.log(servertime);
	var stime = servertime.substring(11,19).split(':');
	servertime = servertime.substring(0,10).split('-');
	// 服务器时间戳
	var utcStime = Date.UTC(servertime[0],servertime[1] - 1,servertime[2],stime[0],stime[1],stime[2]);
	console.log('stime:' + utcStime);

	// 解析为int
	for (var i = 0; i >= 2; i++) {
		servertime[i] = parseInt(servertime[i]);
	};

	answertime = answertime.split(' ');
	// 为年份
	console.log(answertime[1].substring(0,2));
	if(answertime[1].substring(0,2) == '20' && answertime[1].substring(0,3) != '20:'){
		var atime = answertime[1].split('-');
		var utcAtime = Date.UTC(atime[0],atime[1] - 1,atime[2]);
		console.log('atime:' + utcAtime);

		if(utcAtime > utcStime) return true;
		else return false;

	} else {
		var date = new Date();
		var nowDay = date.getDate();
		var nowMonth = date.getMonth();
		var nowYear = date.getFullYear();

		if(answertime[1] == '昨天'){
			var atime = answertime[2].split(':');
			var utcAtime = Date.UTC(nowYear,nowMonth,nowDay,atime[0],atime[1]) - 86400000;

			if(utcAtime > utcStime) return true;
			else return false;

		} else {
			var atime = answertime[1].split(':');
			var utcAtime = Date.UTC(nowYear,nowMonth,nowDay,atime[0],atime[1]);

			if(utcAtime > utcStime) return true;
			else return false;
		}
	}
}

function AnswerParse(data,servertime){
	var regTitle = new RegExp("title>([\\s\\S]+)的回答 - 知乎</title");
	var title = regTitle.exec(data);

	var regTime = new RegExp('answer-date-link([\\s\\S]+?)a>');
	var time = regTime.exec(data);
	console.log(time);
	var regTime = new RegExp('">([\\s\\S]+?)</a');
	var time = regTime.exec(time[0]);
	
	var status;
	if(TimeParse(time[1],servertime)){
		status = '有更新';
	}else{
		status = '无更新';
	}

	var res = {
		title: title[1],
		status: status
	};
	return res;
}

var answerGet = function(row){
		$.ajax({
			url:"https://www.zhihu.com/question/" + row['questionid'] + "/answer/" + row['answerid'],
			async:true,
			success:function(data){
				var res = AnswerParse(data,row['checktime']);
				AddRow(res.title,row['questionid'],row['answerid'],res.status);
			}
		});
	};

function refresh(){
	$('#list-body').text('');
	$('#icon-refresh').addClass('fa-spin');
	var track_str;
	$.ajax({
		url:"http://zhihutracker.cuican.name/operator.php",
		async:true,
		data:{
			type:'gettrack',
			uhash:localStorage['user_hash']
		},
		success:function(data){
			track_str = data;
			var jobj = JSON.parse(track_str);
			for (var i = jobj.length - 1; i >= 0; i--) {
				answerGet(jobj[i]);
			};
			$('#icon-refresh').removeClass('fa-spin');
		}
	});
}

var version = '1.2';
function CheckUpdate(){
	$.ajax({
		url:"http://zhihutracker.cuican.name/version.php",
		async:true,
		success:function(data){
			console.log('server_version: ' + data);
			if(data > version){
				$('.footerupdate').show();
			}
		}
	});
}

$(function(){
	if(chrome.extension.getBackgroundPage().user_hash == undefined){
		$('.footerunlogin').show();
		return;
	}
	localStorage['user_hash'] = chrome.extension.getBackgroundPage().user_hash;
	CheckUpdate();

	var TrackOp = chrome.extension.getBackgroundPage().TrackOp;
	refresh();
	$('#btn-refresh').click(function(){
		refresh();
	});

	$('#btn-overcheck').click(function(){
		TrackOp('overallcheck','','',function(){
			refresh();
		});
	});

});