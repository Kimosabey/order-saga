# OrderSaga (AG-03)
### Distributed Transaction System & Event-Driven Saga Engine

![OrderSaga Hero](./docs/assets/hero_main.png)

![Status](https://img.shields.io/badge/Status-100%25_Operational-success?style=for-the-badge)
![Category](https://img.shields.io/badge/Category-Distributed_Systems-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Node.js_RabbitMQ_Postgres-black?style=for-the-badge)

---

## 🌌 Overview

**OrderSaga** is a sophisticated distributed transaction engine designed to solve the "Partial Failure" problem in microservices. It implements the **Choreography-based Saga Pattern** to ensure eventual consistency across decoupled services (Order, Inventory, Payment) without the performance overhead of distributed locks or two-phase commits.

The system is built to handle high-concurrency order streams where failures are expected, guaranteeing that every customer charge is either completed with a confirmed order or automatically rolled back across all underlying databases.

---

## 🏗️ Cognitive Hub (Architecture)

![Architecture Infographic](./docs/assets/architecture.png)

The system operates as a decentralized state machine powered by **RabbitMQ**:

1.  **Order Orchestration**: Initiates the transaction state and manages the lifecycle from `PENDING` to `CONFIRMED`.
2.  **Inventory Management**: Performs atomic reservations with automatic restock logic (Compensating Transactions) on failure.
3.  **Payment Processing**: Handles transactional auth with built-in failure propagation back to the event stream.
4.  **Observer Layer**: A real-time monitoring dashboard that visualizes the heartbeat of the RabbitMQ queues.

---

## 🎨 Professional Interface

![Dashboard Preview](./docs/assets/dashboard.png)

The project features a **Premium Event Stream Dashboard** built with **Next.js 14** and **Framer Motion**:
- **Real-time Queue Telemetry**: Visual throughput graphs showing message spikes across the RabbitMQ bus.
- **Transaction Audit Logs**: A high-fidelity table showing the state of every Saga (Committed vs Rolled Back).
- **Responsive System Health**: Real-time status indicators for the PostgreSQL cluster and RabbitMQ exchange.

---

## 🔥 Senior Signals (Technical Highlights)

- **Distributed Saga Pattern**: Decoupled transaction management using choreography to favor availability over strict consistency (BASE vs ACID).
- **Idempotent Consumers**: Implemented application-level checks to prevent double-charging or over-stocking due to message redelivery.
- **Race Condition Mitigation**: Utilizes **Postgres Advisory Locks** for atomic operations on shared service resources.
- **Fault Tolerance (DLQ)**: Built dedicated **Dead Letter Queues** to isolate and debug poisonous messages without blocking the main stream.

---

## ⚙️ Workflow Infographic

![Workflow Infographic](./docs/assets/workflow.png)

---

## 🚀 Quick Start

### 1. Infrastructure (Docker)
```bash
# Start RabbitMQ and PostgreSQL
docker-compose up -d
```

### 2. Launch Services
```bash
# Install all dependencies and start microservices
npm run install:all
npm run start:all
```

---

## 📚 Documentation Standard
This project strictly adheres to the [Kimo Portfolio Standard](../../PORTFOLIO_DOCS_STANDARD.md).

| Document | Description |
| :--- | :--- |
| [**System Architecture**](./docs/ARCHITECTURE.md) | Deep dive into Saga logic and Decision Logs. |
| [**Getting Started**](./docs/GETTING_STARTED.md) | Environment setup and installation guide. |
| [**Failure Scenarios**](./docs/FAILURE_SCENARIOS.md) | Fault analysis and Chaos Testing results. |
| [**Interview Q&A**](./docs/INTERVIEW_QA.md) | System design justifications for interviews. |

---

## 👤 Author

**Harshan Aiyappa**  
Senior Full-Stack Hybrid AI Engineer  
Voice AI • Distributed Systems • Infrastructure

[![Portfolio](https://img.shields.io/badge/Portfolio-kimo--nexus.vercel.app-00C7B7?style=flat&logo=vercel)](https://kimo-nexus.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Kimosabey-black?style=flat&logo=github)](https://github.com/Kimosabey)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harshan_Aiyappa-blue?style=flat&logo=linkedin)](https://linkedin.com/in/harshan-aiyappa)
