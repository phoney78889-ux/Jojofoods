import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, menuItemsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const DELIVERY_FEES: Record<string, number> = {
  zone_a: 2.99,
  zone_b: 4.99,
  zone_c: 6.99,
  pickup: 0,
};

const ESTIMATED_TIMES: Record<string, number> = {
  zone_a: 25,
  zone_b: 37,
  zone_c: 52,
  pickup: 17,
};

router.get("/orders", async (_req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, deliveryAddress, deliveryZone, items, specialInstructions } = req.body;

    if (!customerName || !customerPhone || !customerEmail || !deliveryZone || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const validZones = ["zone_a", "zone_b", "zone_c", "pickup"];
    if (!validZones.includes(deliveryZone)) {
      res.status(400).json({ error: "Invalid delivery zone" });
      return;
    }

    const menuItems = await db.select().from(menuItemsTable);
    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

    let subtotal = 0;
    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItemId);
      if (!menuItem) {
        res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
        return;
      }
      subtotal += menuItem.price * item.quantity;
    }

    const deliveryFee = DELIVERY_FEES[deliveryZone] ?? 0;
    const totalPrice = parseFloat((subtotal + deliveryFee).toFixed(2));
    const estimatedDeliveryTime = ESTIMATED_TIMES[deliveryZone] ?? 30;

    const [order] = await db
      .insert(ordersTable)
      .values({
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress: deliveryAddress || null,
        deliveryZone: deliveryZone as "zone_a" | "zone_b" | "zone_c" | "pickup",
        items,
        specialInstructions: specialInstructions || null,
        totalPrice,
        deliveryFee,
        status: "confirmed",
        estimatedDeliveryTime,
      })
      .returning();

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
