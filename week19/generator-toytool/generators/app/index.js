var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  hello() {
    this.log("hello 1 just run");
  }
  paths() {
    this.log(this.sourceRoot());
  }
  creating() {
    // 1、生成package.json
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { title: "componment" }
    );
    //2、自动安装项目的npm依赖包
    this.npmInstall(
      [
        "webpack",
        "webpack-cli",
        "webpack-dev-server",
        "@babel/core",
        "@babel/plugin-transform-react-jsx",
        "@babel/preset-env",
        "babel-loader",
        "@babel/register",
        "mocha",
        "nyc",
        "@istanbuljs/nyc-config-babel",
        "babel-plugin-istanbul",
        "html-webpack-plugin",
      ],
      {
        "save-dev": true,
      }
    );

    //3、生成示例代码
    this.fs.copyTpl(
      this.templatePath("createElement.js"),
      this.destinationPath("lib/createElement.js")
    );
    this.fs.copyTpl(
      this.templatePath("gesture.js"),
      this.destinationPath("lib/gesture.js")
    );
    this.fs.copyTpl(
        this.templatePath("carousel.css"),
        this.destinationPath("lib/carousel.css")
      );
    this.fs.copyTpl(
      this.templatePath("animation.js"),
      this.destinationPath("lib/animation.js")
    );
    this.fs.copyTpl(
      this.templatePath("cubicBezier.js"),
      this.destinationPath("lib/cubicBezier.js")
    );
    this.fs.copyTpl(
      this.templatePath("Carousel.js"),
      this.destinationPath("lib/Carousel.js")
    );
    this.fs.copyTpl(
      this.templatePath("main.js"),
      this.destinationPath("src/main.js")
    );
    this.fs.copyTpl(
      this.templatePath("mycssloader.js"),
      this.destinationPath("lib/mycssloader.js")
    );
    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html")
    );

    //生成测试文件

    this.fs.copyTpl(
      this.templatePath(".babelrc"),
      this.destinationPath(".babelrc")
    );
    this.fs.copyTpl(
      this.templatePath(".nycrc"),
      this.destinationPath(".nycrc")
    );
    this.fs.copyTpl(
      this.templatePath("add.js"),
      this.destinationPath("src/add.js")
    );
    this.fs.copyTpl(
      this.templatePath("add.test.js"),
      this.destinationPath("test/add.test.js")
    );
  }
};
