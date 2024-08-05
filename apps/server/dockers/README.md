# 1. Run PostgreSQL Server with docker compose

```sh
docker-compose up -d
```

# 2. Run Bash

```sh
docker exec -it velog_db bash
```

# 3. login as postgres

```sh
psql -U postgres
```

# 4. Run following statements

```sh
CREATE DATABASE velog
  LC_COLLATE 'C'
  LC_CTYPE 'C'
  ENCODING 'UTF8'
  TEMPLATE template0;

CREATE USER velog WITH ENCRYPTED PASSWORD 'example';
GRANT ALL PRIVILEGES ON DATABASE velog to velog;

\c velog

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
```
