// @file shop/cart.js
require(['ui','modal'], function() {
	'use strict';

	$(function() {

		//require(['modal'], function() {
			$.modal.defaults = IG.modal_defaults;

			$('a[data-layer]').click(function(event) {
				$(this).modal(IG.modal_layer);
				return false;
			});
		//});
		$('#cart-tab').simpleTab({
			scroll: true,
			scrollOffset: (getMedia() < 3) ? -49 : -100
		});

		// 제품 수량 버튼
		require(['utils/quantity'], function(qnt) {
			qnt.init();
		});

		// select all
//		$("#c-public-all").click(function(){
//			var $form = $(this).parents('.x-cart-form');
//			if($("#c-public-all").prop("checked")){
//				$("input[type=checkbox]").prop('checked', true).attr('checked', true);
//				$(this).text('전체선택');
//				$form.find('.x-view-price').show();
//				$form.find('.x-view-dc').show();
//				$form.find('.x-view-deliveryFee').show();
//				$form.find('.x-view-payAmount').show();
//				
//				$form.find('.x-tmp-price').hide();
//				$form.find('.x-tmp-dc').hide();
//				$form.find('.x-tmp-deliveryFee').hide();
//				$form.find('.x-tmp-payAmount').hide();
//			}else{
//				$("input[type=checkbox]").prop('checked', false).attr('checked', false);
//				$(this).text('선택해제');
//				$form.find('.x-view-price').hide();
//				$form.find('.x-view-dc').hide();
//				$form.find('.x-view-deliveryFee').hide();
//				$form.find('.x-view-payAmount').hide();
//				
//				$form.find('.x-tmp-price').show();
//				$form.find('.x-tmp-dc').show();
//				$form.find('.x-tmp-deliveryFee').show();
//				$form.find('.x-tmp-payAmount').show();
//			}
//			
//		});
//		
//		$("#c-public-all").click(function() {
//			var $form = $(this).parents('.x-cart-form');
//			var $table = $(this).parents('.order-table');
//			var $checks = $table.find('input[type=checkbox]');
//			var $all = $checks.eq(0);
//			$all.data('state', 0).on('click', function() {
//				
//			});
//		});
		
		
		$('.tab-content').each(function(){

			var $this = $(this),
				$checks = $this.find('input[type=checkbox]'),
				$all = $checks.eq(0);
			
			$all.data('state', 0).on('click', function() {
				var $form = $(this).parents('.x-cart-form');
				if ( !$all.data('state') ) {
//					$checks.click();
					$checks = $this.find('input[type=checkbox]');
					for(var i = 1; i < $checks.length; i ++){
						var $tr = $checks.eq(i).parents('TR');
						var down = $tr.find('.qnt-down').data('url');
						var up = $tr.find('.qnt-up').data('url');
						down = down.replace('minus', 'chkminus');
						$.get(down, function(data) {
			                var qty, dc, price;
			                if (data.success) {
			                	$form.find('.x-view-price').text("0");
			                	$form.find('.x-view-dc').text("0");
			                	$form.find('.x-view-deliveryFee').text("2,500");
			                	$form.find('.x-view-payAmount').text("2,500");                    	
			                } else {
			                    alert(data.message);
			                }
			            }, 'json');
						if($tr.hasClass("is-soldout") === false && $tr.hasClass("is-discontinued") === false){
							$checks.eq(i).prop('checked', false).attr('checked', false);							
						}
					}
					$all.prop('checked', false).attr('checked', false);
					$all.data('state', 1);
					$all.text('선택해제');
				} else {
//					$checks.click();
					$checks = $this.find('input[type=checkbox]');
					for(var i = 1; i < $checks.length; i ++){
						var $tr = $checks.eq(i).parents('TR');
						var down = $tr.find('.qnt-down').data('url');
						var up = $tr.find('.qnt-up').data('url');
						up = up.replace('plus', 'chkplus');
						$.get(up, function(data) {
			                var qty, dc, price;
			                if (data.success) {
			                	$form.find('.x-view-price').text(numberWithCommas(data.price));
			                	$form.find('.x-view-dc').text(numberWithCommas(data.dc));
			                	$form.find('.x-view-deliveryFee').text(numberWithCommas(data.deliveryFee));
			                	$form.find('.x-view-payAmount').text(numberWithCommas(data.payAmount));                    	
			                } else {
			                    alert(data.message);
			                }
			            }, 'json');
						if($tr.hasClass("is-soldout") === false && $tr.hasClass("is-discontinued") === false){
							$checks.eq(i).prop('checked', true).attr('checked', true);							
						}
					}
					$all.prop('checked', true).attr('checked', true);
					$all.data('state', 0);
					$all.text('전체선택');
				}
			});

		});

	});
});
