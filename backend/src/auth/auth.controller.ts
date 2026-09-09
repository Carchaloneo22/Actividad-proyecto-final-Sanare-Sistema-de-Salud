import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UserEntity } from './entities/user.entity';
import { AuthResponse } from './interfaces/auth-response.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: UserEntity,
  })
  @ApiResponse({ status: 409, description: 'Email o DNI ya registrado' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getProfile(@GetUser() user: UserEntity): Promise<UserEntity> {
    return this.authService.getProfile(user.id);
  }

  @Get('debug/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Debug: Verificar datos del usuario en el token' })
  async debugMe(@Request() req) {
    return {
      message: 'Datos del usuario desde el token JWT',
      user: req.user,
      hasRole: !!req.user.role,
      roleValue: req.user.role,
    };
  }
}
