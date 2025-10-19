import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { Product } from '@/types/product';
import { useEffect, useState } from "react";
import { getProducts } from "@/services/api";

const WatchCollections = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleViewAll = (category: string) => {
    navigate(`/shop?category=${category}`);
  };

  const WatchSection = ({ title, category }: { 
    title: string; 
    category: string;
  }) => {
    // Filter products by category
    const filteredProducts = products.filter(product => 
      product.category?.toLowerCase() === category.toLowerCase()
    );

    // If no products in this category, don't show the section
    if (filteredProducts.length === 0) return null;

    return (
      <section className="py-12 bg-[#F7F7F7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-[#667085]">Discover our handpicked collection of premium watches from VMPRIME</p>
          </div>
          <div className="relative -mx-4 px-4">
            <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory">
              {filteredProducts.map((product) => (
                <div key={product.id || product._id} className="snap-start">
                  <ProductCard 
                    product={{
                      id: product.id || product._id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                      category: product.category,
                      gender: product.gender,
                      description: product.description,
                      badge: product.badge,
                      rating: product.rating,
                      reviews: product.reviews,
                      type: product.type || product.features?.[0] || "TIMEPIECE",
                      features: product.features,
                      colors: product.colors
                    }}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              className="min-w-[200px] border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB]"
              onClick={() => handleViewAll(category)}
            >
              View All {title} Watches
            </Button>
          </div>
        </div>
      </section>
    );
  };

  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p>Loading watches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Error loading watches: {error}</p>
        <Button onClick={fetchProducts} className="mt-4">Retry</Button>
      </div>
    );
  }

  // Get unique categories for men and women sections
  const menProducts = products.filter(product => 
    product.gender?.toLowerCase() === 'men' || product.category?.toLowerCase() === 'men'
  );
  
  const womenProducts = products.filter(product => 
    product.gender?.toLowerCase() === 'women' || product.category?.toLowerCase() === 'women'
  );

  return (
    <div>
      {/* Featured Timepieces Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Timepieces</h2>
            <p className="text-gray-600">Discover our handpicked collection of premium watches from VMPRIME</p>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto gap-6 pb-6 -mx-4 px-4 hide-scrollbar">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id || product._id} 
                  product={{
                    id: product.id || product._id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image,
                    category: product.category,
                    gender: product.gender,
                    description: product.description,
                    badge: product.badge,
                    rating: product.rating,
                    reviews: product.reviews,
                    type: product.type || product.features?.[0] || "TIMEPIECE",
                    features: product.features,
                    colors: product.colors
                  }}
                  variant="compact"
                />
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              className="min-w-[200px]"
              onClick={() => navigate('/shop')}
            >
              View All Watches
            </Button>
          </div>
        </div>
      </section>

      {/* Men's Collection */}
      {menProducts.length > 0 && (
        <WatchSection 
          title="Men's Collection" 
          category="men"
        />
      )}

      {/* Women's Collection */}
      {womenProducts.length > 0 && (
        <WatchSection 
          title="Women's Collection" 
          category="women"
        />
      )}
    </div>
  );
};

export default WatchCollections;