// @file mypage/main.js

require(['ui'], function() {
	'use strict';

	$(function(){
		// datepicker setup
		IG.$body.has('.x-datepicker') && setInquiryPeriod();
		
		// 주문 조회 (inquiry) setup
		function setInquiryPeriod() {
			require(['datepicker'], function() {

				$.datepicker.setDefaults(IG.datepicker_defaults);
				// inquiry datepicker
				var $periodBtns = $('.set-period'),
						today = new Date(),
						datepicker_options = {
							beforeShowDay :noBefore,
							beforeShow: function(input, inst) {
								inst.dpDiv.css('margin-top', 10);
							},
							onSelect : function() {
								$periodBtns.removeClass('btn-em');
							}
						};

				$('.x-datepicker').datepicker();
				$('.x-datepicker').datepicker('option', datepicker_options);

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
		function noBefore(date){
			var minDate = new Date();
			minDate.setFullYear(2016,2,31); //20160401이후부터 검색 되게끔..
		   if (date < minDate) 
		       return [false]; 
		   return [true]; 
		}
		$('#btn-mypage').click(function(event){
			if(!$('#date-from').val()) { alert("검색 시작 날짜를 선택하세요.");  return false; }
		    if(!$('#date-to').val()) { alert("검색 끝 날짜를 선택하세요.");  return false; }
		    var start = new Date($('#date-from').datepicker("getDate"));
		    var end = new Date($('#date-to').datepicker("getDate"));
		    if (end - start < 0){
		     alert("검색 끝 날짜가 시작 날짜보다 이전 일 수 없습니다."); return false;
		    }
		    var diffDay = end - start;
		    var year = 1000*60*60*24*30*12;
		    if((diffDay/year).toFixed(3)>2.028){
		    	alert("최근 2년까지만 조회됩니다.");
		    	return false;
		    }
		    
		    return true;
		});
		
	});	// end: document ready

});
