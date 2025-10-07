import { Injectable } from "@nestjs/common";
import { IAIRepository } from "@/modules/ia-agent/domain/repositories/ia.repository";
import { geminiClient } from "@/modules/ia-agent/infra/ai/gemini.config";

@Injectable()
export class GeminiService implements IAIRepository {
  async generateCompletion(prompt: string): Promise<string> {
      try {
        const result = await geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = result.text || 'Desculpe, não entendi';
        return text.replace(/\*/g, '').trim()
      }catch(error: any) {
        console.error('Erro Gemini', error.message || error);
        return 'Houve um erro ao gerar resposta.';
      }
  }
}