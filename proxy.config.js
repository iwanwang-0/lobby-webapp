/**
 * DEV_SERVER_PROXY
 */
const proxyMap = {
  test: {
    '/api': {
      target: 'http://8.218.123.140:8001',
      ws: true,
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api/client': '/brix',
      // },
      // logLevel: 'debug',
    },
  },
  prod: {
    '/api': {
      target: 'http://8.218.123.140:8001',
      ws: true,
      changeOrigin: true,
      // logLevel: 'debug',
    },
  },
};

module.exports = proxyMap;
