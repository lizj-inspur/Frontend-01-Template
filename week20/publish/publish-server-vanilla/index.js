const http = require("http");
const https = require("https");
const fs = require("fs");
const unzipper = require("unzipper");

const serverPath =
  "D:/greekcode/Frontend-01-Template/week20/publish/server/public/";
/**
 * 手动实现一个server 来解决 流式处理的问题
 */
// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {
  //  console.log(req);

  if (req.url.match(/^\/auth/)) {
    return auth(req, res);
  }
  console.log("to invoke get user ");
  getUser(req, res);
  //TODO 增加 请求 user 接口的然后解压
});

function getUser(req, res) {
  //解析user
  let token = req.headers.token;
  console.log(" server token is ="+ token);
  const options = {
    hostname: "api.github.com",
    port: 443,
    path: "/user",
    method: "GET",
    headers: {
      "Authorization": `token ${token}`,
      "User-Agent":"toy-tool-lizj",
    },
  };
  const request2 = https.request(options, (response) => {
    var body = "";
    response.on("data", (d) => {
      body += d.toString();
    });
    response.on("end", (d) => {
      console.log(body);
      let matched = req.url.match(/filename=([^&]+)/);
      let filename = matched && matched[1];
      console.log(filename);
      if (!filename) {
        return;
      }
      req.pipe(unzipper.Extract({ path: serverPath }));
      req.on("end", () => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("okay");
      });
    });

   
  });

  request2.on("error", (e) => {
    console.log(e);
  });
  request2.end();
}
function auth(req, res) {
  let code = req.url.match(/code=([^&]+)/)[1];
  let state = "abc1234";
  let client_id = "Iv1.49557c10a728a0c5";
  let client_secret = "223ab19dcc2734c545a0fec92caf71010cd47cb9";
  let redirect_uri = "http://localhost:8081/auth";
  let params = `code=${code}&client_id=${client_id}&client_secret=${client_secret}&state=${state}&redirect_uri=${redirect_uri}`;
  let url = "https://github.com/login/oauth/access_token?" + params;
  console.log("url=" + url);

  const options = {
    hostname: "github.com",
    port: 443,
    path: "/login/oauth/access_token?" + params,
    method: "POST",
  };
  const request = https.request(options, (res1) => {
    res1.on("data", (d) => {
      console.log(d.toString());
      let result = d.toString().match(/access_token=([^&]+)/);
      if (result) {
        let access_token = result[1];
        console.log("access_token=" + access_token);
        res.writeHead(200, {
          "Content-Type": "text/html",
          access_token: access_token,
        });
        res.end(
          "<a href='http://localhost:8080/publish?access_token=" +
            access_token +
            "'>publish</a>"
        );
      } else {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("error");
      }
    });
  });

  request.on("error", (e) => {
    console.log(e);
  });
  request.end();
}
server.listen(8081);
