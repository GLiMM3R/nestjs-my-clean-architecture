import { Module, DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { RepositoriesModule } from '../repositories/repositories.module';
import { DatabaseTodoRepository } from '../repositories/todo.repository';
import { UseCaseProxy } from './usecases-proxy';
import { GetTodoUseCases } from 'src/usecases/todo/getTodo.usecases';
import { GetTodosUsecases } from 'src/usecases/todo/getTodos.usecases';
import { AddTodoUsecases } from 'src/usecases/todo/addTodo.usecases';
import { LoggerService } from '../logger/logger.service';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { DatabaseUserRepository } from '../repositories/user.repository';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LoggerModule } from '../logger/logger.module';
import { JwtTokenModule } from '../services/jwt/jwt.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { SignUpUsecases } from 'src/usecases/auth/signup.usecases';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RepositoriesModule,
    LoggerModule,
    JwtTokenModule,
    BcryptModule,
    EnvironmentConfigModule,
    ExceptionsModule,
  ],
})
export class UsecasesProxyModule {
  //NOTE - Auth
  static LOGIN_USECASES_PROXY = 'loginUsecasesProxy';
  static SIGNUP_USECASES_PROXY = 'signupUsecasesProxy';

  //NOTE - Todo
  static GET_TODO_USECASES_PROXY = 'getTodoUsecasesProxy';
  static GET_TODOS_USECASES_PROXY = 'getTodosUsecasesProxy';
  static ADD_TODO_USECASES_PROXY = 'addTodoUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            DatabaseUserRepository,
            BcryptService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                logger,
                jwtTokenService,
                config,
                userRepo,
                bcryptService,
              ),
            ),
        },
        {
          inject: [DatabaseUserRepository, BcryptService],
          provide: UsecasesProxyModule.SIGNUP_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
          ) => new UseCaseProxy(new SignUpUsecases(userRepo, bcryptService)),
        },
        {
          inject: [DatabaseTodoRepository],
          provide: UsecasesProxyModule.GET_TODO_USECASES_PROXY,
          useFactory: (todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new GetTodoUseCases(todoRepository)),
        },
        {
          inject: [DatabaseTodoRepository],
          provide: UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
          useFactory: (todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new GetTodosUsecases(todoRepository)),
        },
        {
          inject: [DatabaseTodoRepository],
          provide: UsecasesProxyModule.ADD_TODO_USECASES_PROXY,
          useFactory: (todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new AddTodoUsecases(todoRepository)),
        },
      ],
      exports: [
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.SIGNUP_USECASES_PROXY,
        UsecasesProxyModule.GET_TODO_USECASES_PROXY,
        UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
        UsecasesProxyModule.ADD_TODO_USECASES_PROXY,
      ],
    };
  }
}
