import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @Post(':id/tags/:tagId')
  addTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    // +を付けるとnumberに変換できるらしい(urlのパラメータは文字列)
    return this.taskService.addTag(+id, +tagId);
  }

  @Put(':id/tags')
  updateTags(
    @Param('id') id: string,
    @Body('tagIds') tagIds: number[],
  ) {
    return this.taskService.updateTags(+id, tagIds);
  }

  @Delete(':id/tags/:tagId')
  removeTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.taskService.removeTag(+id, +tagId);
  }
}
