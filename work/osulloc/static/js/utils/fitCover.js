// utils/fitCover.js
// 이미지, 영상 요소 - e.g. brandstory 배경 영상

'use strict';

define(['$'], function($){

	var frameW = IG.windowWidth,
			frameH = IG.windowHeight,
			frameR = parseFloat(frameH / frameW),
			objR = 0.5625;

	function cover($clip, $frame) {
		var	w, h, ml, mt;

		if ( $frame !== undefined ) {
			frameW = $frame.outerWidth();
			frameH = $frame.outerHeight();
			frameR = parseFloat(frameH / frameW);
		}

		if ( frameR > objR ) {
			w = frameH / objR;
			ml = (frameW - w) / 2;
			$clip.width(w)
				.css('margin-left', ml + 'px');

		} else {
			h = frameW * objR;
			mt = (frameH - h) / 2;
			$clip.css('margin-top', mt + 'px');
		}
	}

	return {
		cover: cover
	};
});
