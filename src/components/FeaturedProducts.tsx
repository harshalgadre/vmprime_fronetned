import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FeaturedProducts = () => {
  const mensWatches = [
    {
      id: 1,
      name: "Audemars Piguet Royal Oak",
      brand: "AP PRIME",
      price: 7999,
      originalPrice: 9999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.8,
      reviews: 124,
      sale: true
    },
    {
      id: 2,
      name: "Rolex Submariner AAA",
      price: 9999,
      originalPrice: 12999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.9,
      reviews: 89,
      sale: true
    },
    {
      id: 3,
      name: "G-Shock Sports Edition",
      price: 3999,
      originalPrice: 4999,
      image: "/placeholder.svg",
      category: "Sports",
      rating: 4.7,
      reviews: 156,
      sale: true
    },
    {
      id: 4,
      name: "Omega Speedmaster Pro",
      price: 8999,
      originalPrice: 11999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.8,
      reviews: 67,
      sale: true
    },
    {
      id: 5,
      name: "Tag Heuer Carrera",
      price: 6999,
      originalPrice: 8999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.6,
      reviews: 92,
      sale: true
    }
  ];

  const womensWatches = [
    {
      id: 6,
      name: "Cartier Ballon Bleu",
      price: 5999,
      originalPrice: 7999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.9,
      reviews: 78,
      sale: true
    },
    {
      id: 7,
      name: "Rolex Lady-Datejust",
      price: 8999,
      originalPrice: 11999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.8,
      reviews: 103,
      sale: true
    },
    {
      id: 8,
      name: "Omega Constellation",
      price: 6999,
      originalPrice: 8999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.7,
      reviews: 85,
      sale: true
    },
    {
      id: 9,
      name: "Chanel J12",
      price: 7999,
      originalPrice: 9999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.9,
      reviews: 94,
      sale: true
    },
    {
      id: 10,
      name: "Van Cleef & Arpels",
      price: 9999,
      originalPrice: 12999,
      image: "/placeholder.svg",
      category: "Luxury",
      rating: 4.8,
      reviews: 67,
      sale: true
    }
  ];

  const ProductCard = ({ product }: { product: any }) => (
    <a href={`/products/${product.id}`} className="min-w-[300px] max-w-[300px]">
      <Card className="group hover:shadow-premium transition-all duration-300 overflow-hidden border-0 shadow-elegant h-full">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.sale && (
            <Badge className="absolute top-4 left-4 bg-success text-success-foreground">
              SALE
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{product.category}</Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-3 group-hover:text-success transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
            <Badge variant="outline" className="text-success border-success">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </Badge>
          </div>
          
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            View Details
          </Button>
        </CardContent>
      </Card>
    </a>
  );

  const ProductSection = ({ title, products }: { title: string; products: any[] }) => (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-primary">{title}</h3>
        <a 
          href="/shop" 
          className="text-success hover:text-success/90 font-medium flex items-center gap-2"
        >
          View All
        </a>
      </div>
      
      <div className="relative">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-success/20 scrollbar-track-transparent">
          <div className="flex gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Featured Timepieces</h2>
          <p className="text-lg text-muted-foreground">
            Discover our handpicked collection of premium watches from VMPRIME
          </p>
        </div>

        <ProductSection title="Men's Collection" products={mensWatches} />
        <ProductSection title="Women's Collection" products={womensWatches} />
      </div>
    </section>
  );
};

export default FeaturedProducts;