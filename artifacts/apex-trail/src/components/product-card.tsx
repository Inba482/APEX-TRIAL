import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { Link } from "wouter";
import { Heart, Star } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);
  const isOnSale = product.originalPrice != null && product.originalPrice > product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-card border border-card-border transition-all duration-300 saffron-glow cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted flex-shrink-0">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={400}
            height={500}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-108"
            style={{ transition: 'transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
          />
        </Link>

        {/* Gradient overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && !isOnSale && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider uppercase">
              Featured
            </span>
          )}
          {isOnSale && (
            <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider uppercase">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
            isWishlisted
              ? "bg-accent/90 text-white opacity-100"
              : "bg-black/40 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-black/60"
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleItem(product.id);
          }}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Stock warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-background/80 backdrop-blur-sm text-xs text-primary font-semibold px-2 py-0.5 rounded-sm">
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/80">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground/60">({product.reviewCount})</span>
          </span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {isOnSale && product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
