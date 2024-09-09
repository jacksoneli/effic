
$(function () {

  // 메인페이지 hero의 ticker
  $('.js_ticker_01').slick({
    pauseOnFocus: false,
    pauseOnHover: false,
    arrows: false,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 5000,
    cssEase: 'linear',
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        speed: 2000,
      }
    }]
  });

  // 메인페이지 About us의 하단 ticker
  $('.js_ticker_02').slick({
    pauseOnFocus: false,
    pauseOnHover: false,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 2000,
    cssEase: 'linear',
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 2.5,
        speed: 1500,
      }
    }]
  });

  //메인페이지의 우측하단 contact 버튼이 화면을 따라다니도록
  $('.contact_btn').each(function(){
    let $btn = $('.contact_btn');
    let windowHeight = window.innerHeight;
    let contact_top = $btn.offset().top;

    window.addEventListener('scroll', function(){
      let scrollValue = $(document).scrollTop();
      let start_point = contact_top - windowHeight + 260;

      if(scrollValue > start_point){
        $btn.addClass('js_fixed');
      }else{
        $btn.removeClass('js_fixed');
      }
    });
  })

  //모달 팝업 열고 닫기
  $(document).on("click",".js_open_modal",function(){
    let this_class = $(this).attr('open_pop_class');
    $('.' + this_class).show();
    $('.modal_wrap').show();
    $('.dim').show();
    $('body').addClass('freeze');
  });

  $(document).on("click",".dim, .js_close_pop",function(){
    $('.modal_wrap article').hide();
    $('.modal_wrap').hide();
    $('.dim').hide();
    $('body').removeClass('freeze');
  });

  //review 페이지의 슬라이더
  $('.js_slider_01').slick({
    pauseOnFocus: false,
    pauseOnHover: false,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: $('.prev'),
    nextArrow: $('.next')
  });

});
