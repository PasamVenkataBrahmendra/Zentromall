# 🔧 Registration Troubleshooting Guide

## Issue: "Registration failed" Error

### Common Causes & Solutions

#### 1. Backend Server Not Running
**Symptom:** "Cannot connect to server" or "Network Error"

**Solution:**
```bash
cd backend
npm run dev
```

Verify backend is running:
- Open: http://localhost:5000/health
- Should return: `{"status":"ok","message":"ZentroMall Backend is running"}`

#### 2. Port 5000 Already in Use
**Symptom:** Error: "EADDRINUSE: address already in use :::5000"

**Solution (Windows):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

**Solution (Mac/Linux):**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Alternative:** Change port in `backend/.env`:
```env
PORT=5001
```
Then update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

#### 3. MongoDB Not Connected
**Symptom:** "Server error" or database connection timeout

**Solution:**
1. Make sure MongoDB is running
2. Check `MONGODB_URI` in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/zentromall
   ```
3. For MongoDB Atlas, use connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zentromall
   ```

#### 4. User Already Exists
**Symptom:** "User already exists" error

**Solution:**
- Use a different email address
- Or login with existing account at `/login`

#### 5. Missing Environment Variables
**Required in `backend/.env`:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

#### 6. CORS Issues
**Symptom:** CORS error in browser console

**Solution:**
- CORS is configured in `backend/server.js`
- Make sure `FRONTEND_URL` matches your frontend URL
- Default: `http://localhost:3000`

#### 7. Email Service Error (Non-Critical)
**Note:** Email sending failures won't block registration. Registration will succeed even if welcome email fails.

## Testing Registration

### Test Backend Endpoint Directly

```bash
# Using curl
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Expected Response (Success):
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "customer",
  "token": "jwt_token_here"
}
```

### Expected Response (User Exists):
```json
{
  "message": "User already exists"
}
```

## Step-by-Step Debugging

1. **Check Backend Health:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Check API Health:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check Registration Route:**
   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

5. **Check Backend Logs:**
   - Look at terminal where backend is running
   - Check for error messages
   - Look for database connection errors

## Quick Fix Checklist

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] MongoDB is running and accessible
- [ ] `backend/.env` file exists with correct values
- [ ] `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- [ ] Port 5000 is not blocked by firewall
- [ ] No other process is using port 5000
- [ ] CORS is properly configured
- [ ] Database connection is working

## Still Having Issues?

1. **Check Backend Terminal:**
   - Look for error messages
   - Check if server started successfully
   - Verify MongoDB connection

2. **Check Frontend Console:**
   - Open browser DevTools
   - Look for network errors
   - Check for CORS errors

3. **Verify Routes:**
   - Registration route: `POST /api/users/register`
   - Should be in `backend/routes/authRoutes.js`

4. **Test with Postman/Insomnia:**
   - Test the registration endpoint directly
   - This helps isolate frontend vs backend issues

