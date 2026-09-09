import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName, phone, dni } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar DNI si fue proporcionado
    if (dni) {
      const existingDni = await this.prisma.user.findUnique({
        where: { dni },
      });

      if (existingDni) {
        throw new ConflictException('El DNI ya está registrado');
      }
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Crear usuario
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

    // Enviar email de bienvenida (no bloqueante)
    this.mailService
      .sendWelcomeEmail(email, firstName, lastName)
      .catch((error) => {
        console.error('Error sending welcome email:', error);
        // No lanzamos el error para no bloquear el registro
      });

    // Generar token
    const accessToken = this.generateToken(user);

    // Retornar usuario sin password
    const userEntity = this.mapToUserEntity(user);

    return {
      user: userEntity,
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Verificar password
    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token
    const accessToken = this.generateToken(user);

    // Retornar usuario sin password
    const userEntity = this.mapToUserEntity(user);

    return {
      user: userEntity,
      accessToken,
    };
  }

  async validateUser(userId: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    return this.mapToUserEntity(user);
  }

  async getProfile(userId: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return this.mapToUserEntity(user);
  }

  // Métodos privados auxiliares
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private mapToUserEntity(user: User): UserEntity {
    return new UserEntity({
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
}
