# image-bed-qiniu

使用七牛云简单搭建的一个Web图床应用,支持粘贴,拖拽上传,直接选择等方式上传图片文件,自动生成markdown格式的图片链接到剪贴板中

## 效果
![图片](https://img.cdn.sugarat.top/mdImg/MTU3OTQwMDU4MjE0NA==579400582144)


## 所需资源
* [七牛云](https://portal.qiniu.com/)账号一枚
* [七牛云对象存储空间](https://portal.qiniu.com/bucket/create)(免费10G)
* [Node.js](http://nodejs.cn/) 

## 使用指南

### 1.获取项目文件
```npm
git clone https://github.com/ATQQ/image-bed-qiniu.git
```


### 2.进入项目主目录
```
cd image-bed-qiniu
```

### 3. 安装依赖
```sh
yarn install
```
### 4. 配置秘钥/空间/域名
在.env文件中加入相应的内容
```sh
QINIU_ACCESS_KEY=AccessKey
QINIU_SECRET_KEY=SecretKey
QINIU_BUCKET=Bucket
QINIU_DOMAIN=domain
```

<details>
<summary>查看 bucket</summary>
<img src="https://img.cdn.sugarat.top/mdImg/MTU3Nzc2MjM3NDI3Mw==577762374273">
</details> 

<details>
<summary>查看 Access Key和Secret Key</summary>
<img src="https://img.cdn.sugarat.top/mdImg/MTU3Nzc2MjUwMzA3Ng==577762503076">

<img src="https://img.cdn.sugarat.top/mdImg/MTU3Nzc2MjU5ODU4NQ==577762598585">
</details> 

<details>
<summary>查看域名</summary>

![图片](https://img.cdn.sugarat.top/mdImg/MTU3Nzc2Mzk0NTk4NA==577763945984)

</details> 

### 运行
#### 开发环境预览
```sh
npm run dev
```

#### 生产环境
```sh
npm run build
```

> [qiniu-JavaScript-sdk文档](https://developer.qiniu.com/kodo/sdk/1283/javascript)
