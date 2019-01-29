const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devConfig = {
    entry: [
        './src/js/main.js',
        './src/scss/main.scss'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/main.bundle.js', 
        publicPath: '/dist',
    },
    devServer: {
        compress: false,
        port: 3000,
        contentBase: path.join(__dirname, 'dist'),
        overlay: true,
        publicPath: '/dist',
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
                test: /\.(png|jpe?g)/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "./img/[name].[ext]",
                            limit: 10000
                        }
                    },
                    {
                        loader: "img-loader"
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
                    "pug-loader"
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
        })
    ]
};

module.exports = devConfig;