const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssUrlRelativePlugin = require('css-url-relative-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const htmlWebpackData = [];

glob.sync('src/*.pug').map(function(file) {
    htmlWebpackData.push(
        new HtmlWebpackPlugin({
            template: file,
            filename: file.replace('src/', '').replace(/.pug/g, '.html'),
        })
    );
});

const entryFiles = [
    ...glob.sync('./src/js/*.js'),
    ...glob.sync('./src/**/*.pug'),
    './src/scss/main.scss',
];

const prodConfig = {
    entry: entryFiles,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:7].js',
        //publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'eslint-loader',
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'img/[name].[hash:7].[ext]',
                            limit: 1024 * 10,
                        },
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false,
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false,
                                }),
                                require('imagemin-pngquant')({
                                    quality: [0.7, 1],
                                }),
                                require('imagemin-svgo')({
                                    plugins: [
                                        {
                                            removeTitle: true,
                                        },
                                        {
                                            convertPathData: false,
                                        },
                                    ],
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'font/[name].[hash:7].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader',
                        options: {
                            pretty: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/misc'),
                to: path.resolve(__dirname, 'dist/misc'),
            },
        ]),
        new CssUrlRelativePlugin(),
        ...htmlWebpackData,
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFileName: '[id].css',
        }),
        new StyleLintPlugin(),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    sourcemap: true,
                },
            }),
        ],
    },
};

module.exports = prodConfig;
