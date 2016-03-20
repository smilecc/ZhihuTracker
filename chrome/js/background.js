var user_hash = localStorage['user_hash'];

var TrackOp = function(type,aid,qid,successFunc){
	$.ajax({
			url:"http://3.candemo.applinzi.com/operator.php",
			async:false,
			data:{
				type: type,
				uhash: user_hash,
				qid: qid,
				aid: aid
			},
			success:successFunc
		});
}

chrome.runtime.onMessage.addListener(  
function(request, sender, sendResponse) {
	user_hash = request.uhash;
	TrackOp(request.type,request.aid,request.qid,function(res){
				sendResponse({'data': res});
			});
	return true;
});