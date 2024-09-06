'use strict';

define(['utils', 'utils/fitCover'], function(utils, fit){

	$(function(){
		IG.DEV && console.log('brandstory init');

		var $clip = $('#bs-clip');

		IG.$win.scrollTop(0);

		TweenMax.to('main', 1.6, {
			autoAlpha: 1,
			clearProps: 'all',
			delay: 0.6,
			onComplete: function() {
				$('main').removeClass('main--about');
			},
			ease: Sine.easeInOut
		});

		if ( Modernizr.video && IG.useEditor ) {
			$clip.appendTo('[data-bg="c0"]').show();
			fitCover();
			document.getElementById('v-c0').play();

			IG.$win.on('resize.updatePos', function() {
				clearTimeout(IG.resizeBrandstory);
				IG.resizeBrandstory = setTimeout(fitCover, 100);
			});
		}

		function fitCover() {
			var w = 0,
					h = 0,
					ml = 0,
					mt = 0;

			w = 860 / 0.5625;

			if ( IG.windowWidth < w ) {
				h = 860;
				ml = (IG.windowWidth - w) / 2;

				$clip.css({
					width: w,
					height: h,
					marginLeft: ml,
					marginTop: mt
				});

			} else {
				w = '100%';
				h = '100%';

				fit.cover($clip);
			}
		}

		$('[data-bg]').each(function(i, el){
			//
			var $el = $(el),
					scene_name = $el.data('bg'),
					index = $el.data('index');

			if ( $el.hasClass('bs-heading') ) {
				$el.addClass('scene-'+ scene_name);

			} else {
				$el.wrap('<div class="bs-chap" />').wrap('<div class="bs-chap-cell" />').parent().parent().addClass('scene-'+ scene_name);
			}
		});

		$('.bs-bg').remove();

		$('a.link').click(function(event) {
			$(this).modal({
				escapeClose: true,
				closeText: '닫기',
				closeClass: '',
				showClose: true,
				modalClass: 'modal-full',
				spinnerHtml: null,
				showSpinner: true,
				fadeDuration: 200,
				fadeDelay: 0
			});

			return false;
		});

	});

});
