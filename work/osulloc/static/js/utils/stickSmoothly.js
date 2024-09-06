/**
 * stickSmoothly - sticky position element
 * @author: alice@iropke.com
 * dependencies: underscore.js
 */
'use strict';

(function($) {
	var defaults = {
		wrapper: 'sticky-pad',
		container: 'l-wrap',
		top: 0
	};

	$.fn.scrollBottom = function() {
		return $(this).height() + $(this).scrollTop();
	};

	$.fn.stickSmoothly = function(options) {
		// set a reference to element
		var el = this;

		if(el.length == 0) return el;

		// support mutltiple elements
		if(el.length > 1){
			el.each(function() { $(el).stickSmoothly(options) });
			return el;
		}

		var elem = {};
		elem.o = $.extend({}, defaults, options);
		elem.o.top = parseInt($(el).data('top')) || defaults.top;

		var $el = $(el),
				$container = $el.closest('.'+ elem.o.container),
				offsetTopDef;

		offsetTopDef = $el.offset().top - elem.o.top;

		el.on({
			'fixOn': function() {
				$el.removeAttr('style').removeClass('is-locked')
					.addClass('is-fixed-on');
			},
			'static': function() {
				$el.removeClass('is-locked is-fixed-on').removeAttr('style');
			},
			'lock': function() {
				$el.removeClass('is-fixed-on').removeAttr('style')
					.addClass('is-locked');
			}
		});

		var distanceTop = _.bind(function() {
				return this.offset().top - elem.o.top
			}, this),

			enwrap = function(e) {
				0 === e.closest('.' + elem.o.wrapper).length && e.wrap($('<div/>', {
					'class': elem.o.wrapper
				}))
			},

			isOnTop = _.bind(function() {
				return this.hasClass('is-fixed-on')
			}, this),

			scrollTop = 0,
			curScrollTop = 0;

		$(window).on('scroll', _.bind(function() {
			var top, diffTop;
					curScrollTop = $(window).scrollTop();

			if (enwrap(this), this.closest('.' + elem.o.wrapper).css('position') != 'absolute' ) {
				this.trigger('static');

			} else {

				if (enwrap(this), curScrollTop > scrollTop) {
					// scroll down
					// IG.DEV && console.log('scroll down', this.extOffset().top);

				} else {
					// scroll up
					// IG.DEV && console.log('scroll up', this.extOffset().top);

					curScrollTop >= offsetTopDef && curScrollTop < distanceTop() && this.trigger('fixOn'), curScrollTop < offsetTopDef && this.trigger('static');
				}

				if ( curScrollTop > offsetTopDef ) {
					top = elem.o.top;
					this.trigger('fixOn');
					this.css('top', top);
				}

				if (isOnTop() && this.extOffset().bottom > $container.extOffset().bottom) {
					diffTop = $container.extOffset().bottom - (curScrollTop + this.height() + elem.o.top);
					this.css('margin-top', diffTop);
				}
			}

			scrollTop = curScrollTop;

		}, this));

		$(window).on('resize', _.bind(function() {
			offsetTopDef = el.offset().top;
			this.trigger('static');
			$(window).trigger('scroll');
		}, this));

		$(window).scroll();
	};
})(jQuery);
