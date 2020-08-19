module.exports = {
  entry: "./src/main.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "createElement",
                },
              ],
            ],
          },
        },
      },
      {
        test:/\.css$/,
        loader: require.resolve("./lib/mycssloader.js"),
      }
    ],
  },
  plugins:[
    new (require('html-webpack-plugin'))
  ],
  mode: "development", // 开发环境，源码文件可读取
  optimization: {
    minimize: false,
  },
  //热部署服务
  devServer: {
    port: 9000,
    open: true,
    compress: false,
    contentBase: "./src",
  },
};
