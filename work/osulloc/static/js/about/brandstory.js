// @file about/brandstory.js

require(['ui', 'modal'], function(ui, Modal) {
	'use strict';

	var is_legacy = !Modernizr.csstransitions;

	IG.resizeBrandstory = {};

	if (is_legacy) {
		loadCss(require.toUrl('../css/brandstory-legacy.css'));
		require(['about/brandstory-legacy']);
		return;
	}

	loadCss(require.toUrl('../css/brandstory.css'));
	require(['about/brandstory-modules'], function(BS) {
		$(function(){

			var autoTimer = {},
					scrollTimer = {},
					is_autoplaying = false;

			init();

			function init() {
				IG.DEV && console.log('[brandstory init]');

				BS.setup();
				BS.hideFooter('set');

				setForLowerAndroid();

				TweenMax.to('main', 1.6, {
					autoAlpha: 1,
					clearProps: 'all',
					delay: 0.6,
					onComplete: function() {
						$('main').removeClass('main--about');
						BS.getPos();
						run();
						attachEvents();
					},
					ease: Sine.easeInOut
				});

				IG.$win.on('resize.updatePos', function() {
					if ((Modernizr.touchevents && getMedia() < 6) || getMedia() == 'legacy') return;

					clearTimeout(IG.resizeBrandstory);
					IG.resizeBrandstory = setTimeout(restart, 100);
				});


				$('a.link').click(function(event) {
					_stopScroll();

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

					event.preventDefault();
					event.stopPropagation();
				});

				IG.$body.on('click', '[rel="modal:close"]', run);
			}

			function setForLowerAndroid() {
				if ( parseInt(IG.android) < 5 ) {
					$('.bs-heading').css('display', 'block').width('100%').height(IG.windowHeight * 0.8);
					$('.bs-intro').css('display', 'block').width('100%').height(IG.windowHeight - 50);

					$('#bg-wrap').height(IG.windowHeight - 50).width('100%');
				}
			}

			function run() {
				_stopScroll();

				IG.DEV && console.log('[auto scroll] start', 'articleH:', BS.height());
				_setScroll();
			}



			function _setScroll(previousOffset) {

				var saveOffset = BS.top(),
						r = IG.windowHeight / IG.windowWidth,
						move = ( r > 1 ) ? parseInt(BS.height()/400) / 2 : parseInt(BS.height()/640);

				is_autoplaying = true;

				if  ( BS.top() < IG.windowHeight*1 ) {
					move = move * 2;
				}

				BS.moveDown(move);

				scrollTimer = window.setTimeout(function(){
					_setScroll(saveOffset);
				}, 1000/30);

				if ( BS.top() >= BS.height() - IG.windowHeight/2 ) {
					_stopScroll();
				}
			}

			function _stopScroll() {
				IG.DEV && console.log('[auto scroll] stop', BS.top());

				scrollTimer = window.clearTimeout(scrollTimer);
				is_autoplaying = false;
			}


			function restart() {
				clearAutoTimer();

				BS.moveTo(0);

				TweenMax.to($('#bs-frame'), 0.5, {
					autoAlpha: 0,
					onComplete: function() {
						TweenMax.to($('#bs-frame'), 1, {
							autoAlpha: 1
						});

						BS.setup();
						BS.getPos();
						BS.hideFooter();

						run();
					}
				});
			}

			function attachEvents() {
				IG.DEV && console.log('[brandstory] event on');

				var $this = $('#main');

				$this.on('touchstart', function(event){

					var touches = event.originalEvent.touches;

					if (is_autoplaying) {
						_stopScroll();
					}

					if (touches && touches.length) {
					  IG.startX = touches[0].pageX;
					  IG.startY = touches[0].pageY;

					  IG.currentX = IG.startX;
					  IG.currentY = IG.startY;

					  IG.deltaX = 0;
					  IG.deltaY = 0;

					  $this.bind('touchmove', touchmove);

						IG.DEV && console.log('[touchstart] x:', IG.startX, ', y:', IG.startY);
					}

					IG.startT = Date.now();
				});

				function touchmove(event) {
				  var touches = event.originalEvent.touches;

				  if (is_autoplaying) {
				  	_stopScroll();
				  }

				  if (touches && touches.length) {
				    IG.deltaX = IG.startX - touches[0].pageX;
				    IG.deltaY = IG.startY - touches[0].pageY;

				    IG.movedY = IG.currentY - touches[0].pageY;
				    IG.currentY = touches[0].pageY;

				    BS.moving(-1 * BS.top() - IG.movedY);
				  }

				  event.preventDefault();
				}

				$this.on('touchend', function(event){
					var dt = Date.now() - IG.startT;

					clearAutoTimer();

					if ( dt < 500 ) {
					  if (IG.deltaY >= 50 ) {
					    $this.trigger("swipeUp");
					  }
					  if (IG.deltaY <= -50) {
					    $this.trigger("swipeDown");
					  }
					}

					$this.off('touchmove');
				});

				$this
					.bind("swipeDown", function(){
						BS.moveUp(Math.abs(IG.deltaY));
					}).bind("swipeUp", function(){
						BS.moveDown(IG.deltaY);
						setAutoTimer();
					});

				// mouse event
				IG.$body.on({
					'DOMMouseScroll mousewheel': function(event) {
						// preventEvent(event);
						BS.deltaValue = event.originalEvent.wheelDelta/180 || (event.originalEvent.detail*-1)/180;

						if( BS.deltaValue > 0 ) {
							BS.moveUp(100);
							_stopScroll();

						} else {
							BS.moveDown(100);
							_stopScroll();

							if (is_autoplaying) {
								setAutoTimer();
							}
						}
					}
				});

				// keyboard event
				IG.$body.on('keydown', function(event){
					switch (event.keyCode) {
						// left or up
						case 37:
						case 38:
							BS.moveUp(50);
							_stopScroll();
							break;

						// right or down
						case 39:
						case 40:
							BS.moveDown(50);

							if (is_autoplaying) {
								_stopScroll();
								setAutoTimer();
							}
							break;
					}
				});

				IG.$body.on('click.goto', '.bs-nav-a', function(event) {
					is_autoplaying && clearAutoTimer();
					BS.gotoSection($(this).attr('href'));
					setAutoTimer();

					event.preventDefault();
				});

				IG.$body.on('click.toggleAuto', '.bs-body', function(event) {
					if (is_autoplaying) {
						_stopScroll();
					} else {
						run();
					}

					event.stopPropagation();
				});
			}

			function setAutoTimer() {
				if ( is_autoplaying ) return;
				clearAutoTimer();
				autoTimer = window.setTimeout(_setScroll, 3000);
			}

			function clearAutoTimer() {
				autoTimer = window.clearTimeout(autoTimer);
				is_autoplaying = false;
				_stopScroll();
			}

		});
	});

});
