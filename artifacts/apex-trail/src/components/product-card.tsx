import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);

  return (
    <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        
        {product.featured && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/50 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80 hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            toggleItem(product.id);
          }}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
          <span className="sr-only">Toggle Wishlist</span>
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            {product.category}
          </div>
          <div className="text-sm font-medium flex items-center gap-1">
            <span className="text-muted-foreground">★</span>
            {product.rating.toFixed(1)}
          </div>
        </div>
        
        <Link href={`/products/${product.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-1">{product.name}</h3>
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">${product.price.toFixed(2)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
