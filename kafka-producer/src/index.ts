import EventEmitter from "events";
import { readStreamBindEventEmitter } from "./read-stream";
import { setupKafkaProducerBindEventEmitter } from "./kafka-producer";

const STREAM_URL: string =
  "https://t1-coding-challenge-9snjm.ondigitalocean.app/stream";

let kafkaReady = false;

// Create an instance of EventEmitter
class EmitterClass extends EventEmitter {}
const appEvents = new EmitterClass();

// ==========

const producer = setupKafkaProducerBindEventEmitter(appEvents);

// Message to send
const key = "example-key";
const topic = "test-topic"; // Your Kafka topic

readStreamBindEventEmitter(STREAM_URL, appEvents);

appEvents.on("producer_ready", () => {
  kafkaReady = true;
});

appEvents.on("data", (data) => {
  if (!kafkaReady) return;

  // Produce the message to the specified topic
  producer.produce(
    topic, // Topic to send message to
    null, // Partition (null to use default partitioner)
    Buffer.from(data), // Message value (as a buffer)
    key, // Key
    Date.now() // Timestamp
  );

  const marketMsg = data.filter((obj) => obj.messageType === "market");

  console.log("emitted data", marketMsg, data, kafkaReady);
});
