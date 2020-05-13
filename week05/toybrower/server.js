const http = require('http');
/**
 * 使用 http 模块 模拟实现 Server端代码
 */
const server = http.createServer((req, res) => {
    console.log("server has recived .......");
    console.log("********************客户端 Header信息********************");
    console.log(req.headers);
    console.log("********************客户端 Header信息********************");

    // res.setHeader("Content-Typclse", "text/hmtl");
    res.setHeader("X-Foo", "bar"); //增加自定义信息
    var s = "hello xiao huod ban!\r\n I'am chinese!";
    // res.setHeader("Content-Length", s.length);
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.write(s, "utf-8");
    res.end("ok");
});
//出现异常时的处理
server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8888);