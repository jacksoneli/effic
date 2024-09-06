require(['$'], function() {
	$(function() {
		
		$(document).on('click', 'a', function() {
		    c_function( $(this));
		});
		$(document).on('click', 'button', function() {
		    c_function( $(this));
		});
		$(document).on('click', '#fileuploader', function() {
		    c_function( $(this));
		});
		function c_function ( $e ) {
		    var name = $e.data('track-name');
		    var event = $e.data('event-name');
		    var purchase = $e.data('is-purchase');
		    var item = $e.data('item-name');
		    var s.events;
		    if (event) {
		    	s.events=" + event + ";
		    }
		    if (name) {
		        trackClicksEx(name, true);
		        return true;
		    }
		    if (item && purchase) {
		    	trackPurchaseClick(item,event);
		    	return true;
		    }
		}
	});
});
