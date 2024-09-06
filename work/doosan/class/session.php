<?
#-----------------------------------------------------------------------------------
# 세션 정리
#-----------------------------------------------------------------------------------
$SESSION_ID				= session_id();
$SESSION_INFO['aIdx']	= $_SESSION['ADMIN_SID'];

if ($SESSION_INFO['aIdx']){
	$SQL = "
		SELECT
			*
		FROM
			{$TABLE_INFO['admin']} as a
			LEFT JOIN {$TABLE_INFO['site']} as b
				ON a.site = b.site
		WHERE
			idx = '{$SESSION_INFO['aIdx']}'
	";
	$session  = mysql_query($SQL, $DB_CONNECT);

	if (!$session){
		$ERROR = mysql_error();
		echo "<script>window.alert(\"$ERROR\"); history.go(-1); </script>";
		MgExit();
	}
	$_session = mysql_fetch_array($session);

	$SESSION_INFO['aId']	= $_session['id'];
	$SESSION_INFO['aName']	= $_session['name'];
	$SESSION_INFO['aLvl']	= $_session['lvl'];
	$SESSION_INFO['aUrl']	= $_session['surl'];
	$SESSION_INFO['menu']	= $_session['smenu'];
}
?>