<?
#-----------------------------------------------------------------------------------
# 페이지 이동 함수(액션이후 처리)
#-----------------------------------------------------------------------------------
function MgMoveURL($url='', $msg='', $target='', $action='', $charset='utf-8') {
	$script="";

	if ($msg) {
		$script.="alert('$msg');";
	}

	if ($url) {
		if ($target) {
			$script.="{$target}.location.href = '$url';";
			$target = "";
		}else {
			$script.="location.href = '$url';";
		}
	}

	switch ($action) {
		case 'back'  :
			$script.="history.back();";
			break;

		case 'close' :
			$script.="self.close();";
			break;

		case 'refresh' :
			if ($target)
				$script.="$target.Action_Refresh();";
			else
				$script.="Action_Refresh();";
			break;

		case 'refresh,close' :
			if ($target)
				$script.="$target.Action_Refresh();self.close();";
			else
				$script.="Action_Refresh();self.close();";
			break;
	}

	echo "
		<HTML><HEAD>
		<META HTTP-EQUIV=Content-Type CONTENT=text/html;charset=$charset>
		<SCRIPT LANGUAGE=JavaScript>
		<!--
		$script
		//-->
		</SCRIPT></html>
	";
}


#-----------------------------------------------------------------------------------
# 페이지 이동 함수(액션이후 처리) 
#-----------------------------------------------------------------------------------
function MgSubmitURL() {
	$numargs = func_num_args();

	// 인자가 5 이하면 정상이 아니다.
	if($numargs <= 5) return;

	$args = func_get_args();
	$url     = $args[0];
	$action  = $args[1];
	$target  = $args[2];
	$msg     = $args[3];
	$charset = $args[4];

	$data = "
		<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">
		<html xmlns=\"http://www.w3.org/1999/xhtml\">
		<head>
		<meta http-equiv=\"Content-Type\" content=\"text/html; charset={$charset}\" />
		<title>이동</title>
		<body>
			<form method=\"post\" name=\"form1\" action=\"{$url}{$action}\" target=\"{$target}\">
	";

	for($i=5; $i<func_num_args(); $i++) {
		$arg_exp = explode("=", $args[$i]);

		$data .= "
			<input type=\"hidden\" name=\"{$arg_exp[0]}\" value=\"{$arg_exp[1]}\">
		";
	}

	$data .= "
			</form><script>
	";

	if ($msg) {
		$data .= "
				alert(\"{$msg}\");
		";
	}

	$data .= "
				document.form1.submit();
			</script>
		</body>
		</html>
	";

	echo $data;
}


#-----------------------------------------------------------------------------------
# 파일 용량을 바이트 단위로
#-----------------------------------------------------------------------------------
function MgGetByte($size) {
	if ($size < 1024)
		return ($size."B");
	else if ( $size >= 1024 and $size < 1024*1024 )
		return sprintf("%0.1fKB",$size/1024);
	else
		return sprintf("%0.1fMB",$size/(1024*1024));
}


#-----------------------------------------------------------------------------------
# 시간 읽어오기
#-----------------------------------------------------------------------------------
function MgGetTime($writedate) {
	$date = str_replace(" ",":",$writedate);
	$date = str_replace("/",":",$date);

	$date = split(":",$date);

	$result = mktime() - mktime($date[3],$date[4],$date[5],$date[1],$date[2],$date[0]);

	return $result;
}


#-----------------------------------------------------------------------------------
# 메일 보내기 함수
#-----------------------------------------------------------------------------------
function MgSendMail($fromaddress, $fromname, $toaddress, $toname, $subject, $body, $headers) {
	$fp = popen( '/usr/sbin/sendmail -t -i -froot@127.0.0.1', "w");
	if(!$fp) return false;

	if($to_name) { fputs($fp, "To: $toname <$toaddress>\n"); }
	else { fputs($fp, "To: $toaddress\n"); }

	fputs($fp, "From: $fromname <$fromaddress>\n");
	fputs($fp, "Subject: $subject\n");
	fputs($fp, $headers."\n\n");
	fputs($fp, $body);
	fputs($fp, "\n");
	pclose($fp);
	return true;
}


#-----------------------------------------------------------------------------------
# 글자단위로 구분자 넣기
#-----------------------------------------------------------------------------------
function MgExplodeString($str, $sap) {
	for ($i=0;$i<strlen($str);$i++) {
		if(ord($str[$i])<=127) {
			$tmp.= $str[$i].$sap;
		} else {
			$tmp.=$str[$i].$str[++$i].$sap;
		}
	}

	return substr($tmp, 0, strlen($tmp)-1);
}


#-----------------------------------------------------------------------------------
# 파일 삭제
#     리턴값 : true | false
#     인자   : 파일 패스
#-----------------------------------------------------------------------------------
function MgDeleteFile($file_path) {
	@chmod($file_path, 0777);

	$retValue = @unlink($file_path);
	if (file_exists($file_path)) {
		@chmod($file_path,0775);
		$retValue = @unlink($file_path);
	}

	return $retValue;
}


#-----------------------------------------------------------------------------------
# 파일업로드 함수 
#     리턴값 : object [status, filename, errmsg] // 상태, 파일명, 에러메시지
#     인자1  : 업로드 임시 파일명
#     인자2  : 업로드 파일명
#     인자3  : 업로드 패스
#     인자4  : 덮어쓰기 여부 (true, false)
#-----------------------------------------------------------------------------------
function MgUploadFile($filetmpname, $filename, $path, $update = false) {
	clearstatcache(); //캐시를 삭제 한다

	$ext  = array_pop(explode(".", $filename)); //파일의 확장자

	$temp = @mysql_fetch_object(mysql_query("SELECT status, filename, errmsg"));
	$temp->status = false;

	if(!is_uploaded_file($filetmpname)) // POST 방식이 아닌 방법으로 파일을 업로드 하는 경우
		$temp->errmsg = "파일 전송 형식이 올바르지 않습니다. 정상적인 방법을 이용하여 Upload 하십시오.<br>";
	else if(count(explode(".", $filename)) <= 1) // 업로드 된 파일의 확장자가 없거나 파일 확장자만 있는 경우
		$temp->errmsg = "{$filename} 파일은 Upload할 수 없는 파일입니다. ( 파일 확장자 또는 파일명이 존재하지 않습니다.)";
	else if(eregi(",$ext", ",php,php3,inc,html,htm,js,phtml,asp,pl,jsp,shtm,ztx,dot,cgi"))
		$temp->errmsg = "{$filename} 파일은 Upload할 수 없는 파일입니다. ( 파일 확장자 또는 파일명이 존재하지 않습니다.)";

	if ($temp->errmsg) {
		MgDeleteFile($filetmpname);
		return $temp;
	}

	$filefullname = $path.$filename;

	if(!$update) {
		// 동일한 파일명이 있는 지 확인한다.
		$count = 0;
		if(file_exists($filefullname)) {
			$count++;

			if (eregi("_{$count}", $filename)) {
				while(eregi("_{$count}", $filename)) {
					$filename = eregi_replace("_([0-9]+)", "_{$count}", $filename);
				}
			} else {
				$explode  = explode('.',$filename);
				$filename = $explode[0]."_1.".$explode[1];
			}
		}
		$filefullname = $path.$filename;
	}

	// 업로드된 파일을 이동한다.
	$done = move_uploaded_file($filetmpname, $filefullname);

	if (!$done) {
		$temp->errmsg = "{$file[name]} 파일 전송에 실패하였습니다.";
	} else {
		$temp->status   = true;
		$temp->filename = $filename;
	}

	MgDeleteFile($filetmpname);
	@chmod($filefullname, 0644);

	return $temp;
}


#-----------------------------------------------------------------------------------
# 파일 작성 함수 
#-----------------------------------------------------------------------------------
function MgSetFile($file_path, $filedata) {
	$fp = @fopen($file_path, 'w');
	if(!$fp) MgMoveURL("","파일을 생성할 폴더의 권한을 확인해 주세요.","back","");
	@flock($fp, 2);
	@fwrite($fp, $filedata . "\n");
	@flock($fp, 3);
	@fclose($fp);
}


#-----------------------------------------------------------------------------------
# 로그 파일에 데이터 쓰기
#-----------------------------------------------------------------------------------
function MgWriteLog($file_path, $filedata) {
	$fp = @fopen($file_path, 'a+');
//	if(!$fp) MgMoveURL("","{$file_path} 파일을 생성할 폴더의 권한을 확인해 주세요.","","");
	@flock($fp, 2);
	$filedata = stripslashes($filedata);
	@fwrite($fp, $filedata . "\n");
	@flock($fp, 3);
	@fclose($fp);
}


#-----------------------------------------------------------------------------------
# 해당 레벨 체크
#-----------------------------------------------------------------------------------
function MgCheckLevel($strMemLevel, $strLevels) {
	$strLevel = explode("|", $strLevels);

	$retValue = false;
	foreach($strLevel as $forLevel) {
		if($strMemLevel==trim($forLevel)) {
			$retValue = true;
			break;
		}
	}
	return $retValue;
}


#-----------------------------------------------------------------------------------
# 해당 레벨 체크
#-----------------------------------------------------------------------------------
function MgCheckDataSap($strMemLevel, $strLevels, $strSap) {
	$strLevel = explode($strSap, $strLevels);

	$retValue = false;
	foreach($strLevel as $forLevel) {
		if($strMemLevel==trim($forLevel)) {
			$retValue = true;
			break;
		}
	}
	return $retValue;
}


#-----------------------------------------------------------------------------------
# 폴더 삭제 // 하위까지 모두
#-----------------------------------------------------------------------------------
function MgRmdir($dirName) {
	if (empty($dirName)) 
		return true;

	if (file_exists($dirName)) {
		$dir = dir($dirName);
		while($file = $dir->read()) {
			if (!($file=='.'||$file=='..')) {
				if (is_dir($dirName.'/'.$file)) {
					MgRmdir($dirName.'/'.$file);
				}else {
					@unlink($dirName.'/'.$file) or die('File '.$dirName.'/'.$file.' couldn\'t be deleted!');
				}
			}
		}
		$dir->close();
		@rmdir($dirName) or die('Folder '.$dirName.' couldn\'t be deleted!');
	}else {
	return false;
	}
	return true;
} 


#-----------------------------------------------------------------------------------
# 넘어오는 데이터에 대한 SQL INJECTION 및 데이터 변환 및 데이터 크기 자르기
#-----------------------------------------------------------------------------------
function MgRequestCheck($data, $cnt, $sql_check=true, $tag_check=true) {
	if($sql_check) $data = MgSQLDeny($data);
	if($tag_check) $data = MgRemoveEvilTags($data);
	$returnVal = MgHanCutString($data, $cnt, false);
	return $returnVal;
}


#-----------------------------------------------------------------------------------
# DB에 처리하기 위해서 SQL Injection 을 처리한다.
#-----------------------------------------------------------------------------------
function MgSQLDeny($data) {
	$data = str_replace("'", "&#039;", $data);
	$returnVal = preg_replace("( select| union| insert| update| delete| drop|\/\*|\*\/|\\\)", "", $data); 
	return $returnVal;
}


#-----------------------------------------------------------------------------------
# 자료 등록시 필요없는 태그 삭제하기
#-----------------------------------------------------------------------------------
function MgRemoveEvilTags($data) {
	// 허용할 테그
	$allowedTags = '<b><i><br>';

	// 제거할 속성
	$stripAttrib = 'javascript:|onclick|ondblclick|onmousedown|onmouseup|onmouseover|';
	$stripAttrib = $stripAttrib . 'onmousemove|onmouseout|onkeypress|onkeydown|onkeyup|';
	$stripAttrib = $stripAttrib . 'onchange|onblur|onfocus|';
	$stripAttrib = $stripAttrib . 'h1|a|ul|ol|li|hr|img|font|span|table|tr|td|p|script';

	$str = preg_replace("/<(\/?)(?![\/a-z])([^>]*)>/i", "&lt;\\1\\2\\3&gt;", $data);
//	$str = strip_tags($str, $allowedTags);

	return $str; //preg_replace("/<(.*)($stripAttrib)+([^>]*)>/i", "<\\1xx\\2xx\\3>", $data);
}


#-----------------------------------------------------------------------------------
# DB 에 등록이 가능하게 
#-----------------------------------------------------------------------------------
function MgEncoding($Data) {
	if (!$Data) 
		$retValue = "";
	else
		$retValue = str_replace("'", "''", $Data);

	return $retValue;
}


#-----------------------------------------------------------------------------------
# DB 에서 가져오기
#-----------------------------------------------------------------------------------
function MgDecoding($Data) {
	if (!$Data) 
		$retValue = "";
	else
		$retValue = str_replace("''", "'", $Data);

	return $retValue;
}


#-----------------------------------------------------------------------------------
# 한글 짜르기 
#-----------------------------------------------------------------------------------
function MgHanCutString($str, $length=20, $isTail=true) {
	/* euc-kr 경우
	if (strlen($str) <= $length) return $str;

	for($i = 0; $i < $length; $i++)
		if(ord($str[$i]) > 127)
			$i++;

//	$str = chop(substr($str, 0, $length - $over % 2)) . "...";
	$str = substr($str, 0, $i) . "...";

	return $str;
	*/

	/* utf-8 경우     */
	$checkmb = true;
	$tail = $isTail ? "..." : "";

	preg_match_all('/[\xEA-\xED][\x80-\xFF]{2}|./', $str, $match); 
	$m    = $match[0]; 
	$slen = strlen($str);	// length of source string 
	$tlen = strlen($tail);	// length of tail string 
	$mlen = count($m);		// length of matched characters 

	if ($slen <= $length) return $str; 
	if (!$checkmb && $mlen <= $length) return $str;

	$ret   = array(); 
	$count = 0; 

	for ($i=0; $i < $length; $i++) { 
		$count += ($checkmb && strlen($m[$i]) > 1)?2:1; 
		if ($count + $tlen > $length) break; 
		$ret[] = $m[$i]; 
	} 
//	return join('', $ret).$tail;
	return mb_substr($str, 0, $length, "UTF-8") . ($isTail ? '...' : ''); 
}


#-----------------------------------------------------------------------------------
# 일반적인 경우 페이징을 한다. Action_GoPage 를 이용한 이동
#-----------------------------------------------------------------------------------
function MgPaging(){
	global $ListRow, $TotalPage, $Page, $StartPage, $EndPage, $PageCount;
	global $PAGING_IMG_PREV1, $PAGING_IMG_PREV2, $PAGING_IMG_PREV3;
	global $PAGING_IMG_NEXT1, $PAGING_IMG_NEXT2, $PAGING_IMG_NEXT3;

	$retValue = "";

	if ($ListRow == 0){
	} else {
		if ($Page > 1)
			$retValue .= "<a href='javascript:Action_GoPage(" . ($Page - 1) . ");' class='bt_prv'><img src='images/sub/prev.jpg' border='0' align='' alt='이전' /></a> ";
		else
			$retValue .= "<img src='images/sub/prev.jpg' border='0' align='absmiddle' alt='이전' /> ";

		for ($i=$StartPage; $i<=$EndPage; $i++){
			if ($i==$Page)
				$retValue .= "<a href='javascript:Action_GoPage({$i});' class='page_active'>{$i}</a>";
			else
				$retValue .= "<a href='javascript:Action_GoPage({$i});'>{$i}</a>";

			if ($i!=$EndPage) 
				$retValue .= "&nbsp;";
	}

	if ($Page < $TotalPage) 
		$retValue .= " <a href='javascript:Action_GoPage(" . ($Page + 1) . ");' class='bt_nxt'><img src='images/sub/next.jpg' border='0' align='' alt='다음' /></a>";
	else
		$retValue .= " <img src='images/sub/next.jpg' border='0' align='absmiddle' alt='다음' />";
	}
	return $retValue;
}

function MgPaging1(){
	global $ListRow, $TotalPage, $Page, $StartPage, $EndPage, $PageCount;
	global $PAGING_IMG_PREV1, $PAGING_IMG_PREV2, $PAGING_IMG_PREV3;
	global $PAGING_IMG_NEXT1, $PAGING_IMG_NEXT2, $PAGING_IMG_NEXT3;

	$retValue = "";

	if ($ListRow == 0){
	} else {
		if ($Page > 1)
			$retValue .= "<a href='javascript:Action_GoPage(" . ($Page - 1) . ");' class='bt_prv'><img src='images/prev.jpg' border='0' align='' alt='이전' /></a> ";
		else
			$retValue .= "<img src='images/prev.jpg' border='0' align='' alt='이전' /> ";

		for ($i=$StartPage; $i<=$EndPage; $i++){
			if ($i==$Page)
				$retValue .= "<span>{$i}</span>";
			else
				$retValue .= "<a href='javascript:Action_GoPage({$i});'>{$i}</a>";

			if ($i!=$EndPage) 
				$retValue .= "&nbsp;";
	}

	if ($Page < $TotalPage) 
		$retValue .= " <a href='javascript:Action_GoPage(" . ($Page + 1) . ");' class='bt_nxt'><img src='images/next.jpg' border='0' align='' alt='다음' /></a>";
	else
		$retValue .= " <img src='images/next.jpg' border='0' align='' alt='다음' />";
	}
	return $retValue;
}


#-----------------------------------------------------------------------------------
# 일반적인 경우 페이징을 한다. Action_GoPage 를 이용한 이동
#-----------------------------------------------------------------------------------
function MgPagingBBS() {
	global $ListRow, $TotalPage, $Page, $StartPage, $EndPage, $PageCount;
	global $PAGING_IMG_PREV1, $PAGING_IMG_PREV2, $PAGING_IMG_PREV3;
	global $PAGING_IMG_NEXT1, $PAGING_IMG_NEXT2, $PAGING_IMG_NEXT3;

	$retValue = "";

	if ($ListRow == 0) {
	//	$retValue = " <b>- 등록된 자료가 없습니다. -</b> ";
	}else {

/*
	// 맨처음
	if ($Page != 1)
		$retValue .= " <a href='javascript:Action_GoPage(1);'><img src='/img/button_prev1.gif' border=0 align=absmiddle></a> ";
	else
		$retValue .= " <font color='gray'><img src='/img/button_prev1.gif' border=0 align=absmiddle></font> ";
*/

	// 단위앞으로
	if ($StartPage - $PageCount > 1) 
		$retValue .= " <a href='javascript:Action_GoPage(" . ($StartPage - $PageCount) . ");'>" . "<img src='/admin/img/btn/btn_page_a.gif' align='absmiddle'>" . "</a> ";
	else
		$retValue .= " " . "<img src='/admin/img/bt_prev2.png' align='absmiddle'>" . " ";

	// 앞으로
	if ($Page > 1)
		$retValue .= " <a href='javascript:Action_GoPage(" . ($Page - 1) . ");'>" . "<img src='/admin/img/btn/btn_page_prev.gif' align='absmiddle' alt='이전 10개'>" . "</a> ";
	else
		$retValue .= " " . "<img src='/admin/img/bt_prev.png' align='absmiddle' alt='이전 10개'>" . " ";

	for($i=$StartPage; $i<=$EndPage; $i++) {
		if ($i==$Page)
			$retValue .= " <font size=2 color= red><b>{$i}</b></font> ";
		else
			$retValue .= " <a href='javascript:Action_GoPage({$i});' onFocus='blur()'>{$i}</a> ";

		if ($i!=$EndPage) 
			$retValue .= " <font color='#EEEEEE'><b>|</b></font> ";
	}

	// 뒤로
	if ($Page < $TotalPage) 
		$retValue .= " <a href='javascript:Action_GoPage(" . ($Page + 1) . ");'>" . "<img src='/admin/img/btn/btn_page_next.gif' align='absmiddle' border=0 alt='10개'>" . "</a> ";
	else
		$retValue .= " " . "<img src='/admin/img/bt_next.png' align='absmiddle' border=0 alt='10개'>" . " ";

	// 단위뒤로
	if ($TotalPage > $EndPage) 
		$retValue .= " <a href='javascript:Action_GoPage(" . ($EndPage + 1) . ");'>" . "<img src='/admin/img/btn/btn_page_z.gif' align='absmiddle'>" . "</a> ";
	else
		$retValue .= " " . "<img src='/admin/img/bt_next2.png' align='absmiddle'>" . " ";

/*
	// 맨나중
	if ($Page != $TotalPage) 
		$retValue .= " <a href='javascript:Action_GoPage({$TotalPage});'><img src='/img/button_next2.gif' border=0 align=absmiddle></a> ";
	else
		$retValue .= " <font color='gray'><img src='/img/button_next2.gif' border=0 align=absmiddle></font> ";
*/
	}
	return $retValue;
}


#-----------------------------------------------------------------------------------
# 일반적인 경우 페이징을 한다. Action_GoPage 를 이용한 이동
#-----------------------------------------------------------------------------------
function MgPagingBoard() {
	global $ListRow, $TotalPage, $Page, $StartPage, $EndPage, $PageCount;
	global $PAGING_IMG_PREV1, $PAGING_IMG_PREV2, $PAGING_IMG_PREV3;
	global $PAGING_IMG_NEXT1, $PAGING_IMG_NEXT2, $PAGING_IMG_NEXT3;

	$retValue = "";

	if ($ListRow == 0) {
	//	$retValue = " <b>- 등록된 자료가 없습니다. -</b> ";
	}else {

/*
	// 맨처음
	if ($Page != 1)
		$retValue .= " <a href='javascript:Action_GoPage(1);'><img src='/img/button_prev1.gif' border=0 align=absmiddle></a> ";
	else
		$retValue .= " <font color='gray'><img src='/img/button_prev1.gif' border=0 align=absmiddle></font> ";


	// 단위앞으로
	if ($StartPage - $PageCount > 1) 
		$retValue .= " <a href='javascript:Action_GoPage(" . ($StartPage - $PageCount) . ");'>" . "<img src='/admin/img/btn/btn_page_a.gif' align='absmiddle'>" . "</a> ";
	else
		$retValue .= " " . "<img src='/admin/img/bt_prev2.png' align='absmiddle'>" . " ";
*/
	// 앞으로
	if ($Page > 1)
		$retValue .= " <a href='javascript:Action_GoPage(" . ($Page - 1) . ");'>" . "<img src='../img/bt_prev.png' align='absmiddle' border=0 alt='이전 10개'>" . "</a> ";
	else
		$retValue .= " " . "<img src='../img/bt_prev.png' align='absmiddle' border=0 alt='이전 10개'>" . " ";

	for($i=$StartPage; $i<=$EndPage; $i++) {
		if ($i==$Page)
			$retValue .= " <font size=2 color= red><b>{$i}</b></font> ";
		else
			$retValue .= " <a href='javascript:Action_GoPage({$i});' onFocus='blur()'>{$i}</a> ";

		if ($i!=$EndPage) 
			$retValue .= " <font color='#EEEEEE'><b>|</b></font> ";
	}

	// 뒤로
	if ($Page < $TotalPage) 
		$retValue .= " <a href='javascript:Action_GoPage(" . ($Page + 1) . ");'>" . "<img src='../img/bt_next.png' align='absmiddle' border=0 alt='다음 10개'>" . "</a> ";
	else
		$retValue .= " " . "<img src='../img/bt_next.png' align='absmiddle' border=0 alt='다음 10개'>" . " ";

	// 단위뒤로
/*	if ($TotalPage > $EndPage) 
		$retValue .= " <a href='javascript:Action_GoPage(" . ($EndPage + 1) . ");'>" . "<img src='/admin/img/btn/btn_page_z.gif' align='absmiddle'>" . "</a> ";
	else
		$retValue .= " " . "<img src='/admin/img/bt_next2.png' align='absmiddle'>" . " ";


	// 맨나중
	if ($Page != $TotalPage) 
		$retValue .= " <a href='javascript:Action_GoPage({$TotalPage});'><img src='/img/button_next2.gif' border=0 align=absmiddle></a> ";
	else
		$retValue .= " <font color='gray'><img src='/img/button_next2.gif' border=0 align=absmiddle></font> ";
*/
	}
	return $retValue;
}


#-----------------------------------------------------------------------------------
# 일반적인 경우 페이징을 한다. Action_GoPage 를 이용한 이동
#-----------------------------------------------------------------------------------
function MgPagingNew($isPrev1, $isPrev2, $isNext2, $isNext3) {
	global $ListRow, $TotalPage, $Page, $StartPage, $EndPage, $PageCount;
	global $PAGING_IMG_PREV1, $PAGING_IMG_PREV2, $PAGING_IMG_PREV3;
	global $PAGING_IMG_NEXT1, $PAGING_IMG_NEXT2, $PAGING_IMG_NEXT3;

	if($ListRow == 0) return null;

	$page_list = array();

	// 맨처음
	if ($isPrev1) {
		if ($Page != 1)
			$page_list[] = array('type' => 'prev1' , 'page' => '1');
		else
			$page_list[] = array('type' => 'prev1' , 'page' => '');
	}

	// 단위앞으로
	if ($isPrev2) {
		if ($StartPage - $PageCount > 1)
			$page_list[] = array('type' => 'prev2' , 'page' => $StartPage - $PageCount);
		else
			$page_list[] = array('type' => 'prev2' , 'page' => '');
	}

	// 앞으로
	if ($Page > 1) 
		$page_list[] = array('type' => 'prev3' , 'page' => $Page - 1);
	else
		$page_list[] = array('type' => 'prev3' , 'page' => '');

	// 페이지 반복
	for($i=$StartPage; $i<=$EndPage; $i++) {
		if ($i==$Page)
			$page_list[] = array('type' => 'page' , 'page' => $i , 'curr' => true);
		else
			$page_list[] = array('type' => 'page' , 'page' => $i , 'curr' => false);
	}

	// 뒤로
	if ($Page < $TotalPage) 
		$page_list[] = array('type' => 'next1' , 'page' => $Page + 1);
	else
		$page_list[] = array('type' => 'next1' , 'page' => '');

	// 단위뒤로
	if ($isNext2) {
		if ($TotalPage > $EndPage) 
			$page_list[] = array('type' => 'next2' , 'page' => $EndPage + 1);
		else
			$page_list[] = array('type' => 'next2' , 'page' => '');
	}

	// 맨나중
	if ($isNext3) {
		if ($Page != $TotalPage) 
			$page_list[] = array('type' => 'next3' , 'page' => $TotalPage);
		else
			$page_list[] = array('type' => 'next3' , 'page' => '');
	}
	return $page_list;
}


#-----------------------------------------------------------------------------------
# 해당 권한이 존재하는지 검사
#-----------------------------------------------------------------------------------
function MgFindLvls($lvls, $act, $lvl) {
	$returnVal = false;

	$lvls_exp1 = explode(",", $lvls);
	foreach($lvls_exp1 as $key1 => $val1) {
		$lvls_exp2 = explode(":", $val1);
		if ($lvls_exp2[0]==$act) {
			$lvls_exp3 = explode("|", $lvls_exp2[1]);
			foreach($lvls_exp3 as $key3 => $val3) {
				if($val3==$lvl) $returnVal = true;
			}
		}
	}
    return $returnVal;
}


#-----------------------------------------------------------------------------------
# INI FILE 관련
#-----------------------------------------------------------------------------------
function MgReadINI($filename, $commentchar=';') {
	$array1  = file($filename);
	$section = '';

    foreach ($array1 as $filedata) {
		$dataline  = trim($filedata);
		$firstchar = substr($dataline, 0, 1);

		if ($firstchar!=$commentchar && $dataline!='') {
			//It's an entry (not a comment and not a blank line)
			if ($firstchar == '[' && substr($dataline, -1, 1) == ']') {
				//It's a section
				$section = strtolower(substr($dataline, 1, -1));
			}else {
				//It's a key...
				$delimiter = strpos($dataline, '=');
				if ($delimiter > 0) {
					//...with a value
					$key   = strtolower(trim(substr($dataline, 0, $delimiter)));
					$value = trim(substr($dataline, $delimiter + 1));

					if (substr($value, 1, 1) == '"' && substr($value, -1, 1) == '"') { $value = substr($value, 1, -1); }
					$array2[$section][$key] = stripcslashes($value);
				}else {
					//...without a value
					$array2[$section][strtolower(trim($dataline))]='';
				}
			}
		}else {
			//It's a comment or blank line.  Ignore.
		}
	}
	return $array2;
}


function MgWriteINI ($filename, $array1, $commentchar=';', $commenttext='') {
	$handle = fopen($filename, 'wb');

	if ($commenttext!='') {
		$comtext = $commentchar.
			str_replace($commentchar, "\r\n".$commentchar,
				str_replace ("\r", $commentchar,
					str_replace("\n", $commentchar,
						str_replace("\n\r", $commentchar,
							str_replace("\r\n", $commentchar, $commenttext)
						)
					)
				)
			);

		if (substr($comtext, -1, 1)==$commentchar && substr($comtext, -1, 1)!=$commentchar) {
			$comtext = substr($comtext, 0, -1);
		}
		fwrite ($handle, $comtext."\r\n");
	}

	foreach ($array1 as $sections => $items) {
		//Write the section
		if (isset($section)) { fwrite ($handle, "\r\n"); }

		//$section = ucfirst(preg_replace('/[\0-\37]|[\177-\377]/', "-", $sections));
		$section = ucfirst(preg_replace('/[\0-\37]|\177/', "-", $sections));
		fwrite ($handle, "[".$section."]\r\n");
		foreach ($items as $keys => $values) {
			//Write the key/value pairs
			//$key = ucfirst(preg_replace('/[\0-\37]|=|[\177-\377]/', "-", $keys));
			$key = ucfirst(preg_replace('/[\0-\37]|=|\177/', "-", $keys));
			if (substr($key, 0, 1)==$commentchar) { $key = '-'.substr($key, 1); }
			$value = ucfirst(addcslashes($values,''));
			fwrite ($handle, '    '.$key.' = '.$value."\r\n");
		}
	}
	fclose($handle);
}


#-----------------------------------------------------------------------------------
# 이미지 크기 조절
#-----------------------------------------------------------------------------------
function MgResizeImage($file_src, $max_w = 350, $max_h = 250) {
	$size   = getimagesize("$file_src");
	$height = $size[1];
	$width  = $size[0];	
	$rate_h = $height/$max_h; // 이미지 height 비율 
	$rate_w = $width/$max_w; // 이미지 width 비율 

	if ($height > $max_h || $width > $max_w) {
		if(($height > $max_h && $width > $max_w && $rate_w > $rate_h) || ($height < $max_h && $width > $max_w)) {
			$rate = $rate_w; 
//		} elseif(($height >= $max_h && $width >= $max_w && $rate_w < $rate_h) || ($height >= $max_h && $width < $max_w)) {
		} else {
			$rate = $rate_h;
		} 
	} else {
		$rate = 1;
	}

	$resize_w = $width/$rate; 
	$resize_h = $height/$rate;	
	$newsize  = array("$resize_w", "$resize_h");

	return $newsize;
}


#-----------------------------------------------------------------------------------
# 날짜를 요일 문자로
#-----------------------------------------------------------------------------------
function MgWeekString($val) {
	$returnVal = "";

	switch(date("w", strtotime($val))) {
		case "0"  : $returnVal = "일"; break;
		case "1"  : $returnVal = "월"; break;
		case "2"  : $returnVal = "화"; break;
		case "3"  : $returnVal = "수"; break;
		case "4"  : $returnVal = "목"; break;
		case "5"  : $returnVal = "금"; break;
		case "6"  : $returnVal = "토"; break;
		default : $returnVal = "";   break;
	}
    return $returnVal;
}


function MgComputePaging() {
	global $Page, $TotalCount, $LineCount, $PageCount, $TotalPage, $StartPage, $EndPage, $StartRow, $PrevPage, $NextPage;

	$TotalPage =  ceil($TotalCount/$LineCount);
	$StartPage = (ceil($Page / $PageCount) - 1) * $PageCount + 1;

	if ($TotalPage == 1)
		$EndPage = 1;
	elseif($TotalPage > ($StartPage + ($PageCount - 1)))
		$EndPage = $StartPage + ($PageCount - 1);
	else
		$EndPage = $TotalPage;

	if ($Page == 1)
		$StartRow = 0;
	else
		$StartRow = ($Page - 1) * $LineCount;

	$PrevPage =  $Page - 1;
	$NextPage = ($Page < $TotalPage) ? $Page + 1: 0;
}


#-----------------------------------------------------------------------------------
# 파일 아이콘 이미지 
#-----------------------------------------------------------------------------------
function MgFileIcon($file_ext, $folder) {
	$file_ext = strtolower($file_ext);
	if($file_ext) {
		if(
			$file_ext=="ai"  ||
			$file_ext=="asf" ||
			$file_ext=="bin" ||
			$file_ext=="bmp" ||
			$file_ext=="doc" ||
			$file_ext=="fla" ||
			$file_ext=="gif" ||
			$file_ext=="htm" ||
			$file_ext=="hwp" ||
			$file_ext=="img" ||
			$file_ext=="jpg" ||
			$file_ext=="mov" ||
			$file_ext=="mp3" ||
			$file_ext=="pdf" ||
			$file_ext=="ppt" ||
			$file_ext=="ram" ||
			$file_ext=="rm"  ||
			$file_ext=="swf" ||
			$file_ext=="txt" ||
			$file_ext=="xls" ||
			$file_ext=="zip"
		)
			return "<img src='{$folder}/{$file_ext}.gif'>";
		else
			return "<img src='{$folder}/null.gif'>";
	} else {
		return "";
	}
}


#-----------------------------------------------------------------------------------
# SID 값 생성하기 6자리 10자리 총 16자리
#-----------------------------------------------------------------------------------
function MgMakeSID() {
	$returnVal = date("ymd");

	for($i=0; $i<10; $i++) {
		$chrU = chr(rand(65, 90)); // 대문자
		$chrL = chr(rand(97, 122)); // 소문자
		$UL   = rand(0, 1);  // 대소문자 0 대문자 1 소문자

		if ($UL)
			$returnVal .= $chrU;
		else
			$returnVal .= $chrL;
	}
    return $returnVal;
}


#-----------------------------------------------------------------------------------
# CODE 값 생성하기 6자리 10자리 총 16자리
#-----------------------------------------------------------------------------------
function MgMakeCode($cnt) {
	$returnVal = date("ym");

	for($i=0; $i<$cnt-4; $i++) {
		$chrN = chr(rand(48, 57)); // 숫자
		$chrU = chr(rand(65, 90)); // 대문자
		$NU   = rand(0, 1);  // 대소문자 0 대문자 1 소문자

		$returnVal .= $UL ? $chrN : $chrU;
	}
    return $returnVal;
}


#-----------------------------------------------------------------------------------
# 게시판 보안 단어 설정
#-----------------------------------------------------------------------------------
function MgMakeSecurityCode() {
	$returnVal = '';

	for($i=0; $i<10; $i++) {
		$chrU = chr(rand(65, 90)); // 대문자
		$chrL = chr(rand(97, 122)); // 소문자
		$UL   = rand(0, 1);  // 대소문자 0 대문자 1 소문자

		if ($UL)
			$returnVal .= $chrU;
		else
			$returnVal .= $chrL;
	}
    return $returnVal;
}


#-----------------------------------------------------------------------------------
# 해당 폴더의 디렉토리를 보기
#-----------------------------------------------------------------------------------
function MgDirList($folder) { 
	$path = opendir($folder); 

	while($list = readdir($path)) { 
		if(is_dir($folder . "/" . $list) && $list != "." && $list != "..") {
			$Arraydir[] = $list; 
		} 
	}
	closedir($path); 
	sort($Arraydir);

	return $Arraydir; 
} 


#-----------------------------------------------------------------------------------
# 해당 폴더의 파일을 보기
#-----------------------------------------------------------------------------------
function MgFileList($folder, $ext="") { 
	$path = opendir($folder); 

	$ext_exp = explode(",", $ext);
	while($list = readdir($path)) { 
		if ($ext) {
			$file_exp = explode(".", $list);

			$isExt = false;
			for($i=0; $i<count($ext_exp); $i++) {
				if ($file_exp[1] == $ext_exp[$i]) {
					$isExt = true;
					break;
				}
			}

			if ($isExt && is_file($folder . "/" . $list) && $list != "." && $list != "..") 
				$Arraydir[] = $list; 
		}else {
			if (is_file($folder . "/" . $list) && $list != "." && $list != "..") 
				$Arraydir[] = $list; 
		}
	}

	closedir($path);
	
	if(count($Arraydir)) sort($Arraydir);
	
	return $Arraydir;
}


#-----------------------------------------------------------------------------------
# GD 라이브러리를 이용한 섬네일 생성
#-----------------------------------------------------------------------------------
function MgImgThumnail($cur_path, $cur_file, $cw, $ch, $format="jpg") {
	$part = explode(".", $cur_file);
	$ext  = $part[sizeof($part)-1];
	$pre  = $part[sizeof($part)-2];

	$filename  = $cur_path."/" . $cur_file;
	$sfilename = $cur_path."/" . $pre . "_thumbnail." . $format;


	list($width, $height) = getimagesize($filename);
	switch($format) {
		case 'jpg':
			$source = imagecreatefromjpeg($filename);
			break;

		case 'gif';
			$source = imagecreatefromgif($filename);
			break;

		case 'png':
			$source = imagecreatefrompng($filename);
			break;

		default:
			return;
	}

	$ch = $ch ? $ch : $height;			// 생성할 이미지의 세로길이
	$cw = $cw ? $cw : $width;			// 생성할 이미지의 가로길이
	$h  = $h  ? $h  : $height;			// 원본이미지에서 자를 부분의 세로길이
	$w  = $w  ? $w  : $width;			// 원본이미지에서 자를 부분의 가로길이
	$sY = $sY ? $sY : ($height-$h)/2;	// 원본이미지의 Start Point Y
	$sX = $sX ? $sX : ($width-$w)/2;	// 원본이미지의 Start Point X

	$thumb = imagecreatetruecolor($cw, $ch);

	imagealphablending($thumb, false);
	imagecopyresized($thumb, $source, 0, 0, $sX, $sY, $cw, $ch, $w, $h);

	imagejpeg($thumb, $sfilename, 100);

	//로드한 메모리를 비워줍니다. gd는 꼭 이걸 해주어야 합니다. 
	ImageDestroy($thumb);
	ImageDestroy($source);
}


#-----------------------------------------------------------------------------------
# FFMPEG 라이브러리를 이용한 FLV 와 섬네일 생성
#-----------------------------------------------------------------------------------
function MgMovToFlvThumbnail($cur_path, $cur_file, $cw, $ch, $ext, $frame=1) {
	$part		= explode(".", $cur_file);
//	$ext		= $part[sizeof($part)-1]; // 확장자는 필요없다.
	$pre		= $part[sizeof($part)-2];

	$filename  = $cur_path."/".$cur_file;
	$mfilename = $cur_path."/".$pre.".{$ext}";
	$tfilename = $cur_path."/".$pre."_thumbnail.dat";

	// 업로드 확장자로 변경
	$cmd = "mv {$filename} {$mfilename} -f";
	$fh  = popen($cmd, "r");
	while(fgets($fh)) { } 
	pclose($fh);

	// 섬네일 생성하기 png 포맷 
	$cmd = "/usr/local/bin/ffmpeg -y -i {$mfilename} -vframes {$frame} -vcodec png -f rawvideo -s {$cw}x{$ch} {$tfilename} 2>&1";
	$fh  = popen($cmd, "r");
	while(fgets($fh)) { } 
	pclose($fh);

	// 동영상 변환 
//	$cmd = "/usr/local/bin/ffmpeg -y -i {$filename} -ar 22050 -ab 32 -f flv -s 400x300 {$mfilename} 2>&1";
//	$cmd = "/usr/local/bin/ffmpeg -y -i {$filename} -ar 22050 -ab 32 -f flv {$mfilename} 2>&1";
	$cmd = "/usr/local/bin/ffmpeg -y -i {$mfilename} -ar 22050 -f flv {$filename} 2>&1";
	$fh  = popen($cmd, "r");
	while(fgets($fh)) { } 
	pclose($fh);

	// 소스 폴더 위치로 변경
	$cmd = "rm -rf {$mfilename}";
	$fh = popen($cmd, "r");
	while(fgets($fh)) { } 
	pclose($fh);
}


#-----------------------------------------------------------------------------------
# 타입을 문자열로
#-----------------------------------------------------------------------------------
function MgDateFormat($val, $type) {
	$returnVal = "";

	if (substr($val, 0, 4) != "0000") {
		if ($type==1) {
			$returnVal = date("Y-m-d", strtotime($val));
		} else {
			$returnVal = date("Y-m-d H:i:s", strtotime($val));
		}
	}else {
		$returnVal = "";
	}

	return $returnVal;
}


function MgErrorMsg($RESULT, $MSG = "쿼리 오류가 발생하였습니다. 관리자에게 문의하시기 바랍니다.") {
	global $ETC_INFO, $_SERVER;

	if (!$RESULT) { 
		if ($ETC_INFO['is_log']) {
			$logData = "[" . date("Y-m-d H:i:s") . "] - [" . $_SERVER['REQUEST_URI'] . "] - [" . mysql_error() . "]";
			MgWriteLog($ETC_INFO['log_file'], $logData);
		}
		MgMoveURL("", $MSG, "", "back");
		MgExit(); 
	}
}


function MgExit() {
	global $DB_CONNECT;

	if($DB_CONNECT) mysql_close($DB_CONNECT);

	exit;
}


#-----------------------------------------------------------------------------------
# 마이크로 타임 수치로 변경
#-----------------------------------------------------------------------------------
function MgMicroTime() { return array_sum(explode(' ',microtime())); }


#-----------------------------------------------------------------------------------
# 마이크로 타임 수치로 변경
#-----------------------------------------------------------------------------------
function MgDateAdd($interval, $number, $date) {
	// getdate()함수를 통해 얻은 배열값을 각각의 변수에 지정합니다.
	$date_time_array = getdate($date);
	$hours   = $date_time_array["hours"];
	$minutes = $date_time_array["minutes"];
	$seconds = $date_time_array["seconds"];
	$month   = $date_time_array["mon"];
	$day     = $date_time_array["mday"];
	$year    = $date_time_array["year"];

	//switch()구문을 사용해서 interval에 따라 적용합니다.
	switch ($interval) {
		case "yyyy":
			$year   +=$number;
			break;

		case "q":
			$year   +=($number*3);
			break;

		case "m":
			$month  +=$number;
			break;

		case "y":
		case "d":
		case "w":
			$day    +=$number;
			break;

		case "ww":
			$day    +=($number*7);
			break;

		case "h":
			$hours  +=$number;
			break;

		case "n":
			$minutes+=$number;
			break;

		case "s":
			$seconds+=$number;
			break;
	}

	$timestamp = mktime($hours ,$minutes, $seconds, $month, $day, $year);
	$timestamp = date("Y-m-d");
	return $timestamp;
}


#-----------------------------------------------------------------------------------
# SMS 서버에 메시지 발송하기
#-----------------------------------------------------------------------------------
function MgSendSMS($name, $phone, $msg, $gubun) {
	global $SMS_ID, $SMS_PW, $SMS_CALLBACK;

	$id            = $SMS_ID;
	$pw            = $SMS_PW;
	$tran_callback = $SMS_CALLBACK;
	$tran_id       = 'admin';
	$tran_msg      = rawurlencode($msg);
	$tran_sid      = '';
	$tran_name     = rawurlencode($name);
	$tran_phone    = rawurlencode($phone);
	$tran_group    = '';
	$tran_etc      = $gubun;

	$server = "xroshot.amiinfo.net";
	$path = "/modules/send_ok.php?id={$id}&pw={$pw}&tran_id={$tran_id}&tran_callback={$tran_callback}&tran_sid={$tran_sid}&tran_name={$tran_name}&tran_phone={$tran_phone}&tran_group={$tran_group}&tran_etc={$tran_etc}&tran_msg={$tran_msg}";
//	$path = "/modules/test.php";

	### 웹서버 접속
	$fp = fsockopen($server , 80, $errno, $errstr, 30);
	$header  = "GET {$path} HTTP/1.1\r\n";
	$header .= "Host: {$server}\r\n";
	$header .= "User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)\r\n";
	$header .= "Accept-Language: ko\r\n";
	$header .= "Content-Type: text/html; charset=euc-kr";
	$header .= "Connection: Close\r\n\r\n";

	### 해더 보냄
	fputs($fp, $header);

	### 페이지 읽기
	while(!feof($fp)) $read .= fread($fp, 1024);
	fclose($fp);

	$read_ary = explode("euc-kr", $read);
	return trim($read_ary[1]);
}


function MgRequestServer($server, $path, $charset='euc-kr') {
	### 웹서버 접속
	$fp = fsockopen($server , 80, $errno, $errstr, 30);
	$header = "GET {$path} HTTP/1.1\r\n";
	$header .= "Host: {$server}\r\n";
	$header .= "User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)\r\n";
	$header .= "Accept-Language: ko\r\n";
	$header .= "Content-Type: text/html; charset={$charset}";
	$header .= "Connection: Close\r\n\r\n";

	### 해더 보냄
	fputs($fp, $header);

	### 페이지 읽기
	while(!feof($fp)) $read .= fread($fp, 1024);
	fclose($fp);

	return $read;
}


#-----------------------------------------------------------------------------------
#              utf8 전용 문자열 처리함수 
#-----------------------------------------------------------------------------------
// utf8문자열을 배열로 만든다.
function utf8String2Array($str){
	$re_arr = array();    $re_icount = 0;
	for($i=0,$m=strlen($str);$i<$m;$i++){
		$ch = ord($str{$i});
		if($ch<128){$re_arr[$re_icount++]=substr($str,$i,1);}
		else if($ch<224){$re_arr[$re_icount++]=substr($str,$i,2);$i+=1;}
		else if($ch<240){$re_arr[$re_icount++]=substr($str,$i,3);$i+=2;}
		else if($ch<248){$re_arr[$re_icount++]=substr($str,$i,4);$i+=3;}
	}
	return $re_arr;
}

// utf8문자열을 잘라낸다.
function utf8Substr($str,$start,$length=NULL){
	return implode('',array_slice(php_fn_utf8_to_array($str),$start,$length)); 
}

// utf8문자열의 길이를 구한다.
function utf8Strlen($str){ 
	return count(php_fn_utf8_to_array($str));
}

// mb 함수가 지원안될 때
if(!function_exists(mb_substr)){
	function mb_strlen($str,$encoding='UTF-8'){
		return utf8Strlen($str);
	} 
	function mb_substr( $str, $start ,$length=null ,$encoding='utf-8'){
		return utf8Substr($str,$start,$length);
	}
}


$change_code   = array();
$change_code[] = array("src" => "\"" , "dst" => "&#x0022;");
$change_code[] = array("src" => "'"  , "dst" => "&#x0027;");
$change_code[] = array("src" => "<"  , "dst" => "&#x003C;");
$change_code[] = array("src" => ">"  , "dst" => "&#x003E;");
$change_code[] = array("src" => "&"  , "dst" => "&#x0026;");
$change_code[] = array("src" => "•"  , "dst" => "&#x2022;");
$change_code[] = array("src" => "…" , "dst" => "&#x2026;");
$change_code[] = array("src" => "∴" , "dst" => "&#x2234;");


function MgHtmlToSpecialChar($data) {
	global $change_code;

	foreach($change_code as $ch_code)
		$data = str_replace($ch_code['src'], $ch_code['dst'], $data);

	return $data;
}


function MgSpecialCharToHtml() {
	global $change_code;

	foreach($change_code as $ch_code)
		$data = str_replace($ch_code['dst'], $ch_code['src'], $data);

	return $data;
}


#-----------------------------------------------------------------------------------
# [수집된 단어의 첫 2바이트] => 그 글자가 처음 나오는 단어의 인덱스 
#-----------------------------------------------------------------------------------
function MgIndexOfWords(&$words) {
	$arr = array();
	$ch_old = 0;

	foreach($words as $k=>$v){
		$ch = $v{0}.$v{1};
		if ($ch_old==$ch) continue;

		$ch_old = $ch;
		$arr[$ch] = $k;
	}
	return $arr;
}


#-----------------------------------------------------------------------------------
# [수집된 단어의 첫 2바이트] => 그 글자가 처음 나오는 단어의 인덱스 
# $result= MgStringMatch($words, $string); 
#-----------------------------------------------------------------------------------
define('MEX_WORD_LEN', 20); 

function MgStringMatch(&$words, $str) {
	$RET_WORDS = array();
	$char2idx  = array();

	$char2idx  = MgIndexOfWords($words);
	$num_words = sizeof($words);
	$len_str   = strlen($str);

    $han_flag  = 0;

    for ($i=0; $i<$len_str; $i++){
		if ($han_flag) {					# 한글의 두번째 바이트 차례는 건너뜀
			$han_flag=0;
			continue;
		}

		$ch = $str{$i};
		if($ch<'0') continue;

		if(127 < ord($ch)) $han_flag=1;

		$ch = strtolower($ch. $str{$i+1});	# 2바이트를 1단위로 처리

		# 첫글자가 일치하는 단어의 인덱스가 없으면
		if (!isset($char2idx[$ch])) continue;

		# 본문 중에 비교할 부분 문자열
		$str_part= strtolower(substr($str, $i, MEX_WORD_LEN));

		// echo "@$i@ 단어의 첫글자 일치의 경우  ($str_part == {$words[$char2idx[$ch]]})<br>";

		$match_word= '';
		for($j=$char2idx[$ch]; $j< $num_words; $j++) {
			# 단어가 완전히 포함되면
			if (strpos($str_part, $words[$j])===0) $match_word= $words[$j];	# 임시저장

			# 단어가 비교 문자열보다 커지는 순간에 탈출
			if ($str_part<= $words[$j]) {
				if ($match_word!='') $RET_WORDS[]= $match_word;				# 그 순간의  임시 단어 수집
				break;
			}
		}

        if ($match_word && $j==$num_words) {
			// echo "@$i@ 정렬에 문제가 있어서 저장 못하고 지나왔다면? ($match_word)<br>";
			$RET_WORDS[]= $match_word;
		}
	}

	if(0==sizeof($RET_WORDS)) return '';

	return implode(', ', array_unique($RET_WORDS));	# 중복 제거하고 리턴
}


function MgGDTextBox($fontSize, $fontAngle, $fontFile, $text) {
	$rect = imagettfbbox($fontSize, $fontAngle, $fontFile, $text);

	$minX = min(array($rect[0],$rect[2],$rect[4],$rect[6]));
	$maxX = max(array($rect[0],$rect[2],$rect[4],$rect[6]));
	$minY = min(array($rect[1],$rect[3],$rect[5],$rect[7]));
	$maxY = max(array($rect[1],$rect[3],$rect[5],$rect[7]));

	return array(
		"left"   => abs($minX)      ,
		"top"    => abs($minY)      ,
		"width"  => $maxX - $minX   ,
		"height" => $maxY - $minY   ,
		"box"    => $rect
	);
}


function MgMakeMenuLink($ROW, &$url, &$tgt) {
	global $TABLE_INFO, $DB_CONNECT;

	// echo $ROW['grp1'] . $ROW['grp2'] . $ROW['grp3'] . " | " . $ROW['gubun'] . " | " . $ROW['url'] . "\n";

	switch($ROW['gubun']) {
		case 'LINK' :
			$url = $ROW['url'];
			$tgt = $ROW['tgt'];
			break;

		case 'BBS':
			/*
			$SQL = "SELECT isvcheck FROM {$TABLE_INFO['bbs_master']} WHERE sid = '{$ROW['gubun_sid']}'";
			$SUB_ROW = mysql_fetch_array(mysql_query($SQL, $DB_CONNECT));

			if($SUB_ROW['isvcheck'] == 'Y')
				$url = "?menugrp={$ROW['grp1']}{$ROW['grp2']}{$ROW['grp3']}&master=bbs&act=vcheck&master_sid={$ROW['gubun_sid']}";
			else
				$url = "?menugrp={$ROW['grp1']}{$ROW['grp2']}{$ROW['grp3']}&master=bbs&act=list&master_sid={$ROW['gubun_sid']}";
			*/

			# 가상인증체크라 하더라도 무조건 리스트로 보내고 리스트에서 해결 본다.
			$url = "?menugrp={$ROW['grp1']}{$ROW['grp2']}{$ROW['grp3']}&master=bbs&act=list&master_sid={$ROW['gubun_sid']}";
			$tgt = "_self";
			break;

		case 'MINWON':
			$url = "?menugrp={$ROW['grp1']}{$ROW['grp2']}{$ROW['grp3']}&master=minwon&act=list";
			$tgt = "_self";
			break;

		case 'HTML' :
			$url = "?menugrp={$ROW['grp1']}{$ROW['grp2']}{$ROW['grp3']}&master=html&act=page";
			$tgt = "_self";
			break;

		case 'DIARY' :
			$url = "?menugrp={$ROW['grp1']}{$ROW['grp2']}{$ROW['grp3']}&master=diary&act=list&master_sid={$ROW['gubun_sid']}";
			$tgt = "_self";
			break;

		case 'MEAL' :
			$url = "?menugrp={$ROW['grp1']}{$ROW['grp2']}{$ROW['grp3']}&master=meal&act=list";
			$tgt = "_self";
			break;

		case 'POLL' :
			$url = "?menugrp={$ROW['grp1']}{$ROW['grp2']}{$ROW['grp3']}&master=poll&act=list";
			$tgt = "_self";
			break;

		default :
			$url = "#";
			$tgt = "_self";
			break;
	}
}


function AddZero($val){
	$result = "";

	if ($val < 10 && strlen($val) == 1) {
		$result = "0" . $val;
	}else {
		$result = $val;
	}

	return $result;
}


function SetMemLevelUp($v){
	$SQL = "SELECT mpoint FROM {$TABLE_INFO['member']} WHERE midx='{$v}'";
	$res_p1 = mysql_fetch_array(mysql_query($SQL, $DB_CONNECT));
	$_point = $res_p1['mpoint'];

	if ($_point > 250) $_level = 9;
	else if ($_point > 170) $_level = 8;
	else if ($_point > 120) $_level = 7;
	else if ($_point >  80) $_level = 6;
	else if ($_point >  55) $_level = 5;
	else if ($_point >  35) $_level = 4;
	else if ($_point >  20) $_level = 3;
	else if ($_point >  10) $_level = 2;
	else $_level = 1;

	$SQL = "UPDATE {$TABLE_INFO['member']} SET mlevel='{$_level}' WHERE midx='{$v}'";
	$res_p2 = mysql_query($SQL, $DB_CONNECT);
}
include "addFunction.php";
?>