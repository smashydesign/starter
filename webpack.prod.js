const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CssUrlRelativePlugin = require('css-url-relative-plugin')

const prodConfig = {
    entry: [
        './src/js/main.js',
        './src/scss/main.scss',
        './src/index.pug',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/main.bundle.[hash:7].js', 
        //publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader"
                }]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: false
                    }
                }]
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "img/[name].[hash:7].[ext]",
                            limit: 1024 * 10
                        }
                    },
                    {
                        loader: "img-loader",
                    },
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'font/[name].[hash:7].[ext]',
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: "pug-loader",
                        options: {
                            pretty: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [ 
        new CleanWebpackPlugin(['dist'],{
            root: path.resolve(__dirname)
        }),
        new CssUrlRelativePlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.pug",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFileName: "[id].css"
        }),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
              }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    sourcemap: true
                }
            })
        ]
    }
}

module.exports = prodConfig;