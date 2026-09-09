import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
