
require(['museum/reservation', 'datepicker', 'validate', 'ui'], function() {
	'use strict';
	$( function(){
		var datepicker_options = {
			    monthNames: ['01','02','03','04','05','06','07','08','09','10','11', '12'],
			    dayNamesMin: ['일','월','화','수','목','금','토'],
			    hideIfNoPrevNext: true,
			    dateFormat: 'yy-mm-dd',
			    showMonthAfterYear: true,
			    nextText: '다음 달',
			    prevText: '이전 달'
			};
		$('.x-datepicker').datepicker({
			dateFormat: 'yy-mm-dd'
		}).datepicker('option', datepicker_options);
});
});
