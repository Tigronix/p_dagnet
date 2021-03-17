'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var select = function select() {

  var selects = document.querySelectorAll('.js-select');

  selects.forEach(function (select) {

    var btn = select.querySelector('.js-select-btn');

    var text = select.querySelector('.js-select-text');

    var options = select.querySelectorAll('.js-select-option');

    var close = function close() {

      select.classList.remove('active');
    };

    var open = function open() {

      select.classList.add('active');
    };

    btn.addEventListener('click', function (e) {

      var isActive = select.classList.contains('active');

      if (isActive) {

        close();
      } else {

        open();
      }
    });

    options.forEach(function (option) {

      option.addEventListener('click', function () {

        var value = option.innerText;

        text.innerText = value;

        close();
      });
    });

    document.documentElement.addEventListener('click', function (event) {

      var isClickWithinOpenedDiv = top_walker(event.target, function (node) {

        return node === select;
      });

      if (isClickWithinOpenedDiv) {} else {

        close();
      }
    }, true);
  });
};

var mainSlider = function mainSlider() {
  var sliders = document.querySelectorAll('.js-main-slider');

  sliders.forEach(function (slider) {
    var options = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 400,
      prevArrow: '<button type="button" class="map-arrow map-arrow--left" tabindex="0"><svg class="icon icon-circle-arrow-left arrow__icon"><use xlink:href="#circle-arrow-left"></use></svg></button>',
      nextArrow: '<button type="button" class="map-arrow map-arrow--right" tabindex="0"><svg class="icon icon-circle-arrow-right arrow__icon"><use xlink:href="#circle-arrow-right"></use></svg></button>'
    };

    $(slider).slick(options);
  });
};

var rangeSlider = function rangeSlider() {
  var sliders = document.querySelectorAll('.js-range-slider');
  var totalPrices = document.querySelectorAll('.js-build-price');
  var summArray = [];
  var summ = 0;

  var updateInfo = function updateInfo(slider, type, lexicon) {
    var numberNodes = document.querySelectorAll('.js-' + type + '-number');
    var keyNodes = document.querySelectorAll('.js-' + type + '-key');
    var activeItem = slider.querySelector('.js-li.active');
    var currentValue = activeItem.querySelector('.js-item').innerText;

    numberNodes.forEach(function (numberNode) {
      numberNode.innerText = currentValue;
    });

    keyNodes.forEach(function (keyNode) {
      var keyText = declOfNum(currentValue, lexicon);
      keyNode.innerText = keyText;
    });
  };

  var makeCircles = function makeCircles(slider) {
    var isInet = slider.classList.contains('js-range-slider-inet');
    var isTv = slider.classList.contains('js-range-slider-tv');
    var isInetTv = slider.classList.contains('js-range-slider-tv-inet');

    var buildCircles = function buildCircles(circle, slider, type, lexiconArray) {
      var circleNode = document.querySelector('.' + circle);
      var liItems = slider.querySelectorAll('.js-li');
      var activePercent = 0;

      // get active percent
      liItems.forEach(function (liItem, index, array) {
        var isActive = liItem.classList.contains('active');

        if (isActive) {
          var totalNumber = array.length - 1;
          var currentIndex = index;

          activePercent = getPercentNumberFromNumber(totalNumber, currentIndex);
        }
      });

      var fillPercent = getPercent(360, activePercent);
      DAG.changeCircle(circleNode, fillPercent);
      updateInfo(slider, type, lexiconArray);
    };

    if (isInet) {
      buildCircles('js-circle-inet', slider, 'inet', ['Мбит/с', 'Мбит/с', 'Мбит/с']);
    } else if (isTv) {
      buildCircles('js-circle-tv', slider, 'tv', ['Канал', 'Канала', 'Каналов']);
    } else if (isInetTv) {
      buildCircles('js-circle-inet-tv', slider, 'inet-tv', ['Канал', 'Канала', 'Каналов']);
    }
  };

  var calc = function calc() {
    var items = document.querySelectorAll('.js-li');
    summArray = [];

    items.forEach(function (item) {
      var isActive = item.classList.contains('active');

      if (isActive) {
        var dataPrice = parseInt(item.getAttribute('data-price'));

        summArray.push(dataPrice);
        var reducer = function reducer(accumulator, currentValue) {
          return accumulator + currentValue;
        };
        summ = summArray.reduce(reducer);
      }
    });

    totalPrices.forEach(function (totalPrice) {
      totalPrice.innerText = summ;
    });
  };

  calc();

  sliders.forEach(function (slider, index) {
    var btn = slider.querySelector('.js-btn');
    var bar = slider.querySelector('.js-bar');
    var items = slider.querySelectorAll('.js-li');
    var optionCoords = [];

    var getOptionCoords = function getOptionCoords() {
      optionCoords = [];

      items.forEach(function (item) {
        var offsetLeft = item.offsetLeft;

        item.setAttribute('data-left', offsetLeft);
        optionCoords.push(offsetLeft);
      });
    };

    var changeBtnPosition = function changeBtnPosition() {
      var slider = btn.closest('.js-range-slider');
      var barLeft = bar.offsetLeft;
      var barWidth = bar.getBoundingClientRect().width;
      var btnLeft = DAG.cursorX - barLeft;

      if (btnLeft > barWidth) {
        btnLeft = barWidth;
      } else if (btnLeft < 0) {
        btnLeft = 0;
      }

      var closest = optionCoords.reduce(function (a, b) {
        return Math.abs(b - btnLeft) < Math.abs(a - btnLeft) ? b : a;
      });

      // add or remove "active"
      items.forEach(function (item) {
        var itemLeft = item.getAttribute('data-left');
        var isActive = itemLeft == closest;

        if (isActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      btn.style.left = closest + 'px';
      calc();
      makeCircles(slider);
    };

    var changeInitialPosition = function changeInitialPosition() {
      items.forEach(function (item) {
        var isActive = item.classList.contains('active');

        if (isActive) {
          var offsetLeft = item.offsetLeft;
          btn.style.left = offsetLeft + 'px';
        }
      });
    };

    var btnChangePositionMobile = function btnChangePositionMobile(e) {
      var slider = btn.closest('.js-range-slider');
      var isInet = slider.classList.contains('js-range-slider-inet');
      var isTv = slider.classList.contains('js-range-slider-tv');
      var isInetTv = slider.classList.contains('js-range-slider-tv-inet');
      var touchClientX = e.touches[0].clientX;
      var barLeft = bar.offsetLeft;
      var barWidth = bar.getBoundingClientRect().width;
      var btnLeft = touchClientX - barLeft;

      if (btnLeft > barWidth) {
        btnLeft = barWidth;
      } else if (btnLeft < 0) {
        btnLeft = 0;
      }

      var closest = optionCoords.reduce(function (a, b) {
        return Math.abs(b - btnLeft) < Math.abs(a - btnLeft) ? b : a;
      });

      // add or remove "active"
      items.forEach(function (item) {
        var itemLeft = item.getAttribute('data-left');
        var isActive = itemLeft == closest;

        if (isActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      btn.style.left = closest + 'px';
      calc();

      if (isInet) {
        updateInfo(slider, 'inet', ['Мбит/с', 'Мбит/с', 'Мбит/с']);
      } else if (isTv) {
        updateInfo(slider, 'tv', ['Канал', 'Канала', 'Каналов']);
      } else if (isInetTv) {
        updateInfo(slider, 'inet-tv', ['Канал', 'Канала', 'Каналов']);
      }
    };

    // init
    getOptionCoords();
    changeInitialPosition();
    makeCircles(slider);

    // events
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        changeBtnPosition();
      });
    });

    btn.addEventListener('mousedown', function () {
      window.addEventListener('mousemove', changeBtnPosition);
      btn.classList.add('active');
    });

    window.addEventListener('mouseup', function () {
      window.removeEventListener('mousemove', changeBtnPosition);
      btn.classList.remove('active');
    });

    btn.addEventListener('touchstart', function () {
      window.addEventListener('touchmove', btnChangePositionMobile, true);
      btn.classList.add('active');
    });

    btn.addEventListener('touchend', function () {
      window.removeEventListener('touchmove', btnChangePositionMobile, true);
      btn.classList.remove('active');
    });
  });
};

var tabs = function tabs() {
  var btns = document.querySelectorAll('[data-tabclass]');

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var contentData = btn.getAttribute('data-tabclass');
      var btnNumberData = btn.getAttribute('data-tabnumber');
      var contentNodes = document.querySelectorAll('.' + contentData);
      var btnSiblings = getSiblings(btn);

      // toggle btn class
      btnSiblings.forEach(function (btnSibling) {
        btnSibling.classList.remove('active');
      });

      btn.classList.add('active');

      // toggle contentNodes
      contentNodes.forEach(function (contentNode) {
        var items = Array.from(contentNode.children);

        items.forEach(function (item) {
          var itemNumberData = item.getAttribute('data-tabnumber');
          var isNumberEqual = itemNumberData == btnNumberData;

          if (isNumberEqual) {
            var siblings = getSiblings(item);

            siblings.forEach(function (sibling) {
              sibling.classList.remove('active');
            });

            item.classList.add('active');
          }
        });
      });
    });
  });
};

function pick() {
  var items = document.querySelectorAll('.js-pick');

  items.forEach(function (item) {
    var btn = item.querySelector('.js-pick-btn'),
        span = btn.querySelector('span');

    btn.addEventListener('click', function (event) {
      if (item.classList.contains('pick')) {
        item.classList.remove('pick');
        span.textContent = 'Выбрать';
      } else {
        item.classList.add('pick');
        span.textContent = 'Выбрано';
      }
    });
  });
}
var tripleSlider = function tripleSlider() {
  var sliders = document.querySelectorAll('.js-triple-slider');

  sliders.forEach(function (slider) {
    var options = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 400,
      slidesToShow: 3,
      responsive: [{
        breakpoint: 981,
        settings: {
          variableWidth: true,
          slidesToShow: 1
        }
      }]
    };

    $(slider).slick(options);
  });
};

var doubleSlider = function doubleSlider() {
  var sliders = document.querySelectorAll('.js-double-slider');

  sliders.forEach(function (slider) {
    var options = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 400,
      slidesToShow: 2,
      responsive: [{
        breakpoint: 981,
        settings: {
          slidesToShow: 1
        }
      }]
    };

    $(slider).slick(options);
  });
};

var circleHover = function circleHover() {
  var circleHovers = document.querySelectorAll('.build__circle-hover');
  var fromMobile = window.matchMedia('(min-width: 981px)').matches;

  circleHovers.forEach(function (circleHover) {
    var changeDescPosition = function changeDescPosition(e, elem) {
      var isClassList = e.target.classList;

      if (isClassList) {
        var isElem = e.target.classList.contains('js-icon-' + elem);

        if (isElem) {
          var _elem = e.target;
          var descData = _elem.getAttribute('data-desc');
          var descNode = document.querySelector('.' + descData);
          var positionX = DAG.cursorX + 10;
          var positionY = DAG.cursorY + 20;

          // set desc position
          descNode.setAttribute('style', 'left: ' + positionX + 'px; top: ' + positionY + 'px;');
          descNode.classList.add('active');

          _elem.addEventListener('mouseleave', function () {
            descNode.classList.remove('active');
          });
        }
      }
    };

    if (fromMobile) {
      window.addEventListener('mousemove', function (e) {
        changeDescPosition(e, 'inet');
        changeDescPosition(e, 'tv');
        changeDescPosition(e, 'inet-tv');
      });
    }
  });
};

var search = function search() {
  var searchNodes = document.querySelectorAll('.js-search');

  searchNodes.forEach(function (searchNode) {
    var defaultNode = searchNode.querySelector('.js-default');
    var activeNode = searchNode.querySelector('.js-active');
    var openBtns = searchNode.querySelectorAll('.js-btn');
    var closeBtns = searchNode.querySelectorAll('.js-close-btn');

    var open = function open() {
      searchNode.classList.add('active');
    };

    var close = function close() {
      searchNode.classList.remove('active');
    };

    openBtns.forEach(function (openBtn) {
      openBtn.addEventListener('click', function () {
        open();
      });
    });

    closeBtns.forEach(function (closeBtn) {
      closeBtn.addEventListener('click', function () {
        close();
      });
    });
  });
};

var menu = function menu() {
  var btnsOpen = document.querySelectorAll('.js-menu-open');
  var btnsClose = document.querySelectorAll('.js-menu-close');

  btnsOpen.forEach(function (btnOpen) {
    btnOpen.addEventListener('click', function () {
      var menu = document.querySelector('.js-menu');
      var isActive = menu.classList.contains('active');

      menu.classList.add('active');
      DAG.body.classList.add('overflow');
    });
  });

  btnsClose.forEach(function (btnClose) {
    btnClose.addEventListener('click', function () {
      var menu = document.querySelector('.js-menu');
      var isActive = menu.classList.contains('active');

      menu.classList.remove('active');
      DAG.body.classList.remove('overflow');
    });
  });
};

var triangle = function triangle() {
  var container = document.querySelector('.js-about-container');
  var triangle = document.querySelector('.js-about-triangle');

  var updateTriangleSize = function updateTriangleSize(container, triangle) {
    var containerInfo = getComputedStyle(container);
    var containerMarginRight = parseInt(containerInfo.marginRight);
    var containerPaddingRight = parseInt(containerInfo.paddingRight);
    var triangleWidth = (containerMarginRight + containerPaddingRight) / 10;

    triangle.setAttribute('style', 'font-size: ' + triangleWidth + 'rem;');
  };

  updateTriangleSize(container, triangle);

  window.addEventListener('resize', function () {
    updateTriangleSize(container, triangle);
  });
};

var searchMenu = function searchMenu() {
  var btnsOpen = document.querySelectorAll('.js-search-mobile-btn');
  var btnsClose = document.querySelectorAll('.js-search-close');

  btnsOpen.forEach(function (btnOpen) {
    btnOpen.addEventListener('click', function () {
      var menu = document.querySelector('.js-search-popup');
      var isActive = menu.classList.contains('active');

      menu.classList.add('active');
      DAG.body.classList.add('overflow');
    });
  });

  btnsClose.forEach(function (btnClose) {
    btnClose.addEventListener('click', function () {
      var menu = document.querySelector('.js-search-popup');
      var isActive = menu.classList.contains('active');

      menu.classList.remove('active');
      DAG.body.classList.remove('overflow');
    });
  });
};

var contentSlider = function contentSlider() {
  var sliders = document.querySelectorAll('.js-slider-content');

  sliders.forEach(function (slider) {
    var options = {
      dots: false,
      arrows: false,
      infinite: false,
      speed: 400,
      slidesToShow: 1,
      asNavFor: '.js-slider-bottom',
      adaptiveHeight: true
    };

    $(slider).slick(options);
  });
};

var bottomSlider = function bottomSlider() {
  var sliders = document.querySelectorAll('.js-slider-bottom');

  sliders.forEach(function (slider) {
    var options = {
      dots: false,
      arrows: false,
      infinite: false,
      speed: 400,
      variableWidth: true,
      centerMode: true,
      asNavFor: '.js-slider-content',
      focusOnSelect: true
    };
    var section = slider.closest('.js-history');

    $(slider).slick(options);

    $(slider).slick('slickGoTo', 4);

    setTimeout(function () {
      section.classList.add('init');
    }, 400);
  });
};

(function () {
  function createZoom() {
    var zoomTemplate = document.querySelector('#zoom-map-template');
    var zoomElement = zoomTemplate.content.children[0].cloneNode(true);

    var ZoomLayout = ymaps.templateLayoutFactory.createClass(zoomElement.outerHTML, {
      /**
       * Redefining methods of the layout, in order to perform
       * additional steps when building and clearing the layout.
       */
      build: function build() {
        // Calling the "build" parent method.
        ZoomLayout.superclass.build.call(this);

        /**
         * Binding handler functions to the context and storing references
         * to them in order to unsubscribe from the event later.
         */
        this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
        this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

        // Beginning to listen for clicks on the layout buttons.
        $('#zoom-in').bind('click', this.zoomInCallback);
        $('#zoom-out').bind('click', this.zoomOutCallback);
      },

      clear: function clear() {
        // Removing click handlers.
        $('#zoom-in').unbind('click', this.zoomInCallback);
        $('#zoom-out').unbind('click', this.zoomOutCallback);

        // Calling the "clear" parent method.
        ZoomLayout.superclass.clear.call(this);
      },

      zoomIn: function zoomIn() {
        var map = this.getData().control.getMap();
        map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
      },

      zoomOut: function zoomOut() {
        var map = this.getData().control.getMap();
        map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
      }
    });

    return new ymaps.control.ZoomControl({
      options: {
        layout: ZoomLayout,
        position: {
          right: 40,
          top: 150
        }
      }
    });
  }

  function createHubs(hubs, img) {
    return hubs.map(function (hub) {
      var _createHubBaloon = createHubBaloon(hub, '#pin-hub-template'),
          _createHubBaloon2 = _slicedToArray(_createHubBaloon, 2),
          MyBalloonLayout = _createHubBaloon2[0],
          _ = _createHubBaloon2[1];

      return new ymaps.Placemark(hub['COORDINATES'], {
        iconCaption: img
      }, {
        iconLayout: 'default#image',
        iconImageHref: img,
        iconImageSize: [30, 30],
        iconImageOffset: [-15, -15],
        preset: 'islands#redDotIconWithCaption',
        balloonLayout: MyBalloonLayout,
        balloonPanelMaxMapArea: 0,
        hideIconOnBalloonOpen: false
      });
    });
  }

  function createHubBaloon(hub, template) {
    var pinHubTemplate = document.querySelector(template);
    var pinHubElement = pinHubTemplate.content.children[0].cloneNode(true);
    pinHubElement.closest('.contacts-map__block').classList.add(hub['STATUS'] === 'ONLINE' ? 'contacts-map__block--status-online' : 'contacts-map__block--status-offline');
    for (var key in hub) {
      var el = pinHubElement.querySelector('#' + key.toLowerCase());
      if (el) {
        el.textContent = hub[key];
      }
    }
    return createBaloon(pinHubElement.outerHTML, null, '.contacts-map__block');
  }

  function createPinBaloon(template) {
    var templateElement = document.querySelector(template);
    var element = templateElement.content.children[0].cloneNode(true);
    return createBaloon(element.outerHTML, null, '.contacts-map__block', DAG.popup);
  }

  function createBaloon(layout, contentLayout, layoutRootSelector, onBuild) {
    var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(layout,
    // Пример
    // '<div class="popover top' + (isCovered ? ' popover--success' : ' popover--error') + '">' +
    // '<a class="close" href="#">&times;</a>' +
    // '<div class="arrow"></div>' +
    // '<div class="popover-inner">' +
    // '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
    // '</div>' +
    // '</div>',
    {
      /**
       * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
       * @function
       * @name build
       */
      build: function build() {
        this.constructor.superclass.build.call(this);
        this._element = this.getParentElement().querySelector(layoutRootSelector);
        this.applyElementOffset();
        this.onCloseClick = this.onCloseClick.bind(this);
        this._element.querySelector('.js-baloon-close').addEventListener('click', this.onCloseClick);
        if (onBuild) {
          onBuild();
        }
      },

      /**
       * Удаляет содержимое макета из DOM.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
       * @function
       * @name clear
       */
      clear: function clear() {
        this._element.querySelector('.js-baloon-close').click();

        this.constructor.superclass.clear.call(this);
      },

      /**
       * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
       * @function
       * @name onSublayoutSizeChange
       */
      onSublayoutSizeChange: function onSublayoutSizeChange() {
        MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

        if (!this._isElement(this._element)) {
          return;
        }

        this.applyElementOffset();
        this.events.fire('shapechange');
      },

      /**
       * Сдвигаем балун, чтобы ".arrow" указывал на точку привязки.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
       * @function
       * @name applyElementOffset
       */
      applyElementOffset: function applyElementOffset() {
        this._element.style.left = -(this._element.offsetWidth / 2) + 'px';
        // -12 - магическое число. подобранно вручную. размер галочки .arrow 15px. по этому 12 выглядит симпатично.
        this._element.style.top = -(this._element.offsetHeight + this._element.querySelector('.contacts-map__block-arrow').offsetHeight + 10) + 'px';
      },

      /**
       * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
       * @function
       * @name onCloseClick
       */
      onCloseClick: function onCloseClick(e) {
        e.preventDefault();
        this.events.fire('userclose');
      },

      /**
       * Используется для автопозиционирования карты относительно облака сообщения (balloonAutoPan).
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
       * @function
       * @name getClientBounds
       * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
       */
      // getShape: function () {
      //   if (!this._isElement(this._element)) {
      //     return MyBalloonLayout.superclass.getShape.call(this);
      //   }
      //
      //   var position = this._element.getBoundingClientRect();
      //
      //   return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
      //     [position.left, position.top],
      //     [
      //       position.left + this._element.offsetWidth,
      //       position.top + this._element.offsetHeight + this._element.querySelector('.contacts-map__block-arrow').offsetHeight
      //     ]
      //   ]));
      // },

      /**
       * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
       * @function
       * @private
       * @name _isElement
       * @param [element] Элемент.
       * @returns {Boolean} Флаг наличия.
       */
      _isElement: function _isElement(element) {
        return !!(element && element.querySelector('.contacts-map__block-arrow'));
      }
    });

    // Пример
    // Создание вложенного макета содержимого балуна.
    // if (contentLayout) {
    // var MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
    //   '<h3 class="popover-title">$[properties.balloonHeader]</h3>' +
    //   '<div class="popover-content">$[properties.balloonContent]</div>'
    // );
    // }
    // return [MyBalloonLayout, MyBalloonContentLayout];

    return [MyBalloonLayout, null];
  }

  /**
   * данные возвращаются в метрах
   */
  function getMinimalDistanceToHub(url, latitude, longitude) {
    return fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      body: new URLSearchParams({
        LATITUDE: latitude,
        LONGITUDE: longitude,
        MODE: 'closest'
      })
    }).then(function (response) {
      return response.status === 200 ? response.json() : { status: false, closest_nodes: [] };
    }).catch(function (error) {
      console.log(error);
      return { status: false, closest_nodes: [] };
    });
  }

  function init(mapElement) {
    var center = mapElement.dataset.center.trim() ? JSON.parse(mapElement.dataset.center) : null;
    var bounds = mapElement.dataset.bounds.trim() ? JSON.parse(mapElement.dataset.bounds) : null;
    var hubImg = mapElement.dataset.hubimg.trim();
    var renderHubs = mapElement.dataset.renderhubs.trim().toLowerCase() === 'true';
    var pinImg = mapElement.dataset.pinimg.trim() || undefined;
    var pinSize = mapElement.dataset.pinsize.trim() ? JSON.parse(mapElement.dataset.pinsize) : [];
    var statusUrl = mapElement.dataset.statusurl.trim() || '';
    var zoom = parseInt(mapElement.dataset.zoom, 10) || 14;

    var button = document.querySelector('.contacts-map__search-button');
    var addressElement = document.querySelector('.contacts-map__search-input');
    if (addressElement) {
      var suggestView = new ymaps.SuggestView(addressElement);
      if (addressElement.value) {
        setTimeout(function () {
          button.click();
        }, 1000);
      }
    }

    if (button) {
      button.addEventListener('click', function (evt) {
        ymaps.geocode(addressElement.value).then(function (response) {
          var obj = response.geoObjects.get(0),
              error,
              hint;
          var bounds = obj.properties.get('boundedBy');
          var mapState = ymaps.util.bounds.getCenterAndZoom(bounds, [mapElement.clientWidth, mapElement.clientHeight]);
          var shortAddress = [obj.getAdministrativeAreas(), obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' ');
          getMinimalDistanceToHub(statusUrl, mapState.center[0], mapState.center[1]).then(function (data) {
            if (renderHubs) {
              mapObject.geoObjects.removeAll();
              createHubs(data.closest_nodes || [], hubImg).forEach(function (point) {
                mapObject.geoObjects.add(point);
              });
            }

            mapObject.setCenter(mapState.center, mapState.zoom);
            mapObject.geoObjects.remove(placemark);
            placemark.geometry.setCoordinates(mapState.center);
            placemark.properties.set({
              balloonStatus: data.status ? 'contacts-map__block--status-online' : 'contacts-map__block--status-offline',
              balloonHeader: data.status ? 'Подключение возможно' : 'Подключение невозможно',
              balloonContent: shortAddress
              // Расчет расстояния с указанием метрический единиц
              // ymaps.formatter.distance(minimalDistanceToHub)
              // При создании кастомного balloon можно использовать любые имена параметров.
              // Следующие три определены в спецификации и поддерживаются официально
              // balloonContentHeader: "Балун метки",
              // balloonContentBody: "Содержимое <em>балуна</em> метки",
              // balloonContentFooter: "Подвал",
            });

            var _createPinBaloon = createPinBaloon('#pin-template'),
                _createPinBaloon2 = _slicedToArray(_createPinBaloon, 2),
                balloonLayout = _createPinBaloon2[0],
                _ = _createPinBaloon2[1];

            placemark.options.set({
              visible: true,
              balloonShadow: false,
              balloonLayout: balloonLayout,
              // balloonContentLayout: MyBalloonContentLayout,
              balloonPanelMaxMapArea: 0,
              hideIconOnBalloonOpen: false
            });
            mapObject.geoObjects.add(placemark);
            placemark.balloon.open();

            // Создаем круг
            var myCircle = new ymaps.Circle([
            // Координаты центра круга
            mapState.center,
            // Радиус круга в метрах
            200]);

            myCircle.options.set({
              fillOpacity: 0.3,
              outline: false
            });

            // Добавляем круг на карту
            mapObject.geoObjects.add(myCircle);
          });
        });
      });
    }

    var mapObject = new ymaps.Map("map", {
      center: bounds || center,
      zoom: zoom,
      controls: [
      // 'zoomControl',
      createZoom()]
    });

    var placemark = new ymaps.Placemark(mapObject.getCenter(), {
      iconCaption: pinImg
    }, {
      visible: !!bounds,
      iconLayout: 'default#image',
      iconImageHref: pinImg,
      iconImageSize: pinSize.length ? pinSize : undefined,
      iconImageOffset: pinSize.length ? [-pinSize[0] / 2, -pinSize[1] / 2] : undefined,
      preset: 'islands#redDotIconWithCaption'
    });

    mapObject.options.set('scrollZoomSpeed', 0);
    mapObject.behaviors.disable('scrollZoom');
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      mapObject.behaviors.disable('drag');
    }
    mapObject.geoObjects.add(placemark);
  }

  var mapElement = document.querySelector('#map');
  if (window.ymaps && mapElement) {
    ymaps.ready(function () {
      return init(mapElement);
    });
  }
})();

var accordion = function accordion() {
  var btns = document.querySelectorAll('.js-accordion-btn');

  btns.forEach(function (btn) {
    btn.addEventListener('click', function (evt) {
      evt.preventDefault();
      var parentItem = btn.closest('.js-accordion-item');
      var itemSiblings = getSiblings(parentItem);
      var isActive = parentItem.classList.contains('active');

      // show/hide accordion-content
      itemSiblings.forEach(function (itemSibling) {
        itemSibling.classList.remove('active');
      });

      if (isActive) {
        parentItem.classList.remove('active');
      } else {
        parentItem.classList.add('active');
      }

      // scroll to accordion-content
      var btnCoords = getCoords(btn);
      var scrollTop = btnCoords.top - 400;

      window.scroll({
        top: scrollTop,
        behavior: 'smooth'
      });
    });
  });
};

var closeCookies = function closeCookies() {
  var closeButton = document.querySelectorAll('.js-close-cookies');
  var cookies = document.querySelector('.cookies');

  var ACTIVE = 'cookies__active';

  var showBlock = function showBlock(block) {
    if (block && !block.classList.contains(ACTIVE)) {
      block.classList.add(ACTIVE);
    }
  };

  var closeBlock = function closeBlock(block) {
    if (block && block.classList.contains(ACTIVE)) {
      block.classList.remove(ACTIVE);
    }
  };

  showBlock();

  closeButton.forEach(function (button) {
    button.addEventListener('click', function () {
      closeBlock(cookies);
    });
  });
};

var phoneMask = function phoneMask() {
  $('.js-phone-mask').mask('+7 (000) 000-00-00');
};

var validateForm = function validateForm() {
  var form = $('form');

  form.parsley();
  form.submit(function (evt) {
    //событие успешной валидации onSuccess
    evt.preventDefault();
  });
};

var connectSelect = function connectSelect() {
  var isSelect = document.querySelectorAll('.js-connect-select').length != 0;

  if (isSelect) {
    var _select = document.querySelector('.js-connect-select');
    var options = _select.querySelectorAll('.js-select-option');
    var section = _select.closest('.js-connect');

    options.forEach(function (option) {
      option.addEventListener('click', function () {
        var dataIndex = option.getAttribute('data-index');

        var items = section.querySelectorAll('.js-bg-img');
        items.forEach(function (item) {
          var isMatch = item.getAttribute('data-index') == dataIndex;
          item.classList.remove('active');

          if (isMatch) {
            item.classList.add('active');
          }
        });
      });
    });
  }
};

var DAG = {};
DAG.body = document.querySelector('body');
DAG.ESC_CODE = 27;
DAG.siteContent = document.querySelector('.site-content');
DAG.footer = document.querySelector('.page-footer');
DAG.isIe11 = !!window.MSInputMethodContext && !!document.documentMode;
DAG.cursorX = '';
DAG.cursorY = '';

if (DAG.isIe11) {
  DAG.body.classList.add('ie11');
}

// **************GLOBAL-FUNCTIONS**************
// changeCirles
DAG.changeCircle = function (circle, fillPercent) {
  var interval = 10;
  var angleIncrement = 6;
  var angle = 0;
  var isPercentZero = fillPercent == 0;
  var isPercentFull = fillPercent == 360;

  if (isPercentFull) {
    fillPercent = 365;
  }

  if (isPercentZero) {
    fillPercent = 5;
  }
  circle.setAttribute("stroke-dasharray", fillPercent + ', 20000');
};

DAG.initPopup = function (openBtn, closeBtn) {
  DAG.initOpenBtn(openBtn);
  DAG.initCloseBtn(closeBtn);
};

DAG.initOpenBtn = function (openBtn) {
  openBtn.addEventListener('click', function () {
    var dataSelector = openBtn.getAttribute('data-selector');
    var popup = document.querySelector('.' + dataSelector);

    popup.classList.add('active');
    DAG.body.classList.add('overflow');
  });
};

DAG.initCloseBtn = function (closeBtn) {
  closeBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    var popup = closeBtn.closest('.js-popup');

    popup.classList.remove('active');
    DAG.body.classList.remove('overflow');
  });
};

DAG.initClosePopup = function () {
  document.documentElement.addEventListener('click', function (event) {
    var isClickWithinOpenedDiv = event.target.closest('.js-popup-content');
    if (!isClickWithinOpenedDiv) {
      var popups = document.querySelectorAll('.js-popup');

      popups.forEach(function (popup) {
        popup.classList.remove('active');
      });
      DAG.body.classList.remove('overflow');
    }
  }, true);
};

DAG.popup = function () {
  var openBtns = document.querySelectorAll('.js-popup-open');
  var closeBtns = document.querySelectorAll('.js-popup-close');

  openBtns.forEach(DAG.initOpenBtn);
  closeBtns.forEach(DAG.initCloseBtn);
  DAG.initClosePopup();
};

// lexicon
function declOfNum(number, words) {
  return words[number % 100 > 4 && number % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]];
};

// siblings
var getSiblings = function getSiblings(elem) {
  var siblings = [];
  var sibling = elem.parentNode.firstChild;

  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }

  return siblings;
};

// click outside elem
function top_walker(node, test_func, last_parent) {
  while (node && node !== last_parent) {
    if (test_func(node)) {
      return node;
    }
    node = node.parentNode;
  }
}

// get coords
function getCoords(elem) {
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

// get percent from number
var getPercent = function getPercent(num, per) {
  return num / 100 * per;
};

var getPercentNumberFromNumber = function getPercentNumberFromNumber(totalNumber, number) {
  return number / totalNumber * 100;
};

// get mouse position
var getMousePosition = function getMousePosition() {
  window.addEventListener('mousemove', function (e) {
    DAG.cursorX = e.x;
    DAG.cursorY = e.y;
  });
};

var onPageRdy = function onPageRdy() {
  // utility
  getMousePosition();
  select();
  rangeSlider();
  tabs();
  pick();
  accordion();
  DAG.popup();
  phoneMask();

  // specific
  circleHover();
  search();
  menu();
  searchMenu();
  triangle();
  closeCookies();
  validateForm();
  connectSelect();

  // sliders
  mainSlider();
  tripleSlider();
  doubleSlider();
  contentSlider();
  bottomSlider();
};

onPageRdy();
//# sourceMappingURL=main.js.map
