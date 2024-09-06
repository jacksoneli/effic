// @file shop/item.js

require(['ui', 'slick', 'SmoothScroll'], function(a, b, c) {
	'use strict';
	
	$(function() {

		if($('.groupbuy_target').length > 0) {
			movePerTxt();
		}

		var cartLayer = {
			isOpen: false,
			$btn: $('#call-cart-layer'),
			$layer: $('#cart-layer'),
			$close: $('#cart-layer').find('.close-layer'),
			init: function() {
				var _this = this;

				_this.$btn.on('click', function(event){
					if (!_this.$btn.hasClass('dim')) {
						if ( _this.isOpen ) {
							_this.close();
						} else {
							_this.open();
						}
					}
					event.preventDefault();
				});

				_this.$close.on('click', function() {
					_this.close();
				});

				_this.close();
			},
			open: function() {
				var _this = this;

				IG.$go_top.hide();
				_this.$btn.addClass('toggle-on');
				_this.$layer.delay(200).slideDown(300);
				_this.isOpen = true;
			},
			close: function() {
				var _this = this;

				IG.$go_top.show();
				_this.$layer.slideUp(300, function() {
					_this.$btn.removeClass('toggle-on');
				});
				_this.isOpen = false;
			}
		}

		cartLayer.init();
		
		//20190531 : 공동구매 페이지 스크롤 헤더고정
		var groupbuyHeader = $('.groupbuy_lnb');
		var groupbuyTopHeight = $('.groupbuy_lnb .h').height();
		var subnavHeight = $('#gnb-bg').height();

		$(window).scroll(function(){

			if ( $('#header').hasClass('is-sticked') ) {

				groupbuyHeader.removeClass('up');			
			} else {

				groupbuyHeader.addClass('up');
			}

			if ( IG._scrollTop > groupbuyTopHeight + subnavHeight ) {

				groupbuyHeader.addClass('is-sticked');
				$('.prod_head_visual.groupbuy').addClass('add_mt');
			} else {

				groupbuyHeader.removeClass('is-sticked');
				$('.prod_head_visual.groupbuy').removeClass('add_mt');
			}

		});
		$(groupbuyHeader).trigger('scroll');
		//end 20190531 : 공동구매 페이지 스크롤 헤더고정
		
	});
	function movePerTxt() {
		var $this = $('.groupbuy_target'),
			$this2 = '';

		if ($this.hasClass('dual')) {
			$this = $('.groupbuy_target.dual');
			$this2 = $('.groupbuy_target2');
			moveTxtDual();
		} else {
			moveTxtSingle();
		}

		function moveTxtSingle() {
			$this.css({ 'margin-top':'-3%', 'opacity':'0' });
			$this.animate({ 'marginTop': '0%', opacity: 1 },350, function() {
				$this.delay(1200).animate({ 'marginTop': '3%', opacity: 0 },500, function() {
					$this.css({ 'margin-top':'-3%', 'opacity':'0' });
					setTimeout(function() { moveTxtSingle(); }, 350);
				});
			});
		}
		function moveTxtDual() {
			$this.css({ 'margin-top':'-3%', 'opacity':'0' });
			$this2.css({ 'margin-top':'-3%', 'opacity':'0'});

			$this.animate({ 'marginTop': '0%', opacity: 1 },350, function() {
				$this.delay(1200).animate({ 'marginTop': '3%', opacity: 0 },500, function() {

					$this.css({ 'margin-top':'-3%', 'opacity':'0' });

					$this2.animate({'marginTop': '0%', opacity: 1 },350, function() {
						$this2.delay(1200).animate({ 'marginTop': '3%', opacity: 0 },500, function() {
							setTimeout(function() { moveTxtDual(); }, 350);
						});
					});

				});

			});
		}
	}

});
