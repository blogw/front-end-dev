const glob = require('glob');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, 'src/js', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash:6].js'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 2048,
                        name: 'resource/[name].[hash:6].[ext]',
                    }
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'resource/[name].[ext]'
                    }
                }]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: '192.168.63.158',
        port: 9090,
        compress: true
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: "[name].[hash:6].css",
            chunkFilename: "[id].[hash:6].css",
            publicPath: "./resource/"
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            hash: false,
            favicon: 'src/img/favicon.ico',
            minify: {
                removeComments: true,
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        })
    ]
}