// utils/nav.js
// GNB (for large device's menu), Navigation Drawer (for mobile menu)

'use strict';

define(['utils'], function(){

	var activation = IG.$header.data('gnb'),
			$html = $('html'),
			url = location.href,
			GNB = {},
			d3name = '',
			d1, d2, d3;

	d3 = 0;

	if ( activation == undefined ) {
		d1 = IG.$gnb.find('.d1.is-current').index() + 1;
		d2 = IG.$gnb.find('.d1 li.is-current').index() + 1;

	} else {
		activation = String(activation).split(',');
		d1 = ( activation[0] == undefined ) ? 0 : parseInt(activation[0]);
		d2 = ( activation[1] == undefined ) ? 0 : parseInt(activation[1]);
		d3 = ( activation[2] == undefined ) ? 0 : parseInt(activation[2]);
	}

	if ( url.match(/\?\w*=/) ) {
		d3name = url.match(/\?\w*=\w*/i)[0].replace(/\?\w*=/, '');

		$('.sn-d3').find('.nav-a').each(function(i, el){
			var $a = $(el),
					link = $a.attr('href');

			if ( link.match(/\?\w*=\w*/i) ) {
				link = link.match(/\?\w*=\w*/i)[0].replace(/\?\w*=/, '');
				$a.data('d3name', link).attr('data-d3name', link);
			}
		});
	}

	IG.DEV && console.log( '[activation]', d1, d2, d3 );


	/* navigation - width >= 1024px */
	var GNB = {
		setbg: true,
		t: 0.5,
		timer: {},
		tl: new TimelineMax(),
		$menu: $('#gnb-menu'),
		$bg: $('#gnb-bg'),
		$d1: IG.$gnb.find('.d1'),
		$d2Box: IG.$gnb.find('.d1 ul'),
		curRow: null,
		activeRow: null,
		setup: function() {

			GNB.tl
				.addLabel('slide')
				.to(GNB.$bg, GNB.t, {
					className:"+=is-active", ease: Power2.easeInOut
				}, 'slide')
				.to(GNB.$d2Box, 0.2, {
					autoAlpha: 1,
					ease: Power2.easeOut
				}, 'slide')
				.pause();

			if ( d1 == 0 || d1 == undefined ) {
				GNB.setbg = false;

			} else {

				GNB.curRow = GNB.$d1[d1-1];

				if ( d1 == 1 ) {
					GNB.setbg = true;
					GNB.isopen = true;
					GNB.$bg.addClass('is-active');
					GNB.activate( GNB.curRow );
				}

				if ( d2 > 0 ) {
					$(GNB.curRow).addClass('is-current').find('li').eq(d2-1).addClass('is-current');
				}
			}

		},
		activate: function(row) {
			var $d1 = $(row);

			if ( !GNB.isopen ) {
				GNB.tl.play();
				GNB.timer = setTimeout(active, (GNB.t - 0.2)*1000);
				GNB.isopen = true;

			} else {
				clearTimeout(GNB.timer);
				active();
			}

			function active() {
				if ( GNB.curRow !== null ) {
					$(GNB.curRow).removeClass('is-active').find('ul').hide();
				}

				GNB.$d1.removeClass('is-active').find('ul').hide();
				$d1.addClass('is-active').find('ul').show();
			}

			GNB.activeRow = row;
			IG.DEV && console.log( '[GNB] activate:', $d1.find('>a').text() );
		},
		deactivate: function(row) {

			!GNB.setbg && clearTimeout(GNB.timer);
			$(row).removeClass('is-active').find('ul').hide();

			IG.DEV && console.log( '[GNB] deactivate', $(row) );
		},
		init: function() {
			GNB.setup();
			GNB.$menu.menuAim({
				activate: function(row) {
					GNB.activate(row);
				},
				deactivate: function(row) {
					GNB.deactivate(row);
				},
				exitMenu: resetGNB,
				submenuDirection: 'below'
			});
		}
	}

	function resetGNB() {
		var deactivateSubmenu = true;

		IG.DEV && console.log('[resetGNB]');

		if ( GNB.isopen && (GNB.curRow == null || d1 > 1) ) {
			clearTimeout(GNB.timer);
			GNB.tl.reverse(0);
			GNB.isopen = false;
		}

		if ( d1 == 1 ) {
			GNB.activate( GNB.curRow );
			deactivateSubmenu = false;
		}

		return deactivateSubmenu;   // for reset activateSubmenu
	}



	/* navigation drawer - width < 1024px */
	var ND = {
		$box: $('.sn-box'),
		$links: IG.$sn.find('.em-links'),
		$searchBox: $('#side-search-box'),
		$d1: $('.sn-d1'),
		$d2: $('.sn-d2'),
		$d3h: $('.nav-a-more'),
		$d3a: $('.sn-d3').find('.nav-a'),
		curId: '',
		$curD1: {},
		$curD2: {},
		$curD3: {},
		activated: false,
		close: function() {
			if ( IG.$sn.hasClass('is-active') ) {
				IG.$sn.removeClass('is-active');
				IG.$blocker.removeClass('is-active');
				$('html').removeClass('is-open-nav');
				IG.$go_top.show();
				$('#floating-cart').show();
			}
		},
		open: function() {
			IG.$body.trigger('click');
			if (IG.$sn.hasClass('is-active')) return;

			IG.$sn.addClass('is-active');
			IG.$blocker.addClass('is-active');
			$('html').addClass('is-open-nav');
			IG.$go_top.hide();
			$('#floating-cart').hide();

			!!IG.switchSel && IG.switchSel.close();

			if ( d1 > 0 && (ND.activated != ND.curId) ) {
				IG.DEV && console.log('[ND] activated: ' + ND.activated + ', [ND] current: ' + ND.curId);

				ND.deactivate();
				ND.activate(ND.$curD1);
			}

			if ( d2 > 0 ) {
				ND.$d3h.not(ND.$curD2.find('>a')).each(function(i, el) {
					ND.closeD3($(el));
				});

				if ( !ND.$curD2.find('>a').data('is-open') ) {
					ND.openD3(ND.$curD2.find('>a'));
				}
			}
			
			ND.closeLayers();
		},
		activate: function($target) {
			var _this = this;

			TweenMax.to(_this.$d1, 0.3, {
				position: 'absolute',
				left: '-100%',
				width: '100%'
			});
			TweenMax.to(_this.$d2, 0.3, {
				display: 'block',
				left: '0%'
			});
			$target.show();
			_this.activated = '#' + $target.attr('id');
		},
		deactivate: function($target) {
			var _this = this;

			TweenMax.to(_this.$d1, 0.3, {
				position: 'relative',
				left: '0%'
			});
			TweenMax.to(_this.$d2, 0.3, {
				left: '100%'
			});
			_this.$d2.find('dl').hide();
			_this.activated = false;
		},
		openD3: function($h) {
			if ( !$h.data('is-open') ) {
				$h.addClass('is-active');
				$h.next().slideDown();
				$h.data('is-open', true);
			}
		},
		closeD3: function($h) {
			if ( $h.data('is-open') ) {
				$h.removeClass('is-active');
				$h.next().slideUp();
				$h.data('is-open', false);
			}
		},
		closeLayers: function() {
			ND.$box.find('.em-link').removeClass('is-active');
			ND.$box.find('.ly').slideUp(200);
		},
		cancel: function(e) {
			e.stopPropagation();
			e.preventDefault();
		},
		setCurrent: function() {
			var _this = this;

			_this.$d3h.data('is-open', false);

			if ( d1 > 0 ) {
				_this.curId = $('#sn-d1-links').find('.nav-a').eq(d1-1).attr('href');
				_this.$curD1 = $(_this.curId);
				_this.activate(_this.$curD1);

				if ( d2 > 0 ) {
					_this.$curD2 = _this.$curD1.find('dd > ul > li').eq(d2-1);
					_this.$curD2.addClass('is-current').find('>a').addClass('is-active').data('is-open', true);

					if ( d3name != '' ) {
						d3 = _this.$curD2.find('[data-d3name='+d3name+']').parent().index() + 1;
					}

					if ( d3 > 0 ) {
						_this.$curD2.find('li').eq(d3-1).addClass('is-current');
					}
				}
			}
		},
		setup: function() {
			var _this = this;

			$('#toggle-menu').on('click.open_sidenav', function(event){
				ND.open();
				ND.cancel(event);
			});

			$('#close-sidenav').on('click.close_sidenav', function(event){
				ND.close();
				ND.cancel(event);
			});

			_this.$box.on('touchstart', function(event){
				event.stopPropagation();
			});

			$(document).on('pageshow', _this.close);
			IG.$blocker.on('touchstart.close_sidenav', _this.close);
			IG.$blocker.on('click.close_sidenav', _this.close);

			_this.$links.on('click', '[href^=#]', function(event){
				var $a = $(this);

				if ( !$a.hasClass('is-active') ) {
					ND.closeLayers();
					$a.addClass('is-active');
					$($a.attr('href')).slideDown(200);
				} else {
					ND.closeLayers();
				}

				_this.cancel(event);
			});

			_this.$searchBox.on('click', '.close-search', function(){
				$('[href="#side-search-box"]').removeClass('is-active');
				_this.$searchBox.slideUp();
				_this.$searchBox.find('input').val('');
			});
		},
		init: function() {
			ND.setCurrent();
			ND.setup();

			$('.d1-links').on('click', '.nav-a', function(event){
				ND.activate($($(this).attr('href')));
				ND.cancel(event);
			});

			$('.nav-d2-a').on('click', function(event){
				ND.deactivate($($(this).attr('href')));
				ND.cancel(event);
			});

			ND.$d3h.on('click', function(event){
				var $h = $(this);

				if ( $h.data('is-open') ) {
					ND.closeD3($h);
				} else {
					ND.openD3($h);
				}

				ND.cancel(event);
			});
		}
	} // end ND



	function init() {
		GNB.init();
		ND.init();

		// header layer
		$('[data-rel="toggle"]').toggleLayer({
			onOpen: function($link, $target) {
				IG.$body.trigger('click');
			}
		});
	}

	return {
		init: init
	};
});
