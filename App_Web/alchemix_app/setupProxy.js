import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    '/api', // Endpoint du backend
    createProxyMiddleware({
      target: 'http://localhost:8082', // Adresse du backend
      changeOrigin: true,
    })
  );
};