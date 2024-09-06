// @file index.js

require(['ui', 'slick', 'SmoothScroll'], function() {
	'use strict';

	$(function() {
		// ... osulloc index

		$('.main-promotion .slider').slick({
			dots: true,
			infinite: true,
			autoplay: true,
			slidesToShow: 1,
			slidesToScroll: 1
		});

		$('.main-bestseller .slider').slick({
			dots: true,
			infinite: false,
			autoplay: true,
			slidesToShow: 2,
			slidesToScroll: 2,
			mobileFirst: true,
		  responsive: [
		    {
		      breakpoint: 599,
		      settings: {
		        slidesToShow: 3,
		        slidesToScroll: 3
		      }
		    },
		    {
		      breakpoint: 1023,
		      settings: {
		        slidesToShow: 4,
		        slidesToScroll: 4
		      }
		    }
		  ]
		});

		$('.main-counsellor .slider').slick({
				dots: true,
				arrows: false,
				fade: true,
				infinite: true,
				slidesToShow: 1,
				autoplay: true,
				autoplaySpeed: 2500
			});

	});

});
