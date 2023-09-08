const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Endpoint de votre backend
    createProxyMiddleware({
      target: 'http://localhost:8082', // Adresse de votre backend
      changeOrigin: true,
    })
  );
};