"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TriageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
const prisma_service_1 = require("../common/prisma/prisma.service");
let TriageService = TriageService_1 = class TriageService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(TriageService_1.name);
        this.aiClient = null;
        this.disclaimerText = 'Aviso de Salud Pública: Este sistema de triaje asistido por Inteligencia Artificial tiene fines meramente orientativos para la asignación de turnos y NO constituye un diagnóstico médico profesional ni reemplaza la consulta con un médico matriculado. Si presenta síntomas graves, dificultad respiratoria, dolor torácico o pérdida de conciencia, acuda de inmediato a la guardia hospitalaria más cercana o comuníquese con el servicio de emergencias médicas.';
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (apiKey) {
            try {
                this.aiClient = new genai_1.GoogleGenAI({ apiKey });
                this.logger.log('✅ Cliente Gemini inicializado en el backend');
            }
            catch (err) {
                this.logger.warn(`No se pudo inicializar Gemini: ${err.message}`);
            }
        }
        else {
            this.logger.warn('⚠️ GEMINI_API_KEY no configurada. El triaje funcionará en modo de orientación asistida por defecto.');
        }
    }
    async analyze(symptoms) {
        const specialties = await this.prisma.specialty.findMany({
            select: { name: true, description: true },
        });
        const specialtyNames = specialties.map((s) => s.name);
        const ageMatch = symptoms.match(/(?:tengo|edad(?:\s+de)?|paciente\s+de)\s+(\d{1,2})\s+años?/i);
        const patientAge = ageMatch ? parseInt(ageMatch[1], 10) : null;
        const isAdult = patientAge !== null && patientAge >= 16;
        if (this.aiClient) {
            try {
                const specialtiesContext = specialties
                    .map((s) => `- ${s.name}: ${s.description || 'Atención médica especializada'}`)
                    .join('\n');
                const prompt = `Eres un asistente de triaje médico para una red de salud pública hospitalaria.
Tu función es orientar al paciente hacia la especialidad más adecuada según sus síntomas, edad y motivo de consulta.

Especialidades médicas disponibles en el hospital y sus competencias:
${specialtiesContext}

Reglas clínicas esenciales:
1. PEDIATRÍA es EXCLUSIVAMENTE para niños y adolescentes (menores de 16 años). NUNCA asignes Pediatría a adultos.
2. CARDIOLOGÍA es para dolor u opresión en el pecho, palpitaciones, arritmias, falta de aire con dolor torácico.
3. TRAUMATOLOGÍA es para golpes, caídas, dolores articulares, fracturas, esguinces o problemas en huesos y músculos.
4. DERMATOLOGÍA es para erupciones cutáneas, manchas, acné, picazón, sarpullidos o alteraciones de la piel.
5. NEUROLOGÍA es para migrañas, convulsiones, mareos con vértigo, pérdida de fuerza o alteraciones neurológicas.
6. MEDICINA GENERAL es para adultos con síntomas gripales, fiebre, tos, malestar general, dolor de garganta o cuando no hay un especialista puntual requerido.

Síntomas descritos por el paciente:
"${symptoms}"

Responde estrictamente en formato JSON:
- recommendedSpecialty: El nombre EXACTO de una de las especialidades disponibles (${specialtyNames.join(', ')}).
- urgency: 'Baja', 'Media' o 'Alta'.
- reasoning: Explicación médica clara y concisa de por qué se recomienda esa especialidad (máximo 35 palabras).`;
                const response = await this.aiClient.models.generateContent({
                    model: 'gemini-3.6-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: genai_1.Type.OBJECT,
                            properties: {
                                recommendedSpecialty: {
                                    type: genai_1.Type.STRING,
                                    description: 'Especialidad médica sugerida',
                                },
                                urgency: {
                                    type: genai_1.Type.STRING,
                                    enum: ['Baja', 'Media', 'Alta'],
                                    description: 'Nivel estimado de urgencia',
                                },
                                reasoning: {
                                    type: genai_1.Type.STRING,
                                    description: 'Breve fundamentación médica',
                                },
                            },
                            required: ['recommendedSpecialty', 'urgency', 'reasoning'],
                        },
                    },
                });
                const text = response.text;
                if (text) {
                    const parsed = JSON.parse(text);
                    let recommended = parsed.recommendedSpecialty;
                    if (isAdult && recommended?.toLowerCase().includes('pediatr')) {
                        recommended =
                            specialtyNames.find((s) => s.toLowerCase().includes('general') || s.toLowerCase().includes('clínica')) ||
                                'Medicina General';
                    }
                    if (specialtyNames.includes(recommended)) {
                        return {
                            recommendedSpecialty: recommended,
                            urgency: ['Baja', 'Media', 'Alta'].includes(parsed.urgency) ? parsed.urgency : 'Media',
                            reasoning: parsed.reasoning || 'Evaluación clínica recomendada según los síntomas indicados.',
                            disclaimer: this.disclaimerText,
                        };
                    }
                }
            }
            catch (error) {
                this.logger.warn(`Gemini no disponible (${error.message}). Aplicando motor clínico de competencias...`);
            }
        }
        const fallbackResult = this.analyzeByClinicalSkills(symptoms, specialtyNames, patientAge);
        return {
            ...fallbackResult,
            disclaimer: this.disclaimerText,
        };
    }
    analyzeByClinicalSkills(text, availableSpecialties, patientAge) {
        const lower = text.toLowerCase();
        const findSpec = (nameFragment) => availableSpecialties.find((s) => s.toLowerCase().includes(nameFragment.toLowerCase()));
        const isChild = (patientAge !== null && patientAge < 16) ||
            /\b(mi hijo|mi hija|bebé|bebe|lactante|nene|nena|chiquito|chiquita|pediatra)\b/i.test(lower);
        const isAdult = patientAge !== null && patientAge >= 16;
        if (/\b(pecho|opresi[oó]n|coraz[oó]n|palpitaci|cardiac|brazo izquierdo|infarto|taquicardia|presi[oó]n alta)\b/i.test(lower)) {
            const spec = findSpec('Cardiolog') || findSpec('General') || 'Medicina General';
            return {
                recommendedSpecialty: spec,
                urgency: 'Alta',
                reasoning: 'Los síntomas torácicos u opresivos sugieren compromiso cardiovascular. Se recomienda consulta inmediata con Cardiología para valoración electrocardiográfica.',
            };
        }
        if (/\b(fractura|esguince|hueso|rodilla|tobillo|muñeca|golpe|ca[ií]da|torcedura|articulaci[oó]n|espalda|columna|lumbar|ligamento)\b/i.test(lower)) {
            const spec = findSpec('Traumatolog') || findSpec('General') || 'Medicina General';
            const isAcute = /\b(no puedo pisar|hinchad|deforme|inmovil|fuerte dolor)\b/i.test(lower);
            return {
                recommendedSpecialty: spec,
                urgency: isAcute ? 'Alta' : 'Media',
                reasoning: 'El motivo de consulta indica posible lesión musculoesquelética o traumatismo articular. Traumatología es el servicio idóneo para radiografías y tratamiento.',
            };
        }
        if (/\b(piel|mancha|erupci[oó]n|sarpullido|picaz[oó]n|grano|acn[eé]|eccema|lunar|roncha|dermatitis)\b/i.test(lower)) {
            const spec = findSpec('Dermatolog') || findSpec('General') || 'Medicina General';
            return {
                recommendedSpecialty: spec,
                urgency: 'Media',
                reasoning: 'Las alteraciones cutáneas y lesiones en piel corresponden al campo de la Dermatología para diagnóstico dermatoscópico y tratamiento local.',
            };
        }
        if (/\b(migraña|cefalea|convulsi[oó]n|mareo|v[eé]rtigo|desmayo|adormecimiento|p[eé]rdida de fuerza|nervio|neurol)\b/i.test(lower)) {
            const spec = findSpec('Neurolog') || findSpec('General') || 'Medicina General';
            return {
                recommendedSpecialty: spec,
                urgency: 'Media',
                reasoning: 'Los síntomas neurológicos o cefaleas recurrentes requieren examen del sistema nervioso. Se aconseja consulta médica para evaluación especializada.',
            };
        }
        if (isChild && !isAdult) {
            const spec = findSpec('Pediatr') || findSpec('General') || 'Medicina General';
            const isUrgent = /\b(fiebre alta|39|no respira|dificultad|convuls|morad|apagad)\b/i.test(lower);
            return {
                recommendedSpecialty: spec,
                urgency: isUrgent ? 'Alta' : 'Media',
                reasoning: 'Por tratarse de un paciente en edad pediátrica, corresponde la valoración integral por un especialista en Pediatría.',
            };
        }
        const generalSpec = findSpec('General') || findSpec('Clínica') || availableSpecialties[0] || 'Medicina General';
        const isRespiratory = /\b(fiebre|tos|garganta|congesti[oó]n|respirar|dificultad|gripe|cansancio|fatiga)\b/i.test(lower);
        return {
            recommendedSpecialty: generalSpec,
            urgency: isRespiratory && /\b(respirar|dificultad|pecho|esfuerzo)\b/i.test(lower) ? 'Alta' : 'Media',
            reasoning: isAdult
                ? 'Paciente adulto con sintomatología respiratoria/infecciosa. Medicina General es el servicio indicado para evaluación clínica y control evolutivo.'
                : 'Se recomienda consulta con Medicina General para evaluación clínica integral y oportuna derivación.',
        };
    }
};
exports.TriageService = TriageService;
exports.TriageService = TriageService = TriageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], TriageService);
//# sourceMappingURL=triage.service.js.map