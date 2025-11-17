import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Package, CheckCircle, XCircle, Truck, MapPin, IndianRupee } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromotionalBanner from "@/components/PromotionalBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderByTrackingId } from "@/services/api";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: {
    name: string;
    color: string;
  };
}

interface Order {
  _id: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // If no orderId is provided, show error
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }
      const data = await getOrderByTrackingId(orderId);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'completed':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending':
        return 'We have received your order and will process it shortly.';
      case 'processing':
        return 'Your order is being processed and prepared for shipping.';
      case 'shipped':
        return 'Your order has been shipped and is on its way to you.';
      case 'completed':
        return 'Your order has been successfully delivered. Thank you for shopping with us!';
      case 'cancelled':
        return 'Your order has been cancelled as per your request.';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <PromotionalBanner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Tracking Your Order</h1>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen">
        <PromotionalBanner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-2">
              We couldn't find an order with ID: {orderId || 'No ID provided'}
            </p>
            <p className="text-muted-foreground mb-6">
              Please check the order ID and try again, or contact customer support if you continue to experience issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button variant="outline" onClick={() => navigate('/track-order')}>
                Track Another Order
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Order Tracking</h1>
            <p className="text-muted-foreground">
              Track the status of your order #{order?._id?.substring(0, 8)}
            </p>
          </div>
          
          {/* Order Status Timeline */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Status</h2>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
                
                {/* Status items */}
                <div className="space-y-8">
                  {['pending', 'processing', 'shipped', 'completed'].map((status, index) => {
                    const isCompleted = order ? (
                      (order.status === 'processing' && status === 'pending') ||
                      (order.status === 'shipped' && (status === 'pending' || status === 'processing')) ||
                      (order.status === 'completed' && (status === 'pending' || status === 'processing' || status === 'shipped')) ||
                      order.status === status
                    ) : false;
                    
                    const isActive = order ? order.status === status : false;
                    
                    return (
                      <div key={status} className="relative flex items-start">
                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          isCompleted 
                            ? 'bg-success border-success' 
                            : 'bg-background border-gray-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            getStatusIcon(status)
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${
                              isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {getStatusText(status)}
                            </h3>
                            {isActive && (
                              <Badge variant="secondary">Current</Badge>
                            )}
                          </div>
                          
                          {isActive && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {getStatusDescription(status)}
                            </p>
                          )}
                          
                          {order && order.status === 'cancelled' && status === 'cancelled' && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {getStatusDescription('cancelled')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Order ID</div>
                    <div className="font-medium">#{order?._id?.substring(0, 8)}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Order Date</div>
                    <div>{order && formatDate(order.createdAt)}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge 
                      variant="outline" 
                      className={
                        order && order.status === 'pending' ? "bg-yellow-50 text-yellow-600 border-yellow-300" :
                        order && order.status === 'processing' ? "bg-blue-50 text-blue-600 border-blue-300" :
                        order && order.status === 'shipped' ? "bg-indigo-50 text-indigo-600 border-indigo-300" :
                        order && order.status === 'completed' ? "bg-green-50 text-green-600 border-green-300" :
                        "bg-red-50 text-red-600 border-red-300"
                      }
                    >
                      {order && getStatusText(order.status)}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {order && order.total?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Customer Name</div>
                    <div className="font-medium">{order && order.customerName}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Phone Number</div>
                    <div>{order && order.customerPhone}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Delivery Address</div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>{order && order.deliveryAddress}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order && order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.color && (
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.color.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {item.color.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">Qty: {item.quantity}</div>
                      <div className="text-muted-foreground">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{order?.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>{order?.shipping === 0 ? 'FREE' : `₹${order?.shipping?.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>₹{order?.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;