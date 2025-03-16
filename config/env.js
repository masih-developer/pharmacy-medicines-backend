/* eslint-disable n/no-process-env */
import { Config } from "@fullstacksjs/config";

const schema = new Config({
  tokenSecretKey: Config.string(),
  accessTokenSecretKey: Config.string(),
  refreshTokenSecretKey: Config.string(),
  cookieParserSecretKey: Config.string(),
  nodeEnv: Config.string({ default: "development" }),
  allowCorsOrigin: Config.string(),
  mongodbUri: Config.string(),
  port: Config.number({ default: 5000 }),
});

const config = schema.parse({
  tokenSecretKey: process.env.TOKEN_SECRET_KEY,
  accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
  cookieParserSecretKey: process.env.COOKIE_PARSER_SECRET_KEY,
  nodeEnv: process.env.NODE_ENV,
  allowCorsOrigin: process.env.ALLOW_CORS_ORIGIN,
  mongodbUri: process.env.MONGODB_URI,
  port: process.env.PORT ? Number(process.env.PORT) : undefined,
});

export default config;
