<?
include "class/config.php";
?>
<meta http-equiv="content-Type" content="text/html; charset=utf-8" />
<?
$date	= date('Y-m-d');
$time	= date('H:i:s');
$vYY	= date('Y');
$vMM	= date('m');
$vDD	= date('d');
$vhh	= date('H');
$vmn	= date('i');
$vss	= date('s');
$vww	= date('w');

$SQL = "
	INSERT INTO
		w3_visit_count
	SET
		vidx		= null
	,	site		= '$site'
	,	vdate		= '$date'
	,	vtime		= '$time'
	,	vYY			= '$vYY'
	,	vMM			= '$vMM'
	,	vDD			= '$vDD'
	,	vhh			= '$vhh'
	,	vmn			= '$vmn'
	,	vss			= '$vss'
	,	vww			= '$vww'
	,	vIP			= '$_SERVER[REMOTE_ADDR]'
	,	vReferer	= '$_SERVER[HTTP_REFERER]'
	,	vAgent		= '$_SERVER[HTTP_USER_AGENT]'
	,	gubun		= 'P'
";
//echo $SQL;
$RESULT = mysql_query($SQL, $DB_CONNECT);
?>