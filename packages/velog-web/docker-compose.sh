#!/bin/bash

# AWS 프로필 설정 읽기
export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile $AWS_PROFILE)
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile $AWS_PROFILE)

echo "AWS 프로필 설정이 완료되었습니다. $AWS_PROFILE 프로필을 사용합니다."
# echo "AWS_ACCESSKEY_ID: $AWS_ACCESS_KEY_ID"
# echo "AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY"

docker-compose up --build