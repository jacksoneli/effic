// @file cs/main.js

require(['ui', 'SmoothScroll'], function(ui, SmoothScroll) {
	'use strict';

	$(function(){
		$('.faq').accordion({
			titleSelector:  '.faq-q',
			contSelector:   '.faq-a',
		});

		$('.tabs').simpleTab({
			activeClass: 'is-current',
			scroll: true,
			scrollOffset: -100
		});

		// mobile contents accordion
		var accordionList;

		if ( $('.accordion').length ) {
			switchLayout('rwd_accordion', function() {
					var is_over_medium = (IG.$win.width() > 767) ? true : false;
			    return is_over_medium;
				}, function(state) {
					if ( state ) {
						accordionList && accordionList.destroy();
					} else {
						accordionList = $('.accordion').accordion({
							titleSelector:  '.ms-q',
							contSelector:   '.ms-a',
						});
					}
				});
		}
	});

});
