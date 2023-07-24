import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import { UserModel } from 'src/domain/model/user.model';
import { UserRepository } from 'src/domain/repositories/userRepository.interface';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

export class SignUpUsecases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}
  async execute(
    username: string,
    password: string,
    file?: Express.Multer.File,
  ): Promise<UserModel> {
    const userModel = new UserModel();
    userModel.username = username;
    userModel.password = await this.bcryptService.hash(password);
    userModel.image = await this.uploadImageProfile(file);

    const user = await this.userRepository.createUser(userModel);

    return user;
  }

  async uploadImageProfile(file: Express.Multer.File) {
    try {
      const networkInterfaces = os.networkInterfaces();
      let ipAddress = '';

      Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName].forEach((networkInterface) => {
          if (
            networkInterface.family === 'IPv4' &&
            !networkInterface.internal
          ) {
            ipAddress = networkInterface.address;
          }
        });
      });

      console.log(ipAddress);

      const fileName = Date.now().toString() + '_' + file.originalname;
      const folderPath = path.join('D:', 'uploads');
      const filePath = path.join('D:', 'uploads', fileName);
      const urlPath = path.join(ipAddress + ':3000/auth', 'uploads', fileName);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // const writeStream = await fs.createWriteStream(filePath);
      // createReadStream(folderPath).pipe(writeStream);
      await fs.writeFile(filePath, file.buffer);
      return urlPath;
    } catch (error) {
      console.log(error);
    }
  }
}
