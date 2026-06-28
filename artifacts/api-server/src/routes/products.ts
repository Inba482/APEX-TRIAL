import { Router } from "express";
import { readFileSync } from "fs";
import { join } from "path";

const router = Router();

// Load data from JSON files
function loadProducts() {
  const data = readFileSync(join(process.cwd(), "src/data/products.json"), "utf-8");
  return JSON.parse(data);
}

function loadCategories() {
  const data = readFileSync(join(process.cwd(), "src/data/categories.json"), "utf-8");
  return JSON.parse(data);
}

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
    
    let products = loadProducts();
    const categories = loadCategories();

    // Filter by category
    if (category) {
      const cat = categories.find((c: any) => c.slug === category);
      if (cat) {
        products = products.filter((p: any) => p.categoryId === cat.id);
      }
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p: any) => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter((p: any) => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p: any) => p.price <= parseInt(maxPrice));
    }

    // Filter by stock
    if (inStock === "true") {
      products = products.filter((p: any) => p.stock >= 1);
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(",").map((t: string) => t.trim().toLowerCase());
      products = products.filter((p: any) =>
        tagList.some((t: string) => p.tags.map((pt: string) => pt.toLowerCase()).includes(t))
      );
    }

    // Sort
    switch (sort) {
      case "price-asc":
        products.sort((a: any, b: any) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a: any, b: any) => b.price - a.price);
        break;
      case "rating-desc":
        products.sort((a: any, b: any) => b.rating - a.rating);
        break;
      case "newest":
      default:
        products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = products.length;
    const offset = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(offset, offset + limitNum);

    // Add category info to products
    const productsWithCategory = paginatedProducts.map((p: any) => {
      const category = categories.find((c: any) => c.id === p.categoryId);
      return {
        ...p,
        category: category?.name ?? "",
        categorySlug: category?.slug ?? "",
      };
    });

    res.json({
      products: productsWithCategory,
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
    const products = loadProducts();
    const categories = loadCategories();
    
    const featured = products
      .filter((p: any) => p.featured)
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 8)
      .map((p: any) => {
        const category = categories.find((c: any) => c.id === p.categoryId);
        return {
          ...p,
          category: category?.name ?? "",
          categorySlug: category?.slug ?? "",
        };
      });

    res.json(featured);
  } catch (err) {
    req.log.error({ err }, "listFeaturedProducts failed");
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }

    const products = loadProducts();
    const categories = loadCategories();
    
    const product = products.find((p: any) => p.id === id);
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }

    const category = categories.find((c: any) => c.id === product.categoryId);
    res.json({
      ...product,
      category: category?.name ?? "",
      categorySlug: category?.slug ?? "",
    });
  } catch (err) {
    req.log.error({ err }, "getProduct failed");
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.get("/products/:id/related", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(404).json({ error: "Not found" }); return; }

    const products = loadProducts();
    const categories = loadCategories();
    
    const product = products.find((p: any) => p.id === id);
    if (!product) { res.json([]); return; }

    const related = products
      .filter((p: any) => p.categoryId === product.categoryId && p.id !== id)
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 4)
      .map((p: any) => {
        const category = categories.find((c: any) => c.id === p.categoryId);
        return {
          ...p,
          category: category?.name ?? "",
          categorySlug: category?.slug ?? "",
        };
      });

    res.json(related);
  } catch (err) {
    req.log.error({ err }, "getRelatedProducts failed");
    res.status(500).json({ error: "Failed to fetch related products" });
  }
});

export default router;