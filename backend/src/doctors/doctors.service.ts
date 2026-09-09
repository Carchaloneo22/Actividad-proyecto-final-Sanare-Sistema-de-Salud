import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(specialtyId?: string) {
    return this.prisma.doctor.findMany({
      where: specialtyId ? { specialtyId } : undefined,
      include: {
        specialty: true,
        availableSlots: {
          where: {
            isBooked: false,
            startTime: { gte: new Date() },
          },
          take: 10,
          orderBy: { startTime: 'asc' },
        },
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        specialty: true,
        availableSlots: {
          where: {
            isBooked: false,
            startTime: { gte: new Date() },
          },
          orderBy: { startTime: 'asc' },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor con ID ${id} no encontrado`);
    }

    return doctor;
  }

  async create(createDto: CreateDoctorDto) {
    // Verificar que la especialidad existe
    const specialty = await this.prisma.specialty.findUnique({
      where: { id: createDto.specialtyId },
    });

    if (!specialty) {
      throw new BadRequestException('Especialidad no encontrada');
    }

    // Verificar que el email no esté en uso
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { email: createDto.email },
    });

    if (existingDoctor) {
      throw new BadRequestException('El email ya está en uso');
    }

    return this.prisma.doctor.create({
      data: createDto,
      include: { specialty: true },
    });
  }

  async update(id: string, updateDto: UpdateDoctorDto) {
    // Verificar que el doctor existe
    await this.findOne(id);

    // Si se está actualizando el email, verificar que no esté en uso
    if (updateDto.email) {
      const existingDoctor = await this.prisma.doctor.findUnique({
        where: { email: updateDto.email },
      });

      if (existingDoctor && existingDoctor.id !== id) {
        throw new BadRequestException('El email ya está en uso');
      }
    }

    // Si se está actualizando la especialidad, verificar que existe
    if (updateDto.specialtyId) {
      const specialty = await this.prisma.specialty.findUnique({
        where: { id: updateDto.specialtyId },
      });

      if (!specialty) {
        throw new BadRequestException('Especialidad no encontrada');
      }
    }

    return this.prisma.doctor.update({
      where: { id },
      data: updateDto,
      include: { specialty: true },
    });
  }

  async remove(id: string) {
    // Verificar que el doctor existe
    await this.findOne(id);

    // Verificar si tiene turnos pendientes
    const pendingAppointments = await this.prisma.appointment.count({
      where: {
        doctorId: id,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (pendingAppointments > 0) {
      throw new BadRequestException(
        `No se puede eliminar el doctor porque tiene ${pendingAppointments} turnos pendientes`,
      );
    }

    // Eliminar slots disponibles primero
    await this.prisma.availableSlot.deleteMany({
      where: { doctorId: id },
    });

    // Eliminar doctor
    return this.prisma.doctor.delete({
      where: { id },
    });
  }

  async createAvailableSlot(doctorId: string, startTime: Date, endTime: Date) {
    // Validar que la duración sea exactamente 20 minutos
    const slotDurationMs = 20 * 60 * 1000; // 20 minutos en milisegundos
    const actualDuration = endTime.getTime() - startTime.getTime();

    if (Math.abs(actualDuration - slotDurationMs) > 60000) { // Permitir 1 minuto de margen
      throw new BadRequestException('La duración del turno debe ser exactamente de 20 minutos');
    }

    // Verificar que no sea en el pasado
    const now = new Date();
    if (startTime < now) {
      throw new BadRequestException('No se pueden crear turnos en el pasado');
    }

    // Verificar que no exista un slot que se solape
    const existingSlot = await this.prisma.availableSlot.findFirst({
      where: {
        doctorId,
        isBooked: false, // Solo verificar slots disponibles
        OR: [
          // Slot que comienza dentro del nuevo slot
          {
            AND: [
              { startTime: { gte: startTime } },
              { startTime: { lt: endTime } },
            ],
          },
          // Slot que termina dentro del nuevo slot
          {
            AND: [
              { endTime: { gt: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
          // Slot que contiene completamente al nuevo slot
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    if (existingSlot) {
      throw new BadRequestException(
        `Ya existe un turno programado para ese horario (${existingSlot.startTime.toLocaleTimeString()} - ${existingSlot.endTime.toLocaleTimeString()})`,
      );
    }

    return this.prisma.availableSlot.create({
      data: {
        doctorId,
        startTime,
        endTime,
      },
    });
  }

  async generateWeekSlots(
    doctorId: string,
    daysOfWeek: number[],
    startHour: number,
    endHour: number,
    weeksAhead: number = 4,
  ) {
    // Validar horarios
    if (startHour >= endHour) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }

    if (endHour - startHour > 12) {
      throw new BadRequestException('El rango de horario no puede ser mayor a 12 horas');
    }

    // Validar días de la semana (0=Domingo, 6=Sábado)
    const invalidDays = daysOfWeek.filter(d => d < 0 || d > 6);
    if (invalidDays.length > 0) {
      throw new BadRequestException(`Días de la semana inválidos: ${invalidDays.join(', ')}. Use valores de 0 (Domingo) a 6 (Sábado)`);
    }

    await this.findOne(doctorId);
    const slots = [];
    const now = new Date();
    const slotDurationMs = 20 * 60 * 1000; // 20 minutos en milisegundos

    // Ordenar días de la semana para mejor manejo
    const sortedDays = [...new Set(daysOfWeek)].sort();

    for (let week = 0; week < weeksAhead; week++) {
      for (const dayOfWeek of sortedDays) {
        // Calcular la fecha del día
        const date = new Date(now);
        const daysToAdd = (dayOfWeek - date.getDay() + 7) % 7 + (week * 7);
        date.setDate(date.getDate() + daysToAdd);
        date.setHours(0, 0, 0, 0); // Inicio del día

        // Si la fecha es en el pasado, saltar
        if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
          continue;
        }

        // Crear slots cada 30 minutos dentro del rango horario
        let currentSlotStart = new Date(date);
        currentSlotStart.setHours(startHour, 0, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(endHour, 0, 0, 0);

        while (currentSlotStart < endTime) {
          const slotEnd = new Date(currentSlotStart.getTime() + slotDurationMs);
          
          // Si el slot termina después de la hora de fin, no crearlo
          if (slotEnd > endTime) {
            break;
          }

          // Verificar que el slot no sea en el pasado
          if (currentSlotStart >= now) {
            try {
              const slot = await this.createAvailableSlot(
                doctorId,
                new Date(currentSlotStart),
                new Date(slotEnd),
              );
              slots.push(slot);
            } catch (error) {
              // Si hay un error (como slot duplicado), continuar con el siguiente
              console.log(`No se pudo crear slot: ${error.message}`);
            }
          }

          // Mover al siguiente slot de 20 minutos
          currentSlotStart = new Date(currentSlotStart.getTime() + slotDurationMs);
        }
      }
    }

    return {
      created: slots.length,
      message: `Se crearon ${slots.length} turnos de 20 minutos`,
      slots: slots.map(slot => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: slot.isBooked
      })),
    };
  }

  async getAvailableSlots(doctorId: string, date: Date) {
    // Verificar que el doctor existe
    await this.findOne(doctorId);

    // Calcular inicio y fin del día
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Obtener slots disponibles para el día
    const slots = await this.prisma.availableSlot.findMany({
      where: {
        doctorId,
        isBooked: false,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // IMPORTANTE: Deduplicar slots por startTime para evitar mostrar horarios repetidos
    // Esto es necesario porque puede haber slots duplicados en la base de datos
    const uniqueSlots = new Map<string, typeof slots[0]>();

    for (const slot of slots) {
      // Usar el timestamp de startTime como clave única
      const timeKey = slot.startTime.toISOString();

      // Solo agregar si no existe, o si el ID es menor (para ser consistente)
      if (!uniqueSlots.has(timeKey)) {
        uniqueSlots.set(timeKey, slot);
      }
    }

    // Convertir de vuelta a array y ordenar por hora
    const deduplicatedSlots = Array.from(uniqueSlots.values()).sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    // Formatear la respuesta
    return deduplicatedSlots.map(slot => ({
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      durationMinutes: Math.round((slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60)),
    }));
  }

  async clearAllSlots(doctorId: string) {
    await this.findOne(doctorId);

    const result = await this.prisma.availableSlot.deleteMany({
      where: {
        doctorId,
        isBooked: false,
      },
    });

    return { deleted: result.count };
  }

  /**
   * Elimina slots duplicados para un doctor específico
   * Mantiene solo el primer slot de cada horario y elimina el resto
   */
  async removeDuplicateSlots(doctorId: string) {
    await this.findOne(doctorId);

    // Obtener todos los slots no reservados del doctor
    const allSlots = await this.prisma.availableSlot.findMany({
      where: {
        doctorId,
        isBooked: false,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Agrupar por startTime
    const slotsByTime = new Map<string, typeof allSlots>();

    for (const slot of allSlots) {
      const timeKey = slot.startTime.toISOString();

      if (!slotsByTime.has(timeKey)) {
        slotsByTime.set(timeKey, []);
      }

      slotsByTime.get(timeKey)!.push(slot);
    }

    // Identificar duplicados (slots con más de 1 entrada por horario)
    const duplicateIds: string[] = [];

    for (const [timeKey, slots] of slotsByTime.entries()) {
      if (slots.length > 1) {
        // Mantener el primer slot, eliminar el resto
        const [keep, ...remove] = slots;
        duplicateIds.push(...remove.map(s => s.id));

        console.log(`Horario ${timeKey}: Manteniendo ${keep.id}, eliminando ${remove.length} duplicados`);
      }
    }

    // Eliminar duplicados
    if (duplicateIds.length > 0) {
      await this.prisma.availableSlot.deleteMany({
        where: {
          id: {
            in: duplicateIds,
          },
        },
      });
    }

    return {
      totalSlotsReviewed: allSlots.length,
      duplicatesRemoved: duplicateIds.length,
      uniqueSlotsRemaining: slotsByTime.size,
      message: duplicateIds.length > 0
        ? `Se eliminaron ${duplicateIds.length} turnos duplicados. Quedan ${slotsByTime.size} turnos únicos.`
        : 'No se encontraron turnos duplicados.',
    };
  }

  /**
   * Elimina slots duplicados para TODOS los doctores
   */
  async removeDuplicateSlotsForAll() {
    const doctors = await this.prisma.doctor.findMany({
      select: { id: true, name: true },
    });

    const results = [];

    for (const doctor of doctors) {
      const result = await this.removeDuplicateSlots(doctor.id);
      results.push({
        doctorId: doctor.id,
        doctorName: doctor.name,
        ...result,
      });
    }

    const totalRemoved = results.reduce((sum, r) => sum + r.duplicatesRemoved, 0);

    return {
      doctorsProcessed: doctors.length,
      totalDuplicatesRemoved: totalRemoved,
      details: results,
    };
  }
}
