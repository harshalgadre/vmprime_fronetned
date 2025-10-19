# Payment Confirmation Logic Fix

## Issue Description

The "Send Payment Confirmation" button logic was incorrect. It was showing the button for all full payment orders regardless of payment verification status, when it should only appear after payment has been verified.

## Corrected Logic

The button should only appear when `selectedOrder.paymentStatus === 'verified'`, which means:
1. For COD orders: After admin verifies the initial ₹200 payment (by adding transaction ID and notes)
2. For Full Payment orders: After admin verifies the full payment (by adding transaction ID and notes)

## Changes Made

1. **Fixed the conditional logic** in [src/pages/admin/OrdersPage.tsx](file:///g:/gadre/watch%20client/frontend/src/pages/admin/OrdersPage.tsx):
   ```typescript
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
   ```

2. **Removed incorrect condition** that was showing the button for all full payment orders

## Workflow

### For COD Orders:
1. Customer places order with COD option
2. Admin sees "Send Payment Request" button
3. Admin sends payment request to customer for ₹200
4. Customer pays ₹200 and notifies admin
5. Admin adds transaction ID and verification notes
6. Admin clicks "Mark Payment as Verified"
7. **Now** the "Send Payment Confirmation" button appears

### For Full Payment Orders:
1. Customer places order and pays full amount
2. Admin receives payment notification
3. Admin adds transaction ID and verification notes
4. Admin clicks "Mark Payment as Verified"
5. **Now** the "Send Payment Confirmation" button appears

## Testing

The fix has been tested by:
1. Running a successful build
2. Verifying the logic change matches the correct workflow

After deploying this fix, the "Send Payment Confirmation" button will only appear after payments have been verified, as intended.