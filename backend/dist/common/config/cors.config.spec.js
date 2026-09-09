"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors_config_1 = require("./cors.config");
describe('cors.config', () => {
    const originalFrontendUrl = process.env.FRONTEND_URL;
    afterEach(() => {
        if (originalFrontendUrl === undefined) {
            delete process.env.FRONTEND_URL;
        }
        else {
            process.env.FRONTEND_URL = originalFrontendUrl;
        }
    });
    describe('getAllowedOrigins', () => {
        it('should include the known local development origins', () => {
            delete process.env.FRONTEND_URL;
            const origins = (0, cors_config_1.getAllowedOrigins)();
            expect(origins).toContain('http://localhost:3000');
            expect(origins).toContain('http://localhost:5173');
        });
        it('should include FRONTEND_URL when set', () => {
            process.env.FRONTEND_URL = 'https://sanare.gob.ar';
            const origins = (0, cors_config_1.getAllowedOrigins)();
            expect(origins).toContain('https://sanare.gob.ar');
        });
        it('should never contain empty or undefined entries when FRONTEND_URL is unset', () => {
            delete process.env.FRONTEND_URL;
            const origins = (0, cors_config_1.getAllowedOrigins)();
            expect(origins).not.toContain('');
            expect(origins).not.toContain(undefined);
        });
    });
    describe('getCorsOptions', () => {
        it('should enable credentials', () => {
            expect((0, cors_config_1.getCorsOptions)().credentials).toBe(true);
        });
        it('should restrict methods to the explicit whitelist actually used by the API', () => {
            expect((0, cors_config_1.getCorsOptions)().methods).toEqual(cors_config_1.ALLOWED_METHODS);
            expect(cors_config_1.ALLOWED_METHODS).toEqual(['GET', 'POST', 'PUT', 'DELETE']);
        });
        it('should restrict allowedHeaders to the explicit whitelist actually sent by the frontend', () => {
            expect((0, cors_config_1.getCorsOptions)().allowedHeaders).toEqual(cors_config_1.ALLOWED_HEADERS);
            expect(cors_config_1.ALLOWED_HEADERS).toEqual(['Content-Type', 'Authorization']);
        });
        it('should never allow a wildcard origin', () => {
            const options = (0, cors_config_1.getCorsOptions)();
            expect(options.origin).not.toBe('*');
            expect(Array.isArray(options.origin)).toBe(true);
        });
    });
});
//# sourceMappingURL=cors.config.spec.js.map