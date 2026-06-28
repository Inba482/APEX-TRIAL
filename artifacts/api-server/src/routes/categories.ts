import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const rows = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        imageUrl: categoriesTable.imageUrl,
        productCount: sql<number>`count(${productsTable.id})::int`,
      })
      .from(categoriesTable)
      .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
      .groupBy(categoriesTable.id)
      .orderBy(categoriesTable.name);

    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "listCategories failed");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/categories/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const rows = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        imageUrl: categoriesTable.imageUrl,
        productCount: sql<number>`count(${productsTable.id})::int`,
      })
      .from(categoriesTable)
      .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(categoriesTable.slug, slug))
      .groupBy(categoriesTable.id)
      .limit(1);

    if (rows.length === 0) { res.status(404).json({ error: "Category not found" }); return; }
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "getCategory failed");
    res.status(500).json({ error: "Failed to fetch category" }); return;
  }
});

export default router;
