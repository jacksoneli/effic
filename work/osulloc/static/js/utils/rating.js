// utils/rating.js
// rating stars

'use strict';

define(['utils'], function(){

  // review rating icon
  function init() {
	  $('.rating').filter(function() {
	  	var set = ($(this).has('.icon-star').length > 0) ? !1 : !0;
	    return set;
	  }).each(function(i, el){
	    var $el = $(el),
	        r = $el.text().replace(/[^0-9]/g,''),
	        i = 0;

	    for (; i < 5 ; i++) {
	      $el.append('<i class="icon-star" />');
	    }

	    $el.find('.icon-star:lt(' + r + ')').addClass('is-on');
	  });
	}

	return {
		init: init
	}

});
