import Kafka from "node-rdkafka";

import { TOPIC } from "./constants";
import { FinalKafkaObject } from "./typings";
import { processKafkaObject } from "./calculation-service";
import { mongoDBConnect } from "./mongodb";

(async function () {
  // 1.
  await mongoDBConnect();

  // Create a consumer instance
  const consumer = new Kafka.KafkaConsumer(
    {
      "group.id": "my-group", // Consumer group id
      "metadata.broker.list": "127.0.0.1:9092", // Kafka broker
    },
    {}
  );

  // Event when consumer is ready to consume messages
  consumer
    .on("ready", () => {
      console.log(`Consumer ready. Subscribing to topic: ${TOPIC}...`);

      // Subscribe to the topic
      consumer.subscribe([TOPIC]);

      // Start consuming messages
      consumer.consume();
    })
    .on("data", async (data: Kafka.Message) => {
      const val = data?.value?.toString();
      // Message consumed from Kafka
      if (val) {
        const parsedVal = JSON.parse(val) as FinalKafkaObject;
        await processKafkaObject(parsedVal);
      }
    });

  // Handle errors
  consumer.on("event.error", (err) => {
    console.error("Error from consumer:", err);
  });

  // Connect to Kafka broker
  consumer.connect();
})();
