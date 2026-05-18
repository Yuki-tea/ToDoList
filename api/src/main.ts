import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'secrets', 'localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'secrets', 'localhost.crt')),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on port: ${process.env.PORT}`);
}
bootstrap();
