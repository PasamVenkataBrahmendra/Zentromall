# ZentroMall Architecture

## Overview
ZentroMall is a full-stack ecommerce application built with a modern JavaScript stack. It consists of a decoupled frontend and backend, communicating via REST APIs.

## Tech Stack
- **Frontend**: Next.js (React)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)

## Directory Structure
```
ZentroMall/
├── backend/            # Node.js + Express Server
│   ├── models/         # Mongoose Schemas (User, Product, Order, etc.)
│   ├── routes/         # API Routes
│   ├── controllers/    # Request Handlers
│   ├── middleware/     # Auth, Error Handling
│   ├── server.js       # Entry Point
│   └── .env            # Environment Variables
├── frontend/           # Next.js Application
│   ├── src/
│   │   ├── app/        # Next.js App Router Pages
│   │   ├── components/ # Reusable UI Components
│   │   └── lib/        # API Clients, Utilities
│   └── public/         # Static Assets
├── ARCHITECTURE.md     # This file
└── README.md           # Project Documentation
```

## Key Features
- **Authentication**: JWT-based auth with role management (Customer, Seller, Admin).
- **Shop with AI**: Rule-based recommendation engine.
- **Admin Panel**: Comprehensive dashboard for managing the platform.
- **Seller Panel**: Dedicated interface for sellers to manage products and orders.

## Data Flow
1.  **Client (Frontend)** sends HTTP requests to the **Server (Backend)**.
2.  **Server** validates requests using **Middleware**.
3.  **Controllers** process business logic and interact with the **Database (MongoDB)** via **Models**.
4.  **Server** responds with JSON data.
