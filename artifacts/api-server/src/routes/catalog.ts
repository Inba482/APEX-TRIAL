import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, contactMessagesTable } from "@workspace/db";
import { gte, desc, sql, eq } from "drizzle-orm";
import {
  SubmitContactBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/catalog/summary", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [products, categories, newArrivals, inStock, avgRating] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(categoriesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(gte(productsTable.createdAt, thirtyDaysAgo)),
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(gte(productsTable.stock, 1)),
      db.select({ avg: sql<number>`round(avg(rating::numeric), 2)` }).from(productsTable),
    ]);

    res.json({
      totalProducts: products[0]?.count ?? 0,
      totalCategories: categories[0]?.count ?? 0,
      avgRating: parseFloat(String(avgRating[0]?.avg ?? 0)),
      newArrivalsCount: newArrivals[0]?.count ?? 0,
      inStockCount: inStock[0]?.count ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "getCatalogSummary failed");
    res.status(500).json({ error: "Failed to fetch catalog summary" });
  }
});

router.get("/catalog/new-arrivals", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);

    const rows = await db
      .select()
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(gte(productsTable.createdAt, thirtyDaysAgo))
      .orderBy(desc(productsTable.createdAt))
      .limit(8);

    res.json(
      rows.map((r) => formatProduct(r.products, r.categories))
    );
  } catch (err) {
    req.log.error({ err }, "listNewArrivals failed");
    res.status(500).json({ error: "Failed to fetch new arrivals" });
  }
});

router.get("/catalog/bestsellers", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .orderBy(desc(productsTable.rating), desc(productsTable.reviewCount))
      .limit(8);

    res.json(
      rows.map((r) => formatProduct(r.products, r.categories))
    );
  } catch (err) {
    req.log.error({ err }, "listBestsellers failed");
    res.status(500).json({ error: "Failed to fetch bestsellers" });
  }
});

router.get("/catalog/tags", async (req, res) => {
  try {
    const rows = await db
      .select({ tags: productsTable.tags })
      .from(productsTable);

    const allTags = new Set<string>();
    for (const row of rows) {
      const tags = row.tags as string[];
      if (Array.isArray(tags)) {
        tags.forEach((t) => allTags.add(t));
      }
    }

    res.json(Array.from(allTags).sort());
  } catch (err) {
    req.log.error({ err }, "listTags failed");
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const result = SubmitContactBody.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({ error: "Validation failed", issues: result.error.issues });
      return;
    }

    await db.insert(contactMessagesTable).values({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject ?? null,
      message: result.data.message,
    });

    res.json({ success: true, message: "Message received. We'll be in touch within 24 hours." });
  } catch (err) {
    req.log.error({ err }, "submitContact failed");
    res.status(500).json({ error: "Failed to submit message" });
  }
});

function formatProduct(
  product: typeof productsTable.$inferSelect,
  category: typeof categoriesTable.$inferSelect | null
) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: parseFloat(product.price as unknown as string),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice as unknown as string) : null,
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    images: (product.images as string[]) ?? [],
    description: product.description,
    shortDescription: product.shortDescription,
    rating: parseFloat(product.rating as unknown as string),
    reviewCount: product.reviewCount,
    stock: product.stock,
    tags: (product.tags as string[]) ?? [],
    createdAt: product.createdAt.toISOString(),
    featured: product.featured,
    specs: (product.specs as Record<string, string>) ?? {},
  };
}

export default router;
