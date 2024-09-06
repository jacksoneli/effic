// @file action/masonry.js

require(['ui', 'masonry', 'imagesloaded', 'SmoothScroll'], function(ui, Masonry, imagesloaded, SmoothScroll) {
	'use strict';

	$(function(){
		$('.rating').length && require(['utils/rating'], function(rating){
			rating.init();
		});
	});

	require(['jquery-bridget/jquery.bridget'], function(jQueryBridget) {

		// make Masonry a jQuery plugin
		jQueryBridget( 'masonry', Masonry, $ );
		// now you can use $().masonry()

		var msnry = $('#communitea-list').masonry({
			itemSelector: '.communitea-item',
			gutterWidth: 0,
			isAnimated: true,
			animationOptions: {
				duration: 300,
				queue: false
			}
		});

		// update layout size and document height after images loaded
		msnry.imagesLoaded().progress(function() {
			msnry.masonry('layout');
			IG.contentHeight = $(document).height();
		});
	});
});
