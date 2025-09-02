CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'BLOCKED');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar,
	"password" varchar,
	"role" "user_role" DEFAULT 'USER',
	"status" "user_status" DEFAULT 'ACTIVE',
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
