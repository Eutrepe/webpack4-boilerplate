const merge = require('webpack-merge');
const common = require('./webpack.default.common.js');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');


const minifyOption = {
    collapseWhitespace: false,
    removeComments: false,
    removeRedundantAttributes: false,
    removeScriptTypeAttributes: false,
    removeStyleLinkTypeAttributes: false
};

module.exports = merge(common, {
    output: {
        filename: '[name].js'
    },
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, './'),
        watchContentBase: true,
        watchOptions: {
            ignored: /(node_modules|bower_components)/
        },
        transportMode: 'ws',
        index: 'index.html',
        port: 9000,
        // host: '10.0.0.142',
        // https: true,
        open: true,
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        stats: {
            colors: true
        },
        historyApiFallback: true,
        overlay: {
            warnings: true,
            errors: true
        }
    },
    module: {
        rules: [{
                test: /\.(jpe?g|png|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/images'
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            autoprefixer: {
                                browsers: ['> 0.3%, IE 11, not dead']
                            },
                            plugins: () => [
                                autoprefixer
                            ]
                        },
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),       
        new HtmlWebPackPlugin({
            filename: 'index.html',
            chunks: ['homePage', 'vendors'],
            template: 'index.html',
            inject: 'head',
            minify: minifyOption
        }),
        new HtmlWebPackPlugin({
            filename: 'about.html',
            chunks: ['aboutPage', 'vendors'],
            template: 'about.html',
            inject: 'head',
            minify: minifyOption
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        })
    ],
 });