# 每周总结可以写在这里

0709 目标
搭建组件化基础环境，具备开发环境
使用 JSX 解析模板，生成相关代码

前置条件
1、安装 webpack
npm install webpack webpack-cli –g

创建组件化目录
mkdir component
使用 npm 进行初始化　,下一步，下一步
npm init
npm install --save-dev webpack 或 npm install -D webpack
安装 babel 相关插件

npm install -D babel-loader @babel/core @babel/preset-env

安装 jsx 插件
npm install -D @babel/plugin-transform-react-jsx

安装 webpack-dev-server 插件 可用于开发时即时生效，热部署
npm install -D webpack-dev-server

jsx 中大写会认定为类，小写是 string


0711 完成carousel html+css版和 组件化初级版
核心代码
1、使用的css动画实现,注意transition 和 transform 的用法  切换动画时注意使用Settimeout 延迟16ms
2、定时轮播时同时移动两张图片，
3、改为鼠标事件时要同时计算3张图片
