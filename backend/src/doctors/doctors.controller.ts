import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorEntity } from './entities/doctor.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los médicos' })
  @ApiQuery({ name: 'specialtyId', required: false })
  @ApiResponse({ status: 200, description: 'Lista de médicos', type: [DoctorEntity] })
  findAll(@Query('specialtyId') specialtyId?: string) {
    return this.doctorsService.findAll(specialtyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un médico por ID' })
  @ApiResponse({ status: 200, description: 'Médico encontrado', type: DoctorEntity })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo médico (solo Admin)' })
  @ApiResponse({ status: 201, description: 'Médico creado', type: DoctorEntity })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDto: CreateDoctorDto) {
    return this.doctorsService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un médico (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Médico actualizado', type: DoctorEntity })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDto);
  }

  @Get(':id/available-slots')
  @ApiOperation({ summary: 'Obtener slots disponibles para un médico' })
  @ApiQuery({ name: 'date', required: true, description: 'Fecha en formato ISO (ej: 2023-01-01)' })
  @ApiResponse({ status: 200, description: 'Lista de slots disponibles' })
  async getAvailableSlots(
    @Param('id') id: string,
    @Query('date') dateString: string,
  ) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }
    
    return this.doctorsService.getAvailableSlots(id, date);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un médico (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Médico eliminado' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar el médico' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }

  @Post(':id/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear horario disponible para un médico (solo Admin)' })
  @ApiResponse({ status: 201, description: 'Horario creado' })
  createSlot(
    @Param('id') id: string,
    @Body() slotDto: { startTime: string; endTime: string }
  ) {
    return this.doctorsService.createAvailableSlot(
      id,
      new Date(slotDto.startTime),
      new Date(slotDto.endTime),
    );
  }

  @Post(':id/slots/generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generar horarios automáticamente (solo Admin)' })
  @ApiResponse({ status: 201, description: 'Horarios generados' })
  generateSlots(
    @Param('id') id: string,
    @Body() generateDto: {
      daysOfWeek: number[];
      startHour: number;
      endHour: number;
      weeksAhead?: number;
    }
  ) {
    return this.doctorsService.generateWeekSlots(
      id,
      generateDto.daysOfWeek,
      generateDto.startHour,
      generateDto.endHour,
      generateDto.weeksAhead,
    );
  }

  @Delete(':id/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar slots no reservados (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Slots eliminados' })
  clearSlots(@Param('id') id: string) {
    return this.doctorsService.clearAllSlots(id);
  }

  @Delete(':id/slots/duplicates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar slots duplicados para un doctor (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Duplicados eliminados' })
  removeDuplicates(@Param('id') id: string) {
    return this.doctorsService.removeDuplicateSlots(id);
  }

  @Delete('all/duplicates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar slots duplicados para TODOS los doctores (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Duplicados eliminados en todos los doctores' })
  removeAllDuplicates() {
    return this.doctorsService.removeDuplicateSlotsForAll();
  }
}
