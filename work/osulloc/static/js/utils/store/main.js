// @file store/main.js

require(['ui', 'slick', 'SmoothScroll'], function() {
	'use strict';

	$(function() {
		//
		$('.store-events').slick({
			mobileFirst: true,
			dots: true,
			arrows: false,
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			focusOnSelect: false,
		  responsive: [
		    {
		      breakpoint: 599,
		      settings: 'unslick'
		    }
		  ]
		});

		$('.photo-slider').slick({
			dots: true,
			autoplay: true,
			arrows: false,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			focusOnSelect: false
		});

		if ( $('.rating').length ) {
			require(['utils/rating'], function(rating){
				rating.init();
			});
		}

	});
});
