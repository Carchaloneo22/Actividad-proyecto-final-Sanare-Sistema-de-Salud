import { UserEntity } from '../entities/user.entity';

export interface AuthResponse {
  user: UserEntity;
  accessToken: string;
}
