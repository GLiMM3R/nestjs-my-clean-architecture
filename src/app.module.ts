import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { PrismaModule } from './infrastructure/config/prisma/prisma.module';
import { TodoController } from './infrastructure/controller/todo/todo.controller';
import { AuthController } from './infrastructure/controller/auth/auth.controller';
import { RepositoriesModule } from './infrastructure/repositories/repositories.module';
import { UsecasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module';
import { ControllersModule } from './infrastructure/controller/controllers.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { JwtTokenModule } from './infrastructure/services/jwt/jwt.module';
import { JwtAuthModule } from './infrastructure/guard/jwtAuth.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    PrismaModule,
    RepositoriesModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    ExceptionsModule,
    LoggerModule,
    BcryptModule,
    JwtTokenModule,
    JwtAuthModule,
  ],
  controllers: [TodoController, AuthController],
  providers: [],
})
export class AppModule {}
