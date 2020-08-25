const http = require("http");
const querystring = require("querystring");
const archiver = require("archiver");

const child_process = require("child_process");

const fs = require("fs");
let redirect_uri = "http://localhost:8081/auth?id=123";
child_process.exec(
  "start https://github.com/login/oauth/authorize?client_id=Iv1.49557c10a728a0c5&redirect_uri=${redirect_uri}&scope=user&state=abc1234"
);

const server = http.createServer((request, response) => {
  let token = request.url.match(/access_token=([^&]+)/)[1];
  console.log("real publish");
  console.log("token is =" + token);

  const filename = "package.zip";

  var archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  archive.directory("package", false);
  //archive.pipe(output);
  archive.finalize();
  const options = {
    host: "127.0.0.1",
    port: 8081,
    path: "/?filename=" + filename,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      token: token,
    },
  };
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });
  archive.pipe(req);
  archive.on("end", () => {
    req.end();
    response.end("publish success");
    server.close();
  });
});
server.listen(8080);
