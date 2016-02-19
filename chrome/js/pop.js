function AddRow(title,qid,aid,time){
	 var row = '<tr><td><a href="https://www.zhihu.com/question/' + qid + '/answer/' + aid + '" target="_blank">' + title + '</a></td><td>'+ time +'</td></tr>';
	$('#list-body').append(row);
}

function refresh(){
	var track_str;
	$.ajax({
		url:"http://localhost/ZhihuTracker/operator.php",
		async:true,
		data:{
			type:'gettrack',
			uhash:'test2'
		},
		success:function(data){
			track_str = data;
			var jobj = JSON.parse(track_str);
			for (var i = jobj.length - 1; i >= 0; i--) {
				var row = jobj[i];
				AddRow('title',row['questionid'],row['answerid'],row['checktime']);
			};
		}
	});
}

$(function(){
	$('#btn-refresh').click(function(){
		refresh();
	});
});