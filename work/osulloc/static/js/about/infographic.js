// @file about/infographic.js

require(['ui', 'SmoothScroll'], function() {
  'use strict';

  $(function() {
    var is_legacy = !Modernizr.opacity;

    TweenMax.to('main', 0.5, {
      autoAlpha: 1,
      clearProps: "all",
      onComplete: function() {
        $('main').removeClass('main--about');
      }
    });

    var $igBox = $('.infographic');

    if ( !$igBox.length ) return;

    brickAnimation();

    function brickAnimation() {
      var $igFrame = $igBox.find('.infographic-frame'),
        $anchors = $igBox.find('.infographic-a'),
        $igBrick = $igBox.find('.infographic-brick'),
        $igDetail = $igBox.find('.infographic-details'),
        $igCell = $igDetail.find('.infographic-cell'),
        $igClose = $igBox.find('.infographic-btn'),
        $icons = $igBox.find('.icon'),
        $scrollMe = $('.infographic-icon'),
        twDur = 0.2,
        twDel = 0.1;

      init();

      $igBrick.each(function(i, el){
        var $el = $(el),
          $elAnchor = $el.find('.infographic-a'),
          $elSiblings = $el.siblings('.infographic-brick'),
          $elSiblingsThmb = $elSiblings.find('.infographic-thumb'),
          $elDetatil =  $igCell.eq(i),
          $elDetatilBG = $elDetatil.find('.infographic-bg img'),
          $elDetatilTt = $elDetatil.find('.infographic-title');

        $el.on({
          mouseenter: function() {
            TweenMax.killTweensOf($elSiblingsThmb);
            if ( is_legacy ) {
              TweenMax.set( $elSiblingsThmb, { visibility: 'hidden' });
            } else {
              TweenMax.to( $elSiblingsThmb, twDur, {
                autoAlpha: 0
              });
            }

            TweenMax.fromTo( $elDetatilBG , twDur*20, {
              z: 300
            },{
              z: 0
            });

            $el.addClass('on');
            $elSiblings.addClass('off');
            $elDetatil.addClass('is-hover');
          },
          mouseleave : function() {
            if ( is_legacy ) {
              TweenMax.set( $elSiblingsThmb, { visibility: 'visible' });
            } else {
              TweenMax.to( $elSiblingsThmb, twDur, {
                autoAlpha: 1
              });
            }

            $el.removeClass('on');
            $elSiblings.removeClass('off');
            $elDetatil.removeClass('is-hover');
          }
        });

        $elAnchor.on('click', function(event){
          event.preventDefault();
          event.stopPropagation();

          introDetail($elDetatil, $elDetatilTt);
          preventHover(event) ;
        });
      });



      function introDetail($elDetatil, $elDetatilTt) {
        if ( is_legacy ) {
          // fix Win7/IE8 invisible icon issue
          if ( !$elDetatil.data('fontello-setup') ) {
            $elDetatil.find('.icon').addClass('fix-icon');
            TweenMax.delayedCall( 0.1, function(){
              $elDetatil.find('.icon').removeClass('fix-icon');
            });
            $elDetatil.data('fontello-setup', true);
          }

          TweenMax.set($igBrick, { visibility: 'hidden' });
          TweenMax.set($anchors, {
            borderWidth: 0,
            padding: 10
          });
          TweenMax.set( $elDetatilTt , { visibility: 'visible' });
          TweenMax.set( $scrollMe, { visibility: 'hidden' });
          $igDetail.addClass('is-extend');

        } else {
          TweenMax.staggerTo($igBrick, twDur*2, {
            autoAlpha: 0
          }, 0.05);
          TweenMax.staggerTo($anchors, twDur*2, {
            borderWidth: '0px',
            padding: '10px'
          }, 0.05);
          TweenMax.fromTo( $elDetatilTt , twDur*8, {
            autoAlpha: 0
          },{
            autoAlpha: 1,
            delay: twDel*4
          });
          TweenMax.to( $scrollMe , twDur, {
            autoAlpha: 0
          });
          TweenMax.delayedCall( twDel*10, function(){
            $igDetail.addClass('is-extend');
          });
        }

        IG.$body.addClass('infographic-fixed');
        $elDetatil.addClass('is-active');
      }

      function outroDetail() {
        if ( is_legacy ) {
          TweenMax.set($igBrick, { visibility: 'visible' });
          TweenMax.set($scrollMe , { visibility: 'visible' });
          TweenMax.set($anchors, {
            borderWidth: 10,
            padding: 0
          });
        } else {
          TweenMax.set($igBrick, { autoAlpha: 1 });
          TweenMax.to($scrollMe , twDur, { autoAlpha: 1 });
          TweenMax.to($anchors, twDur*4, {
            borderWidth: '10px',
            padding: '0px'
          });
        }

        IG.$body.removeClass('infographic-fixed');
        $igDetail.removeClass('is-extend');
        $igCell.removeClass('is-active');
      }

      function preventHover() {
        !is_legacy && TweenMax.to($igBox, twDur*5, {
          className: '+=is-expand',
          onComplete: function() {
            $igBox.removeClass('is-expand');
          }
        });
      }

      function init() {
        var head, style;

        if ( is_legacy ) {
          TweenMax.set( $igBrick, { visibility: 'visible' });
          TweenMax.set( $('.infographic-title'), { visibility: 'hidden' });

          // fix Win7/IE8 invisible icon issue
          $anchors.find('.icon').addClass('fix-icon');
          TweenMax.delayedCall( 0.1, function(){
            $anchors.find('.icon').removeClass('fix-icon');
          });
        } else {
          TweenMax.set( $igBrick, { autoAlpha: 1 });
          TweenMax.set( $('.infographic-title'), { autoAlpha: 0 });
        }

        TweenMax.set( $anchors, { borderWidth: '10px', padding: '0px'});

        $igClose.on('click', outroDetail);

        if ( $igBox.height() > 1 || $igBrick.length < 10) return;
        // 마우스 스크롤로 행 이동
        var igBrickLength = $igBox.find('.infographic-brick').length/3,
            igGrid = 100/igBrickLength,
            frameTween0, frameTween1;

            igGrid = (is_legacy) ?  -1 * $igBrick.outerHeight() : '-' + igGrid + '%';
            frameTween0 = (is_legacy) ? {marginTop: 0} : {y: '0%'};
            frameTween1 = (is_legacy) ? {marginTop: igGrid} : {y: igGrid};

        $igFrame.on('DOMMouseScroll mousewheel', function(event){
          var delatValue = event.originalEvent.wheelDelta/180 || (event.originalEvent.detail*-1)/180;

          event.preventDefault();
          event.stopPropagation();

          if (delatValue > 0) {
            TweenMax.to( $igFrame,  0.3, frameTween0);
          } else {
            TweenMax.to( $igFrame,  0.3, frameTween1);
          }
        });
      }
    }
  });
});
