// @file action/view.js

require(['ui', 'slick', 'sticker', 'SmoothScroll'], function() {
	'use strict';

	IG.DEV && console.log('[OSULLOC] action/view');

	$(function(){

		var $topVisual = $('.top-visual-img'),
			$rltdArcls = $('#related-articles'),
			$rltdLst = $rltdArcls.find('.related-list'),
			$featuredVideo = $('.featured-video');

		$topVisual.rollUp();

		$rltdLst.slick({
			infinite: true,
			slidesToShow: 2,
			slidesToScroll: 1
		});

		$('[data-position="sticky"]').stickSmoothly();

		$featuredVideo.on('click', function(event){
			event.preventDefault();

			$(this).ytiframe({autoplay: 1});
		});
	});
});
