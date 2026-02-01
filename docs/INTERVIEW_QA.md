# 🎓 OrderSaga: Senior Interview Cheat Sheet

Use this guide to answer architectural questions during your system design interview.

## 1. The Core Concept: Saga Pattern
**Q: Why didn't you use a Distributed Transaction (2PC / XA)?**
- **A**: 2 Phase Commit (2PC) locks the database rows across services, which kills performance and availability. If one service waits, everyone waits.
- **My Choice**: I used the **Saga Pattern** (Choreography). It favors *Availability* over strict *Consistency* (BASE vs ACID). It relies on "Compensating Transactions" (Undo operations) to handle failures.

## 2. Architecture: Choreography vs. Orchestration
**Q: Why did you choose Choreography (Events) over Orchestration (Central Controller)?**
- **A**: For this Project (3 Services), **Choreography** is simpler and decoupled. Services just react to events (`order_created`).
- **Trade-off**: As the system grows, Choreography can become a "Landscape of Hell" (hard to track who listens to what). For 10+ services, I would switch to **Orchestration** (like Temporal.io or a centralized specific Orchestrator Service).

## 3. Communication: RabbitMQ vs. Kafka vs. HTTP
**Q: Why RabbitMQ and not HTTP (REST)?**
- **A**: HTTP is synchronous. If Inventory is down, the Order fails immediately.
- **A**: RabbitMQ (Async) allows the `ORDER_CREATED` message to sit in the queue until Inventory comes back online (**Resilience**).

**Q: Why not Kafka?**
- **A**: Kafka is for high-throughput streaming (millions of events). RabbitMQ is better for "Complex Routing" and simple "Task Queues" which fits this transactional use case better.

## 4. The "Senior" Reality Check (Your Flaws)
**Q: Is this code production ready?**
- **A**: "Functionally, yes. Architecturally, it needs 3 things:"
  1.  **Idempotency**: Application-level checks to prevent processing the same message twice.
  2.  **Timeouts**: An independent monitor to cleanup "stuck" PENDING orders.
  3.  **Observability**: A distributed tracing ID (TraceID) passed in headers to debug logs across services.

## 5. Key Vocabulary to Dropping
- **Eventual Consistency**: The data will be consistent *eventually*, not immediately.
- **Compensating Transaction**: The "Undo" button for a distributed action.
- **At-Least-Once Delivery**: RabbitMQ guarantees the message arrives, but maybe twice. (Hence need for Idempotency).
