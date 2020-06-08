const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SyncCopyWebpackPlugin = require('@eutrepe/sync-copy-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const manifest = {};

module.exports = {
    entry: {
        homePage: './src/assets/js/pages/index.js',
        aboutPage: './src/assets/js/pages/about.js'
    },
    output: {
        path: path.resolve(__dirname, './web'),
        publicPath: ''
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: function () {
                return 'vendors';
            },
            minSize: 10000
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin()
        ]
    },
    module: {
        rules: [
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
        new CopyWebpackPlugin([{
            context: 'src',
            from: {
              glob: 'static/**/*',
              dot: true
            },
            copyUnmodified: true,
            to: '[name].[ext]',
        }]),  
        new SyncCopyWebpackPlugin([{
            context: 'src',
            from: {
              glob: 'uploads/images/**',
              dot: true
            },
            copyUnmodified: true,
            to: '[path][name].[contenthash:32].[ext]',
            transformPath(targetPath, absolutePath) {
              const assetsIndex = absolutePath.indexOf('uploads/images');
              const fileInsidePath = absolutePath.substr(assetsIndex);
              
              manifest[fileInsidePath.replace(/\.[a-f0-9]{32}\./, '.')] = targetPath;
    
              return targetPath;
            }
          },
          {
            context: 'src',
            from: {
              glob: 'uploads/video/**',
              dot: true
            },
            copyUnmodified: true,
            to: '[path][name].[contenthash:32].[ext]',
            transformPath(targetPath, absolutePath) {
              const assetsIndex = absolutePath.indexOf('uploads/video');
              const fileInsidePath = absolutePath.substr(assetsIndex);
    
              manifest[fileInsidePath.replace(/\.[a-f0-9]{32}\./, '.')] = targetPath;
    
              return targetPath;
            }
          },
          {
            context: 'src',
            from: {
              glob: 'uploads/i18n/**/*.json',
              dot: true
            },
            copyUnmodified: true,
            to: '[path][name].[ext]',
            transform(content) {
              let config = JSON.stringify(JSON.parse(content));
    
              Object.keys(manifest).forEach((key) => {
                var re = new RegExp(key, 'g');
                config = config.replace(re, manifest[key]);
              });
              return config;
            }
          }], {sync: true}),
    ],
};
