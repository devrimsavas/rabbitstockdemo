# RabbitStock Demo

An event-driven microservices demo simulating an order-and-inventory workflow using RabbitMQ, with two independent TypeScript services communicating asynchronously via a fanout exchange, plus a React admin frontend.

## 🏗️ Architecture

Two decoupled services communicate exclusively through RabbitMQ — there is no direct HTTP call between them:

```
┌────────────────┐   order.created   ┌──────────────────────┐
│  Order Service  │ ────────────────▶ │   Inventory Service   │
│  (Publisher)    │                    │   (Consumer + DB)     │
│                 │ ◀──────────────── │                        │
└────────────────┘  order.confirmed/  └──────────────────────┘
                     order.rejected
        (both via "order_exchange", a durable fanout exchange)
```

1. **Order Service** publishes an `order.created` event to the `order_exchange` fanout exchange when a new order is placed
2. **Inventory Service** consumes the event via its own queue (`inventory_order_queue`), checks stock availability against a MySQL database, and either:
   - deducts stock and publishes `order.confirmed`, or
   - publishes `order.rejected` if any item is unavailable
3. **Order Service** consumes the confirmation/rejection via its own queue (`order_status_queue`) and updates the order's in-memory status accordingly

This is a simple example of **event choreography** — each service reacts to events independently, with no central orchestrator.

## 🚀 Features

- Fully asynchronous, decoupled communication between services via RabbitMQ (no direct REST calls between them)
- Stock-aware order confirmation: orders are only confirmed if inventory is sufficient, with automatic stock deduction
- Durable exchange and queues, with manual ack/nack for reliable message processing
- **Inventory Service**: Sequelize + MySQL persistence, Swagger/OpenAPI docs, database auto-seeding on startup
- **Order Service**: lightweight in-memory order status store
- **React frontend**: inventory management UI (add/view products) and order creation UI

## 🛠 Tech Stack

- **Services:** Node.js, TypeScript, Express 5
- **Messaging:** RabbitMQ (via `amqplib`), fanout exchange
- **Database:** MySQL + Sequelize / sequelize-typescript (Inventory Service only)
- **API Docs:** swagger-jsdoc + swagger-ui-express (Inventory Service)
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS 4, react-router-dom
- **Containerization:** RabbitMQ runs via Docker

## 📂 Project Structure

```
rabbitstockdemo/
├── order_service/            # Publisher — creates orders, tracks status
│   └── src/
│       ├── app.ts             # Express app + RabbitMQ consumer/publisher setup
│       ├── rabbit.ts          # RabbitMQ connection helper
│       ├── store.ts           # In-memory order status store
│       └── routes/
├── inventory_service/        # Consumer — validates stock, confirms/rejects orders
│   └── src/
│       ├── app.ts             # Express app + Sequelize + RabbitMQ + Swagger setup
│       ├── rabbit.ts
│       ├── models/            # Sequelize models (db.ts, item.ts)
│       ├── services/          # ItemService, PopulateDB (auto-seeding)
│       └── configuration/     # Swagger options
└── frontend/
    └── inventoryfrontend/     # React + Vite admin UI
        └── src/components/
            ├── Inventory-service/   # AddProducts, InventoryTable, ShowInventory
            └── OrderService.tsx      # Order creation UI
```

## ▶️ Getting Started

### Prerequisites
- Node.js
- Docker (for RabbitMQ)
- MySQL (for the Inventory Service)

### 1. Start RabbitMQ

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
```

The management UI is available at `http://localhost:15672` (default credentials: `guest` / `guest`).

### 2. Start the Inventory Service

```bash
cd inventory_service
npm install
npm run dev   # or the configured start script
```
Swagger UI: `http://localhost:3001/api-docs`

### 3. Start the Order Service

```bash
cd order_service
npm install
npm run dev
```

### 4. Start the frontend

```bash
cd frontend/inventoryfrontend
npm install
npm run dev
```

## 📝 Notes

This is a learning project built to practice event-driven microservices communication with RabbitMQ — specifically the choreography pattern, where services react to each other's events without a central coordinator, and durable queues/exchanges ensure messages aren't lost if a service restarts.
