import * as aws from "@pulumi/aws";
import { prefix } from "./prefix";

export const upsertParameter = async (name: string, value: string) => {
  const parameter = new aws.ssm.Parameter(`${prefix}-${name}`, {
    name: `/${prefix}/${name}`,
    type: "String",
    value,
    overwrite: true,
  });
  return parameter;
};
