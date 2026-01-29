import amqp from 'amqplib';

// Infer types dynamically to avoid version mismatches
type AMQPConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AMQPChannel = Awaited<ReturnType<AMQPConnection['createChannel']>>;

class RabbitMQ {
    private connection: AMQPConnection | null = null;
    public channel: AMQPChannel | null = null;

    async connect() {
        if (this.connection) return; // Already connected

        try {
            console.log("🐰 Connecting to RabbitMQ...");
            const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

            // Connect
            this.connection = await amqp.connect(url);

            if (!this.connection) {
                throw new Error("Failed to create connection");
            }

            // Create Channel
            this.channel = await this.connection.createChannel();

            if (!this.channel) {
                throw new Error("Failed to create channel");
            }

            // Assert Queues
            await this.channel.assertQueue('ORDER_CREATED', { durable: true });
            await this.channel.assertQueue('ORDER_CONFIRMED', { durable: true });
            await this.channel.assertQueue('ORDER_CANCELLED', { durable: true });

            console.log("✅ RabbitMQ Connected & Queues Ready");
        } catch (error) {
            console.error("❌ RabbitMQ Connection Failed", error);
            process.exit(1);
        }
    }

    sendToQueue(queue: string, message: any) {
        if (!this.channel) {
            console.error("Cannot send message, channel not ready");
            return;
        }
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`📤 Sent to ${queue}:`, message);
    }
}

export const rabbit = new RabbitMQ();