# Creating a New Migration for Schema Changes

The `--only-create` option is applied.

**Explanation:** Even if the `--only-create` option is applied, running the `migrate:dev` command twice will apply the pending migrations.

```bash
pnpm prisma-migrate:dev
```

# Apply all pending migrations to the database

```bash
pnpm prisma-migrate:deploy
```

# Resetting Migration

```bash
pnpm prisma migrate reset
```
