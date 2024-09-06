// @file misc/main.js
require(['ui', 'SmoothScroll'], function() {
	'use strict';

	$(function() {

		// login tab
		var $tabs = $('.tabs');

		$tabs.simpleTab({
			activeClass: 'is-current'
		});

	});
});
