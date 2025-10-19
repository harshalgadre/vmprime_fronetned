import { Button } from "@/components/ui/button";

const PromotionalBanners = () => {
  return (
    <div className="space-y-8 py-8">
      {/* Top Banner */}
      <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-success to-green-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Festive Season Sale</h2>
            <p className="text-xl mb-4">Up to 40% OFF on Premium Watches</p>
            <Button 
              variant="secondary" 
              className="bg-white text-success hover:bg-gray-100"
              onClick={() => window.location.href = '/shop'}
            >
              Shop Now
            </Button>
          </div>
          <div className="text-5xl font-bold">
            40% <span className="text-2xl">OFF</span>
          </div>
        </div>
      </section>

      {/* Mid Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 p-8">
            <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
            <p className="mb-4">Discover our latest collection</p>
            <Button 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/shop?category=Digital'}
            >
              Explore
            </Button>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-rose-500 to-pink-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 p-8">
            <h3 className="text-2xl font-bold mb-2">Limited Edition</h3>
            <p className="mb-4">Exclusive timepieces for you</p>
            <Button 
              variant="secondary" 
              className="bg-white text-rose-500 hover:bg-gray-100"
              onClick={() => window.location.href = '/shop?badge=Premium'}
            >
              View Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Free Shipping on Orders Above ₹1999</h2>
          <p className="text-xl mb-6">Plus COD Available Across India</p>
          <Button 
            variant="secondary" 
            className="bg-white text-amber-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() => window.location.href = '/shop'}
          >
            Start Shopping
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PromotionalBanners;