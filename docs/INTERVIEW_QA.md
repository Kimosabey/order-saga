# Interview Q&A: OrderSaga

> Key insights and technical justifications for system design interviews.

---

## 1. "Tell me about this project..." (The 2-Minute Pitch)

"OrderSaga is a distributed transaction engine designed to solve the consistency problem in microservices. In a typical monorepo, you have ACID transactions. In microservices, each service has its own database—so if an order is created but the payment fails, you end up with inconsistent stock.

I implemented the **Choreography-based Saga Pattern** using Node.js and RabbitMQ. This allows the services to communicate asynchronously. When a payment fails, the system automatically triggers 'Compensating Transactions' to restock items and cancel the order. It’s a high-availability architecture that favors eventual consistency over strict locking, making it highly scalable for enterprise e-commerce environments."

---

## 2. "What was the hardest technical challenge?"

"The hardest part wasn't the 'Happy Path'; it was handling **Partial Failures and Idempotency**.

During development, I found that if the Payment service crashed *after* charging the user but *before* sending the success event, the system would be in a broken state. I had to implement **Idempotency Keys** and specific retry logic in RabbitMQ to ensure that redelivered messages wouldn't process twice. Solving for the 'exactly-once' delivery challenge taught me the difference between basic message passing and a truly resilient distributed transaction system."

---

## 3. "Why did you choose this specific tech stack?"

### Why Node.js & RabbitMQ?
*   **Asynchronous Nature**: Node's non-blocking I/O matches perfectly with the event-driven nature of RabbitMQ.
*   **RabbitMQ Routing**: I chose RabbitMQ over Kafka because this use case requires complex routing (direct exchanges for success, fanout for failures) which is RabbitMQ's specialty.

### Why separate Databases per Service?
*   **Loose Coupling**: To prove a true distributed system, I enforced 'No Shared Database'. If the Inventory service changes its schema, the Order service remains unaffected. This is the 'Senior Signal' for professional microservice architecture.
