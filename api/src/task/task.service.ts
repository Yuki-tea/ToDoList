// src/task/task.service.ts
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';
import { Task } from '@prisma/client'; // 型定義

@Injectable()
export class TaskService {
  // コンストラクタでPrismaServiceを注入（Dependency Injection）
  constructor(private prisma: PrismaService) {}

  // 全件取得
  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  // IDで1件取得
  findOne(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  // 作成
  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  // 更新
  update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  // 削除
  remove(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
