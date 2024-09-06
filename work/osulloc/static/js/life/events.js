// @file life/events.js

require(['ui', 'sticker', 'slick', 'modal', 'SmoothScroll'], function() {
	'use strict';

	$(function(){

		// modal popup
		$.modal.defaults = IG.modal_defaults;

		var $tabs = $('.tabs');

		$tabs.simpleTab({
			activeClass: 'is-current'
		});

		// floating side bar
		$('[data-position="sticky"]').stickSmoothly();

		$('.featured-video').ytiframe({autoplay: 1});

		// side bar slider
		$('.other-list').slick({
			vertical: true,
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 3
		});

		$('#reply').hide();

		IG.$body.on('click', 'button.reply', function(){
			$('#reply').show();
			$('#reply').appendTo($(this).parents('.comment-box'));
			$('#reply').find('form')[0].reset();
		});


		IG.$body.on('click', 'button[type=reset]', function() {
			//
			$(this).parents('form').find('.dz-remove').trigger('click');
			$(this).parents('form').find('.maxlength').find('b').text(0);
		});

		require(['utils/zoomImage']);
	});
});
