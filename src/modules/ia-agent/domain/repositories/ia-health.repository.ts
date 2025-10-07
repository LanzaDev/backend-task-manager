import { Injectable } from "@nestjs/common";

export abstract class IAHealthRepository {
  abstract checkConnection(): Promise<boolean>;
}

@Injectable()
export class IAHealthProvider implements IAHealthRepository {
  constructor(private readonly iaService: any) {}

  async checkConnection(): Promise<boolean> {
      try {
        const test = await this.iaService.generateResponse('ping');
        return !!test;
      }catch (error) {
        console.error('Erro ao verificar a saude da IA:', error)
        return false
      }
  }
}