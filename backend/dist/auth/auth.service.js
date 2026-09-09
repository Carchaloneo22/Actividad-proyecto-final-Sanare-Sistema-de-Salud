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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../common/prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const user_entity_1 = require("./entities/user.entity");
let AuthService = class AuthService {
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, phone, dni } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        if (dni) {
            const existingDni = await this.prisma.user.findUnique({
                where: { dni },
            });
            if (existingDni) {
                throw new common_1.ConflictException('El DNI ya está registrado');
            }
        }
        const hashedPassword = await this.hashPassword(password);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                dni,
            },
        });
        this.mailService
            .sendWelcomeEmail(email, firstName, lastName)
            .catch((error) => {
            console.error('Error sending welcome email:', error);
        });
        const accessToken = this.generateToken(user);
        const userEntity = this.mapToUserEntity(user);
        return {
            user: userEntity,
            accessToken,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Usuario inactivo');
        }
        const isPasswordValid = await this.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const accessToken = this.generateToken(user);
        const userEntity = this.mapToUserEntity(user);
        return {
            user: userEntity,
            accessToken,
        };
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Usuario no encontrado o inactivo');
        }
        return this.mapToUserEntity(user);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('Usuario no encontrado');
        }
        return this.mapToUserEntity(user);
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    mapToUserEntity(user) {
        return new user_entity_1.UserEntity({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dni: user.dni,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map