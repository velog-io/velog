#!/bin/bash

if [ -z "$AWS_PROFILE" ]; then
  echo "AWS_PROFILE이 설정되어 있지 않습니다."
  exit 1
fi

# AWS 프로필 설정 읽기
export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile $AWS_PROFILE)
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile $AWS_PROFILE)
export TURBO_TEAM=$(aws configure get turbo_team --profile $AWS_PROFILE)
export TURBO_TOKEN=$(aws configure get turbo_token --profile $AWS_PROFILE)
export TURBO_REMOTE_CACHE_SIGNATURE_KEY=$(aws configure get turbo_remote_cache_signature_key --profile $AWS_PROFILE)

echo "AWS 프로필 설정이 완료되었습니다. $AWS_PROFILE 프로필을 사용합니다."
echo "AWS_ACCESSKEY_ID: $AWS_ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY"
echo "TURBO_TEAM: $TURBO_TEAM"
echo "TURBO_TOKEN: $TURBO_TOKEN"
echo "TURBO_REMOTE_CACHE_SIGNATURE_KEY: $TURBO_REMOTE_CACHE_SIGNATURE_KEY"

docker-compose up --build