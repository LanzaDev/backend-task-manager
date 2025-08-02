import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { env } from './config/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Task-Manager')
    .setDescription('Documentação')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(env.APP_PORT);

  if (env.APP_ENV === 'dev') {
    console.log('------------------------------------');
    console.log(`API rodando na porta ${env.APP_PORT}.`);
    console.log(`API: ${env.APP_URL}`);
    console.log(`Docs: ${process.env.APP_URL}/docs`);
    console.log('------------------------------------');
  }
}

void bootstrap();
