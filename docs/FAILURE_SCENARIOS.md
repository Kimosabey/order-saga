# 🛡️ Failure Scenarios & Resilience: OrderSaga

> Analysis of distributed system failure modes and the implemented safeguards.

![Saga Workflow](./assets/workflow.png)

---

## 1. Fault Analysis

In a distributed environment, partial failures are inevitable. This section details how the system reacts to critical component outages.

| Component | Failure Mode | Impact |
| :--- | :--- | :--- |
| **RabbitMQ** | Broker Crashes | **HIGH**. Services cannot communicate. Transactions are stuck in current state. |
| **PostgreSQL** | DB Unreachable | **MEDIUM**. Affected service cannot process its leg of the Saga. Transaction times out. |
| **Inventory Svc** | Out of Stock | **EXPECTED**. Triggers a logical "Saga Rollback" to cancel the order. |
| **Payment Svc** | Auth Timeout | **HIGH**. Could lead to "Ghost Orders" where stock is reserved but never paid for. |

---

## 2. Recovery Strategy

### Idempotency (Exactly-Once Semantics)
We use a **processed_events** table in each microservice. This ensures that if a network glitch causes RabbitMQ to redeliver a `PAYMENT_SUCCESS` message, the user is never charged twice and the stock isn't deducted twice.

### Dead Letter Queues (DLQ)
Messages that fail processing after 3 retries (due to data corruption or logic errors) are moved to a `SAGA_DEAD_LETTER` queue. This allows engineers to manually inspect and replay failed transactions without losing data.

### Compensating Transactions
The core of the Saga pattern is the "Undo" logic.
*   **Action**: Reserve Stock.
*   **Compensation**: Restock items based on `PAYMENT_FAILED` event.
*   **Consistency**: Every "Success" event must have a corresponding "Failure" handler in all upstream services.

---

## 3. Chaos Testing

To verify the resilience of the system, we perform targeted "Chaos Attacks" during development:

1.  **Kill Payment Service**: Verify that the `INVENTORY_RESERVED` message sits safely in the queue and processes immediately once the service restarts.
2.  **Network Partition**: Inject delay into the Payment auth. Verify that the system handles the timeout and triggers a cleanup task.
3.  **Rollback Verification**: Forced a `PAYMENT_FAILED` status and verified via DB queries that the `stock` count returned to its original value.
