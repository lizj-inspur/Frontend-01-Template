# 每周总结可以写在这里

0730
1、完善 Carousel 组件，增加 flick 事件的的处理
2、实现带有子内容的组件如 PANEL ,TabPannel ,ListView 等
3、使用 css 类库实现自定义 loader 来处理组件中的样式文件，以防止组件中的样式影响全局
增加 scope 前缀

1、可使用已实现的 loader style-loader 和 css loader 直接生成 Style 对象
2、使用 style-loader/url 和 file-loader 生成 link 的方式 不建议使用，会生成多少 link，建成网络二次加载

以上会出现 写了全局的样式影响对其他内容产生影响
3、使用 css-loader 和 自定义 loader，使用 css 类库对 css 文件进行处理，统一添加 scope，使插件不影响页面的其他内容。

0801
工具链
按前端开发生命周期，对常用的 JS 工具进行分类，汇总，输出 js tools 脑图。

The Y Combinator explained with JavaScript

var y = function(le) {
return function(f) {
return f(f);
}(function(f) {
return le(
function(x) { return (f(f))(x); }
);
});
};

使用 node api 实现安装情景化，类似yoman的对话式安装初级。
