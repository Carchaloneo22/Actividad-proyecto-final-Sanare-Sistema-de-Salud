import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private client;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
    getClient(): Redis;
    saveRefreshToken(userId: string, tokenId: string, ttlSeconds: number, role?: string, deviceInfo?: string): Promise<void>;
    getRefreshToken(tokenId: string): Promise<{
        userId: string;
        role?: string;
        deviceInfo?: string;
        createdAt: string | number;
    } | null>;
    revokeRefreshToken(tokenId: string, userId?: string): Promise<void>;
    revokeAllUserSessions(userId: string): Promise<void>;
}
