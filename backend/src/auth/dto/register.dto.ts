import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@email.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña (mínimo 6 caracteres)',
    example: 'Password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50)
  password: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+54 11 1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[\d\s\+\-\(\)]+$/, {
    message: 'Formato de teléfono inválido',
  })
  phone?: string;

  @ApiProperty({
    description: 'DNI del usuario',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{7,8}$/, { message: 'DNI inválido (debe tener 7 u 8 dígitos)' })
  dni?: string;
}
