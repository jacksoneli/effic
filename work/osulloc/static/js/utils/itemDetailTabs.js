// @file utils/itemDetailTabs.js
// item detail tabs

'use strict';

define(['ui'], function(){

  function init(n) {
    switchLayout('rwd_detail_tabs', function() {
        var is_tabs = $('#detail-tabs').is(':visible');
        return is_tabs;

      }, function(state) {

        if ( state ) {

          $('#detail-tabs').simpleTab({
              activeClass: 'is-current',
              scroll: true,
              scrollOffset: -50,
              defaultTab: n
            });

        } else {
          //
          $('#product-content').show();
          $('#product-review').show();
          $('#purchasing-info').show();
        }

      });
  }

  return {
    init: init
  };

});
