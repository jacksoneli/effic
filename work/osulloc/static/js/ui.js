/**
 * @fileoverview: UI actions
 * @author alice@iropke.com
 * @since 2016.01.21
 */
'use strict';

$(function() {
	IG.$win = $(window);
	IG.$body = $('body');
	IG.$wrap = $('#wrap');
	IG.$header = $('#header');
	IG.$gnb = $('#gnb');
	IG.$main = $('#main');
	IG.$footer = $('#footer');
	IG.$blocker = $('#igm-blocker');
	IG.$sn = $('#sidenav');
	IG.$go_top = $('#go-top');

	IG.resizeId = {};
	IG._scrollFlag = false;

	require(['utils/fontSpy'], function(){

		fontSpy('fontello', {
		  glyphs: '\ue82d',
		  success: function() {
		    IG.DEV && console.log('fontello loaded');

		    TweenMax.to($('[class^="icon-"]'), 0.3, {
			  	autoAlpha: 1,
			  	clearProps: 'all',
			  	onComplete: function(){
			  		$('html').addClass('fontello-loaded');
			  	}
			  });
		  },
		  failure: function() {}
		});

	});

	// resize event
	IG.$win.on('resize', function() {
		if ((Modernizr.touchevents && getMedia() < 6) || getMedia() == 'legacy') return;
		// IG.$blocker.addClass('is-active');
		clearTimeout(IG.resizeId);
		IG.resizeId = setTimeout(doneResizing, 100);
	});

	function getSizes() {
		IG.windowWidth = IG.$win.width();
		IG.windowHeight = window.innerHeight ? window.innerHeight : IG.$win.height();
		IG.navHeight = IG.$header.outerHeight();
		IG.footerHeight = IG.$footer.height();
		IG.contentHeight = $(document).height();
	}

	function doneResizing() {
		getSizes();
	}

	if (!Modernizr.mq('only all') && getMedia() == 'legacy' ) {
		require(['utils/legacy'], function(legacy){
			IG.DEV && console.log('ie8 fallback');
			legacy.init();
		});
	}

	require(['utils/nav'], function(nav){
		nav.init();
	});

	// defalut actions
	if ( $('#lnb-header').data('lnb-current') ) {
		$('#lnb-header').find('li').eq($('#lnb-header').data('lnb-current') - 1).addClass('is-current');
	}

	selectbox();
	switchSelbox();

	getSizes();
	responsiveImg();

	if ( !$('#bs-frame').length ) {
		!Modernizr.backgroundsize && require(['lib/background_size_emu']);
	}

	fooTice();
	mCcordion();
	selectLang();

	// 'go top' click event
	IG.$go_top.on('click', function(event) {
		IG.$body.stop().animate({scrollTop:0}, 500);
		$(this).blur();
		event.preventDefault();
		event.stopPropagation();
	});

	// setup library defaults
	$.extend($.datepicker,{_checkOffset:function(inst,offset,isFixed){return offset}});

	IG.datepicker_defaults = {
	  monthNames: ['01','02','03','04','05','06','07','08','09','10','11', '12'],
		hideIfNoPrevNext: true,
		showMonthAfterYear: true,
		dateFormat: 'yy.mm.dd',
		nextText: '다음 달',
		prevText: '이전 달'
	};

	IG.modal_defaults = {
	  escapeClose: false,
	  clickClose: false,
	  closeText: '닫기',
	  closeClass: '',
	  showClose: true,
	  modalClass: 'modal',
	  spinnerHtml: null,
	  showSpinner: true,
	  fadeDuration: 200,
	  fadeDelay: 0
	};

	IG.modal_layer = {
	  escapeClose: true,    // Allows the user to close the modal by pressing `ESC`
	  clickClose: true,     // Allows the user to close the modal by clicking the overlay
	  closeText: '닫기',    // Text content for the close <a> tag.
	  closeClass: '',       // Add additional class(es) to the close <a> tag.
	  showClose: true,      // Shows a (X) icon/link in the top-right corner
	  modalClass: 'layer',  // CSS class added to the element being displayed in the modal.
	  spinnerHtml: null,    // HTML appended to the default spinner during AJAX requests.
	  showSpinner: true,    // Enable/disable the default spinner during AJAX requests.
	  fadeDuration: 250,    // Number of milliseconds the fade transition takes (null means no transition)
	  fadeDelay: 0.25       // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
	};


	// 180222_01: 모바일상품권 상세보기 및 등록/사용 팝업에서 사용
	IG.modal_layer_full = {
		escapeClose: true,    // Allows the user to close the modal by pressing `ESC`
		clickClose: true,     // Allows the user to close the modal by clicking the overlay
		closeText: '닫기',    // Text content for the close <a> tag.
		closeClass: '',       // Add additional class(es) to the close <a> tag.
		showClose: true,      // Shows a (X) icon/link in the top-right corner
		modalClass: 'layer-full',  // CSS class added to the element being displayed in the modal.
		spinnerHtml: null,    // HTML appended to the default spinner during AJAX requests.
		showSpinner: true,    // Enable/disable the default spinner during AJAX requests.
		fadeDuration: 250,    // Number of milliseconds the fade transition takes (null means no transition)
		fadeDelay: 0.25       // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
	};

	// 181102: 주문하기 멤버십 인증에서 사용
	IG.modal_layer_member = {
		escapeClose: true,    // Allows the user to close the modal by pressing `ESC`
		clickClose: true,     // Allows the user to close the modal by clicking the overlay
		closeText: '닫기',    // Text content for the close <a> tag.
		closeClass: '',       // Add additional class(es) to the close <a> tag.
		showClose: true,      // Shows a (X) icon/link in the top-right corner
		modalClass: 'layer-membership',  // CSS class added to the element being displayed in the modal.
		spinnerHtml: null,    // HTML appended to the default spinner during AJAX requests.
		showSpinner: true,    // Enable/disable the default spinner during AJAX requests.
		fadeDuration: 250,    // Number of milliseconds the fade transition takes (null means no transition)
		fadeDelay: 0.25       // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
	};
	
	//L포인트 인증 팝업
	IG.modal_layer_lpoint = {
		escapeClose: false,
		clickClose: false,
		closeText: '닫기',
		closeClass: '',
		showClose: false,
		modalClass: 'modal',
		spinnerHtml: null,
		showSpinner: true,
		fadeDuration: 200,
		fadeDelay: 0
	};


	// init scroll event
	IG.$win.on('scroll', function(){
		window.requestAnimationFrame(scrollHandler);
	});

	IG.catchScroll = setInterval(initScroll, 50);

	// init scroll
	IG.$win.scroll();

	function scrollHandler() {
		IG._scrollFlag = true;
		IG._currentScroll = IG._scrollTop;
		IG._scrollTop = IG.$win.scrollTop();
		IG._scrollDirection = ( IG._currentScroll == IG._scrollTop ) ? 0 : ( IG._currentScroll < IG._scrollTop ) ? 'down' : 'up';

		fixedItems();
	}

	function initScroll() {
		if ( IG._scrollFlag ) {
			IG.$body.addClass('disable-hover');
			IG._scrollFlag = false;

		} else {
			IG.$body.removeClass('disable-hover');
		}
	}

	// footer notice
	function fooTice() {
		var $noticeList = $('.footer-notice-list'),
			tweenTime = 0.8;

		$noticeList.each(function(i, el){
			var $el = $(el),
				$item = $el.find('li'),
				currentSlide = 0;

			TweenLite.set($item.filter(":gt(0)"), {y: '100%'});
			TweenLite.delayedCall(tweenTime*3, nextSlide);

			function nextSlide() {
				TweenLite.to( $item.eq(currentSlide), tweenTime, {y: '-100%'} );

				currentSlide < $item.length - 1 ? currentSlide++ : currentSlide = 0;
				TweenLite.fromTo( $item.eq(currentSlide), tweenTime, {y: '100%'}, {y: '0%'} );
				TweenLite.delayedCall(tweenTime*3, nextSlide);
			}
		});
	}

	// mobile footer accrdion
	function mCcordion() {
		var opt = {
			titleSelector:  '.link-bizinfo',
			contSelector:   '.footer-bizinfo-detail',
			easing: 'easeOutCirc'
		}

		$('.footer-bizinfo').accordion(opt);
	}


	// 언어선택 레이어
	function selectLang() {
		var $layer = $('#languages'),
				$btn_open = $('#toggle-languages'),
				$btn_close = $layer.find('.close-layer'),
				z = IG.$footer.css('z-index');

		$btn_open.on('click', function(){
			//
			$layer.show();
			IG.$body.addClass('is-open-lang');
			IG.$footer.css('z-index', '200');
			return false;
		});

		$btn_close.on('click', function(){
			$layer.hide();
			IG.$body.removeClass('is-open-lang');
			IG.$footer.css('z-index', z);
		});
	}
});
