// utils/quantity.js
// 아이템 구매수량 +/- 

'use strict';

define(['utils'], function(){

	function init() {

		$(function(){

			$('.qnt-box').each(function(i, el){
				var $box = $(el),
						$input = $box.find('input'),
						$up = $box.find('.qnt-up'),
						$down = $box.find('.qnt-down'),
						qnt = $input.val(),
						min = 1,
						max = parseInt($input.attr('max')),
						press_timer,
						press_on,
						press_t = 500,
						i = 160; // interval time

					$up.on({
						click: function(){
							clearPress();
							up();
						},
						mousedown:function(){
							press_timer = setTimeout(function() {
								press_on = setInterval(up, i);
							}, press_t);
						}
					});

					$down.on({
						click: function(){
							clearPress();
							down();
						},
						mousedown:function(){
							press_timer = setTimeout(function() {
								press_on = setInterval(down, i);
							}, press_t);
						}
					});

					$box.on('mouseup mouseleave', clearPress);

					function clearPress() {
						qnt = $input.val();
						window.clearInterval(press_on);
						window.clearTimeout(press_timer);
					}

					function up() {
						if ( qnt < max ) {
							$input.prop('value', ++qnt);
							$input.trigger('change');
						} else {
							alert('해당 상품은 '+ max + '개까지 구입하실 수 있습니다.');
							clearPress();
						}
					}

					function down() {
						if ( qnt > min ) {
							$input.val(--qnt);
							$input.trigger('change');
						}
						!!qnt && clearPress();
					}
			});

			$('#input-qnt').on('change', function(){
				var q = $(this).val();
				$('#input-qnt-m').val(q);
				$('[data-price-per]').text( Number(q * $('[data-price-per]').data('price-per')).toLocaleString('en') ) ;
				$('#price-per[data-price-per]').append('  <span class="won_size">원</span>');
				IG.DEV && console.log( 'l', q);
			});

			$('#input-qnt-m').on('change', function(){
				var q = $(this).val();
				$('#input-qnt').val(q);
				$('[data-price-per]').text( Number(q * $('[data-price-per]').data('price-per')).toLocaleString('en') ) ;
				$('#price-per[data-price-per]').append('  <span class="won_size">원</span>');
			});
		});

	}

	return {
		init: init
	}

});
