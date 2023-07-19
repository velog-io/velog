import * as dotenv from "dotenv";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const appEnv = config.require("APP_ENV");

import { resolve } from "path";

function resolveDir(dir: string) {
  const resolvedDir = resolve(__dirname, dir);
  return resolvedDir;
}

const envFiles: Record<string, string> = {
  development: ".env.development",
  production: ".env.production",
  staging: ".env.staging",
};

const file = envFiles[appEnv];

dotenv.config({ path: resolveDir(`./env/${file}`) });

type EnvType = {
  appEnv: "development" | "production" | "stage";
  ecrRepositoryName: string;
  port: number;
};

export const ENV = {
  appEnv,
  port: Number(process.env.PORT) || 3000,
  ecrRepositoryName: process.env.ECR_REPOSITORY_NAME,
} as EnvType;
