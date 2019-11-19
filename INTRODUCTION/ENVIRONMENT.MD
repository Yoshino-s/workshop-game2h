# 环境安装

## 通过包管理器安装以下软件：  
* git
* nodejs  

Ubuntu: `sudo apt install git nodejs npm`  
CentOS: `sudo yum install git nodejs npm`  
其他: 忘了，记起来了后补

---

## 切换node版本：

```sh
sudo npm i n -g
sudo n latest
```
再次查看node版本：
```sh
node -v 
```
此时因该是"v13.1.0"

---
## 安装全局包：
```sh
sudo npm i typescript -g
```

---
## 初始化项目
在github上fork此项目  

切换到项目存放目录  
然后拉取基础配置
```sh
git clone #你fork的项目的地址# workshop
cd workshop
```