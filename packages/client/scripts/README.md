# Docker 构建脚本

本目录包含用于构建 Docker 镜像的脚本。

## 脚本说明

### 1. 本地构建脚本 (build-local.sh)

此脚本用于在本地构建 Docker 镜像。

**用法:**

```bash
# 使用默认标签 latest
./build-local.sh

# 指定自定义标签
./build-local.sh v1.0.0
```

### 2. 多平台构建并推送脚本 (build-push.sh)

此脚本用于构建多平台 Docker 镜像（支持 linux/amd64 和 linux/arm64）并推送到 Docker Hub。

**用法:**

```bash
# 使用默认标签 latest
./build-push.sh

# 指定自定义标签
./build-push.sh v1.0.0
```

**注意:** 在运行此脚本前，请确保已使用 `docker login` 命令登录到 Docker Hub。

## 镜像信息

- 镜像名称: `sugarat/image-bed`
- 基础镜像: `nginx:alpine`
- 暴露端口: 80

## 使用示例

构建完成后，可以使用以下命令运行容器：

```bash
docker run -d -p 8080:80 sugarat/image-bed:latest
```

然后在浏览器中访问 `http://localhost:8080` 即可。
