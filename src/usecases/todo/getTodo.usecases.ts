import { TodoModel } from 'src/domain/model/todo.model';
import { TodoRepository } from 'src/domain/repositories/todoRepository.interface';

export class GetTodoUseCases {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<TodoModel> {
    return await this.todoRepository.findById(id);
  }
}
