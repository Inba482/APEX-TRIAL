import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, desc, asc, sql, inArray } from "drizzle-orm";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const {
      category,
      search,
      sort = "newest",
      minPrice,
      maxPrice,
      inStock,
      tags,
      page = "1",
      limit = "12",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];

    if (category) {
      const cat = await db
        .select({ id: categoriesTable.id })
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, category))
        .limit(1);
      if (cat.length > 0) {
        conditions.push(eq(productsTable.categoryId, cat[0].id));
      }
    }

    if (search) {
      conditions.push(ilike(productsTable.name, `%${search}%`));
    }

    if (minPrice) {
      conditions.push(gte(productsTable.price, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(productsTable.price, maxPrice));
    }

    if (inStock === "true") {
      conditions.push(gte(productsTable.stock, 1));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (sort) {
      case "price-asc":
        orderBy = asc(productsTable.price);
        break;
      case "price-desc":
        orderBy = desc(productsTable.price);
        break;
      case "rating-desc":
        orderBy = desc(productsTable.rating);
        break;
      case "newest":
      default:
        orderBy = desc(productsTable.createdAt);
        break;
    }

    const [countResult, rawProducts] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(where),
      db
        .select()
        .from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(where)
        .orderBy(orderBy)
        .limit(limitNum)
        .offset(offset),
    ]);

    const total = countResult[0]?.count ?? 0;

    // Filter by tags client-side (jsonb array contains check)
    let products = rawProducts.map((row) => formatProduct(row.products, row.categories));

    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim().toLowerCase());
      products = products.filter((p) =>
        tagList.some((t) => p.tags.map((pt: string) => pt.toLowerCase()).includes(t))
      );
    }

    res.json({
      products,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    req.log.error({ err }, "listProducts failed");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/featured", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.featured, true))
      .orderBy(desc(productsTable.rating))
      .limit(8);

    res.json(rows.map((r) => formatProduct(r.products, r.categories)));
  } catch (err) {
    req.log.error({ err }, "listFeaturedProducts failed");
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }

    const rows = await db
      .select()
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id))
      .limit(1);

    if (rows.length === 0) { res.status(404).json({ error: "Product not found" }); return; }
    res.json(formatProduct(rows[0].products, rows[0].categories));
  } catch (err) {
    req.log.error({ err }, "getProduct failed");
    res.status(500).json({ error: "Failed to fetch product" }); return;
  }
});

router.get("/products/:id/related", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }

    const product = await db
      .select({ categoryId: productsTable.categoryId })
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (product.length === 0) { res.json([]); return; }

    const rows = await db
      .select()
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(
        and(
          eq(productsTable.categoryId, product[0].categoryId),
          sql`${productsTable.id} != ${id}`
        )
      )
      .orderBy(desc(productsTable.rating))
      .limit(4);

    res.json(rows.map((r) => formatProduct(r.products, r.categories)));
  } catch (err) {
    req.log.error({ err }, "getRelatedProducts failed");
    res.status(500).json({ error: "Failed to fetch related products" });
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
