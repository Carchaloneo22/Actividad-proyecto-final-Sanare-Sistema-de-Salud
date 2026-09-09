import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SpecialtiesService } from './specialties.service';

@ApiTags('specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las especialidades' })
  @ApiResponse({ status: 200, description: 'Lista de especialidades' })
  findAll() {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una especialidad por ID' })
  @ApiResponse({ status: 200, description: 'Especialidad encontrada' })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada' })
  findOne(@Param('id') id: string) {
    return this.specialtiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva especialidad' })
  @ApiResponse({ status: 201, description: 'Especialidad creada' })
  create(@Body() createDto: { name: string; description?: string }) {
    return this.specialtiesService.create(createDto);
  }
}
