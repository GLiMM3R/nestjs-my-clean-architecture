import { Module } from '@nestjs/common';
import { PrismaModule } from '../config/prisma/prisma.module';
import { DatabaseTodoRepository } from './todo.repository';
import { DatabaseUserRepository } from './user.repository';

@Module({
  imports: [PrismaModule],
  providers: [DatabaseTodoRepository, DatabaseUserRepository],
  exports: [DatabaseTodoRepository, DatabaseUserRepository],
})
export class RepositoriesModule {}
