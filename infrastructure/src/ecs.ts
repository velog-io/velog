import * as aws from "@pulumi/aws";
import type { GetRepositoryResult } from "@pulumi/aws/ecr";


export const getEcrRepository = async (name: string) => {
  const repository = await aws.ecr.getRepository({
    name,
  });
  return repository;
};

export const getLatestImage = (repo: GetRepositoryResult) =>
  `${repo.repositoryUrl}:latest`;

export const createCluster = (name: string = "cluster") =>
  new aws.ecs.Cluster(name);
