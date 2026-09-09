import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SpecialtiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.specialty.findMany({
      include: {
        _count: {
          select: { doctors: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.specialty.findUnique({
      where: { id },
      include: {
        doctors: {
          include: {
            availableSlots: {
              where: {
                isBooked: false,
                startTime: { gte: new Date() },
              },
            },
          },
        },
      },
    });
  }

  async create(data: { name: string; description?: string }) {
    return this.prisma.specialty.create({ data });
  }
}
