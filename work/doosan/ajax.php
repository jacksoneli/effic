<?
include_once("class/config.php");

$opt1 = $_REQUEST["opt1"];
$opt2 = $_REQUEST["opt2"];
?>
									<select name="addr1" id="addr1" class="w201" onchange="change1(this.value, '');" style="width:187px; color:#666; font-size:12px;">
										<option value="" selected>선택하세요</option>
<?
$SQL = " SELECT * FROM zipcode1 GROUP BY sido ORDER BY sido ";
$res = mysql_query($SQL, $DB_CONNECT); MgErrorMsg($res);
if ($res){
	while($row = mysql_fetch_array($res)){
		$sido = $row["sido"];
?>
										<option value="<?=$sido;?>"<?=($sido==$opt1)?' selected':'';?>><?=$sido;?></option>
<?
	}
}
?>
									</select>
									<select name="addr2" id="addr2" class="w201" onchange="change1('<?=$opt1;?>', this.value);" style="width:187px; color:#666; font-size:12px;">
										<option value="" selected>선택하세요</option>
<?
if ($opt1 != ''){
	$SQL = " SELECT * FROM zipcode1 WHERE sido='$opt1' GROUP BY gugun ORDER BY gugun ";
	$res2 = mysql_query($SQL, $DB_CONNECT); MgErrorMsg($res2);
	if ($res2){
		while($row2 = mysql_fetch_array($res2)){
			$gugun = $row2["gugun"];
?>
										<option value="<?=$gugun;?>"<?=($gugun==$opt2)?' selected':'';?>><?=$gugun;?></option>
<?
		}
	}
}
?>
									</select>
									<select name="addr3" id="addr3" class="w201" style="width:187px; color:#666; font-size:12px;">
										<option value="" selected>선택하세요</option>
<?
if ($opt1 != '' && $opt2 != ''){
	$SQL = " SELECT * FROM zipcode1 WHERE sido='$opt1' and gugun='$opt2' GROUP BY dong ORDER BY dong ";
	$res3 = mysql_query($SQL, $DB_CONNECT); MgErrorMsg($res3);
	if ($res3){
		while($row3 = mysql_fetch_array($res3)){
			$dong = $row3["dong"];
?>
										<option value="<?=$dong;?>"><?=$dong;?></option>
<?
		}
	}
}
?>									</select>