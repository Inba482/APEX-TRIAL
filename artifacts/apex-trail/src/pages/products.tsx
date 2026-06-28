import { Layout } from "@/components/layout";
import { useListProducts, useListCategories, useListTags } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ListProductsSort } from "@workspace/api-client-react/src/generated/api.schemas";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<ListProductsSort>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const debouncedPriceRange = useDebounce(priceRange, 500);
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data: categories } = useListCategories();
  const { data: tagsData } = useListTags();
  
  const { data: productPage, isLoading } = useListProducts({
    search: debouncedSearch || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    sort: selectedSort,
    inStock: inStockOnly ? true : undefined,
    minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : undefined,
    maxPrice: debouncedPriceRange[1] < 1000 ? debouncedPriceRange[1] : undefined,
    tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
    page,
    limit: 12
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cat-all" 
              checked={selectedCategory === "all"}
              onCheckedChange={() => { setSelectedCategory("all"); setPage(1); }}
            />
            <Label htmlFor="cat-all" className="cursor-pointer">All Gear</Label>
          </div>
          {categories?.map(cat => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${cat.slug}`}
                checked={selectedCategory === cat.slug}
                onCheckedChange={() => { setSelectedCategory(cat.slug); setPage(1); }}
              />
              <Label htmlFor={`cat-${cat.slug}`} className="cursor-pointer">{cat.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(val) => { setPriceRange(val as [number, number]); setPage(1); }}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}{priceRange[1] === 1000 ? '+' : ''}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="in-stock" 
            checked={inStockOnly}
            onCheckedChange={(checked) => { setInStockOnly(checked as boolean); setPage(1); }}
          />
          <Label htmlFor="in-stock" className="cursor-pointer">In Stock Only</Label>
        </div>
      </div>

      {tagsData && tagsData.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Features</h3>
          <div className="flex flex-wrap gap-2">
            {tagsData.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className="h-7 text-xs"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Gear</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Loading..." : `${productPage?.total || 0} products found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search gear..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>
            
            <Select 
              value={selectedSort} 
              onValueChange={(val) => { setSelectedSort(val as ListProductsSort); setPage(1); }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Top Rated</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FiltersContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" /> Filters
                </h2>
                {(selectedCategory !== "all" || inStockOnly || selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSelectedCategory("all");
                      setInStockOnly(false);
                      setSelectedTags([]);
                      setPriceRange([0, 1000]);
                      setPage(1);
                    }}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <FiltersContent />
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/5] w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : productPage?.products.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                productPage?.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {productPage && productPage.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center justify-center min-w-12 text-sm font-medium">
                  {page} / {productPage.totalPages}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.min(productPage.totalPages, p + 1))}
                  disabled={page === productPage.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
