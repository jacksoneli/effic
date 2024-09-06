; (function ($) {

	// �����̵� �� �÷�����
	// ��� ��
	// $('#slidesContainer').slideShow({currentPosition:0, slideWidth: 260});
	//				==> {currentPosition:0, slideWidth: 260} ���� ���� ��� �⺻ ��

	$.fn.slideShow = function(options) {

		var opts = jQuery.extend({}, jQuery.fn.slideShow.defaults, options);
		 
		return this.each(function() {
	
			/* �����̵� ���� */
			var $slides = $('.'+opts.slideId);				//�����̵� �ڽĵ� ��������			
			var numberOfSlides = $slides.length;		//�����̵� �ڽĵ� ����			
			var $leftBtn = $('#'+opts.leftBtnId);		//�����̵� ���� ��ư			
			var $rigthBtn = $('#'+opts.rigthBtnId);	//�����̵� ���� ��ư
			var strLoopWay = 'next';							//�Ѹ� ����
			/* �����̵� ���� */

			/* �ڵ��Ѹ� ���� */			
			var strAutoPlay = '';									//�ݺ� Interval ����	
			var $AutoDiv = $('#'+opts.AutoDivId);	//���콺 ����/ �ƿ��� �ݺ� ���߰� �������� div 
			/* �ڵ��Ѹ� ���� */

			//�ݺ����� �ʰ� �������� 0 �� ��� ���� ��ư �����   slideLoop : false ���
			if( !opts.slideLoop && opts.currentPosition == 0 ) $leftBtn.hide();
			if( !opts.slideLoop && opts.currentPosition == (numberOfSlides - 1) ) $rigthBtn.hide();

			//����, ���� ��ư�� �׼� �߰�
			$leftBtn.click(function(){
				strLoopWay = 'pre'
				Slide();
			});
			$rigthBtn.click(function(){
				strLoopWay = 'next'
				Slide();
			});

			//�ڵ� �Ѹ� ����
			$AutoDiv.mouseover(function(){
				AutoPlayStop();
			});
			$AutoDiv.mouseout(function(){
				AutoPlayStart();
			});


			//�ڽĳ�带 ���ο� div �� ���
			//�ͽ��÷η�9 �� ��� ����
			if( navigator.appVersion.indexOf("MSIE 9") > -1 ) 
			{
				div = document.createElement("DIV");
				div.id = opts.slideShowId;

				$slides.wrapAll(div).css({'width' : opts.slideWidth, 'height': opts.slideHeight});
			} 
			else  
			{
				$slides.wrapAll('<div id="'+opts.slideShowId+'"></div>').css({'width' : opts.slideWidth, 'height': opts.slideHeight});
			}			

			//�� ��ü ���
			var $sliderInner = $('#'+opts.slideShowId);
			$sliderInner.css('width', opts.slideWidth * numberOfSlides);

			//�¿� �����̵� �� ���
			if( opts.slideWay == 'left' )
			{
				$slides.css({'float':'left'});
				$sliderInner.animate({
					'marginLeft' : opts.slideWidth * (-opts.currentPosition)
				});
			}
			else	//���� �����̵��� ���
			{
				$sliderInner.animate({
					'marginTop' : opts.slideHeight * (-opts.currentPosition)
				});
			}

			//��ư Ŭ���� ���� �Լ�
			function Slide() 
			{			
				if( strLoopWay == 'pre' )
				{
					opts.currentPosition = opts.currentPosition - 1;

					//�����̸鼭 ���� ��ġ�� 0���� ���� ���
					if( opts.slideLoop )
					{
						if( opts.currentPosition < 0 )
						{
							opts.currentPosition = 1;
							
							if( opts.slideWay == 'left' ) $sliderInner.css( 'marginLeft', opts.slideWidth * (-opts.currentPosition) );
							else $sliderInner.css( 'marginTop', opts.slideHeight * (-opts.currentPosition) );

							$('#'+opts.slideShowId +' div:last-child').insertBefore($('#'+opts.slideShowId +' div:first-child'));
							opts.currentPosition = 0;
						}
					}
					else if( !opts.slideLoop && opts.currentPosition <= 0 )
					{
						opts.currentPosition = 0;
						$rigthBtn.show();
						$leftBtn.hide();
					}
				}
				else
				{
					opts.currentPosition = opts.currentPosition + 1;
					
					//�����̸鼭 ������ġ�� ��ü���� Ŭ ���
					if( opts.slideLoop )
					{
						if( opts.currentPosition > numberOfSlides - 1 )
						{
							opts.currentPosition = numberOfSlides - 2;

							if( opts.slideWay == 'left' ) $sliderInner.css( 'marginLeft', opts.slideWidth * (-opts.currentPosition) );
							else $sliderInner.css( 'marginTop', opts.slideHeight * (-opts.currentPosition) );

							$('#'+opts.slideShowId +' div:first-child').insertAfter($('#'+opts.slideShowId +' div:last-child'));
							opts.currentPosition = opts.currentPosition + 1;
						}
					}
					else if( !opts.slideLoop && opts.currentPosition >= numberOfSlides - 1 )
					{
						opts.currentPosition = numberOfSlides - 1;
						$leftBtn.show();
						$rigthBtn.hide();
					}
				}

				//����, �¿콽���̵� �׼� ����
				if( opts.slideWay == 'left' )
				{
					$sliderInner.animate({
						'marginLeft' : opts.slideWidth * (-opts.currentPosition)
					});
				}
				else
				{
					$sliderInner.animate({
						'marginTop' : opts.slideHeight * (-opts.currentPosition)
					});
				}
			}

			//�ڵ��Ѹ� ����
			function AutoPlayStart()
			{
				strAutoPlay = window.setInterval( function() {
					Slide();
				}, opts.AutoPlayTime);
			}

			//�ڵ��Ѹ� ����
			function AutoPlayStop()
			{
				window.clearInterval(strAutoPlay);
			}

			//�ڵ��Ѹ� ����
			if( opts.slideAuto ) AutoPlayStart();			

		});
	};

	//slideShow �÷������� �⺻ �ɼǵ��̴�.
	jQuery.fn.slideShow.defaults = {
		currentPosition: 0,				//������
		slideWidth: 540,					//���λ�����
		slideHeight: 37,					//���λ�����
		slideId: 'slide',						//�ڽĳ�� ���̵�
		leftBtnId: 'left',						//������ư ���̵�
		rigthBtnId: 'right',				//������ư ���̵�
		slideShowId: 'slideInner',	//�����̵� �θ� ������ ���̵�
		slideWay: 'left',					//�����̵� ����	���� ��� ����
		slideLoop: true,					//�ݺ� ����  false �� ��� ����
		slideAuto: true,					//�ڵ��Ѹ� ����
		AutoDivId: 'slideshow',		//���콺 ����/�ƿ��� ����Ѹ� ����
		AutoPlayTime: 4000			//�ڵ��Ѹ� �ð�
	};

}) (jQuery);