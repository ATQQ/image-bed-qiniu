# 使用Node.js作为基础镜像进行构建
FROM node:18-alpine AS build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install --registry=https://registry.npmmirror.com

# 复制项目文件
COPY . .

# 复制lock文件
COPY scripts/package-lock.json ./

# 构建应用
RUN npm run build

# 使用nginx作为生产环境的基础镜像
FROM nginx:stable-alpine AS production-stage

# 从构建阶段复制构建好的文件到nginx服务目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义nginx配置（如果需要）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]