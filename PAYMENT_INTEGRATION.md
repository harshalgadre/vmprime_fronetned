# Payment Integration Guide

This document explains how to integrate payment processing into the NTRO.IO e-commerce platform.

## Overview

The current backend is designed to support payment integration. When a user places an order, the system creates an order record in the database. To complete the payment flow, you need to integrate with a payment gateway.

## Recommended Payment Gateways

1. **Razorpay** (India-focused)
2. **Stripe** (Global)
3. **PayPal** (Global)
4. **Paytm** (India)

## Integration Approach

### 1. Backend Modifications

Add a payment route in `backend/routes/orders.js`:

```javascript
// Add this to the imports
const crypto = require('crypto');

// Add payment routes
router.post('/:id/payment', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Here you would integrate with your payment gateway
    // This is a simplified example using a hypothetical payment service
    const paymentData = {
      amount: order.total * 100, // Convert to smallest currency unit
      currency: 'INR',
      orderId: order._id,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone
      }
    };
    
    // Example with Razorpay
    // const razorpay = require('razorpay');
    // const instance = new razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET
    // });
    // 
    // const options = {
    //   amount: paymentData.amount,
    //   currency: paymentData.currency,
    //   receipt: paymentData.orderId
    // };
    // 
    // const paymentOrder = await instance.orders.create(options);
    // 
    // res.json({
    //   orderId: paymentOrder.id,
    //   amount: paymentOrder.amount,
    //   currency: paymentOrder.currency
    // });
    
    // For now, returning a mock response
    res.json({
      paymentId: 'mock_payment_' + Date.now(),
      orderId: order._id,
      amount: order.total * 100,
      currency: 'INR'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Payment verification endpoint
router.post('/payment/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    
    // Verify payment (example with Razorpay)
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(orderId + '|' + paymentId)
    //   .digest('hex');
    // 
    // if (expectedSignature === signature) {
    //   // Update order status to paid
    //   await Order.findByIdAndUpdate(orderId, { 
    //     status: 'processing',
    //     paymentId: paymentId
    //   });
    //   
    //   res.json({ success: true });
    // } else {
    //   res.status(400).json({ success: false, message: 'Invalid signature' });
    // }
    
    // For now, just update the order status
    await Order.findByIdAndUpdate(orderId, { 
      status: 'processing',
      paymentId: paymentId
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 2. Frontend Integration

Update the Cart page to handle payment:

```javascript
// Add to the Cart.tsx component
const handlePayment = async () => {
  setIsProcessing(true);
  setOrderError("");
  
  try {
    // First create the order
    const orderData = {
      customerName: customerDetails.fullName,
      customerPhone: customerDetails.phone,
      customerEmail: customerDetails.email,
      deliveryAddress: customerDetails.address,
      note: customerDetails.note,
      items: [
        // Add actual cart items here
      ],
      subtotal: 6147,
      discount: 614.7,
      total: 5532.3
    };
    
    const orderResult = await createOrder(orderData);
    
    // Then initiate payment
    const paymentResponse = await fetch(`http://localhost:5000/api/orders/${orderResult._id}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const paymentData = await paymentResponse.json();
    
    // Redirect to payment gateway (example with Razorpay)
    // const options = {
    //   key: process.env.RAZORPAY_KEY_ID,
    //   amount: paymentData.amount,
    //   currency: paymentData.currency,
    //   name: 'NTRO.IO Watches',
    //   description: 'Watch Purchase',
    //   order_id: paymentData.orderId,
    //   handler: async function (response) {
    //     // Verify payment
    //     const verifyResponse = await fetch('http://localhost:5000/api/orders/payment/verify', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         orderId: paymentData.orderId,
    //         paymentId: response.razorpay_payment_id,
    //         signature: response.razorpay_signature
    //       })
    //     });
    //     
    //     const verifyResult = await verifyResponse.json();
    //     if (verifyResult.success) {
    //       setOrderSuccess(true);
    //     } else {
    //       setOrderError("Payment verification failed");
    //     }
    //   },
    //   prefill: {
    //     name: customerDetails.fullName,
    //     email: customerDetails.email,
    //     contact: customerDetails.phone
    //   }
    // };
    // 
    // const rzp = new window.Razorpay(options);
    // rzp.open();
    
    // For now, just simulate successful payment
    setOrderSuccess(true);
  } catch (error) {
    setOrderError("Failed to process payment. Please try again.");
    console.error("Payment error:", error);
  } finally {
    setIsProcessing(false);
  }
};
```

### 3. Environment Variables

Add payment gateway credentials to `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ntroio
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Cash on Delivery (COD)

For COD support, you can simply mark the order as confirmed without processing payment:

```javascript
// In the orders route
router.post('/:id/confirm-cod', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'processing',
        paymentMethod: 'cod'
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

## Security Considerations

1. Never expose secret keys in frontend code
2. Always verify payment on the backend
3. Use HTTPS in production
4. Implement proper error handling
5. Add rate limiting to payment endpoints

## Testing

Use the payment gateway's test mode during development:

1. Use test API keys
2. Use test card numbers provided by the payment gateway
3. Test both successful and failed payment scenarios

## Error Handling

Implement proper error handling for:

1. Payment gateway downtime
2. Network issues
3. Insufficient funds
4. Card declined
5. User cancellation

## Webhook Integration

Most payment gateways support webhooks for real-time payment notifications:

```javascript
// Add to server.js
app.post('/api/webhooks/razorpay', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest('hex');
    
    if (expectedSignature === signature) {
      const event = JSON.parse(req.body);
      
      // Handle different event types
      switch (event.event) {
        case 'payment.captured':
          // Update order status
          await Order.findByIdAndUpdate(event.payload.payment.entity.order_id, {
            status: 'processing',
            paymentId: event.payload.payment.entity.id
          });
          break;
          
        case 'payment.failed':
          // Handle failed payment
          await Order.findByIdAndUpdate(event.payload.payment.entity.order_id, {
            status: 'failed'
          });
          break;
      }
      
      res.json({ received: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

This payment integration approach provides a flexible foundation that can be adapted to work with various payment gateways while maintaining security and reliability.