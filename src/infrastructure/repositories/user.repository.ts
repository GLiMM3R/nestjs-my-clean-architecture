import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/userRepository.interface';
import { PrismaService } from '../config/prisma/prisma.service';
import { UserModel } from 'src/domain/model/user.model';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class DatabaseUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserData: UserModel): Promise<UserModel> {
    const user = await this.prisma.user.create({
      data: createUserData,
    });
    return user;
  }

  async getUserByUsername(username: string): Promise<UserModel> {
    const adminUserEntity = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!adminUserEntity) return null;
    return this.toUser(adminUserEntity);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: { lastLogin: Date.now().toString() },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { hashRefreshToken: refreshToken },
    });
  }

  private toUser(adminUserEntity: UserEntity): UserModel {
    const adminUser: UserModel = new UserModel();

    adminUser.id = adminUserEntity.id;
    adminUser.username = adminUserEntity.username;
    adminUser.password = adminUserEntity.password;
    adminUser.image = adminUserEntity.image;
    adminUser.createdDate = adminUserEntity.createdDate;
    adminUser.updatedDate = adminUserEntity.updatedDate;
    adminUser.lastLogin = adminUserEntity.lastLogin;
    adminUser.hashRefreshToken = adminUserEntity.hashRefreshToken;

    return adminUser;
  }

  private toUserEntity(adminUser: UserModel): UserEntity {
    const adminUserEntity: UserEntity = new UserEntity();

    adminUserEntity.username = adminUser.username;
    adminUserEntity.hashRefreshToken = adminUser.hashRefreshToken;
    adminUserEntity.lastLogin = adminUser.lastLogin;

    return adminUserEntity;
  }
}
