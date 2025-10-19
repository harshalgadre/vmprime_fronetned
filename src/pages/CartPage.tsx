import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromotionalBanner from "@/components/PromotionalBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, colorName: string, newQuantity: number) => {
    const item = cart.find(
      item => item.product._id === productId && item.color.name === colorName
    );
    
    if (item) {
      updateQuantity(item.product, item.color, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, colorName: string) => {
    const item = cart.find(
      item => item.product._id === productId && item.color.name === colorName
    );
    
    if (item) {
      removeFromCart(item.product, item.color);
    }
  };

  const subtotal = cart.reduce(
    (total, item) => total + (item.product.price * item.quantity),
    0
  );

  const discount = 0; // For now, no discount logic
  const shipping = subtotal > 1999 ? 0 : 100; // Free shipping over ₹1999
  const total = subtotal - discount + shipping;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen">
        <PromotionalBanner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PromotionalBanner />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={`${item.product._id}-${item.color.name}`} className="border rounded-lg p-4 flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-muted-foreground text-sm">Color: {item.color.name}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.product._id!, item.color.name)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.product._id!, item.color.name, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.product._id!, item.color.name, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="font-semibold">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="flex-grow"
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={() => {
                  // Clear cart logic could be added here if needed
                  navigate("/checkout");
                }}
                className="flex-grow bg-success hover:bg-success/90 text-success-foreground"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline">Apply</Button>
              </div>
            </div>
            
            <Button 
              onClick={handleCheckout}
              className="w-full bg-success hover:bg-success/90 text-success-foreground py-6 text-lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;