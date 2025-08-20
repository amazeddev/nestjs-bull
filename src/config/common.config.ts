import { cleanEnv, makeValidator, port, str } from 'envalid';
import { isURL } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { ConfigNames } from './config-names.enum';

const frontUrls = makeValidator((value) => {
  const values = value.split(',');
  for (value of values) {
    if (!isURL(value, { require_tld: false, require_protocol: true })) {
      throw new Error('Expected url(s)');
    }
  }

  return values;
});

const env = cleanEnv(process.env, {
  FRONT_URL: frontUrls({
    devDefault: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  }),
  PORT: port({ devDefault: 3000 }),
  NODE_ENV: str({ devDefault: 'development' }),
});

export const CommonConfig = registerAs(ConfigNames.Common, () => ({
  frontUrl: env.FRONT_URL,
  port: env.PORT,
  env: env.NODE_ENV,
}));
