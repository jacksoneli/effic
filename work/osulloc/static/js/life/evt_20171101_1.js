
require(['$'], function() {
	$(function() {
		var evtId = $("#evtId").val();
		var pvarIsLogin = $("#loginYN").val();
		$("#enter").click(function(event){
			event.preventDefault();
			if(pvarIsLogin == "false"){
				alert("로그인이 필요합니다.");
				var url = "/kr/ko/login?r=/kr/ko/life/event/apply/"+evtId+"/check";
				location.href=url;
				return;
			}
			var data = "seq="+evtId;
			$.ajax({
				type : "POST",
				url : "/kr/ko/life/event/apply/evt20171101_1",
				cache : false,
				data : data,
				dataType : "json",
				success : function(response) {
					if(response.result == "success"){
						alert("감사합니다. 신청이 완료되었습니다.");
					}else if(response.result == "notTime"){
						alert("이벤트 기간이 아닙니다.");
					}else if(response.result == "notLogin"){
						alert("로그인이 필요합니다.");
						var url = "/kr/ko/login?r=/kr/ko/life/event/apply/"+evtId+"/check";
						location.href=url;
					}else if(response.result == "notGrade"){
						alert("죄송합니다. 해당 이벤트는 VVIP회원님만 참여가능합니다.");
					}else if(response.result == "duplication"){
						alert("이미 신청하셨습니다.");
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
