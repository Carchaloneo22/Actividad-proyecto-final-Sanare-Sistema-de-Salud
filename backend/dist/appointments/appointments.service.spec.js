"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const appointments_service_1 = require("./appointments.service");
const prisma_service_1 = require("../common/prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
describe('AppointmentsService', () => {
    let service;
    let prismaService;
    let mailService;
    let queueMock;
    const mockDoctor = {
        id: 'doctor-uuid-1',
        name: 'Dr. Alejandro Morales',
        email: 'doctor@sanare.gob.ar',
        userId: 'doctor-user-uuid',
        specialtyId: 'spec-1',
        specialty: { name: 'Cardiología' },
    };
    const mockSlot = {
        id: 'slot-uuid-1',
        doctorId: 'doctor-uuid-1',
        startTime: new Date('2026-10-15T10:00:00Z'),
        endTime: new Date('2026-10-15T10:30:00Z'),
        durationMinutes: 30,
        isBooked: false,
    };
    const mockAppointment = {
        id: 'apt-uuid-1',
        userId: 'patient-user-uuid-1',
        doctorId: 'doctor-uuid-1',
        date: new Date('2026-10-15T10:00:00Z'),
        status: 'CONFIRMED',
        patientName: 'María López',
        patientEmail: 'maria@sanare.gob.ar',
        patientPhone: '11223344',
        doctor: mockDoctor,
        cancellationToken: 'secure-crypto-token-123',
    };
    const createUserEntity = (id, role) => ({
        id,
        email: `${id}@sanare.gob.ar`,
        firstName: 'Test',
        lastName: 'User',
        role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    beforeEach(async () => {
        prismaService = {
            $transaction: jest.fn(),
            doctor: {
                findUnique: jest.fn(),
            },
            availableSlot: {
                findUnique: jest.fn(),
                updateMany: jest.fn(),
            },
            appointment: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
            waitingList: {
                findFirst: jest.fn(),
            },
        };
        mailService = {
            sendAppointmentConfirmation: jest.fn().mockResolvedValue(undefined),
            sendAppointmentCancellation: jest.fn().mockResolvedValue(undefined),
        };
        queueMock = {
            add: jest.fn().mockResolvedValue(undefined),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                appointments_service_1.AppointmentsService,
                { provide: prisma_service_1.PrismaService, useValue: prismaService },
                { provide: mail_service_1.MailService, useValue: mailService },
                { provide: (0, bull_1.getQueueToken)('notifications'), useValue: queueMock },
            ],
        }).compile();
        service = module.get(appointments_service_1.AppointmentsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create (Atomic Slot Booking)', () => {
        it('should throw BadRequestException if available slot is not found for the requested date', async () => {
            prismaService.$transaction.mockImplementation(async (callback) => {
                const txMock = {
                    availableSlot: {
                        findFirst: jest.fn().mockResolvedValue(null),
                    },
                };
                return callback(txMock);
            });
            await expect(service.create({
                doctorId: mockDoctor.id,
                userId: 'patient-user-uuid-1',
                date: new Date('2026-10-15T10:00:00Z'),
                patientName: 'María López',
                patientPhone: '11223344',
            })).rejects.toThrow(common_1.BadRequestException);
        });
        it('should throw BadRequestException if slot is taken concurrently (count === 0)', async () => {
            prismaService.$transaction.mockImplementation(async (callback) => {
                const txMock = {
                    availableSlot: {
                        findFirst: jest.fn().mockResolvedValue({ ...mockSlot, isBooked: false }),
                        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
                    },
                    appointment: {
                        create: jest.fn(),
                    },
                };
                return callback(txMock);
            });
            await expect(service.create({
                doctorId: mockDoctor.id,
                userId: 'patient-user-uuid-1',
                date: new Date('2026-10-15T10:00:00Z'),
                patientName: 'María López',
                patientPhone: '11223344',
            })).rejects.toThrow(common_1.BadRequestException);
        });
        it('should successfully book slot atomically when count === 1', async () => {
            prismaService.$transaction.mockImplementation(async (callback) => {
                const txMock = {
                    availableSlot: {
                        findFirst: jest.fn().mockResolvedValue({ ...mockSlot, isBooked: false }),
                        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
                    },
                    appointment: {
                        create: jest.fn().mockResolvedValue(mockAppointment),
                    },
                };
                return callback(txMock);
            });
            const result = await service.create({
                doctorId: mockDoctor.id,
                userId: 'patient-user-uuid-1',
                date: new Date('2026-10-15T10:00:00Z'),
                patientName: 'María López',
                patientPhone: '11223344',
            });
            expect(result).toBeDefined();
            expect(result.id).toBe(mockAppointment.id);
            expect(queueMock.add).toHaveBeenCalled();
        });
    });
    describe('IDOR Prevention (findOneSecure & cancelSecure)', () => {
        it('should allow patient to view their own appointment', async () => {
            prismaService.appointment.findUnique.mockResolvedValue(mockAppointment);
            const patientUser = createUserEntity('patient-user-uuid-1', client_1.UserRole.PATIENT);
            const apt = await service.findOneSecure('apt-uuid-1', patientUser);
            expect(apt).toBeDefined();
            expect(apt.id).toBe('apt-uuid-1');
        });
        it('should throw ForbiddenException if patient attempts to access another patients appointment', async () => {
            prismaService.appointment.findUnique.mockResolvedValue(mockAppointment);
            const anotherPatient = createUserEntity('different-patient-uuid-99', client_1.UserRole.PATIENT);
            await expect(service.findOneSecure('apt-uuid-1', anotherPatient)).rejects.toThrow(common_1.ForbiddenException);
        });
        it('should allow admin to access any appointment', async () => {
            prismaService.appointment.findUnique.mockResolvedValue(mockAppointment);
            const adminUser = createUserEntity('admin-uuid', client_1.UserRole.ADMIN);
            const apt = await service.findOneSecure('apt-uuid-1', adminUser);
            expect(apt).toBeDefined();
            expect(apt.id).toBe('apt-uuid-1');
        });
        it('should throw ForbiddenException if patient attempts to cancel another patients appointment', async () => {
            prismaService.appointment.findUnique.mockResolvedValue(mockAppointment);
            const attackerUser = createUserEntity('attacker-uuid', client_1.UserRole.PATIENT);
            await expect(service.cancelSecure('apt-uuid-1', attackerUser)).rejects.toThrow(common_1.ForbiddenException);
        });
    });
});
//# sourceMappingURL=appointments.service.spec.js.map