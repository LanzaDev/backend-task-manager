import { IAService } from "@/modules/ia-agent/domain/services/ia.service";
import { Injectable } from "@nestjs/common";
import { GenerateResponseDTO } from "@/modules/ia-agent/application/use-cases/dtos/generate-response.dto";

@Injectable()
export class GenerateResponseHandler {
  constructor(private readonly iaService: IAService) {}

  async execute(data: GenerateResponseDTO) {
    return await this.iaService.generateResponse(data.message)
  }
}