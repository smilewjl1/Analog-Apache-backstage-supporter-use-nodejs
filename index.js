const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const _ = require("underscore");
//保存www的目录路径
const rootPath = path.join(__dirname,"www");

http.createServer().on("request",(req, res) =>{

    const name = path.join(rootPath,req.url);
    if(fs.existsSync(name)){      
        fs.stat(name,(err,stats)=>{
            if(err){

            }else{
                if(stats.isDirectory()){
                    fs.readdir(name, (err, files)=>{
                        fs.readFile(path.join(__dirname,"views","list.html"),"utf-8",(err,data)=>{
                            if(err){

                            }else{
                               const html =  _.template(data)({files, url:req.url});
                               res.end(html);
                            }
                        })
                    });
                }else{
                    //这是1个文件. 读取文件并响应浏览器.
                    fs.readFile(name,(err,data)=>{
                        if(err){
                            //服务器内部发生错误.
                        }else{
                            res.setHeader("Content-Type", mime.getType(name));
                            res.end(data);
                        }
                    });
                }
            }
        });
    }else{
        res.statusCode = 404;
        res.statusMessage = 'Not found';
        fs.readFile(path.join(__dirname,"views","404.html"),(err,data)=>{
            if(err){

            }else{
                res.end(data);
            }
        });
    }
    
}).listen(80,()=>console.log("服务开启"));