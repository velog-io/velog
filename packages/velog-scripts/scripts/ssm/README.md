# AWS SSM Parameter Store Handler

## Prerequisites

Before using this script, ensure that you have installed the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and configured it with your AWS credentials by running `aws configure`.

## Usage

Copy the `.env.example` file to `.env.{environment}` where `{environment}` is one of the following: `development`, `stage`, `test`, or `production`.

## Command Line Flags

The following command line flags are available:

1. `command`: Specifies the type of parameter handling (optional)

   - `push`: Uploads the contents of `.env.{environment}` to the AWS Systems Manager (SSM) Parameter Store.
   - `pull`: Downloads the parameter value from the SSM Parameter Store and saves it to `.env.{environment}`.

2. `-e`: Specifies the environment for parameter handling (optional)

   - `development`: Development environment.
   - `stage`: Test server environment.
   - `test`: Jest testing environment.
   - `production`: Production environment.

3. `-v`: Specifies the version of the parameter to retrieve from the SSM Parameter Store (optional).
   - When used with the `pull` command, it fetches the parameter value corresponding to the provided version.
   - If not specified, the latest version of the parameter will be retrieved.
   - If a non-existent version is specified, a 400 error will be returned, indicating the version does not exist.

## Examples

```sh
# Example 1: Pull from SSM parameter of a specific version and save to .env.development
pnpm ssm pull -e development -v 2

# Example 2: Pull the latest version of SSM parameter and save to .env.production
pnpm ssm pull -e production

# Example 3: Push .env.production file to SSM parameter
pnpm ssm push -e production
```
