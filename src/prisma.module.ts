// src/prisma.mocule.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ← これをつけると、アプリ全体で使えるようになります！
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // ← 他のモジュールでも使えるように公開する
})
export class PrismaModule {}
