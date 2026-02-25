import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from "@prisma/client";

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    try {
      return await this.prisma.tag.create({
        data: createTagDto,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictException("そのタグは既に存在します");
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.tag.findMany({
      orderBy: { id: "asc" },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
