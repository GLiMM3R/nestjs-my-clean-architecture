import { TodoModel } from 'src/domain/model/todo.model';
import { TodoRepository } from 'src/domain/repositories/todoRepository.interface';

export class AddTodoUsecases {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(content: string): Promise<TodoModel> {
    const todo = new TodoModel();
    todo.content = content;
    const result = await this.todoRepository.insert(todo);
    return result;
  }
}
