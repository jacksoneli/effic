require(['museum/reservation', 'datepicker', 'validate'], function() {
	'use strict';

	// form validation sample code
	IG.DEV && require(['validate'], function() {
		$.validate({
			form : '#reservation-step1',
			errorMessageClass: 'error-msg',
			borderColorOnError: '',
			onError : function($form) {
			  popupNotification({
			  	msg: '예약자 정보를 바르게 입력했는지 확인해주세요!',
			  	timer: 3000
			  });
			},
			onSuccess : function($form) {},
			onValidate : function($form) {},
			onElementValidate : function(valid, $el, $form, errorMess) {
			  IG.DEV && console.log('Input ' + $el.attr('name') + ' is ' + (valid ? 'VALID' : 'NOT VALID') );
			}
		});
	});

	$('#selected-date-div').datepicker('setDate', '2016-3-12');

	$('.call-datepicker').datepicker({

			onSelect: function(input, inst) {
				// var h = parseInt(inst.dpDiv.height());
				// inst.dpDiv.css({marginTop: -inst.dpDiv.offsetHeight + 'px'});
				console.log('for dev');
				$('#pick-time-selectbox').removeClass('is-disabled');
			}
	})

	// form validation
	$.validate({
		form : '#reservation-step1',
		errorMessageClass: 'error-msg',
		onError : function($form) {
		  popupNotification({
		  	msg: '예약자 정보를 바르게 입력했는지 확인해주세요!',
		  	type: 'error',
		  	timer: 5000
		  });
		},
		onSuccess : function($form) {
			// Jin 실장님이 쓰셨던 폼 전송 관련 코드 '-'

			// var url = $form.attr('action');
			//
			// $.ajax(url, {
			// 	method: 'POST',
			// 	dataType: 'json',
			// 	data: $form.serialize(),
			// 	success: function(data, status, xhr) {
			// 		if (data.result) {
			// 			popupNotification({
			// 				msg: '프로젝트 문의를 전달하였습니다.',
			// 				type: 'noti',
			// 				timer: 3000
			// 			});
			// 			$form.get(0).reset();

			// 		} else {
			// 			popupNotification({
			// 				msg: data.message,
			// 				type: 'error',
			// 				timer: 7000
			// 			});
			// 		}
			// 	},
			// 	error: function(xhr, status, error) {
			// 		popupNotification({
			// 			msg: '시스템 에러가 발생하였습니다. 잠시 후 다시 시도해 주십시오. 문제가 계속 발생하면 관리자에게 문의해주십시오.',
			// 			type: 'error',
			// 			timer: 7000
			// 		});
			// 	},
			// 	complete: function(xhr, status) {
			// 		// TODO
			// 	}
			// });
		  // return false;
		},
		onValidate : function($form) {
		},
		onElementValidate : function(valid, $el, $form, errorMess) {
		  console.log('Input ' + $el.attr('name') + ' is ' + (valid ? 'VALID' : 'NOT VALID') );
		}
	});

});
