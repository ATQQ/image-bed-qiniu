const path = require('path')
const miniCssExtract = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    devServer: {
        contentBase: './dist', //项目基本访问目录
        host: '127.0.0.1', //服务器ip地址
        port: 8088 //端口
    },
    mode: 'development',
    entry: {
        index: './src/js/index.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                loader: miniCssExtract.loader,
                options: {
                    publicPath: '../'
                }
            }, 'css-loader']
        }, {
            test: /\.less$/,
            use: [{
                loader: miniCssExtract.loader,
                options: {
                    publicPath: '../'
                }
            }, 'css-loader', 'less-loader']
        }]
    },
    plugins: [
        new miniCssExtract({
            filename: './css/[name].css'
        }),
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html", //生成的文件名
            minify: {
                minimize: true, //是否打包为最小值
                removeAttrbuteQuotes: true, //去除引号
                removeComments: true, //去掉注释
                collapseWhitespace: true, //去掉空格
                minifyCss: true, //压缩css
                removeEmptyElements: false, //清理内容为空的元素
            },
            chunks: ['index'], //引入对应的js(对应(entry)中的入口文件)
            hash: true //引入产出的资源时加上哈希避免缓存
        })
    ]
}