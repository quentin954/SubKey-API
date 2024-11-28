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
    "last_login" TIMESTAMP DEFAULT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("status_id") REFERENCES "product_status"("status_id")
);

CREATE TABLE "keys" (
    "key_id" SERIAL PRIMARY KEY,
    "product_key" VARCHAR(70) NOT NULL UNIQUE,
    "product_id" INT NOT NULL,
    "duration_seconds" INT NOT NULL,
    "is_active" BOOLEAN DEFAULT TRUE,
    "is_banned" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE
);

CREATE TABLE "user_products" (
    "user_product_id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "product_id" INT NOT NULL,
    "key_id" INT NOT NULL,
    "activation_date" TIMESTAMP DEFAULT NULL,
    "expiry_date" TIMESTAMP NOT NULL,
    "is_paused" BOOLEAN DEFAULT FALSE,
    "paused_at" TIMESTAMP DEFAULT NULL,
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

INSERT INTO "product_status" ("status_name", "is_active")
VALUES 
    ('Operational', TRUE),
    ('Use at own Risk', TRUE),
    ('Updating', FALSE),
    ('Detected', FALSE);

INSERT INTO "roles" ("role_name", "power") VALUES ('Admin', 100);

INSERT INTO "user_roles" ("user_id", "role_id") SELECT u."user_id", r."role_id" FROM "users" u JOIN "roles" r ON r."role_name" = 'Admin' WHERE u."username" = 'john_doe';