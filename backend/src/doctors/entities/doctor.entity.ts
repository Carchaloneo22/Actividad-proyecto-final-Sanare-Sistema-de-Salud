import { ApiProperty } from '@nestjs/swagger';

export class DoctorEntity {
  @ApiProperty({ description: 'ID único del doctor' })
  id: string;

  @ApiProperty({ description: 'Nombre completo del doctor' })
  name: string;

  @ApiProperty({ description: 'Email del doctor' })
  email: string;

  @ApiProperty({ description: 'Teléfono del doctor' })
  phone: string;

  @ApiProperty({ description: 'Hospital o centro de salud' })
  hospital: string;

  @ApiProperty({ description: 'ID de la especialidad' })
  specialtyId: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}
