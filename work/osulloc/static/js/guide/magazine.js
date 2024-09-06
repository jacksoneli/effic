// @file guide/magazine.js

require(['ui', 'SmoothScroll'], function() {
	'use strict';

	$(function(){

		require(['utils/magazine'], function(magazine){
			magazine.listEffect();
		});
	});
});
