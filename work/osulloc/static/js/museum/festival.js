// @file museum/fastival.js

require(['ui', 'SmoothScroll', 'slick'], function() {

	loadCss(require.toUrl('../css/festival.css'));

	$(function(){

		if (!Modernizr.mq('only all') && getMedia() == 'legacy' ) {
			loadCss(require.toUrl('../css/festival-ie.css'));
		}

		var $tab = $('.tabs');

		TweenMax.to('main', 0.5, {
			autoAlpha: 1,
			clearProps: "all",
			onComplete: function() {
				$('main').removeClass('main--about');
			}
		});

		$('.coupon-btn').click(function(event) {
			var url = $(this).attr('href'),
					popW = 480,
					idx = $(this).data('n'),
					posLeft  = (window.screen.width - popW)/2;

			window.open(url, 'festivalCoupon' + idx, 'width=' + popW + ', height=689, top=180, left=' + posLeft + 'menubar=0, toolbar=0, status=0, location=false, scrollbars=0');
			event.preventDefault();
		});

		$('.btn-coupon').click(function(event) {
			$tab.find('.tab').eq(2).trigger('click');
			event.preventDefault();
		});

		$tab.simpleTab({
			activeClass: 'is-current',
			scroll: true,
			scrollOffset: (getMedia() < 3) ? -49 : -100
		});

		$('.festival-slider').slick({
			fade: true,
			autoplay: true,
			autoplaySpeed: 4000,
			speed: 600,
			dots: true,
			arrows: false
		});

		$('.program-slider').slick({
			autoplay: true,
			autoplaySpeed: 2000,
			dots: true,
			arrows: false
		});
	});
});
