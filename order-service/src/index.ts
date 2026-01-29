// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rabbit } from './rabbitmq';
import { v4 as uuidv4 } from 'uuid'; // You might need to install uuid if missing

dotenv.config();

const app = express();
app.use(cors()); // Allow Next.js to talk to us
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Store orders in memory for now (We will add DB later)
export const orders: any = {};

// 1. Initialize RabbitMQ before starting server
rabbit.connect();

// 2. POST Endpoint (Next.js calls this)
app.post('/create-order', async (req, res) => {
    const { userId, item, price } = req.body;

    // Create a unique Order ID
    const orderId = uuidv4();

    const newOrder = {
        id: orderId,
        userId,
        item,
        price,
        status: 'PENDING' // Initial state
    };

    // Save to local memory (Mock DB)
    orders[orderId] = newOrder;

    // 🚀 THE SAGA BEGINS: Publish Event
    rabbit.sendToQueue('ORDER_CREATED', newOrder);

    // Return immediately (Async processing)
    res.status(201).json({
        message: "Order received",
        order: newOrder
    });
});

// 3. Status Endpoint (Next.js Polls this)
app.get('/order/:id', (req, res) => {
    const order = orders[req.params.id];
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
});

// === ADD THIS BLOCK ===
const consumeResults = async () => {
    if (!rabbit.channel) {
        setTimeout(consumeResults, 1000); // Wait for connection
        return;
    }

    // 1. Listen for SUCCESS
    rabbit.channel.consume('PAYMENT_SUCCESS', (msg) => {
        if (msg) {
            const data = JSON.parse(msg.content.toString());
            console.log(`[🎉 Order Confirmed] ${data.id}`);
            if (orders[data.id]) {
                orders[data.id].status = 'CONFIRMED';
            }
            rabbit.channel?.ack(msg);
        }
    });

    // 2. Listen for FAILURE (Rollback Complete)
    rabbit.channel.consume('PAYMENT_FAILED', (msg) => {
        if (msg) {
            const data = JSON.parse(msg.content.toString());
            console.log(`[💀 Order Cancelled] ${data.id}`);
            if (orders[data.id]) {
                orders[data.id].status = 'CANCELLED';
            }
            // Note: We don't ack here if Inventory needs it, but using Fanout or multiple consumers 
            // is better. For this simple demo, we assume Inventory already got it or we process it here.
            // Let's ack it so it doesn't get stuck.
            rabbit.channel?.ack(msg);
        }
    });
};

// Start listening
consumeResults();

// === END BLOCK ===

app.listen(PORT, () => {
    console.log(`🚀 Order Service running on port ${PORT}`);
});