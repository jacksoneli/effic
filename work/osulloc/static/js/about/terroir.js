// @file about/terroir.js

require(['ui', 'modal', 'slick', 'SmoothScroll'], function() {
	'use strict';

	loadCss(require.toUrl('../css/terroir.css'));


	$(function(){
		IG.$win.scrollTop(0);

		TweenMax.to('main', 1.2, {
			autoAlpha: 1,
			delay: 0.3,
			clearProps: 'all',
			onComplete: function() {
				$('main').removeClass('main--about');
			},
			ease: Sine.easeInOut
		});

		var slider = {};

		slider = $('.ts-slider').slick({
			fade: true,
			autoplay: false,
			arrows: false,
			speed: 2000,
			pause: 4800
		});

		var $main = $('main'),
				$header = $('#ts-header'),
				$title = $header.find('.ts-title'),
				$big_markers = $('.map--big').find('.marker'),
				$nav = $('#ts-nav'),
				$s1 = $('#ts-aroma'),
				$s2 = $('#ts-color'),
				$s3 = $('#ts-flavor'),
				$sections = $('.ts-section'),
				current_scene = 0,
				is_moving = false;

		setup();

		// events
		function onMouseEvent() {			
			is_moving = false;

			IG.$body.on('DOMMouseScroll.nav mousewheel.nav', function(event) {
				var deltaValue = event.originalEvent.wheelDelta/180 || (event.originalEvent.detail*-1)/180;

				if( deltaValue < 0 && current_scene == 0 ) {
					outIntro();
					is_moving = true;
					event.preventDefault();
					event.stopPropagation();
				}

				if ( current_scene == 1 ) {
					if ( deltaValue > 0 && IG._scrollTop < 10 ) {
						backIntro();
						is_moving = true;
						event.preventDefault();
						event.stopPropagation();
					}
				}
			});
		}

		onMouseEvent();

		IG.$body.on('keydown', function(event) {

			switch (event.keyCode) {
				// left
				case 37:
					if ( current_scene == 2 ) {
						$sections.filter('.is-active').find('.ts-prev').trigger('click');
						event.preventDefault();
						event.stopPropagation();
					}
					break;

				// up
				case 38:
					if ( current_scene == 1 ) {
						backIntro();
						event.preventDefault();
						event.stopPropagation();
					}
					break;

				// right
				case 39:
					if ( current_scene == 2 ) {
						$sections.filter('.is-active').find('.ts-next').trigger('click');
					}
					break;

				// down
				case 40:
					if ( current_scene == 0 ) {
						outIntro();
						event.preventDefault();
						event.stopPropagation();
					}
					break;
			}
		});

		$main.on('touchstart', function(event){
			var touches = event.originalEvent.touches;

			if (touches && touches.length) {
			  IG.startX = touches[0].pageX;
			  IG.startY = touches[0].pageY;

			  IG.currentX = IG.startX;
			  IG.currentY = IG.startY;

			  IG.deltaX = 0;
			  IG.deltaY = 0;

			  $main.bind('touchmove', touchmove);

				IG.DEV && console.log('[touchstart] x:', IG.startX, ', y:', IG.startY);
			}
		});

		function touchmove(event) {
		  var touches = event.originalEvent.touches;

		  if (touches && touches.length) {
		    IG.deltaX = IG.startX - touches[0].pageX;
		    IG.deltaY = IG.startY - touches[0].pageY;
		  }

		  if ( current_scene < 2 ) {
		  	event.preventDefault();
		  }
		}

		$main.on('touchend', function(event){
			  if (IG.deltaY >= 50 ) {
			    $main.trigger("swipeUp");
			  }
			  if (IG.deltaY <= -50 ) {
			    $main.trigger("swipeDown");
			  }

				$main.off('touchmove');
			})
			.on('swipeUp', function(){
				if ( current_scene == 0 ) {
					outIntro();
				}
			}).on('swipeDown', function(){
				if ( current_scene == 1 ) {
					backIntro();
				}
			});

		$('.go-nav').on('click', function() {
			outIntro();
			return false;
		});

		$('.ts-link').on({
				click: function() {
					showSection($($(this).attr('href')));
					return false;
				},
				mouseenter: function() {
					var i = $(this).parent().index();
					$big_markers.eq(i).addClass('is-active');
				},
				mouseleave: function() {
					$big_markers.filter('.is-active').removeClass('is-active');
				}
		});

		$('.ts-close').on('click', function() {
			hideSection();
			showNav();
			return false;
		});




		IG.$win.on('resize', function() {
			if ((Modernizr.touchevents && getMedia() < 6) || getMedia() == 'legacy') return;

			clearTimeout(IG.resizeIdTerroir);
			IG.resizeIdTerroir = setTimeout(setH, 100);
		});



		function setup() {

			TweenMax.set($nav, {
				overflow: 'hidden',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				autoAlpha: 0
			});

			setH();
		}

		function setH() {
			var vh100 = window.innerHeight ? window.innerHeight : IG.$win.height();

			if ( !(Modernizr.csscalc && Modernizr.cssvhunit) || parseFloat(IG.android) < 4.4 ) {
				if ( isSupportMatchMedia ) {
					if ( window.matchMedia("(orientation: landscape)").matches && window.matchMedia("(max-width: 47.99em)").matches ) {
						vh100 = IG.$win.width();
					}
				}

				$('.ts-scene').height(vh100 - 50);

				if ( !Modernizr.backgroundsize && vh100 > 860 ) {
					$('.ts-scene').height(860);
				}
			}

			if ( getMedia() > 2 && !(Modernizr.csscalc && Modernizr.cssvhunit) ) {
				if ( Modernizr.backgroundsize ) {
					$('.slide').height(vh100 - 50);
				}
			}
		}

		function backIntro() {
			if ( is_moving ) return;

			TweenMax.killTweensOf($nav);
			TweenMax.killTweensOf($header);

			hideNav();

			TweenMax.to($header, 0.6,{
				position: 'relative',
				autoAlpha: 1,
				onComplete: function() {
					current_scene = 0;
					onMouseEvent();
				}
			});

			Modernizr.opacity && TweenMax.to($title, 0.6, {
				y: '0%'
			});

		}

		function outIntro() {
			if ( is_moving ) return;

			TweenMax.killTweensOf($nav);
			TweenMax.killTweensOf($header);

			TweenMax.fromTo($header, 0.6,
				{
					position: 'absolute',
					width: '100%',
					zIndex: 1
				},{
					autoAlpha: 0,
					onComplete: function() {
						TweenMax.to(IG.$body, 0.3, {
							scrollTop: 0
						});
						onMouseEvent();
						current_scene = 1;
					}
				});

			Modernizr.opacity && TweenMax.to($title, 0.6, {
				y: '100%'
			});

			showNav();
		}

		function showSection($target) {

			if ( current_scene < 2 ) {
				hideNav();
			}

			hideSection();
			$target.addClass('is-active');

			TweenMax.killTweensOf($target);
			TweenMax.fromTo($target, 0.4,
				{
					autoAlpha: 0.2
				}, {
					autoAlpha: 1
				});

			slider.slick('slickPlay');
			current_scene = 2;
		}

		function hideSection() {
			slider.slick('slickPause');
			$sections.removeClass('is-active');

			TweenMax.to(IG.$body, 0.3, {
				scrollTop: 0
			});

			TweenMax.set([$s1, $s2, $s3], {
				autoAlpha: 0
			});

			current_scene = 1;
		}

		function showNav() {
			TweenMax.set($nav, {
				position: 'relative',
				display: 'block',
				top: 0,
				zIndex: 1,
				autoAlpha: 0
			});
			TweenMax.to($nav, 0.6, {
				autoAlpha: 1
			});
		}

		function hideNav() {
			TweenMax.fromTo($nav, 0.6, {
				position: 'absolute',
				width: '100%',
				top: IG.navHeight
			}, {
				top: '-50px',
				zIndex: -1,
				autoAlpha: 0
			});
		}

	});

});
