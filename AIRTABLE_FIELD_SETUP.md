# 📊 Airtable Field Setup for Dabiri's Desserts

## 🎯 **Required Fields Setup**

Your Airtable base needs these exact fields to work with the cake form. Follow these steps:

### **Step 1: Open Your Airtable Base**
1. Go to your base: https://airtable.com/appKSEY3UryATp55S/pagtWrrTHwL8IMOeM
2. Make sure you're in the main table view

### **Step 2: Add Required Fields**

Click the "+" button to add these fields in this exact order:

#### **Field 1: Order ID**
- **Field Name**: `Order ID`
- **Field Type**: `Single line text`
- **Description**: Unique identifier for each order

#### **Field 2: Customer Name**
- **Field Name**: `Customer Name`
- **Field Type**: `Single line text`
- **Description**: Full name of the customer

#### **Field 3: Email**
- **Field Name**: `Email`
- **Field Type**: `Email`
- **Description**: Customer's email address

#### **Field 4: Phone**
- **Field Name**: `Phone`
- **Field Type**: `Phone number`
- **Description**: Customer's phone number

#### **Field 5: Pickup Date**
- **Field Name**: `Pickup Date`
- **Field Type**: `Date`
- **Description**: When the order should be ready

#### **Field 6: Order Details**
- **Field Name**: `Order Details`
- **Field Type**: `Long text`
- **Description**: Products and quantities ordered

#### **Field 7: Special Instructions**
- **Field Name**: `Special Instructions`
- **Field Type**: `Long text`
- **Description**: Any special requests or notes

#### **Field 8: Total Price**
- **Field Name**: `Total Price`
- **Field Type**: `Currency`
- **Description**: Total cost of the order

#### **Field 9: Status**
- **Field Name**: `Status`
- **Field Type**: `Single select`
- **Options**:
  - `Pending`
  - `Confirmed`
  - `In Progress`
  - `Completed`
  - `Cancelled`
- **Default**: `Pending`

#### **Field 10: Order Date**
- **Field Name**: `Order Date`
- **Field Type**: `Date`
- **Description**: When the order was placed

### **Step 3: Verify Your Setup**

Your table should look like this:

| Order ID | Customer Name | Email | Phone | Pickup Date | Order Details | Special Instructions | Total Price | Status | Order Date |
|----------|---------------|-------|-------|-------------|---------------|---------------------|-------------|--------|------------|
| DD-123   | John Doe      | john@example.com | 555-1234 | 2024-01-15 | Chocolate Cake x1 | Extra frosting | $25.00 | Pending | 2024-01-10 |

### **Step 4: Test the Integration**

Once you've added all the fields, run:
```bash
npm run test:airtable
```

### **Step 5: Common Issues & Solutions**

#### **Issue: "Invalid permissions"**
- **Solution**: Make sure your personal access token has the right permissions
- **Fix**: Go to https://airtable.com/account and regenerate your token with full access

#### **Issue: "Model not found"**
- **Solution**: Check that all field names match exactly (case-sensitive)
- **Fix**: Rename fields to match the exact names above

#### **Issue: "Field type mismatch"**
- **Solution**: Change field types to match the specifications above
- **Fix**: Click on the field header and change the type

### **Step 6: Field Name Verification**

Make sure your field names are EXACTLY:
- `Order ID` (not "OrderID" or "order_id")
- `Customer Name` (not "CustomerName" or "customer_name")
- `Email` (not "email" or "Email Address")
- `Phone` (not "Phone Number" or "phone_number")
- `Pickup Date` (not "pickup_date" or "PickupDate")
- `Order Details` (not "order_details" or "OrderDetails")
- `Special Instructions` (not "special_instructions" or "SpecialInstructions")
- `Total Price` (not "total_price" or "TotalPrice")
- `Status` (not "status" or "Order Status")
- `Order Date` (not "order_date" or "OrderDate")

### **Step 7: Test with Sample Data**

Add one test record manually:
1. **Order ID**: `DD-TEST-001`
2. **Customer Name**: `Test Customer`
3. **Email**: `test@example.com`
4. **Phone**: `555-1234`
5. **Pickup Date**: `2024-12-01`
6. **Order Details**: `Chocolate Cake x1`
7. **Special Instructions**: `Test order`
8. **Total Price**: `25.00`
9. **Status**: `Pending`
10. **Order Date**: `2024-11-25`

### **Step 8: Verify API Access**

After setting up the fields, the integration should work perfectly! Your cake form will automatically:
- ✅ Add new orders to Airtable
- ✅ Send email confirmations
- ✅ Track order status
- ✅ Calculate pricing correctly

## 🎉 **Benefits of This Setup:**

- **Free forever** - No Google Cloud costs
- **Beautiful interface** - Easy to manage orders
- **Mobile app** - Check orders on your phone
- **Export to CSV** - Download data anytime
- **Search & filter** - Find orders quickly
- **Status tracking** - Update order progress

Once you've added all the fields, your integration will be complete! 🎂✨
