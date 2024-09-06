// @file museum/reservation.js

// require(['ui', 'SmoothScroll', 'datepicker'], function(ui, SmoothScroll, datepicker) {
require(['ui', 'datepicker'], function(ui, SmoothScroll, datepicker) {
	'use strict';

	$(function() {

		var datepicker_options;

		datepicker_options = IG.datepicker_defaults;
		datepicker_options.minDate = '+2';
		datepicker_options.maxDate = '+3m';


		// teaclass intro
		// ----------------------------------------
		IG.DEV && $('.call-datepicker').datepicker({
			onSelect: function(input, inst) {
				console.log('for ui');
				$('#pick-time-selectbox').removeClass('is-disabled');
			}
		});

		$('.call-datepicker').datepicker('option', datepicker_options);

		$('#pick-time-selectbox').find('input').one('change', function(){
			$('#pick-members-selectbox').removeClass('is-disabled');
		});

		// reservation step1
		// ----------------------------------------
		if ( !$('#reservation-step1').length ) return;

		// calender
		var $selected_input = $('#selected-date-input'),
				$selected_span = $('#selected-date-span'),
				$selected_div = $('#selected-date-div');

		// set hidden input
		$selected_input.datepicker('option', datepicker_options);

		// set calendar
		// set date with date from previous page
		IG.DEV && $selected_div.datepicker({
			onSelect: function() {
				$selected_input.datepicker('setDate', $selected_div.datepicker('getDate'));
				putDateToTitle();
			}
		});
		$selected_div.datepicker('option', datepicker_options);
		IG.DEV && $selected_div.datepicker('setDate', '2016.04.14');
		putDateToTitle();

		// opened select
		$('.select-list').on('keydown', function(event){
			if ( event.keyCode == 13 ) event.preventDefault();
		});

		function putDateToTitle() {
			$selected_span.text( $.datepicker.formatDate( 'yy.mm.dd', $selected_div.datepicker('getDate') ) );
		}

	});
});
