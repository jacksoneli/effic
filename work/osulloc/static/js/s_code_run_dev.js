
require(['$'] , function(){
/* 각 사이트 공통파일 안에 아래 내용 삽입
<!-- SiteCatalyst code -->
<%
	//개발기와 운영기에서 사용하는 s_code파일을 달리한다
	String scodePath = "";
	
	if (request.getLocalAddr().equals("220.64.86.41")) 
		scodePath = "http://dev.amorepacific.com/resources/js/s_code.dev.js";
	else
		scodePath = "http://www.amorepacific.com/resources/js/s_code.js";
%>
<script language="JavaScript" type="text/javascript" src="http://dev.amorepacific.com/resources/js/s_code.js"></script>
<script language="JavaScript" type="text/javascript">
<!--
	s.pageName = "";
//-->
</script>
<script language="JavaScript" type="text/javascript" src="http://dev.amorepacific.com/resources/js/s_code_run.js"></script>
<!-- End SiteCatalyst code -->
*/

//if (s.pageName.trim().length == 0 ){
 
if (s.pageName){
	if (s.pageName.replace(/ /gi, '').length == 0 ){ //trim
		 s.pageName = null;
	}
	else{
		s.pageName = getSiteName() + ((s.pageName.indexOf('^')==0)?'':'^') + s.pageName;
	}
	//byte size check
	if( stringByteSize(s.pageName) > 100 ){
		s.pageName = byteSubstring(s.pageName) + "~@";
	}

  //alert(s.pageName);
} 


function byteSubstring(str){
	if (str == null || str.length == 0) {
		return 0;
	}
	var size = 0;
    var i = 0;
	for (i = 0; i < str.length; i++) {
		size += charByteSize(str.charAt(i));
        if( size > 98 ) break;
	}
    str = str.substring(0,i);
	return str;
}

function charByteSize(ch) {
	if (ch == null || ch.length == 0) {
		return 0;
	}
	var charCode = ch.charCodeAt(0);
	if (charCode <= 0x00007F) {
		return 1;
	} else if (charCode <= 0x0007FF) {
		return 2;
	} else if (charCode <= 0x00FFFF) {
		return 3;
	} else {
		return 4;
	}
}
//ex) stringByteSize(str)
function stringByteSize(str) {
	if (str == null || str.length == 0) {
		return 0;
	}
	var size = 0;
	for (var i = 0; i < str.length; i++) {
		size += charByteSize(str.charAt(i));
	}
	return size;
}


//다음의 사이트들만 디버깅
// 2013.04.10 사이트 추가 var debugSites = 'sulwhasoo-en,laneige-kr,mamonde-kr,hera-kr,illi-kr,sulwhasoo-hk,primera-kr,apbrand-kr,lolita-kr,hanyul-kr';
//var debugSites = 'sulwhasoo-en,laneige-kr,mamonde-kr,hera-kr,illi-kr,sulwhasoo-hk,primera-kr,apbrand-kr,lolita-kr,hanyul-kr,iope-kr,sulwhasoo-kr,sulwhasoo-cn,mjsen-kr,laneige-en,amorepacific-kr,amorepacific-en,amorepacific-jp';
var debugSites = 
'sulwhasoo-en,mamonde-kr,hera-kr,illi-kr,sulwhasoo-hk,primera-kr,apbrand-kr,lolita-kr,hanyul-kr,iope-kr,sulwhasoo-kr,sulwhasoo-cn,mjsen-kr,laneige-en,amorepacific-kr,amorepacific-en,amorepacific-cosmetics-kr, amorepacific-cosmetics-jp, illi-kr, osulloc-kr, apmall';

if (debugSites.indexOf(getSiteName()) > -1) debugging = true;

//alert(debugging);

//디버깅 출력
if(debugging == true){
	debug(getSiteName());
	debug(getAccount());	
	debug(document.location.pathname);
	debug('s.pageName : ' + s.pageName);
	debug('_TRK_CP : ' + getVar('_TRK_CP'));
	
	//window.open("","dp_debugger","width=600,height=600,location=0,menubar=0,status=1,toolbar=0,resizable=1,scrollbars=1").document.write("<script language=\"JavaScript\" id=dbg src=\"http://www.digitalpulse.omniture.com/dp/debugger.js\"></"+"script>");


	// 디버깅 스크립트 시작
	function trackClicksExPrint() {
		try{
			var ClickName = arguments[0];
			var Clickevents = 'event5';
			var WithPageName = arguments[1];
			
			//두번째 입력값이 내부클릭수이면 Clickevents에 그 입력값을 넣고 페이지명포함여부는 세번째입력값으로 대체;
			if (arguments[1] && arguments[1].toString().indexOf('event') >= 0){
				Clickevents = arguments[1];
				WithPageName = arguments[2];
			}
			
			if (WithPageName == undefined) WithPageName = false;
			
			if (WithPageName == true)
				ClickName = s.pageName + '^' + ClickName;
			else
				ClickName = getSiteName() + '^' + ClickName;
			
			return 'ClickName : ' + ClickName + '\nClickevents : ' + Clickevents + '\nWithPageName : ' + WithPageName;
		}catch(e){debug(e.message);}
	}

	function getTrackClicksResult(func){
		var f = func.indexOf('trackClicksEx');
		if (f >= 0){
			var l = func.indexOf(');', f);
			func = func.substring(f,l+2);
			debug(func);
			func = func.replace('trackClicksEx', 'trackClicksExPrint');
			//debug(eval(func));
			return eval(func);
		} 
	}

	if (debugging){
		$(function () {
			try{
				/*
				$('a[onclick]').mouseenter(function () { 
					$(this).attr('title', getTrackClicksResult($(this).attr('onClick')));
				});
				$('a[onMouseDown]').mouseenter(function () {
					$(this).attr('title', getTrackClicksResult($(this).attr('onMouseDown')));
				});
				*/
				$('[title]').removeAttr('title');
				$('a[onclick]').attr('title', function () {return getTrackClicksResult($(this).attr('onClick'));});
				$('a[onmousedown]').attr('title', function () {return getTrackClicksResult($(this).attr('onMouseDown'));});
				$('area[onclick]').attr('title', function () {return getTrackClicksResult($(this).attr('onClick'));});
				$('area[onmousedown]').attr('title', function () {return getTrackClicksResult($(this).attr('onMouseDown'));});
			}catch(e){}
		});
	}
	// 디버깅 스크립트 끝
	
} 

var s_code=s.t();if(s_code)document.write(s_code);
});