const path = require('path');
const nodeModulesPath = path.join(__dirname, 'node_modules');
const webpack = require('webpack');
const npmCfg = require('./package.json');
const projectRoot = path.resolve(__dirname, './');
const {VueLoaderPlugin} = require('vue-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const banner = [
    'vuejs-table v' + npmCfg.version,
    '(c) ' + (new Date().getFullYear()) + ' ' + npmCfg.author,
    npmCfg.homepage
].join('\n');

module.exports = {
    mode: 'production',
    entry: ['@babel/polyfill', './src'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'vuejs-table.min.js',
        library: 'VueTable',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.js', '.vue'],
        modules: [
            nodeModulesPath
        ],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
        }
    },
    resolveLoader: {
        modules: [
            nodeModulesPath
        ]
    },
    externals: {
        "vuejs-ajax": "vuejs-ajax",
        "vuejs-overlay": "vuejs-overlay",
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage'
                        }]
                    ],
                    comments: false
                },
                include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new VueLoaderPlugin()
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin({
            uglifyOptions: {
                warnings: false,
                sourceMap: false,
            }
        })]
    }
};