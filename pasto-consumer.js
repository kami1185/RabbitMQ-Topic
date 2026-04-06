const amqp = require('amqplib');
const rabbitmqUrl = 'amqp://guest:guest@localhost:5672/';

async function sendNotificationsUniversity() {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        const exchangeName = 'university_topic_news';

        await channel.assertExchange(exchangeName, 'topic', { durable: false });

        const q = await channel.assertQueue('', { exclusive: true });
        console.log(`[*] sede Pasto en la cola: ${q.queue}`);
        
        // 1. El patrón 'pasto.#' significa:
        // "Recibir cualquier mensaje que empiece con 'pasto.' seguido de cero o más palabras"

        // Terminal,Rol del Consumidor,Comando de inicio sugerido
        // T1,Especialista Ingeniería,"node consumer.js ""*.ingenieria.#"""
        // T2,Coordinador Pasto,"node consumer.js ""pasto.#"""
        // T3,Agraria Regional,"node consumer.js ""#.agraria.#"""
        // T4,Emergencias Críticas,"node consumer.js ""#.critica"""        #.*.critica
        // T5,Auditoría Total,"node consumer.js ""#"""

        const bindingPattern = '#.critica';
        // const bindingPattern = 'pasto.ingenieria.#';
        channel.bindQueue(q.queue, exchangeName, bindingPattern);

        channel.consume(q.queue, (msg) => {
            console.log(`[X] Notificacion sede Pasto Recibida (${msg.fields.routingKey}): '${msg.content.toString()}'`);
        }, { noAck: true });
    } catch (error) {
        console.error('Error:', error);
    }
}

sendNotificationsUniversity();