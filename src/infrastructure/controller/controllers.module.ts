import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { TodoController } from './todo/todo.controller';
import { JwtTokenModule } from '../services/jwt/jwt.module';
import { AuthController } from './auth/auth.controller';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { JwtAuthModule } from '../guard/jwtAuth.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UsecasesProxyModule.register(),
    MulterModule.register(),
    JwtTokenModule,
    EnvironmentConfigModule,
    JwtAuthModule,
  ],
  controllers: [TodoController, AuthController],
})
export class ControllersModule {}
