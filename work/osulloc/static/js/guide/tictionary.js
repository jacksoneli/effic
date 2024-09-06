// @file guide/tictionary.js
// @page t-ictionary list

require(['ui', 'masonry', 'imagesloaded', 'SmoothScroll'], function(ui, Masonry, imagesloaded, SmoothScroll) {

	'use strict';

  require(['jquery-bridget/jquery.bridget'], function(jQueryBridget) {

      // make Masonry a jQuery plugin
      jQueryBridget( 'masonry', Masonry, $ );
      // now you can use $().masonry()

      var tictionary = $('#tictionary-list').masonry({
        itemSelector: '.item',
        gutterWidth: 0,
        isAnimated: true,
        animationOptions: {
          duration: 300,
          queue: false
        }
      });

      tictionary.imagesLoaded().progress(function() {

    		tictionary.masonry('layout');
    		IG.contentHeight = $(document).height();
    	});
    }
  );
});
