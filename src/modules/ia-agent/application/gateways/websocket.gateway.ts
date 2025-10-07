import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GenerateResponseHandler } from '@/modules/ia-agent/application/use-cases/commands/handlers/generate-response.handler';
import { GenerateResponseDTO } from '@/modules/ia-agent/application/use-cases/dtos/generate-response.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ia'
 })
export class IAWebSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly generateResponseHandler: GenerateResponseHandler) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() payload: string | { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = typeof payload === 'string' ? payload : payload.message;
    console.log('📩 Mensagem recebida do front:', message);

    try {
      const dto = new GenerateResponseDTO(message);
      const response = await this.generateResponseHandler.execute(dto);

      client.emit('response', { message: response });
      console.log('📤 Resposta enviada ao front:', response);
    }catch (error) {
      console.error('❌ Erro no WebSocket:', error)
      client.emit('error', { message: 'Falha ao processar a mensagem'})
    }
  }
}