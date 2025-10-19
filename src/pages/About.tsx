import PromotionalBanner from "@/components/PromotionalBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import aboutShopImg from '@/assets/about-shop.jpg';

const About = () => {
  return (
    <div className="min-h-screen">
      <PromotionalBanner />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-6">About VMPRIME</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are passionate about bringing you the finest collection of luxury timepieces at unbeatable prices. 
            Our commitment to quality and customer satisfaction has made us a trusted name in the watch industry.
          </p>
        </div>
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded with a vision to make luxury timepieces accessible to everyone, VMPRIME has been 
                serving watch enthusiasts since our inception. We understand that a watch is more than just 
                a time-telling device – it's a statement of style, precision, and craftsmanship.
              </p>
              <p>
                Our journey began with a simple belief: everyone deserves to wear a beautiful, high-quality 
                watch without breaking the bank. Today, we curate an extensive collection of premium watches 
                that combine elegance, functionality, and affordability.
              </p>
              <p>
                From classic designs to modern innovations, every timepiece in our collection is carefully 
                selected to meet our strict quality standards and aesthetic excellence.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img
              src={aboutShopImg}
              alt="VMPRIME Watch Shop"
              className="w-full h-80 md:h-96 object-cover rounded-lg shadow-premium"
            />
          </div>
        </div>
        
        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border border-border hover:shadow-premium transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-success text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Quality First</h3>
                <p className="text-muted-foreground">
                  Every watch undergoes rigorous quality checks to ensure you receive only the finest timepieces.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border border-border hover:shadow-premium transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-success text-3xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Affordable Luxury</h3>
                <p className="text-muted-foreground">
                  We believe luxury should be accessible. Our competitive pricing makes premium watches affordable for everyone.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border border-border hover:shadow-premium transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-success text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Customer Satisfaction</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We provide excellent service and support throughout your journey with us.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Mission Section */}
        <div className="bg-gradient-hero text-white rounded-lg p-12 mb-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            To democratize luxury timepieces by offering authentic, high-quality watches at competitive prices, 
            while providing exceptional customer service and building lasting relationships with watch enthusiasts worldwide.
          </p>
        </div>
        
        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-12">Why Choose VMPRIME?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-success text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-foreground">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">Free delivery on orders above ₹1,999 across India</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-success text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-foreground">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">100% secure payment gateway with COD option</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-success text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold text-foreground">Easy to use </h3>
              <p className="text-sm text-muted-foreground">User-friendly interface for seamless shopping experience</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-success text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-foreground">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Quick 3-7 days delivery across India</p>
            </div>
          </div>
        </div>
        
        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Ready to Find Your Perfect Watch?</h2>
          <p className="text-muted-foreground mb-8">
            Explore our collection or get in touch with our team for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/shop" 
              className="bg-success hover:bg-success/90 text-success-foreground px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Browse Collection
            </a>
            <a 
              href="/contact" 
              className="border border-border hover:bg-secondary text-foreground px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;