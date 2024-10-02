import EventEmitter from "events";
import { readStreamBindEventEmitter } from "./read-stream";
import { setupKafkaProducer } from "./kafka-producer";
import { TOPIC } from "./constants";

const STREAM_URL: string =
  "https://t1-coding-challenge-9snjm.ondigitalocean.app/stream";

async function main() {
  // Create an instance of EventEmitter
  class EmitterClass extends EventEmitter {}
  const appEvents = new EmitterClass();

  // ====
  const producer = await setupKafkaProducer();

  // ====
  readStreamBindEventEmitter(STREAM_URL, appEvents);

  let currentInterval;

  // TODO fix to timestamp
  let kafkaKey = 0;

  appEvents.on("data", (data) => {
    for (let dataObj of data) {
      if (dataObj.messageType === "market") {
        if (currentInterval) {
          producer.produce(
            TOPIC, // Topic to send message to
            null, // Partition (null to use default partitioner)
            Buffer.from(JSON.stringify(currentInterval)), // Message value (as a buffer)
            currentInterval.kafkaKey, // Key
            Date.now() // Timestamp
          );

          console.log("Produced: ", currentInterval.kafkaKey);
        }

        kafkaKey += 1;
        currentInterval = {
          startTime: dataObj.startTime,
          endTime: dataObj.endTime,
          sellPrice: dataObj.sellPrice,
          buyPrice: dataObj.buyPrice,
          trades: [],
          kafkaKey,
        };
      } else {
        if (!currentInterval) continue;

        // TODO check if interval is valid
        currentInterval.trades.push(dataObj);
      }
    }
  });
}

main();
