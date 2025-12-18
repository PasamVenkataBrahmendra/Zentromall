# Deployment Guide

This guide explains how to deploy ZentroMall to free hosting platforms: **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites
1.  **GitHub Account**: Push your code to a GitHub repository.
2.  **MongoDB Atlas Account**: Ensure you have a cloud database set up.
    - **Important**: Go to Network Access in Atlas and whitelist IP `0.0.0.0/0` to allow connections from Render.

## Backend Deployment (Render)
1.  Sign up/Login to [Render](https://render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Select the `backend` directory as the **Root Directory** (if asked, otherwise you might need to configure this in settings later or use a monorepo setup. *Simplest way*: If your repo root is the project root, set Root Directory to `backend`).
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start`
7.  **Environment Variables**:
    - Add `MONGO_URI`: Your MongoDB connection string.
    - Add `JWT_SECRET`: A strong random string.
    - Add `SMTP_HOST`, `SMTP_EMAIL`, `SMTP_PASSWORD`: For email notifications (optional, defaults to logging if omitted).
    - `PORT` is automatically handled by Render (usually 10000), but our code uses `process.env.PORT`.
8.  Click **Create Web Service**.

## Frontend Deployment (Vercel)
1.  Sign up/Login to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset**: Select **Next.js**.
5.  **Root Directory**: Click Edit and select `frontend`.
6.  **Environment Variables**:
    - If you hardcoded the API URL in `src/utils/api.js` to `localhost`, you need to update it.
    - **Best Practice**: Use an environment variable.
        - In `frontend/src/utils/api.js`, change `baseURL` to `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'`.
        - In Vercel, add `NEXT_PUBLIC_API_URL` with your Render Backend URL (e.g., `https://zentromall-backend.onrender.com/api`).
7.  Click **Deploy**.

## Post-Deployment
- Visit your Vercel URL to access the live site.
- Test the flow: Register, Login, Shop, Checkout.
