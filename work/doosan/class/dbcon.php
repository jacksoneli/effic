<?
#-----------------------------------------------------------------------------------
# DB 접속
#-----------------------------------------------------------------------------------
$DB_CONNECT = mysql_connect($DATABASE_INFO['addr'], $DATABASE_INFO['user'], $DATABASE_INFO['pass']) or die("Failed connecting to MySQL DB!");
$DB_CONNECT_RESULT = mysql_select_db($DATABASE_INFO['name'], $DB_CONNECT);
if(!$DB_CONNECT_RESULT) {
	echo "<script>window.alert('MySQL DB CONNECT ERROR.'); history.go(-1);</script>"; exit;
}

mysql_query("SET NAMES utf8"); 
mysql_query("SET collation_connection=@@collation_database");
?>