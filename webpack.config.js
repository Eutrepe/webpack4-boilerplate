const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        'index': './src/assets/js/index.js'
    },
    output: {
        filename: devMode ? '[name].js' : '[name].[contenthash].js',
        path: path.resolve(__dirname, './web'),
        publicPath: ''
    },
    mode: devMode ? 'development' : 'production',
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: function (module) {
                return 'vendors';
            },
            minSize: 10000
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin()
        ]
    },
    devServer: devMode ? {
        contentBase: path.resolve(__dirname, './'),
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/
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
    } : {},
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
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: {
                                        version: 3
                                    }
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
            },
            {
                test: /font-awesome\.config\.js/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'font-awesome-loader'
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(html)$/,
                use: ['html-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
        }),
        new HtmlWebPackPlugin({
            filename: 'index.html',
            chunks: ['index', 'vendors'],
            template: 'index.html',
            inject: 'head',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        })
    ],
}
