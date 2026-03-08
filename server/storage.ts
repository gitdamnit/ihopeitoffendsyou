import { db } from "./db";
import { roasts, type InsertRoast, type Roast } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createRoast(roast: InsertRoast): Promise<Roast>;
  getRoasts(): Promise<Roast[]>;
}

export class DatabaseStorage implements IStorage {
  async createRoast(insertRoast: InsertRoast): Promise<Roast> {
    const [roast] = await db.insert(roasts).values(insertRoast).returning();
    return roast;
  }

  async getRoasts(): Promise<Roast[]> {
    return await db.select().from(roasts).orderBy(desc(roasts.createdAt)).limit(10);
  }
}

export const storage = new DatabaseStorage();
