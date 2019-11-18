/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  devServer: {
    contentBase: "./dist",
    host: "0.0.0.0",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(frag|vert)$/,
        loader: "raw-loader",
      },
      {
        test: /.(jpg|png)$/,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js", ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: 4,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Game",
      template: "./src/template.html",
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map",
    }),
    new CopyPlugin([
      { from: "public", to: "./", },
    ]),
  ],
};
