function AddRow(title,qid,aid,time){
	 var row = '<tr><td><a href="https://www.zhihu.com/question/' + qid + '/answer/' + aid + '" target="_blank">' + title + '</a></td><td>'+ time +'</td></tr>';
	$('#list-body').append(row);
}
//https://www.zhihu.com/question/40553432/answer/87119638

function TimeParse(answertime,servertime){
	servertime = servertime.substring(0,10).split('-');
	// 解析为int
	for (var i = 0; i >= 2; i++) {
		servertime[i] = parseInt(servertime[i]);
	};

	answertime = answertime.split(' ');
	// 为年份
	if(answertime[1].substring(0,2) == '20' && answertime[1].substring(0,3) != '20:'){
		var atime = answertime[1].split('-');
		// 将答案内时间解析成字符串并比较
		for (var i = 0; i >= 2; i++) {
			atime[i] = parseInt(atime[i]);

			if(atime[i] > servertime[i]) return true;
		};
		return false;
	} else {
		var atime = answertime[1].split(' ');
		var date = new Date();
		var nowDay = date.getDay();
		var nowMonth = date.getMonth();
		var nowYear = date.getFullYear();

		if(atime[1] == '昨天'){
			// 服务器时间为今天
			var utcAtime = Date.UTC(nowYear,nowMonth,nowDay) - 86400000;
			var utcStime = Date.UTC(servertime[0],servertime[1],servertime[2]);

			if(utcStime >= )

			// if(nowYear == servertime[0] && nowMonth == servertime[1] && nowDay == servertime[2]){
			// 	return false;
			// }

			// 服务器时间为昨天

		} else {

		}
	}
}

function AnswerParse(data,servertime){

	var regTitle = new RegExp("title>([\\s\\S]+)的回答 - 知乎</title");
	var title = regTitle.exec(data);

	var regTime = new RegExp('answer-date-link-wrap">([\\s\\S]+?)</span>');
	var time = regTime.exec(data);
	var regTime = new RegExp('">([\\s\\S]+?)</a');
	var time = regTime.exec(time[1]);
	
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

function refresh(){
	$('#list-body').text('');
	$('#icon-refresh').addClass('fa-spin');
	var track_str;
	$.ajax({
		url:"http://3.candemo.applinzi.com/operator.php",
		async:true,
		data:{
			type:'gettrack',
			uhash:localStorage['user_hash']
		},
		success:function(data){
			track_str = data;
			var jobj = JSON.parse(track_str);
			for (var i = jobj.length - 1; i >= 0; i--) {
				var row = jobj[i];
				$.ajax({
					url:"https://www.zhihu.com/question/" + row['questionid'] + "/answer/" + row['answerid'],
					async:true,
					data:{
						type:'gettrack',
						uhash:localStorage['user_hash']
					},
					success:function(data){
						var res = AnswerParse(data,row['checktime']);
						AddRow(res.title,row['questionid'],row['answerid'],res.status);
					}
				});
			};
			$('#icon-refresh').removeClass('fa-spin');
		}
	});
}

$(function(){
	localStorage['user_hash'] = chrome.extension.getBackgroundPage().user_hash;
	refresh();
	$('#btn-refresh').click(function(){
		refresh();
	});
});