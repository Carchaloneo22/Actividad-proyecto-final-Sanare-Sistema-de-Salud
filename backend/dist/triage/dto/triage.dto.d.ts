export declare class AnalyzeSymptomsDto {
    symptoms: string;
}
export declare class TriageResponseDto {
    recommendedSpecialty: string;
    urgency: 'Baja' | 'Media' | 'Alta';
    reasoning: string;
    disclaimer: string;
}
