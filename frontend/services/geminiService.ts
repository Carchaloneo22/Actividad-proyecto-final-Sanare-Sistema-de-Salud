import { GoogleGenAI, Type } from "@google/genai";
import { Specialty, TriageResult } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Safe initialization of the client inside functions to avoid initialization errors if key is missing during load
const getAiClient = () => {
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSymptoms = async (symptoms: string): Promise<TriageResult> => {
  const ai = getAiClient();
  if (!ai) {
    // Fallback mock response if no API key
    return {
      recommendedSpecialty: Specialty.GENERAL,
      urgency: 'Baja',
      reasoning: 'Modo de demostración: API Key no configurada. Se recomienda médico general.'
    };
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Analiza los siguientes síntomas de un paciente y recomienda la especialidad médica más adecuada del sistema de salud público argentino/chileno.
    Síntomas: "${symptoms}"
    
    Las especialidades disponibles son: ${Object.values(Specialty).join(', ')}.
    
    Responde en formato JSON.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSpecialty: {
              type: Type.STRING,
              enum: Object.values(Specialty),
              description: "La especialidad médica recomendada."
            },
            urgency: {
              type: Type.STRING,
              enum: ['Baja', 'Media', 'Alta'],
              description: "Nivel de urgencia estimado."
            },
            reasoning: {
              type: Type.STRING,
              description: "Breve explicación de por qué se eligió esa especialidad (máximo 20 palabras)."
            }
          },
          required: ['recommendedSpecialty', 'urgency', 'reasoning']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    const parsed = JSON.parse(resultText) as TriageResult;
    return parsed;

  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    return {
      recommendedSpecialty: Specialty.GENERAL,
      urgency: 'Media',
      reasoning: 'Hubo un error analizando los síntomas. Por favor consulte con un médico general.'
    };
  }
};