const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');

const devConfig = {
    entry: [
        './src/js/main.js',
        './src/scss/main.scss',
        './src/index.pug',
        './src/partials/header.pug',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/main.bundle.js', 
        //publicPath: '/dist',
    },
    devtool: "source-map",
    devServer: {
        compress: false,
        port: 3000,
        contentBase: path.join(__dirname, 'dist'),
        overlay: true,
        //publicPath: '/dist',
        watchContentBase: true
    },
    watchOptions: {
        poll: true
      },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader"
                },{
                    loader: "eslint-loader"
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
                            name: "img/[name].[ext]",
                            limit: 1024 * 10
                        }
                    },
                    {
                        loader: "img-loader",
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    quality: [0.7, 1]
                                }),
                                require('imagemin-svgo')({
                                    plugins: [
                                        { removeTitle: true },
                                        { convertPathData: false }
                                    ]
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: "font"
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", //MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.pug$/,
                use: [
                    "pug-loader",
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.pug",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFileName: "[id].css"
        }),
        new StyleLintPlugin(),
    ],
    optimization: {
        minimize: false
    }
};

module.exports = devConfig;