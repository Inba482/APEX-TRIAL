import { Layout } from "@/components/layout";
import { useParams, Link } from "wouter";
import { useGetProduct, useGetRelatedProducts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { Minus, Plus, ShoppingCart, Heart, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id || "0", 10);
  
  const { data: product, isLoading, isError } = useGetProduct(productId, { 
    query: { enabled: !!productId } 
  });
  
  const { data: relatedProducts } = useGetRelatedProducts(productId, {
    query: { enabled: !!productId }
  });

  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleItem(product.id);
      toast({
        title: hasItem(product.id) ? "Removed from wishlist" : "Added to wishlist",
        description: `${product.name} ${hasItem(product.id) ? 'removed from' : 'added to'} your wishlist.`,
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The gear you're looking for doesn't exist or is currently unavailable.</p>
          <Button asChild>
            <Link href="/products">Back to All Gear</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted py-3">
        <div className="container mx-auto px-4 flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/products" className="hover:text-foreground transition-colors">Gear</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href={`/categories/${product.categorySlug}`} className="hover:text-foreground transition-colors">{product.category}</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden bg-muted border border-border">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-20 border-2 ${activeImage === idx ? 'border-primary' : 'border-transparent'} bg-muted overflow-hidden transition-all`}
                  >
                    <img src={img} alt={`${product.name} - view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{product.category}</span>
              <div className="flex items-center gap-1 text-sm font-medium">
                <span className="text-muted-foreground">★</span>
                {product.rating.toFixed(1)} <span className="text-muted-foreground font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="prose prose-sm dark:prose-invert mb-8 max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">{product.shortDescription || product.description.split('\n')[0]}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-input rounded-md h-12 w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="flex-1 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} in stock` : <span className="text-destructive font-medium">Out of stock</span>}
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 h-12 text-base" 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={`h-12 w-12 px-0 shrink-0 ${hasItem(product.id) ? 'border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive' : ''}`}
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`h-5 w-5 ${hasItem(product.id) ? 'fill-destructive' : ''}`} />
                </Button>
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                ))}
              </div>
            )}

            <div className="mt-8 border-t border-border pt-8">
              <h3 className="text-lg font-bold mb-4">Technical Specifications</h3>
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <Table>
                  <TableBody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium w-1/3 text-muted-foreground">{key}</TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No technical specifications available for this product.</p>
              )}
            </div>
            
            <div className="mt-8 border-t border-border pt-8">
              <h3 className="text-lg font-bold mb-4">Product Details</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                {product.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="bg-muted py-16 mt-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Related Gear</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map(related => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
