function BannerSlider()
{
	// 배너 하나의 크기.
	this.BANNER_WIDTH = 921;
	this.SHOW_DURATION = 1000; 
	this.AUTO_PLAY_TIME = 4000;
	
	// 우리가 움직이게 될 배너 컨텐츠 엘리먼트.
	this.$banner_content=null;
	// 배너 전체 개수.
	this.nBannerLength = 0;
	// 현재 화면에 보이고 있는 배너 인덱스 값.
	this.nCurrentBannerIndex = 0;
	
	// 배너 메뉴의 위치를 표시할 엘리먼트가 담길 변수.
	this.$banner_dots=null;
	
	// 자동실행 타이머 아이디.
	this.autoTImerID=0;
}



// 메뉴 엘리먼트 관련 초기화.
BannerSlider.prototype.initMenu=function(){
	// 배너 컨텐츠 영역의 크기를 동적으로 늘려준다.
	this.$banner_content = $("#banner_content");
	this.nBannerLength = this.$banner_content.children("img").length;
	
	// 배너 컨텐츠의 넓이를 배너 하나의 크기 * 배너 개수의 값으로 설정하기.
	this.$banner_content.width(this.BANNER_WIDTH * this.nBannerLength);
	
	
	// 배너 메뉴의 위치를 표시할 엘리먼트가 담길 변수.
	this.$banner_dots = $("#banner_nav li a");
	// 배너 메뉴의 위치를 0번째로 초기화 시킴.
	this.showBannerDotAt(0);
	
	// autoPlay의 타이머 ID값.
	this.autoTImerID = 0;
}

// 이벤트 처리.
BannerSlider.prototype.initEventListener=function(){
	var objThis = this;
	
	// 이전  배너 보이기
	$("#btn_prev_banner").bind("click", function(){
		objThis.prevBanner();
	});
	// 다음 배너 보이기
	$("#btn_next_banner").bind("click", function(){
		objThis.nextBanner();
	});
	
	// 배너 메뉴에서 마우스 클릭하는 경우, 오버된 위치에 맞게 배너를 보이도록 하기.
	
	this.$banner_dots.bind("click",function(){ //클릭대신 오버 효과로 하려면 "click"을 "mouseenter"로 바꾼다
		var nIndex = objThis.$banner_dots.index(this);
		objThis.showBannerAt(nIndex);
	})
	
	/*
	var $banner_slider = $("div.banner_slider");
	// 배너슬라이더에 마우스 커서가 들어오는 경우 자동실행 기능을 멈춘다.
	$banner_slider.bind("mouseenter",function(){
		objThis.stopAutoPlay();	
	});
	// 배너슬라이더에서 마우스 커서가 밖으로 나가는 경우 다시, 자동실행 기능 시작.
	$banner_slider.bind("mouseleave",function(){
		objThis.startAutoPlay();	
	});
	*/
}
	

// 이전  배너 보이기
BannerSlider.prototype.prevBanner=function(){
	// 이동할 이전 배너 인덱스 값 구하기.
	var nIndex = this.nCurrentBannerIndex-1;
	// 이전 내용이 없는 경우 마지막 배너 인덱스 값으로 설정하기.
	if(nIndex<0)
		nIndex = this.nBannerLength-1;
		
	// n번째 배너 보이기.	
	this.showBannerAt(nIndex);			
}

// 다음 배너 보이기
BannerSlider.prototype.nextBanner=function()
{
	// 이동할 이전 배너 인덱스 값 구하기.
	var nIndex = this.nCurrentBannerIndex+1;
	// 다음 내용이 없는 경우, 첫 번째 배너 인덱스 값으로 설정하기.
	if(nIndex>=this.nBannerLength)
		nIndex = 0;
	
	// n번째 배너 보이기.		
	this.showBannerAt(nIndex);	
}

// nIndex에 해당하는 배너 보이기.
BannerSlider.prototype.showBannerAt=function(nIndex){
	if (nIndex != this.nCurrentBannerIndex) {
		//  n번째 배너 위치 값 구하기.
		var nPosition = -this.BANNER_WIDTH * nIndex;
		
		// 배너 메뉴의 위치 값을 업데이트 시킴.
		this.showBannerDotAt(nIndex);
		
		// 슬라이드 시작.
		this.$banner_content.stop();
		this.$banner_content.animate({
			left: nPosition
		}, this.SHOW_DURATION, "easeOutQuint");
		//현재 배너 인덱스 업데이트 시키기.
		this.nCurrentBannerIndex = nIndex;
	}
}


// 배너 메뉴의 위치값을 업데이트 시킴.
BannerSlider.prototype.showBannerDotAt=function(nIndex){
	this.$banner_dots.eq(this.nCurrentBannerIndex).removeClass("select");
	this.$banner_dots.eq(nIndex).addClass("select");
}




////////////////////////////////////////////////////////
// 자동 실행 시작
BannerSlider.prototype.startAutoPlay=function(){
	
	if(this.autoTimerID!=0)
		clearInterval(this.autoTimerID);
	
	var objThis = this;	
	this.autoTimerID = setInterval(function(){
		objThis.nextBanner();
	},this.AUTO_PLAY_TIME);
}

// 자동실행 멈춤.
BannerSlider.prototype.stopAutoPlay=function(){
	if(this.autoTimerID!=0)
		clearInterval(this.autoTimerID);
		
	this.autoTimerID = 0;
}


