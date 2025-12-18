# OrderSaga - Distributed Transaction System (Saga Pattern)

## 🚀 The Challenge
In a microservices architecture, you cannot use local database transactions (ACID) across different services. If an Order is created but Payment fails, the Inventory (which was already reserved) becomes inconsistent.

**OrderSaga** solves this using the **Choreography-based Saga Pattern**. It ensures eventual consistency without using a centralized orchestrator or distributed locks.

## 🛠 Tech Stack
- **Services:** Node.js, Express, TypeScript (Monorepo)
- **Messaging:** RabbitMQ (Event-Driven Communication)
- **Frontend:** Next.js 14, Chakra UI, Framer Motion
- **Infrastructure:** Docker, PostgreSQL

## 🧠 Architecture Flow
The system relies on an event loop to handle Distributed Transactions:

1. **Order Service:** Creates Order (PENDING) → Emits `ORDER_CREATED`
2. **Inventory Service:** Consumes event → Deducts Stock → Emits `INVENTORY_RESERVED`
3. **Payment Service:** Consumes event → Charges User
    - **Success:** Emits `PAYMENT_SUCCESS` → Order Confirmed.
    - **Failure:** Emits `PAYMENT_FAILED` → Triggers **Rollback**.
4. **Rollback (Compensation):** Inventory Service listens for failure → Restocks Item → Order Cancelled.

24. ## ⚡ How to Run Locally
25. 1. **Infrastructure**:
26.    ```bash
27.    docker-compose up -d
28.    ```
29. 2. **Start Services** (Run in separate terminals):
30.    - **Order Service**: `cd order-service && npm run dev`
31.    - **Inventory Service**: `cd inventory-service && npm run dev`
32.    - **Payment Service**: `cd payment-service && npm run dev`
33.    - **Client**: `cd client && npm run dev`
34. 
35. 📘 **[Read the High-Level Design (HLD)](docs/hld.md)** for architecture details.
36. 🎓 **[Senior Interview Cheat Sheet](docs/interview_cheat_sheet.md)** for system design Q&A.

## 📸 Demo (Saga Rollback)
*(Insert your GIF here)*