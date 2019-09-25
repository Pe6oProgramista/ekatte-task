DROP DATABASE IF EXISTS ekatte;
CREATE DATABASE ekatte;
\c ekatte;

CREATE TABLE "oblast" (
  "id" SERIAL PRIMARY KEY UNIQUE NOT NULL,
  "oblast" varchar UNIQUE,
  "name" varchar,
  "center" varchar,
  "region" varchar
);

CREATE TABLE "obstina" (
  "id" SERIAL PRIMARY KEY UNIQUE NOT NULL,
  "obstina" varchar UNIQUE,
  "name" varchar,
  "oblast" varchar,
  "center" varchar,
  "category" varchar
);

CREATE TABLE "atte" (
  "id" SERIAL PRIMARY KEY UNIQUE NOT NULL,
  "ekatte" varchar UNIQUE,
  "name" varchar,
  "obstina" varchar,
  "kind" varchar,
  "category" varchar,
  "altitude" varchar
);

CREATE TABLE "kind" (
  "id" SERIAL PRIMARY KEY UNIQUE NOT NULL,
  "kind" varchar UNIQUE,
  "tvm" varchar
);

ALTER TABLE "oblast" ADD FOREIGN KEY ("center") REFERENCES "atte" ("ekatte");

ALTER TABLE "obstina" ADD FOREIGN KEY ("oblast") REFERENCES "oblast" ("oblast");
ALTER TABLE "obstina" ADD FOREIGN KEY ("center") REFERENCES "atte" ("ekatte");

ALTER TABLE "atte" ADD FOREIGN KEY ("obstina") REFERENCES "obstina" ("obstina");
ALTER TABLE "atte" ADD FOREIGN KEY ("kind") REFERENCES "kind" ("kind");
