import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://maps.googleapis.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '', // remove /api prefix
            },
        })
    );
};
