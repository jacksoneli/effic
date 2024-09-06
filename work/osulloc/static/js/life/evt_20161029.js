
require(['$'], function() {
	$(function() {
		var evtId = $("#evtId").val();
		
		$("#enter").click(function(event){
			event.preventDefault();
			var data = "seq="+evtId+"&couponNo=0&method=check";
			$.ajax({
				type : "POST",
				url : "/kr/ko/life/event/apply/evt20161029",
				cache : false,
				data : data,
				dataType : "json",
				success : function(response) {
					if(response.result == "success"){
						$("#popup_prompt").show();
					}else if(response.result == "notTime"){
						alert("이벤트 기간이 아닙니다.");
					}else if(response.result == "notLogin"){
						alert("로그인이 필요합니다.");
						var url = "/kr/ko/login?r=/kr/ko/life/event/apply/"+evtId+"/check";
						location.href=url;
					}else if(response.result == "notGrade"){
						alert("VVIP 회원이 아닙니다.\n 등급을 확인해주세요.");
					}else if(response.result == "duplication"){
						alert("이미 참여하셨습니다.");
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
	    
		$("#insert").click(function(event){
			event.preventDefault();
			
			var couponNo = $("#couponNo").val();
			if(couponNo == ""){
				alert("난수번호를 입력해주세요.");
				return false;
			}
			var data = "seq="+evtId+"&couponNo="+couponNo+"&method=insert";
			$.ajax({
				type : "POST",
				url : "/kr/ko/life/event/apply/evt20161029",
				cache : false,
				data : data,
				dataType : "json",
				success : function(response) {
					if(response.result == "success"){
						alert("신청하셨습니다. 하단의 유의사항 참조해 주세요.");
						$("#popup_prompt").hide();
					}else if(response.result == "notTime"){
						alert("이벤트 기간이 아닙니다.");
					}else if(response.result == "notLogin"){
						alert("로그인이 필요합니다.");
						var url = "/kr/ko/login?r=/kr/ko/life/event/apply/"+evtId+"/check";
						location.href=url;
					}else if(response.result == "notGrade"){
						alert("VVIP 회원이 아닙니다.\n 등급을 확인해주세요.");
					}else if(response.result == "duplication"){
						alert("이미 참여하셨습니다.");
					}else if(response.result == "notCoupon"){
						alert("잘못된 쿠폰번호 입니다.\n다시 확인하시고 입력해주세요.");
					}else if(response.result == "usedCoupon"){
						alert("이미 사용한 쿠폰번호 입니다.");
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
});
