import { FinalKafkaObject } from "./typings";
import Calculation from "./models/calculation";

export async function processKafkaObject(data: FinalKafkaObject) {
  const sellPrice = parseFloat(data.sellPrice);
  const buyPrice = parseFloat(data.buyPrice);
  const { startTime, endTime, kafkaKey } = data;

  let calculationResult = 0;
  for (let trade of data.trades) {
    const volume = parseFloat(trade.volume);
    const type = trade.tradeType;

    const coef = type === "BUY" ? -1 : 1; // we buy - we spend money
    const price = type === "BUY" ? buyPrice : sellPrice;

    const additional = parseFloat((volume * price * coef).toFixed(2));
    console.log({ additional, volume, price });

    calculationResult += additional;
  }

  const calc = new Calculation({
    kafkaKey,
    startTime,
    endTime,
    calculationResult,
  });

  await calc.save();

  console.log("Processed: ", kafkaKey, startTime, endTime, calculationResult);
}
