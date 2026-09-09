import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { AuthResponse } from './interfaces/auth-response.interface';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    validateUser(userId: string): Promise<UserEntity>;
    getProfile(userId: string): Promise<UserEntity>;
    private hashPassword;
    private comparePasswords;
    private generateToken;
    private mapToUserEntity;
}
