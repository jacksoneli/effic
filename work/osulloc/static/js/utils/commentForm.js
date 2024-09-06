// utils/commentFormSet.js
// 댓글 파일 업로드 (Dropzone), 글자수 체크

'use strict';

define(['fileupload', 'ui'], function(Dropzone){

	function init(form_id) {
		var is_login = true;
		var $form = $(form_id);
		var fileuploader, fileuploaderRe;

		$(function(){
			if ( !$('#login-checker').length ) {
				is_login = false;

			} else {
				Dropzone.autoDiscover = false;

				Dropzone.options.fileuploader = {
					init: function() {
						this.on("addedfile", function(file) {
							console.log("disalbedSubmit");
							$('.x-add-comment').attr('disbled', 'true');
						});

						this.on("success", function(file, result) {
							var imageUrl = result.imageUrl;
							var path = result.imageFile;
							var $img = $('input[name="imagePath"]');

							if ( $img.length > 0 ){
								$img.remove();
							}
							$('<input>').attr('type','hidden').attr('name','imagePath').val(path).appendTo($form);
						});

						this.on("error", function(file, errorMessage, xhrError) {
							$('.dz-details').empty();
							alert("이미지가 등록되지 않았습니다. 다시 시도해주세요");
						});

						this.on("complete", function(file) {
							$('.x-add-comment').removeAttr('disbled');
						});

						this.on('removedfile', function(){
							$('input[name="imagePath"]').remove();
						});
					},
					dictFileTooBig: '용량이 10MB이상인 파일은 올릴 수 없습니다.',
					dictFallbackMessage: '이미지 미리보기를 지원하지 않는 브라우저입니다.',
					dictDefaultMessage: '<i class="icon-image"></i>이미지 등록',
					previewTemplate: document.getElementById('preview-template').innerHTML,
					maxFilesize: 10,
					maxFiles: 1,
					acceptedFiles : "image/*",
					clickable  : is_login
				};

				fileuploader = new Dropzone("#fileuploader", {url: '/kr/ko/file/upload/image'});

				require(['autosize', 'lib/jquery.maxlength.min'], function() {
//					$('textarea').textareaAutoSize();
					//모든 textarea가 아닌 아래 두개만 적용되도록 수정
					$('#comment-textarea').textareaAutoSize();
					$('#reply-textarea').textareaAutoSize();
					
					$('#comment-textarea').maxlength({
						counterContainer: $('#counter-comment'),
						text: '<b>%length</b>/' + $('#comment-textarea').attr('maxlength') +'자'
					});

					$('#comment-textarea').on("update.maxlength", function(event, element, lastLength, length, maxLength, left){
					    console.log(event, element, lastLength, length, maxLength, left);
					    if ( length > maxLength && length > lastLength ) {
					    	alert('댓글은 '+ maxLength +'자까지 입력 가능합니다.');
					    }
					});

					$('#comment-textarea').on('keydown', function(event){
						if ( $('#counter-comment').val() >= $('#comment-textarea').attr('maxlength') ) {
							switch (event.keyCode) {
								case 8:
								case 46:
									break;

								default: 
									alert('댓글은 '+ maxLength +'자까지 입력 가능합니다.');
									event.preventDefault();
									break;
							}
						}
					});

					$('#reply-textarea').maxlength({
						counterContainer: $('#counter-reply'),
						text: '<b>%length</b>/' + $('#reply-textarea').attr('maxlength') +'자'
					});
				});

			}

		});

	}

	// Dropzone.options.fileuploaderRe = {
	//     init: function() {
	// },
	//     dictDefaultMessage: '<i class="icon-image"></i>이미지 등록',
	//     previewTemplate: document.getElementById('preview-template').innerHTML,
	//     maxFilesize: 2,
	//     maxFiles: 1,
	//     acceptedFiles : "image/jpg,image/jpeg,image/png,image/gif"
	// };
	// fileuploaderRe = new Dropzone("#fileuploaderRe", {url: '/kr/ko/file/upload/image'});

	return {
		init: init
	};
});
