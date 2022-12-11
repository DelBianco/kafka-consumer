import { Kafka} from 'kafkajs';

const maxBufferSize = 10;
let buffer = [];

async function AsyncConsumer(options) {
    const kafkaClient = new Kafka({
        clientId: options.clientId,
        brokers: options.brokers,
    });
    const kafkaConsumer = kafkaClient.consumer({groupId: options.groupId});
    const kafkaAdmin = kafkaClient.admin();
    let timer = 10;
    setInterval(() => {
        timer -= 1;
    }, 1000);
    let topicList = await this.kafkaAdmin.listTopics();
    topicList = topicList.filter((topic) => topic.substring(0, 2) !== '__');
    topicList.forEach((topic) => {
        this.buffer?.push({
            topic,
            buffer: []
        });
    });

    try {
        await kafkaConsumer.connect();
        await kafkaConsumer.subscribe({
            topics: topicList,
            fromBeginning: true
        });
        await kafkaConsumer.run({
            eachMessage: async ({topic, partition, message, pause}) => {
                storeMessage(topic, `${message.value}`, partition);
                if (timer === 0) {
                    pause();
                    throw new DOMException('timeout');
                }
            },
        });
    } catch (error) {
        await kafkaConsumer.disconnect();
    }
}

function storeMessage(topic, message, partition) {
    buffer.filter((buff) => buff.topic === topic)
        .map((buff) => {
            buff.buffer.push(
                {
                    topic: topic,
                    message: message,
                    partition: partition
                }
            );
            if (maxBufferSize >= buff.buffer.length) {
                buff.buffer.shift();
            }
            return buff;
        });
}
