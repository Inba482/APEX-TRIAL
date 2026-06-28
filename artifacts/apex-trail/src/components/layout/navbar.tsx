import { Link, useLocation } from "wouter";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCart, Menu, Mountain, Heart } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store/wishlist";

export function Navbar() {
  const [location] = useLocation();
  const totalItems = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/products", label: "Gear" },
    { href: "/categories", label: "Disciplines" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative saffron-border-top">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Mountain className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -inset-1 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
            <span className="font-bold text-lg tracking-widest text-foreground uppercase">
              Apex Trail
            </span>
          </Link>

          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${
                  location.startsWith(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    location.startsWith(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {wishlistCount > 0 && (
            <Link href="/products" className="relative p-2.5 text-muted-foreground hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-accent text-[9px] font-bold text-white flex items-center justify-center">
                {wishlistCount}
              </span>
            </Link>
          )}

          <Link href="/cart" className="relative p-2.5 text-muted-foreground hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="ml-1">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-background border-border">
              <div className="flex flex-col gap-8 py-8">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
                  <Mountain className="h-6 w-6 text-primary" />
                  <span className="font-bold tracking-widest uppercase">Apex Trail</span>
                </Link>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                        location.startsWith(link.href)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <Link
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-4"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart {totalItems > 0 && <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold">{totalItems}</span>}
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
