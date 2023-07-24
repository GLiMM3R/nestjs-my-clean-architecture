import { ApiProperty } from '@nestjs/swagger';
import { TodoModel } from 'src/domain/model/todo.model';

export class TodoPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  createdDate: Date;

  //   @ApiProperty()
  //   updatedDate: Date;

  constructor(todo: TodoModel) {
    this.id = todo.id;
    this.content = todo.content;
    this.isDone = todo.isDone;
    this.createdDate = todo.createdDate;
    // this.updatedDate = todo.updatedDate;
  }
}
