
require(['$'], function() {
	$(function() {
		var pvarIsLogin = $("#loginYN").val();
	    var evtId = $("#evtId").val();
	    
	    if(pvarIsLogin == "true"){
	    	$('.login-before').hide();
	    	$('.login-after').show();
	    }else{
	    	$('.login-after').hide();
	    	$('.login-before').show();
	    }
	    
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
						//한번 더 쿠폰 도장 발급_20180525
						if(data.list.length>=10){
							if(dataVal[1]>1){
								$('.box1'+dataVal[0]).addClass("on");
								if(dataVal[0]>9){
									$('.box20').addClass("on");
								}
							}
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
	}); 
});

