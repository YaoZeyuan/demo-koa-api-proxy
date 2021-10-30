// src/service/api_redirect.ts
import * as A1_Ke_Com_ApiHost from "~/src/config/api-host/a1.ke.com";
import * as Ajax_Api_Ke_Com_ApiHost from "~/src/config/api-host/ajax.api.ke.com";
import Router from "koa-router";
import Koa from "koa";
import axios from "axios";
// 用于解析cookie, 方便根据服务端要求配置请求的header头
import cookie from "cookie";

let http = axios.create()

let apiHostList = [
    A1_Ke_Com_ApiHost,
    Ajax_Api_Ke_Com_ApiHost,
]

// 定义前缀类型列表, 方便后续编写匹配函数
type Type_Prefix = (typeof apiHostList)[number]['Const_Prefix']

// 根据前端请求的页面前缀, 判断实际需要转发的host值
function getApiHost(prefix: Type_Prefix) {
    for (let config of apiHostList) {
        if (prefix === config.Const_Prefix) {
            return config.Const_Host
        }
    }
    console.log(`没有找到与${prefix}相匹配的配置项, 返回默认值`)
    return A1_Ke_Com_ApiHost.Const_Host;
}

// 包裹一层, 以根据prefix返回对应接口转发函数
let getAsyncRedirectResponse = (prefix: Type_Prefix) => {
    return async (ctx: Koa.ParameterizedContext) => {
        let headers = {
            // 不能直接透传header头, 否则会有很多问题
            // 例如:
            // host和实际请求域名不一致, 则对方Nginx服务器无法根据host值做端口转发, http报403, https报证书验证失败
            // content-length 和实际请求长度不一致(后续修改过body), 则有可能被认为是非法请求直接拒绝
            // cookie不能为undefined, 只能为空字符串或不传, 否则axios转发时会报配置异常----如果h5环境中正好没有cookie, 那么ctx.request.headers?.["cookie"]就是undefined, 不加兜底的""就会导致无法转发网络请求
            cookie: ctx.request.headers?.["cookie"] || "",
            "user-agent": ctx.request.headers?.["user-agent"] || "",
            // 强制指定响应值为json格式
            accept: "application/json",
        };

        // 过滤cookie, 获取token
        let cookieStr = ctx.request.headers?.["cookie"] || "";
        let cookieObj: {
            token?: string;
        } = cookie.parse(cookieStr);

        // 拿到客户端cookie中的token值, 后续根据api业务方需求进行专门处理
        let token = cookieObj.token || "";

        // 根据api类别添加额外处理逻辑
        if (prefix === A1_Ke_Com_ApiHost.Const_Prefix) {
            // a1.ke.com需要在header中额外添加token字段, 以进行权限校验
            headers["a1.ke.com-token"] = token;
        }
        if (prefix === Ajax_Api_Ke_Com_ApiHost.Const_Prefix) {
            // 示例接口不需要转发cookie
            // headers["a1.ke.com-token"] = token;
        }

        // 根据传入prefix配置, 解析客户端请求url, 拼接生成实际需要请求的api服务地址
        let rawRequestUrl = ctx.request.url;
        let requestUrl = rawRequestUrl.split(prefix)[1];
        let api_host = getApiHost(prefix);
        let targetUrl = `${api_host}/${requestUrl}`;

        // 实际发送请求
        let response;

        if (ctx.request.method === "GET") {
            // get请求
            response = await http.get(targetUrl, {
                headers: headers,
            });
        } else {
            // post请求
            // 未支持其他类型请求
            response = await http.post(
                targetUrl,
                {
                    // @ts-ignore
                    ...ctx.request?.body,
                },
                {
                    headers: headers,
                }
            );
        }

        if (response?.status === 200) {
            // 返回数据
            ctx.body = response?.data || "";
            // 设置响应头
            ctx.set("Content-Type", response?.headers?.["content-type"]);
        } else {
            ctx.status = response?.status;
            ctx.body = {
                success: false,
            };
            ctx.set("Content-Type", "application/json");
        }
        return;
    };
};

// 总路由, 接管以api为前缀的网络请求
let totalRouter = new Router();

// 批量注册路由配置
for (let config of apiHostList) {
    let router = new Router()
    // 获取config服务对应的接口处理函数
    router.all(config.Const_Match_Reg, getAsyncRedirectResponse(config.Const_Prefix))
    // 在总路由中进行注册
    totalRouter.use(router.routes());
}


// 添加路由拦截操作
// 实际注册中间件服务
export default totalRouter.routes();