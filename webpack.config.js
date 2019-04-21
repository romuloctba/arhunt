const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const ImageminPlugin = require("imagemin-webpack");
const WriteFilePlugin = require('write-file-webpack-plugin');
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");

const baseUrlProd = "/arhunt/";
module.exports = (env, options) => ({
  entry: ["./src/index.js"],
  devServer: {
    contentBase: "./dist"
  },
  devtool: "source-map",
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      { 
        test: /\.(ttf|woff|woff2|otf|eot)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "fonts/"
          }
        }]
      },
      { 
        test: /\.pug$/,
        use: [{
          loader: "pug-loader"
        }]
      },
      {
        test: /\.scss$/,
        use: [
          options.mode !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'postcss-loader', 
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sourceMapContents: false
            }

          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/"
            }
          },
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-srcsets-loader",
          options: {
            attrs: [":src", ':srcset']
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new WriteFilePlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css"
    }),
    new CleanWebpackPlugin(["docs"]),
    // ...globSync("src/**/*.html").map(fileName => {
    //   return new HtmlWebpackPlugin({
    //     template: fileName,
    //     inject: "body",
    //     filename: fileName.replace("src/", "")
    //   });
    // }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ["popper.js", "default"],
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown"
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.pug",
      templateParameters: {
        baseUrl: options.mode !== "production" ? "/" : baseUrlProd
      }
    }),
    // new ImageminPlugin({
    //   bail: false, // Ignore errors on corrupted images
    //   cache: true,
    //   imageminOptions: {
    //     plugins: [
    //       imageminJpegtran({
    //         progressive: true
    //       }),
    //       imageminOptipng({
    //         optimizationLevel: 5
    //       })
    //     ]
    //   }
    // }),
    new CopyPlugin([
      { from: 'src/images', to: 'images' },
      { from: 'src/fonts', to: 'fonts' },
      { from: 'src/public', to: 'public' },
    ]),
  ],
  optimization: {
    minimizer: [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false,
            extractComments: false
        }),
        new CompressionPlugin({
            test: /\.js$|\.css(\?.*)?$/i
        }),
        new OptimizeCSSAssetsPlugin({})
    ]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "docs"),
    publicPath: options.mode !== "production" ? "/" : baseUrlProd
  }
});
