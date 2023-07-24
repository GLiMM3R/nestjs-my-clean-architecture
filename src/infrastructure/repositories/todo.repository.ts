import { Injectable } from '@nestjs/common';
import { TodoRepository } from 'src/domain/repositories/todoRepository.interface';
import { PrismaService } from '../config/prisma/prisma.service';
import { TodoModel } from 'src/domain/model/todo.model';
import { TodoEntity } from '../entities/todo.entity';
import { TodoFilter } from '../controller/todo/todo.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DatabaseTodoRepository implements TodoRepository {
  constructor(private prisma: PrismaService) {}

  async insert(todo: TodoModel): Promise<TodoModel> {
    const todoEntity = this.toTodoEntity(todo);
    const result = await this.prisma.todo.create({
      data: { ...todoEntity },
    });

    return result;
  }

  async findAll(filter: TodoFilter): Promise<TodoModel[]> {
    const { id, isdone, page, limit } = filter;

    const query: Prisma.TodoWhereInput = {};
    if (id) {
      query.id = id;
    }
    if (isdone) {
      query.isDone = JSON.parse(isdone.toString());
    }

    const skip: number = (page - 1) * limit;

    const result = await this.prisma.todo.findMany({
      where: query,
      skip: skip ? skip : 0,
      take: limit ? Number(limit) : 5,
    });

    return result;
  }

  async findById(id: string): Promise<TodoModel> {
    const result = await this.prisma.todo.findUnique({ where: { id } });

    return result;
  }

  async updateContent(id: string, isDone: boolean): Promise<void> {
    const findTodo = await this.prisma.todo.findUnique({ where: { id } });

    if (!findTodo) throw 'Not found';

    await this.prisma.todo.update({ where: { id }, data: { isDone } });
  }

  async deleteById(id: string): Promise<void> {
    const findTodo = await this.prisma.todo.findUnique({ where: { id } });

    if (!findTodo) throw 'Not found';

    await this.prisma.todo.delete({ where: { id } });
  }

  private toTodoEntity(todo: TodoModel): TodoEntity {
    const todoEntity: TodoEntity = new TodoEntity();

    todoEntity.content = todo.content;
    todoEntity.isDone = todo.isDone;
    todoEntity.createdDate = todo.createdDate;
    todoEntity.updatedDate = todo.updatedDate;

    return todoEntity;
  }
}
