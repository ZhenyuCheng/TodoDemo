# TodoDemo

* 服务器基于node.js npm 以及mysql数据库，数据库配置在server/config目录下，默认为develop环境
#### 运行项目


```bash
npm start
```

或者

```bash
node app.js
```



#### 访问

* 默认端口为3000
* 可通过 (http://localhost:3000/) 或者(http://localhost:3000/index) NEJ版本 Demo主页
* 可通过 (http://localhost:3000/regular) 访问regular版本Demo页面 页面底部有切换链接
* 前端部分也可以通过nei server来启动 需要安装全局安装nei，会自动打开(http://localhost:8002/) 页面

#### 文件目录
* 前端部分代码在public文件夹下
* 后端代码在server文件夹下
* 入口文件在view文件夹下
* view文件夹下的index.ejs为NEJ版本的Demo regular.ejs为Regular版本的Demo