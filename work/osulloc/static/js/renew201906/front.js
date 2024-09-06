$(function(){
    /***********************공통기능***********************/
    //커스텀 셀렉트박스
    $('.js_select').on('click',function(){
        $(this).find('.tit').toggleClass('on');
        $(this).find('ul').toggle();
    });
    $('.js_select li').on('click',function(){
        var name = $(this).find('.name').text();
        $(this).parent().siblings('.tit').text(name);
    });    
    
    //라디오기능
    $(document).on("click", ".js_radio > *", function () {
        $(this).siblings().removeClass('on');
        $(this).addClass('on');
    });    

    //말줄임표 처리
    $(".js_dotdotdot").dotdotdot();
    $(window).resize(function () {
        $(".js_dotdotdot").dotdotdot();
    });
    $('body').on('click', function () {//클릭시 동적으로 생성되는 html에도 적용하기 위해
        $(".js_dotdotdot").dotdotdot();
    });
    setTimeout(function() { $('.js_dotdotdot').dotdotdot() }, 200)
    
    //img map 반응형
    $('img[usemap]').rwdImageMaps();
    
 
    /***********************메인페이지 컨텐츠***********************/
    //PC 대배너
    $(".slider").slick({
      infinite: true,
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 200,
      slidesToShow: 1,
      slidesToScroll: 1,
    });

    var percentTime;
    var tick;
    var time = 1;
    var progressBarIndex = 0;

    $('.progressBarContainer .progressBar').each(function(index) {
        var progress = "<div class='inProgress inProgress" + index + "'></div>";
        $(this).html(progress);
    });

    function startProgressbar() {
        resetProgressbar();
        percentTime = 0;
        tick = setInterval(interval, 10);
    }

    function interval() {
        if (($('.slider .slick-track div[data-slick-index="' + progressBarIndex + '"]').attr("aria-hidden")) === "true") {
            progressBarIndex = $('.slider .slick-track div[aria-hidden="false"]').data("slickIndex");
            startProgressbar();
        } else {
            percentTime += 1 / (time + 3); //배너 머무는 시간(현재 3초)
            $('.inProgress' + progressBarIndex).css({
                width: percentTime + "%"
            });
            $('.inProgress' + progressBarIndex).parent().addClass('on');
            
            if (percentTime >= 100) {
                $('.single-item').slick('slickNext');
                progressBarIndex++;
                if (progressBarIndex > 4) { //슬라이더 개수-1
                    progressBarIndex = 0;
                }
                startProgressbar();
                $('.inProgress').parent().removeClass('on');
            }
        }
    }

    function resetProgressbar() {
        $('.inProgress').css({
            width: 0 + '%'
        });
        clearInterval(tick);
    }
    startProgressbar();

    $('.progressBarContainer div').click(function () {
    	clearInterval(tick);
    	var goToThisIndex = $(this).find("span").data("slickIndex");
    	$('.single-item').slick('slickGoTo', goToThisIndex, false);
    	startProgressbar();
    });    
    
    $('.js_pause').click(function(){
        clearInterval(tick);
        $(this).hide();
        $('.js_play').show();
    })
    $('.js_play').click(function(){
        startProgressbar();
        $(this).hide();
        $('.js_pause').show();
    })
    
    //모바일 대배너
    var swiper8 = new Swiper('.swiper-container8', {
         pagination: {
             el: '.swiper-pagination',
             type: 'fraction',
         },
         autoplay: {
             delay: 3000,
             disableOnInteraction: false,
         },
    });
    
    $('.js_m_play').click(function(){
        swiper8.autoplay.start();
        
        $(this).hide();
        $('.js_m_pause').show();
    })
    $('.js_m_pause').click(function(){
        swiper8.autoplay.stop();    
        
        $(this).hide();
        $('.js_m_play').show();
    })
    
    //PC Weekly Best
    var swiper2 = new Swiper('.swiper-container2', {
        spaceBetween: 50,
        slidesPerView: 1,
        speed : 100,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },    
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false,
        },
    });
    
    //모바일 Weekly Best
    var swiper3 = new Swiper('.swiper-container3', {
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 21,
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false,
        },
    });
    
    //PC 다다상점
    var swiper4 = new Swiper('.swiper-container4', {
        slidesPerView: 1,
        speed : 100,
        spaceBetween: 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },    
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false,
        },
    });
    
    //모바일 다다상점
    var swiper5 = new Swiper('.swiper-container5', {
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 5,
    });
    
    //모바일 티매니아
    var swiper6 = new Swiper('.swiper-container6', {
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 9,
    });
    
    //모바일 팔로우
    var swiper7 = new Swiper('.swiper-container7', {
        slidesPerView: 'auto',
        freeMode: true,
    });
    
    
    /***********************헤더***********************/
    //모바일 gnb
    var swiper1 = new Swiper('.swiper-container1', {
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 0
    });
    
    //검색영역 열고 닫기
    $(document).on("click",".js_search",function(){    
        $('#js_search_area').show();
    });     
    
    $(document).on("click",".js_hide_search",function(){    
        $('#js_search_area').hide();
    });     

    
    //검색 영역 외의 영역 클릭시 검색영역 닫기
    function myDiv() {
      var obj = document.getElementById('js_search_area'),
        e = window.event || arguments.callee.caller.arguments[0],
        eobj = e.target ? e.target : e.srcElement;
      while (eobj.parentNode) {
        if (eobj == obj) {
          return false;
        }
        eobj = eobj.parentNode;
      }
      close_layer();
    }

    function Init() {
      document.body.onclick = function () {
        myDiv();
      }
    }

    function close_layer() {
      var obj = document.getElementById('js_search_area');
      obj.style.display = 'none';
    }

    if (window.addEventListener) {
      window.addEventListener('load', Init, false);
    } else if (window.attachEvent) {
      window.attachEvent('onload', Init);
    }

    if (window.addEventListener) {
      document.getElementById('close').addEventListener('click', close_layer, false);
    } else if (window.attachEvent) {
      document.getElementById('close').attachEvent('click', close_layer);
    }    

});

	