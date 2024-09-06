<?
include "class/config.php";
?>
<meta http-equiv="content-Type" content="text/html; charset=utf-8" />
<?
#-----------------------------------------------------------------------------------
# Request 데이터 받기
#-----------------------------------------------------------------------------------
$name		= MgRequestCheck($_POST['name']  , 255, true, true);
$phone1		= MgRequestCheck($_POST['phone1'],   4, true, true);
$phone2		= MgRequestCheck($_POST['phone2'],   4, true, true);
$phone3		= MgRequestCheck($_POST['phone3'],   4, true, true);
$addr1		= MgRequestCheck($_POST['addr1'] , 127, true, true);
$addr2		= MgRequestCheck($_POST['addr2'] , 127, true, true);
$addr3		= MgRequestCheck($_POST['addr3'] , 127, true, true);
$etc1		= MgRequestCheck($_POST['etc1']  , 127, true, true);
$etc2		= MgRequestCheck($_POST['etc2']  , 127, true, true);
$sflag		= MgRequestCheck($_POST['sflag'] ,   1, true, true);
$sflag		= ($sflag=="Y") ? "Y" : "N";
$phone		= $phone1 . '-' . $phone2 . '-' . $phone3;

if ($name == ''){
	?>
	<script>
		alert('등록 오류!');
		location.href='06_guide_04_interest.html';
	</script>
	<?
	exit;
}


#-----------------------------------------------------------------------------------
# 글 등록하기
#-----------------------------------------------------------------------------------
$SQL = "
	INSERT INTO
		{$TABLE_INFO['guest']}
	SET
		gidx			= null
	,	site			= '{$site}'
	,	name			= '{$name}'
	,	phone			= '{$phone}'
	,	addr1			= '{$addr1}'
	,	addr2			= '{$addr2}'
	,	addr3			= '{$addr3}'
	,	etc1			= '{$etc1}'
	,	etc2			= '{$etc2}'
	,	sflag			= '{$sflag}'
	,	ip				= '{$_SERVER['REMOTE_ADDR']}'
	,	rdate			= SYSDATE()
";
$RESULT = mysql_query($SQL, $DB_CONNECT);
?>
<script>
	alert('등록되었습니다.');
	location.href="06_guide_04_interest.html";
</script>