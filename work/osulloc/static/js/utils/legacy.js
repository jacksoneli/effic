// utils/legacy.js
// fallback scripts for ie8

'use strict';

define(['utils'], function() {


	function init() {

		if (!getCookie('legacy-msg')) {
			$('#legacy-browser').show();
		}else{
			$('#legacy-browser').hide();
		}

		legacyBrowser();
		IG.$sn.remove();

		$('input[placeholder], textarea[placeholder]').placeholder();

		$('.icon-label').not('.icon-point').each(function(){
			var bg_url,
					bg_img = $(this).css('background-image');

	    // ^ Either "none" or url("...urlhere..")
	    bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg_img);
	    bg_url = bg_url ? bg_url[2] : ""; // If matched, retrieve url, otherwise ""

			$('<img src="'+ bg_url +'" alt="">').appendTo($(this));
			$(this).removeClass();
			$(this).addClass('icon-label');
		});

		$('.membership .shape').each(function(){
			var bg_url,
					alt = $(this).text(),
					bg_img = $(this).css('background-image');

	    // ^ Either "none" or url("...urlhere..")
	    bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg_img);
	    bg_url = bg_url ? bg_url[2] : ""; // If matched, retrieve url, otherwise ""

	    $(this)
	    	.empty()
	    	.css('background-image', 'none')
	    	.append('<img src="'+ bg_url +'" alt="'+ alt +'">');
		});

		$('.mark-bt').each(function(){
			var bg_url,
					alt = $(this).text(),
					bg_img = $(this).css('background-image');

	    // ^ Either "none" or url("...urlhere..")
	    bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg_img);
	    bg_url = bg_url ? bg_url[2] : ""; // If matched, retrieve url, otherwise ""

	    $(this)
	    	.empty()
	    	.css('background-image', 'none')
	    	.append('<img src="'+ bg_url +'" alt="'+ alt +'">');
		});
	}

	/**
	 * Legacy broswer update massage
	 */
	function legacyBrowser() {
		$('#close-browser-guide').on('click', function() {
			if($('#legacy-check').is(':checked')) {
				setCookie('legacy-msg', true, 1);
			}
			var $btn = $(this);

			TweenMax.to($btn, 0.1, {
				autoAlpha: 0,
				onComplete: function() {
					$btn.remove();
				}
			});

			TweenMax.to('#legacy-browser', 0.3, {
				height: 0,
				ease: Power1.easeInOut,
				delay: 0.1,
				onComplete: function() {
					$('#legacy-browser').remove();
				}
			});
		})
	}

	function pseudoCheckedIE8(el) {
		var $el = $(el);

		if ( !$el.find('input').prop('checked') ) {
			if ($el.find('input').is(':radio')) {
				$('[name='+$el.find('input').attr('name')+']').not($el).attr('checked', false);
			}
			$el.find('input').attr('checked', 'checked').prop('checked', true);

		} else {
			$el.find('input').attr('checked', false).prop('checked', false);
		}
	}

	function setCookie(name, value, days){
        var expire = new Date();
        expire.setDate(expire.getDate() + days);
        cookies = name + '=' + encodeURI(value) + '; path=/ ';
        if(typeof days != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
        document.cookie = cookies;
    }

    function getCookie(name) {
        name = name + '=';
        var cookieData = document.cookie;
        var start = cookieData.indexOf(name);
        var value = '';
        if(start != -1){
            start += name.length;
            var end = cookieData.indexOf(';', start);
            if(end == -1)end = cookieData.length;
            value = cookieData.substring(start, end);
        }
        return decodeURI(value);
    }

    return {
		init: init
	};
});
