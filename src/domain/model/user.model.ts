export class UserNoPwdModel {
  id: string;
  username: string;
  image: string;
  createdDate: Date;
  updatedDate: Date;
  lastLogin: string;
  hashRefreshToken: string;
}

export class UserModel extends UserNoPwdModel {
  password: string;
}
