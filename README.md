# AlloReserve – Inventory Reservation Dashboard

AlloReserve is a modern full-stack inventory reservation system built to manage products, warehouses, and stock reservations in real time.

The application focuses on inventory integrity, reservation lifecycle management, concurrency-safe stock handling, responsive SaaS-style UI, and production-ready architecture.

It simulates real-world inventory workflows where multiple users may reserve stock simultaneously while maintaining accurate stock consistency.

---

# Live Demo

Deployed Application:
https://allo-reserve.vercel.app

GitHub Repository:
https://github.com/Saran-SSK/allo-reserve

---

# Core Features

## Real-Time Inventory Management

* Add new inventory products
* Edit existing inventory
* Delete products with confirmation dialogs
* Real-time stock updates
* Search inventory instantly
* Warehouse-specific inventory tracking
* Low-stock monitoring system

---

## Reservation Lifecycle System

The platform supports a complete reservation workflow.

### Reservation Creation

Users can reserve stock quantities from available inventory.

### Reservation Confirmation

Reservations can be confirmed after validation.

### Reservation Release

Reserved stock can be manually released back into inventory.

### Automatic Reservation Expiry

Reservations automatically expire after a configured duration.

Expired reservations:

* are detected automatically
* change status to expired
* release reserved stock back into available inventory
* update inventory counts dynamically

This simulates real-world inventory reservation systems used in logistics and e-commerce platforms.

---

# Concurrency-Safe Reservation Handling

One of the core engineering goals of this project was preventing overbooking during simultaneous reservation attempts.

Implemented safeguards include:

* atomic inventory updates
* stock validation before reservation creation
* prevention of negative inventory values
* consistent reservation state management
* real-time inventory synchronization
* safe handling of simultaneous reservation requests

This ensures stock consistency even when multiple users attempt to reserve the same product concurrently from different devices or sessions.

---

# Responsive SaaS Dashboard

The application includes a fully responsive enterprise-style dashboard.

Features:

* mobile-first responsive layouts
* adaptive inventory cards
* responsive sidebar navigation
* mobile-friendly dialogs
* tablet optimization
* desktop dashboard layout
* responsive reservation panels

The UI was designed to provide a consistent experience across:

* phones
* tablets
* laptops
* large desktop screens

---

# Dark Mode Support

* Full light/dark theme support
* Theme persistence
* Optimized dark UI styling
* Accessible color contrast handling

---

# Interactive UI Experience

## Toast Notifications

Modern toast notifications are used for:

* product creation
* inventory updates
* reservation success/failure
* reservation confirmations
* release actions
* error handling

---

## Confirmation Dialogs

Custom confirmation dialogs were implemented for:

* product deletion
* reservation release
* reservation confirmation

This prevents accidental destructive actions.

---

# Warehouse Management

The system supports:

* multiple warehouses
* warehouse-based inventory grouping
* inventory distribution visibility
* warehouse-level stock tracking

---

# Automated Inventory Sync

Inventory values dynamically update whenever:

* reservations are created
* reservations are confirmed
* reservations are released
* reservations expire

Stock metrics are recalculated automatically:

* Total Stock
* Reserved Stock
* Available Stock

---

# CSV Export Support

Inventory data can be exported for operational reporting and external analysis.

---

# Tech Stack

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Radix UI
* Lucide Icons

---

## Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL (Supabase)

---

## Deployment

* Vercel
* Supabase PostgreSQL
* Prisma serverless configuration

---

# Database Architecture

The application uses PostgreSQL with Prisma ORM.

Core entities:

* Products
* Warehouses
* Inventory
* Reservations

The schema is designed to maintain inventory consistency while supporting reservation workflows and concurrent operations.

PostgreSQL was chosen because the project requires strong transactional consistency and reliable concurrent inventory updates. Relational constraints and transactional operations are important for preventing stock inconsistencies during simultaneous reservation attempts.

---

# API Endpoints

## Products

* `GET /api/products`
* `POST /api/products`
* `PUT /api/products/[id]`
* `DELETE /api/products/[id]`

---

## Reservations

* `GET /api/reservations`
* `POST /api/reservations`
* `POST /api/reservations/[id]/confirm`
* `POST /api/reservations/[id]/release`
* `POST /api/reservations/expire`

---

# Performance & Architecture Decisions

## Key Design Decisions

* Serverless deployment architecture
* PostgreSQL for relational consistency
* Prisma ORM for type-safe database operations
* Responsive-first UI architecture
* Component-based frontend design
* API-driven reservation workflows

Prisma ORM was used to provide type-safe database access, simplified schema management, and safer transactional operations during reservation workflows.

---

## Scalability Considerations

The architecture was structured to support:

* additional warehouses
* increased product inventory
* larger reservation workloads
* authentication integration
* role-based access control
* real-time synchronization
* analytics dashboards

---

# Running the Application Locally

## 1. Clone the Repository

```bash
git clone https://github.com/Saran-SSK/allo-reserve.git
cd allo-reserve
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL= "Enter your Database URL here"
DIRECT_URL= "Enter your Direct URL here"
```

The project uses:

* `DATABASE_URL` for pooled runtime connections
* `DIRECT_URL` for Prisma schema operations and migrations

---

## 4. Push Prisma Schema

```bash
npx prisma db push
```

---

## 5. Seed Initial Data

```bash
npx prisma db seed
```

This populates:

* warehouses
* products
* inventory records
* sample reservations

---

## 6. Start Development Server

```bash
npm run dev
```

The application will run on:

```bash
http://localhost:3000
```

---

# Reservation Expiry Mechanism

The application implements an automated reservation expiry workflow.

## How It Works

Each reservation contains:

* status
* createdAt
* expiresAt

A periodic expiry process runs through:

```bash
/api/reservations/expire
```

The workflow:

1. Finds reservations whose `expiresAt` timestamp has passed
2. Marks them as `expired`
3. Releases reserved stock back into available inventory
4. Updates inventory counts atomically

This ensures:

* stale reservations do not permanently lock inventory
* stock remains consistent
* inventory values stay synchronized

The expiry route is triggered periodically from the frontend to simulate background reservation cleanup in a serverless deployment environment.

In a production-scale architecture, this would typically be replaced with:

* scheduled cron jobs
* queue workers
* background processing services

---

# Trade-offs & Future Improvements

## Trade-offs Made

### Polling-Based Expiry Handling

The expiry mechanism currently uses periodic polling from the frontend.

Reason:

* simpler deployment architecture
* easier serverless compatibility
* faster implementation within assignment scope

Trade-off:

* increased API calls
* less efficient than dedicated background workers

---

### Serverless Architecture

The application uses:

* Vercel serverless functions
* Prisma ORM
* Supabase PostgreSQL

This provides:

* fast deployment
* simplified infrastructure
* scalable API architecture

Trade-off:

* occasional cold-start latency on free-tier infrastructure

---

### Simplified Authentication

Authentication and RBAC were intentionally excluded to focus on:

* inventory consistency
* reservation workflows
* concurrency handling
* backend correctness

---

## What I Would Improve With More Time

Given additional time, I would implement:

* authentication & role-based access control
* real-time WebSocket inventory synchronization
* background job queues for reservation expiry
* audit logging for inventory changes
* advanced warehouse analytics
* reservation history tracking
* pagination and server-side filtering
* automated testing suite
* optimistic UI updates
* performance optimizations for high-frequency polling
* multi-user collaboration features

---

# Concurrency & Data Consistency

A major focus of this project was preventing race conditions during simultaneous reservation attempts.

The reservation workflow includes:

* stock validation before reservation creation
* atomic inventory updates
* prevention of negative inventory states
* synchronized reservation status handling

This ensures the system remains consistent even under concurrent reservation requests from multiple users or devices.

---

# Engineering Focus

The primary focus of this project was backend correctness and inventory consistency under concurrent reservation workflows.

Special attention was given to:

* preventing race conditions
* maintaining inventory integrity
* handling reservation lifecycle transitions safely
* designing a scalable and maintainable project structure

The system was intentionally structured to resemble real-world inventory reservation workflows used in production SaaS platforms.

---

# Future Improvements

Potential future enhancements:

* authentication & RBAC
* real-time WebSocket updates
* inventory analytics
* audit logs
* advanced warehouse operations
* reservation history tracking
* multi-user collaboration
* AI-based inventory forecasting

---

# Author

Developed by Saran S

Integrated M.Tech Software Engineering
VIT Chennai
