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

The platform supports a complete reservation workflow:

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
* release reserved stock back to available inventory
* update inventory counts dynamically

This simulates real-world inventory reservation systems used in logistics and e-commerce platforms.

---

# Concurrency-Safe Reservation Handling

One of the core engineering goals of this project was preventing overbooking during simultaneous reservation attempts.

Implemented safeguards include:

* Atomic inventory updates
* Stock validation before reservation creation
* Prevention of negative inventory values
* Consistent reservation state management
* Real-time inventory synchronization
* Safe handling of simultaneous reservation requests

This ensures stock consistency even when multiple users attempt to reserve the same product concurrently from different devices or sessions.

---

# Responsive SaaS Dashboard

The application includes a fully responsive enterprise-style dashboard.

Features:

* Mobile-first responsive layouts
* Adaptive inventory cards
* Responsive sidebar navigation
* Mobile-friendly dialogs
* Tablet optimization
* Desktop dashboard layout
* Responsive reservation panels

The UI was designed to provide a consistent experience across:

* Phones
* Tablets
* Laptops
* Large desktop screens

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

* Product creation
* Inventory updates
* Reservation success/failure
* Reservation confirmations
* Release actions
* Error handling

---

## Confirmation Dialogs

Custom confirmation dialogs were implemented for:

* Product deletion
* Reservation release
* Reservation confirmation

This prevents accidental destructive actions.

---

# Warehouse Management

The system supports:

* Multiple warehouses
* Warehouse-based inventory grouping
* Inventory distribution visibility
* Warehouse-level stock tracking

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

---

## Scalability Considerations

The architecture was structured to support:

* Additional warehouses
* Increased product inventory
* Larger reservation workloads
* Authentication integration
* Role-based access control
* Real-time synchronization
* Analytics dashboards

---

# Local Setup

## Clone Repository

```bash
git clone https://github.com/Saran-SSK/allo-reserve.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
```

---

## Push Prisma Schema

```bash
npx prisma db push
```

---

## Start Development Server

```bash
npm run dev
```

---

# Future Improvements

Potential future enhancements:

* Authentication & RBAC
* Real-time WebSocket updates
* Inventory analytics
* Audit logs
* Advanced warehouse operations
* Reservation history tracking
* Multi-user collaboration
* AI-based inventory forecasting

---

# Author

Developed by Saran S

Integrated M.Tech Software Engineering
VIT Chennai
