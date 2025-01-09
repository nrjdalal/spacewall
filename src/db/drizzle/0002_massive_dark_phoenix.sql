CREATE TABLE "paymentPage" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	CONSTRAINT "paymentPage_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "paymentPage" ADD CONSTRAINT "paymentPage_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;