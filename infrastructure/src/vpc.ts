import { prefix } from "./../lib/prefix";
import * as aws from "@pulumi/aws";

const mainVpcName = `${prefix}-main`;
export const mainVpc = new aws.ec2.Vpc(mainVpcName, {
  cidrBlock: "10.0.0.0/16",
  instanceTenancy: "default", // or dedicated
  tags: {
    Name: mainVpcName,
  },
});
