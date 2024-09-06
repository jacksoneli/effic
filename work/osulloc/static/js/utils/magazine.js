// utils/magazine.js
// magazine list effect module

'use strict';

define(['_', 'ui'], function(){

	function effect() {
		var tweenTime = 0.8;

		TweenMax.staggerFromTo($('.magazine-thumb:in-viewport').filter(function() {
				return !$(this).hasClass('is-loaded');
			}), tweenTime, {
				scale: 1.1,
				autoAlpha: 0,
				onCompleteParams: ['{self}'],
				onComplete: function(self) {
					$(self.target).addClass('is-loaded');
				}
			},{
				scale: 1,
				autoAlpha: 1,
				ease: Sine.easeOut
			}, 0.5);

		if ( $('.magazine-thumb').length == $('.magazine-thumb.is-loaded').length ) {
			IG.$win.off('scroll.magazineListEffect');
			IG.DEV && console.log('[window.off] scroll.magazineListEffect');
		}
	}

	function listEffect() {
		IG.$win.on('scroll.magazineListEffect', _.bind(effect, this));
		IG.$win.trigger('scroll');

		IG.DEV && console.log('[window.on] scroll.magazineListEffect');
	}

	return {
		listEffect: listEffect
	};
});
