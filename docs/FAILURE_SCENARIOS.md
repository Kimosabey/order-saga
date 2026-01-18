# 🛡️ Failure Scenarios: The Saga Pattern

> "Distributed Systems are all about handling partial failures."

This document outlines how OrderSaga handles errors, ensuring data consistency across distributed boundaries.

## 1. Failure Matrix

| Component | Failure Mode | Impact | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **Order Service** | Crash after creation | **Minor**. User sees "Pending" | **State Reconciliation**. On restart, check pending orders and re-poll status. |
| **RabbitMQ** | Broker Down | **Critical**. Services cannot talk. | **Outbox Pattern**. (Advanced) Services write events to a local DB table first, then a separate process pushes to Queue when online. |
| **Inventory Service** | Database Lock | **Major**. Stock not reserved. | **Retry w/ Backoff**. RabbitMQ retries the message delivery. |
| **Payment Service** | Decline/Timeout | **Core Function**. Transaction fails. | **Compensation**. Triggers the `PAYMENT_FAILED` event to undo previous steps. |

---

## 2. Deep Dive: The Rollback Scenario

### The Problem of "Partial Success"
Imagine a user buys the last iPhone.
1.  **Inventory**: Decrements Stock (1 -> 0). Success.
2.  **Payment**: Fails (Insufficent Funds).
3.  **Result**: The user didn't get the phone, but the Inventory thinks it's sold out. **Inconsistency!**

### The Solution: Compensating Transaction
The Inventory Service listens not just for `ORDER_CREATED` but also for `PAYMENT_FAILED`.
*   **Logic**:
    *   *Event*: `PAYMENT_FAILED` received.
    *   *Action*: Find the Order ID.
    *   *Compensate*: Increment Stock (0 -> 1).
    *   *Result*: System is back to consistent state (Eventual Consistency).

---

## 3. Resilience Testing

You can verify this by manually killing a service.
1.  **Stop Payment Service**.
2.  Create an Order.
3.  Order stays in `INVENTORY_RESERVED`.
4.  **Start Payment Service**.
5.  It picks up the message and processes the payment.
*   *Verdict*: Reliability achieved via Message Queuing.
