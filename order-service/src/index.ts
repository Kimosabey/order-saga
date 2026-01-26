// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rabbit } from './rabbitmq';
import { v4 as uuidv4 } from 'uuid';
import { query, initDb } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// 1. Initialize DB and RabbitMQ
const initialize = async () => {
    try {
        await initDb();
        await rabbit.connect();

        // Start consuming results after connection
        consumeResults();

        app.listen(PORT, () => {
            console.log(`🚀 Order Service running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Critical Initialization Failure:", err);
        process.exit(1);
    }
};

initialize();

// 2. POST Endpoint (Next.js calls this)
app.post('/create-order', async (req, res) => {
    const { userId, item, price } = req.body;

    const orderId = uuidv4();
    const status = 'PENDING';

    try {
        // Save to Postgres
        await query(
            'INSERT INTO orders (id, user_id, item, price, status) VALUES ($1, $2, $3, $4, $5)',
            [orderId, userId, item, price, status]
        );

        const newOrder = { id: orderId, userId, item, price, status };

        // 🚀 THE SAGA BEGINS: Publish Event
        rabbit.sendToQueue('ORDER_CREATED', newOrder);

        res.status(201).json({
            message: "Order received",
            order: newOrder
        });
    } catch (err) {
        console.error("Failed to create order:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 3. Status Endpoint (Next.js Polls this)
app.get('/order/:id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const row = result.rows[0];
        res.json({
            id: row.id,
            userId: row.user_id,
            item: row.item,
            price: parseFloat(row.price),
            status: row.status,
            createdAt: row.created_at
        });
    } catch (err) {
        console.error("Failed to fetch order:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// === RESULT CONSUMERS ===
const consumeResults = async () => {
    if (!rabbit.channel) {
        setTimeout(consumeResults, 1000);
        return;
    }

    // 1. Listen for SUCCESS
    rabbit.channel.consume('PAYMENT_SUCCESS', async (msg) => {
        if (msg) {
            const data = JSON.parse(msg.content.toString());
            console.log(`[🎉 Order Confirmed] ${data.id}`);

            try {
                await query('UPDATE orders SET status = $1 WHERE id = $2', ['CONFIRMED', data.id]);
                rabbit.channel?.ack(msg);
            } catch (err) {
                console.error("Failed to update order status to CONFIRMED:", err);
            }
        }
    });

    // 2. Listen for FAILURE (Rollback Complete)
    rabbit.channel.consume('PAYMENT_FAILED', async (msg) => {
        if (msg) {
            const data = JSON.parse(msg.content.toString());
            console.log(`[💀 Order Cancelled] ${data.id}`);

            try {
                await query('UPDATE orders SET status = $1 WHERE id = $2', ['CANCELLED', data.id]);
                rabbit.channel?.ack(msg);
            } catch (err) {
                console.error("Failed to update order status to CANCELLED:", err);
            }
        }
    });
};

// Removed redundant consumeResults() call here as it's now in initialize()

// Initialized via initialize() function above
