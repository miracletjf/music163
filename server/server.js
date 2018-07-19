let http = require('http');
let fs = require('fs');
let url = require('url');
let qiniu = require('qiniu');

let port = process.argv[2];

if(!port){
  console.log('请指定端口号！\n例如： node server.js 8890');
  process.exit();
}

let server = http.createServer(function(request,response){
  let parseUrl = url.parse(request.url,true);
  let path = request.url;
  let query;
  
  if(path.indexOf('?') >=0){
    query = path.substring(path.indexOf('?'));
  }

  let pathNoQuery = parseUrl.pathname;
  let pathObject = parseUrl.query;
  let method = request.method.toUpperCase();

  //路由功能
  if(pathNoQuery === '/uptoken'){
    let string = fs.readFileSync('./server/qiniu-key.json','utf-8');
    let {accessKey,secretKey} = JSON.parse(string);
    console.log(accessKey,secretKey);
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


    var options = {
      scope: bucket,
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);

    response.setHeader('Content-Type','text/html;charset=utf-8');
    response.setHeader('Access-Control-Allow-Origin','*');
    response.write(string);
    response.end();
  }
}) 

server.listen(port);
console.log(`监听${port}成功\n请打开http://localhose:${port}`);

/* 获取请求体，String形式 */
function getReauestBodyString(req,callback){
  let body = "";

  req.on('data', function (chunk) {
    body += chunk;
  }).on('end', function () {
    callback(body);
  })

}