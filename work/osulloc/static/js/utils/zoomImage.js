// utils/legacy.js
// fallback scripts for ie8

'use strict';

define(['utils'], function(){

	IG.$body.on('click', '.x-image-zoom', function(){
		(!$(this).data('zoom')) ? zoomIn($(this)) : zoomOut($(this));
		return false;
	});


	function zoomIn($btn) {

		TweenMax.to($btn.parent(), 0.3, {
			width: '100%',
			height: 'auto',
			onComplete: function(){
				$btn.data('zoom', true);
			}
		});

		$btn.parent().css('cursor', 'zoom-out').one('click.zoomOut', function() {
			zoomOut($btn);
		});

		$btn.empty().append('<i class="icon-zoom-out"></i><span class="blind">이미지 줄이기</span>');
	}


	function zoomOut($btn) {

		TweenMax.to($btn.parent(), 0.3, {
			width: '90px',
			height: '60px',
			onComplete: function(){
				$btn.data('zoom', false);
			}
		});

		$btn.parent().css('cursor', 'default').off('click.zoomOut');

		$btn.empty().append('<i class="icon-zoom-in"></i><span class="blind">이미지 크게보기</span>');
	}

});
