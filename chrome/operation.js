
window.onload=function(){
	//$('.zm-votebar').append('<button class="down pressed" title="在追踪器内追踪本回答更新">追踪</button>');
	var url = window.location.pathname;
	var view_mode = 0;
	var question_id;
	var answer_id;
	var people;

	// 获取用户信息
	var user_jobj = JSON.parse($('[data-name=ga_vars]').text())
	var user_hash = user_jobj['user_hash'];

	// 初始化信息
	var reg = new RegExp("question/([0-9]+)");
	var question_reg = reg.exec(url);
	if(null != question_reg){
		question_id = question_reg[1];
		view_mode = 1;
	}

	var SetPage = function(){
		// 追加按钮
		var votelist = document.getElementsByClassName('zm-votebar');//.appendChild(btn_tracker);
		for (var i = votelist.length - 1; i >= 0; i--) {
			var btn_tracker = document.createElement('button');
			btn_tracker.setAttribute('class','tracker');
			btn_tracker.setAttribute('title','在追踪器内追踪本回答更新');
			if(view_mode == 0){
				question_id = $(votelist[1]).parent().parent().parent().parent().children('[itemprop=question-url-token]').attr('content');
			}

			btn_tracker.setAttribute('answer_id',$(votelist[1]).parent().attr('data-atoken'));
			btn_tracker.setAttribute('question_id',question_id);
			btn_tracker.innerHTML = '追踪';
			votelist[i].appendChild(btn_tracker);
		};

		// 绑定事件
		$('.tracker').click(function(){
			if($(this).hasClass('pressed')){
				$(this).removeClass('pressed');
				TrackOp('removetrack');
			} else {
				$(this).addClass('pressed');
				TrackOp('addtrack');
			}
			
		});
	};

	chrome.runtime.sendMessage({dom: d}); 
	//TrackOp('gettrack');
}
