import EventEmitter from "events";
import { readStreamBindEventEmitter } from "./read-stream";
import { setupKafkaProducer } from "./kafka-producer";
import { TOPIC } from "./constants";

const STREAM_URL: string =
  "https://t1-coding-challenge-9snjm.ondigitalocean.app/stream";

let kafkaReady = false;
console.log('gghutghutuhgtuhghtuhg')

async function main() {
  // Create an instance of EventEmitter
  class EmitterClass extends EventEmitter {}
  const appEvents = new EmitterClass();

  // ====
  const producer = await setupKafkaProducer();


  // ====
  readStreamBindEventEmitter(STREAM_URL, appEvents);

  let currentInterval;
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

          console.log("Produced: ", currentInterval);
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

    // Produce the message to the specified topic
    //   producer.produce(
    //     topic, // Topic to send message to
    //     null, // Partition (null to use default partitioner)
    //     Buffer.from(data), // Message value (as a buffer)
    //     key, // Key
    //     Date.now() // Timestamp
    //   );

    //   const marketMsg = data.filter((obj) => obj.messageType === "market");

    //   console.log("emitted data", marketMsg, data, kafkaReady);
  });
}

main();
