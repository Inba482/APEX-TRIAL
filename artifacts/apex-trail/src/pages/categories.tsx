import { Layout } from "@/components/layout";
import { useListCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Categories() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <Layout>
      <div className="bg-muted py-12 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Discipline</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our gear is organized by the environments it's built to master. 
            Choose your pursuit and find the equipment engineered for it.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/10] w-full" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))
          ) : (
            categories?.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/categories/${category.slug}`} className="group block h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden mb-6 bg-muted">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted rounded-full">
                        {category.productCount} items
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground flex-1 mb-4">
                      {category.description}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:underline mt-auto">
                      Explore {category.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
