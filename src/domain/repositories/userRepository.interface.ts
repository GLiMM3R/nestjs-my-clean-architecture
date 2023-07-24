import { UserModel } from '../model/user.model';

export interface UserRepository {
  getUserByUsername(username: string): Promise<UserModel>;
  createUser(createUserData: UserModel): Promise<UserModel>;
  updateLastLogin(id: string): Promise<void>;
  updateRefreshToken(id: string, refreshToken: string): Promise<void>;
}
