// utils/review.js
// product item page: open review box

'use strict';

define(['utils'], function(){

	// write review ()
	var $btn_write = $('.go-to-write'),
			$wr = $('#write-review'),
			is_setup = false;

	function setup() {
		$wr.data('is-open', false);

		$btn_write.on('click', function(event){

			if ( !$wr.data('is-open') ) {
				open();
			} else {
				close();
			}
			event.preventDefault();
		});

		$wr.on('click', '.btn-close', close);

		!is_setup && require(['autosize',
				'lib/jquery.maxlength.min'
			], function(){

			// textarea
			$('textarea').textareaAutoSize();
			$('textarea').maxlength({
    		counterContainer: $("#counter-container"),
    		// text: '<b>%length</b>/150자'
    		text: '<b>%length</b>/' + $('textarea').attr('maxlength') +'자'
			});

			is_setup = true;
		});

		IG.DEV && console.log('[review] setup!');
	}

	function close() {
		$wr.slideUp();
		$wr.data('is-open', false);
		$.modal.close();
	}

	function open() {
		$('[href="#write-review"]').hide();
		$wr.slideDown();
		$('#write-review-textarea').focus();
		$wr.data('is-open', true);
	}

	return {
		setup: setup,
		close: close,
		open: open
	};
});
