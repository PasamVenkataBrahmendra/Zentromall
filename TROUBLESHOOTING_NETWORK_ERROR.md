# 🔧 Troubleshooting Network Error

## Issue
Network Error when calling `/api/products/collections/featured`

## Possible Causes & Solutions

### 1. Backend Server Not Running
**Solution:** Start the backend server
```bash
cd backend
npm install  # If not already done
npm run dev   # or npm start
```

The server should start on `http://localhost:5000`

### 2. Wrong Port Configuration
**Check:**
- Backend is running on port 5000 (default)
- Frontend API base URL is `http://localhost:5000/api`

**Verify in:**
- `frontend/src/utils/api.js` - Check `baseURL`
- `backend/server.js` - Check `PORT` environment variable

### 3. CORS Issues
**Solution:** CORS is now configured in `backend/server.js` to allow:
- Origin: `http://localhost:3000` (or `FRONTEND_URL` env var)
- Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Credentials: true

### 4. Database Connection Issues
**Check:** MongoDB connection
```bash
# Make sure MongoDB is running
# Check backend/config/db.js for connection string
```

### 5. Environment Variables
**Required in backend/.env:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### 6. Route Not Found
**Verify the route exists:**
- Backend route: `GET /api/products/collections/featured`
- Controller: `getFeaturedCollections` in `productController.js`
- Route file: `productRoutes.js` line 20

## Quick Fix Steps

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify Backend is Running:**
   Open browser: `http://localhost:5000/health`
   Should return: `{"status":"ok","message":"ZentroMall Backend is running"}`

3. **Check API Endpoint:**
   Open browser: `http://localhost:5000/api/health`
   Should return API health status

4. **Test the Route:**
   Open browser: `http://localhost:5000/api/products/collections/featured`
   Should return JSON with collections data

5. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Check Browser Console:**
   - Look for CORS errors
   - Check network tab for failed requests
   - Verify request URL is correct

## Fallback Behavior

The frontend is configured to use `FALLBACK_COLLECTIONS` if the API call fails, so the page should still load with sample data even if the backend is down.

## Testing the Connection

You can test the API connection in the browser console:
```javascript
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log('Backend is running:', data))
  .catch(err => console.error('Backend connection failed:', err));
```

## Common Issues

### Issue: "Cannot GET /api/products/collections/featured"
**Solution:** Make sure the route is registered in `server.js`:
```javascript
app.use('/api/products', productRoutes);
```

### Issue: CORS error in browser
**Solution:** The CORS configuration has been updated. Make sure:
- Backend allows your frontend origin
- Frontend URL matches `FRONTEND_URL` env var

### Issue: Database connection timeout
**Solution:** 
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env` is correct
- Check network/firewall settings

