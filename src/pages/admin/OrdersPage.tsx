import { useState, useEffect } from "react";
import { Clock, Package, CheckCircle, XCircle, Truck, IndianRupee, CreditCard, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getOrders, updateOrderStatus } from "@/services/api";

interface OrderItem {
  productId: string;
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
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'verified' | 'failed';
  transactionId?: string;
  verificationNotes?: string;
  paymentOption?: 'cod' | 'full';
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [transactionId, setTransactionId] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [initialPayment] = useState(200); // Fixed initial payment amount

  const orderStatuses = [
    {
      label: "All Orders",
      value: "all",
      count: 0,
    },
    {
      label: "Pending",
      value: "pending",
      count: 0,
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    },
    {
      label: "Processing",
      value: "processing",
      count: 0,
      icon: <Package className="w-4 h-4 text-blue-500" />,
    },
    {
      label: "Shipped",
      value: "shipped",
      count: 0,
      icon: <Truck className="w-4 h-4 text-indigo-500" />,
    },
    {
      label: "Completed",
      value: "completed",
      count: 0,
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
    },
    {
      label: "Cancelled",
      value: "cancelled",
      count: 0,
      icon: <XCircle className="w-4 h-4 text-red-500" />,
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      // Refresh the orders list
      fetchOrders();
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status: " + error.message);
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    try {
      // Update the order with payment verification status
      // We need to make a direct fetch call here since this is a special endpoint
      // In production, we'll use relative path; in development, we'll use the full URL
      const baseUrl = import.meta.env.DEV 
        ? 'https://vmptime-backend.onrender.com/api' 
        : '/api';
      
      const response = await fetch(`${baseUrl}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin-secret-key'
        },
        body: JSON.stringify({ 
          paymentStatus: 'verified',
          transactionId: transactionId,
          verificationNotes: verificationNotes
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }
      
      // Refresh the orders list
      fetchOrders();
      
      // Close the dialog
      setSelectedOrder(null);
      
      // Show success message
      alert("Payment verified successfully!");
    } catch (error: any) {
      console.error("Failed to verify payment:", error);
      alert("Failed to verify payment: " + error.message);
    }
  };

  // Function to send payment request message to customer (for COD orders)
  const sendPaymentRequest = (order: Order) => {
    try {
      // Only for COD orders
      if (order.paymentOption !== 'cod') {
        alert("This option is only available for COD orders.");
        return;
      }
      
      const remainingAmount = order.total - initialPayment;
      const upiId = "yourbusiness@upi"; // Your UPI ID
      
      const message = `*Order Payment Request*\n\n` +
        `Order ID: #${order._id.substring(0, 8)}\n` +
        `Customer: ${order.customerName}\n\n` +
        `*Order Details:*\n` +
        order.items.map(item => 
          `${item.name}${item.color ? ` (${item.color.name})` : ''} - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
        ).join('\n') +
        `\n\n*Payment Details:*\n` +
        `Total Amount: ₹${order.total.toLocaleString('en-IN')}\n` +
        `Initial Payment: ₹${initialPayment.toLocaleString('en-IN')}\n` +
        `Remaining Amount (Pay on Delivery): ₹${remainingAmount.toLocaleString('en-IN')}\n\n` +
        `*UPI Payment Details:*\n` +
        `UPI ID: ${upiId}\n` +
        `Payment Link: upi://pay?pa=${upiId}&pn=NTRO.IO Store&am=${initialPayment}&cu=INR&tn=Order ${order._id.substring(0, 8)} - Initial Payment\n\n` +
        `Please complete the initial payment of ₹${initialPayment} using the UPI link above.\n` +
        `After payment, please notify us with your transaction ID.\n\n` +
        `Thank you for your order!`;
      
      // Send to customer's WhatsApp
      const cleanPhoneNumber = order.customerPhone.replace(/\D/g, '');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanPhoneNumber}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Failed to send payment request:", error);
      alert("Failed to send payment request. Please try again.");
    }
  };

  // Function to send payment confirmation message to customer
  const sendPaymentConfirmation = (order: Order) => {
    try {
      const remainingAmount = order.total - (order.paymentOption === 'cod' ? initialPayment : 0);
      const trackingUrl = `${window.location.origin}/orders/${order._id}`;
      
      const message = `*${order.paymentOption === 'full' ? 'Payment Confirmed & ' : ''}Order Placed Successfully!*\n\n` +
        `Order ID: #${order._id.substring(0, 8)}\n` +
        `Customer: ${order.customerName}\n\n` +
        `*Order Details:*\n` +
        order.items.map(item => 
          `${item.name}${item.color ? ` (${item.color.name})` : ''} - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
        ).join('\n') +
        `\n\n*Payment Details:*\n` +
        `Total Amount: ₹${order.total.toLocaleString('en-IN')}\n` +
        (order.paymentOption === 'cod' ? 
          `Initial Payment Received: ₹${initialPayment.toLocaleString('en-IN')}\n` +
          `Remaining Amount (Pay on Delivery): ₹${remainingAmount.toLocaleString('en-IN')}\n\n` :
          `Full Payment Received: ₹${order.total.toLocaleString('en-IN')}\n\n`) +
        `*Order Tracking:*\n` +
        `You can track your order status at: ${trackingUrl}\n\n` +
        `Our team will update you on the order progress.\n\n` +
        `Thank you for shopping with us!`;
      
      // Send to customer's WhatsApp
      const cleanPhoneNumber = order.customerPhone.replace(/\D/g, '');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanPhoneNumber}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Failed to send payment confirmation:", error);
      alert("Failed to send payment confirmation. Please try again.");
    }
  };

  // Function to send order status update to customer
  const sendStatusUpdate = (order: Order) => {
    try {
      const statusText = {
        'pending': 'Order Placed',
        'processing': 'Order Processing',
        'shipped': 'Order Shipped',
        'completed': 'Order Delivered',
        'cancelled': 'Order Cancelled'
      }[order.status];
      
      const statusDescription = {
        'pending': 'We have received your order and will process it shortly.',
        'processing': 'Your order is being processed and prepared for shipping.',
        'shipped': 'Your order has been shipped and is on its way to you.',
        'completed': 'Your order has been successfully delivered. Thank you for shopping with us!',
        'cancelled': 'Your order has been cancelled as per your request.'
      }[order.status];
      
      const trackingUrl = `${window.location.origin}/orders/${order._id}`;
      
      const message = `*Order Status Update*\n\n` +
        `Order ID: #${order._id.substring(0, 8)}\n` +
        `Customer: ${order.customerName}\n\n` +
        `*Status: ${statusText}*\n` +
        `${statusDescription}\n\n` +
        `*Order Tracking:*\n` +
        `You can track your order status at: ${trackingUrl}\n\n` +
        `Thank you for shopping with us!`;
      
      // Send to customer's WhatsApp
      const cleanPhoneNumber = order.customerPhone.replace(/\D/g, '');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanPhoneNumber}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Failed to send status update:", error);
      alert("Failed to send status update. Please try again.");
    }
  };

  // Update counts for each status
  useEffect(() => {
    if (orders.length > 0) {
      const statusCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      };
      
      // Update the orderStatuses array with actual counts
      orderStatuses[0].count = statusCounts.all;
      orderStatuses[1].count = statusCounts.pending;
      orderStatuses[2].count = statusCounts.processing;
      orderStatuses[3].count = statusCounts.shipped;
      orderStatuses[4].count = statusCounts.completed;
      orderStatuses[5].count = statusCounts.cancelled;
    }
  }, [orders]);

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={fetchOrders} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          {orderStatuses.map((status) => (
            <TabsTrigger
              key={status.value}
              value={status.value}
              className="flex items-center gap-2"
            >
              {status.icon}
              {status.label}
              <Badge variant="secondary">{status.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="border rounded-lg">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-foreground mb-2">No Orders Found</h2>
              <p className="text-muted-foreground">
                {activeTab === "all" 
                  ? "There are no orders yet." 
                  : `There are no ${activeTab} orders.`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">#{order._id.substring(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={order.items[0]?.image || "/placeholder.svg"}
                          alt={order.items[0]?.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">
                            {order.items[0]?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Quantity: {order.items[0]?.quantity}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>₹{order.total?.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          order.paymentStatus === 'verified' ? "bg-green-50 text-green-600 border-green-300" :
                          order.paymentStatus === 'pending' ? "bg-yellow-50 text-yellow-600 border-yellow-300" :
                          "bg-red-50 text-red-600 border-red-300"
                        }
                      >
                        <CreditCard className="w-3 h-3 mr-1" />
                        {order.paymentOption === 'full' ? 
                          (order.paymentStatus === 'verified' ? 'Full Paid' : 'Pending') :
                          (order.paymentStatus === 'verified' ? 'Verified' : 'Pending')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          order.status === 'pending' ? "bg-yellow-50 text-yellow-600 border-yellow-300" :
                          order.status === 'processing' ? "bg-blue-50 text-blue-600 border-blue-300" :
                          order.status === 'shipped' ? "bg-indigo-50 text-indigo-600 border-indigo-300" :
                          order.status === 'completed' ? "bg-green-50 text-green-600 border-green-300" :
                          "bg-red-50 text-red-600 border-red-300"
                        }
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedOrder(order)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Order #{order._id.substring(0, 8)}</DialogTitle>
                            <DialogDescription>
                              View order details and update status
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedOrder && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                              <div className="space-y-4">
                                <h3 className="font-semibold">Customer Details</h3>
                                <div className="space-y-2">
                                  <div>
                                    <div className="text-sm text-muted-foreground">Name</div>
                                    <div>{selectedOrder.customerName}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Phone</div>
                                    <div>{selectedOrder.customerPhone}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Email</div>
                                    <div>{selectedOrder.customerEmail}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Address</div>
                                    <div className="max-w-[300px]">
                                      {selectedOrder.deliveryAddress}
                                    </div>
                                  </div>
                                  {selectedOrder.note && (
                                    <div>
                                      <div className="text-sm text-muted-foreground">Note</div>
                                      <div>{selectedOrder.note}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <h3 className="font-semibold">Order Details</h3>
                                <div className="space-y-2">
                                  <div>
                                    <div className="text-sm text-muted-foreground">Product</div>
                                    <div>{selectedOrder.items[0]?.name}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Quantity</div>
                                    <div>{selectedOrder.items[0]?.quantity}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Amount</div>
                                    <div className="flex items-center">
                                      <IndianRupee className="w-4 h-4" />
                                      {selectedOrder.total?.toLocaleString('en-IN')}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Payment Method</div>
                                    <Badge variant="outline">
                                      {selectedOrder.paymentOption === 'full' ? 'Full Payment Online' : '₹200 Initial Payment (COD)'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Payment Status</div>
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        selectedOrder.paymentStatus === 'verified' ? "bg-green-50 text-green-600 border-green-300" :
                                        selectedOrder.paymentStatus === 'pending' ? "bg-yellow-50 text-yellow-600 border-yellow-300" :
                                        "bg-red-50 text-red-600 border-red-300"
                                      }
                                    >
                                      <CreditCard className="w-3 h-3 mr-1" />
                                      {selectedOrder.paymentOption === 'full' ? 
                                        (selectedOrder.paymentStatus === 'verified' ? 'Full Paid' : 'Pending') :
                                        (selectedOrder.paymentStatus === 'verified' ? 'Verified' : 'Pending')}
                                    </Badge>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Order Status</div>
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        selectedOrder.status === 'pending' ? "bg-yellow-50 text-yellow-600 border-yellow-300" :
                                        selectedOrder.status === 'processing' ? "bg-blue-50 text-blue-600 border-blue-300" :
                                        selectedOrder.status === 'shipped' ? "bg-indigo-50 text-indigo-600 border-indigo-300" :
                                        selectedOrder.status === 'completed' ? "bg-green-50 text-green-600 border-green-300" :
                                        "bg-red-50 text-red-600 border-red-300"
                                      }
                                    >
                                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Communication Section */}
                              <div className="md:col-span-2">
                                <Alert className="bg-blue-50 border-blue-200">
                                  <Send className="h-4 w-4 text-blue-600" />
                                  <AlertDescription className="text-blue-800">
                                    <h3 className="font-semibold mb-2">Customer Communication</h3>
                                    <p className="mb-3">Send messages to the customer about their order.</p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                      {selectedOrder.paymentOption === 'cod' && selectedOrder.paymentStatus !== 'verified' && (
                                        <Button 
                                          onClick={() => sendPaymentRequest(selectedOrder)}
                                          variant="outline"
                                          className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                        >
                                          Send Payment Request
                                        </Button>
                                      )}
                                      
                                      {/* Show Send Payment Confirmation only for verified payments */}
                                      {selectedOrder.paymentStatus === 'verified' && (
                                        <Button 
                                          onClick={() => sendPaymentConfirmation(selectedOrder)}
                                          variant="outline"
                                          className="border-green-300 text-green-700 hover:bg-green-100"
                                        >
                                          Send Payment Confirmation
                                        </Button>
                                      )}
                                      
                                      <Button 
                                        onClick={() => sendStatusUpdate(selectedOrder)}
                                        variant="outline"
                                        className="border-purple-300 text-purple-700 hover:bg-purple-100"
                                      >
                                        Send Status Update
                                      </Button>
                                    </div>
                                  </AlertDescription>
                                </Alert>
                              </div>
                              
                              {/* Payment Verification Section (only for COD orders) */}
                              {selectedOrder.paymentOption === 'cod' && selectedOrder.paymentStatus !== 'verified' && (
                                <div className="md:col-span-2">
                                  <Alert className="bg-yellow-50 border-yellow-200">
                                    <CreditCard className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800">
                                      <h3 className="font-semibold mb-2">Verify Payment</h3>
                                      <p className="mb-3">Please verify the initial payment of ₹200 before processing the order.</p>
                                      
                                      <div className="space-y-3">
                                        <div>
                                          <Label htmlFor="transactionId">Transaction ID</Label>
                                          <Input
                                            id="transactionId"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            placeholder="Enter transaction ID"
                                          />
                                        </div>
                                        
                                        <div>
                                          <Label htmlFor="verificationNotes">Verification Notes</Label>
                                          <Textarea
                                            id="verificationNotes"
                                            value={verificationNotes}
                                            onChange={(e) => setVerificationNotes(e.target.value)}
                                            placeholder="Add any notes about the payment verification"
                                            className="min-h-[80px]"
                                          />
                                        </div>
                                        
                                        <Button 
                                          onClick={() => handleVerifyPayment(selectedOrder._id)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          Mark Payment as Verified
                                        </Button>
                                      </div>
                                    </AlertDescription>
                                  </Alert>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="mt-6">
                            <h3 className="font-semibold mb-2">Update Status</h3>
                            <div className="flex gap-2 flex-wrap">
                              <Button 
                                variant="outline" 
                                className="gap-2"
                                onClick={() => handleUpdateStatus(order._id, 'processing')}
                                disabled={order.status === 'processing' || order.status === 'shipped' || order.status === 'completed' || order.status === 'cancelled' || (order.paymentOption === 'cod' && selectedOrder?.paymentStatus !== 'verified')}
                              >
                                <Package className="w-4 h-4" />
                                Mark as Processing
                              </Button>
                              <Button 
                                variant="outline" 
                                className="gap-2"
                                onClick={() => handleUpdateStatus(order._id, 'shipped')}
                                disabled={order.status === 'shipped' || order.status === 'completed' || order.status === 'cancelled' || (order.paymentOption === 'cod' && selectedOrder?.paymentStatus !== 'verified')}
                              >
                                <Truck className="w-4 h-4" />
                                Mark as Shipped
                              </Button>
                              <Button 
                                variant="outline" 
                                className="gap-2"
                                onClick={() => handleUpdateStatus(order._id, 'completed')}
                                disabled={order.status === 'completed' || order.status === 'cancelled' || (order.paymentOption === 'cod' && selectedOrder?.paymentStatus !== 'verified')}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Mark as Delivered
                              </Button>
                              <Button 
                                variant="outline" 
                                className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                                disabled={order.status === 'completed' || order.status === 'cancelled'}
                              >
                                <XCircle className="w-4 h-4" />
                                Cancel Order
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;