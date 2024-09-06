// utils/osullocNow.js
// osulloc now items motion effect module

'use strict';

define(['_', 'ui'], function(){

	function effect() {
		var tweenTime = 0.5;
		var $list = $('.now-list');

		TweenMax.staggerFromTo($list.find('li:in-viewport').filter(function() {
				return !$(this).hasClass('is-loaded');
			}), tweenTime, {
				scale: 0.9,
				autoAlpha: 0,
				onCompleteParams: ['{self}'],
				onComplete: function(self) {
					$(self.target).addClass('is-loaded');
				}
			},{
				scale: 1,
				autoAlpha: 1,
				ease: Sine.easeOut
			}, 0.2);

		if ( $list.find('li').length == $list.find('li.is-loaded').length ) {
			IG.$win.off('scroll.listEffect');
			IG.DEV && console.log('[window.off] scroll.listEffect');
		}
	}

	function listEffect() {
		IG.$win.on('scroll.listEffect', _.bind(effect, this));
		IG.$win.trigger('scroll');

		IG.DEV && console.log('[window.on] scroll.listEffect');
	}

	return {
		listEffect: listEffect
	};
});
