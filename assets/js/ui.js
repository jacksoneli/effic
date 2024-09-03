
$(function () {

  //미디어쿼리
  if(matchMedia("screen and (max-width:767px)").matches){
    $('.whoel_wrap').addClass('mobile');
  }else{
    $('.whoel_wrap').removeClass('mobile');
  }
  $(window).resize(function() {
    if(matchMedia("screen and (max-width:767px)").matches){
      $('.whoel_wrap').addClass('mobile');
    }else{
      $('.whoel_wrap').removeClass('mobile');
    }
  });

  // 메인페이지 hero의 ticker
  $('.js_ticker').slick({
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

  //모달 팝업
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









});
