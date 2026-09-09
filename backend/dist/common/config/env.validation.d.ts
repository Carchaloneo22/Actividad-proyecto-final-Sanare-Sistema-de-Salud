import 'reflect-metadata';
export declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
export declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT: number;
    DATABASE_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_URL?: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    FRONTEND_URL: string;
    EMAIL_HOST?: string;
    EMAIL_PORT?: number;
    EMAIL_USER?: string;
    EMAIL_PASS?: string;
    EMAIL_FROM: string;
    GEMINI_API_KEY?: string;
}
export declare function validateEnv(config: Record<string, unknown>): EnvironmentVariables;
