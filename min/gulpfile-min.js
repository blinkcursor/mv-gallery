var gulp=require("gulp"),responsive=require("gulp-responsive");gulp.task("images",function(){return gulp.src("img/*.{jpg,png}").pipe($.responsive({"*.jpg":[{width:400,rename:{suffix:"-400"}},{width:500,rename:{suffix:"-500"}},{width:600,rename:{suffix:"-600"}},{width:700,rename:{suffix:"-700"}},{rename:{suffix:"-original"}}]},{quality:70,progressive:!0,withMetadata:!1})).pipe(gulp.dest("dist"))});