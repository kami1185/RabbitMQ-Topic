const amqp = require('amqplib');
const rabbitmqUrl = 'amqp://guest:guest@localhost:5672/';

async function produceNews() {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        const exchangeName = 'university_topic_news';

        await channel.assertExchange(exchangeName, 'topic', { durable: false });

        // Formato de routing key: <sede>.<facultad>.<notification>
        const routingKey = process.argv[2] || 'pasto.facultad.notification';
        const message = process.argv[3] || 'Mañana no hay clases.';

        channel.publish(exchangeName, routingKey, Buffer.from(message));
        console.log(`[x] Noticia enviada (${routingKey}): '${message}'`);

        // Formato de routing key: <sede>.<facultad>.<notification>
        // const routingKey2 = process.argv[2] || 'argentina.deportes';
        // const message2 = process.argv[3] || 'River juega semifinal.';

        channel.publish(exchangeName, routingKey2, Buffer.from(message));
        console.log(`[x] Notificacion enviada (${routingKey}): '${message}'`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error('Error:', error);
    }
}

produceNews();


