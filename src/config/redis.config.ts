import { bool, cleanEnv, host, port, str } from 'envalid';
import { registerAs } from '@nestjs/config';
import { ConfigNames } from './config-names.enum';

const env = cleanEnv(process.env, {
  REDIS_HOST: host({ devDefault: 'localhost' }),
  REDIS_PORT: port({ devDefault: 6379 }),
  REDIS_USERNAME: str({ default: undefined }),
  REDIS_PASSWORD: str({ default: undefined }),
  REDIS_TLS: bool({ devDefault: false }),
});

export const RedisConfig = registerAs(ConfigNames.Redis, () => ({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  tls: env.REDIS_TLS ? {} : undefined,
  db: 11,
}));
