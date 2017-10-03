var slider = {
  init: function($object) {
    this.size($object);
    this.bindUIActions($object);
    if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
      this.picsPositions($object, $(window).height());
    } else {
      $('.glow').hide();
      $('.box-pics').prependTo('#items-slide').css('position', 'absolute');
    }

  },
  bindUIActions: function($object) {
    var $sliderItem = $object.find('.pages-item');

    var navClicked = false;

    function sliderItemChange($item) {
      var color = $item.data('color'),
        $navItem = $('.sliderNav__item').eq($item.index());
      $item.addClass('pages-item_active').siblings('.pages-item').removeClass('pages-item_active');
      if (!navClicked) {
        $navItem.addClass('sliderNav__item_active').siblings('.sliderNav__item').removeClass('sliderNav__item_active');
      }
      if ($item.is(':last-child')) {
        $('.likes__btn').addClass('likes__btn_active');
        $('.likes-arrows').addClass('likes-arrows_active');
      } else {
        $('.likes__btn').removeClass('likes__btn_active');
        $('.likes-arrows').removeClass('likes-arrows_active');
      }
    }
    var lastScrollTop = 0;

    function bgChange() {
      var scrolltop = $(document).scrollTop();
      var e = [],
          t = -1,
          n = $(window).height();
      $(".pages-item").each(function() {
        var n = $(this).position().top - scrolltop;
        e.push(n);
        0 >= n && t++;
      });
      e.push(99999);
      var scrolled = Math.min(e[t + 1] / n, 1),
        startColor = $(".pages-item:eq(" + t + ")")
          .attr("data-color"),
        endColor = 1 == scrolled ? startColor : $(".pages-item:eq(" + (t + 1) + ")").attr("data-color");
      scrolled = 1 - scrolled;
      $('body').css("background", getColor(startColor, endColor, scrolled));
    }
    function getColor(e, t, n) {
      var startR = parseInt(e.substr(0, 2), 16),
        startG = parseInt(e.substr(2, 2), 16),
        startB = parseInt(e.substr(4, 2), 16),
        endR = parseInt(t.substr(0, 2), 16),
        endG = parseInt(t.substr(2, 2), 16),
        endB = parseInt(t.substr(4, 2), 16),
        R = Math.round(startR + (endR - startR) * n),
        G = Math.round(startG + (endG - startG) * n),
        B = Math.round(startB + (endB - startB) * n);
      return "rgb(" + R + "," + G + "," + B + ")"
    }

    $(window).on('scroll', function() {
      var scrolltop = $(document).scrollTop(),
          lastSlideTop = $('.pages-item').last().offset().top -1,
          planeLine = $('#items-slide').offset().top - ($(window).height()/1.2);
      if (scrolltop > 0 && scrolltop < lastSlideTop) {
        $('.logo, .yagoodza').fadeIn();
        $('.copyright, .nav, .sliderNav').fadeIn();
        if (scrolltop > planeLine && scrolltop > lastScrollTop) {
          $('.plane').not('done').addClass('done');
        }
      } 
      if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
        bgChange();
      }

      lastScrollTop = scrolltop;
    });
    $sliderItem.waypoint(function(direction) {
      if (direction === 'down') {
        sliderItemChange($(this));
        //change down
      }
    }, { offset: 0 });

    $sliderItem.waypoint(function(direction) {
      if (direction === 'up') {
        sliderItemChange($(this));
        // change up
      }
    }, {
      offset: function() {
        // This is the calculation that would give you
        // "bottom of element hits middle of window"
        return $.waypoints('viewportHeight') - 10 - $(this).outerHeight();
      }
    });

    var $sliderNav = $('.sliderNav');

    $sliderNav.on('click', '.sliderNav__item', function (e) {
      e.preventDefault();
      navClicked = true;
      var $item = $(this),
          index = $item.index(),
          scrollHeight = $('.pages-item').eq(index).offset().top;

      $item.addClass('sliderNav__item_active').siblings('.sliderNav__item').removeClass('sliderNav__item_active');

      $('html, body').stop().animate({ scrollTop: scrollHeight}, 1500, 'easeInOutQuint', function() {
        navClicked = false;
      });
    });
    $('.main-scroll').on('click', function(e) {
      e.preventDefault();
      $sliderNav.find('.sliderNav__item').eq(1).click();
    });
    $sliderItem.on('click', '.js-change-slide', function(e) {
      e.preventDefault();
      var index = $(this).parents('.pages-item').index() + 1;
      $sliderNav.find('.sliderNav__item').eq(index).click();
    });
    /*$sliderItem.on('click', '.emotions .btn', function(e) {
      e.preventDefault();
      $('.box-slide-link').click();
    });
    $sliderItem.on('click', '.about-box .btn', function(e) {
      e.preventDefault();
      $('.inside-slide-link').click();
    });
    $sliderItem.on('click', '.box-info .btn, .team .btn', function(e) {
      e.preventDefault();
      $('.offer-slide-link').click();
    });*/

    function nextSlide () {
      if (!$('html, body').is(':animated')) {
        $('.sliderNav__item_active').next().click();
      }
    }
    function prevSlide() {
      if (!$('html, body').is(':animated')) {
        $('.sliderNav__item_active').prev().click();
      }
    }
    var KEY_UP = 38,
        KEY_DOWN = 40;
    $(document).keydown(function(e){
      if (e.keyCode == KEY_UP) {
        prevSlide();
        return false;
      } else if (e.keyCode == KEY_DOWN) {
        nextSlide();
        return false;
      }
    });
    $('html, body').mousewheel(function(event, delta, deltaX, deltaY) {
      event.preventDefault();
      if (delta < 0) {
        // down
        nextSlide();
      } else if (delta > 0) {
        // up
        prevSlide();
      }
    });

    function updSprite() {
      var $element = $('.animated');
      var position = $element.css('background-position');
      if (position == '0px 100%') {
        position = '0 0'
      } else {
        position = '0px 100%'
      }
      $element.css('background-position', position);
    }
    setInterval(updSprite, 100);

    if((/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
      $('.pages-item').each(function() {
        var color = $(this).data('color');
        $(this).css({'background': '#'+color, 'margin': '0', 'overflow': 'hidden'});
      });
    }
  },
  size: function($object) {
    var $sliderItem = $object.find('.pages-item');
    var screenHeight = $(window).height();

    $sliderItem.each(function() {
      var $item = $(this);
      $item.height(screenHeight);
    });
    this.scale($object, screenHeight);
  },
  resize: function($object) {
    this.size($object);
  },
  scale : function($object, height) {
    var $scaleItem = $object.find('.scale-item'),
        maxHeight = height*0.8,
        maxWidth = $(window).width()*0.7,
        count = $scaleItem.length;
    for (var i=0; i<count; i++) {
      var itemHeight = $scaleItem.eq(i).height(),
        itemWidth = $scaleItem.eq(i).width(),
        scaleRation = 1;
      if (itemHeight > maxHeight) {
        scaleRation = maxHeight / itemHeight;
      }
      itemWidth = itemWidth * scaleRation;
      if (itemWidth > maxWidth && scaleRation > (maxWidth / itemWidth)) {
        scaleRation = maxWidth / itemWidth;
      }
      $scaleItem.eq(i).css({
        '-webkit-transform' : 'scale('+scaleRation+')',
        '-moz-transform' : 'scale('+scaleRation+')',
        '-ms-transform' : 'scale('+scaleRation+')',
        '-o-transform' : 'scale('+scaleRation+')',
        'transform' : 'scale('+scaleRation+')'
      });
    }
  },
  picsPositions: function($object, screenH) {
    var startPoint = parseInt($object.find('#items-slide').offset().top),
        middlePoint = parseInt($object.find('#box-inside').offset().top),
        lastPoint = middlePoint + 200,
        endPoint = parseInt($object.find('#box-inside').next().offset().top - screenH/2),
        firstPoint = parseInt(startPoint - 200),
        contW = $('.container').width();
    var offsetDiff = 150;
    $('.box-pics__item').each(function (index) {
      var $pic = $(this);
      $pic.data('top', $pic.position().top);
      $pic.data('left', $pic.position().left);
      $pic.css('top', $pic.height() + screenH);
      $pic.attr('data-0', 'top:'+parseInt($pic.css('top'))+'px'+';'+'left:'+(parseInt($pic.data('prev-left')*contW))+'px');
      $pic.attr('data-'+(startPoint-screenH)+'', 'top:'+parseInt($pic.css('top'))+'px'+';'+'left:'+(parseInt($pic.data('prev-left')*contW))+'px');
      $pic.attr('data-'+firstPoint+'', 'top:'+parseInt($pic.data('prev-top')*screenH)+'px'+';'+'left:'+(parseInt($pic.data('prev-left')*contW))+'px'); //left:'+parseInt($pic.data('next-left')*contW)+'px');
      $pic.attr('data-'+startPoint+'', 'top:'+parseInt($pic.data('top'))+'px'+';'+'left:'+parseInt($pic.data('left'))+'px');
      $pic.attr('data-'+middlePoint+'', 'top:'+parseInt($pic.data('next-top')*screenH)+'px'+';'+'left:'+(parseInt($pic.data('next-left')*contW))+'px'); //left:'+parseInt($pic.data('next-left')*contW)+'px');
      $pic.attr('data-'+lastPoint+'', 'top:'+parseInt($pic.data('last-top')*screenH)+'px'+';'+'left:'+(parseInt($pic.data('last-left')*contW))+'px'); //left:'+parseInt($pic.data('next-left')*contW)+'px');

      $pic.attr('data-'+endPoint+'', 'top:'+(0-$pic.height())+'px');
    });
  }
};

$(document).ready(function () {
  slider.init($('.pages'));
  console.log("ready");
  $(window).resize(function () {
    slider.resize($('.pages'));
  });
});
(function(){

  /**
   * Decimal adjustment of a number.
   *
   * @param	{String}	type	The type of adjustment.
   * @param	{Number}	value	The number.
   * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
   * @returns	{Number}			The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }

})();

$(document).ready(function(){
  $("#review-form").css("top", $(window).height()/2-$("#review-form").height()/2-50);
    $('.call-review').hover( function(){
    $(this).stop(true, true);
    $(this).animate({ left: '+=93'}, 200);
    }, function(){
      $(this).stop(true, true);
      $(this).animate({ left: '-=93'}, 200);
    });

    $('.call-review').click( function() {
        $("#review-form").stop(true, true).animate({ left: $(window).width()/2 - 576/2}, 125);
        if ($.support.opacity)
          $("#blacky").show().animate({opacity: 0.3}, 100);
        return false;
    });
    $("#blacky").click(function(){
      $("#review-form").stop(true, true).animate({ left: -576}, 100);
      if ($.support.opacity)
        $("#blacky").animate({opacity: 0}, 100, function(){$("#blacky").hide()});
    });
    $('#review-form form').submit(function(){
        $.post("/ajax/box_review.php",
            {
                form: 'review',
                //EMAIL: $("[name=EMAIL]", this).val(),
                NAME: $("[name=NAME]", this).val(),
                REVIEW: $("[name=REVIEW]", this).val()
            },
            function(data){
                if (data == "ok")
                    $("#review-form form").replaceWith("<p class=\"final-message malina-font\">РЎРїР°СЃРёР±Рѕ Р·Р° РІР°С€ РѕС‚Р·С‹РІ Рѕ РїСЂРѕРµРєС‚Рµ EnjoyMe BOX!</p><p class=\"final-message\">Р‘Р»Р°РіРѕРґР°СЂСЏ РІР°Рј РјС‹ Р·РЅР°РµРј Рє С‡РµРјСѓ СЃС‚СЂРµРјРёС‚СЊСЃСЏ, РєР°Рє СЃРґРµР»Р°С‚СЊ РµРіРѕ Р»СѓС‡С€Рµ, СѓРґРѕР±РЅРµРµ, РёРЅС‚РµСЂРµСЃРЅРµРµ Рё РґР°СЂРёС‚СЊ РµС‰С‘ Р±РѕР»СЊС€Рµ СЌРјРѕС†РёР№ РѕС‚ РїРѕР»СѓС‡РµРЅРёСЏ РєР°Р¶РґРѕР№ РєРѕСЂРѕР±РѕС‡РєРё.<br />РћСЃС‚Р°РІР°Р№С‚РµСЃСЊ СЃ РЅР°РјРё, РїРѕРґРїРёСЃС‹РІР°Р№С‚РµСЃСЊ РЅР° РЅРѕРІС‹Рµ РєРѕСЂРѕР±РѕС‡РєРё Рё РґРµР»РёС‚РµСЃСЊ СЃРІРѕРёРјРё СЌРјРѕС†РёСЏРјРё РІРјРµСЃС‚Рµ СЃ EnjoyMe BOX!</p>");
            }
        );
        return false;
    });
});
