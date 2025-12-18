const welcomeTemplate = (name) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #ff9900; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to ZentroMall!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <h2>Hi ${name},</h2>
          <p>We're thrilled to have you on board! You can now explore thousands of products at the best prices.</p>
          <p>As a welcome gift, use code <strong>WELCOME20</strong> for 20% off your first order!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000" style="background-color: #232f3e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Shopping</a>
          </div>
          <p>Happy Shopping,<br>The ZentroMall Team</p>
        </div>
        <div style="text-align: center; padding: 10px; font-size: 12px; color: #666;">
          &copy; ${new Date().getFullYear()} ZentroMall. All rights reserved.
        </div>
      </div>
    `;
};

const orderConfirmationTemplate = (order) => {
    const itemsList = order.orderItems.map(item => `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between;">
        <span>${item.name} x ${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `).join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #232f3e; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <h2>Hi ${order.user.name},</h2>
          <p>Thanks for your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong>. We're getting it ready!</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            ${itemsList}
            <div style="border-top: 2px solid #ddd; margin-top: 10px; padding-top: 10px; font-weight: bold; display: flex; justify-content: space-between;">
              <span>Total</span>
              <span>$${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
  
          <p>We'll notify you when it ships.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/orders/${order._id}" style="background-color: #ff9900; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order</a>
          </div>
        </div>
        <div style="text-align: center; padding: 10px; font-size: 12px; color: #666;">
          &copy; ${new Date().getFullYear()} ZentroMall. All rights reserved.
        </div>
      </div>
    `;
};

module.exports = { welcomeTemplate, orderConfirmationTemplate };
