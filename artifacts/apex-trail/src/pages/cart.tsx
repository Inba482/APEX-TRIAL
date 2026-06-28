import { Layout } from "@/components/layout";
import { useCartStore } from "@/lib/store/cart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

export function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCartStore();
  const { toast } = useToast();

  const handleCheckout = () => {
    toast({
      title: "Checkout Initiated",
      description: "This is a demo store. No real payment will be processed.",
    });
    // In a real app, we'd navigate to checkout or open Stripe
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Your pack is empty</h1>
          <p className="text-muted-foreground mb-8">
            You don't have any gear in your cart yet. Time to prep for the next expedition.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/products">Shop Gear</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const subtotal = totalPrice();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-border text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            {items.map((item) => (
              <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-4 border-b border-border">
                <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                  <Link href={`/products/${item.product.id}`} className="shrink-0 w-20 h-20 bg-muted overflow-hidden border border-border">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/products/${item.product.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{item.product.category}</p>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-destructive hover:underline mt-2 flex items-center gap-1 md:hidden"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>

                <div className="text-center font-medium hidden md:block text-primary">
                  {formatPrice(item.product.price)}
                </div>

                <div className="flex items-center justify-between md:justify-center w-full">
                  <span className="md:hidden text-muted-foreground font-medium text-sm">Qty:</span>
                  <div className="flex items-center border border-input rounded-md h-9 w-28">
                    <button 
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="flex-1 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="flex-1 text-center font-medium text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                      className="flex-1 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end">
                  <span className="md:hidden text-muted-foreground font-medium text-sm">Total:</span>
                  <div className="font-bold text-lg text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
                
                <div className="hidden md:flex justify-end col-span-6 mt-[-20px]">
                  <button 
                    onClick={() => removeItem(item.product.id)}
                    className="text-xs text-muted-foreground hover:text-destructive hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={clearCart}>
                Empty Pack
              </Button>
              <Button variant="link" asChild>
                <Link href="/products">Continue Shopping <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-muted p-6 border border-border sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-primary font-medium text-sm uppercase tracking-wider">Free</span>
                  ) : (
                    <span className="text-foreground font-medium">{formatPrice(shipping)}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground italic text-right">
                    Free shipping on orders above ₹8,300
                  </p>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-3xl text-primary">{formatPrice(total)}</span>
                </div>
                
                <Button size="lg" className="w-full text-base font-semibold h-14" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
