import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@email.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
