# Pulumi User Guide

## 1. Checking Available Stacks

To view the list of your stacks, use the following command:

```bash
pulumi stack ls
```

## 2. Selecting a Stack

To select a specific stack, choose from `development`, `stage`, or `production` as needed:

```bash
pulumi stack select [development|stage|production]
```

## 3. Reviewing and Deploying Resources

For checking the state of resources and proceeding with deployment, use:

```bash
pulumi up
```

## 4. Setting the Target Infrastructure

If you wish to deploy a specific infrastructure, set your desired target: 'all', 'web', 'server', or 'cron' or 'nothing'.

Examples:

- To target all infrastructures:

```bash
pulumi config set target all
```

- To target only the server infrastructure:

```bash
pulumi config set target server
```

- To target for multiple infrastructures

```bash
pulumi config set target web,cron
```

- To target only infrastructure envrionment

```bash
pulumi config set target infra
```
