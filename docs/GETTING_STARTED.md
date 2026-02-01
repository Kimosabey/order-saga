# Getting Started: OrderSaga

> Step-by-step guide to local deployment and environment configuration.

---

## 1. Prerequisites

Ensure your development environment meets these requirements:
*   **Node.js**: v18.0.0 or higher.
*   **Docker Desktop**: Required for RabbitMQ and PostgreSQL containers.
*   **Git**: For version control and cloning.
*   **Postman/Insomnia**: For manual API testing (optional).

---

## 2. Installation

Follow these steps to initialize the monorepo:

### Infrastructure Setup
```bash
# 1. Spin up the Core Infrastructure
docker-compose up -d

# 2. Verify RabbitMQ is running (Management UI)
# URL: http://localhost:15672 (guest/guest)
```

### Dependency Installation
```bash
# Install all dependencies for the entire monorepo
npm run install:all
```

---

## 3. Environment Variables

Each service expects specific `.env` configurations. Copy the `.env.example` in each directory.

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `3001-3004` | Service port mapping. |
| `RABBIT_URL` | `amqp://localhost` | Connection string for message broker. |
| `DB_URL` | `postgres://...` | Connection string for service-specific DB. |
| `JWT_SECRET` | `kimo-secret` | Authentication secret (if applicable). |

---

## 4. Running Tests

Verification of the distributed transaction logic is performed via automated test suites.

### Unit Tests
Verify individual service logic (mocked messaging).
```bash
npm run test:unit
```

### Integration Tests (The Saga Test)
Verify the full end-to-end flow from Order ➔ Inventory ➔ Payment.
```bash
npm run test:integration
```

### Chaos Testing
Simulates a payment failure to verify the **Compensating Transaction** (Rollback).
```bash
npm run test:chaos:rollback
```
