import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserEntity } from '../entities/user.entity';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<UserEntity>;
}
export {};
