const http = require("http");
const fs = require("fs");

const serverPath =
  "D:/greekcode/Frontend-01-Template/week19/publish/server/public/";
/**
 * 手动实现一个server 来解决 流式处理的问题
 */
// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {
  //  console.log(req);
  let matched = req.url.match(/filename=([^&]+)/);
  let filename = matched && matched[1];
  console.log(filename);
  if (!filename) {
    return;
  }
  let writeStream = fs.createWriteStream(serverPath + filename);
  req.pipe(writeStream);
  req.on("end", () => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("okay");
  });
});

server.listen(8081);
