import { Router } from "express";
import { readFileSync } from "fs";
import { join } from "path";

const router = Router();

function loadCategories() {
  const data = readFileSync(join(process.cwd(), "src/data/categories.json"), "utf-8");
  return JSON.parse(data);
}

function loadProducts() {
  const data = readFileSync(join(process.cwd(), "src/data/products.json"), "utf-8");
  return JSON.parse(data);
}

router.get("/categories", async (req, res) => {
  try {
    const categories = loadCategories();
    const products = loadProducts();

    // Add product count to each category
    const categoriesWithCount = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      productCount: products.filter((p: any) => p.categoryId === cat.id).length,
    }));

    res.json(categoriesWithCount);
  } catch (err) {
    req.log.error({ err }, "listCategories failed");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/categories/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const categories = loadCategories();
    const products = loadProducts();

    const category = categories.find((c: any) => c.slug === slug);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const productCount = products.filter((p: any) => p.categoryId === category.id).length;

    res.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      productCount,
    });
  } catch (err) {
    req.log.error({ err }, "getCategory failed");
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

export default router;