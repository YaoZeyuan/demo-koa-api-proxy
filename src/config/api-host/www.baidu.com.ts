// src/config/api-host/www.baidu.com.ts
import env from "../env";

let config: { [key in typeof env]: string } = {
    local: "http://www.baidu.com/",
    dev: "http://www.baidu.com/",
    test: "http://www.baidu.com/",
    pre: "http://www.baidu.com/",
    prod: "http://www.baidu.com/",
};

// 环境下对应的host地址
export const Const_Host = config[env];
// 需要转发到www.baidu.com的前端请求特征前缀
export const Const_Prefix = "/api/baidu" as const;
// 需要转发到www.baidu.com的前端请求特征正则匹配表达式
export const Const_Match_Reg = /^\/api\/baidu\/.+/;