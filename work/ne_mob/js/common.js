$(function(){
	$(".btn_top").click(function() {
		$('body,html').stop().animate({scrollTop: 0 }, 300);
	})
	
	$("aside .menuList .oneDepth").click(function() {
		if($(this).hasClass("on")) {
			$(this).removeClass("on");
		}else {
			$("aside .menuList .oneDepth").removeClass("on");
			$(this).addClass("on");
		}
	})
	
	
	$('.btn_menu2, .menuClose').click(function(){
		$("aside.right").toggleClass('VIEW')
		$('body,html').stop().animate({scrollTop: 0 }, 300);
	});

	$('.btn_menu, .menuClose2').click(function(){
		$("aside.left").toggleClass('VIEW')
		$('body,html').stop().animate({scrollTop: 0 }, 300);
	});

	$('.navi_box .navi_box_1 li').click(function(){
		$(".navi_box .navi_box_1 li").removeClass('on')
		$(this).addClass("on");
		$(".navi_box .navi_box_3 ul").hide();
		$(".navi_box .navi_box_3 ul").eq($(this).index()).show();
	});

	$(".btn_top").click(function() {
		$('body,html').stop().animate({scrollTop: 0 }, 300);
	});

	$('.sub_menu.sub_menu2 span').click(function(){
		$(".sub_menu.sub_menu2 span").removeClass('on')
		$(this).addClass("on");
		$(".sub_menu_sub").hide();
	});

	$('.sub_menu.sub_menu2 span.first').click(function(){
		$(".sub_menu_sub").show();
	});

	$('.sub_box3 .btn span.close ').click(function(){
		$(".sub_box3").hide();
	});

	$('.step_m span').click(function(){
		$(".step_m span").removeClass('on')
		$(this).addClass("on");
		$(".step_con .step_con_1").hide();
		$(".step_con .step_con_1").eq($(this).index()).show();
	});

	$('.sub_menu_sub a').click(function(){
		$(".sub_menu_sub a").removeClass('on')
		$(this).addClass("on");
	});

	$('.sub_menu_sub a.btn1').click(function(){
		$(".sub_con_view").show();
		$(".sub_box3").show();
		$(".sub_box4").hide();
		$(".sub_box5").hide();
		$(".class_table_style1 tbody tr td a.play").show();
		$(".class_table_style1 tbody tr td a.down").hide();
	});

	$('.sub_menu_sub a.btn2').click(function(){
		$(".sub_con_view").show();
		$(".sub_box3").hide();
		$(".sub_box4").show();
		$(".sub_box5").hide();
		$(".class_table_style1 tbody tr td a.play").hide();
		$(".class_table_style1 tbody tr td a.down").show();
	});

	$('.sub_menu_sub a.btn3').click(function(){
		$(".sub_con_view").hide();
		$(".sub_box3").hide();
		$(".sub_box4").hide();
		$(".sub_box5").show();
		$(".sub_box6_view").hide();
		$(".sub_box7_1").show();
		$(".sub_box7_2").hide();
	});

	$('.sub_menu_sub a.btn4').click(function(){
		$(".sub_con_view").hide();
		$(".sub_box3").hide();
		$(".sub_box4").hide();
		$(".sub_box5").show();
		$(".sub_box6_view").show();
		$(".sub_box7_1").hide();
		$(".sub_box7_2").show();
	});

	$('.btn_zoom').click(function(){
		$(".search_hide").show();
		$(".btn_write").css({"margin-top" : "-10px"});
	});

	$('.pay_policy h1').click(function(){
		$(".pay_policy").toggleClass("on");
	});

	$('.payment_box4 span').click(function(){
		$(".payment_box4 span").removeClass("on");
		$(this).addClass("on");
	});

	$('.pop_close').click(function(){
		$(".pop").fadeOut();
		$(".black").fadeOut();
	});

	$('.btn_pop_coupon').click(function(){
		$(".pop").fadeIn();
		$(".black").fadeIn();
	});

	$(".class_list_top span").click(function(){
		$(".class_list_top").toggleClass("on");
		$(".class_list").slideToggle();
	});

	
	
});


$(window).load(function() {	
		
});

$(window).scroll(function() {	

	
	
});


$(window).resize(function() {
	
});