'use strict';

define(['utils', 'utils/fitCover'], function(utils, fit){

	var articleH = 0,
			scrollTop = 0,
			deltaValue = -1,
			move_init = 100,
			maxY = 0,
			posY = [],
			scenes = [],
			scene_cur = 0,
			is_changing = false,
			is_hide_footer = true,
			is_playable = Modernizr.video && IG.useEditor,

			$footer, $nav, $visual, $logo, $frame, $scroller, $clip, $bgs;

	$(function(){
		$footer = $('#footer');
		$nav = $('.bs-nav');
		$visual = $('.visual');
		$logo = $('.bs');
		$frame = $('#bs-frame');
		$scroller = $('.bs-content');
		$clip = $('#bs-clip');
	});

	function setup() {
		TweenMax.set($scroller, {
			scrollTo: 0
		});

		if ( !Modernizr.cssvhunit ) {
			$('.bs-heading').css('display', 'block').height(IG.windowHeight * 0.8);
		}

		if (!$('.bs-bg').length) {
			$('[data-bg]').each(function(i, el){
				$('<div class="bs-bg scene-'+ $(el).data('bg') +'" data-index="'+i+'" />').prependTo($('#bg-wrap'));
			});
		}

		if (is_playable) {
			fit.cover($clip, $frame);
			$('<video loop preload id="v-c0"><source src="/kr/ko/static/clips/about/bg_brandstory.mp4" type="video/mp4"> <source src="/kr/ko/static/clips/about/bg_brandstory.webm" type="video/webm"></video>').appendTo($('#bs-clip-obj'));
			$('.scene-c0').addClass('is-video');
		}

		$bgs = $('.bs-bg');
		$bgs.removeClass('bg-cur');
		$('.scene-a0').addClass('bg-cur');
	}

	function getPos() {
		scenes = [];
		posY = [];

		articleH = $('.bs-article').height();
		maxY = -1*articleH + IG.windowHeight/2;

		$('[data-bg]').each(function(i, el){
			var $el = $(el);

			$el.data('index', i);
			scenes.push($el.data('bg')+'');
			posY.push($el.offset().top);
		});

		$('.bs-section').each(function(i, el){
			var $el = $(el);
			$el.data('top', $el.offset().top);
		});

		IG.DEV && console.log('[scenes]', posY,scenes, scenes.length, 'articleH:', articleH);
	}



	function moveTo(y) {

		TweenMax.to($scroller, 0.5, {
			y: y,
			onCompleteParams: ["{self}"],
	    onComplete: function(self) {
	    	scrollTop = self.target[0]._gsTransform.y;
	    },
			ease: Power1.easeOut
		});

		hideFooter();

		TweenMax.to($nav, 0.3, {
			autoAlpha: 1,
			delay: 1,
			clearProps: 'all'
		});

		if ( y == 0 ) {
			TweenMax.set($visual, {
				marginTop: 0
			});
			TweenMax.set($logo, {
				y: 0
			});
			setTimeout(getPos, 0.5);
		}
	}


	function moving(move) {
		if ( move >= 0 ) return;

		TweenMax.set($scroller, {
			y: move
		});

		scrollHandler(move);
	}


	function moveUp(move) {
		var move = move || move_init,
				time = (move < 50) ? 0.1 : 0.3;

		TweenMax.to($scroller, time, {
			y: '+=' + move,
			onUpdateParams: ["{self}"],
	    onUpdate: function(self) {
	    	var y = self.target[0]._gsTransform.y;

	    	scrollHandler(y);

	    	if ( y >= 0 ) {
	    		TweenMax.set($scroller, {
	    			y: 0
	    		});
	    	}
	    },
			ease: Power1.easeInOut
		});

		hideFooter();

		deltaValue = 1;
	}


	function moveDown(move, time) {
		var move = move || move_init,
				time = time || 0.3;

		TweenMax.to($scroller, time, {
			y: '-=' + move,
			onUpdateParams: ["{self}"],
	    onUpdate: function(self) {
	    	var y = self.target[0]._gsTransform.y;

	    	scrollHandler(y);

        if ( y < maxY ) {
        	TweenMax.to($scroller, 0.2, {
        		y: maxY
        	});
        	showFooter();
        }
	    },
			ease: Power0.easeNone
		});

		deltaValue = -1;
	}


	function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function scrollHandler(y) {
		var y = (isNumeric(y)) ? y : 0,
				scene = 0;

		scrollTop = -1 * y;

		$.each(posY, function(i, val){
			if ( scrollTop > val - IG.windowHeight/2 ) {
				scene = i;
			}
		});

		if ( scrollTop > 0 && IG.windowHeight*2 ) {
			TweenMax.set($visual, {
				marginTop: scrollTop/IG.windowHeight*(-90)
			});
			TweenMax.set($logo, {
				y: scrollTop/IG.windowHeight*(76)
			});
		}

		if ( !is_changing && scene_cur != scene ) {
			changeScene(scene);
		}
	}

	function hideFooter(option) {

		if ( option == 'set' ) {

			TweenMax.set($footer, {
				position: 'absolute',
				bottom: '-100%',
				left: '0',
				width: '100%'
			});

			$footer.hide();

		} else {

			if ( !is_hide_footer ) {
				TweenMax.to($footer, 1.2, {
					bottom: '-100%',
					onComplete: function() {
						$footer.hide();
					},
					ease: Power2.easeIn
				});
			}
		}

		is_hide_footer = true;
	}

	function showFooter() {
		$footer.show();

		TweenMax.to($footer, 1, {
			bottom: '0',
			ease: Power2.easeOut,
			onComplete: function() {
				is_hide_footer = false;
			}
		});
	}



	function changeScene(next_scene) {
		IG.DEV && console.log('[change scene] ', scenes[scene_cur], ' --> ', scenes[next_scene]);

		TweenMax.killTweensOf($scroller);

		$bgs.filter(function(){
			return !$(this).hasClass('bg-cur');
		}).hide();

		$frame.find('.scene-' + scenes[next_scene]).show();

		if ( is_playable ) {

			if ( scenes[next_scene] == 'c0' ) {
				IG.DEV && console.log('[scene] c0: background video');

				document.getElementById('v-c0').play();
				$clip.show();
				TweenMax.to($clip, 1, {autoAlpha: 1});

			} else if ( $clip.is(':visible') ) {
				document.getElementById('v-c0').pause();
				TweenMax.to($clip, 1, {
					autoAlpha: 0,
					onComplete: function() {
						$clip.hide();
					}
				});
			}
		}

		if ( scene_cur != next_scene ) {
			sceneOut(next_scene);
		}
	}

	function sceneOut(next_scene) {
		// fadeOut current scene
		var $obj = $('.bg-cur');

		is_changing = true;
		TweenMax.killTweensOf($scroller);

		TweenMax.to($obj, 1.2, {
			autoAlpha: 0,
			clearProps: 'all',
			onComplete: function() {
				scene_cur = next_scene;
				is_changing = false;

				$obj.removeClass('bg-cur').hide();
				$frame.find('.scene-'+scenes[next_scene]).addClass('bg-cur');
			},
			ease: Power1.easeInOut
		});
	}

	function gotoSection(hash) {
		var y = $(hash).data('top') * (-1) + IG.navHeight,
				$cur = $('.bg-cur');

		is_changing = false;
		TweenMax.killTweensOf($scroller);
		TweenMax.killTweensOf($cur);

		TweenMax.to($nav, 0.3, {
			autoAlpha: 0
		});

		changeScene($(hash).find('[data-bg]').eq(0).data('index'));
		moveTo(y);
	}



	function top() {
		return scrollTop;
	}

	function height() {
		return articleH;
	}

	return {
		deltaValue: deltaValue,
		height: height,
		top: top,
		setup: setup,
		getPos: getPos,
		moving: moving,
		moveTo: moveTo,
		moveUp: moveUp,
		moveDown: moveDown,
		changeScene: changeScene,
		gotoSection: gotoSection,
		hideFooter: hideFooter
	}

});
