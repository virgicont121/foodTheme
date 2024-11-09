// Importamos los módulos
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const purgecss = require("gulp-purgecss");
const browserSync = require("browser-sync").create();

// Directorios
const src = "assets/src/";
const build = "assets/";

// Tarea para compilar el SCSS a CSS
function css() {
    return gulp
        .src(src + "scss/main.scss")
        .pipe(
            sass({
                outputStyle: "expanded",
                errLogToConsole: true,
            }).on("error", sass.logError)
        )
        .pipe(
            postcss([
                autoprefixer(),
                purgecss({
                    content: ["**/*.html", "**/*.php"],
                }),
            ])
        )
        .pipe(gulp.dest(build + "css"))
        .pipe(browserSync.stream());
}

// Tarea para recargar el navegador cuando cambian los archivos HTML o PHP
function html() {
    return gulp.src(["**/*.html", "**/*.php"]).pipe(browserSync.stream());
}

// Tarea para observar los cambios en SCSS y HTML/PHP
function watchFiles() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });

    gulp.watch(src + "scss/**/*.scss", css); // Observa cambios en los archivos SCSS y ejecuta css()
    gulp.watch(["**/*.html", "**/*.php"], html); // Observa cambios en HTML/PHP y recarga el navegador
}

// Tareas de Gulp
exports.css = css;
exports.html = html;
exports.watch = watchFiles;
exports.default = gulp.series(css, watchFiles);
