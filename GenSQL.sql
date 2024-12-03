DROP TABLE IF EXISTS "user_bans" CASCADE;
DROP TABLE IF EXISTS "user_roles" CASCADE;
DROP TABLE IF EXISTS "roles" CASCADE;
DROP TABLE IF EXISTS "user_products" CASCADE;
DROP TABLE IF EXISTS "keys" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "product_status" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

CREATE TABLE "users" (
    "user_id" SERIAL PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "hardware_id" VARCHAR(255),
    "last_login" TIMESTAMPTZ DEFAULT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "product_status" (
    "status_id" SERIAL PRIMARY KEY,
    "status_name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(200) NULL,
    "is_active" BOOLEAN NOT NULL
);

CREATE TABLE "products" (
    "product_id" SERIAL PRIMARY KEY,
    "product_name" VARCHAR(100) NOT NULL UNIQUE,
    "status_id" INT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("status_id") REFERENCES "product_status"("status_id")
);

CREATE TABLE "keys" (
    "key_id" SERIAL PRIMARY KEY,
    "product_key" VARCHAR(70) NOT NULL UNIQUE,
    "product_id" INT NOT NULL,
    "duration_seconds" INT NOT NULL,
    "is_active" BOOLEAN DEFAULT TRUE,
    "is_banned" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE
);

CREATE TABLE "user_products" (
    "user_product_id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "product_id" INT NOT NULL,
    "key_id" INT NOT NULL,
    "activation_date" TIMESTAMPTZ DEFAULT NULL,
    "expiry_date" TIMESTAMPTZ NOT NULL,
    "is_paused" BOOLEAN DEFAULT FALSE,
    "paused_at" TIMESTAMPTZ DEFAULT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE,
    FOREIGN KEY ("key_id") REFERENCES "keys"("key_id") ON DELETE CASCADE
);

CREATE TABLE "roles" (
    "role_id" SERIAL PRIMARY KEY,
    "role_name" VARCHAR(50) NOT NULL UNIQUE,
    "power" INT NOT NULL
);

CREATE TABLE "user_roles" (
    "user_role_id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "role_id" INT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE,
    UNIQUE ("user_id", "role_id")
);

CREATE TABLE "user_bans" (
    "ban_id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "banned_by" INT NOT NULL,
    "ban_start" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "ban_end" TIMESTAMPTZ,
    "reason" TEXT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("banned_by") REFERENCES "users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "action_logs" (
    "log_id" SERIAL PRIMARY KEY,
    "user_id" INT NULL,
    "action" VARCHAR(255) NOT NULL,
    "details" JSONB DEFAULT NULL,
    "ip_address" VARCHAR(45) DEFAULT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX unique_active_ban_idx ON "user_bans" ("user_id") WHERE "is_active" = TRUE;