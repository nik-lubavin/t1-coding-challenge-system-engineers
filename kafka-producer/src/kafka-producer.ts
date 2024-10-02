import Kafka from "node-rdkafka";
import { TOPIC, TOPIC_PARTITIONS } from "./constants";

export async function setupKafkaProducer(): Promise<Kafka.Producer> {
  // Waiting topic to be created
  // await _createTopic();

  // Create a Kafka producer
  const producer = new Kafka.Producer({
    "metadata.broker.list": "host.docker.internal:29092", // Update with your broker list
    dr_cb: true, // Delivery report callback
  });
  producer.connect();

  return new Promise((res, rej) => {
    producer.on("ready", () => {
      console.log("Producer ready...");

      res(producer);
    });

    // Handle connection errors
    producer.on("event.error", (err) => {
      console.error("Producer error:", err);
      rej();
    });
  });
}

function _createTopic(): Promise<void> {
  console.log("ADMIN:", "host.docker.internal:29092");
  const adminClient = Kafka.AdminClient.create({
    "client.id": "my-app",
    "metadata.broker.list": "host.docker.internal:29092", // Update with your Kafka broker address
  });

  return new Promise((resolve, reject) => {
    adminClient.createTopic(
      {
        topic: TOPIC,
        num_partitions: TOPIC_PARTITIONS,
        replication_factor: 1,
      },
      (err) => {
        adminClient.disconnect();
        if (err) {
          console.error("Error creating topic:", err);
          return reject(err);
        }

        console.log(
          `Topic '${TOPIC}' created with ${TOPIC_PARTITIONS} partitions.`
        );
        return resolve();
      }
    );
  });
}
