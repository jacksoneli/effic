// @file guide/counseller.js

require(['ui', 'SmoothScroll'], function(ui, SmoothScroll) {
	'use strict';

	$(function(){

		var $cnsllrPage = $('.counsellor'),
			$cnsllrItem = $cnsllrPage.find('.counsellor-item'),
			$cnsllrTrigger = $('.counsellor-q');

		if ( !$cnsllrPage.length ) return;

		$cnsllrPage.accordion({
			titleSelector:  '.counsellor-q',
			contSelector:   '.counsellor-a',
			speed: 800
		});

		scllorAnimation();

		function scllorAnimation() {

			var tl = new TimelineLite()

			TweenMax.set($cnsllrItem, {
				autoAlpha: 0,
				rotationX: -90,
				'background-color' : 'rgb(150, 150, 150)'
			});

			tl.staggerTo($cnsllrItem, 0.4, {
				autoAlpha: 1,
				rotationX: 0,
				delay: 0.4,
				'background-color' : 'rgb(255, 255, 255)'
			}, 0.2);
		}
	});
});
