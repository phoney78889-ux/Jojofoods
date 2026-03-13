import { pgTable, serial, text, real, integer, timestamp, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const deliveryZoneEnum = pgEnum("delivery_zone", ["zone_a", "zone_b", "zone_c", "pickup"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  deliveryAddress: text("delivery_address"),
  deliveryZone: deliveryZoneEnum("delivery_zone").notNull(),
  items: json("items").notNull().$type<Array<{ menuItemId: number; quantity: number; notes?: string }>>(),
  specialInstructions: text("special_instructions"),
  totalPrice: real("total_price").notNull(),
  deliveryFee: real("delivery_fee").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  estimatedDeliveryTime: integer("estimated_delivery_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
