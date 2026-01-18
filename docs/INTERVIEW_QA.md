# 🎤 Interview Cheat Sheet: OrderSaga

## 1. The Elevator Pitch (2 Minutes)

"OrderSaga is a Distributed Transaction demonstration using the **Saga Pattern**.

In a microservices world, you can't just use a single database transaction across different services. If Payment fails, you need a way to 'undo' the Inventory reservation.
I implemented the **Choreography Saga** using **RabbitMQ**:
1.  **Event-Driven**: Services react to events (Order Created -> Reserve Stock -> Charge Payment).
2.  **Eventual Consistency**: If any step fails, a 'Compensation Event' triggers a rollback (e.g., adding the item back to inventory).
3.  **Isolation**: Each microservice owns its own database, strictly following the Database-per-Service pattern."

---

## 2. "Explain Like I'm 5" (The Relay Race)

"Think of it like a Relay Race.
*   **Microservices** are the runners.
*   **The Baton** is the Order.
*   **The Track** is RabbitMQ.

Runner 1 (Order) hands the baton to Runner 2 (Inventory), who hands it to Runner 3 (Payment).
If Runner 3 trips and falls (Payment Fails), he doesn't just lie there. He yells 'GO BACK!' (Rollback Event).
Runner 2 hears this, runs back to the starting line, and puts the baton back on the shelf (Restocks Item).
Everyone ends up back where they started safely."

---

## 3. Tough Technical Questions

### Q: Choreography vs. Orchestration. Why did you choose Choreography?
**A:** "Orchestration (using a central coordinator like Temporal) is great for complex flows with 10+ steps. But for this 3-step flow, it acts as a bottleneck and single point of failure. **Choreography** allows the services to be decoupled and autonomous—the Inventory Service doesn't need to know *who* triggered the reservation, just that it needs to happen. It's more scalable for simpler workflows."

### Q: How do you handle 'Zombie' Reservations?
**A:** "If the Payment Service crashes permanently, an item might stay 'Reserved' forever. To fix this, I would implement a **Time-To-Live (TTL)** on the reservation or a 'Reaper Process' that checks for orders stuck in `PENDING` state for >10 minutes and triggers a manual compensation event."

### Q: Is this ACID compliant?
**A:** "No, it is **BASE** (Basically Available, Soft state, Eventual consistency). We trade strict Atomicity for high Availability. The system is momentarily inconsistent (Item reserved but not paid), but it is guaranteed to become consistent eventually."
