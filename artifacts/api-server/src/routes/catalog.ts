import { Router } from "express";
import { readFileSync } from "fs";
import { join } from "path";

const router = Router();

function loadProducts() {
  const data = readFileSync(join(process.cwd(), "src/data/products.json"), "utf-8");
  return JSON.parse(data);
}

function loadCategories() {
  const data = readFileSync(join(process.cwd(), "src/data/categories.json"), "utf-8");
  return JSON.parse(data);
}

router.get("/catalog/summary", async (req, res) => {
  try {
    const products = loadProducts();
    const categories = loadCategories();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newArrivals = products.filter((p: any) => new Date(p.createdAt) >= thirtyDaysAgo).length;
    const inStock = products.filter((p: any) => p.stock >= 1).length;
    const avgRating = products.reduce((sum: number, p: any) => sum + p.rating, 0) / products.length;

    res.json({
      totalProducts: products.length,
      totalCategories: categories.length,
      avgRating: Math.round(avgRating * 100) / 100,
      newArrivalsCount: newArrivals,
      inStockCount: inStock,
    });
  } catch (err) {
    req.log.error({ err }, "getCatalogSummary failed");
    res.status(500).json({ error: "Failed to fetch catalog summary" });
  }
});

router.get("/catalog/new-arrivals", async (req, res) => {
  try {
    const products = loadProducts();
    const categories = loadCategories();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);

    const newArrivals = products
      .filter((p: any) => new Date(p.createdAt) >= thirtyDaysAgo)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map((p: any) => {
        const category = categories.find((c: any) => c.id === p.categoryId);
        return {
          ...p,
          category: category?.name ?? "",
          categorySlug: category?.slug ?? "",
        };
      });

    res.json(newArrivals);
  } catch (err) {
    req.log.error({ err }, "listNewArrivals failed");
    res.status(500).json({ error: "Failed to fetch new arrivals" });
  }
});

router.get("/catalog/bestsellers", async (req, res) => {
  try {
    const products = loadProducts();
    const categories = loadCategories();

    const bestsellers = products
      .sort((a: any, b: any) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, 8)
      .map((p: any) => {
        const category = categories.find((c: any) => c.id === p.categoryId);
        return {
          ...p,
          category: category?.name ?? "",
          categorySlug: category?.slug ?? "",
        };
      });

    res.json(bestsellers);
  } catch (err) {
    req.log.error({ err }, "listBestsellers failed");
    res.status(500).json({ error: "Failed to fetch bestsellers" });
  }
});

router.get("/catalog/tags", async (req, res) => {
  try {
    const products = loadProducts();

    const allTags = new Set<string>();
    for (const product of products) {
      const tags = product.tags;
      if (Array.isArray(tags)) {
        tags.forEach((t: string) => allTags.add(t));
      }
    }

    res.json(Array.from(allTags).sort());
  } catch (err) {
    req.log.error({ err }, "listTags failed");
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

export default router;