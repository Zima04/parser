const PROXY_CONFIG = [
  {
    context: [
      '/vacatures',
      '/test2',
      '/test3',
    ],
    target: 'https://www.nationalevacaturebank.nl/',
    secure: true,
    logLevel: "debug",
    configure: (proxy, _options) => {
      proxy.on("error", (err, _req, _res) => {
        console.log("proxy error", err);
      });
      proxy.on("proxyReq", (proxyReq, req, _res) => {
        const headers = proxyReq.getHeaders();
        // console.log(headers);
        console.log(
          req.method,
          req.url,
          " -> ",
          `${headers.host}${proxyReq.path}`,
        );
      });
      proxy.on("proxyRes", (proxyRes, req, _res) => {
        console.log(
          req.method,
          "Target Response",
          proxyRes.statusCode,
          ":",
          req.url,
        );
      });
    },
    // pathRewrite: {
    //   "^/vacatures": "https://www.nationalevacaturebank.nl/vacatures"
    // },
    // headers: { host: 'https://www.nationalevacaturebank.nl' },
    changeOrigin: true
  }
]

module.exports = PROXY_CONFIG;

