const amqp = require('amqplib');
const rabbitmqUrl = 'amqp://guest:guest@localhost:5672/';

async function consumeColombiaNews() {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        const exchangeName = 'topic_news';

        await channel.assertExchange(exchangeName, 'topic', { durable: false });

        const q = await channel.assertQueue('', { exclusive: true });
        console.log(`[*] Esperando noticias de Colombia en la cola: ${q.queue}`);
        
        // 1. El patrón 'colombia.#' significa:
        // "Recibir cualquier mensaje que empiece con 'colombia.' seguido de cero o más palabras"
        const bindingPattern = 'colombia.#';
        channel.bindQueue(q.queue, exchangeName, bindingPattern);

        channel.consume(q.queue, (msg) => {
            console.log(`[🇨🇴] Noticia de Colombia Recibida (${msg.fields.routingKey}): '${msg.content.toString()}'`);
        }, { noAck: true });
    } catch (error) {
        console.error('Error:', error);
    }
}

consumeColombiaNews();