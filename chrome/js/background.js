var user_hash = undefined;

chrome.runtime.onMessage.addListener(  
function(request, sender, sendResponse) {
	user_hash = request.uhash;
	$.ajax({
		url:"http://3.candemo.applinzi.com/operator.php",
		async:false,
		data:{
			type:request.type,
			uhash:request.uhash,
			qid:request.qid,
			aid:request.aid
		},
		success:function(res){
			//console.log(res);
			sendResponse({'data': res});
		}
	});
	return true;
});