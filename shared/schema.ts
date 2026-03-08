import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roasts = pgTable("roasts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  topic: text("topic"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRoastSchema = createInsertSchema(roasts).omit({ id: true, createdAt: true });

export type Roast = typeof roasts.$inferSelect;
export type InsertRoast = z.infer<typeof insertRoastSchema>;
