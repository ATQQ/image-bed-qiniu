# image-bed-qiniu

使用七牛云简单搭建的一个Web图床应用,支持粘贴,拖拽上传图片文件,自动生成markdown格式的图片链接到剪贴板中

## 效果

![图片](http://img.cdn.sugarat.top/mdImg/MTU3Nzc2MDI4NzE2OQ==577760287169)

## 所需资源
* [七牛云](https://portal.qiniu.com/)账号一枚
* [七牛云对象存储空间](https://portal.qiniu.com/bucket/create)(免费10G)
* [Node.js](http://nodejs.cn/) 


## 快速食用

### 1.获取项目文件
①克隆仓库到本地
```npm
git clone https://github.com/ATQQ/image-bed-qiniu.git
```

②或者下载zip文件到本地
![图片](http://img.cdn.sugarat.top/mdImg/MTU3Nzc2MDYzNzc1MA==577760637750)

### 2.进入项目主目录
```
cd image-bed-qiniu
```

目录结构为
```text
├── build                   生产环境打包的文件
│   ├── css                 样式表
│   │   └── index.css
│   ├── index.html          运行入口(可直接双击打开)
│   └── js                  打包后的js脚本
│       └── index.js
|
├── dist                    开发环境打包的文件
|
|
├── package.json            依赖的库与npm命令
├── package-lock.json
├── README.md               食用指南
├── src                     生产环境下的代码文件存放目录
│   ├── config              七牛云的配置文件存放
│   │   └── qiniu.config.js
│   ├── css                 css样式表存放
│   │   └── index.css
│   ├── index.html          页面文件
│   ├── js                  页面业务逻辑脚本
│   │   └── index.js        
│   ├── less                less样式表存放
│   │   └── index.less
│   └── utils               工具函数存放
│       ├── qiniuUtil.js    负责七牛云上传文件
│       └── viewUtil.js     负责视图数据的封信
├── token.js                负责生成七牛云鉴权token
├── token.txt               执行token.js生成的token
├── webpack.config.build.js 生产环境webpack配置
└── webpack.config.js       开发环境webpack配置
```

### 3.运行
#### 1.直接运行
双击直接运行build目录中的index.html进行体验(token有效期限只设置的7天可能体验的时候过期了,就使用下面的那种方式)

![图片](http://img.cdn.sugarat.top/mdImg/MTU3Nzc2MTMwNjE5NQ==577761306195)

#### 2.通过配置开发环境启动
1. 安装依赖(国内推荐使用[npm淘宝镜像源](http://npm.taobao.org/),安装更快速)

```npm
npm install
```
2. 修改token.js文件获取七牛云的秘钥

```js
// ...省略前部分
// 七牛账号下的一对有效的Access Key和Secret Key
// 对象存储空间名称 bucket
let accessKey = 'xxxx',
    secretKey = 'xxx',
    bucket = 'xxxx';

//鉴权对象
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

let options = {
    scope: bucket,
    expires: 60 * 60 * 24 * 7 //这里设置的7天,token过期时间(s(秒))
};
//...省略后部分
```
>[qiniu-nodejs-sdk文档](https://developer.qiniu.com/kodo/sdk/1289/nodejs)
<details>
<summary>图片解释</summary>
1. 对象存储空间名称 bucket
<img src="http://img.cdn.sugarat.top/mdImg/MTU3Nzc2MjM3NDI3Mw==577762374273">
2.Access Key和Secret Key
<img src="http://img.cdn.sugarat.top/mdImg/MTU3Nzc2MjUwMzA3Ng==577762503076">
<img src="http://img.cdn.sugarat.top/mdImg/MTU3Nzc2MjU5ODU4NQ==577762598585">
</details> 


3. 修改完成后运行token.js

```npm
node token.js
```
同级目录下生成token.txt文件
![图片](http://img.cdn.sugarat.top/mdImg/MTU3Nzc2MjcyMTM3MQ==577762721371)

4. 修改 src/config/qiniu.config.js中的七牛云配置文件

```js
//...code
let config = {
    useCdnDomain: true,//是否使用 cdn 加速域名默认false
    region: qiniu.region.z0//选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域,我是选择的华东所以是z0
}
let token = 'xxx';//刚刚生成的token

//绑定的域名
//官方会提供一个30天的临时域名,推荐绑定自己的域名避免临时的图片链接30天后失效
let Domain = 'xxxx';
//...code
```
![图片](http://img.cdn.sugarat.top/mdImg/MTU3Nzc2Mzk0NTk4NA==577763945984)

> [qiniu-JavaScript-sdk文档](https://developer.qiniu.com/kodo/sdk/1283/javascript)

5. 上述修改完毕后就可以启动运行了

```npm
# 开发环境直接运行
npm run dev

# 开发环境打包
npm run dev:dist

# 生产环境打包
npm run build
```
这些命令可以在[package.json](./package.json)中直接修改

## 运行项目的方式
1. 直接运行打包文件(dist/build)下的index.html文件
2. 将打包后的文件夹部署到github的静态资源站点
3. 将打包后的文件夹部署到nginx服务器上
4. ...more更多方法,等待你自己去解锁