var express = require('express');
var router = express.Router();

const serverPath = "D:/greekcode/Frontend-01-Template/week19/publish/server/public/";

const fs = require("fs");

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log("cccccc");
  let filename = req.query.filename;
  // 使用debugger启动时目录和在命令行中启动的路径 不一致 ，建议使用绝对路径 
  fs.writeFileSync(serverPath+filename,req.body.content);
  //res.render('index', { title: 'Express11111111111111' });
  res.end();
});

module.exports = router;
