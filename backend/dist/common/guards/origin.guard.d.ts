import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class OriginGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
    private extractOrigin;
}
