const amqp = require('amqplib');
const rabbitmqUrl = 'amqp://guest:guest@localhost:5672/';

async function produceNews() {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        const exchangeName = 'topic_news';

        await channel.assertExchange(exchangeName, 'topic', { durable: false });

        // Formato de routing key: <pais>.<categoria>.<subcategoria>
        const routingKey = process.argv[2] || 'colombia.tecnologia.general';
        const message = process.argv[3] || 'Noticia por defecto.';

        channel.publish(exchangeName, routingKey, Buffer.from(message));
        console.log(`[x] Noticia enviada (${routingKey}): '${message}'`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error('Error:', error);
    }
}

produceNews();