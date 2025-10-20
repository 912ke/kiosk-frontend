import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hosts = pgTable("hosts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  groupId: integer("group_id"),
  groupName: text("group_name"),
  online: boolean("online").notNull().default(true),
});

export const bookings = pgTable("bookings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  hosts: text("hosts").notNull(),
  from: timestamp("from").notNull(),
  to: timestamp("to").notNull(),
  status: text("status").notNull().default('confirmed'),
  comment: text("comment"),
  clientPhone: text("client_phone"),
  clientName: text("client_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHostSchema = z.object({
  name: z.string(),
  groupId: z.number().nullable().optional(),
  groupName: z.string().nullable().optional(),
  online: z.boolean().default(true),
});

export const insertBookingSchema = z.object({
  hosts: z.array(z.number()),
  from: z.string(),
  to: z.string(),
  comment: z.string().optional(),
  clientPhone: z.string().optional(),
  clientName: z.string().optional(),
});

export type InsertHost = z.infer<typeof insertHostSchema>;
export type Host = typeof hosts.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export interface CatalogInfo {
  source: string;
  name: string;
  address: string;
  currency: string;
  services: string[];
}

export interface SlotQuery {
  date: string;
  start: string;
  end: string;
  duration_minutes: number;
  step_minutes: number;
  count: number;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: number;
}
