import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    return data ? user[data] : user;
  },
);
