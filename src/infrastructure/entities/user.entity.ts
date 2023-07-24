import { IsString, IsDate } from 'class-validator';

export class UserEntity {
  @IsString()
  id: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  image: string;
  @IsDate()
  createdDate: Date;
  @IsDate()
  updatedDate: Date;
  @IsString()
  lastLogin: string;
  @IsString()
  hashRefreshToken: string;
}
