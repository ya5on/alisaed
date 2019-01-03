let gulp		=	require('gulp'),
	watch		=	require('gulp-watch'),
	sass		=	require('gulp-sass'),
	autoprfxr	=	require('gulp-autoprefixer'),
	cssmin		=	require('gulp-clean-css'),
	csscomb		=	require('gulp-csscomb'),
	imagemin	=	require('gulp-imagemin'),
	pngquant	=	require('imagemin-pngquant'),
	gcmq		=	require('gulp-group-css-media-queries'),
	concat		=	require('gulp-concat'),
    uglify 		= 	require('gulp-uglify'),
	smartgrid	=	require('smart-grid'),
	bs 			=	require('browser-sync');
/*----------------------------------------------------*/
let path = {
    src: {
        sass: 		'src/sass/style.sass',
        img: 		'src/img/**/*.*',
        js: 		'src/js/**/*.js',
        vendor: {
            smartgrid: 'src/vendor/smart-grid'
        }
    },

    dist: {
        css: 		'dist/css/',
        img: 		'dist/img/',
        js:    		'dist/js/',
    }
};
/*----------------------------------------------------*/
gulp.task('dev', ['all'], () => {
	bs.init({
        server:{
            baseDir:'./'
        }
	});

	gulp.watch('src/**/*.+(sass|scss)', ['sass']);
	gulp.watch('src/js/**/*.js').on('change', bs.reload);
	gulp.watch('src/img/*.*').on('change', bs.reload);
	gulp.watch('./**/*.html').on('change', bs.reload);
});
/*----------------------------------------------------*/
// gulp.task('html', () => {
//     gulp.src(path.src.html)
//         .pipe(gulp.dest(path.dist.html))
//         .pipe(bs.stream());
// });
/*----------------------------------------------------*/
gulp.task('sass', () => {
	gulp.src(path.src.sass)
			.pipe(sass({
				outputStyle: 'expanded'
			})).on('error', sass.logError)
			.pipe(autoprfxr({
				browsers: ['last 2 versions'],
				cascade: false
			}))
			.pipe(gcmq())
			.pipe(csscomb())
			.pipe(gulp.dest(path.dist.css))
			.pipe(bs.stream());
});
/*----------------------------------------------------*/
gulp.task('js', () => {
	gulp.src(path.src.js)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.dist.js));
});
/*----------------------------------------------------*/
gulp.task('img', () => {
	gulp.src(path.src.img)
			.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()],
				interlaced: true
			}))
			.pipe(gulp.dest(path.dist.img));
});

/*----------------------------------------------------*/
gulp.task('all', ['sass', 'js', 'img']);
/*----------------------------------------------------*/
gulp.task('smartgrid', () => {
    smartgrid(path.src.vendor.smartgrid, {
        outputStyle: 'sass',
        columns: 24,
        offset: '30px',
        mobileFirst: false,
        container: {
            maxWidth: '1336px',
            fields: '15px'
        },
        breakPoints: {
            lg: {
                width: '1200px'
            },
            md: {
                width: '991px'
            },
            sm: {
                width: '767px'
            },
            xs: {
                width: '575px'
            },
            xxs: {
                width: '320px'
            }
        }
    });
});
/*----------------------------------------------------*/
gulp.task('production', ['img'], () => {
	gulp.src(path.src.sass)
			.pipe(sass({
				outputStyle: 'expanded'
			})).on('error', sass.logError)
			.pipe(autoprfxr({
				browsers: ['last 2 versions'],
				cascade: false
			}))
			.pipe(gcmq())
			.pipe(csscomb())
			.pipe(cssmin())
			.pipe(gulp.dest(path.dist.css))
			.pipe(bs.stream());

    gulp.src(path.src.js)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js));
});
/*----------------------------------------------------*/