# 🚀 ZentroMall Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env file in `backend/` directory)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zentromall
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:3000

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@zentromall.com

# Optional: Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Optional: Push Notifications (Firebase)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Optional: SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend (.env.local file in `frontend/` directory)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB

### Local MongoDB
```bash
# If MongoDB is installed locally, start it:
mongod
```

### Or use MongoDB Atlas (Cloud)
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update `MONGODB_URI` in backend/.env

## Step 4: Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

**Verify it's working:**
- Open http://localhost:5000/health
- Should return: `{"status":"ok","message":"ZentroMall Backend is running"}`

## Step 5: Start the Frontend Server

Open a **new terminal window** and run:

```bash
cd frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

## Step 6: Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## Troubleshooting

### Network Error / Backend Not Found

**Problem:** Frontend shows "Network Error" when trying to fetch data.

**Solution:**
1. ✅ Make sure backend is running on port 5000
2. ✅ Check `NEXT_PUBLIC_API_URL` in frontend/.env.local
3. ✅ Verify backend health: http://localhost:5000/health
4. ✅ Check CORS settings in backend/server.js

### MongoDB Connection Error

**Problem:** Backend can't connect to MongoDB.

**Solution:**
1. ✅ Make sure MongoDB is running
2. ✅ Check `MONGODB_URI` in backend/.env
3. ✅ Verify MongoDB connection string format
4. ✅ Check firewall/network settings

### Port Already in Use

**Problem:** Error: "Port 5000 is already in use"

**Solution:**
```bash
# Option 1: Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Option 2: Change port in backend/.env
PORT=5001
```

### CORS Errors

**Problem:** Browser shows CORS errors in console.

**Solution:**
- CORS is already configured in backend/server.js
- Make sure `FRONTEND_URL` in backend/.env matches your frontend URL
- Default: `http://localhost:3000`

## Development Tips

### Backend Development
- Use `npm run dev` for auto-reload (nodemon)
- Check logs in terminal for errors
- API endpoints: http://localhost:5000/api/*

### Frontend Development
- Hot reload is enabled by default
- Check browser console for errors
- Network tab shows API requests

### Database
- Use MongoDB Compass to view data
- Seed data scripts available in `backend/seedData.js`

## Testing the Setup

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **API Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Test Products Endpoint:**
   ```bash
   curl http://localhost:5000/api/products
   ```

4. **Test Featured Collections:**
   ```bash
   curl http://localhost:5000/api/products/collections/featured
   ```

## Next Steps

1. ✅ Seed the database with sample data
2. ✅ Create an admin account
3. ✅ Add products
4. ✅ Test the checkout flow
5. ✅ Configure payment gateways (optional)

## Need Help?

- Check `TROUBLESHOOTING_NETWORK_ERROR.md` for detailed error solutions
- Review backend logs for specific error messages
- Check frontend browser console for client-side errors

