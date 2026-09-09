import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { AuthResponse } from './interfaces/auth-response.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    getProfile(user: UserEntity): Promise<UserEntity>;
    debugMe(req: any): Promise<{
        message: string;
        user: any;
        hasRole: boolean;
        roleValue: any;
    }>;
}
