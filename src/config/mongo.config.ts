import { cleanEnv, str } from 'envalid';
import { registerAs } from '@nestjs/config';
import { ConfigNames } from './config-names.enum';

const env = cleanEnv(process.env, {
  MONGO_URI: str({ devDefault: 'mongodb://localhost/nest' }),
});

export const MongoConfig = registerAs(ConfigNames.Mongo, () => ({
  uri: env.MONGO_URI,
}));
