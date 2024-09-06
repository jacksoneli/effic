<?
error_reporting(E_ALL ^ E_NOTICE);
ini_set("display_errors", 1);

include "function.php";

####################################################################################
# 파일 : config.php 
# 설명 : 환경 설정
# 일자 : 2017년 07월 19일
####################################################################################


#-----------------------------------------------------------------------------------
# 세션 관련 정의
#-----------------------------------------------------------------------------------
ini_set('session.save_path'      , $UPLOAD_INFO['session']);
ini_set('session.cache_limiter'  , 'no-cache');
ini_set('session.cache_expire'   , 3600);  
ini_set('session.gc_maxlifetime' , 3600); 

//session_start();


#-----------------------------------------------------------------------------------
# 사이트 변수
#-----------------------------------------------------------------------------------
$SITE_INFO['url']				= "http://juchon-zenith.co.kr/";
$SITE_INFO['route']				= "/";
$SITE_INFO['dir']				= str_replace('/class/config.php' , '' , __FILE__);
$SITE_INFO['http_host']			= $_SERVER['HTTP_HOST'];
$SITE_INFO['webmaster']			= "maguri84@naver.com";


#-----------------------------------------------------------------------------------
# 데이터베이스 변수
#-----------------------------------------------------------------------------------
$DATABASE_INFO['addr']			= 'localhost';
$DATABASE_INFO['user']			= 'pent176';
$DATABASE_INFO['pass']			= 'pent176';
$DATABASE_INFO['name']			= 'pent176';


#-----------------------------------------------------------------------------------
# 테이블 변수 정의
#-----------------------------------------------------------------------------------
$TABLE_INFO['board']			= 'w3_board_info';
$TABLE_INFO['bfile']			= 'w3_board_file';
$TABLE_INFO['guest']			= 'w3_guest_info';

include   "dbcon.php";
//include "session.php";

#-----------------------------------------------------------------------------------
# REQUEST 변수
#-----------------------------------------------------------------------------------
$site	= 'juchon-zenith';
$Page	= $_REQUEST['Page'];  $Page  = $Page  ? $Page  : 1;
$sfl	= $_REQUEST['sfl'];
$stx	= $_REQUEST['stx'];
?>
