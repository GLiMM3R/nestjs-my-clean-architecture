import { IsString, IsBoolean, IsDate } from 'class-validator';

export class TodoEntity {
  @IsString()
  content: string;
  @IsBoolean()
  isDone: boolean;
  @IsDate()
  createdDate: Date;
  @IsDate()
  updatedDate: Date;
}
