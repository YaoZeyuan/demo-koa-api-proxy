// src/index.ts

// 配置 ~/src 通用导入前缀, 方便编写后续文件
require("module-alias").addAlias("~/src", __dirname + "/");
import Koa from "koa";
import ApiRedirectService from "~/src/service/api_redirect";

const app = new Koa();

// 注册中间件服务
app.use(ApiRedirectService);

// 实际业务代码
app.use(async (ctx) => {
    ctx.body = "Hello World";
});

// 启动并监听端口
app.listen(3000);