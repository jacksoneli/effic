// 비주얼 효과
$.fn.visual_effect = function(){
	var obj = this;
	var img = obj.find(".imgs li");
	var other = obj.find(".other p");
	var page = obj.find(".paging li");
	var total = img.length;
	var old = 0;
	var cur = 1;
	var delay = 5000;
	var pos1 = new Array(123, 123);
	var pos2 = new Array(276, 276);
	var tid;
	function startFade(){
		if(old){
			img.eq(old-1).stop().fadeOut(2000);
			img.eq(old-1).find("p").not(".logo").stop().animate({"opacity":0}, {"duration":1000});
		}
		img.eq(cur-1).stop().fadeIn(2000);
		setTimeout(function(){ img.eq(cur-1).find(".txt1").css("top", pos1[cur-1]+50).stop().animate({"opacity":1, "top":pos1[cur-1]}, {"duration":700}); }, 500);
		setTimeout(function(){ img.eq(cur-1).find(".txt2").css("top", pos2[cur-1]+50).stop().animate({"opacity":1, "top":pos2[cur-1]}, {"duration":700}); }, 800);
		page.removeClass("on").eq(cur-1).addClass("on");
	}
	function autoFade(){
		old = cur;
		if(cur == total) cur = 1;
		else cur++;
		startFade();
	}
	function startTimer(){
		tid = setInterval(autoFade, delay);
	}
	function stopTimer(){
		clearInterval(tid);
	}
	function init(){
		other.on("mouseover", stopTimer).on("mouseout", startTimer).on("click", function(){
			var idx = $(this).index();
			if(idx) autoFade();
			else{
				old = cur;
				if(cur == 1) cur = total;
				else cur--;
				startFade();
			}
		});
		page.on("mouseover", stopTimer).on("mouseout", startTimer).on("click", function(){
			var idx = $(this).index() + 1;
			if(cur != idx){
				old = cur;
				cur = idx;
				startFade();
			}
		});
		startFade();
		startTimer();
	}
	init();
}

$(function(){
	$("#visual").visual_effect();
});