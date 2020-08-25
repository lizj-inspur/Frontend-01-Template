const http = require("http");
const querystring = require("querystring");

const fs = require("fs");
const postData = querystring.stringify({
  content: "Hello World! This is a example",
});

const filename = "animal.jpg";
fs.stat(filename, (err, stat) => {
  const options = {
    host: "127.0.0.1",
    port: 8081,
    path: "/?filename="+filename,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": stat.size,
    },
  };
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });

  let readStream = fs.createReadStream(filename);
  readStream.pipe(req);
  readStream.on("end", () => {
    req.end();
  });
});

//req.write(postData);
//req.end();
