<?
#-----------------------------------------------------------------------------------
# 기본 상태
#-----------------------------------------------------------------------------------
function MgCommonStatusToString($val) {
    $returnVal = "";

    switch($val) {
        case 'N' : $returnVal = "비활성"; break;
        case 'Y' : $returnVal = "활성";   break;
        default  : $returnVal = "없음";   break;
    }

    return $returnVal;
}


#-----------------------------------------------------------------------------------
# 팝업 상태
#-----------------------------------------------------------------------------------
function MgPopupStatusToString($val) {
    $returnVal = "";

    switch($val) {
        case 'N' : $returnVal = "비활성"; break;
        case 'Y' : $returnVal = "활성";   break;
        default  : $returnVal = "없음";   break;
    }

    return $returnVal;
}


#-----------------------------------------------------------------------------------
# 팝업 상태
#-----------------------------------------------------------------------------------
function MgPopupPTypeToString($val) {
    $returnVal = "";

    switch($val) {
        case 'H' : $returnVal = "HTML형";   break;
        case 'T' : $returnVal = "텍스트형"; break;
        case 'I' : $returnVal = "이미지형"; break;
        case 'L' : $returnVal = "링크형";   break;
        default  : $returnVal = "";         break;
    }

    return $returnVal;
}


#-----------------------------------------------------------------------------------
# 사이트 상태
#-----------------------------------------------------------------------------------
function MgSiteStatusToString($val) {
    $returnVal = "";

    switch($val) {
        case 'N' : $returnVal = "비활성"; break;
        case 'Y' : $returnVal = "활성";   break;
        default  : $returnVal = "없음";   break;
    }

    return $returnVal;
}


#-----------------------------------------------------------------------------------
# 권한을 문자열로
#-----------------------------------------------------------------------------------
function MgLvlToString($val) {
    global $DB_CONNECT, $TBL_LVL;

    $returnVal = "";

    $SQL = "SELECT title FROM {$TBL_LVL} WHERE lvl = '{$val}'";
    $ROW = mysql_fetch_array(mysql_query($SQL, $DB_CONNECT));

    $returnVal = $ROW['title'] ? $ROW['title'] : '없음';

    return $returnVal;
}


#-----------------------------------------------------------------------------------
# 성별을 문자열로
#-----------------------------------------------------------------------------------
function MgSexToString($val) {
    $returnVal = "";

    switch($val) {
        case 'M' : $returnVal = "남자"; break;
        case 'F' : $returnVal = "여자"; break;
        default  : $returnVal = "없음"; break;
    }

    return $returnVal;
}


#-----------------------------------------------------------------------------------
# 메인 화면에 게시판을 출력하는
#-----------------------------------------------------------------------------------
function MgIndexBoard($master_sid, $max_cnt, $title_cut) {
    global $DB_CONNECT, $TBL_MENU, $TBL_BBS, $TBL_BBS_FILE;

    // 게시판을 이용해서 메뉴(grp1, grp2, grp3)를 가져온다.
    $SQL = "SELECT grp1, grp2, grp3, title FROM {$TBL_MENU} WHERE gubun = 'BBS' AND gubun_sid = '{$master_sid}'";
    $RESULT = mysql_query($SQL, $DB_CONNECT);
    if(!$RESULT) { 
        $ERROR = mysql_error(); 
        echo "<script>window.alert(\"$ERROR\");</script>";
        exit; 
    }
    $ROW = mysql_fetch_array($RESULT);
    $grp1       = $ROW['grp1'];
    $grp2       = $ROW['grp2'];
    $grp3       = $ROW['grp3'];
    $menu_title = $ROW['title'];
    
    $SQL = "SELECT sid, title, regdate FROM {$TBL_BBS} WHERE master_sid = '{$master_sid}' AND status = 'Y' ORDER BY sid DESC LIMIT {$max_cnt}";
    $RESULT = mysql_query($SQL, $DB_CONNECT);
    if(!$RESULT) { 
        $ERROR = mysql_error(); 
        echo "<script>window.alert(\"$ERROR\");</script>";
        exit; 
    }
    $LIST = array(); 

    $ListRow = 0;
    while($ROW = mysql_fetch_array($RESULT)) {
        #-----------------------------------------------------------------------------------
        # 업로드 된 파일 정보 -- 갤러리 등에서 사용
        #-----------------------------------------------------------------------------------
        $SQL = "SELECT sid, files FROM {$TBL_BBS_FILE} WHERE bbs_sid = '{$ROW['sid']}' ORDER BY sid ASC LIMIT 3";
        $RESULT2 = mysql_query($SQL, $DB_CONNECT);
        if(!$RESULT2) { 
            $ERROR = str_replace("\r\n", " ", mysql_error()); 
            MgMoveURL("", $ERROR, "", "back");
            exit; 
        }

        $ROW2 = mysql_fetch_array($RESULT2);
        $LIST[] = array(
            'ListRow'    => $ListRow,                                   // 
            'sid'        => $ROW['sid'],                                // 이름
            'file_sid'   => $ROW2['sid'],                               // 이름
            'title'      => MgHanCutString($ROW['title'], $title_cut),  // 이름
            'regdate'    => date("Y-m-d", strtotime($ROW['regdate'])),  // 이름
            'grp1'       => $grp1,                                      // 이름
            'grp2'       => $grp2,                                      // 이름
            'grp3'       => $grp3,                                      // 이름
            'menu_title' => $menu_title,                                // 이름
        );
        $ListRow++;
    }

    for($i=$ListRow; $i<$max_cnt; $i++) {
        $LIST[] = array(
            'ListRow'    => ""  ,  // 
            'sid'        => ""  ,  // 이름
            'title'      => ""  ,  // 이름
            'redate'     => ""  ,  // 이름
        );
    }
    return $LIST;
}


#-----------------------------------------------------------------------------------
# DATEDIFF
#-----------------------------------------------------------------------------------
Function DateDiff($interval, $datefrom, $dateto, $using_timestamps = false) {
/* 
	$interval can be : 
		yyyy - Number of full years
		q	 - Number of full quarters
		m	 - Number of full months
		y	 - Difference between day numbers
		(eg 1st Jan 2004 is "1", the first day. 2nd Feb 2003 is "33". The datediff is "-32".)
		d	 - Number of full days
		w	 - Number of full weekdays
		ww	 - Number of full weeks
		h	 - Number of full hours
		n	 - Number of full minutes
		s	 - Number of full seconds (default)
*/ 

	if (!$using_timestamps) {
		$datefrom = strtotime($datefrom, 0);
		$dateto	  = strtotime($dateto  , 0);
	} 
	// Difference in seconds
	$difference = $dateto - $datefrom;

	switch($interval) { 
		case 'yyyy' :
			$years_difference = floor($difference / 31536000); 
			if (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom), date("j", $datefrom), date("Y", $datefrom)+$years_difference) > $dateto) { 
				$years_difference--; 
			} 
			if (mktime(date("H", $dateto), date("i", $dateto), date("s", $dateto), date("n", $dateto), date("j", $dateto), date("Y", $dateto)-($years_difference+1)) > $datefrom) { 
				$years_difference++; 
			} 

			$datediff = $years_difference;
			break; 

		case "q"  :
			$quarters_difference = floor($difference / 8035200); 
			while (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom)+($quarters_difference*3), date("j", $dateto), date("Y", $datefrom)) < $dateto) { 
				$months_difference++; 
			} 
			$quarters_difference--; 
			
			$datediff = $quarters_difference; 
			break; 

		case "m"  :
			$months_difference = floor($difference / 2678400); 
			while (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom)+($months_difference), date("j", $dateto), date("Y", $datefrom)) < $dateto) { 
				$months_difference++; 
			} 
			$months_difference--; 
			
			$datediff = $months_difference; 
			break; 

		case 'y'  :
			$datediff = date("z", $dateto) - date("z", $datefrom); 
			break; 

		case "d"  :
			$datediff = floor($difference / 86400); 
			break; 

		case "w"  :
			$days_difference = floor($difference  / 86400);
			$week_difference = floor($days_difference / 7);
			
			$first_day = date("w", $datefrom);
			$days_remainder  = floor($days_difference % 7);

			$odd_days = $first_day + $days_remainder;	// Do we have a Saturday or Sunday in the remainder? 
			if ($odd_days > 7) {	// Sunday 
				$days_remainder--; 
			}
			if ($odd_days > 6) {	// Saturday 
				$days_remainder--; 
			}
			
			$datediff  = ($week_difference * 5) + $days_remainder;
			break; 

		case "ww" :
			$datediff = floor($difference / 604800);
			break;

		case "h"  :
			$datediff = floor($difference / 3600);
			break;
 
		case "n"  :
			$datediff = floor($difference / 60);
			break;

		default :
			$datediff = $difference;
			break;
	}
	return $datediff;
}


#-----------------------------------------------------------------------------------
# DateAdd("m", "1", $startTime);
#-----------------------------------------------------------------------------------
Function DateAdd ($interval, $number, $date) {
	$date_time_array = getdate($date);
	$hours		= $date_time_array["hours"];
	$minutes	= $date_time_array["minutes"];
	$seconds	= $date_time_array["seconds"];
	$month		= $date_time_array["mon"];
	$day		= $date_time_array["mday"];
	$year		= $date_time_array["year"];

	switch ($interval) {
		case "yyyy": 
			$year +=$number; 
			break; 

		case "q":
			$year +=($number*3);
			break;

		case "m":
			$month +=$number;
			break;

		case "y":
		case "d":
		case "w":
			$day+=$number;
			break;

		case "ww":
			$day+=($number*7);
			break;

		case "h":
			$hours+=$number;
			break;

		case "n":
			$minutes+=$number;
			break;

		case "s":
			$seconds+=$number;
			break;
	}

	// mktime() 함수를 이용해서 unix timestamp 반환합니다
	$timestamp = mktime($hours ,$minutes, $seconds, $month, $day, $year);

	return $timestamp;
}


#-----------------------------------------------------------------------------------
# AddZeroForSetSize
#-----------------------------------------------------------------------------------
Function AddZeroForSetSize($val){
	$returnVal = "";

	if ($val < 10){
		$returnVal = "0" . $val;
	}else{
		$returnVal = $val;
	}

	return $returnVal;
}


#-----------------------------------------------------------------------------------
# 날짜 변수
#-----------------------------------------------------------------------------------
/*
$time = time();
echo date("Y-m-d", strtotime("now")) . "<br>";
echo date("Y-m-d", strtotime("now"			, $time))." 현재 <br>";
echo date("Y-m-d", strtotime("	 -1 day"	, $time))." 하루 전(어제) <br>";
echo date("Y-m-d", strtotime("	 +1 day"	, $time))." 하루 후(내일) <br>";

echo date("Y-m-d", strtotime("  -1 week"	, $time))." 일주일 전 <br>";
echo date("Y-m-d", strtotime("  +1 week"	, $time))." 일주일 후 <br>";

echo date("Y-m-d", strtotime(" -1 month"	, $time))." 한달 전 <br>";
echo date("Y-m-d", strtotime(" +1 month"	, $time))." 한달 후 <br>";

echo date("Y-m-d", strtotime(" +6 month"	, $time))."  6달후 <br>";
echo date("Y-m-d", strtotime("+12 month"	, $time))." 12달후 <br>";

echo date("Y-m-d", strtotime("next Thursday", $time))." 다음주 목요일 <br>";
echo date("Y-m-d", strtotime("last Monday"	, $time))." 지난 월요일   <br>";

echo date("Y-m-d", strtotime("10 September 2000", $time))." 2000년 9월 10일<br>";
*/


#-----------------------------------------------------------------------------------
# 시각 효과를 높이기 위해 상대적인 그래프 크기를 늘린다
#-----------------------------------------------------------------------------------
function resizingGraph($maxCount, $sumCount){
	$temp = "";

	if ($maxCount == 0 || $sumCount == 0){
		$temp = 0;
	}else {
		$temp = $sumCount / $maxCount;
	}

	return $temp;
}


function right($value, $count){
	$value = substr($value, (strlen($value) - $count), strlen($value));
	return $value;
}


function left($string, $count){
	return substr($string, 0, $count);
}


function php_fn_utf8_to_array($str){ 
	$re_arr = array();    
	$re_icount = 0; 
    
	for ($i=0,$m=strlen($str);$i<$m;$i++){ 
		$ch = sprintf('%08b', ord($str{$i})); 
        if (strpos($ch,'11110')===0){
			$re_arr[$re_icount++]=substr($str,$i,4);$i+=3;
		} else if (strpos($ch,'1110')===0){
			$re_arr[$re_icount++]=substr($str,$i,3);$i+=2;
		} else if (strpos($ch, '110')===0){
			$re_arr[$re_icount++]=substr($str,$i,2);
			$i+=1;
		} else if (strpos($ch,   '0')===0){
			$re_arr[$re_icount++]=substr($str,$i,1);
		} 
    } 
    return $re_arr; 
} 

//utf8문자열을 잘라낸다. 
function php_fn_utf8_substr($str,$start,$length=NULL){ 
	return implode('',array_slice(php_fn_utf8_to_array($str),$start,$length)); 
} 

//utf8문자열의 길이를 구한다. 
function php_fn_utf8_strlen($str){ 
    return count(php_fn_utf8_to_array($str)); 
}

// 쿠폰번호 생성함수
function random_generator(){
	$len = 8;
    $chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

    srand((double)microtime()*1000000);

    $i = 0;
    $str = '';

    while ($i < $len) {
        $num = rand() % strlen($chars);
        $tmp = substr($chars, $num, 1);
        $str .= $tmp;
        $i++;
    }

    $str = preg_replace("/([0-9A-Z]{4})([0-9A-Z]{4})([0-9A-Z]{4})([0-9A-Z]{4})/", "\\1-\\2-\\3-\\4", $str);

    return $str;
}
?>