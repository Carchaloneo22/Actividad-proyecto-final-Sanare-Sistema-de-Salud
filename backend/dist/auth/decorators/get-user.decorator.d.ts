import { UserEntity } from '../entities/user.entity';
export declare const GetUser: (...dataOrPipes: (keyof UserEntity | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
