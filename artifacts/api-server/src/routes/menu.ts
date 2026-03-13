import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { menuItemsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/menu", async (_req, res) => {
  try {
    const items = await db.select().from(menuItemsTable).orderBy(menuItemsTable.category, menuItemsTable.id);
    res.json(items);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [item] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, id)).limit(1);
    if (!item) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    res.json(item);
  } catch (err) {
    console.error("Error fetching menu item:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
