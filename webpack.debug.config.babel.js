import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import webpack from "webpack";

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: ["babel-polyfill", "whatwg-fetch", "./public/src/indexDebug.jsx"],
    indexDevelop: ["babel-polyfill", "whatwg-fetch", "./public/src/indexDevelop.jsx"]
  },
  output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "public/dist")
  },
  module: {
    rules: [
      {
        test: /(\.js$|\.jsx$)/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          { 
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["public/dist"])
  ]
}
