const gulp = require("gulp");
const webserver = require('gulp-webserver');
const mock = require("mockjs");
const fs = require("fs");
const path = require('path');
gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(webserver({
            host: 'localhost',
            port: 8080,
            livereload: true,
            open: true,
            fallback: 'index.html',
        }));
});
gulp.task('datas', function () {
    gulp.src('./')
        .pipe(webserver({
            host: 'localhost',
            port: 8090,
            middleware:function(req,res){               
                if(req.url ==="/datas"){
                    var data = {
                        "name": '张三',
                        "age":18,
                        "sex":"男"
                    }
                    res.writeHead(200, {
                        "Content-type": "text/json;charset=utf8",
                        "Access-Control-Allow-Origin": "*"
                    });
                    res.end(JSON.stringify(data));
                 }else if(req.url === "/user"){
                    var data = mock.mock({
                        "id": "@name",
                        "email": "@email",
                        "content": "@csentence"
                    })
                    res.writeHead(200, {
                        "Content-type": "text/json;charset=utf8",
                        "Access-Control-Allow-Origin": "*"
                    });
                    res.end(JSON.stringify(data));
                }else{
                    var filename = req.url.split("/")[1];
                    var dataFile = path.join(__dirname,"data",filename+".json"); 
                    fs.exists(dataFile,function(exist){
                        if(exist){
                            fs.readFile(dataFile,function(err,data){
                                if(err){
                                    throw err;
                                }
                                res.end(data.toString())
                            }) 
                        }else{
                            var data = new Error("此页面不存在")
                            res.end(JSON.stringify(data));
                        }
                    })
                }
            }
        }));
});
gulp.task('default', function () {
    gulp.start("webserver","datas");
});
