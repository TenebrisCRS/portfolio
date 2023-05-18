$(function () {

  const headerTop = $('.header-top')
  const headerIcon = $('.header__icon')

  headerTop.on("mouseenter", function () {
    if (isDescktop(1024)) {
      show(headerTop, headerIcon)
    }
  })

  headerTop.on("mouseleave", function () {
    if (isDescktop(1024) && $(window).scrollTop() > 0) {
      hide(headerTop, headerIcon)
    }
  })

  //обработка нажатия на кнопку меню и выхода из меню
  $('.header__btn').on('click', function (event) {
    headerTop.toggleClass('active')
    event.stopPropagation()
  })

  headerTop.on("click", function (event) {
    event.stopPropagation()
  })

  $(window).on("click", function () {
    if (headerTop.hasClass('active')) {
      headerTop.toggleClass('active')
      $(".ham3").toggleClass('active')
    }
  });

  //анимация для якорных ссылок
  $('.header-top__link').on('click', function (event) {
    event.preventDefault();
    const id = $(this).attr('href'),
      top = $(id).offset().top
    $('body,html').animate({ scrollTop: top }, 1000)

    if (!isDescktop(600)) {
      headerTop.toggleClass('active')
      $(".ham3").toggleClass('active')
    } else {
      hidenFunc(headerTop, headerIcon, true)
    }
  });


  //анимация прокрутки работ портфолио
  $('.portfolio__img').on('mouseover', function () {
    if (isDescktop(900)) {
      const scrollDistance = $(this).height() - $('.portfolio__item').height()
      const hoverTime = (scrollDistance / 100).toFixed(2)

      $(this).css({
        "transition": "margin " + hoverTime + "s linear",
        "margin-top": -scrollDistance
      })
    }
  })

  $('.portfolio__img').on('mouseout', function () {
    $(this).css({
      "transition": "margin " + 0.3 + "s linear",
      "margin-top": 0
    })
  })


  //анимация header при скролле
  function hidenFunc(firstTarget, secondTarget, windowWindthLock) {
    if (windowWindthLock) {
      if ($(window).scrollTop() > 0) {
        hide(firstTarget, secondTarget)
      } else {
        show(firstTarget, secondTarget)
      }
    } else {
      show(firstTarget, secondTarget)
    }
  }

  //функция, скрывающая header-top и показывающая header__icon
  function hide(firstTarget, secondTarget) {
    firstTarget.addClass('hiden')
    secondTarget.addClass('shown')
  }

  //функция, показывающая header-top и скрывающая header__icon
  function show(firstTarget, secondTarget) {
    firstTarget.removeClass('hiden')
    secondTarget.removeClass('shown')
  }

  //функция проверки ширины экрана
  function isDescktop(width) {
    if ($(window).width() > width) {
      return true
    } else {
      return false
    }
  }

  //проверка при загрузке страницы
  hidenFunc(headerTop, headerIcon, isDescktop(1024))

  $(window).on('scroll', function watchingFunc() {
    hidenFunc(headerTop, headerIcon, isDescktop(1024))
  })
})