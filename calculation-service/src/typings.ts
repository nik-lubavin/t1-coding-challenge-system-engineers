export interface FinalKafkaObject {
  startTime: string;
  endTime: string;
  sellPrice: string;
  buyPrice: string;
  kafkaKey: number;
  trades: TradeKafkaObject[];
}

interface TradeKafkaObject {
  messageType?: string;
  tradeType: "SELL" | "BUY";
  volume: string;
  time: string;
}
