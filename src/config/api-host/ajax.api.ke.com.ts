// src/config/api-host/ajax.api.ke.com.ts
import env from "../env";

let config: { [key in typeof env]: string } = {
    local: "http://ajax.api.ke.com",
    dev: "http://ajax.api.ke.com",
    test: "http://ajax.api.ke.com",
    pre: "http://ajax.api.ke.com",
    prod: "http://ajax.api.ke.com",
};

// 环境下对应的host地址
export const Const_Host = config[env];
// 需要转发到www.baidu.com的前端请求特征前缀
export const Const_Prefix = "/api/ke/" as const;
// 需要转发到www.baidu.com的前端请求特征正则匹配表达式
export const Const_Match_Reg = /^\/api\/ke\/.+/;