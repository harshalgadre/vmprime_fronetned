import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import heroImage from "@/assets/hero-watches.jpg";
import { Product } from "@/types/product";
import { getProducts } from "@/services/api";

const HeroSection = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const products: Product[] = await getProducts();
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(products.map(product => product.category).filter(Boolean))
      ).slice(0, 4); // Limit to 4 categories
      
      setCategories(uniqueCategories as string[]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to default categories
      setCategories(["Luxury", "Sports", "Digital", "Classic"]);
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          Festive Season Sale
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-2 font-medium">
          BY VMPRIME
        </p>
        
        <p className="text-2xl md:text-3xl font-bold text-white mb-8">
          DISCOUNT UPTO <span className="text-success">40% OFF</span>
        </p>
        
        <a 
          href="/shop"
          className="bg-success hover:bg-success/90 text-success-foreground px-12 py-6 text-xl font-semibold rounded-full shadow-premium transition-all duration-300 hover:scale-105 inline-block"
        >
          SHOP NOW
        </a>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-1/2 mx-auto"></div>
              </div>
            ))
          ) : (
            categories.map((category, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <h3 className="text-white font-semibold text-lg mb-1">{category} Watches</h3>
                <p className="text-white/80 text-sm">Shop Collection</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;