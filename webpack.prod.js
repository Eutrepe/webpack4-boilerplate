const merge = require('webpack-merge');
const common = require('./webpack.default.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');


const minifyOption = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
}

module.exports = merge(common, {
    output: {
        filename: '[name].[contenthash].js'
    },
    mode: 'production',
    module: {
        rules: [{
                test: /\.(jpe?g|png|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: 'assets/images'
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
            filename:'[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
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