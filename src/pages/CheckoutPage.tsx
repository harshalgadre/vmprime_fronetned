import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromotionalBanner from "@/components/PromotionalBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { initializePayment } from "@/services/paymentService"; // Import payment service
import { createOrder } from "@/services/api";

const CheckoutPage = () => {
  const { cart, clearCart, cartCount } = useCart();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderData, setOrderData] = useState(null); // Store order data for admin communication
  const [paymentOption, setPaymentOption] = useState("cod"); // "cod" or "full"

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    landmark: "",
    orderNotes: ""
  });

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + (item.product.price * item.quantity),
    0
  );

  const shipping = subtotal > 1999 ? 0 : 100; // Free shipping over ₹1999
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsProcessingPayment(true);
      
      // Prepare order data
      const orderData = {
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipCode}`,
        note: formData.orderNotes,
        items: cart.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          color: item.color
        })),
        subtotal: subtotal,
        discount: 0, // For now, no discount logic
        shipping: shipping,
        total: total,
        status: 'pending',
        paymentOption: "cod", // Add payment option to order data
        paymentStatus: 'pending' // Set initial payment status
      };
      
      
      
      // Send order to backend
      const order = await createOrder(orderData);
      
      // Clear the cart after placing order
      clearCart();
      setOrderId(order._id);
      setOrderData(order); // Store order data
      setOrderPlaced(true);
      
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (cartCount === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen">
        <PromotionalBanner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Please add items to your cart before checking out
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen">
        <PromotionalBanner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-success-foreground">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. Our team will contact you shortly with delivery details.
            </p>
            <div className="bg-success/5 border border-success/20 rounded-lg p-6 mb-6 text-left">
              <h2 className="font-semibold text-success mb-2">Order Summary</h2>
              <p className="text-sm">Order ID: #{orderId.substring(0, 8)}</p>
              <p className="text-sm">Total Amount: ₹{total.toLocaleString('en-IN')}</p>
              <p className="text-sm">
                Payment Method: Cash on Delivery
              </p>
              <p className="text-sm mt-2">
                <span className="font-medium">Next Steps:</span>
                <br />
                1. Our team will contact you to confirm your order
                2. Pay the full amount on delivery
                3. Your order will be processed after confirmation
              </p>
              <p className="text-sm">Expected Delivery: 3-7 business days</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/")} 
                variant="outline"
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={() => navigate(`/orders/${orderId}`)} 
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                Track Order
              </Button>
            </div>
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
        <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Billing Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                    <Textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for your order..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Options */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Options</h2>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Cash on Delivery (COD)</div>
                  <div className="text-sm text-muted-foreground mt-1">
                  </div>
                </div>
                <input type="hidden" value="cod" name="paymentOption" />
              </CardContent>
            </Card>
            
            
            
            {/* Order Summary for Mobile */}
            <div className="lg:hidden">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 mb-4">
                    {cart.map((item, index) => (
                      <div key={`${item.product._id}-${item.color.name}`} className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">Color: {item.color.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-medium">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={`${item.product._id}-${item.color.name}`} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">Color: {item.color.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-medium">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-success hover:bg-success/90 text-success-foreground py-6 text-lg"
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? "Processing Order..." : "Place Order"}
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  By placing your order, you agree to our Terms and Conditions
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Place Order Button for Mobile */}
          <div className="lg:hidden">
            <Button 
              type="submit"
              className="w-full bg-success hover:bg-success/90 text-success-foreground py-6 text-lg"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;