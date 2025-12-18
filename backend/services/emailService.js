/**
 * Email Service
 * 
 * Sends transactional emails for:
 * - Order confirmations
 * - Order status updates
 * - Delivery notifications
 * - Refund notifications
 */

const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const User = require('../models/User');

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Send Order Confirmation Email
 */
exports.sendOrderConfirmation = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.productId', 'name price image');

    if (!order || !order.user) {
      throw new Error('Order or user not found');
    }

    const user = order.user;
    const itemsHtml = order.items
      .map(
        item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          ${item.productId.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
          ₹${item.productId.price}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
          ₹${item.quantity * item.productId.price}
        </td>
      </tr>
    `
      )
      .join('');

    const estimatedDelivery = order.estimatedDeliveryDate
      ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'TBD';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 5px 5px; }
          .order-details { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #667eea; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total-row { font-weight: bold; font-size: 18px; background: #f0f0f0; }
          .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Your order has been successfully placed!</p>
          </div>

          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Thank you for your order! We're excited to fulfill it. Below are the details of your purchase.</p>

            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">Order Number:</span>
                <span>${order.orderNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                <span>${new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Estimated Delivery:</span>
                <span>${estimatedDelivery}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span style="color: #667eea; font-weight: bold;">${order.orderStatus.toUpperCase()}</span>
              </div>
            </div>

            <h3>Order Items</h3>
            <table>
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="3" style="padding: 10px; text-align: right;">Subtotal:</td>
                  <td style="padding: 10px; text-align: right;">₹${order.subtotal}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right;">Shipping:</td>
                  <td style="padding: 10px; text-align: right;">₹${order.shippingCost}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right;">Tax (18%):</td>
                  <td style="padding: 10px; text-align: right;">₹${order.tax}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; color: green;">Discount:</td>
                  <td style="padding: 10px; text-align: right; color: green;">-₹${order.discount}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                  <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
                  <td style="padding: 10px; text-align: right;">₹${order.total}</td>
                </tr>
              </tbody>
            </table>

            <h3>Shipping Address</h3>
            <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
              <p style="margin: 0;">
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                ${order.shippingAddress.country}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>

            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">Track Your Order</a>

            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              If you have any questions, please reply to this email or contact our support team.
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2024 ZentroMall. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"ZentroMall" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email}`);

    return { success: true };
  } catch (error) {
    console.error('Send order confirmation email error:', error);
    throw error;
  }
};

/**
 * Send Order Status Update Email
 */
exports.sendOrderStatusUpdate = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order || !order.user) {
      throw new Error('Order or user not found');
    }

    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared for shipment.',
      shipped: 'Your order has been shipped!',
      in_transit: 'Your order is on its way to you.',
      out_for_delivery: 'Your order is out for delivery today.',
      delivered: 'Your order has been delivered!',
      cancelled: 'Your order has been cancelled.'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 5px 5px; }
          .status-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .tracking-link { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Update</h1>
          </div>

          <div class="content">
            <p>Hi ${order.user.name},</p>

            <div class="status-box">
              <h3 style="margin-top: 0; color: #667eea;">Order Status: ${status.toUpperCase()}</h3>
              <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
            </div>

            <div>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Updated:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            </div>

            ${order.trackingNumber ? `
            <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin-top: 20px;">
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p><strong>Carrier:</strong> ${order.carrier || 'Standard Delivery'}</p>
              ${order.trackingUrl ? `<p><a href="${order.trackingUrl}" target="_blank">Track Package</a></p>` : ''}
            </div>
            ` : ''}

            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="tracking-link">View Full Order Details</a>

            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              If you have any questions, please reply to this email or contact our support team.
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2024 ZentroMall. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"ZentroMall" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: order.user.email,
      subject: `Order ${status.toUpperCase()} - ${order.orderNumber}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${order.user.email}`);

    return { success: true };
  } catch (error) {
    console.error('Send order status update email error:', error);
    throw error;
  }
};

/**
 * Send Refund Notification Email
 */
exports.sendRefundNotification = async (orderId, refundAmount) => {
  try {
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order || !order.user) {
      throw new Error('Order or user not found');
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 5px 5px; }
          .refund-box { background: white; padding: 20px; border: 2px solid #4caf50; border-radius: 5px; margin: 20px 0; }
          .refund-amount { font-size: 24px; color: #4caf50; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Refund Processed</h1>
          </div>

          <div class="content">
            <p>Hi ${order.user.name},</p>

            <div class="refund-box">
              <p style="margin-top: 0; color: #4caf50;"><strong>Your refund has been processed!</strong></p>
              <p class="refund-amount">₹${refundAmount}</p>
              <p>The refund has been initiated to your original payment method.</p>
            </div>

            <div>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Refund Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
              <p><strong>Expected in Account:</strong> 5-7 business days</p>
            </div>

            <p style="margin-top: 30px; color: #666;">
              If you have any questions about your refund, please contact our support team.
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2024 ZentroMall. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"ZentroMall" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: order.user.email,
      subject: `Refund Processed - ${order.orderNumber}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Refund notification email sent to ${order.user.email}`);

    return { success: true };
  } catch (error) {
    console.error('Send refund notification email error:', error);
    throw error;
  }
};

/**
 * Verify Email Configuration
 */
exports.verifyEmailConfig = async (req, res) => {
  try {
    await transporter.verify();
    res.json({
      success: true,
      message: 'Email service is configured correctly'
    });
  } catch (error) {
    console.error('Email configuration error:', error);
    res.status(500).json({
      success: false,
      error: 'Email service is not configured correctly'
    });
  }
};

module.exports = exports;
