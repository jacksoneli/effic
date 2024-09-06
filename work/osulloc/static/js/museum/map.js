// @file museum/map.js

require(['ui', 'modal'], function() {
	'use strict';

	$(function() {
		// modal popup
		$.modal.defaults = {
		  escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
		  clickClose: true,       // Allows the user to close the modal by clicking the overlay
		  closeText: '닫기',     // Text content for the close <a> tag.
		  closeClass: '',         // Add additional class(es) to the close <a> tag.
		  showClose: true,        // Shows a (X) icon/link in the top-right corner
		  modalClass: 'modal-map',
		  // spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
		  showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
		 fadeDuration: 250,     // Number of milliseconds the fade transition takes (null means no transition)
		  fadeDelay: 0.1          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
		};

		var $mapLink = $('.spot-link'),
			$mapIcon = $('.osl-map-a');

		eachHover($mapLink, $mapIcon);
		eachHover($mapIcon, $mapLink);

		$('.osl-map-pad').addClass('is-clickable');

		function eachHover($trigger, $target) {
			$trigger.each(function(i, el){
				var $this = $(el),
					lastCnt = $trigger.length - 1;

				$this.on('mouseenter mouseleave focus blur' , function() {
					$this.toggleClass('is-active');
					$target.eq(i).toggleClass('is-active');

					if ( i == lastCnt ) {
						$target.eq(i + 1).toggleClass('is-active');
					}
				});
			});
		}
	});
});
