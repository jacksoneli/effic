
require(['$'], function() {
	$(function() {
		var pvarIsLogin = $("#loginYN").val();
	    var evtId = $("#evtId").val();
	    
	    $.ajax({
			type : "POST",
			url : "/kr/ko/life/event/blendedTeaMap",
			cache : false,
			data : "seq="+evtId,
			dataType : "json",
			success : function(data) {
				if(data.result=="success"){
					for(var i=0; i<data.list.length; i++){
						var dataArray = data.list[i] + "";
						var dataVal = dataArray.split(",");
						if(dataVal[1]>0){
							$('.box'+dataVal[0]).addClass("on");
						}
					}		    					
				}else if(data.result=="notLogin"){
					return false;
				}else if(data.result=="notTime"){
					return false;
				}else{
					popupNotification({
						msg: '시스템 에러가 발생하였습니다. 잠시 후 다시 시도해 주십시오. 문제가 계속 발생하면 관리자에게 문의해주십시오.',
						type: 'error',
						timer: 3000
					});
				}
			},
			error : function(xhr, status, error) {
				popupNotification({
					msg: '시스템 에러가 발생하였습니다. 잠시 후 다시 시도해 주십시오. 문제가 계속 발생하면 관리자에게 문의해주십시오.',
					type: 'error',
					timer: 3000
				});
			}
		});
	    
		$(".btn_passport").on("click", function() {
			//class = "on"이 스티커
			if(pvarIsLogin=="true"){
		    	$.ajax({
						type : "POST",
						url : "/kr/ko/life/event/blendedTeaMap",
						cache : false,
						data : "seq="+evtId,
						dataType : "json",
						success : function(data) {
		    				if(data.result=="success"){
		    					for(var i=0; i<data.list.length; i++){
		    						var dataArray = data.list[i] + "";
		    						var dataVal = dataArray.split(",");
		    						if(dataVal[1]>0){
		    							$('.box'+dataVal[0]).addClass("on");
		    						}
		    					}		    					
		    				}else if(data.result=="notLogin"){
		    					if (confirm("로그인 하시겠습니까?")){
	    						  var url = "/kr/ko/login?r=/kr/ko/life/event/apply/"+evtId+"/check";
	    						  location.href=url;
	    						} else{
	    						  return false;
	    						}
		    				}else if(data.result=="notTime"){
		    					alert("이벤트 기간이 아닙니다.");
		    					return false;
		    				}else{
		    					popupNotification({
									msg: '시스템 에러가 발생하였습니다. 잠시 후 다시 시도해 주십시오. 문제가 계속 발생하면 관리자에게 문의해주십시오.',
									type: 'error',
									timer: 3000
								});
		    				}
						},
						error : function(xhr, status, error) {
							popupNotification({
								msg: '시스템 에러가 발생하였습니다. 잠시 후 다시 시도해 주십시오. 문제가 계속 발생하면 관리자에게 문의해주십시오.',
								type: 'error',
								timer: 3000
							});
						}
					});
			}else{
				if (confirm("로그인 하시겠습니까?")){
				  var url = "/kr/ko/login?r=/kr/ko/life/event/apply/"+evtId+"/check";
				  location.href=url;
				} else{
				  return false;
				}
			}
		});
	}); 
});

