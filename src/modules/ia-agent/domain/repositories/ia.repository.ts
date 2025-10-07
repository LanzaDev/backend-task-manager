export interface IAIRepository {
  generateCompletion(prompt: string): Promise<string>
}