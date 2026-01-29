// inventory-service/src/index.ts
import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

const start = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Assert all queues to be safe
        await channel.assertQueue('ORDER_CREATED', { durable: true });
        await channel.assertQueue('INVENTORY_RESERVED', { durable: true });
        await channel.assertQueue('PAYMENT_FAILED', { durable: true });
        await channel.assertQueue('INVENTORY_REFUNDED', { durable: true });

        console.log("📦 Inventory Service Waiting for messages...");

        // 1. FORWARD FLOW: Reserve Stock
        channel.consume('ORDER_CREATED', (msg) => {
            if (msg) {
                const order = JSON.parse(msg.content.toString());
                console.log(`[⬇️ Received] Order ${order.id.slice(0, 8)} - Reserving Stock for ${order.item}`);

                // SIMULATE DB UPDATE
                // await db.query('UPDATE items SET qty = qty - 1 WHERE id = ?', [order.item])

                // Emulate processing time
                setTimeout(() => {
                    console.log(`[✅ Stock Reserved] Emitting INVENTORY_RESERVED`);

                    // Pass it to the next step
                    channel.sendToQueue('INVENTORY_RESERVED', Buffer.from(JSON.stringify(order)));
                    channel.ack(msg);
                }, 1000);
            }
        });

        // 2. BACKWARD FLOW (SAGA): Compensating Transaction
        channel.consume('PAYMENT_FAILED', (msg) => {
            if (msg) {
                const order = JSON.parse(msg.content.toString());
                console.log(`[🚨 Rollback] Payment failed for ${order.id.slice(0, 8)}. Releasing Stock...`);

                // SIMULATE DB COMPENSATION
                // await db.query('UPDATE items SET qty = qty + 1 WHERE id = ?', [order.item])

                setTimeout(() => {
                    console.log(`[↩️ Stock Released] Inventory Corrected.`);
                    channel.ack(msg);
                }, 1000);
            }
        });

    } catch (error) {
        console.error(error);
    }
};

start();