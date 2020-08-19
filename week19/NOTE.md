# 每周总结可以写在这里
0813 
使用yeman 进行目录结构初始化
操作步骤

1、npm init
2、npm install yeoman-generator
3、配置目录结构以及index.js
4、执行在generator的根目录执行npm link
5、创建一个新的目录tt-example
6、在tt-example目录下执行yo toy-tool

0185 
生产发布系统
server 代表生产系统
publisher-tool 发布的工具
publish-server-vanilla  接收发布的包并将文件更新至生产系统中,需要增加权限控制 使用node 自身实现的Server
压缩文件借助 archiver 解压 使用unzipper 
publish-server  使用express 搭建的 服务 目前不知道如何使用流的方式，暂停

express 初始化  
npx express-generator
或
npm install -g express-generator
express
如不生成view 可使用 --no-view 参数
express -h 查看所有参数
npm install #安装依赖包
npm start   #启动Express 服务 端口默认是 3000 



