require(['museum/reservation', 'datepicker', 'validate', 'ui'], function() {
	'use strict';

	$(function(){

	var datepicker_options;

	datepicker_options = IG.datepicker_defaults;
	datepicker_options.minDate = '+2';
	datepicker_options.maxDate = '+3m';

	// teaclass intro
	// ----------------------------------------
	
	$('.call-datepicker').datepicker({
		dateFormat: 'yy.mm.dd',
		onSelect: function(input, inst) {
			var h = parseInt(inst.dpDiv.height());
			inst.dpDiv.css({marginTop: -inst.dpDiv.offsetHeight + 'px'});
			this.lastShown = new Date().getTime();
			var dateData = "year=" + inst.selectedYear + "&month=" + inst.selectedMonth + "&day=" + inst.selectedDay;
			$.ajax({
				type : "POST",
				url : "/kr/ko/museum/teastone/selectTimeTable",
				cache : false,
				data : dateData,
				dataType : "json",
				success : function(response) {
					$('#pick-time-selectbox .selectbox-option li').remove();
					var maxApplicants = response.maxApplicants;
					$.each(response.classTimeTable, function(i, val){
						// 시간선택 selectBox append
						var startAtDate = new Date(val.startAt);
						var endAtDate = new Date(val.endAt);
						var startAt = (startAtDate.getHours()<10?'0':'') + startAtDate.getHours() + ':' + (startAtDate.getMinutes()<10?'0':'') + startAtDate.getMinutes();
						var endAt = (endAtDate.getHours()<10?'0':'') + endAtDate.getHours() + ':' + (endAtDate.getMinutes()<10?'0':'') + endAtDate.getMinutes();
						var vacant = maxApplicants - val.totalApplicants;
						
						var standDate = new Date('2019',6-1,'1');
						var selDate = new Date(inst.selectedYear,inst.selectedMonth,inst.selectedDay);
						if(selDate.getTime() >= standDate.getTime()){
							//20190510_프리미엄티스톤 추가
							var balance = val.count;
							var balanceTxt = "";
							if(balance == 8){
								balanceTxt = "1차(베이직) ";
								balance = 1;
							}else if(balance == 7){
								balanceTxt = "3차(프리미엄) ";
								balance = 3;
							}else if(balance == 6){
								balanceTxt = "5차(프리미엄) ";
								balance = 5;
							}else{
								balanceTxt = val.count+"차(베이직) ";
							}
						}else{
							//20181002_프리미엄티스톤 추가
							var balance = val.count;
							var balanceTxt = "";
							if(balance == 6){
								balanceTxt = "5차(프리미엄) ";
								balance = 5;
							}else{
								balanceTxt = val.count+"차(베이직) ";
							}							
						}
						var text = '<li' + (vacant<=1?' class="is-disabled"':'') + '>' +
						'<input type="radio" name="pick-time" value="' + val.id + '" id="pack-time' + balance + '" data-vacant="' + vacant + '">' +
						'<label for="pick-time' + balance + '">' + balanceTxt + startAt + '~' + endAt + ' (잔여석 : ' + vacant + '석)</label>'+
						'</li>';
						$('#pick-time-selectbox .selectbox-option').append(text);
					});
					$('#pick-time-selectbox').removeClass('is-disabled');
					$('#pick-members-selectbox').addClass('is-disabled');
					$('#pick-members-selectbox .selector-text').text('인원');
					$('#pick-time-selectbox .selector-text').text('시간 선택');
					$('#pick-time-selectbox .selector').click();
				},
				error : function(xhr, status, error) {
					popupNotification({
						msg: '시스템 에러가 발생하였습니다. 잠시 후 다시 시도해 주십시오. 문제가 계속 발생하면 관리자에게 문의해주십시오.',
						type: 'error',
						timer: 3000
					});
				}
			});
		},
		beforeShow: function() {
		    var time = new Date().getTime();
		    return this.lastShown === undefined || time - this.lastShown > 500;
	  }
	}).datepicker('option', datepicker_options);
	
	$(document).on('change', '#pick-time-selectbox input', function() {
		$('#pick-members-selectbox').removeClass('is-disabled');
		$('#pick-members-selectbox .selector-text').text('인원');
		$('#pick-members-selectbox .selectbox-option li').remove();
		var vacant = $(this).data('vacant');
		var valIndex = 2;
		for(var i = 0; valIndex <= vacant; i++) {
			var text = '<li>' +
			'<input type="radio" name="pick-members" value="' + valIndex + '" id="pick-members' + i + '">' +
			'<label for="pick-members' + i + '">' + valIndex + '명 </label>'+
			'</li>';
			$('#pick-members-selectbox .selectbox-option').append(text);
			valIndex++;
		}
		$('#pick-members-selectbox .selector').click();
	});
	
	$('.teaclass-intro-form').submit(function(event) {
		var selectedDate = $('.teaclass-intro-form input[name$="selectedDate"]').val();
		var selectedTime = $('.teaclass-intro-form input[name$="pick-time"]:checked').val();
		var selectedMembers = $('.teaclass-intro-form input[name$="pick-members"]:checked').val();
		var isLogin = JSON.parse($('.teaclass-intro-form input[name$="pvarIsLogin"]').val());
		var nextPath = '/kr/ko/museum/teastone/reservationStep1';
		if(!isLogin) {
			if(confirm("TeaStone 예약은 오설록 회원만 가능합니다. 로그인 하시겠습니까?")) {
				$(location).attr('href','/kr/ko/login?r=' + nextPath);
			}
			event.preventDefault();
		} else {
			return;
		}
	});
		
	// reservation step1
	// ----------------------------------------

	// calender
	var $selected_input = $('#selected-date-input'),
		$selected_div = $('#selected-date-div');
	
	// set hidden input
	$selected_input.datepicker({dateFormat: 'yy.mm.dd'});

	$('#selected-date-span').html($selected_input.data('selected-date'));
	var selectedDate = $selected_input.data('selected-date');
	// set calendar
	$selected_div.datepicker({
		dateFormat: 'yy.mm.dd',
		onSelect: function(input, inst) {
			var dateData, dateTxt;
			dateData = "year=" + inst.selectedYear + "&month=" + inst.selectedMonth + "&day=" + inst.selectedDay;
			dateTxt = $.datepicker.formatDate('yy.mm.dd', $selected_div.datepicker('getDate'));

			$selected_input.datepicker('setDate', $selected_div.datepicker('getDate'));

			// class time table set
			$.ajax({
				type : "POST",
				url : "/kr/ko/museum/teastone/selectTimeTable",
				cache : false,
				data : dateData,
			    dataType : "json",
				success : function(response) {
					$('#pick-time').empty();
					$('#pick-time-m').empty();
					$('#pick-time-m').append('<option value="">강의 시간을 선택해주세요.</option>');
					var maxApplicants = response.maxApplicants;
					$.each(response.classTimeTable, function(i, val) {
						// 시간선택 selectBox append
						var startAtDate = new Date(val.startAt);
						var endAtDate = new Date(val.endAt);
						var startAt = (startAtDate.getHours()<10?'0':'') + startAtDate.getHours() + ':' + (startAtDate.getMinutes()<10?'0':'') + startAtDate.getMinutes();
						var endAt = (endAtDate.getHours()<10?'0':'') + endAtDate.getHours() + ':' + (endAtDate.getMinutes()<10?'0':'') + endAtDate.getMinutes();
						var vacant = maxApplicants - val.totalApplicants;
			
						var standDate = new Date('2019',6-1,'1');
						var selDate = new Date(inst.selectedYear,inst.selectedMonth,inst.selectedDay);
						if(selDate.getTime() >= standDate.getTime()){
							//20190510_프리미엄티스톤 추가
							var balance = val.count;
							var balanceTxt = "";
							if(balance == 8){
								balanceTxt = "1차(베이직) ";
								balance = 1;
							}else if(balance == 7){
								balanceTxt = "3차(프리미엄) ";
								balance = 3;
							}else if(balance == 6){
								balanceTxt = "5차(프리미엄) ";
								balance = 5;
							}else{
								balanceTxt = val.count+"차(베이직) ";
							}
						}else{
							//20181002_프리미엄티스톤 추가
							var balance = val.count;
							var balanceTxt = "";
							if(balance == 6){
								balanceTxt = "5차(프리미엄) ";
								balance = 5;
							}else{
								balanceTxt = val.count+"차(베이직) ";
							}							
						}

						var text = '<li' + (vacant<=1?' class="is-disabled"':'') + '>' +
								'<input type="radio" name="classId" value="' + val.id + '" id="pick-time' + balance + '" data-vacant="' + vacant + '"  data-validation="required" data-validation-error-msg="강의 시간을 선택해 주십시요." data-validation-error-msg-container="#pick-time-error-dialog">' +
								'<label for="pick-time' + balance + '">' + balanceTxt + startAt + '~' + endAt + ' (잔여석 : ' + vacant + '석)</label>'+
								'</li>';
						$('#pick-time').append(text);
						var textMobile = '<option value="' + val.id + '" ' + (vacant<=1?'disabled ':'') + 'data-vacant="' + vacant + '">' + 
										balanceTxt +  startAt + '~' + endAt + ' (잔여석 : ' + vacant + '석)</option>';
						$('#pick-time-m').append(textMobile);
					});
					setClassTimeTable();
					$('#pick-members').html("<li><label>강의 시간을 선택해 주세요.</label></li>");
					$('#pick-members-m').empty().html('<option value="">인원수를 선택해주세요.</option>');
					$('#selected-date-span').html(input);
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
	})
	.datepicker('option', datepicker_options)
	.datepicker('setDate', selectedDate);	// set date with date from previous page

	if (selectedDate == "" || selectedDate === null) {
		$('#selected-date-div .ui-state-active').click();
	}
	// form validation
	$.validate({
		form : '#reservation-step1',
		errorMessageClass: 'error-msg',
		onError : function($form) {
		  popupNotification({
		  	msg: '예약자 정보를 바르게 입력했는지 확인해주세요!',
		  	type: 'error',
		  	timer: 3000
		  });
		},
		onSuccess : function($form) {},
		onValidate : function($form) {},
		onElementValidate : function(valid, $el, $form, errorMess) {
		  //console.log('Input ' + $el.attr('name') + ' is ' + (valid ? 'VALID' : 'NOT VALID') );
		}
	});
	
	// set Class time selector
	function setClassTimeTable(selectedClass) {
		$('#reservation-step1 .class-time').find('input').each(function(){
			if ($(this).data('vacant') <= 1) {
				$(this).attr('disabled',true);
			}
			if(selectedClass != null) {
				if ($(this).val() == (selectedClass)) {
					$('#pick-members').data('vacant',$(this).data('vacant'));
				}
			}
		});
		$('#pick-time-m option').each(function() {
			if ($(this).data('vacant') <= 1) {
				$(this).attr('disabled',true);
			}
		});
		
		if(selectedClass != null) {
			$('#pick-time-m option[value="' + selectedClass + '"]').attr('selected',true);
			$('#pick-time input[value="' + selectedClass + '"]').siblings('label').click();
		}
	}
	var selectedClass = $('#pick-time').data('selected-class');
	setClassTimeTable(selectedClass);
	
	// on class time change
	$(document).on('change', '#reservation-step1 .class-time input', function() {
		$('#pick-time-m option[value="' + $(this).val() + '"]').attr('selected',true);
		var vacant = $(this).data('vacant');
		setClassVacant(vacant);
	});
	
	$(document).on('change', '#pick-time-m', function() {
		$('#pick-time input[value="' + $(this).val() + '"]').attr('checked', true);
		$('#pick-time input[value="' + $(this).val() + '"]').siblings('label').click();
		var vacant = $(this).find('option:selected').data('vacant');
		setClassVacant(vacant);
	});
	
	// set vacant applicants selector
	function setClassVacant(loop_vacant, selectedMember) {
		var valIndex = 2;
		if(loop_vacant >= 2) {
			$('#pick-members').empty();
			$('#pick-members-m').empty().html('<option value="">인원수를 선택해주세요.</option>');
		}
		for(var i = 0; valIndex <= loop_vacant; i++) {
			var text = '<li>' +
			'<input type="radio" name="applicantNumber" value="' + valIndex + '" id="pick-members' + i + '" data-validation="required" data-validation-error-msg="인원을 선택해 주십시요." data-validation-error-msg-container="#pick-members-error-dialog"';
			if (selectedMember == valIndex) {
				text += ' checked ';
			}
			text += '>' +
			'<label for="pick-members' + i + '">' + valIndex + '명 </label>'+
			'</li>';
			$('#pick-members').append(text);
			
			var textMobile = '<option value="' + valIndex + '">' + valIndex + '명 </option>';
			$('#pick-members-m').append(textMobile);
			valIndex++;
		}
		$('#pick-members-m option[value="' + selectedMember + '"]').attr('selected',true)
		$('#pick-members input[value="' + selectedMember + '"]').siblings('label').click();
	}
	var loop_vacant = $('#pick-members').data('vacant');
	var selectedMember = $('#pick-members').data('selected-member');
	setClassVacant(loop_vacant, selectedMember);
	
	// on class time change
	$(document).on('change', '#pick-members input', function(){
		$('#pick-members-m option[value="' + $(this).val() + '"]').attr('selected',true);
	});
	
	$(document).on('change', '#pick-members-m', function(){
		$('#pick-members input[value="' + $(this).val() + '"]').attr('checked', true);
		$('#pick-members input[value="' + $(this).val() + '"]').siblings('label').click();
	});
	
	// on error redirection
	var errMsg = $('#reservation-step1 input[name$="errMsg"]').val();
	if(errMsg != null && errMsg != "") {
		popupNotification({
		  	msg: errMsg,
		  	type: 'error',
		  	timer: 3000
		});
		$selected_div.find('.ui-state-active').click();
	}
	
	// reservation step2
	// ----------------------------------------
	
	$('.btn-back').click(function(){
		$(location).attr('href','/kr/ko/museum/teastone/reservationStep1');
	});
		
	});
});
