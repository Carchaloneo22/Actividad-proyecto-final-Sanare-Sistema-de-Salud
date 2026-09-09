import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentEntity {
  @ApiProperty({ description: 'ID único del turno' })
  id: string;

  @ApiProperty({ description: 'ID del doctor' })
  doctorId: string;

  @ApiProperty({ description: 'ID del usuario (paciente)' })
  userId: string;

  @ApiProperty({ description: 'Nombre del paciente' })
  patientName: string;

  @ApiProperty({ description: 'Email del paciente', required: false })
  patientEmail: string | null;

  @ApiProperty({ description: 'Teléfono del paciente' })
  patientPhone: string;

  @ApiProperty({ description: 'Fecha y hora del turno' })
  date: Date;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  notes: string | null;

  @ApiProperty({ description: 'Estado del turno', enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}
