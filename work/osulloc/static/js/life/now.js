// @file now.js

require(['ui', 'SmoothScroll'], function(ui, SmoothScroll) {
	'use strict';

	$(function(){

		require(['utils/osullocNow'], function(osullocNow){
			osullocNow.listEffect();
		});

	});
});
