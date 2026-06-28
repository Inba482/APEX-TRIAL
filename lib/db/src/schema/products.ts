import { pgTable, serial, text, numeric, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  categoryId: integer("category_id").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
