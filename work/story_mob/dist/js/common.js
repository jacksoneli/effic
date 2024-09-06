; (function (window, document, $) {

  // 전체 공통 탭 메뉴
  $.fn.tabMenus = function (options) {
    var settings = $.extend(true, {}, $.fn.tabMenus.defaults, options);
    var self = this;

    return self.each(function () {
      self.$selector = $(this);
      self.$menu = self.$selector.find('.' + settings.tabMenuClass);
      self.$wrap = self.$selector.find('.' + settings.tabContWrapClass + ':first');
      self.$contents = self.$selector.find('.' + settings.tabContsClass);
      self._eAction = settings.event;

      self._create = function () { // 기본세팅
        $(self.$contents).css('display', 'none');
        self.$menu.attr('role', 'tablist');
        self.$menu.find('> li').each(function () {
          var _this = $(this);
          if (!_this.find('a').length) { return }
          var str = /\#/gi;
          var _anchor = _this.find('a').attr('href');

          _this.attr({
            'id': _anchor.replace(str, 'anchor-'),
            'role': 'tab',
            'tabindex': 0,
            'aria-selected': false,
            'aria-expanded': false
          }).find('a').attr({
            'role': 'presentation',
            'tabindex': -1
          }).addClass('tabs-anchor');
        });
        self.$contents.each(function (i) {
          var _this = $(this);
          _this.attr({
            'role': 'tabpanel',
            'aria-hidden': true,
            'aria-labelledby': self.$menu.find('> li').eq(i).attr('id')
          });
        });

        self._isLocal();
      };

      self._isLocal = function () { //재설정
        var elem;
        if (settings.startItem > 1) {
          elem = self.$menu.find('> li:nth-child(' + settings.startItem + ') ').find('a').attr('href');

          self.$menu.find('.' + settings.activeClass).attr({
            'aria-selected': false,
            'aria-expanded': false
          }).removeClass(settings.activeClass);
          self.$menu.find('> li:nth-child(' + settings.startItem + ') ').attr({
            'tabindex': 0,
            'aria-selected': true,
            'aria-expanded': true
          }).find('a').addClass(settings.activeClass);
          $(elem).css('display', 'block').attr('aria-hidden', false);
        } else {
          elem = self.$menu.find('> li:first').find('a').attr('href');

          self.$menu.find('> li:first').attr({
            'tabindex': 0,
            'aria-selected': true,
            'aria-expanded': true
          }).find('a').addClass(settings.activeClass);
          $(elem).css('display', 'block').attr('aria-hidden', false);
        }

        self.Action();
      };

      self.Action = function () {
        self.$menu.on(self._eAction, 'a', function (e) {
          var _this = $(this);

          if (!_this.hasClass(settings.activeClass)) {
            _this.addClass(settings.activeClass).closest('li').attr({
              'tabindex': 0,
              'aria-selected': true,
              'aria-expanded': true
            }).siblings().attr({
              'tabindex': -1,
              'aria-selected': false,
              'aria-expanded': false
            }).find('.' + settings.activeClass).removeClass(settings.activeClass);
            if ($(_this.attr('href')) !== '#' || $(_this.attr('href')) !== '#none' || $(_this.attr('href')) !== '') {
              $(_this.attr('href')).css('display', 'block').attr('aria-hidden', false).siblings('div' + ('.' + settings.tabContsClass)).css('display', 'none').attr('aria-hidden', true);
            }
          }

          return false;
        });
      };

      self._init = function () {
        if (!self.$menu.length) { return; }
        self._create();
      };


      self._init();
    });
  };
 
  $.fn.tabMenus.defaults = {
    startItem: 1,
    tabMenuClass: 'ui_tabs_menu',
    tabContWrapClass: 'ui_tabs_contents_wrap',
    tabContsClass: 'ui_tab_content',
    activeClass: 'is-current',
    event: 'click'
  };

    
    //라디오 기능
    $(".js_radio > *").click(function(){
        $(this).siblings().removeClass('on');
        $(this).addClass('on');
    });     

    //커스텀 스크롤바
    $(function(){
        $('.js_scroll_bar').overlayScrollbars({});
    })    
    
    //클릭시 class on 토글
    $(document).on("click",".js_toggle_on",function(){    
        $(this).toggleClass('on');
    });     
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})(window, document, jQuery);
//# sourceMappingURL=../../maps/js/common.js.map
