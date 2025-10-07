import { Module } from '@nestjs/common';
import { IAWebSocketGateway } from '@/modules/ia-agent/application/gateways/websocket.gateway';
import { IAService } from '@/modules/ia-agent/domain/services/ia.service';
import { GeminiService } from '@/modules/ia-agent/infra/ai/gemini.service';
import { GenerateResponseHandler } from '@/modules/ia-agent/application/use-cases/commands/handlers/generate-response.handler';
import { IAIRepositoryToken } from '@/modules/ia-agent/domain/repositories/ia.tokens';

@Module({
  providers: [
    IAWebSocketGateway,
    IAService,
    GeminiService,
    GenerateResponseHandler,
    {
      provide: IAIRepositoryToken,
      useExisting: GeminiService,
    },
  ],
  exports: [IAService],
})
export class IAAgentModule {}
