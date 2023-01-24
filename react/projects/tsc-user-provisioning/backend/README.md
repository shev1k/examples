# Backend

## Dev

### Setup

Install packages and create `.env` file:

```sh
  npm run setup:dev
```

<br />

Fill missing values in `.env` file.

Setup mysql and mail-engine:

```sh
  docker-compose up -d
```

<br />

Migrate tables:

```sh
  npm run migrate:up
```

<br />

(Optional) Seed database:

```sh
  npm run seed:all
```

(Optional) Drop seeds:

```
  npm run seed:all -- --drop
```

<br />

Boot the node:

```sh
  npm run start:dev
```

<br />
<br />

## Tools

### Migrations

Update migrations:

```sh
  npm run migrate:up
```

Downgrade migrations:

```sh
  npm run migrate:down
```

Generate empty migration file:

```sh
  npm run migrate:create <FILE_NAME>.ts
```

### Seed

Apply every seed from `./seeds`:

```sh
  npm run seed:all
```

Apply one seed from `./seeds`:

```sh
  npm run seed:one <FILE_NAME>.ts
```
