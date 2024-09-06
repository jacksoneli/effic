// login.js - 개발 시 수정해서 쓰세요 ~_~
require(['validate'], function() {
	$.validate({
		form: '#login-member-form, #login-nonmember-form',
		errorMessageClass: 'error-msg',
		borderColorOnError: '',
		onError : function($form) {
			var msg = '';

			if ( $form.attr('id') == 'login-member-form' ) {
				msg = '로그인 정보를 입력해주세요!';
			} else {
				msg = '주문조회 정보를 입력해주세요!';
			}

		  popupNotification({
		  	msg: msg,
		  	timer: 3000
		  });
		},
		onSuccess : function($form) {
		},
		onValidate : function($form) {
		},
		onElementValidate : function(valid, $el, $form, errorMess) {
		  IG.DEV && console.log('Input ' + $el.attr('name') + ' is ' + (valid ? 'VALID' : 'NOT VALID') );
		}
	});
});
