import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuth } from './jwtAuth.guard';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [JwtAuth],
  exports: [JwtAuth],
})
export class JwtAuthModule {}
