const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

// 1. 填入你要代理的目标 API 域名（去掉 https://，只需填纯域名）
const TARGET_HOST = 'https://anyrouter.top'; 

// 2. 配置代理转发
app.use('/', proxy(TARGET_HOST, {
  proxyReqOptDecorator: (proxyReqOpts) => {
    // 改变请求头中的 Host，防止目标站点拒收
    proxyReqOpts.headers['host'] = TARGET_HOST;
    return proxyReqOpts;
  },
  // 支持流式响应 (SSE / 打字机输出)
  userResHeaderDecorator(headers) {
    headers['access-control-allow-origin'] = '*';
    headers['access-control-allow-headers'] = '*';
    headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    return headers;
  }
}));

// Zeabur 会自动传入 PORT 环境变量
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
