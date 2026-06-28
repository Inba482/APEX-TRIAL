import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useListFeaturedProducts, useGetCatalogSummary, useListNewArrivals, useListCategories, useListBestsellers } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function Home() {
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useListFeaturedProducts();
  const { data: newArrivals, isLoading: isLoadingNew } = useListNewArrivals();
  const { data: bestsellers, isLoading: isLoadingBestsellers } = useListBestsellers();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { data: summary } = useGetCatalogSummary();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
            alt="Mountain landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              ENGINEERED FOR THE EDGE.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Uncompromising gear for those who live where the air is thin and the trails are steep. 
              Precision equipment built to perform when it matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base font-semibold px-8">
                <Link href="/products">Shop All Gear</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base font-semibold px-8 bg-transparent text-white border-white hover:bg-white hover:text-black">
                <Link href="/categories">Explore Categories</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Summary */}
      {summary && (
        <section className="bg-muted py-8 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{summary.totalProducts}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{summary.totalCategories}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{summary.newArrivalsCount}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">New Arrivals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{summary.avgRating.toFixed(1)}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Gear</h2>
              <p className="text-muted-foreground">Handpicked for your next expedition.</p>
            </div>
            <Link href="/products?sort=rating-desc" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              View Top Rated <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingFeatured ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Shop by Discipline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingCategories ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))
            ) : (
              categories?.slice(0, 3).map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`} className="group relative aspect-square overflow-hidden block">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-bold tracking-wider mb-2">{category.name}</h3>
                    <span className="text-sm border border-white px-4 py-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Shop {category.productCount} Items
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Bestsellers</h2>
              <p className="text-muted-foreground">Tested and trusted by adventurers.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingBestsellers ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              bestsellers?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground">The latest advancements in outdoor engineering.</p>
            </div>
            <Link href="/products?sort=newest" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              View All New <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingNew ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              newArrivals?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

    </Layout>
  );
}
