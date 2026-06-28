import { Layout } from "@/components/layout";
import { useParams, Link } from "wouter";
import { useGetCategory, useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function CategoryDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: category, isLoading: isLoadingCategory } = useGetCategory(slug, {
    query: { enabled: !!slug }
  });
  
  const { data: productPage, isLoading: isLoadingProducts } = useListProducts({
    category: slug,
    limit: 24
  }, {
    query: { enabled: !!slug }
  });

  return (
    <Layout>
      {isLoadingCategory ? (
        <div className="h-[40vh] min-h-[300px] bg-muted w-full flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
      ) : category ? (
        <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={category.imageUrl} 
              alt={category.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-4 uppercase tracking-wider font-semibold">
              <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{category.name}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {category.name}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">
          <h1 className="text-3xl font-bold">Category Not Found</h1>
        </div>
      )}

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold">All {category?.name || 'Gear'}</h2>
          <div className="text-muted-foreground font-medium">
            {isLoadingProducts ? 'Loading...' : `${productPage?.total || 0} products`}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoadingProducts ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : productPage?.products.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-xl font-semibold mb-2">No products found in this category</h3>
              <Button asChild className="mt-4">
                <Link href="/products">Shop All Gear</Link>
              </Button>
            </div>
          ) : (
            productPage?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
