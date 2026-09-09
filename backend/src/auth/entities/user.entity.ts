import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  phone?: string | null;

  @ApiProperty({ required: false })
  dni?: string | null;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Excluimos el password de la entity pública
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
