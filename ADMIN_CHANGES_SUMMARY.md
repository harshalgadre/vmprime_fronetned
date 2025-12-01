# Admin Panel Changes for COD-Only Implementation

## Required Changes in OrdersPage.tsx

### 1. Update Order Interface (around line 53)
```typescript
// Change from:
paymentStatus?: 'pending' | 'verified' | 'failed';
transactionId?: string;
paymentOption?: 'cod' | 'full';

// To:
paymentStatus?: 'pending' | 'confirmed' | 'failed';
paymentOption?: 'cod';
```

### 2. Update State Variables (around line 66)
```typescript
// Change from:
const [transactionId, setTransactionId] = useState("");
const [verificationNotes, setVerificationNotes] = useState("");
const [initialPayment] = useState(200); // Fixed initial payment amount

// To:
const [verificationNotes, setVerificationNotes] = useState("");
```

### 3. Update handleVerifyPayment Function (around line 135)
```typescript
// Change from:
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
      const errorText = await response.text();
      throw new Error(`Failed to verify payment: ${response.status} - ${errorText}`);
    }
    
    // Refresh the orders list
    fetchOrders();
    
    // Close the dialog
    setSelectedOrder(null);
    
    // Reset form fields
    setTransactionId('');
    setVerificationNotes('');
    
    // Show success message
    alert("Payment verified successfully!");
  } catch (error: any) {
    console.error("Failed to verify payment:", error);
    alert("Failed to verify payment: " + error.message);
  }
};

// To:
const handleConfirmOrder = async (orderId: string) => {
  try {
    // Update the order with payment confirmation status
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
        paymentStatus: 'confirmed',
        verificationNotes: verificationNotes
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to confirm order: ${response.status} - ${errorText}`);
    }
    
    // Refresh the orders list
    fetchOrders();
    
    // Close the dialog
    setSelectedOrder(null);
    
    // Reset form fields
    setVerificationNotes('');
    
    // Show success message
    alert("Order confirmed successfully!");
  } catch (error: any) {
    console.error("Failed to confirm order:", error);
    alert("Failed to confirm order: " + error.message);
  }
};
```

### 4. Replace Payment Request Function with Order Confirmation Function
Remove the `sendPaymentRequest` function and replace it with:

```typescript
// Function to send order confirmation message to customer (COD-focused)
const sendOrderConfirmation = (order: Order) => {
  try {
    const trackingUrl = `${window.location.origin}/orders/${order._id}`;
    
    const message = `*Order Confirmation*
` +
      `Order ID: #${order._id.substring(0, 8)}
` +
      `Customer: ${order.customerName}

` +
      `*Order Details:*
` +
      order.items.map(item => 
        `${item.name}${item.color ? ` (${item.color.name})` : ''} - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
      ).join('\n') +
      `

*Payment Details:*
` +
      `Total Amount: ₹${order.total.toLocaleString('en-IN')}
` +
      `Payment Method: Cash on Delivery
` +
      `Please pay the full amount on delivery.

` +
      `*Order Tracking:*
` +
      `You can track your order status at: ${trackingUrl}

` +
      `Our team will contact you shortly to confirm delivery details.

` +
      `Thank you for shopping with us!`;
    
    // Send to customer's WhatsApp
    const cleanPhoneNumber = order.customerPhone.replace(/\D/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanPhoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  } catch (error) {
    console.error("Failed to send order confirmation:", error);
    alert("Failed to send order confirmation. Please try again.");
  }
};
```

### 5. Update UI Elements in the Order Details Dialog
In the order details section (around line 610):

```jsx
// Change from:
<div>
  <div className="text-sm text-muted-foreground">Payment Method</div>
  <Badge variant="outline">
    {selectedOrder.paymentOption === 'full' ? 'Full Payment Online' : '₹200 Initial Payment (COD)'}
  </Badge>
</div>

// To:
<div>
  <div className="text-sm text-muted-foreground">Payment Method</div>
  <Badge variant="outline">
    Cash on Delivery
  </Badge>
</div>
```

And for payment status display (around line 617):

```jsx
// Change from:
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

// To:
<div>
  <div className="text-sm text-muted-foreground">Payment Status</div>
  <Badge 
    variant="outline" 
    className={
      selectedOrder.paymentStatus === 'confirmed' ? "bg-green-50 text-green-600 border-green-300" :
      selectedOrder.paymentStatus === 'pending' ? "bg-yellow-50 text-yellow-600 border-yellow-300" :
      "bg-red-50 text-red-600 border-red-300"
    }
  >
    <CreditCard className="w-3 h-3 mr-1" />
    {selectedOrder.paymentStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
  </Badge>
</div>
```

### 6. Update Communication Section (around line 650)
Replace the entire communication section with:

```jsx
{/* Communication Section */}
<div className="md:col-span-2">
  <Alert className="bg-blue-50 border-blue-200">
    <Send className="h-4 w-4 text-blue-600" />
    <AlertDescription className="text-blue-800">
      <h3 className="font-semibold mb-2">Customer Communication</h3>
      <p className="mb-3">Send messages to the customer about their order.</p>
      
      <div className="flex flex-wrap gap-2">
        {selectedOrder.paymentStatus !== 'confirmed' && (
          <Button 
            onClick={() => sendOrderConfirmation(selectedOrder)}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Send Order Confirmation
          </Button>
        )}
        
        {/* Show Send Status Update for all orders */}
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
```

### 7. Update Payment Confirmation Section (around line 692)
Replace the payment verification section with:

```jsx
{/* Order Confirmation Section (COD-focused) */}
{selectedOrder.paymentStatus !== 'confirmed' && (
  <div className="md:col-span-2">
    <Alert className="bg-yellow-50 border-yellow-200">
      <CreditCard className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <h3 className="font-semibold mb-2">Confirm Order</h3>
        <p className="mb-3">
          Please confirm this COD order before processing.
        </p>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="verificationNotes">Confirmation Notes</Label>
            <Textarea
              id="verificationNotes"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="Add any notes about the order confirmation"
              className="min-h-[80px]"
            />
          </div>
          
          <Button 
            onClick={() => handleConfirmOrder(selectedOrder._id)}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirm Order
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  </div>
)}
```

### 8. Update Button Disabled Logic (around line 748)
Update the disabled logic for status update buttons:

```jsx
// Change conditions like:
disabled={order.status === 'processing' || order.status === 'shipped' || order.status === 'completed' || order.status === 'cancelled' || (order.paymentOption === 'cod' && selectedOrder?.paymentStatus !== 'verified')}

// To:
disabled={order.status === 'processing' || order.status === 'shipped' || order.status === 'completed' || order.status === 'cancelled' || selectedOrder?.paymentStatus !== 'confirmed'}
```

These changes will:
1. Remove transaction tracking
2. Make the admin panel COD-focused
3. Simplify the order confirmation process
4. Remove all references to online payment options