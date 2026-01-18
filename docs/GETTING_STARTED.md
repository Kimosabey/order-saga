# 🚀 Getting Started with OrderSaga

> **Prerequisites**
> *   **Docker Desktop** (RabbitMQ + Postgres)
> *   **Node.js v18+**

## 1. Environment Setup

The project uses a **Monorepo** structure. You typically run all services to see the Saga in action.

**Configuration**
No complex `.env` setup is needed for standard local runs as default fallbacks are provided (connecting to localhost).

---

## 2. Installation & Launch

### Step 1: Start Infrastructure (RabbitMQ & DB)
```bash
docker-compose up -d
# Verifying:
# RabbitMQ UI: http://localhost:15672 (guest/guest)
```

### Step 2: Start Microservices
Open 4 separate terminals (or use a tool like `concurrently` if configured).

**Terminal 1: Order Service**
```bash
cd order-service
npm install
npm run dev
# Running on http://localhost:3001
```

**Terminal 2: Inventory Service**
```bash
cd inventory-service
npm install
npm run dev
# Running on http://localhost:3002
```

**Terminal 3: Payment Service**
```bash
cd payment-service
npm install
npm run dev
# Running on http://localhost:3003
```

**Terminal 4: Frontend Client**
```bash
cd client
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 3. Usage Guide (Verification)

1.  Open the **Frontend** (`http://localhost:3000`).
2.  **Happy Path**:
    *   Click "Buy Item" (Price < $100).
    *   Watch the status tick: `Pending` -> `Reserved` -> `Paid` -> `Confirmed`.
3.  **Failure Path (Rollback)**:
    *   Click "Buy Expensive Item" (Price > $1000).
    *   Watch: `Pending` -> `Reserved` -> `Payment Failed` -> `Rolling Back` -> `Cancelled`.
    *   Notice the stock count goes down, then goes back up!

---

## 4. Running Tests

Each service has its own test suite.
```bash
cd order-service
npm run test
```
