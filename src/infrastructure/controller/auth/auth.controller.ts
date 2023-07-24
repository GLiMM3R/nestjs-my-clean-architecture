import {
  Controller,
  Inject,
  Post,
  Get,
  Body,
  Param,
  Res,
  Request,
  ConflictException,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { Response } from 'express';
import { IsAuthPresenter } from './auth.presenter';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { AuthLoginDto, AuthSignInDto } from './auth.dto';
import { SignUpUsecases } from 'src/usecases/auth/signup.usecases';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecasesProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.SIGNUP_USECASES_PROXY)
    private readonly signupUsecasesProxy: UseCaseProxy<SignUpUsecases>,
  ) {}

  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Request() request: any) {
    const user = await this.loginUsecasesProxy
      .getInstance()
      .validateUserCredential(auth.username, auth.password);

    if (!user)
      throw new UnauthorizedException({
        message: 'User not found',
        error_code: 401,
      });

    const accessToken = await this.loginUsecasesProxy
      .getInstance()
      .getJwtToken(user.id, user.username);

    const refreshToken = await this.loginUsecasesProxy
      .getInstance()
      .getJwtRefreshToken(user.id, user.username);
    return { accessToken, refreshToken };
  }

  @Post('signup')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data', 'application/json')
  // @ApiBody({ type: AuthSignInDto })
  @ApiOperation({ description: 'Signup' })
  async signin(
    @Body() auth: AuthSignInDto,
    @Request() request: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const existUser = await this.loginUsecasesProxy
      .getInstance()
      .validateUser(auth.username);
    if (existUser)
      throw new UnauthorizedException('This username already exist');

    const user = await this.signupUsecasesProxy
      .getInstance()
      .execute(auth.username, auth.password, file);
    const accessToken = await this.loginUsecasesProxy
      .getInstance()
      .getJwtToken(user.id, user.username);
    const refreshToken = await this.loginUsecasesProxy
      .getInstance()
      .getJwtRefreshToken(user.id, user.username);
    return { accessToken, refreshToken };
  }

  @Get(':folder/:file')
  async getImage(
    @Param('folder') folder: string,
    @Param('file') file: string,
    @Res() res: Response,
  ) {
    res.sendFile(`D:/${folder}/${file}`);
  }
}
