# 🔄 Transaction Flow Details
This document details the step-by-step event flow of the **Choreography Saga Pattern** used in OrderSaga.

## ✅ Happy Path: Order Success
When everything works correctly, the system follows this sequence:

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant O as Order Service
    participant Q as RabbitMQ
    participant I as Inventory Service
    participant P as Payment Service

    U->>O: Create Order
    O->>O: Save PENDING Order
    O-->>Q: Publish: ORDER_CREATED
    
    Q->>I: Consume: ORDER_CREATED
    I->>I: Deduct Stock
    I-->>Q: Publish: INVENTORY_RESERVED
    
    Q->>P: Consume: INVENTORY_RESERVED
    P->>P: Process Payment
    P-->>Q: Publish: PAYMENT_SUCCESS
    
    Q->>O: Consume: PAYMENT_SUCCESS
    O->>O: Update Order: COMPLETED
    O-->>U: Order Confirmed!
    
    Note over O,P: All services are eventually consistent
```

## ❌ Rollback Path: Payment Failure
If the payment fails (e.g., insufficient funds), the system must compensate by restocking items:

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant O as Order Service
    participant Q as RabbitMQ
    participant I as Inventory Service
    participant P as Payment Service

    rect rgb(255, 235, 235)
        U->>O: Create Order
        O->>O: Save PENDING Order
        O-->>Q: Publish: ORDER_CREATED
    end
    
    rect rgb(255, 235, 235)
        Q->>I: Consume: ORDER_CREATED
        I->>I: Deduct Stock
        I-->>Q: Publish: INVENTORY_RESERVED
    end

    rect rgb(255, 200, 200)
        Note right of P: Payment Fails
        Q->>P: Consume: INVENTORY_RESERVED
        P-->>Q: Publish: PAYMENT_FAILED
    end
    
    rect rgb(255, 150, 150)
        Note over Q,I: Compensation Triggered
        Q->>I: Consume: PAYMENT_FAILED
        I->>I: Restock Items (+1)
    end
    
    rect rgb(255, 100, 100)
        Q->>O: Consume: PAYMENT_FAILED
        O->>O: Update Order: CANCELLED
        O-->>U: Order Failed (Inventory Restored)
    end
```

## 🧠 Key Concepts
- **Isolation**: Each service only cares about its own database.
- **Eventual Consistency**: The system is not consistent immediately, but becomes so after all events are processed.
- **Idempotency**: Services should be able to handle the same event multiple times without side effects (crucial for retries).
