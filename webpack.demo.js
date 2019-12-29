const path = require('path');
const nodeModulesPath = path.join(__dirname, 'node_modules');
const projectRoot = path.resolve(__dirname, './');
const {VueLoaderPlugin} = require('vue-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: ['./demo/index.js'],
    output: {
        path: path.resolve(__dirname, 'demo/assets'),
        filename: 'script.js',
        library: 'VueTableDemo',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json'],
        modules: [
            nodeModulesPath
        ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    resolveLoader: {
        modules: [
            nodeModulesPath
        ]
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
        new VueLoaderPlugin(),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: {baseDir: ['demo']},
            notify: false
        })
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