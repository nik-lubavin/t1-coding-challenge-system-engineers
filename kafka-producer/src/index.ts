import EventEmitter from "events";
import { readStreamBindEventEmitter } from "./read-stream";
import Kafka from "node-rdkafka";

const STREAM_URL: string =
  "https://t1-coding-challenge-9snjm.ondigitalocean.app/stream";

// Create an instance of EventEmitter
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// ==========
let kafkaReady = false;

// Create a Kafka producer
const producer = new Kafka.Producer({
  "metadata.broker.list": "localhost:9092", // Update with your broker list
  dr_cb: true, // Delivery report callback
});

// Message to send
const key = "example-key";
const value = "Hello Kafka!";
const topic = "test-topic"; // Your Kafka topic

// Ready event to ensure the producer is connected
producer.on("ready", () => {
  console.log("Producer ready...");

  try {
    kafkaReady = true;
  } catch (err) {
    console.error("Error producing message:", err);
  }
});

// Handle connection errors
producer.on("event.error", (err) => {
  console.error("Producer error:", err);
});

// Connect the producer
producer.connect();

readStreamBindEventEmitter(STREAM_URL, myEmitter);

myEmitter.on("data", (data) => {
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
