# Test Cases & Production Readiness

## ✅ Implemented Scenarios (The Portfolio Requirement)

| Case | Scenario | Status |
| :--- | :--- | :--- |
| **1. Success Path** | Order ($50) → Stock Reserved → Payment OK → Order Confirmed | ✅ **WORKING** |
| **2. Logical Failure** | Order ($150) → Stock Reserved → Payment Fails → Stock Refunded | ✅ **WORKING** (Saga Rollback) |
| **3. Async UI** | User clicks buy → UI waits → Updates via Polling | ✅ **WORKING** |

---

## ❌ Missing Scenarios (The "Senior" Interview Questions)

These scenarios are **NOT** handled in the current implementation but are critical for a real production system.

### 1. The "Double Message" Case (Idempotency)
- **The Bug**: If RabbitMQ sends the `PAYMENT_FAILED` message twice by accident.
- **Current Result**: Inventory Service runs `Stock = Stock + 1` twice. (Free items generated).
- **The Fix**: Implement **Idempotency Keys**.
  - *Code*: Before increasing stock, check DB: `IF (transaction_id_123) EXISTS, IGNORE`.

### 2. The "Service Down" Case
- **The Bug**: If Inventory Service crashes and an order is placed.
- **Current Result**: `ORDER_CREATED` message sits in RabbitMQ. UI stays "Pending" forever.
- **The Fix**: Implement a **Timeout Monitor** in Order Service.
  - *Code*: `setTimeout(() => { if status is PENDING, mark as FAILED }, 30s)`.

### 3. The "Race Condition" Case
- **The Bug**: Two users buy the last item at the exact same millisecond.
- **Current Result**: Both pass `if (stock > 0)` check. Stock goes to `-1`.
- **The Fix**: **Database Row Locking**.
  - *Code*: `SELECT * FROM items WHERE id=1 FOR UPDATE` (Postgres Lock).
