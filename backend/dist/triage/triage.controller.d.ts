import { TriageService } from './triage.service';
import { AnalyzeSymptomsDto, TriageResponseDto } from './dto/triage.dto';
export declare class TriageController {
    private readonly triageService;
    constructor(triageService: TriageService);
    analyzeSymptoms(dto: AnalyzeSymptomsDto): Promise<TriageResponseDto>;
}
