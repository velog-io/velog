import { resolve } from "path";
import { injectable } from "tsyringe";

@injectable()
export class Utils {
  resolveDir = (dir: string): string => {
    return resolve(process.cwd(), dir);
  };
}
