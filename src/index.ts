// src/index.ts

// 配置 ~/src 通用导入前缀, 方便编写后续文件
require("module-alias").addAlias("~/src", __dirname + "/");
import Koa from "koa";
import ApiRedirectService from "~/src/service/api_redirect";

const Const_Listen_Port = 3000

const app = new Koa();

// 注册中间件服务, 进行接口转发
app.use(ApiRedirectService);

// 实际业务代码
app.use((ctx) => {
    ctx.response.body = "Hello World";
});

console.log(`项目启动, 运行在${Const_Listen_Port}端口`)
console.log(`点击测试api转发功能`)
console.log(`http://127.0.0.1:3000/api/ke/sug/headerSearch?cityId=110000&cityName=%E5%8C%97%E4%BA%AC&channel=site&keyword=%E5%8C%97%E4%BA%AC&query=%E5%8C%97%E4%BA%AC`)

// 启动并监听端口
app.listen(Const_Listen_Port);