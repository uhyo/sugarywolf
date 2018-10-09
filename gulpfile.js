'use strict';
const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpChanged = require('gulp-changed');
const merge2 = require('merge2');
// TypeScript
const gulpTS = require('gulp-typescript');
const gulpTSlint = require('gulp-tslint');
const typescript = require('typescript');
const del = require('del');

const LIB_DIR = "lib/";
const TS_DIST_LIB = "dist/";
const DIST_DECLARATION = "dist-typing/";
const DIST_LIB = "dist/";
const PRODUCTION = process.env.NODE_ENV === 'production';

{
  const tsProj = gulpTS.createProject('tsconfig.json', {
    typescript,
  });
  gulp.task('tsc', ()=>{
    const rs = gulp.src(path.join(LIB_DIR, '**', '*.ts{,x}'))
    .pipe(sourcemaps.init())
    .pipe(tsProj());

    if (DIST_DECLARATION){
      return merge2(
        rs.js.pipe(sourcemaps.write()).pipe(gulp.dest(TS_DIST_LIB)),
        rs.dts.pipe(gulp.dest(DIST_DECLARATION))
      );
    }else{
      return rs.js.pipe(sourcemaps.write()).pipe(gulp.dest(TS_DIST_LIB));
    }
  });
  gulp.task('watch-tsc', gulp.series('tsc', ()=>{
    gulp.watch(path.join(LIB_DIR, '**', '*.ts{,x}'), ['tsc']);
  }));
  gulp.task('tslint', ()=>{
    return gulp.src(path.join(LIB_DIR, '**', '*.ts{,x}'))
    .pipe(gulpTSlint({
      formatter: 'stylish',
    }))
    .pipe(gulpTSlint.report({
      emitError: false,
    }));
  });
  gulp.task('watch-tslint', gulp.series('tslint', ()=>{
    gulp.watch(path.join(LIB_DIR, '**', '*.ts{,x}'), ['tslint']);
  }));
}
{
  gulp.task('clean', ()=>{
    const del_target = [DIST_LIB];
    if (DIST_DECLARATION){
      del_target.push(DIST_DECLARATION);
    }
    return del(del_target);
  });
}
gulp.task('default', gulp.series('tsc', 'tslint'));
gulp.task('watch', gulp.parallel('watch-tsc', 'watch-tslint'));
