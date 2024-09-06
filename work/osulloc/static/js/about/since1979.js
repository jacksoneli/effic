// @file about/since1979.js

require(['ui', 'SmoothScroll', 'slick', 'skrollr'], function(ui, SmoothScroll, slick, skrollr) {
	'use strict';

	$(function() {
		TweenMax.to('main', 0.5, {
			autoAlpha: 1,
			clearProps: "all",
			onComplete: function() {
				$('main').removeClass('main--about');
			}
		});
		var $sinceScene = $('.s-slide'),
			$sinceContainer = $sinceScene.find('.since-slide-container'),
			$sinceSlide = $sinceScene.find('#since-slide'),
			$sincePkg = $sinceScene.find('.since-package'),
			$sincePkgItem = $sincePkg.find('.since-package-item'),
			$sinceSlideItem = $sinceSlide.find('.since-slide-item'),
			$sinceSlideCnct = $sinceSlideItem.find('.since-concept'),
			tweenNextEase = Sine.easeOut,
			tweenPrevEase = Sine.easeInOut,
			tweenTime = 0.8,
			tl;

		IG.useEditor  &&  Modernizr.mq('only all') ? dtAct() : mbAct();

		function dtAct() {
			skrollr.init({
				smoothScrolling: true,
				forceHeight: true
			});
			sinceSlider();
		}
		function mbAct() {
			var currentNum = $('.slick-current').data('slick-index');

			$sinceSlide.on({
				init: function(slick) {
					TweenMax.set( $sincePkgItem, {autoAlpha: 0 });
					TweenMax.set( $sincePkgItem.eq(0), {autoAlpha: 1 });
					TweenMax.fromTo( $sinceSlideCnct.eq(0), tweenTime*6, {
						z: 0,
						ease: tweenPrevEase
					}, {
						z: 100
					});
				},
				beforeChange: function(event, slick, currentSlide, nextSlide) {

					TweenMax.set( $sinceSlideCnct.eq(nextSlide), {autoAlpha: 1, z: 0});
					TweenMax.to( $sinceSlideCnct.eq(currentSlide), tweenTime, {
						autoAlpha: 0,
						ease: tweenPrevEase
					});

					if ( !Modernizr.mq('only all') ) {
						TweenMax.set( $sincePkgItem.eq(currentSlide), { autoAlpha: 0 });
					} else {
						TweenMax.to( $sincePkgItem.eq(currentSlide), tweenTime/2, {autoAlpha: 0 });
					}
				},
				afterChange: function(slick, currentSlide, nextSlide) {

					TweenMax.fromTo( $sinceSlideCnct.eq(nextSlide), tweenTime*6, {
						z: 0,
						ease: tweenPrevEase
					}, {
						z: 100
					});

					if ( !Modernizr.mq('only all') ) {
						TweenMax.set( $sincePkgItem.eq(nextSlide), { autoAlpha: 1 });
					} else {
						TweenMax.fromTo( $sincePkgItem.eq(nextSlide), tweenTime, {
							autoAlpha: 0
						}, {
							autoAlpha: 1
						});
					}
				}
			}).slick({
				autoplay: true,
				fade: true,
				arrows: false
			}).addClass('slick-mode');
		}

		// since1979 Slider
		function sinceSlider() {
			var sinceEndScroll = $sinceSlide.parents('.since').next().offset().top;

			TweenMax.set( $sincePkgItem, { autoAlpha: 0 });
			TweenMax.set( $sincePkgItem.eq(0), { autoAlpha: 1, className: '+=is-active' });

			$sinceContainer.on('DOMMouseScroll mousewheel', function(event) {
				preventEvent(event);
			});
			$sincePkg.on('DOMMouseScroll mousewheel', function(event) {
				preventEvent(event);
			});
			$sinceSlideItem.each(function(i, el){
				var $this = $(el),
					$prevItem= $this.prev($sinceSlideItem),
					$nextItem= $this.next($sinceSlideItem);

				$this.index() ? TweenMax.set($this, { y: '101%' }) : TweenMax.set($this, { y: '0%' });

				$this.on({
					'DOMMouseScroll  mousewheel': function(event) {

						var delatValue = event.originalEvent.wheelDelta/180 || (event.originalEvent.detail*-1)/180

						if( delatValue > 0 ) {
							$this.index() ? slidePrev() : slideStart();
						} else {
							$this.index() < $sinceSlideItem.length - 1 ?  slideNext() : slideEnd();
						}
					}
				});
				function slidePrev() {
					tl = new TweenMax.to($this, tweenTime, {
						x: '0',
						y: '101%',
						z: '0',
						className: '-=on',
						ease: tweenPrevEase
					});
					TweenMax.to($prevItem, tweenTime, {
						x: '0',
						y: '0%',
						z: '0',
						className: '+=on',
						ease: tweenPrevEase
					});
					TweenMax.to( $sincePkgItem.eq(i - 1), tweenTime, {
						autoAlpha: 1,
						className: '+=is-active'
					});
					TweenMax.to( $sincePkgItem.eq(i - 1).next(), tweenTime, {
						autoAlpha: 0,
						className: '-=is-active'
					});
					slideStart();
					if ( tl.isActive() ) preventScroll();
				}
				function slideNext() {
					tl = new TweenMax.to( $this, tweenTime, {
						x: '0',
						y: '-51%',
						z: '0',
						className: '-=on',
						ease: tweenNextEase
					});
					TweenMax.to($nextItem, tweenTime, {
						x: '0',
						y: '0%',
						z: '0',
						className: '+=on',
						ease: tweenNextEase
					});
					TweenMax.to( $sincePkgItem.eq(i + 1), tweenTime, {
						autoAlpha: 1,
						className: '+=is-active'
					});
					TweenMax.to( $sincePkgItem.eq(i + 1).prev(), tweenTime, {
						autoAlpha: 0,
						className: '-=is-active'
					});

					if ( tl.isActive() ) preventScroll();
				}
			});

			function preventScroll() {
				TweenMax.to( $sinceContainer, tweenTime, {
					className: '+=is-animate',
					onComplete: function() {
						$sinceContainer.removeClass('is-animate')
					}
				});
			}

			function preventEvent(event) {
				event.preventDefault();
				event.stopPropagation();
			}

			function slideStart() {
				TweenMax.delayedCall( tweenTime/4, function(){

					TweenMax.to( IG.$win, tweenTime/2, {
						scrollTo: 0
					});
				});
			}

			function slideEnd() {
				TweenMax.delayedCall( tweenTime/8, function(){

					TweenMax.to( IG.$win, tweenTime, {
						scrollTo: sinceEndScroll
					});
				});
			}
		}
	});
});
