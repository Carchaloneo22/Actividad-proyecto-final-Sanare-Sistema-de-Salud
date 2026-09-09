import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle, Loader, Stethoscope } from 'lucide-react';
import { analyzeSymptoms } from '../services/geminiService';
import { TriageResult } from '../types';

const TriageChat: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError('Por favor, describe tus síntomas');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const triageResult = await analyzeSymptoms(symptoms);
      setResult(triageResult);
    } catch (err) {
      setError('Error al analizar los síntomas. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Alta':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Media':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Baja':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Triaje Inteligente con IA</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Describe tus síntomas y nuestra IA te recomendará la especialidad médica más adecuada.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe tus síntomas
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Ej: Tengo dolor de cabeza intenso, náuseas y sensibilidad a la luz..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={5}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !symptoms.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Analizar Síntomas</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Resultado del Análisis
                  </h3>
                  <p className="text-gray-600">{result.reasoning}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Especialidad Recomendada</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {result.recommendedSpecialty}
                  </p>
                </div>

                <div className={`rounded-lg p-4 border ${getUrgencyColor(result.urgency)}`}>
                  <p className="text-sm mb-1">Nivel de Urgencia</p>
                  <p className="text-lg font-semibold">{result.urgency}</p>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Próximos Pasos</p>
                <p className="text-gray-700">
                  Dirígete a la sección <strong>Reservar Turno</strong> para solicitar una cita con{' '}
                  <strong>{result.recommendedSpecialty}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Aviso:</strong> Este triaje es solo una recomendación. En caso de emergencia,
            dirígete inmediatamente al centro de salud más cercano o llama al número de
            emergencias de tu país.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TriageChat;
