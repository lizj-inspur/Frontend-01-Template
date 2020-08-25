# 每周总结可以写在这里
0820 组件化
PhantomJS  无头浏览器 
使用Phantomjs继续丰富组件化,增加Check功能
phantomjs js兼容性存在问题，不建议使用他进行验证，可以考虑selenium，直接调用本地浏览器,不存在兼容性问题
mocha-phantomjs-core 后续使用的时候可以研究，不建议使用

ESLint
可组装的JavaScript和JSX检查工具

npm install eslint  -g
生成默认配置文件
eslint --init  
检查文件
eslint ./main.js  

可配置自己的相关规则，在后续使用时需要参考相关文档。


这一节的内容感觉有点水，调试了半天也没整出个123来，浪费了不少时间。

0822
增加权限
oauth

1、注册githapp 获得client_id 、client_sercert

App ID: 77934

Client ID: Iv1.49557c10a728a0c5

Client secret: 223ab19dcc2734c545a0fec92caf71010cd47cb9

2、获取code
params="client_id=Iv1.49557c10a728a0c5&redirect_uri=http%3A%2F%2Flocalhost%3A9000&scope=user&state=abc1234"
调用GET 
https://github.com/login/oauth/authorize?client_id=Iv1.49557c10a728a0c5&redirect_uri=http%3A%2F%2Flocalhost%3A9000&scope=user&state=abc1234;


3、使用code获取access_token
POST 
https://github.com/login/oauth/access_token
client_id
client_secret
code    a17b662cac6ae0f430c9
redirect_uri
state

4、获取access_token就可以调用Api
GET https://api.github.com/user

curl -H "Authorization: token OAUTH-TOKEN" https://api.github.com/user
