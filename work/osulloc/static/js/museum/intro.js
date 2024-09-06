// @file museum/intro.js

require(['ui', 'slick', 'SmoothScroll'], function(ui, slick, SmoothScroll) {
	'use strict';

	$(function() {

		var $muse = $('.museum'),
			$museInview = $muse.find('.is-hidden'),
			$museSlider = $muse.find('.museum-slider'),
			$museCtgy = $muse.find('.primary-category a'),
			$museVideo = $museSlider.find('.video-link'),
			$museArrs = $('.slick-arrow'),
			tweenTime = 0.8;

		pageAct();
		setMuseSlider();

		function pageAct() {

			var $museHeader = $('.museum-header'),
				$museTitle = $museHeader.find('.museum-title'),
				$museTitleCell = $museTitle.find('.museum-title-cell'),
				$museTitleItem = $museTitleCell.find('span'),
				$museTitleBg = $museTitle.find('.museum-title-bg'),
				$museBlur = $museTitleBg.find('.museum-blur'),
				$museIntro = $museHeader.find('.museum-intro');

			startPage();

			IG.$win.on('scroll', function(){
				IG.$win.scrollTop() >= $museIntro.offset().top - 300 ? $museIntro.addClass('on') : $museIntro.removeClass('on');
			});

			function startPage() {
				$museHeader.addClass('is-active');

				TweenMax.fromTo($museBlur, tweenTime*2, {
					autoAlpha: 0
				},{
					autoAlpha: 1
				});

				TweenMax.delayedCall(tweenTime, function(){
					TweenMax.staggerFromTo($museTitleItem, tweenTime*2, {
						autoAlpha: 0
					},{
						autoAlpha: 1
					}, tweenTime/2);

				});
			}

			function resetPage() {
				$museHeader.removeClass('is-active');

				TweenMax.to($museBlur, tweenTime, {
					autoAlpha: 0
				});
			}

			$museInview.each(function(i, el){
				var is_inview = false;

				$(el).css('opacity', 0).one('inview', {offset: 0.95}, action);

				function action() {
					var delay;

					if ( is_inview ) return;

					delay = i*0.1;

					TweenMax.fromTo( el, 1.1, {
						top: '100%',
						opacity: 0
					},{
						top: '0%',
						opacity: 1,
						ease: Sine.easeOut,
						delay: delay
					});

					is_inview = true;
				}
			});
		}

		function setMuseSlider() {
			var slickOpt = {
				infinite: true,
				draggable: false,
				slidesToShow: 1,
				variableWidth: true,
				centerMode: true,
				prevArrow: $('.slick-prev'),
				nextArrow: $('.slick-next'),
				speed: 800,
				cssEase: 'cubic-bezier(0.77,0,0.175,1)',
				responsive: [{
					breakpoint:  768,
					settings: {
						dots: true,
						slidesToShow: 1,
						slidesToScroll: 1,
						variableWidth: false,
						centerMode: false,
						draggable: true
					}
				}]
			}

			$museSlider.slick(slickOpt);

			$museCtgy.on('click', function(event){
				var $item = $(this),
					itemIndex = $item.index()*2;

				event.preventDefault();

				$museCtgy.removeClass('is-current');
				$item.addClass('is-current');

				$museSlider.slick( 'slickGoTo', itemIndex );
			});

			$museSlider.on('beforeChange', function(slick, currentSlide, nextSlide){

				TweenMax.set( $museArrs, {autoAlpha: 0});

				TweenMax.delayedCall( tweenTime, function(){
					TweenMax.staggerTo( $museArrs, tweenTime/4, {
						autoAlpha: 1
					}, 0.2);
				});

			});

			$museSlider.on('afterChange', function(slick, currentSlide, nextSlide){
				var currentSlideIndex = Math.floor( $museSlider.slick('slickCurrentSlide')/2 );

				$museCtgy.removeClass('is-current');
				$museCtgy.eq( currentSlideIndex ).addClass('is-current');

				if ( !$('.video-player').length ) return;

				$museVideo.css('display', '');
				$museVideo.next('iframe').remove();
				$museVideo.unwrap();
			});

			$museCtgy.eq(0).click();

			$museVideo.on('click', function(event){
				event.preventDefault();

				$(this).ytiframe({autoplay: 1});
			});
		}
	});

});
