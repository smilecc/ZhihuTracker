$("#saveButton").bind("click",function(){
	chrome.storage.sync.set({
		'info': 	!$("#info").hasClass("toggle-off"),
		"baozi":	!$("#baozi").hasClass("toggle-off"),
		"redname":	!$("#redname").hasClass("toggle-off")},
		function(){
				console.log("保存完毕");
				$("#saveButton").text("保存完毕");
				$("#saveButton").addClass("btn-success");
				setTimeout(function(){
					$("#saveButton").text("保存设置");
					$("#saveButton").removeClass("btn-success");
				},800);
			})
});

window.onload=function(){
	chrome.storage.sync.get(["info","baozi","redname"],function(date){
		console.log(date);
		if(!date.info)		 $("#info").addClass("toggle-off");
		if(!date.baozi)		 $("#baozi").addClass("toggle-off");
		if(!date.redname)	 $("#redname").addClass("toggle-off");
		})
}