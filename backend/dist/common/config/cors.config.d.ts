import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
export declare function getAllowedOrigins(): string[];
export declare const ALLOWED_METHODS: string[];
export declare const ALLOWED_HEADERS: string[];
export declare function getCorsOptions(): CorsOptions;
