// @file guide/memory.js

require(['ui', 'slick', 'SmoothScroll'], function(ui, slick) {
    'use strict';

    $(function(){

        var $header = $('.guide-header'),
            $headerContainer = $('.memory-header-container'),
            $headerContent = $('.memory-header-content'),
            $headerDim = $('.memory-header-dim'),
            $headerBG = $('.memory-header-bg'),
            $headerText = $('.guide-header-cell'),
            $copy = $('.memory-copy'),
            $products = $('.memory-products'),
            $main = $('.memory-main'),
            $bg = $('.memory-bg'),
            $sections = $('.memory-sections'),
            $section = $('.memory-section');

        if (  !$main.length ) return;

        function showProducts() {
            if($products.hasClass('.is-showed')) {
                return;
            }

            $products.addClass('.is-showed');

            TweenMax.fromTo($products, 0.8, {
                autoAlpha: 0,
                yPercent: 50,
                ease: Power4.easeOut
            }, {
                autoAlpha: 1,
                yPercent: 0,
                delay: 0.3
            });
        }

        // IE 구버전에서 가상 선택자에 background-image 속성이 제대로 작동하지 않는 문제 해결
        if(document.documentMode < 9) {
            $section.find('.desc').each(function(i, el) {
                var $el = $(el);

                $el.addClass('.is-old-ie');
                $el.prepend('<span class="desc-bg"></span>');
            });
        }
        switchLayout('memory', function() {
            return $header.css('z-index') == '2';
        }, function(state) {
            console.log('--------------- FUNCTION SWITCH LAYOUT ---------------');
            console.log($header.css('z-index') + ' :::::::: HEADER ');
            console.log($('.memory-product').css('z-index') + ' :::::::: MEMORY ');
            console.log(state + ' :::::::: STATE');

            /**
             * 스크롤 이벤트 핸들링
             */
            function onScroll() {
                var winScrollTopLim;

                winScrollTop = IG.$win.scrollTop();
                winScrollTopLim = Math.min(250, winScrollTop) / 250;

                // 스크롤에 따라 header가 어두워지게
                $headerDim.css('opacity', winScrollTopLim * 0.4);
                TweenMax.set($headerText, { scale: 1 - winScrollTopLim * 0.2 });
                $copy.css('opacity', winScrollTopLim);
                // $headerBG.css('top', winScrollTop);

                setDescPosition();
            }

            /**
             * 설명 레이어 위치 조정
             */
            function setDescPosition() {
                if((mainStartPos - winScrollTop + (bgHeight / 2)) > winHalf) { // 진입 전
                    $sections.css({
                        position: 'absolute',
                        top: bgHeight / 2
                    });
                } else if((mainStartPos + mainHeight - winScrollTop - (bgHeight / 2)) < winHalf) { // 탈출 후
                    $sections.css({
                        position: 'absolute',
                        top: bgHeight * ($bg.length - 0.5)
                    });
                } else { // 보여지고 있을 때
                    $sections.css({
                        position: '',
                        top: ''
                    });
                }

                // 스크롤 위치에 따라 현재 섹션 찾기
                $bg.each(function(i, el) {
                    var $el = $(el);

                    if($el.offset().top - winScrollTop + bgHeight > winHalf) {
                        currentSection = i;
                        return false;
                    } else if(i + 1 === $bg.length) {
                        currentSection = i;
                    }
                });

                // 섹션 변경 시 이벤트 실행
                if(prevSection != currentSection) {
                    changeSection();
                    prevSection = currentSection;
                }
            }

            /**
             * 새로운 색션 보이기
             */
            function changeSection() {
                var isInit = $sections.hasClass('is-initialized'),
                    direction = prevSection < currentSection,
                    $prev = $section.eq(prevSection),
                    $current = $section.eq(currentSection);

                if(!isInit) {
                    $section.removeAttr('style');
                    $section.not(':eq(' + currentSection + ')').hide();
                    $sections.addClass('is-initialized');

                    return;
                }

                // 기존 항목 가리기
                TweenMax.to($prev, 1, {
                    autoAlpha: 0
                });

                // 새 항목 보이기
                TweenMax.killTweensOf($current);
                TweenMax.fromTo($current, 1, {
                    zIndex: ++descIndex,
                    yPercent: 100 * (direction ? 1 : -1),
                    display: 'block',
                    autoAlpha: 1
                }, {
                    ease: Power3.easeOut,
                    yPercent: 0
                });
            }

            // DECORATOR BOX SET
            if (state) {
                // 고해상도에서 설정된 동작 모두 해제
                IG.$win.off('.memory-section');

                // 고해상도에서 설정한 이벤트가 해제 직후에도 잠시동안 작동하는 문제가 있어 지연실행
                setTimeout(function() {
                    $headerContainer.removeAttr('style');

                    $headerDim.css('opacity', '');
                    TweenMax.set($headerText, { clearProps: 'scale' });

                    TweenMax.killChildTweensOf($sections);
                    $sections.removeAttr('style').removeClass('is-initialized');
                    $section.removeAttr('style');
                }, 1);

                $products.on('init', showProducts).slick({
                    infinite: true,
                    arrows: false,
                    dots: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                });
            } else {
                var prevSection,
                    currentSection = 0,
                    winHalf,
                    winScrollTop,
                    mainStartPos,
                    mainHeight,
                    bgHeight,
                    descWidth,
                    descHeight,
                    descIndex = 1;

                IG.$win.on('scroll.memory-section', onScroll);
                IG.$win.on('resize.memory-section', function() {
                    var headerContainerHeight,
                        headerContentHeight = $headerContent.height(),
                        headerBtmDiff,
                        productsPadBtm = parseInt($products.css('padding-bottom'));

                    headerContainerHeight = $headerContainer.height();
                    headerBtmDiff = headerContainerHeight - headerContentHeight;

                    winHalf = IG.$win.height() / 2;
                    mainStartPos = $main.offset().top;
                    bgHeight = $bg.height();
                    mainHeight = bgHeight * $bg.length;
                    descWidth = $section.width();
                    descHeight = $sections.height();

                    onScroll();
                }).resize();

                
                // 저해상도에서 설정된 슬라이더 해제
                if($products.hasClass('slick-slider')) {
                    $products.slick('unslick');
                }
                showProducts();
            }
        });
    });
});
