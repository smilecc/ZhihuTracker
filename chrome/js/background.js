// var TrackOp = function(type){
// 	$.ajax({
// 		url:"https://3.candemo.applinzi.com/operator.php",
// 		async:true,
// 		data:{
// 			type:type,
// 			uhash:user_hash,
// 			qid:question_id,
// 			aid:answer_id
// 		},
// 		success:function(data){
// 			if(type == 'gettrack'){
// 				SetPage();
// 			}
// 		}
// 	});
// };

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest) {
    alert(request.dom);
});