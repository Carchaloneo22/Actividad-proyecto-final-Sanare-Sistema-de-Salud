"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_HEADERS = exports.ALLOWED_METHODS = void 0;
exports.getAllowedOrigins = getAllowedOrigins;
exports.getCorsOptions = getCorsOptions;
function getAllowedOrigins() {
    return [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://localhost:80',
        'http://localhost:3002',
        process.env.FRONTEND_URL,
    ].filter((origin) => Boolean(origin));
}
exports.ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
exports.ALLOWED_HEADERS = ['Content-Type', 'Authorization'];
function getCorsOptions() {
    return {
        origin: getAllowedOrigins(),
        credentials: true,
        methods: exports.ALLOWED_METHODS,
        allowedHeaders: exports.ALLOWED_HEADERS,
    };
}
//# sourceMappingURL=cors.config.js.map