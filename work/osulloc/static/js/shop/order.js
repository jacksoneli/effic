// @file shop/order.js

// require(['ui', 'sticker', 'SmoothScroll'], function() {
require(['ui', 'slick', 'validate'], function() {
	'use strict';

	$(function() {

		require(['modal'], function() {
			$.modal.defaults = IG.modal_defaults;

			$('a[data-layer]').click(function(event) {
			  $(this).modal(IG.modal_layer);
			  event.preventDefault();
			});
		});

		$('.shop-gift-list').on('init', function(){
			//
		}).slick({
			dots: true,
			infinite: false,
			slidesToShow: 2,
			slidesToScroll: 2,
			mobileFirst: true,
		  responsive: [
		    {
		      breakpoint: 599,
		      settings: {
		        slidesToShow: 3,
		        slidesToScroll: 3
		      }
		    },
		    {
		      breakpoint: 1200,
		      settings: {
		        slidesToShow: 4,
		        slidesToScroll: 4
		      }
		    }
		  ]
		});

		$('.call-layer').toggleLayer();
		
		$("#orderCashMcouponNum").keypress(function (e) {
	        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
	            return false;
	        }
	    });
		$("#p8-3-num").keypress(function (e) {
	        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
	            return false;
	        }
		});
		
		orderFormTotalBox();

		$('.toggle-menu,.close-sidenav').click(function() {
			($('.sidenav').hasClass('is-active')) ? $('.order_bill_m').css('z-index','21') : $('.order_bill_m').css('z-index','51');
		});


		setTimeout(function() {
			var $chkM = $('#tmp');
			if (!$chkM.is(':visible')) {
				if ($('.common-section').hasClass('open')) {
					$('.common-section').removeClass('open').addClass('w_close');
					$('.common-section').find('.shop-inner, .shop_buygift_controll, .shop_mcoupon_controll').css('display','block')
				}
			} else {
				if ($('.common-section').hasClass('w_close')) {
					$('.common-section').addClass('open');
					$('.common-section').find('.shop-inner, .shop_buygift_controll, .shop_mcoupon_controll').css('display','none')
				}
			}
		}, 500);

		chkTextTotal();

	});
	
});

function chkTextTotal() {
	var $this = $('.order_bill_total .bill-item--total .price .num'),
		$change = $('.order_bill_m .bill-item--total .price .num');

		$change.text($this.text());
	setTimeout(function() {
		chkTextTotal();
	}, 50);
}

$(window).bind('resize', function(e){
	orderFormTotalBox();
});

$(window).scroll(function() {
	orderFormTotalBox();
});

function pay_receipt_gift(giftReceipt, regNum, tot) {
	// 필수항목 체크 (영수증 발행 용도에 따른 주민등록번호와 사업자번호 길이와 오류 체크)
	// 주민등록번호와 사업자등록번호, 휴대폰 번호의 정상적인 입력여부 확인을 위해 아래의 자바스크립트는 반드시 사용하여야 하며, 
	// 사용하지 않을경우 발생된 문제에 대한 책임은 상점에 있습니다.
	// 또한 휴대폰 사업자가 추가될 경우, 반드시 아래의 휴대폰 번호 체크 자바스크립트에 휴대폰 앞자리를 추가하시기 바랍니다. 
	// 이니시스에서는 실명확인 서비스를 제공하지 않으니, 실명확인 업체를 이용하시기 바랍니다.

	var flag = "Y";
	if (giftReceipt == "") {
		alert("모바일 상품권 현금영수증에 대한 현금영수증 발행용도를 선택하세요. 필수항목입니다.");
		flag="N";
		return flag;
	}
	if (giftReceipt == "0") {
		//alert("소득공제용 영수증을 선택하셨습니다.");

		/*		if(frm.reg_num.value.length !=13 && frm.reg_num.value.length !=10 && frm.reg_num.value.length !=11)
		 {
		 alert("올바른 주민등록번호 13자리 또는 휴대폰 번호 10자리(11자리)를 입력하세요.");
		 return false;
		 }*/
		/* 2014.08.22 주빈번호 허용X으로 변경 */
		//if (regNum.length < 10 || regNum.length > 19) {
		if (regNum.length < 10 || regNum.length > 11) {
			//alert("모바일 상품권 현금영수증에 대한 올바른 휴대폰번호 10자리(11자리) 또는 현금영수증 카드번호 18자리를 입력하세요.");
			//20181219 문구 수정
			alert("하이픈 (-)을 제외한 숫자 10자리(11자리)를 입력하세요.");
			flag="N";
			return flag;
//		} else if (regNum.length == 13) {
//			var obj = regNum;
//			var sum = 0;
//
//			for (i = 0; i < 8; i++) {
//				sum += obj.substring(i, i + 1) * (i + 2);
//			}
//			for (i = 8; i < 12; i++) {
//				sum += obj.substring(i, i + 1) * (i - 6);
//			}
//			sum = 11 - (sum % 11);
//
//			if (sum >= 10) {
//				sum -= 10;
//			}
//
//			if (obj.substring(12, 13) != sum
//					|| (obj.substring(6, 7) != 1 && obj.substring(6, 7) != 2)) {
//				//alert("주민등록번호에 오류가 있습니다. 다시 확인하십시오.");
//				//return false;
//			} else {
//				//alert("모바일 상품권 현금영수증에 대한 올바른 휴대폰번호 10자리(11자리) 또는 현금영수증 카드번호 18자리를 입력하세요.");
//				alert("모바일 상품권 현금영수증에 대한 올바른 휴대폰번호 10자리(11자리)를 입력하세요.");
//				flag="N";
//				return flag;
//			}
//
//		} else if (regNum.length == 11 || regNum.length == 10) {
		}else if (regNum.length == 11 || regNum.length == 10) {
			var obj = regNum;
			if (obj.substring(0, 3) != "011" && obj.substring(0, 3) != "017"
					&& obj.substring(0, 3) != "016"
					&& obj.substring(0, 3) != "018"
					&& obj.substring(0, 3) != "019"
					&& obj.substring(0, 3) != "010") {
				//alert("모바일 상품권 현금영수증에 대한 휴대폰 번호가 아니거나, 휴대폰 번호에 오류가 있습니다. 다시 확인 하십시오. ");
				alert("하이픈 (-)을 제외한 숫자 10자리(11자리)를 입력하세요.");
				flag="N";
				return flag;
			}

			var chr;
			for ( var i = 0; i < obj.length; i++) {
				chr = obj.substr(i, 1);
				if (chr < '0' || chr > '9') {
					alert("모바일 상품권 현금영수증에 대한 숫자가 아닌 문자가 휴대폰 번호에 추가되어 오류가 있습니다, 다시 확인 하십시오. ");
					flag="N";
					return flag;
				}
			}
		}
	} else if (giftReceipt == "1") {
		//alert("지출증빙용 영수증을 선택하셨습니다.");
		var obj = regNum;

		/*		if(frm.reg_num.value.length !=10  && frm.reg_num.value.length !=11 && frm.reg_num.value.length !=13)
		 {
		 alert("올바른 주민등록번호 13자리, 사업자등록번호 10자리 또는 휴대폰 번호 10자리(11자리)를 입력하세요.");
		 frm.reg_num.focus();
		 return false;
		 }*/
		/* 2014.08.22 주빈번호 허용X으로 변경 */
		//if (regNum.length < 10 || regNum.length > 19) {
		if (regNum.length < 10 || regNum.length > 11) {
			alert("하이픈 (-)을 제외한 숫자 10자리를 입력하세요.");
			//frm.reg_num.focus();
			flag="N";
			return flag;
		} else if (regNum.length == 13) {
			var obj = regNum;
			var sum = 0;

			for (i = 0; i < 8; i++) {
				sum += obj.substring(i, i + 1) * (i + 2);
			}
			for (i = 8; i < 12; i++) {
				sum += obj.substring(i, i + 1) * (i - 6);
			}

			sum = 11 - (sum % 11);

			if (sum >= 10) {
				sum -= 10;
			}

			if (obj.substring(12, 13) != sum
					|| (obj.substring(6, 7) != 1 && obj.substring(6, 7) != 2)) {

				//                	    alert("주민등록번호에 오류가 있습니다. 다시 확인하십시오.");
				//                	    frm.reg_num.focus();
				//                	    return false;

			} else {
				//alert("모바일 상품권 현금영수증에 대한 올바른 휴대폰번호 10자리(11자리), 사업자등록번호 10자리 또는 현금영수증 카드번호 18자리를 입력하세요.");
				alert("하이픈 (-)을 제외한 숫자 10자리를 입력하세요.");
				//frm.reg_num.focus();
				flag="N";
				return flag;
			}

		} else if (regNum.length == 10 && obj.substring(0, 1) != "0") {
			var vencod = regNum;
			var sum = 0;
			var getlist = new Array(10);
			var chkvalue = new Array("1", "3", "7", "1", "3", "7", "1", "3","5");
			for ( var i = 0; i < 10; i++) {
				getlist[i] = vencod.substring(i, i + 1);
			}
			for ( var i = 0; i < 9; i++) {
				sum += getlist[i] * chkvalue[i];
			}
			sum = sum + parseInt((getlist[8] * 5) / 10);
			sidliy = sum % 10;
			sidchk = 0;
			if (sidliy != 0) {
				sidchk = 10 - sidliy;
			} else {
				sidchk = 0;
			}
			if (sidchk != getlist[9]) {
				//alert("모바일 상품권 현금영수증에 대한 사업자등록번호에 오류가 있습니다. 다시 확인하십시오.");
				alert("모바일 상품권 현금영수증에 대한 사업자등록번호에 오류가 있습니다. 다시 확인하십시오.");
				//frm.reg_num.focus(); 
				flag="N";
				return flag;
			} 
		} else if (regNum.length == 11 || regNum.length == 10) {
			var obj = regNum;
			if (obj.substring(0, 3) != "011" && obj.substring(0, 3) != "017"
					&& obj.substring(0, 3) != "016"
					&& obj.substring(0, 3) != "018"
					&& obj.substring(0, 3) != "019"
					&& obj.substring(0, 3) != "010") {
				alert("모바일 상품권 현금영수증에 대한 휴대폰 번호에 오류가 있습니다. 다시 확인 하십시오. ");
				//frm.reg_num.focus();
				flag="N";
				return flag;
			}
			var chr;
			for ( var i = 0; i < obj.length; i++) {
				chr = obj.substr(i, 1);
				if (chr < '0' || chr > '9') {
					alert("모바일 상품권 현금영수증에 대한 숫자가 아닌 문자가 휴대폰 번호에 추가되어 오류가 있습니다, 다시 확인 하십시오. ");
					//frm.reg_num.focus();
					flag="N";
					return flag;
				}
			}
		}
	}

	// 필수항목 체크 (상품명, 현금결제금액, 공급가액, 부가세, 봉사료, 구매자명, 주민등록번호(사업자번호,휴대폰번호), 구매자 이메일주소, 구매자 전화번호, )	

	// 현금결제금액 합산 체크
	// 현금결제금액 합산은 아래의 자바스크립트를 통해 반드시 확인 하도록 하시기 바라며, 
	// 아래의 자바스크립트를 사용하지 않아 발생된 문제는 상점에 책임이 있습니다.
	//	   
	//	var sump = eval(frm.sup_price.value) + eval(frm.tax.value) + eval(frm.srvc_price.value);
	//	
	//	if(eval(frm.sup_price.value) <= eval(frm.tax.value)){
	//		alert("공급가액이 부가세보다 작습니다");
	//		return false;
	//	}
	//	if(frm.cr_price.value != sump)
	//	{
	//		
	//		alert("총결제금액 합이 맞지 않습니다.");
	//		return false;
	//	}	
	//	else if(_TotalPayPrc < _ReceiptCost)
	//	{
	//		alert("모바일 상품권 현금영수증에 대한 총결제금액이 5천원 이상이어야 현금영수증 발행이 가능합니다.");
	//		return false;
	//	}
	if (giftReceipt != "N") {
		var totalAmt = parseInt(tot);
		if (totalAmt < 5000) {
			alert("모바일 상품권 현금영수증에 대한 총결제금액이 5천원 이상이어야 현금영수증 발행이 가능합니다.");
			flag="N";
			return flag;
		}		
	}

	return flag;
}

function pay_receipt_pay(receipt, regNum, tot) {
	// 필수항목 체크 (영수증 발행 용도에 따른 주민등록번호와 사업자번호 길이와 오류 체크)
	// 주민등록번호와 사업자등록번호, 휴대폰 번호의 정상적인 입력여부 확인을 위해 아래의 자바스크립트는 반드시 사용하여야 하며, 
	// 사용하지 않을경우 발생된 문제에 대한 책임은 상점에 있습니다.
	// 또한 휴대폰 사업자가 추가될 경우, 반드시 아래의 휴대폰 번호 체크 자바스크립트에 휴대폰 앞자리를 추가하시기 바랍니다. 
	// 이니시스에서는 실명확인 서비스를 제공하지 않으니, 실명확인 업체를 이용하시기 바랍니다.
	var flag = "Y";
	if (receipt == "") {
		alert("결제 수단 현금영수증에 대한 발행용도를 선택하세요. 필수항목입니다.");
		flag="N";
		return flag;
	}
	
	var type = $("input:radio[name=paymentType]:checked").val();
	if(type == "DirectBank" ||type == "VBank"){
		if (receipt == "0") {
			//alert("소득공제용 영수증을 선택하셨습니다.");
	
			/*		if(frm.reg_num.value.length !=13 && frm.reg_num.value.length !=10 && frm.reg_num.value.length !=11)
			 {
			 alert("올바른 주민등록번호 13자리 또는 휴대폰 번호 10자리(11자리)를 입력하세요.");
			 return false;
			 }*/
			/* 2014.08.22 주빈번호 허용X으로 변경 */
			//if (regNum.length < 10 || regNum.length > 19) {
			if (regNum.length < 10 || regNum.length > 11) {
				//alert("결제 수단 현금영수증에 대한 올바른 휴대폰번호 10자리(11자리) 또는 현금영수증 카드번호 18자리를 입력하세요.");
				alert("하이픈 (-)을 제외한 숫자 10자리(11자리)를 입력하세요.");
				flag="N";
				return flag;
//			} else if (regNum.length == 13) {
//				var obj = regNum;
//				var sum = 0;
//	
//				for (i = 0; i < 8; i++) {
//					sum += obj.substring(i, i + 1) * (i + 2);
//				}
//				for (i = 8; i < 12; i++) {
//					sum += obj.substring(i, i + 1) * (i - 6);
//				}
//				sum = 11 - (sum % 11);
//	
//				if (sum >= 10) {
//					sum -= 10;
//				}
//	
//				if (obj.substring(12, 13) != sum
//						|| (obj.substring(6, 7) != 1 && obj.substring(6, 7) != 2)) {
//					//alert("주민등록번호에 오류가 있습니다. 다시 확인하십시오.");
//					//return false;
//				} else {
//					alert("결제 수단 현금영수증에 대한 올바른 휴대폰번호 10자리(11자리) 또는 현금영수증 카드번호 18자리를 입력하세요.");
//					flag="N";
//					return flag;
//				}
//	
			} else if (regNum.length == 11 || regNum.length == 10) {
				var obj = regNum;
				if (obj.substring(0, 3) != "011" && obj.substring(0, 3) != "017"
						&& obj.substring(0, 3) != "016"
						&& obj.substring(0, 3) != "018"
						&& obj.substring(0, 3) != "019"
						&& obj.substring(0, 3) != "010") {
					alert("결제 수단 현금영수증에 대한 휴대폰 번호가 아니거나, 휴대폰 번호에 오류가 있습니다. 다시 확인 하십시오. ");
					flag="N";
					return flag;
				}
	
				var chr;
				for ( var i = 0; i < obj.length; i++) {
					chr = obj.substr(i, 1);
					if (chr < '0' || chr > '9') {
						alert("결제 수단 현금영수증에 대한 숫자가 아닌 문자가 휴대폰 번호에 추가되어 오류가 있습니다, 다시 확인 하십시오. ");
						flag="N";
						return flag;
					}
				}
			}
		} else if (receipt == "1") {
			//alert("지출증빙용 영수증을 선택하셨습니다.");
			var obj = regNum;
	
			/*		if(frm.reg_num.value.length !=10  && frm.reg_num.value.length !=11 && frm.reg_num.value.length !=13)
			 {
			 alert("올바른 주민등록번호 13자리, 사업자등록번호 10자리 또는 휴대폰 번호 10자리(11자리)를 입력하세요.");
			 frm.reg_num.focus();
			 return false;
			 }*/
			/* 2014.08.22 주빈번호 허용X으로 변경 */
			//if (regNum.length < 10 || regNum.length > 19) {
			if (regNum.length < 10 || regNum.length > 11) {
				//alert("결제 수단 현금영수증에 대한 올바른 휴대폰번호 10자리(11자리), 사업자등록번호 10자리 또는 현금영수증 카드번호 18자리를 입력하세요.");
				alert("하이픈 (-)을 제외한 숫자 10자리를 입력하세요.");
				//frm.reg_num.focus();
				flag="N";
				return flag;
			} else if (regNum.length == 13) {
				var obj = regNum;
				var sum = 0;
	
				for (i = 0; i < 8; i++) {
					sum += obj.substring(i, i + 1) * (i + 2);
				}
				for (i = 8; i < 12; i++) {
					sum += obj.substring(i, i + 1) * (i - 6);
				}
	
				sum = 11 - (sum % 11);
	
				if (sum >= 10) {
					sum -= 10;
				}
	
				if (obj.substring(12, 13) != sum
						|| (obj.substring(6, 7) != 1 && obj.substring(6, 7) != 2)) {
	
					//                	    alert("주민등록번호에 오류가 있습니다. 다시 확인하십시오.");
					//                	    frm.reg_num.focus();
					//                	    return false;
	
				} else {
					//alert("결제 수단 현금영수증에 대한 올바른 휴대폰번호 10자리(11자리), 사업자등록번호 10자리 또는 현금영수증 카드번호 18자리를 입력하세요.");
					alert("하이픈 (-)을 제외한 숫자 10자리를 입력하세요.");
					//frm.reg_num.focus();
					flag="N";
					return flag;
				}
	
			} else if (regNum.length == 10 && obj.substring(0, 1) != "0") {
				var vencod = regNum;
				var sum = 0;
				var getlist = new Array(10);
				var chkvalue = new Array("1", "3", "7", "1", "3", "7", "1", "3","5");
				for ( var i = 0; i < 10; i++) {
					getlist[i] = vencod.substring(i, i + 1);
				}
				for ( var i = 0; i < 9; i++) {
					sum += getlist[i] * chkvalue[i];
				}
				sum = sum + parseInt((getlist[8] * 5) / 10);
				sidliy = sum % 10;
				sidchk = 0;
				if (sidliy != 0) {
					sidchk = 10 - sidliy;
				} else {
					sidchk = 0;
				}
				if (sidchk != getlist[9]) {
					alert("결제 수단 현금영수증에 대한 사업자등록번호에 오류가 있습니다. 다시 확인하십시오.");
					//frm.reg_num.focus(); 
					flag="N";
					return flag;
				}
			} else if (regNum.length == 11 || regNum.length == 10) {
				var obj = regNum;
				if (obj.substring(0, 3) != "011" && obj.substring(0, 3) != "017"
						&& obj.substring(0, 3) != "016"
						&& obj.substring(0, 3) != "018"
						&& obj.substring(0, 3) != "019"
						&& obj.substring(0, 3) != "010") {
					alert("결제 수단 현금영수증에 대한 휴대폰 번호에 오류가 있습니다. 다시 확인 하십시오. ");
					//frm.reg_num.focus();
					flag="N";
					return flag;
				}
				var chr;
				for ( var i = 0; i < obj.length; i++) {
					chr = obj.substr(i, 1);
					if (chr < '0' || chr > '9') {
						alert("결제 수단 현금영수증에 대한 숫자가 아닌 문자가 휴대폰 번호에 추가되어 오류가 있습니다, 다시 확인 하십시오. ");
						//frm.reg_num.focus();
						flag="N";
						return flag;
					}
				}
			}
		}
	
		// 필수항목 체크 (상품명, 현금결제금액, 공급가액, 부가세, 봉사료, 구매자명, 주민등록번호(사업자번호,휴대폰번호), 구매자 이메일주소, 구매자 전화번호, )	
	
		// 현금결제금액 합산 체크
		// 현금결제금액 합산은 아래의 자바스크립트를 통해 반드시 확인 하도록 하시기 바라며, 
		// 아래의 자바스크립트를 사용하지 않아 발생된 문제는 상점에 책임이 있습니다.
		//	   
		//	var sump = eval(frm.sup_price.value) + eval(frm.tax.value) + eval(frm.srvc_price.value);
		//	
		//	if(eval(frm.sup_price.value) <= eval(frm.tax.value)){
		//		alert("공급가액이 부가세보다 작습니다");
		//		return false;
		//	}
		//	if(frm.cr_price.value != sump)
		//	{
		//		
		//		alert("총결제금액 합이 맞지 않습니다.");
		//		return false;
		//	}	
		//	else if(_TotalPayPrc < _ReceiptCost)
		//	{
		//		alert("모바일 상품권 현금영수증에 대한 총결제금액이 5천원 이상이어야 현금영수증 발행이 가능합니다.");
		//		return false;
		//	}
		var totalAmt = parseInt(tot);
		if (receipt != "N") {
			if (totalAmt < 5000) {
				alert("결제 수단 현금영수증에 대한 총결제금액이 5천원 이상이어야 현금영수증 발행이 가능합니다.");
				flag="N";
				return flag;
			}		
		}
	}
	return flag;
}


function orderFormTotalBox() {
	var $WRAP,
	   $TARGET = $('.order_right.fixed_right'),
	   $chkM = $('#tmp'),
	   $FOOTER = $('.footer'),
	   $TOTAL = $('.fixed_right'),
	   $mTotal = $('.order_bill_m');

	   var user = navigator.userAgent.toLowerCase();

	   if (user.indexOf("iphone")>-1||user.indexOf("ipad")>-1||user.indexOf("ipod")>-1||user.indexOf("samsungbrowser")>-1) {
			$WRAP = $('body');
		} else if (user.indexOf("safari")>-1&&user.indexOf("chrome")<=-1) {
			$WRAP = $('body');
		} else {
			$WRAP = $('html');
		}

	if ($TARGET.length > 0 && $chkM.length > 0) {
	   //모바일이 아닐 경우
	   if (!$chkM.is(':visible')) {
		  $('.order_content').css('position','relative');
		  if ($WRAP.scrollTop() > 100) {//스크롤이 내려갔을 경우
			 $TARGET.css({
				'position': 'absolute',
				'right':0,
			 });
			 //스크롤이 바닥일 경우 : 아닐경우
			 ($WRAP.scrollTop() > ($WRAP.height()-1355)) ? $TARGET.css({'top':'auto','bottom':0}) : $TARGET.css({'top':($('html,body').scrollTop()-150) + 'px'});
		  } else { //스크롤이 탑일 경우
			 $TARGET.css({
				'position': 'relative',
				'top':'auto',
				'right':'auto',
				'bottom':'auto'
			 });
		  }
		  $('.order_bill_m').css('visibility', 'hidden');
		} else {
			var $MobileScroll;

			if ($('body').scrollTop() > 0) {
				$MobileScroll = $('body').scrollTop();
			} else {
				$MobileScroll = $('html').scrollTop();
			}
			$TARGET.css({
				'position': 'relative',
				'top':'auto',
				'right':'auto',
				'bottom':'auto'
			});
			if ($MobileScroll > $TOTAL.offset().top - $TOTAL.height()) {
				$('.order_bill_m').css('visibility', 'hidden');
			} else {
				$('.order_bill_m').css('visibility', 'visible');
			}
		}
	}
 }
 
 
