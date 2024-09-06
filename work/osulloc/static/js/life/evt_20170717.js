
require(['$'], function() {
	$(function() {
		
		$(".btn_close").click(function(a){
			$("#layer").removeClass("open");
			$("#newBuy").removeClass("open");
			$("#weekend").removeClass("open");
			$("#daily").removeClass("open");
		});
	    
	    var pvarIsLogin = $("#shoppingLoginYN").val();
	    if(pvarIsLogin == "true"){
	    	//첫구매 쿠폰 
	    	$.ajax({
				type : "POST",
				url : "/kr/ko/life/event/evt20170717/newBuy",
				cache : false,
				data : "seq=1&method=check",
				dataType : "json",
				success : function(response) {
					if(response.result == "success"){
						var couponCnt = response.couponCount;
						if(couponCnt>0){
							$(".btn_newBuy").removeClass("btn-em");
							$(".btn_newBuy").addClass("btn-gray");
							$(".btn_newBuy").text("발급완료");
						}							
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
	    	//주말 쿠폰
	    	$.ajax({
				type : "POST",
				url : "/kr/ko/life/event/evt20170717/weekend",
				cache : false,
				data : "method=check",
				dataType : "json",
				success : function(response) {
					if(response.result == "success"){
						var weekend = response.weekend;
						if(weekend>0){
							var couponCnt =  response.couponCount;
							if(couponCnt>0){
								$(".btn_weekend").removeClass("btn-em");
								$(".btn_weekend").addClass("btn-gray");
								$(".btn_weekend").text("발급완료");
							}
						}else{
							$(".btn_weekend").removeClass("btn-em");
							$(".btn_weekend").addClass("btn-gray");
							
							$(".btn_weekend").removeAttr('href');
							$(".btn_weekend").off('click');
						}
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
	    	//데일리 쿠폰
	    	$.ajax({
				type : "POST",
				url : "/kr/ko/life/event/evt20170717/daily",
				cache : false,
				data : "method=check",
				dataType : "json",
				success : function(response) {
					if(response.result == "success"){
						var daily = response.daily;
						if(daily === "true"){
							var couponCnt =  response.couponCount;
							if(couponCnt>0){
								$(".btn_daily").removeClass("btn-em");
								$(".btn_daily").addClass("btn-gray");
								$(".btn_daily").text("발급완료");
							}
						}else{
							$(".btn_daily").removeClass("btn-em");
							$(".btn_daily").addClass("btn-gray");
							
							$(".btn_daily").removeAttr('href');
							$(".btn_daily").off('click');
						}
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
	    }
	    //첫구매 쿠폰 버튼 클릭 이벤트
	    $(".btn_newBuy").click(function(a){
	    	a.preventDefault();
			if(pvarIsLogin == "true"){
			var dataURL ="/kr/ko/life/event/evt20170717/newBuy";
			var data = "seq=1&method=insert";
				$.ajax({
					type : "POST",
					url : dataURL,
					cache : false,
					data : data,
					dataType : "json",
					success : function(response) {
						if(response.result == "success"){
							$("#layer").addClass("open");
							$("#newBuy").addClass("open");
							$(".btn_newBuy").removeClass("btn-em");
							$(".btn_newBuy").addClass("btn-gray");
							$(".btn_newBuy").text("발급완료");
						}else if(response.result == "notCondition"){
							alert('첫 구매를 해주셔야 이벤트 참여가 가능합니다.');
						}else if(response.result == "notLogin"){
							alert('로그인이 필요한 이벤트 입니다.');
						}else if(response.result == "duplication"){
							alert('이미 쿠폰을 발급 받으셨습니다.\n[마이페이지>할인쿠폰]에서 확인하세요.');
							$(".btn_newBuy").removeClass("btn-em");
							$(".btn_newBuy").addClass("btn-gray");
							$(".btn_newBuy").text("발급완료");
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
				if ( confirm("로그인 하시겠습니까?")){
					  var url = "/kr/ko/login?r=/kr/ko/life/event/shopping/view";
					  location.href=url;
				  } else{
					  return false;
				  }
			}
		}); 
	    
	    //주말 쿠폰 버튼 클릭 이벤트
	    $(".btn_weekend").click(function(a){
	    	a.preventDefault();
	    	if(pvarIsLogin == "true"){
	    		$.ajax({
					type : "POST",
					url : "/kr/ko/life/event/evt20170717/weekend",
					cache : false,
					data : "method=insert",
					dataType : "json",
					success : function(response) {
						if(response.result == "success"){
							$("#layer").addClass("open");
							$("#weekend").addClass("open");
							$(".btn_weekend").removeClass("btn-em");
							$(".btn_weekend").addClass("btn-gray");
							$(".btn_weekend").text("발급완료");
						}else if(response.result == "duplication"){
							alert('이미 쿠폰을 발급 받으셨습니다.\n[마이페이지>할인쿠폰]에서 확인하세요.');
							$(".btn_weekend").removeClass("btn-em");
							$(".btn_weekend").addClass("btn-gray");
							$(".btn_weekend").text("발급완료");
						}else if(response.result == "notLogin"){
							if (confirm("로그인 하시겠습니까?")){
								  var url = "/kr/ko/login?r=/kr/ko/life/event/shopping/view";
								  location.href=url;
							}else{
								return false;
							}
						}else if(response.result == "notDate"){
							alert("이벤트 기간이 끝났습니다.");
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
				if ( confirm("로그인 하시겠습니까?")){
					  var url = "/kr/ko/login?r=/kr/ko/life/event/shopping/view";
					  location.href=url;
				  } else{
					  return false;
				  }
			}
	    });
	    
	    //데일리 쿠폰 버튼 클릭 이벤트
	    $(".btn_daily").click(function(a){
	    	a.preventDefault();
	    	if(pvarIsLogin == "true"){
	    		$.ajax({
					type : "POST",
					url : "/kr/ko/life/event/evt20170717/daily",
					cache : false,
					data : "method=insert",
					dataType : "json",
					success : function(response) {
						if(response.result == "success"){
							$("#layer").addClass("open");
							$("#daily").addClass("open");
							$(".btn_daily").removeClass("btn-em");
							$(".btn_daily").addClass("btn-gray");
							$(".btn_daily").text("발급완료");
						}else if(response.result == "duplication"){
							alert('이미 쿠폰을 발급 받으셨습니다.\n[마이페이지>할인쿠폰]에서 확인하세요.');
							$(".btn_daily").removeClass("btn-em");
							$(".btn_daily").addClass("btn-gray");
							$(".btn_daily").text("발급완료");
						}else if(response.result == "notLogin"){
							if (confirm("로그인 하시겠습니까?")){
								  var url = "/kr/ko/login?r=/kr/ko/life/event/shopping/view";
								  location.href=url;
							}else{
								return false;
							}
						}else if(response.result == "notDate"){
							alert("이벤트 기간이 끝났습니다.");
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
				if ( confirm("로그인 하시겠습니까?")){
					  var url = "/kr/ko/login?r=/kr/ko/life/event/shopping/view";
					  location.href=url;
				  } else{
					  return false;
				  }
			}
	    });

	});
});

