require(['$'], function() {
	$(function() {
		//11월 한달동안 진행되는 설문조사 이벤트	
		$('input:radio').change(function(){
			if (!checkEventDetail()) return;
			if(checkApply()){
				location.reload();
			};
		});
	
		$('input:checkbox').change(function(){
			if (!checkEventDetail()) return;
			if(checkApply()){
				location.reload();
			};
		});
	
		function checkEventDetail(){
			if($('#evtTime').val() == 'false'){
				alert("이벤트 기간이 아닙니다.");
				return false;
			}
			
			if($('#loginYN').val() == 'false'){
				alert("로그인이 필요합니다.");
				var pvarCurrentPath = $('#pvarCurrentPath').val();
				location.href='/kr/ko/login?r='+pvarCurrentPath;
				return false;
			}
			return true;
		}
		
		function checkApply(){
			var dataURL ="/kr/ko/life/event/event_detail/checkapply";
			var result = false;
			$.ajax({
				type : "POST",
				url : dataURL,
				cache : false,
				async:false,
				dataType : "json",
				success : function(response) {				
					if(response.result == "apply"){
						alert("이미 설문에 응답 하셨습니다.");
						result = true;
					}
				}
			});
			return result;
		}
	
		$('#eventDetail').click(function(){
		
			if (!checkEventDetail()) return;
			
			if(checkApply()){
				location.reload();
			}else{	
				var q1 = $('input[name=q1]:checked').val();
				var q2 = $('input[name=q2]:checked').val();
				var q8 = $('input[name=q8]:checked').val();
				
				if(q1 == null){
					alert("1번을 선택해주세요");
					$('input[name=q1]').focus();
					return;
				}else if(q2 == null){
					alert("2번을 선택해주세요");
					$('input[name=q2]').focus();
					return;		
				}else if(!$('input[name=q3]').is(':checked')){		
					alert("3번을 선택해주세요");
					$('input[name=q3]').focus();
					return;
				}else if($('#q3other').is(':checked') && $('#q3other2').val().trim() == ""){		
					alert("체크한 기타항목에 입력하세요");
					$('#q3other2').val('');
					$('#q3other2').focus();
					return;	
				}else if(!$('input[name=q4]').is(':checked')){		
					alert("4번을 선택해주세요");
					$('input[name=q4]').focus();
					return;
				}else if($('#q4other').is(':checked') && $('#q4other2').val().trim() == ""){		
					alert("체크한 기타항목에 입력하세요");
					$('#q4other2').val('');
					$('#q4other2').focus();
					return;
				}else if(!$('input[name=q5]').is(':checked')){		
					alert("5번을 선택해주세요");
					$('input[name=q5]').focus();
					return;
				}else if($('#q5other').is(':checked') && $('#q5other2').val().trim() == ""){		
					alert("체크한 기타항목에 입력하세요");
					$('#q5other2').val('');
					$('#q5other2').focus();
					return;
				}else if(!$('input[name=q6]').is(':checked')){		
					alert("6번을 선택해주세요");
					$('input[name=q6]').focus();
					return;
				}else if($('#q6other').is(':checked') && $('#q6other2').val().trim() == ""){		
					alert("체크한 기타항목에 입력하세요");
					$('#q6other2').val('');
					$('#q6other2').focus();
					return;	
				}else if(!$('input[name=q7]').is(':checked')){		
					alert("7번을 선택해주세요");
					$('input[name=q7]').focus();
					return;
				}else if($('#q7other').is(':checked') && $('#q7other2').val().trim() == ""){		
					alert("체크한 기타항목에 입력하세요");
					$('#q7other2').val('');
					$('#q7other2').focus();
					return;	
				}else if(q8 == null){
					alert("8번을 선택해주세요");
					$('input[name=q8]').focus();
					return;	
				}else if(!$('input[name=q9]').is(':checked')){		
					alert("9번을 선택해주세요");
					$('input[name=q9]').focus();
					return;
				}
				
				$('#q3other').val($('#q3other2').val().trim());
				$('#q4other').val($('#q4other2').val().trim());
				$('#q5other').val($('#q5other2').val().trim());
				$('#q6other').val($('#q6other2').val().trim());
				$('#q7other').val($('#q7other2').val().trim());
				
				var q3 = $('input[name=q3]:checked').map(function(index,elem){
					return $(elem).val();
				}).get().join(',');
				
				var q4 = $('input[name=q4]:checked').map(function(index,elem){
					return $(elem).val();
				}).get().join(',');
				
				var q5 = $('input[name=q5]:checked').map(function(index,elem){
					return $(elem).val();
				}).get().join(',');
				
				var q6 = $('input[name=q6]:checked').map(function(index,elem){
					return $(elem).val();
				}).get().join(',');
				
				var q7 = $('input[name=q7]:checked').map(function(index,elem){
					return $(elem).val();
				}).get().join(',');
				
				var q9 = $('input[name=q9]:checked').map(function(index,elem){
					return $(elem).val();
				}).get().join(',');
				
				var q10= $('#q10').val();
				
				var dataURL ="/kr/ko/life/event/event_detail/insert";
				var data = "q1="+encodeURI(q1)+"&q2="+encodeURI(q2)+"&q3="+encodeURI(q3)+"&q4="+encodeURI(q4)+"&q5="+encodeURI(q5)+"&q6="+encodeURI(q6)+"&q7="+encodeURI(q7)+"&q8="+encodeURI(q8)+"&q9="+encodeURI(q9)+"&q10="+encodeURI(q10);
				$.ajax({
					type : "POST",
					url : dataURL,
					cache : false,
					data : data,
					dataType : "json",
					success : function(response) {				
						if(response.result == "OK"){
							alert("설문 응답이 완료되었습니다.");
						}else if(response.result == "apply"){
							alert("이미 설문에 응답 하셨습니다.");
						}else{
							alert("오류가 발생했습니다. 관리자에게 문의해주세요.");
						}
						location.reload();		
					}
				});
			}
		});
	});
});