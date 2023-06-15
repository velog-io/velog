import { resolve } from "path";

export const resolveDir = (dir: string): string => {
  const resolvedDir = resolve(process.cwd(), dir);
  return resolvedDir;
};
