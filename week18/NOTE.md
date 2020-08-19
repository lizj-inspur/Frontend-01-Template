# 每周总结可以写在这里

0806 
dev 工具
Server
   build webpack babel vue jsx postcsss
   watch:fsevent  监听文件的变化
   mock:
   http :ws server 

   Client 
     debugger
     source map
debugger 的实现 
1、node启动的时候使用websocket 监听了一个特别端口 
2、vscode 调试时像node发现相关命令信息
3、node进行响应
fsevents mac 上监听文件，目录变化的工具类库

可通过 http-server + fsevents + node exec 实现 热部署的效果  由于fsevents 只能在MAC下运行,项目就不跟实验了（穷，呜呜）。


0810 实现集成单元测试
mocha 单元测试工具
nyc  代码覆盖度测试工具

npm install -g mocha
npm install -g nyc 


test 代码中默认只能使用require 如果要使用import 需要在package中加type:moudule 但是使用的import使用 nyc的时候会出现问题

可采用将import 高级版本的js文件使用babel转为低版本，然后在test文件中还是使用require方法进行测试
npm install @babel/core  @babel/preset-env  babel-loader -D 

babel ./src/add.js > ./dist/add.js  注意 转出来的文件会有乱码，此处暂时用手动创建文件然后将转化内容copy过去
使用还是使用require 进行测试.

解决nyc中import的问题
npm install -D  babel-plugin-istanbul  @istanbuljs/nyc-config-babel 
在.nycrc中配置 "extends": "@istanbuljs/nyc-config-babel"
在.babel中配置  "plugins": ["babel-plugin-istanbul"]
这样有个问题好像是 nyc mocha 能运行，但是单独运行mocha又不行了，还得加type:module 但是加了nyc mocha又无法找到文件？？

使用Ava 
npm install -D ava 
npm install -D @ava/babel
npm install -D @babel/register 
增加配置文件
 "ava":{
    "files":[
      "test/*.js"
    ],
    "require":[
      "@babel/register"
    ],
    "babel":{
      "testOptions":{
        "babelrc":true
      }
    }
  }

然后使用import高版本和js也可运行。

HTML-psrseer的单元测试暂不实现