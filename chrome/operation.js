window.onload=function(){
	//$('.zm-votebar').append('<button class="down pressed" title="在追踪器内追踪本回答更新">追踪</button>');
	var url = window.location.pathname;
	var view_mode = 0;
	var question_id;
	var answer_id;
	var people;

	// 获取用户信息
	var user_jobj = JSON.parse($('[data-name=ga_vars]').text())
	window.localStorage.setItem('user_hash', user_jobj['user_hash']);

	// 初始化信息
	var reg = new RegExp("question/([0-9]+)");
	var question_reg = reg.exec(url);
	if(null != question_reg){
		question_id = question_reg[1];
		view_mode = 1;
	}

	var SetPage = function(answerlist){
		// 追加按钮
		var votelist = document.getElementsByClassName('zm-votebar');//.appendChild(btn_tracker);
		for (var i = votelist.length - 1; i >= 0; i--) {
			var btn_tracker = document.createElement('button');
			btn_tracker.setAttribute('title','在追踪器内追踪本回答更新');
			if(view_mode == 0){
				question_id = $(votelist[i]).parent().parent().parent().parent().children('[itemprop=question-url-token]').attr('content');
			}

			var thisAnwerid = $(votelist[i]).parent().attr('data-atoken');
			if(thisAnwerid === undefined){
				continue;
			}
			console.log(thisAnwerid);
			if(answerlist.indexOf(thisAnwerid) == -1){
				btn_tracker.setAttribute('class','tracker');
			} else {
				btn_tracker.setAttribute('class','tracker pressed');
			}
			btn_tracker.setAttribute('answer_id',thisAnwerid);
			btn_tracker.setAttribute('question_id',question_id);
			btn_tracker.innerHTML = '追踪';
			votelist[i].appendChild(btn_tracker);
		};

		// 绑定事件
		$('.tracker').click(function(){
			var aid = $(this).attr('answer_id');
			var qid = $(this).attr('question_id');

			if($(this).hasClass('pressed')){
				$(this).removeClass('pressed');
				TrackOp('removetrack',aid,qid);
			} else {
				$(this).addClass('pressed');
				TrackOp('addtrack',aid,qid);
			}
			
		});
	};

	// 获取追踪列表
	chrome.runtime.sendMessage({
				type: 'gettrack',
				uhash: localStorage['user_hash'],
				aid: '',
				qid: ''
			},
			function(response){
				console.log(response.data);
				var jobj = JSON.parse(response.data);
				var answerlist = new Array();
				for(x in jobj){ 
					answerlist.push(jobj[x]['answerid']);
				}
				console.log(answerlist);
				SetPage(answerlist);
		});

	var TrackOp = function(type,aid,qid){
		chrome.runtime.sendMessage({
					'type': type,
					'uhash': localStorage['user_hash'],
					'aid': aid,
					'qid': qid
				},
				function(response){});
	};

	//TrackOp('gettrack');
}
