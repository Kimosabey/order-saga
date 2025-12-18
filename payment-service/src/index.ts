// payment-service/src/index.ts
import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

const start = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue('INVENTORY_RESERVED', { durable: true });
        await channel.assertQueue('PAYMENT_SUCCESS', { durable: true });
        await channel.assertQueue('PAYMENT_FAILED', { durable: true });

        console.log("💰 Payment Service Waiting for messages...");

        channel.consume('INVENTORY_RESERVED', (msg) => {
            if (msg) {
                const order = JSON.parse(msg.content.toString());
                console.log(`[⬇️ Received] Order ${order.id.slice(0,8)} - Attempting Charge of $${order.price}`);

                setTimeout(() => {
                    // LOGIC: Fail if price > 100
                    if (order.price > 100) {
                        console.log(`[❌ Failed] Insufficient Funds. Emitting PAYMENT_FAILED`);
                        channel.sendToQueue('PAYMENT_FAILED', Buffer.from(JSON.stringify(order)));
                    } else {
                        console.log(`[✅ Success] Payment Charged. Emitting PAYMENT_SUCCESS`);
                        channel.sendToQueue('PAYMENT_SUCCESS', Buffer.from(JSON.stringify(order)));
                    }
                    channel.ack(msg);
                }, 1500); // 1.5s delay to make the UI look cool
            }
        });

    } catch (error) {
        console.error(error);
    }
};

start();