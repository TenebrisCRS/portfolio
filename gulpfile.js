const { src, dest, watch, parallel, series } = require('gulp');           //Даём переменным возможности плагина gulp

const scss = require('gulp-sass')(require('sass'));                       //Даём переменной возможности плагина gulp-sass
const concat = require('gulp-concat');                                    //Даём переменной возможности плагина gulp-concat
const autoprefixer = require('gulp-autoprefixer');                        //Даём переменной возможности плагина gulp-autoprefixer
const uglify = require('gulp-uglify');                                    //Даём переменной возможности плагина gulp-uglify
const imagemin = require('gulp-imagemin');                                //Даём переменной возможности плагина gulp-imagemin
const browserSync = require('browser-sync').create();                     //Даём переменной возможности плагина browser-sync
const del = require('del');                                               //Даём переменной возможности плагина del
const avif = require('gulp-avif');                                        //Даём переменной возможности плагина gulp-avif
const webp = require('gulp-webp');                                        //Даём переменной возможности плагина gulp-webp
const newer = require('gulp-newer');                                      //Даём переменной возможности плагина gulp-ached
const svgSprite = require('gulp-svg-sprite');                             //Даём переменной возможности плагина gulp-svg-sprite
const fonter = require('gulp-fonter');                                    //Даём переменной возможности плагина gulp-fonter
const ttf2woff2 = require('gulp-ttf2woff2');                              //Даём переменной возможности плагина gulp-ttf2woff2

function fonts() {                                                        //Функция для шрифтов
  return src('app/fonts/src/*.*')                                         //Берём все файлы из fonts/src
    .pipe(fonter({
      formats: ['woff', 'ttf']                                            //Конвертируем их в woff и ttf    
    }))
    .pipe(src('app/fonts/*.ttf'))                                         //Берём все файлы ttf
    .pipe(ttf2woff2())                                                    //Конвертируем их в woff2
    .pipe(dest('app/fonts'))                                              //Выкидываем в dist
}

function styles() {                                                       //Функция для стилей
  return src('app/scss/style.scss')                                       //Берём данные из файла style.scss
    .pipe(scss({ outputStyle: 'compressed' }))                            //Перерабатываем их в css файл. OutputStyle имеет значения expanded (удобный) и compressed (минифицированный)
    .pipe(concat('style.min.css'))                                        //Перемещаем в файл при помощи плакина gulp-concat
    .pipe(autoprefixer({                                                  //Устанавливаем префиксы при помощи gulp-autoprefixer
      overrideBrowserslist: ['last 10 versions'],                         //Дополрительная настройка (применять для последних 10 версий)
      grid: true                                                          //Дополнительная настройка (применять для display: grid)
    }))
    .pipe(dest('app/css'))                                                //Выкидываем в папку css
    .pipe(browserSync.stream())                                           //Используем функцию плагин Browser-sync (2 параметра reload(перезагрузка) и stream) для отображения результатов на странице 
}

function sprite () {
  return src('app/images/dist/**/*.svg', '!app/images/dist/sprtie.svg')                                 //Берём все svg изображения
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest('app/images/dist'))                                         //выкидываем в папку images/dist
}

function scripts() {                                                      //Функция для скриптов 
  return src([                                                            //Берём данные из:
    'node_modules/jquery/dist/jquery.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))                                          //Перемещаем в файл при помощи плакина gulp-concat
    .pipe(uglify())                                                       //Минифицируем js-файл
    .pipe(dest('app/js'))                                                 //Выкидываем в папку js
    .pipe(browserSync.stream())                                           //Используем функцию плагин Browser-sync для отображения результатов на странице
}

function images() {
  return src(['app/images/src/**/*.*', '!app/images/src/**/*.svg', '!app/images/src/**/*.webp'])       //Берём все картинки из папки app/images/src, кроме svg
    .pipe(newer('app/images/dist'))                                       //Проверка, стоит ли конвертировать
    .pipe(avif({ quality: 50 }))                                          //Конвертация в AVIF

    .pipe(src('app/images/src/**/*.*'))
    .pipe(newer('app/images/dist'))
    .pipe(webp())                                                         //Конвертация в WEBP

    .pipe(src('app/images/src/**/*.*'))
    .pipe(newer('app/images/dist'))
    .pipe(imagemin([                                                      //Сжимаем картинки
      imagemin.gifsicle({ interlaced: true }),                            //Дополнительные настройки с официального руководства
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest('app/images/dist'))                                        //Выкидываем катинки в папку dist/images
}

function build() {                                                        //Функция для постройки проекта
  return src([                                                            //Берём файлы:
    'app/**/*.html',                                                      //HTML
    'app/images/dist/**/*.*',                                             //images
    '!app/images/dist/**/*.svg',                                                                               
    '!app/images/dist/stack/*.*',
    'app/fonts/*.*',                                                      //fonts
    'app/images/dist/sprite.svg',                                      
    'app/css/style.min.css',                                              //CSS
    'app/js/main.min.js'                                                  //JS
  ], { base: 'app' })                                                     //Доп настройка, которая переносит файлы так, как они были записаны (в тех же папках и втой же последовательности)
    .pipe(dest('dist'))                                                   //Выкидываем эти файлы в папку dist
}

function cleanDist() {                                                    //Функция очистки папки dist      
  return del('dist');                                                     //Удаляем dist при помощи плагина del
}

function cleanSprite() {
  return del('app/images/dist/sprite.svg')
}

function watching() {                                                     //Создаём функцию слежения
  browserSync.init({                                                      //Инициализация по документации
    server: {                                                             //инициализируем сервер
      baseDir: 'app/'                                                     //Место расположения сервера
    },
    notofy: false                                                         //Отключения уведомления о перезагрузке страницы
  })
  watch(['app/scss/**/*.scss'], styles);                                  //Активируем функцию слежения за стилями, и при изменении активируем функцию styles
  watch(['app/images/src'], images);                                      //Активируем функцию слежения за изображениями, и при изменении активируем функцию images
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);              //Активируем функцию слежения за скриптами, и при изменении активируем функцию sripts
  watch(['app/**/*.html']).on('change', browserSync.reload);              //Используем функцию плагин Browser-sync для отображения результатов на странице
}

exports.styles = styles;                                                  //Даём возможность gulp объявить функцию styles и использовать её 
exports.fonts = fonts;                                                    //Даём возможность gulp объявить функцию fonts и использовать её 
exports.sprite = series(cleanSprite ,sprite);                             //Даём возможность gulp объявить функцию cleanSprite и sprite и использовать их 
exports.scripts = scripts;                                                //Даём возможность gulp объявить функцию scripts и использовать её         
exports.watching = watching;                                              //Даём возможность gulp объявить функцию watching и использовать её 
exports.images = images;                                                  //Даём возможность gulp объявить функцию images и использовать её 
exports.cleanDist = cleanDist;                                            //Даём возможность gulp объявить функцию del и использовать её
exports.build = series(cleanDist, images, build);                         //Даём возможность gulp через series объявить сразу 3 функции

exports.default = parallel(styles, scripts, watching);                    //поочерёдно запускаются все плагины