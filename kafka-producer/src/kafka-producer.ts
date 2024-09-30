import EventEmitter from "events";

import Kafka from "node-rdkafka";

export function setupKafkaProducerBindEventEmitter(emitter: EventEmitter) {
  // Create a Kafka producer
  const producer = new Kafka.Producer({
    "metadata.broker.list": "localhost:9092", // Update with your broker list
    dr_cb: true, // Delivery report callback
  });

  // Handle connection errors
  producer.on("event.error", (err) => {
    console.error("Producer error:", err);
  });

  producer.on("ready", () => {
    console.log("Producer ready...");

    emitter.emit("producer_ready");
  });

  producer.connect();

  return producer;
}
