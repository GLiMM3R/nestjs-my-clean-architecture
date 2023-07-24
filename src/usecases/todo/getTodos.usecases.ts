import { TodoModel } from 'src/domain/model/todo.model';
import { TodoRepository } from 'src/domain/repositories/todoRepository.interface';
import { TodoFilter } from 'src/infrastructure/controller/todo/todo.dto';

export class GetTodosUsecases {
  constructor(private todoRepository: TodoRepository) {}
  async execute(filter?: TodoFilter): Promise<TodoModel[]> {
    const result = await this.todoRepository.findAll(filter);
    return result;
  }
}
