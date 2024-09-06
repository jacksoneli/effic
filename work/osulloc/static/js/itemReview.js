/**
 * 상품 조회 화면에서 구매후기와 관련된 스크립트
 */

// 구매 후기 등록 submit
$('.btnReviewSubmit').click(function() {
	console.log("submit go");
	
	var text = $('#reviewForm textarea').val();
	if($.trim(text) != '') {
		var formData = new FormData(document.getElementById('reviewForm'));
		$.ajax({
			type : "POST",
			url : "/commentajax/submitReview",
			contentType : false,
			processData : false,
			dataType : "text",
			data : formData,
			success : function(response) {
				console.log("onSuccess");
				$('#reviewFormLayer').hide();
				$('#reviewForm').each(function() {
					this.reset();
				});
				$('#reviewList').html(response);
				alert("제품 후기가 등록 되었습니다.");
			},
			error : function() {
				console.log("onError");
				alert("오류가 발생하였습니다.");
			}
		});
	} else {
		alert("구매 후기내용을 입력해 주세요.");
		$('#reviewForm textarea').focus();
	}
});

// 구매후기 이미지 첨부 실행 - 로컬이미지 노출
$(document).on('click', '#reviewForm .btnUploadImage', function() {
	$('#uploadImage').click();
});

$('#uploadImage').on('change', function(event) {
	var tmppath = URL.createObjectURL(event.target.files[0]);
	if (tmppath != null) {
		$('.uploadImageThumb .imageThumb img').show().attr('src', tmppath);
		$('.uploadImageThumb .imageThumbDelete').show();
	} else {
		$('.uploadImageThumb .imageThumb img').hide()
		$('.uploadImageThumb .imageThumbDelete').hide()
	}

});
$('.uploadImageThumb .imageThumbDelete').click(function() {
	$('.uploadImageThumb .imageThumb img').hide();
	$('.uploadImageThumb .imageThumbDelete').hide()
	$('#uploadImage').val('');
});

// 비동기 이미지 첨부 실행 - 구매후기에서 미사용
$(document).on('click', '#reviewForm .btnAjaxUploadImage', function() {
	$('#ajaxUploadImage').click();
});

$('.ajaxUploadImageThumb .imageThumbDelete').click(function() {
	$('.ajaxUploadImageThumb .imageThumb img').hide();
	$('.ajaxUploadImageThumb .imageThumbDelete').hide()
	$('#ajaxUploadImage').val('');
	$('#ajaxUploadImagePath').removeAttr('value');
});

// 구매후기 작성 layer 표시와 검사
$(document).on('click', '.openReviewForm', function() {
	console.log("openReviewForm click");
	var canReview = $(this).data('can-review');
	var cstmId = $('#cstmId').prop('value');
	var layer = $('#reviewFormLayer');
	if (cstmId != null && cstmId != "") {
		if (canReview) {
			layer.show(); 
			layer.find('.btnReviewCancel').click(function(e) {
				layer.hide();
				$('#reviewForm').each(function() {
					this.reset();
				});
				$('.uploadImageThumb .imageThumbDelete').click();
			});
		} else {
			alert("해당 상품 구매이력이 없거나 이미 등록하셨습니다.\r\n다시 한번 확인해 주세요");
		}
	} else {
		alert("구매 후기를 작성하시려면 로그인 해주시기 바랍니다.");
	}
});

// 구매후기 삭제
$(document).on('click', '#reviewListTable .deleteComment', function() {
	console.log("delete go");
	if (confirm("구매후기를 삭제 하시겠습니까? \r\n적립된 찻잎포인트가 회수됩니다.")) {
		var commentId = $(this).data('comment-id');
		var itemId = $('#itemId').prop('value');
		var cstmId = $('#cstmId').prop('value');
		console.log("delete comment id : " + commentId);
		$.ajax({
			type : "POST",
			url : "/commentajax/delete",
			cache : false,
			data : "commentId=" + commentId + "&itemId=" + itemId + "&cstmId=" + cstmId,
			success : function(response) {
				alert("제품 후기가 삭제 되었습니다.");
				console.log("delete Success");
				$('#reviewListTable').replaceWith(response);
			},
			error : function() {
				console.log("delete Error");
				alert("오류가 발생하였습니다.");
			}
		});
	}
});

// 구매후기 페이지 이동
$(document).on('click', '.paging a', function() {
	console.log("item review paging");
	var url = $(this).data('link');
	$.ajax({
		type : "POST",
		url : url,
		cache : false,
		success : function(response) {
			$('#reviewListTable').replaceWith(response);
		},
		error : function() {
			alert("오류가 발생하였습니다.");
		}
	});
});

$(document).ready(function() {
	// 제품 상세 로딩 완료 후 구매 후기 read
	console.log("document ready");
	var itemId = $('#itemId').prop('value');
	var cstmId = $('#cstmId').prop('value');
	$.ajax({
		type : "POST",
		url : "/shop/item/" + itemId + "/review/list",
		cache : false,
		data : "&cstmId=" + cstmId,
		success : function(response) {
			$('#reviewList').html(response);
		},
		error : function() {
			alert("댓글 로딩 중 오류가 발생하였습니다.");
		}
	});

	// 비동기 파일업로드 처리
	$('#ajaxUploadImage').fileupload({
		type : 'POST',
		url : '/adminFileUpload/image',
		dataType : 'json',
		add : function(e, data) {
			var file = data.files[0];
			var isValid = true;

			if ((/png|jpe?g|png|gif/i).test(file.name)) {
				if (file.size > 5000000) { // 5mb
					alert('이미지는 최대 5MB까지 등록하실 수 있습니다.');
					isValid = false;
				}
			} else {
				alert('이미지는 .jpg, .jpeg, .png, .gif 파일만 등록이 가능합니다.');
				isValid = false;
			}
			if (isValid) {
				data.submit();
			}
		},
		done : function(e, data) {
			var filePath = data.result.filepath;
			$('.ajaxUploadImageThumb .imageThumb img').show().attr('src', filePath);
			$('.ajaxUploadImageThumb .imageThumbDelete').show();
			$('#ajaxUploadImagePath').attr('value',filePath);
		},
		fail : function() {
			alert("오류가 발생하였습니다.");
		}
	});
});
