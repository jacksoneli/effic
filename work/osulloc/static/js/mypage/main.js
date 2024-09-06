// @file mypage/main.js

require(['ui'], function() {
	'use strict';

	$(function(){

		IG.$body.has('.wishlist') && checkAll();

		// modal setup
		require(['modal'], function() {
			$.modal.defaults = IG.modal_defaults;

			$('a[data-layer]').click(function(event) {
			  $(this).modal(IG.modal_layer);
			  return false;
			});
		});

		// modal setup
		require(['slick'], function(slick) {

			var $cpn = $('.wallet-coupon'),
				$cpnCount = $cpn.find('.h .count'),
				$cpnList = $cpn.find('.wallet-coupon-list'),
				$cpnItem = $cpnList.find('li');

			$cpnCount.text( $cpnItem.length );

			IG.$body.has($cpn) && viewCpn();

			function viewCpn() {
				$cpnList.slick({
					infinite: true,
					slidesToShow: 3,
					slidesToScroll: 3,
					responsive: [{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
						}
					},{
						breakpoint: 680,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
						}
					}]
				});
			}

			//Passport Slick
			$('.passport_couponbox').slick({
				dots: true,
				infinite: true,
				prevArrow: $('.passport_box_prev'),
				nextArrow: $('.passport_box_next'),
				appendDots: $('.passport_box_nav')
			});


		});


		// FAQ
		$('.faq').accordion({
			titleSelector:  '.faq-q',
			contSelector:   '.faq-a',
		});


		// 금액대별 사은품
		IG.$body.has('.shop-gift-list') && require(['slick'], function() {
			$('.shop-gift-list').on('init', function(){
				//
			}).slick({
				dots: true,
				infinite: false,
				slidesToShow: 2,
				slidesToScroll: 2,
				mobileFirst: true,
			  responsive: [
			    {
			      breakpoint: 600,
			      settings: {
			        slidesToShow: 3,
			        slidesToScroll: 3
			      }
			    },
			    {
			      breakpoint: 1280,
			      settings: {
			        slidesToShow: 4,
			        slidesToScroll: 4
			      }
			    }
			  ]
			});
		});


		// datepicker setup
		IG.$body.has('.call-datepicker') && setInquiryPeriod();



		// 주문 조회 (inquiry) setup
		function setInquiryPeriod() {
			require(['datepicker'], function() {

				$.datepicker.setDefaults(IG.datepicker_defaults);

				// inquiry datepicker
				var $periodBtns = $('.set-period'),
						today = new Date(),
						datepicker_options = {
							maxDate: '0',
							beforeShow: function(input, inst) {
								inst.dpDiv.css('margin-top', 10);
							},
							onSelect : function() {
								$periodBtns.removeClass('btn-em');
							}
						};

				$('.call-datepicker').datepicker();
				$('.call-datepicker').datepicker('option', datepicker_options);

				$periodBtns.on('click', function(){
					$periodBtns.removeClass('btn-em');

					$('.date-from').datepicker('setDate', $(this).data('set-date'));
					$('.date-to').datepicker('setDate', today);

					$(this).addClass('btn-em');
				});

				IG.DEV && $periodBtns.eq(0).trigger('click');

        var startDate = $('#startDate').val(),
        		endDate = $('#endDate').val();

        if (startDate === "" && endDate === "") {
        	$periodBtns.eq(0).trigger('click');
        } else if(startDate != null ||  endDate != null){
        	$('#date-from').datepicker('setDate', startDate);
        	$('#date-to').datepicker('setDate', endDate);
        }

			});
		}

		function checkAll() {
			var $wishList = $('.wishlist'),
				$wishItemAll = $('#items-all'),
				$wishItem = $wishList.find('input[type="checkbox"]');

			$wishItemAll.on('click', function() {
				$wishItemAll.is(':checked') ? checkItem($wishItem) : uncheckItem($wishItem);
			});

			function checkItem($el) {
				$el.attr('checked', false).prop('checked', false);
				$el.click();
			}

			function uncheckItem($el) {
				$el.attr('checked', false).prop('checked', false);
			}
		}

	});	// end: document ready

});
