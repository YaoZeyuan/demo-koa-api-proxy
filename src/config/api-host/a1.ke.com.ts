// src/config/api-host/a1.ke.com.ts
import env from "../env";

let config: { [key in typeof env]: string } = {
    local: "http://dev-a1.ke.com/a1/api",
    dev: "http://dev-a1.ke.com/a1/api",
    test: "http://test-a1.ke.com/a1/api",
    pre: "http://pre-a1.ke.com/a1/api",
    prod: "http://a1.ke.com/a1/api",
};

// 环境下对应的host地址
export const Const_Host = config[env];
// 需要转发到a1.ke.com的前端请求特征前缀
export const Const_Prefix = "/api/a1/" as const;
// 需要转发到a1.ke.com的前端请求特征正则匹配表达式
export const Const_Match_Reg = /^\/api\/a1\/.+/;