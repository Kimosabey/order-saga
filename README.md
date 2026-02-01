# OrderSaga - Distributed Transaction System (Saga Pattern)

> **Distributed Saga Pattern**: Ensuring eventual consistency across microservices using choreography-based event streams.

<div align="center">

![Status](https://img.shields.io/badge/Status-100%25_Operational-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Node.js_RabbitMQ_Postgres-61DBFB?style=for-the-badge)

</div>

---

## 🚀 Quick Start
Launch the entire system in 3 commands:

```bash
# 1. Start Infrastructure (RabbitMQ + Postgres)
docker-compose up -d

# 2. Install Dependencies
npm run install:all

# 3. Start all Microservices
npm run start:all
```

---

## 🖼️ Screenshots / Demo
Standard assets following the [V3 Portfolio Asset Planner](../../PORTFOLIO_ASSET_PLANNER.md).

| ![Hero](./docs/assets/hero_main.png) | ![Dashboard](./docs/assets/dashboard.png) |
|:---:|:---:|
| **Event Stream UI** | **RabbitMQ Performance Metrics** |

| ![Workflow](./docs/assets/workflow.png) | ![Architecture](./docs/assets/architecture.png) |
|:---:|:---:|
| **Saga Flow & Rollbacks** | **Distributed Infrastructure** |

---

## ✨ Key Features
*   **⚡ Choreography-based Saga**: Decentralized transaction management via RabbitMQ.
*   **🔄 Automatic Rollbacks**: Compensation logic to restore consistency on payment failure.
*   **📦 Idempotent Consumers**: Prevents duplicate processing in high-scale environments.
*   **📊 Real-time Observability**: Event stream dashboard for tracking transaction state.

---

## 🧠 Architecture
The system employs a choreography-based saga where services communicate asynchronously. This eliminates the need for a central orchestrator, reducing coupling and increasing scalability.

![Architecture](./docs/assets/architecture.png)

### 🎯 Senior Engineer Signals
*   **Atomic Transactions**: In microservices, local ACID is impossible. I implemented **Choreography Sagas** to maintain eventual consistency without distributed locks.
*   **Race Condition Mitigation**: Used **Postgres Advisory Locks** and **Idempotency Keys** to ensure events are processed exactly once.
*   **Fault Tolerance**: Built **Dead Letter Queues (DLQ)** to handle poisonous messages and transient network failures.

---

## 🧪 Testing & Scripts
```bash
# Run Unit Tests
npm run test:unit

# Run Integration (Saga Flow) Tests
npm run test:integration

# Simulate Payment Failure (Triggers Rollback)
npm run test:chaos:payment-fail
```

---

## 📚 Documentation
Strict compliance with [PORTFOLIO_DOCS_STANDARD.md](../../PORTFOLIO_DOCS_STANDARD.md).

| Document | Description |
| :--- | :--- |
| [**System Architecture**](./docs/ARCHITECTURE.md) | Deep dive into Saga vs Orchestration patterns. |
| [**Getting Started**](./docs/GETTING_STARTED.md) | Detailed environment and setup guide. |
| [**Failure Scenarios**](./docs/FAILURE_SCENARIOS.md) | "What if?" analysis and disaster recovery. |
| [**Interview Q&A**](./docs/INTERVIEW_QA.md) | System Design Q&A for this project. |

---

## 🔧 Tech Stack
| Component | Technology | Role |
| :--- | :--- | :--- |
| **Messaging** | **RabbitMQ** | Asynchronous Event Bus. |
| **Services** | **Node.js / TS** | Core Microservices logic. |
| **Database** | **PostgreSQL** | Persistent state for each service. |
| **Interface** | **Next.js 14** | Transaction monitoring UI. |

---

## 🔮 Future Enhancements
*   [ ] Implement **Transactional Outbox Pattern** for guaranteed event delivery.
*   [ ] Add **OpenTelemetry** for end-to-end distributed tracing.

---

## 📝 License
Licensed under the MIT License.

---

## 👤 Author

**Harshan Aiyappa**  
Senior Full-Stack Hybrid AI Engineer  
Voice AI • Distributed Systems • Infrastructure

[![Portfolio](https://img.shields.io/badge/Portfolio-kimo--nexus.vercel.app-00C7B7?style=flat&logo=vercel)](https://kimo-nexus.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Kimosabey-black?style=flat&logo=github)](https://github.com/Kimosabey)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harshan_Aiyappa-blue?style=flat&logo=linkedin)](https://linkedin.com/in/harshan-aiyappa)
[![X](https://img.shields.io/badge/X-@HarshanAiyappa-black?style=flat&logo=x)](https://x.com/HarshanAiyappa)
