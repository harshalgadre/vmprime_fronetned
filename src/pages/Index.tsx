import PromotionalBanner from "@/components/PromotionalBanner";
import PromotionalBanners from "@/components/PromotionalBanners";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WatchCollections from "@/components/WatchCollections";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import heroWatches from '@/assets/hero-watches.jpg';
import maleAnalog from '@/assets/male-analo.jpg';
import femaleAnalog from '@/assets/women-analo.jpg';

const Index = () => {
  return (
    <div className="min-h-screen">
      <PromotionalBanner />
      <Header />
      <HeroSection />
      
      {/* Promotional Banners */}
      <div className="container mx-auto px-4">
        <PromotionalBanners />
      </div>

      {/* Shop by Gender */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Categories</h2>
            <p className="text-gray-600">Browse our curated selections for men and women</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a href="/shop?gender=Men" className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-gray-100 overflow-hidden">
                <img src={maleAnalog} alt="Men's Analog Watch" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">Men's Analog Watch</h3>
              </div>
            </a>

            <a href="/shop?gender=Women" className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-gray-100 overflow-hidden">
                <img src={femaleAnalog} alt="Women's Analog Watch" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">Women's Analog Watch</h3>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">On orders above ₹1999</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1 Year Warranty</h3>
              <p className="text-muted-foreground">Manufacturing guarantee</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">30-day return policy</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Authentic timepieces</p>
            </div>
          </div>
        </div>
      </section>
      
      <WatchCollections />
      <Footer />
    </div>
  );
};

export default Index;