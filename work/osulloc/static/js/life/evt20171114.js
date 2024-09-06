require(['$'], function() {
	$(function() {

	    var evtId = $("#evtId").val();
		
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
		
		$('#q6').on("keyup",function(){
			var byteTxt = "";
			var byte = function(str){
				var byteNum=0;
				for(var i=0;i<str.length;i++){
					byteNum+=(str.charCodeAt(i)>127)?3:1;
					if(byteNum<303){
						byteTxt+=str.charAt(i);
					};
				};
				return Math.round( byteNum/3 );
			};
			if(byte($(this).val())>1000){
				$(this).val("");
				$(this).val(byteTxt);
			}
		});
		$('#q10').on("keyup",function(){
			var byteTxt = "";
			var byte = function(str){
				var byteNum=0;
				for(var i=0;i<str.length;i++){
					byteNum+=(str.charCodeAt(i)>127)?3:1;
					if(byteNum<303){
						byteTxt+=str.charAt(i);
					};
				};
				return Math.round( byteNum/3 );
			};
			if(byte($(this).val())>1000){
				$(this).val("");
				$(this).val(byteTxt);
			}
		});
	
		function checkEventDetail(){			
			if($('#loginYN').val() == 'false'){
				alert("로그인이 필요합니다.");
				var pvarCurrentPath = $('#pvarCurrentPath').val();
				location.href='/kr/ko/login?r='+pvarCurrentPath;
				return false;
			}
			return true;
		}
		
		function checkApply(){
			var dataURL ="/kr/ko/life/event/20171113/checkapply";
			var result = false;
			$.ajax({
				type : "POST",
				url : dataURL,
				cache : false,
				async:false,
				data : "seq="+evtId,
				dataType : "json",
				success : function(response) {				
					if(response.result == "notLogin"){
						alert("로그인이 필요합니다.");
						result = true;
					}else if(response.result == "apply"){
						alert("이미 설문에 응답 하셨습니다.");
						result = true;
					}else if(response.result == "notTime"){
						alert("이벤트 기간이 아닙니다.");
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
				var q3 = $('input[name=q3]:checked').val();
				var q5 = $('input[name=q5]:checked').val();
				var q7 = $('input[name=q7]:checked').val();
				var q9 = $('input[name=q9]:checked').val();

				if(q1 == null){
					alert("1번을 선택해주세요");
					$('input[name=q1]').focus();
					return;
				}else if(q2 == null){
					alert("2번을 선택해주세요");
					$('input[name=q2]').focus();
					return;		
				}else if(q3 == null){		
					alert("3번을 선택해주세요");
					$('input[name=q3]').focus();
					return;
				}else if(!$('input[name=q4]').is(':checked')){		
					alert("4번을 선택해주세요");
					$('input[name=q4]').focus();
					return;	
				}else if(q5 == null){		
					alert("5번을 선택해주세요");
					$('input[name=q5]').focus();
					return;
				}else if(q7 == null){		
					alert("7번을 선택해주세요");
					$('input[name=q7]').focus();
					return;
				}else if(!$('input[name=q8]').is(':checked')){		
					alert("8번을 선택해주세요");
					$('input[name=q8]').focus();
					return;
				}else if(q9 == null){		
					alert("9번을 선택해주세요");
					$('input[name=q9]').focus();
					return;
				}

				var q4 = $('input[name=q4]:checked').map(function(index,elem){
					return $(elem).val();
				}).get().join(',');
				
				var q8 = $('input[name=q8]:checked').map(function(index,elem){
					return $(elem).val();
				}).get().join(',');
				
				var q6= $('#q6').val().trim();
				var q10= $('#q10').val().trim();
				
				
				var dataURL ="/kr/ko/life/event/20171113/insert";
				var data = "seq="+evtId+"+&q1="+encodeURI(q1)+"&q2="+encodeURI(q2)+"&q3="+encodeURI(q3)+"&q4="+encodeURI(q4)+"&q5="+encodeURI(q5)+"&q6="+encodeURI(q6)+"&q7="+encodeURI(q7)+"&q8="+encodeURI(q8)+"&q9="+encodeURI(q9)+"&q10="+encodeURI(q10);
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