import {
  Controller,
  Inject,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiExtraModels,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TodoPresenter } from './todo.presenter';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { GetTodoUseCases } from 'src/usecases/todo/getTodo.usecases';
import { GetTodosUsecases } from 'src/usecases/todo/getTodos.usecases';
import { AddTodoDto, TodoFilter } from './todo.dto';
import { AddTodoUsecases } from 'src/usecases/todo/addTodo.usecases';
import { JwtAuth } from 'src/infrastructure/guard/jwtAuth.guard';

@Controller('todo')
@ApiTags('todo')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(TodoPresenter)
export class TodoController {
  constructor(
    @Inject(UsecasesProxyModule.GET_TODO_USECASES_PROXY)
    private readonly getTodoUsecaseProxy: UseCaseProxy<GetTodoUseCases>,
    @Inject(UsecasesProxyModule.GET_TODOS_USECASES_PROXY)
    private readonly getTodosUsecaseProxy: UseCaseProxy<GetTodosUsecases>,
    @Inject(UsecasesProxyModule.ADD_TODO_USECASES_PROXY)
    private readonly addTodoUsecaseProxy: UseCaseProxy<AddTodoUsecases>,
  ) {}

  @Get()
  async getTodo(@Query('id') id: string) {
    const todo = await this.getTodoUsecaseProxy.getInstance().execute(id);
    return new TodoPresenter(todo);
  }

  @UseGuards(JwtAuth)
  @Get('todos')
  async getTodos(@Query() filter?: TodoFilter) {
    const todos = await this.getTodosUsecaseProxy.getInstance().execute(filter);
    return todos.map((todo) => new TodoPresenter(todo));
  }

  @Post()
  async addTodo(@Body() addTodoData: AddTodoDto) {
    const { content } = addTodoData;
    const todo = await this.addTodoUsecaseProxy.getInstance().execute(content);
    return new TodoPresenter(todo);
  }
}
