"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const origin_guard_1 = require("./origin.guard");
describe('OriginGuard', () => {
    let guard;
    const originalFrontendUrl = process.env.FRONTEND_URL;
    beforeEach(() => {
        delete process.env.FRONTEND_URL;
        guard = new origin_guard_1.OriginGuard();
    });
    afterEach(() => {
        if (originalFrontendUrl === undefined) {
            delete process.env.FRONTEND_URL;
        }
        else {
            process.env.FRONTEND_URL = originalFrontendUrl;
        }
    });
    const buildContext = (headers) => ({
        switchToHttp: () => ({
            getRequest: () => ({ headers }),
        }),
    });
    it('should allow the request when Origin is in the whitelist', () => {
        const context = buildContext({ origin: 'http://localhost:5173' });
        expect(guard.canActivate(context)).toBe(true);
    });
    it('should reject the request when Origin is not in the whitelist', () => {
        const context = buildContext({ origin: 'https://attacker.evil' });
        expect(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
    });
    it('should fall back to Referer when Origin header is absent', () => {
        const context = buildContext({ referer: 'http://localhost:3000/booking' });
        expect(guard.canActivate(context)).toBe(true);
    });
    it('should reject when Referer points to a disallowed origin', () => {
        const context = buildContext({ referer: 'https://attacker.evil/csrf.html' });
        expect(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
    });
    it('should allow the request when neither Origin nor Referer is present (non-browser clients)', () => {
        const context = buildContext({});
        expect(guard.canActivate(context)).toBe(true);
    });
    it('should allow the request when Referer is malformed instead of throwing', () => {
        const context = buildContext({ referer: 'not-a-valid-url' });
        expect(guard.canActivate(context)).toBe(true);
    });
});
//# sourceMappingURL=origin.guard.spec.js.map