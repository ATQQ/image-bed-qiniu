compressDir="./dist"               # 压缩目录 
compressFile="result.tar.gz"        # 压缩后的文件名
user="root"                         # 远程登录用户
origin="sugarat.top"                # 远程登录origin
targetDir="/www/wwwroot/imgbed"     # 目标目录
echo "开始-----归档解压"
tar -zvcf ${compressFile} ${compressDir}
echo "开始-----拷贝至服务器"
scp ${compressFile} ${user}@${origin}:./
echo "开始-----部署"
ssh -p22 ${user}@${origin} "tar -xf ${compressFile} && rm -rf ${targetDir}/build/* && mv dist/* ${targetDir}/build && rm -rf ${compressFile}"
echo "部署完成"
rm -rf ${compressFile} 