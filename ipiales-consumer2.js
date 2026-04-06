const amqp = require('amqplib');
const rabbitmqUrl = 'amqp://guest:guest@localhost:5672/';

async function consumeColombiaNews() {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        const exchangeName = 'university_topic_news';

        await channel.assertExchange(exchangeName, 'topic', { durable: false });

        const q = await channel.assertQueue('', { exclusive: true });
        console.log(`[*] ESede Ipiales en la cola: ${q.queue}`);
        
        // 1. El patrón 'ipiales.#' significa:
        // "Recibir cualquier mensaje que empiece con 'ipiales.' seguido de cero o más palabras"

        const bindingPattern = '#.critica';
        // const bindingPattern = 'ipiales.#';
        channel.bindQueue(q.queue, exchangeName, bindingPattern);

        channel.consume(q.queue, (msg) => {
            console.log(`[X] Notificacion sede Ipiales Recibida (${msg.fields.routingKey}): '${msg.content.toString()}'`);
        }, { noAck: true });
    } catch (error) {
        console.error('Error:', error);
    }
}

consumeColombiaNews();