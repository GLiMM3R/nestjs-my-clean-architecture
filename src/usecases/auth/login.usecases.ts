import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import {
  IJwtService,
  IJwtServicePayload,
} from 'src/domain/adapters/jwt.interface';
import { JWTConfig } from 'src/domain/config/jwt-config.interface';
import { ILogger } from 'src/domain/logger/logger.interface';
import { UserRepository } from 'src/domain/repositories/userRepository.interface';

export class LoginUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  async getJwtToken(id, username: string) {
    this.logger.log('LoginUseCases execute', `The user ${username}`);
    const payload: IJwtServicePayload = { id, username };
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return token;
  }

  async getJwtRefreshToken(id: string, username: string) {
    this.logger.log(
      'LoginUseCases execute',
      `The user ${username} have been logged`,
    );
    const payload: IJwtServicePayload = { id, username };
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(id, token);
    return token;
  }

  async validateUserCredential(username: string, pwd: string) {
    const user = await this.validateUser(username);

    if (!user) return null;

    const match = await this.bcryptService.compare(pwd, user.password);

    if (user && match) {
      await this.updateLoginTime(user.id);
      return user;
    }
    return null;
  }

  async validateUser(username: string) {
    const findUser = await this.userRepository.getUserByUsername(username);

    if (!findUser) return null;
    return findUser;
  }

  async updateLoginTime(id: string) {
    await this.userRepository.updateLastLogin(id);
  }

  async setCurrentRefreshToken(id: string, refreshToken: string) {
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken,
    );
    await this.userRepository.updateRefreshToken(id, currentHashedRefreshToken);
  }
}
