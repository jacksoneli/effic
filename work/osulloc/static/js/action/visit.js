// @file action/visit.js
// 방문기 뷰페이지

require(['ui', 'sticker'], function() {
	'use strict';

	$(function(){
		require(['SmoothScroll']);

		// floating side bar
		$('[data-position="sticky"]').stickSmoothly();
		$('#reply').hide();

		IG.$body.on('click', 'button.reply', function(){
			$('#reply').show();
			$('#reply').appendTo($(this).parents('.comment-box'));
			$('#reply').find('form')[0].reset();
		});

		require(['utils/zoomImage']);
	});
});
