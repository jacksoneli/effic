/**
 * @file: util.js
 * @author alice@iropke.com
 * @since 2016.02.11
 */
'use strict';

// make it safe to use console.log always
(function(a){function b() {}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function() {try{console.log();return window.console;}catch(a){return (window.console={});}}());

// set global object @iropke
var IG = window.IG || {},
		isSupportMatchMedia = window.matchMedia !== undefined;

IG.DEV = IG.DEV || false;





/**
 * get specific number from element style
 */
function getMedia() {
	var m = ( !window.getComputedStyle ) ? 'legacy' : m = parseFloat(window.getComputedStyle(document.getElementById('match-media'),':before').content.replace(/['"]/g,''));
	return m;
}




/**
 * loadCss
 * http://requirejs.org/docs/faq-advanced.html#css
 */
function loadCss(url) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
}





/**
 * init google map
 */
function initMap(id, lat, lng, imgUrl, zoom) {
	var id = ( id ) ? id : 'map-canvas000',
		lat = ( lat ) ? lat : 0,
		lng = ( lng ) ? lng : 0,
		zoom = ( zoom ) ? zoom : 16;

	// Create an array of styles.
	var styles = [{
			stylers: [
				{ hue: '#000000' },
				{ saturation: -100 }
			]
		},{
			featureType: "road",
			elementType: "geometry",
			stylers: [
				{ saturation: 0 },
		    	{ visibility: "simplified" }
			]
		},{
			featureType: "road",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]
		}
	];

	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

	// Create a map object, and include the MapTypeId to add
	// to the map type control.
	var myLatLng = new google.maps.LatLng(lat, lng);
	var mapOptions = {
			zoom: zoom,
			center: myLatLng,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
			}
		};
	var map = new google.maps.Map(document.getElementById(id), mapOptions);
	var image = imgUrl;

	var beachMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: image
	});

	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
}




/**
 * get css background-image url from element
 * dependencies: jQuery
 */
function getBgUrl($el) {
	var bg_url,
			bg_img = $el.css('background-image');

  // ^ Either "none" or url("...urlhere..")
  bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg_img);
  bg_url = bg_url ? bg_url[2] : ""; // If matched, retrieve url, otherwise ""

  return bg_url;
}





/**
 * change image with breakpoints
 * dependencies: jQuery, switchLayout(), getBgUrl($el)
 */
function responsiveImg() {

	if ( !$('[data-src]').length ) return;

	IG.DEV && console.log( '[responsiveImg]' );

	$('[data-src]').each(function(i, el) {
		var $el = $(el),
				src, src_s;

		src = $el.data('src');
		src_s = ( $el.is('img') ) ? $el.attr('src') : getBgUrl($el);


		$el.data({
			'src': src,
			'src-m': src_s,
			'src-loaded': true
		});
		$el.attr('data-rwd', true);
	});

	function changeImg(src) {
		var src = src || 'src';

		$('img[data-rwd]').attr('src', function(){
			return $(this).data(src);
		});

		$('div[data-rwd]').each(function(i, el){
			var $el = $(el);
			$el.css('background-image', 'url(' + $el.data(src) + ')');
		});
	}

	if ( !window.getComputedStyle ) {
		// legacy browser
		changeImg('src');

	} else {
		switchLayout('rwdImg', function() {
			// medium: 						768px (= 5)
			// small:  						680px (= 4)
			// tablet: 						600px (= 3)
			// mobileLandscape:		480px (= 2)
			// x-small: 					400px (= 1)
			IG.DEV && console.log( 'getMedia: ', getMedia() );
	    return (getMedia() > 2) ? !0 : !1;

		}, function(state) {
			var src = ( state ) ? 'src' : 'src-m';
			changeImg(src);
		});
	}

	TweenMax.to('[data-src]', 0.5, {
		delay: 0.1,
		autoAlpha: 1,
		onComplete: function(){
			$('[data-src]').removeAttr('data-src');
			IG.$body.removeClass('loading');
		}
	});

}





/**
 * fixed header, 'Go top' button
 * @author: alice@iropke.com
 */
function fixedItems() {

	if ( !!IG._scrollDirection ) {
		if ( IG._scrollTop > IG.navHeight ) {
			if ( IG._scrollDirection == 'up' && IG._scrollTop < IG.windowHeight ) {
				IG.$header.removeClass('is-sticked');
			} else {
				IG.$header.addClass('is-sticked');
			}

		} else {
			IG.$header.removeClass('is-sticked');
		}

		if ( IG._scrollTop > IG.windowHeight/3 ) {
			IG.$go_top.addClass('is-active');
		} else {
			IG.$go_top.removeClass('is-active');
		}
	}
}





// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());





/**
 * Platform Detection
 */
(function platformDetect() {
	var ua 				= navigator.userAgent,
		uaText			= navigator.userAgent.toLowerCase(),
		platformText  	= navigator.platform.toLowerCase();

	IG.useEditor  = (uaText.indexOf("mobile") > -1 || uaText.indexOf("android") > -1) ? false : true;

	IG.isiPhone       = uaText.indexOf("iphone");
	IG.isiPad		      = uaText.indexOf("ipad");
	IG.isiPod         = platformText.indexOf("ipod");
	IG.isAndroidPhone = platformText.indexOf("android");
	// IG.isSafari       = uaText.indexOf('safari') != -1 && uaText.indexOf('chrome') == -1;
	IG.isIE           = typeof (is_ie) !== "undefined" || (!(window.ActiveXObject) && "ActiveXObject" in window);
	IG.ieMobile       = ua.match(/Windows Phone/i) ? true : false;
	// IG.iOS            = getIOSVersion();
	IG.android        = getAndroidVersion();

	function getAndroidVersion(ua) {
		var matches;
		ua = ua || navigator.userAgent;
		matches = ua.match(/[A|a]ndroid\s([0-9\.]*)/);
		return matches ? matches[1] : false;
	}
})();




/**
 * Detecting CSS Style Support
 * http://ryanmorr.com/detecting-css-style-support/
 */
(function(win){
	'use strict';

	var el = win.document.createElement('div'),
	camelRe = /-([a-z]|[0-9])/ig,
	support,
	camel;

	win.isStyleSupported = function(prop, value){
		// If no value is supplied, use "inherit"
		value = arguments.length === 2 ? value : 'inherit';
		// Try the native standard method first
		if('CSS' in win && 'supports' in win.CSS){
			return win.CSS.supports(prop, value);
		}
		// Check Opera's native method
		if('supportsCSS' in win){
			return win.supportsCSS(prop, value);
		}
		// Convert to camel-case for DOM interactions
		camel = prop.replace(camelRe, function(all, letter){
			return (letter + '').toUpperCase();
		});
		// Check if the property is supported
		support = (camel in el.style);
		// Assign the property and value to invoke
		// the CSS interpreter
		el.style.cssText = prop + ':' + value;
		// Ensure both the property and value are
		// supported and return
		return support && (el.style[camel] !== '');
	};

})(this);





/**
 * window resizing 시 특정 조건에 의해 함수 실행
 * @author: Peter Choi, peter@iropke.com
 * @param {String} namespace resize 이벤트 namespace
 * @param {Function} cond 조건을 판별할 함수
 * @param {Function} callback resizing 중 조건이 변경되었을 때, 실행할 함수
 */
function switchLayout(namespace, cond, callback) {
	var state = cond(); // 현재 결과

	// resizing 중 조건 판단
	function chkBreakpoint() {
		var result = cond();

		if(result !== state) {
			state = !state;

			IG.DEV && console.log('[GLOBAL] layout switched.', namespace, state);
			callback(state);
		}
	}

	$(window).on('resize' + (namespace ? '.' + namespace : ''), function() {
		chkBreakpoint.call(undefined, state);
	});

	// 최초 실행
	callback(state);
}





/**
 * notification popup
 */
function popupNotification(options) {
	var defaults = {
				id: 'notification-popup',
				type: 'noti',     //  noti, error
				msg: '완료되었습니다.',
				onClose: function() {},
				// position: 'top', // top, bottom
				timer: 5000     // display time
			},
			o = {},
			$popup,
			$content,
			popupSize = {};

	$.extend(o, defaults, options);

	$popup = $('<div class="notification-popup is-hide" tabindex="0" />');
	$content = $('<div class="l-wrap"><section class="notification-inner"><div class="notification"><h1 class="h">Notification</h1><p class="p break-word">'+o.msg+'</p> </div> <button type="button" class="btn-close"><i class="icon-close"></i><span class="blind">닫기</span></button></section></div>');

	// popup settings
	$popup.appendTo('body').attr('id', o.id);
	$content.appendTo($popup);

	o.type == 'error' && $popup.addClass('type-error');

	popupSize.height = parseInt($popup.height());

	// show popup
	$popup.css('visibility', 'visible').focus();

	TweenMax.fromTo($popup, 0.5, {
		autoAlpha: 0,
		top: -1*popupSize.height
	}, {
		autoAlpha: 1,
		top: 0,
		ease: Power2.easeOut
	});

	// close event / click or timeout
	$popup.on('click', close);

	if ( o.timer ) {
		setTimeout(close, o.timer);
	}

	function close() {
		TweenMax.to($popup, 0.4, {
			autoAlpha: 0,
			top: -1*popupSize.height,
			ease: Power2.easeIn,
			onComplete: function() {
				$popup.remove();
				o.onClose();
			}
		});
	}
}

/* add toastr style call. used in view.Toastr */
if (! window.toastr) {
    window.toastr = {};
}
window.toastr.success = function(msg) {
    popupNotification({ msg: msg });
}
window.toastr.error = function(msg) {
    popupNotification({ msg: msg, type: 'error' });
}
window.toastr.info = function(msg) {
    popupNotification({ msg: msg });
}

/* format number with commas */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toInt(str) {
    var nr;
    if ("" == str) {
        return 0;
    }
    nr = parseInt(str);
    if (isNaN(nr)) {
        return 0;
    }
    return nr;
}




/**
 * custom dropdown (.selectbox)
 * @author: Alice Kim, alice@iropke.com
 * @last update: 2015.07.39
 */
function selectbox() {
	var $select = $('div.selectbox'),
			$options = $select.find('.selectbox-option'),
			$body = $(document),
			arrKey = [38, 40];

	$select.each(function() {
		var $box = $(this),
			$selector = $box.find('.selector'),
			$selected = $box.find('.selector-text'),
			$list = $box.find('.selectbox-option'),
			$items,
			selected = '',
			islink = ( $list.find('a').length > 0 ) ? true : false,
			len = $list.find('li').length;

		function init() {
			var top = 0;

			// setting
			$box.data('is-open', false);
			$selector.attr('tabindex', 0);

			setAttr();
			setStyle();

			// events
			if ( islink ) {
				$list.on('click', 'a', function(event) {
					select(this);
				});

				$list.on('keydown', 'a', function(event){
					var i = $(this).data('index');

					switch (event.keyCode) {
						// tab or esc
						case 9:
						case 27:
							afterSelect();
							prevent(event);
							break;

						// left or up
						case 37:
						case 38:
							$(this).parent().prev().length && $items.eq(i - 1).focus();
							break;

						// right or down
						case 39:
						case 40:
							$(this).parent().next().length && $items.eq(i + 1).focus();
							break;
					}
				});

				$list.on('focus', 'a', function(event) {
					$(this).parent().addClass('is-active');
				});

				$list.on('blur', 'a', function(event) {
					$(this).parent().removeClass('is-active');
				});
			} else {
				$list.on('click', 'li', function(event) {
					if ( $(this).hasClass('is-disabled') ) {
						$(this).blur();
					} else {
						select(this);
					}
					// event.stopPropagation();
				});
				$list.on('keydown', 'li', function(event){
					var $el = $(this),
							i = $el.data('index');

					switch (event.keyCode) {
						// enter
						case 13:
							!$el.hasClass('is-disabled') && $(this).trigger('click');
							prevent(event);
							break;

						// tab or esc
						case 9:
						case 27:
							afterSelect();
							prevent(event);
							break;

						// left or up
						case 37:
						case 38:
							$el.prev().length && $items.eq(i - 1).focus();
							break;

						// right or down
						case 39:
						case 40:
							$el.next().length && $items.eq(i + 1).focus();
							break;
					}
				});

				$list.on('focus', 'li', function(event) {
					$(this).addClass('is-active');
				});

				$list.on('blur', 'li', function(event) {
					$(this).removeClass('is-active');
				});
			}

			$selector.on('click keydown', function(event) {
				if (event.type == 'click' || event.keyCode == 13) {
					if ( $box.data('is-open') ) {
						close();
					} else {
						open();
						if ( event.keyCode == 13 ) {
							$items.eq(0).focus();
						}
					}
					event.preventDefault();
				}
			});

			// cancel event bubble on selectbox
			$box.on('click', function(event){
				event.stopPropagation();
			});

			// 선택된 아이템 처리
			if ($list.has('.is-current').length || $list.find(':checked').length) {
				if (islink) {
					$list.find('.is-current').addClass('is-active');
					$selected.text($list.find('.is-current').text());
				} else {
					top = $(window).scrollTop();
					$list.find(':checked').parent().click();
					$list.find('.is-current').click();
					$('html, body').scrollTop(top);
					$selector.blur();
				}
			}
		}

		function select(obj) {
			var $el = $(obj),
					has_el = ( $el.find('.select-item').length ) ? true : false;

			if ( has_el ) {
				selected = $el.find('.select-item').html();
				$selector.find('>span').html( selected );
			} else {
				selected = $el.text();
				$selector.find('>span').text( selected );
			}

			if ( !islink ) {
				$list.find('input').prop('checked', false);
				$items.removeClass('is-current');

				$el.find('input').prop('checked', true).trigger('change');
				$el.addClass('is-current');
			}
			afterSelect();
		}

		function setAttr() {
			$items = ( islink ) ? $list.find('a') : $list.find('li');
			len = $items.length;

			$items.each(function(i, el) {
				$(el).data('index', i);
			});

			if ( !islink ) {
				$items.attr('tabindex', 0).find('input[type=radio]').attr('tabindex', '-1').each(function(idx, el) {
					var $el = $(el), $label, id;

					if ( $el.attr('id') && $el.attr('id') !== '' ) return;

					id = $el.attr('name') + (idx + 1);
					$el.attr('id', id);

					$label = $el.parent('label') || $el.siblings('label');
					$label.length && $label.attr('for', id);
				});
			}
		}

		function setStyle() {
			var $testItem, itemWidth, selectorWidth, selectorW;

			$testItem = ( islink ) ? $list.find('a') : $list.find('label');

			if ( !$select.hasClass('input--wide') ) {
				itemWidth = $testItem.width() + 0;
				selectorWidth = $selector.width() + 0;
				selectorW = (selectorWidth < itemWidth) ? itemWidth : selectorWidth;
				$selector.width(selectorW);
			}

			setTimeout(function(){
				$options.width('100%');
				$list.css('visibility', 'visible').hide();
			}, 200);
		}

		function open() {
			if ( $box.data('is-open') || isDisabled($box) ) return;

			// li refresh 대비
			setAttr();

			allClose();
			$box.addClass('is-active').css('zIndex',100).data('is-open', true);
			$list.show();
			blockArrow();
		}

		function close() {
			$list.hide();
			$body.off('keydown.blockArrow');
			$box.removeClass('is-active').css('zIndex',0).data('is-open', false);
		}

		function afterSelect() {
			close();
			$selector.focus();
		}

		init();
	});

	$body.on('click', allClose);

	function allClose() {
		$body.off('keydown.blockArrow');
		$select.removeClass('is-active').css('zIndex', 'auto').data('is-open', false);
		$options.hide();
	}

	function prevent(event) {
		if( event.preventDefault ) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.returnValue = false;
		}
	}

	function blockArrow() {
		$body.on('keydown.blockArrow', 'li', function(event) {
			var key = event.which;

			if( $.inArray(key, arrKey) > -1 ) {
				event.preventDefault();
				return false;
			}
		});
	}

	function isDisabled($box) {
		if ( $box.hasClass('is-disabled') && $box.data('disabled-msg') ) {
			if ( window.popupNotification ) {
				popupNotification({
					msg: $box.data('disabled-msg'),
					timer: 3000
				});
			} else {
				alert($box.data('disabled-msg'));
			}
		}
		return $box.hasClass('is-disabled');
	}
}





/**
 * select ui for mobile
 * dependencies: $.fn.simpleTab
 */
function SwitchSelect($el) {
	this.$select = $el;
	this.init();
}
SwitchSelect.prototype = {
 	close: function($el, txt) {
 		this.$select.removeClass('on');
 		IG.$main.removeClass('is-dimmed');

 		if ( !$el ) return;

 		if (!!$el.data('is-tab')) {
 			this.curTxt($el, txt);
 		}
 	},
 	init: function() {
 		var _el = this;

 		_el.$select.each(function(i, el){
 			var $el = $(el),
 				$trigger = $el.find('.select-trigger'),
 				$selector = $el.find('.select-selector'),
 				stateSwitch	= $trigger.is(':visible');

 			$el.data('is-tab', $el.find('[href^=#]').length);

 			_el.curTxt($el);

 			$trigger.on('click', function(event){
 				$el.toggleClass('on');
 				_el.$select.not($el).removeClass('on');
 				$('.guide-contents').length && IG.$main.toggleClass('is-dimmed');

 				event.stopPropagation();
 			});

 			$el.on('click', 'a', function(){
 				_el.close($el, $(this).text());
 			});
 		});

 		_el.$select.length && IG.$win.on('resize.switchSelect', function() {
 			_el.close();
 		});
 		_el.$select.length && IG.$body.on('click.switchSelect', function() {
 			_el.close();
 		});
 	},
 	curTxt: function($el, txt) {
 		var txt;

 		if ( !!txt ) {
 			txt = txt;
 		} else {
 			if ( !!$el.find('.is-current').length ) {
 				txt = $el.find('.is-current').text();

 			} else {

 				if ( !!window.location.hash && $el.data('is-tab') ) {
 					txt = $el.find('a[href='+window.location.hash+']').text();
 				} else {

 					txt = $el.find('.select-selector').find('a').eq(0).text();
 				}
 			}
 		}

 		IG.DEV && console.log('curTxt', txt);
 		$el.find('.select-trigger').find('span').text(txt);
 	}
}

function switchSelbox() {
	var $switchSelbox = $('.switch-select');

	if ( !$switchSelbox.length ) return;
	IG.switchSel = new SwitchSelect($switchSelbox);
}





/*! jquery.placeholder.js | https://github.com/diy/jquery-placeholder | Apache License (v2) */
(function(f){var j="placeholder"in document.createElement("input"),h="-moz-box-sizing -webkit-box-sizing box-sizing padding-top padding-right padding-bottom padding-left margin-top margin-right margin-bottom margin-left border-top-width border-right-width border-bottom-width border-left-width line-height font-size font-family width height top left right bottom".split(" ");f.fn.placeholder=function(g){var k=this;g=g||{};if(j&&!g.force)return this;window.setTimeout(function(){k.each(function(){var e=
this.tagName.toLowerCase();if("input"===e||"textarea"===e)a:{var b,d,a=f(this),c;try{b=a[0].getAttributeNode("placeholder");if(!b)break a;d=a[0].getAttribute("placeholder");if(!d||!d.length)break a;a[0].setAttribute("placeholder","");a.data("placeholder",d)}catch(g){break a}e={};for(b=0;b<h.length;b++)e[h[b]]=a.css(h[b]);b=parseInt(a.css("z-index"),10);if(isNaN(b)||!b)b=1;c=f("<span>").addClass("placeholder").html(d);c.css(e);c.css({cursor:a.css("cursor")||"text",display:"block",position:"absolute",
overflow:"hidden","z-index":b+1,background:"none","border-top-style":"solid","border-right-style":"solid","border-bottom-style":"solid","border-left-style":"solid","border-top-color":"transparent","border-right-color":"transparent","border-bottom-color":"transparent","border-left-color":"transparent"});c.insertBefore(a);e=a.offset().top-c.offset().top;d=parseInt(c.css("margin-top"));isNaN(d)&&(d=0);c.css("margin-top",d+e);c.on("mousedown",function(){a.is(":enabled")&&window.setTimeout(function(){a.trigger("focus")},
0)});a.on("focus.placeholder",function(){c.hide()});a.on("blur.placeholder",function(){c.toggle(!f.trim(a.val()).length)});a[0].onpropertychange=function(){"value"===event.propertyName&&a.trigger("focus.placeholder")};a.trigger("blur.placeholder")}})},0);return this}})(jQuery);





/*
 * accordion list jQuery plugin
 * @author: alice@iropke.com
 */
(function($) {

	var defaults = {
		easing:         'easeOutQuint',
		speed:          400,
		activeClass:  	'on',
		titleSelector:  '.q',
		contSelector:   '.a',
		collapsible:    false,
		callback:       function() {},
		onOpen:       	function($item) {}
	};

	$.fn.accordion = function(opt) {

		if (this.length == 0) return this;

		if (this.length > 1) {
			this.each(function(){ $(this).accordion(opt); });
			return this;
		}

		var fold = {};
		var el = this;

		var init = function() {
			fold.o = $.extend({}, defaults, opt);
			fold.$el = $(el);
			fold.$q = el.find(fold.o.titleSelector);
			fold.$a = el.find(fold.o.contSelector);
			fold.$items = fold.$q.parent();
			fold.$cur = fold.$el.filter('.'+ fold.o.activeClass);

			fold.$q.css('cursor', 'pointer').attr('tabindex', 0);
			fold.$q.on('click.open keypress.open', function(event) {
				if ( event.type == 'click' || event.which == 13 ) {
					open($(this).parent());
				}
			});

			fold.$cur.length && open(fold.$cur.eq(0));
			fold.$items.not('.'+fold.o.activeClass).find(fold.o.contSelector).hide();
		}

		var open = function($target) {
			var is_on = $target.hasClass(fold.o.activeClass);

			fold.$items.removeClass(fold.o.activeClass);
			fold.$a.stop(true, true).slideUp({
				duration: fold.o.speed,
				easing: fold.o.easing,
				complete: function() {
					fold.o.callback();
					fold.$a.css('zoom', 1);
				}
			});

			if (is_on) return;

			$target.addClass(fold.o.activeClass).find(fold.o.contSelector).stop(true, true).slideDown({
				duration: fold.o.speed,
				easing: fold.o.easing,
				complete: function() {
					fold.o.callback();
					fold.o.onOpen($target);
				}
			});
		}

		init();

		el.destroy = function() {
			fold.$items.removeClass(fold.o.activeClass);
			fold.$q.removeAttr('style tabindex');
			fold.$a.removeAttr('style');
			fold.$q.off('click.open keypress.open');
		}

		return this;
	}
})(jQuery);





/**
 * initTabMenu jQuery ver. ( target focusing )
 * @author: alice@iropke.com
 * @lastUpdate: 2015.12.14
 */
(function($) {
	$.fn.simpleTab = function(option) {

		var option = $.extend({
			activeClass: 'is-active',
			tabSelector: '.tab',
			tabTitle: '.tab-title',
			tabCont: '.tab-content',
			changeByClass: false,
			rwd: false,
			scroll: false,
			scrollOffset: -100,
			easing: 'swing',
			defaultTab: 0,
			onChange: function() {}
		}, option);

		var $win = $(window);

		return this.each(function() {
			var $container = $(this),
					$tab = $container.find(option.tabSelector),
					$tabContents = $([]),
					len = $tab.length,
					active = option.activeClass,
					isChangeByClass = option.changeByClass,
					current = 0;

			$tab.each(function(i, el){
				var $a = $(el),
						$target = $($a.attr('href'));

				$tabContents = $tabContents.add($target);

				if ( !isChangeByClass ) {
					$target.css({
							display: 'none',
							outline: '0 none'
						}).attr({
							tabindex: '0'
						});
				}

				$a.data('tab-order', i);

				$a.on('click', function(event){
					openContent($a, $target);

					if ( !!history.pushState ) {
						history.pushState(null, null, $a.attr('href'));
					}
					event.preventDefault();
				});

				if ( option.rwd ) {
					$target.find(option.tabTitle).on('click', function(event){
						if ( !$target.hasClass(active) ) {
							openContent($a, $target);
						} else {
							$target.removeClass(active);
						}
					});
				}
			});

			$(window).on('hashchange', function(){
				if ( !window.location.hash ) return;

				var hash = window.location.hash,
						$a = $(option.tabSelector + '[href=' + hash + ']');

				if ( $container.find(option.tabSelector + '[href=' + hash + ']').length > 0 ) {
					openContent($a, $(hash));
				}
			});

			function openContent($a, $target) {
				var top;

				if ( !isChangeByClass ) {
					$tabContents.hide();
				}
				$tab.removeClass(active);
				$tab.parent().removeClass(active);
				$tabContents.removeClass(active);

				$a.addClass(active);
				$a.parent().addClass(active);
				$target.addClass(active);

				if ( !isChangeByClass ) {
					$target.show();
					$target.focus();
				}

				if ( option.scroll ) {
					top = $container.offset().top + option.scrollOffset;
					$('html, body').stop().animate({ scrollTop: top }, 700, option.easing);
				} else {
					$win.scrollTop(top);
				}

				option.onChange();
			}

			function getCurrent() {
				var hash = location.hash;

				if ( !!option.defaultTab ) {
					current = option.defaultTab;

				} else if ( window.location.hash != '' ) {
					$tabContents.each(function(i, el){
						if ( '#' + $(this).attr('id') == hash ) {
							current = i;
						}
					});

				} else if ( $tab.filter('.' + active).length > 0 ) {
					current = $tab.filter('.' + active).data('tab-order');

				} else if ( $tab.parent().filter('.' + active).length > 0 ) {
					current = $tab.parent().filter('.' + active).find(option.tabSelector).data('tab-order');
				}

				IG.DEV && console.log('[current tab index] ' + current);
			}

			getCurrent();

			if ( !isChangeByClass ) {
				$tabContents.hide();
				$($tab.eq(current).attr('href')).show();
			}

			$tab.eq(current).addClass(active);
			$tab.eq(current).parent().addClass(active);
			$($tab.eq(current).attr('href')).addClass(active);
		});
	}
})(jQuery);





/*
 * jQuery Extended Offset
 *
 * Copyright (c) 2011, Ricki Runge (http://www.ricki.dk)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
jQuery.fn.extPosition = function() {
  var $this = $(this);
  var position = $this.position();
  position.right = position.left + $this.width();
  position.bottom = position.top + $this.height();
  return position;
};

jQuery.fn.extOffset = function() {
  var $this = $(this);
  var position = $this.offset();
  position.right = position.left + $this.width();
  position.bottom = position.top + $this.height();
  return position;
};

jQuery.fn.expPosFrom = function($el) {
  $el = $el || this.parent();
  var position = {
    top: this.offset().top - $el.offset().top,
    left: this.offset().left - $el.offset().left
  };
  return position;
};





/**
 * top visual image roll up
 * @author: alice@iropke.com
 */
(function($) {
	$.fn.rollUp = function(options) {

		var el = this;

		if(el.length == 0) return el;

		if(el.length > 1) {	// support mutltiple elements
			el.each(function() {$(el).rollUp(options)});
			return el;
		}

		if ( $(el).css('position') !== 'fixed' ) return;

		var fixTop = parseInt(el.css('top'));

		$(window).on('scroll', function() {
			var top;
			var currentTop = $(window).scrollTop();

			top = fixTop + (-1 * currentTop / 3.2);
			el.css('top', top);

		});
	}
})(jQuery);





/**
 * toggle layer
 * @author: alice@iropke.com
 */
(function($) {

	var $win = $(window);

	var defaults = {
		autoFocus: true,
		toggleByClass: false,
		activeClass: 'is-active',
		closeBtnClass: 'close-layer',
		onOpen: function($link, $target) {},
		onClose: function($link, $target) {}
	};

	$.fn.toggleLayer = function(options) {

		if(this.length == 0) return this;

		// support mutltiple elements
		if(this.length > 1){
			this.each(function() {$(this).toggleLayer(options)});
			return this;
		}

		// create a namespace to be used throughout the plugin
		var toggle = {},
				el = this;

		var init = function() {
			toggle.o = $.extend({}, defaults, options);
			toggle.targetId = el.attr('href');
			toggle.$target = $(toggle.targetId);
			toggle.$close = toggle.$target.find('.'+toggle.o.closeBtnClass);
			toggle.pos = el.offset();

			el.data('target', { isopen: false });

			if ( toggle.$target.is(':visible') ) {
				close();
			}

			el.on('click', function(event) {
				if ( el.data('target').isopen ) {
					close();
				} else {
					open();
				}
				event.stopPropagation();
				event.preventDefault();
			});

			toggle.$close.on('click', function(event) {
				close();
				el.focus();
				event.stopPropagation();
				event.preventDefault();
			});

			toggle.$target.on('click', function(event) {
				event.stopPropagation();
			});

			$('body').on('click.closeTarget', close);

			$win.on('resize', function() {
				!Modernizr.touch && toggle.$target.is(':visible') && close();
			});

			setup();
		}

		var setup = function() {
			toggle.$target.css({
				outline: '0 none'
			}).attr({
				tabindex: '0'
			});
		}

		var close = function() {
			toggle.o.onClose(el, toggle.$target);
			toggle.o.toggleByClass || toggle.$target.hide();
			toggle.o.activeClass && toggle.$target.removeClass(toggle.o.activeClass);

			el.removeClass('toggle-on');
			el.data('target').isopen = false;
		}

		var open = function() {
			var $focus = toggle.$target;

			toggle.o.onOpen(el, toggle.$target);
			toggle.o.toggleByClass  || toggle.$target.show();
			toggle.o.activeClass    && toggle.$target.addClass(toggle.o.activeClass);

			if (toggle.$target.find('input').length && toggle.o.autoFocus) {
				$focus = toggle.$target.find('input').eq(0);
			}

			$focus.focus();
			el.addClass('toggle-on');
			el.data('target').isopen = true;
		}

		el.openTarget = open;
		el.closeTarget = close;

		init();

		return this;
	}
})(jQuery);





/**
 * ytiframe
 * change link to youtube player (iframe ver.)
 * @author: Alice Kim, alice@iropke.com
 */
(function($){

	var defaults = {
		videoWidth  : '100%',
		videoHeight : 'auto',
		videoIdBase : 'ytplayer',
		color       : 'white',
		autoplay    : 0,
		controls    : 1,
		targetId    : '',
		theme       : 'dark',
		onReady     : undefined
	};

	$.fn.ytiframe = function(options){

		if (this.length == 0) return this;

		if (this.length > 1) {
			this.each(function(){ $(this).ytiframe(options); });
			return this;
		}

		var player = {},
				el = this,
				o = {};

		var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;

		var init = function() {
			$.extend(o, defaults, options);
			player.url = el.attr('href');
			player.videoId = '';
			player.ytId = '';

			player.ytId = player.url.match(regExp)[2];
			player.videoId = o.videoIdBase + player.ytId;

			if (o.targetId == '') {
				if (el.parents('.flexible-obj').length > 0 ) {
						player.container = el.wrap( '<div class="video-player" />' ).parent();
				} else {
						player.container = el.wrap( '<div class="video-player flexible-obj" />' ).parent();
				}

				// embed iframe
				player.embed = $('<iframe src="//www.youtube.com/embed/'+ player.ytId +'?showinfo=0&color=' + o.color + '&theme=' + o.theme + '&enablejsapi=0&rel=0&autoplay='+ o.autoplay + '&controls=' + o.controls + '" frameborder="0" allowfullscreen></iframe>')
					.attr('id', player.videoId)
					.addClass('video-iframe')
					.appendTo( player.container );

			} else {

				$('#' + o.targetId).html('');
				player.embed = $('<iframe src="//www.youtube.com/embed/'+ player.ytId +'?showinfo=0&color=' + o.color + '&theme=' + o.theme + '&enablejsapi=0&rel=0&autoplay='+ o.autoplay + '&controls=' + o.controls + '" frameborder="0" allowfullscreen></iframe>')
					.attr('id', player.videoId)
					.appendTo( $('#' + o.targetId) );
			}

			if (typeof o.onReady === 'function') o.onReady(player.embed);

			if (o.targetId == '') {
				el.hide();
			}
		}

		init();

		el.destroyPlayer = function() {
			if ( player.embed ) {
				player.embed.remove();
				el.css('display', '');
				el.unwrap();
			}
		}

		return this;
	}
})(jQuery);





/**
 * inview event
 */
(function($) {
	var inview = function () {
		var $win = $(window),
				winHeight = $win.height(),
				scrollTop = $win.scrollTop(),
				docHeight = $(document).height(),
				elems = [];

		$.each($.cache, function () {
			if (this.events && this.events.inview) {
				var elem = this.handle.elem,
						offset = 0;

				try {
						offset = this.events.inview[0].data.offset;
				} catch(err) {}

				$(elem).data('offset', offset);
				elems.push(elem);
			}
		});

		if(!elems.length) return;

		$(elems).each(function(idx, el) {
			var $el = $(el),
					elTop = $el.offset().top,
					height = $el.height(),
					offset = winHeight * (1 - $el.data('offset')),
					inview = $el.data('inview') || false;

			if ((scrollTop + winHeight) < elTop || scrollTop > (elTop + height)) {
				if (inview) {
					$el.data('inview', false);
					$el.trigger('inview', [false]);
				}
			} else if (
				(scrollTop + winHeight - offset) >= (elTop) ||
				(   // 스크롤로 도달될 수 없는 요소를 끝까지 스크롤 되었을 때 활성화
					elTop >= (docHeight - offset - 150) &&
					scrollTop + winHeight >= (docHeight - 150)
				)
			) {
				if (!inview) {
					$el.data('inview', true);
					$el.trigger('inview', [true]);
				}
			}
		});
	};

	$(window).scroll(inview);
	$(window).resize(inview);
	setTimeout(inview, 500); // set first time for mobile
})(jQuery);





/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);





/**
 * Debounced Resize() jQuery Plugin
 * @author Paul Irish
 * http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
 */
(function($,sr){
	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;

		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
					timeout = null;
			};

			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 100);
		};
	}
	// smartresize
	jQuery.fn[sr] = function(fn){ return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})(jQuery,'smartresize');





/* ScrollToPlugin.min.js */
/*!
 * VERSION: 1.7.5
 * DATE: 2015-02-26
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";var t=document.documentElement,e=window,i=function(i,r){var s="x"===r?"Width":"Height",n="scroll"+s,a="client"+s,o=document.body;return i===e||i===t||i===o?Math.max(t[n],o[n])-(e["inner"+s]||t[a]||o[a]):i[n]-i["offset"+s]},r=_gsScope._gsDefine.plugin({propName:"scrollTo",API:2,version:"1.7.5",init:function(t,r,s){return this._wdw=t===e,this._target=t,this._tween=s,"object"!=typeof r&&(r={y:r}),this.vars=r,this._autoKill=r.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=r.x?(this._addTween(this,"x",this.x,"max"===r.x?i(t,"x"):r.x,"scrollTo_x",!0),this._overwriteProps.push("scrollTo_x")):this.skipX=!0,null!=r.y?(this._addTween(this,"y",this.y,"max"===r.y?i(t,"y"):r.y,"scrollTo_y",!0),this._overwriteProps.push("scrollTo_y")):this.skipY=!0,!0},set:function(t){this._super.setRatio.call(this,t);var r=this._wdw||!this.skipX?this.getX():this.xPrev,s=this._wdw||!this.skipY?this.getY():this.yPrev,n=s-this.yPrev,a=r-this.xPrev;this._autoKill&&(!this.skipX&&(a>7||-7>a)&&i(this._target,"x")>r&&(this.skipX=!0),!this.skipY&&(n>7||-7>n)&&i(this._target,"y")>s&&(this.skipY=!0),this.skipX&&this.skipY&&(this._tween.kill(),this.vars.onAutoKill&&this.vars.onAutoKill.apply(this.vars.onAutoKillScope||this._tween,this.vars.onAutoKillParams||[]))),this._wdw?e.scrollTo(this.skipX?r:this.x,this.skipY?s:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),s=r.prototype;r.max=i,s.getX=function(){return this._wdw?null!=e.pageXOffset?e.pageXOffset:null!=t.scrollLeft?t.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},s.getY=function(){return this._wdw?null!=e.pageYOffset?e.pageYOffset:null!=t.scrollTop?t.scrollTop:document.body.scrollTop:this._target.scrollTop},s._kill=function(t){return t.scrollTo_x&&(this.skipX=!0),t.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,t)}}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();





/**
 * menu-aim is a jQuery plugin for dropdown menus that can differentiate
 * between a user trying hover over a dropdown item vs trying to navigate into
 * a submenu's contents.
 *
 * https://github.com/kamens/jQuery-menu-aim
 */
(function($) {

	$.fn.menuAim = function(opts) {
		this.each(function() {
			init.call(this, opts);
		});
		return this;
	};

	function init(opts) {
		var $menu = $(this),
			activeRow = null,
			mouseLocs = [],
			lastDelayLoc = null,
			timeoutId = null,
			options = $.extend({
				rowSelector: "> li",
				submenuSelector: "*",
				submenuDirection: "right",
				tolerance: 75,  // bigger = more forgivey when entering submenu
				enter: $.noop,
				exit: $.noop,
				activate: $.noop,
				deactivate: $.noop,
				exitMenu: function() {}
			}, opts);

		var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
			DELAY = 300;  // ms delay when user appears to be entering submenu

		/**
		 * Keep track of the last few locations of the mouse.
		 */
		var mousemoveDocument = function(e) {
				mouseLocs.push({x: e.pageX, y: e.pageY});

				if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
					mouseLocs.shift();
				}
			};

		/**
		 * Cancel possible row activations when leaving the menu entirely
		 */
		var mouseleaveMenu = function() {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}

				// If exitMenu is supplied and returns true, deactivate the
				// currently active row on menu exit.

				if (options.exitMenu(this)) {
					if (activeRow) {
						options.deactivate(activeRow);
					}

					activeRow = null;
				}
			};

		/**
		 * Trigger a possible row activation whenever entering a new row.
		 */
		var mouseenterRow = function() {
				if (timeoutId) {
					// Cancel any previous activation delays
					clearTimeout(timeoutId);
				}

				options.enter(this);
				possiblyActivate(this);
			},
			mouseleaveRow = function() {
				options.exit(this);
			};

		/*
		 * Immediately activate a row if the user clicks on it.
		 */
		var clickRow = function() {
				activate(this);
			};

		var activate = function(row) {
				if (row == activeRow) {
					return;
				}

				if (activeRow) {
					options.deactivate(activeRow);
				}

				options.activate(row);
				activeRow = row;
			};

		var possiblyActivate = function(row) {
				var delay = activationDelay();

				if (delay) {
					timeoutId = setTimeout(function() {
						possiblyActivate(row);
					}, delay);
				} else {
					activate(row);
				}
			};

		/**
		 * Return the amount of time that should be used as a delay before the
		 * currently hovered row is activated.
		 *
		 * Returns 0 if the activation should happen immediately. Otherwise,
		 * returns the number of milliseconds that should be delayed before
		 * checking again to see if the row should be activated.
		 */
		var activationDelay = function() {
				if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
					// If there is no other submenu row already active, then
					// go ahead and activate immediately.
					return 0;
				}

				var offset = $menu.offset(),
					upperLeft = {
						x: offset.left,
						y: offset.top - options.tolerance
					},
					upperRight = {
						x: offset.left + $menu.outerWidth(),
						y: upperLeft.y
					},
					lowerLeft = {
						x: offset.left,
						y: offset.top + $menu.outerHeight() + options.tolerance
					},
					lowerRight = {
						x: offset.left + $menu.outerWidth(),
						y: lowerLeft.y
					},
					loc = mouseLocs[mouseLocs.length - 1],
					prevLoc = mouseLocs[0];

				if (!loc) {
					return 0;
				}

				if (!prevLoc) {
					prevLoc = loc;
				}

				if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
					prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
					// If the previous mouse location was outside of the entire
					// menu's bounds, immediately activate.
					return 0;
				}

				if (lastDelayLoc &&
						loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
					// If the mouse hasn't moved since the last time we checked
					// for activation status, immediately activate.
					return 0;
				}


				function slope(a, b) {
					return (b.y - a.y) / (b.x - a.x);
				};

				var decreasingCorner = upperRight,
					increasingCorner = lowerRight;

				if (options.submenuDirection == "left") {
					decreasingCorner = lowerLeft;
					increasingCorner = upperLeft;
				} else if (options.submenuDirection == "below") {
					decreasingCorner = lowerRight;
					increasingCorner = lowerLeft;
				} else if (options.submenuDirection == "above") {
					decreasingCorner = upperLeft;
					increasingCorner = upperRight;
				}

				var decreasingSlope = slope(loc, decreasingCorner),
					increasingSlope = slope(loc, increasingCorner),
					prevDecreasingSlope = slope(prevLoc, decreasingCorner),
					prevIncreasingSlope = slope(prevLoc, increasingCorner);

				if (decreasingSlope < prevDecreasingSlope &&
						increasingSlope > prevIncreasingSlope) {
					// Mouse is moving from previous location towards the
					// currently activated submenu. Delay before activating a
					// new menu row, because user may be moving into submenu.
					lastDelayLoc = loc;
					return DELAY;
				}

				lastDelayLoc = null;
				return 0;
			};

		// edit by Alice 2015.02.10 : change event ordering
		var exitMenu = function() {
			mouseleaveMenu();
			options.exitMenu(this);
		}

		/**
		 * Hook up initial menu events
		 */
		$menu
			.mouseleave(mouseleaveMenu)
			.find(options.rowSelector)
				.mouseenter(mouseenterRow)
				.mouseleave(mouseleaveRow)
				// .focusout(exitMenu)
				.click(clickRow);

		$menu
			.find(options.rowSelector)
				.focusin(function(){
					possiblyActivate(this);
				});

		$(document).mousemove(mousemoveDocument);

	};
})(jQuery);
