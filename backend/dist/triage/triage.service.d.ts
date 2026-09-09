import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { TriageResponseDto } from './dto/triage.dto';
export declare class TriageService {
    private readonly configService;
    private readonly prisma;
    private readonly logger;
    private aiClient;
    private readonly disclaimerText;
    constructor(configService: ConfigService, prisma: PrismaService);
    analyze(symptoms: string): Promise<TriageResponseDto>;
    private analyzeByClinicalSkills;
}
