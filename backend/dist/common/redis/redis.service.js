"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RedisService_1.name);
    }
    onModuleInit() {
        const redisUrl = this.configService.get('REDIS_URL');
        const host = this.configService.get('REDIS_HOST', 'localhost');
        const port = this.configService.get('REDIS_PORT', 6379);
        const commonOptions = {
            retryStrategy: (times) => Math.min(times * 100, 3000),
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        };
        if (redisUrl) {
            this.client = new ioredis_1.default(redisUrl, commonOptions);
        }
        else {
            this.client = new ioredis_1.default({
                host,
                port,
                ...commonOptions,
            });
        }
        const connectionTarget = redisUrl ? 'REDIS_URL' : `${host}:${port}`;
        this.client
            .connect()
            .then(() => {
            this.logger.log(`✅ Conectado a Redis vía ${connectionTarget}`);
        })
            .catch((err) => {
            this.logger.error(`❌ Error conectando a Redis vía ${connectionTarget}:`, err.message);
        });
    }
    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
            this.logger.log('Conexión con Redis cerrada.');
        }
    }
    getClient() {
        return this.client;
    }
    async saveRefreshToken(userId, tokenId, ttlSeconds, role, deviceInfo = 'unknown') {
        const tokenKey = `sanare:auth:refresh:${tokenId}`;
        const userTokensKey = `sanare:auth:user_tokens:${userId}`;
        const data = JSON.stringify({
            userId,
            role,
            deviceInfo,
            createdAt: new Date().toISOString(),
        });
        const pipeline = this.client.pipeline();
        pipeline.setex(tokenKey, ttlSeconds, data);
        pipeline.sadd(userTokensKey, tokenId);
        pipeline.expire(userTokensKey, ttlSeconds);
        await pipeline.exec();
    }
    async getRefreshToken(tokenId) {
        const data = await this.client.get(`sanare:auth:refresh:${tokenId}`);
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch {
            return null;
        }
    }
    async revokeRefreshToken(tokenId, userId) {
        const tokenKey = `sanare:auth:refresh:${tokenId}`;
        if (!userId) {
            const session = await this.getRefreshToken(tokenId);
            if (session) {
                userId = session.userId;
            }
        }
        const pipeline = this.client.pipeline();
        pipeline.del(tokenKey);
        if (userId) {
            pipeline.srem(`sanare:auth:user_tokens:${userId}`, tokenId);
        }
        await pipeline.exec();
    }
    async revokeAllUserSessions(userId) {
        const userTokensKey = `sanare:auth:user_tokens:${userId}`;
        const tokenIds = await this.client.smembers(userTokensKey);
        if (tokenIds && tokenIds.length > 0) {
            const pipeline = this.client.pipeline();
            for (const tokenId of tokenIds) {
                pipeline.del(`sanare:auth:refresh:${tokenId}`);
            }
            pipeline.del(userTokensKey);
            await pipeline.exec();
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map