jQuery(document).ready(function($){
	$('.about__wrapper .link__call').click(function(){
		$(this).remove();
		$('.about__description .hidden__text').slideDown('slow');
	});
	
	$('.nav-li li').click(function(){
		$('.nav-li li').removeClass('active');
		$(this).addClass('active');
		
		var indx = $(this).index();
		$('.nav__tab-box').removeClass('active');
		$('.nav__tab-box').eq(indx).addClass('active');
		
		$('.gallery__slider').slick('setPosition');
	});
	
	$('.gallery__slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		prevArrow: '<span class="slick-prev"></span>',
		nextArrow: '<span class="slick-next"></span>',
	});
		
	$('.order').click(function(){
		$('.'+$(this).attr('data-modal')).addClass('show');
		var title = $(this).attr('data-title');
		if(title && (title != '') ){
			$('.'+$(this).attr('data-modal')).find('input[name="form_name"]').val(title);
		}
	});
	$('.modal__close,.overlay').click(function(){
		$('.modal').removeClass('show');
	});
	
	$('.mob-m button').click(function(){
		$(this).toggleClass('openm');
		$('body').toggleClass('open-m');
		if($(this).hasClass('openm')){
			$('footer').after('<div class="over_bg"></div>');
			$('.over_bg').click(function(){
				$(this).remove();
				$('body').toggleClass('open-m');
				$('.mob-m button').toggleClass('openm');
			});
		}else{
			$('.over_bg').remove();
		}
	});
	
	
	$(".bron").submit(function() {
		var str = $(this).serialize();
		$.ajax({
			type: "POST",
			url: "contact.php",
			data: str,
			success: function(msg) {
				if(msg == 'ok') {
					$('.popup2, .overlay').css('opacity','1');
					$('.popup2, .overlay').css('visibility','visible');
					$('.popup').css({'opacity':'0','visibility':'hidden'});
				}
				else {
					$('.popup2 .insText').html('<h5>Ошибка</h5><p>Сообщение не отправлено, убедитесь в правильности заполнение полей</p>');
					$('.popup2, .overlay').css('opacity','1');
					$('.popup2, .overlay').css('visibility','visible');
					$('.popup').css({'opacity':'0','visibility':'hidden'});
				}
			}
		});
		return false;
	});
	
	$(document).on("scroll", onScroll);
	
	
	
    $("a[href^=\\#]").not('.logo').click(function(e){
        e.preventDefault();
		$('body').removeClass('open-m');
		$('.mob-m button').removeClass('openm');
		$('.over_bg').remove();
        $(document).off("scroll");
        $(menu_selector + " a.active").removeClass("active");
        $(this).addClass("active");
        var hash = $(this).attr("href");
        var target = $(hash);
		
		var topNumb = 50;
		if(hash === '#section5'){
			topNumb = -100;
		}
		if($('body').outerWidth() < 960){
			topNumb = 60;
		}
		
        $("html, body").animate({
            scrollTop: target.offset().top - topNumb
        }, 500, function(){
            //window.location.hash = hash;
            //$(document).on("scroll", onScroll);
        });
    });
	
	$('.logo').click(function(e){
		e.preventDefault();
		var hash = $(this).attr("href");
		$("html, body").animate({
            scrollTop: 0
        }, 500, function(){
			window.location.hash = hash;
            $(document).on("scroll", onScroll);
        });
	});
});

var menu_selector = ".menu"; // Переменная должна содержать название класса или идентификатора, обертки нашего меню.
 
function onScroll(){
    var scroll_top = $(document).scrollTop();
    $(menu_selector + " a").each(function(){
        var hash = $(this).attr("href");
        var target = $(hash);
		console.log(hash);
        if (target.position().top <= scroll_top + 200 && target.position().top + target.outerHeight() > scroll_top) {
            $(menu_selector + " a.active").removeClass("active");
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
        }
    });
}

ymaps.ready(function () {
    // Создание экземпляра карты и его привязка к созданному контейнеру.
    var myMap = new ymaps.Map('map', {
            center: [52.048459, 113.510904],
            zoom: 17,
			controls: []
        }),

        // Создание макета балуна на основе Twitter Bootstrap.
        MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover top">' +
                '<a class="close hide_mp" href="#">&times;</a>' +
                '<div class="arrow"></div>' +
                '<div class="popover-inner">' +
                '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
                '</div>' +
                '</div>', {
                build: function () {
                    this.constructor.superclass.build.call(this);

                    this._$element = $('.popover', this.getParentElement());

                    this.applyElementOffset();

                    this._$element.find('.close')
                        .on('click', $.proxy(this.onCloseClick, this));
                },
                clear: function () {
                    this._$element.find('.close')
                        .off('click');

                    this.constructor.superclass.clear.call(this);
                },
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if(!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();

                    this.events.fire('shapechange');
                },
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                    });
                },
                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                },
                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },
                _isElement: function (element) {
                    return element && element[0] && element.find('.arrow')[0];
                }
            }),

        // Создание вложенного макета содержимого балуна.
        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover-title">$[properties.balloonHeader]</div>'
        ),

        // Создание метки с пользовательским макетом балуна.
        myPlacemark = window.myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            balloonHeader: 'ул. Журавлева 104',
            balloonContent: 'Контент балуна'
        }, {
            balloonShadow: false,
            balloonLayout: MyBalloonLayout,
            balloonContentLayout: MyBalloonContentLayout,
            balloonPanelMaxMapArea: 0,
            // Не скрываем иконку при открытом балуне.
            hideIconOnBalloonOpen: false,
            // И дополнительно смещаем балун, для открытия над иконкой.
            balloonOffset: [40, -30],
			iconLayout: 'default#image',
            iconImageHref: 'img/balloon.svg',
            iconImageSize: [60, 60],
        });
		

    myMap.geoObjects.add(myPlacemark);
	myMap.behaviors.disable('scrollZoom');
	myPlacemark.balloon.open();
});