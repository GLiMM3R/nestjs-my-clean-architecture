import { TodoFilter } from 'src/infrastructure/controller/todo/todo.dto';
import { TodoModel } from '../model/todo.model';

export interface TodoRepository {
  insert(todo: TodoModel): Promise<TodoModel>;
  findAll(filter?: TodoFilter): Promise<TodoModel[]>;
  findById(id: string): Promise<TodoModel>;
  updateContent(id: string, isDone: boolean): Promise<void>;
  deleteById(id: string): Promise<void>;
}
