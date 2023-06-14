import dotenv from "dotenv";

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { Envrionment, EnvFiles, EnvVars } from "./common/interfaces/env";

function resolveDir(dir: string) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const resolvedDir = resolve(currentDir, dir);
  return resolvedDir;
}

const envFiles: EnvFiles = {
  development: ".env.development",
  production: ".env.production",
  test: ".env.test",
  stage: ".env.stage",
};

const appEnv = (process.env.APP_ENV as Envrionment) || "development";

const file = envFiles[appEnv];

dotenv.config({ path: resolveDir(`../env/${file}`) });

export const ENV = {
  appEnv,
  port: Number(process.env.PORT),
  clientHost: process.env.CLIENT_HOST,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  awsDefaultProfile: process.env.AWS_DEFAULT_PROFILE,
  esHost: process.env.ES_HOST,
  social: {
    githubId: process.env.GITHUB_ID,
    githubSecret: process.env.GITHUB_SECRET,
    facebookId: process.env.FACEBOOK_ID,
    facebookSecret: process.env.FACEBOOK_SECRET,
    googleId: process.env.GOOGLE_ID,
    googleSecret: process.env.GOOGLE_SECRET,
  },
  hashKey: process.env.HASH_KEY,
  slack: {
    token: process.env.SLACK_TOKEN,
    image: process.env.SLACK_IMAGE,
  },

  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  banned: {
    keywords: process.env.BANNED_KEYWORDS,
    altKeywords: process.env.BANNED_ALT_KEYWORDS,
  },
  unscored: {
    category: process.env.UNSCORED_CATEGORY,
    words: process.env.UNSCORED_WORDS,
  },
  graphcdnToken: process.env.GRAPHCDN_TOKEN,
  blacklist: {
    username: process.env.BLACKLIST_USERNAME,
    ip: process.env.BLACKLIST_IP,
  },
  cloudflare: {
    id: process.env.CLOUDFLARE_ID,
    token: process.env.CLOUDFLARE_TOKEN,
    accountHash: process.env.CLOUDFLARE_ACCOUNT_HASH,
  },
  b2: {
    keyId: process.env.B2_KEY_ID,
    key: process.env.B2_KEY,
    bucketId: process.env.B2_BUCKET_ID,
  },
  codenary: {
    apiKey: process.env.CODENARY_API_KEY,
    webhook: process.env.CODENARY_WEBHOOK,
    callback: process.env.CODENARY_CALLBACK,
  },
  databaseUrl: process.env.DATABASE_URL,
} as EnvVars;
