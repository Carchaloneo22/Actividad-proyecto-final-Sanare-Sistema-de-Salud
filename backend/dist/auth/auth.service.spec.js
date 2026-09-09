"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../common/prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../mail/mail.service");
const redis_service_1 = require("../common/redis/redis.service");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
describe('AuthService', () => {
    let service;
    let prismaService;
    let jwtService;
    let mailService;
    let redisService;
    const mockUser = {
        id: 'user-uuid-1',
        email: 'test@sanare.gob.ar',
        password: '$2b$10$testhashvaluefortestingpurposesonly',
        firstName: 'Carlos',
        lastName: 'Gómez',
        role: 'PATIENT',
        isActive: true,
    };
    beforeEach(async () => {
        prismaService = {
            user: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
        };
        jwtService = {
            sign: jest.fn().mockReturnValue('mock-access-token-xyz'),
        };
        mailService = {
            sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
        };
        redisService = {
            saveRefreshToken: jest.fn().mockResolvedValue(undefined),
            getRefreshToken: jest.fn(),
            revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
            revokeAllUserSessions: jest.fn().mockResolvedValue(undefined),
        };
        const configService = {
            get: jest.fn((key, defaultValue) => {
                if (key === 'JWT_SECRET')
                    return 'supersecretkeyforunitdevelopment32chars!';
                if (key === 'JWT_EXPIRATION')
                    return '15m';
                if (key === 'JWT_REFRESH_EXPIRATION')
                    return '7d';
                if (key === 'REFRESH_TOKEN_EXPIRES_IN')
                    return '7d';
                return defaultValue ?? null;
            }),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: prisma_service_1.PrismaService, useValue: prismaService },
                { provide: jwt_1.JwtService, useValue: jwtService },
                { provide: mail_service_1.MailService, useValue: mailService },
                { provide: redis_service_1.RedisService, useValue: redisService },
                { provide: config_1.ConfigService, useValue: configService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('register', () => {
        it('should throw ConflictException if user email already exists', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            await expect(service.register({
                email: 'test@sanare.gob.ar',
                password: 'password123',
                firstName: 'Carlos',
                lastName: 'Gómez',
            })).rejects.toThrow(common_1.ConflictException);
        });
        it('should create new user and return tokens when registration succeeds', async () => {
            prismaService.user.findUnique.mockResolvedValue(null);
            prismaService.user.create.mockResolvedValue(mockUser);
            const result = await service.register({
                email: 'test@sanare.gob.ar',
                password: 'password123',
                firstName: 'Carlos',
                lastName: 'Gómez',
            });
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken', 'mock-access-token-xyz');
            expect(result).toHaveProperty('refreshToken');
            expect(redisService.saveRefreshToken).toHaveBeenCalled();
        });
    });
    describe('login', () => {
        it('should throw UnauthorizedException for invalid email', async () => {
            prismaService.user.findUnique.mockResolvedValue(null);
            await expect(service.login({ email: 'unknown@sanare.gob.ar', password: 'password123' })).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should throw UnauthorizedException for wrong password', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
            await expect(service.login({ email: 'test@sanare.gob.ar', password: 'wrongpassword' })).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should return accessToken, refreshToken and user on successful login', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
            const result = await service.login({ email: 'test@sanare.gob.ar', password: 'password123' });
            expect(result.accessToken).toBe('mock-access-token-xyz');
            expect(result.refreshToken).toBeDefined();
            expect(result.user.email).toBe('test@sanare.gob.ar');
            expect(redisService.saveRefreshToken).toHaveBeenCalled();
        });
    });
    describe('refreshTokens', () => {
        it('should throw UnauthorizedException if refresh token is not found or revoked in Redis', async () => {
            redisService.getRefreshToken.mockResolvedValue(null);
            await expect(service.refreshTokens('invalid-or-revoked-token-uuid')).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should rotate tokens and return new access and refresh tokens', async () => {
            redisService.getRefreshToken.mockResolvedValue({
                userId: mockUser.id,
                role: mockUser.role,
                email: mockUser.email,
            });
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.refreshTokens('valid-refresh-token-uuid');
            expect(result.accessToken).toBe('mock-access-token-xyz');
            expect(result.refreshToken).toBeDefined();
            expect(redisService.revokeRefreshToken).toHaveBeenCalledWith('valid-refresh-token-uuid', mockUser.id);
            expect(redisService.saveRefreshToken).toHaveBeenCalled();
        });
    });
    describe('logout', () => {
        it('should delete the refresh token from Redis', async () => {
            await service.logout('refresh-token-uuid');
            expect(redisService.revokeRefreshToken).toHaveBeenCalledWith('refresh-token-uuid', undefined);
        });
    });
    describe('changeUserRole', () => {
        it('should throw BadRequestException if user does not exist', async () => {
            prismaService.user.findUnique.mockResolvedValue(null);
            await expect(service.changeUserRole('non-existent-id', 'DOCTOR')).rejects.toThrow();
        });
        it('should update role in db and revoke all sessions in Redis', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            prismaService.user.update.mockResolvedValue({
                ...mockUser,
                role: 'DOCTOR',
            });
            const result = await service.changeUserRole(mockUser.id, 'DOCTOR');
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: mockUser.id },
                data: { role: 'DOCTOR' },
            });
            expect(redisService.revokeAllUserSessions).toHaveBeenCalledWith(mockUser.id);
            expect(result.user.role).toBe('DOCTOR');
            expect(result.message).toContain('Sesiones previas revocadas');
        });
    });
    describe('getAllUsers', () => {
        it('should return all users ordered by createdAt', async () => {
            prismaService.user.findMany.mockResolvedValue([mockUser]);
            const users = await service.getAllUsers();
            expect(users).toHaveLength(1);
            expect(users[0].id).toBe(mockUser.id);
            expect(prismaService.user.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
            });
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map