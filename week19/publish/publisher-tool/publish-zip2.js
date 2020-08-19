const http = require("http");
const querystring = require("querystring");
const archiver = require("archiver");

const fs = require("fs");
const postData = querystring.stringify({
  content: "Hello World! This is a example",
});

//先创建压缩文件，这种方式多成了文件一次，效率没有winter大大的高
const filename = "package.zip";
var output = fs.createWriteStream(filename);
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

archive.directory('package', false);
archive.pipe(output);
archive.finalize();

archive.on("end",()=> {
  console.log("aaaaaaaaaaaaaa");
  fs.stat(filename, (err, stat) => {
    const options = {
      host: "127.0.0.1",
      port: 8081,
      path: "/?filename="+filename,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        //"Content-Length": stat.size,
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

});


// req.write(postData);
// req.end();
