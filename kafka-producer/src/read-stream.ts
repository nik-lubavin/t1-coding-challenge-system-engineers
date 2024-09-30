import axios from "axios";
import { EventEmitter } from "events";


export async function readStreamBindEventEmitter(streamUrl: string, emitter: EventEmitter): Promise<void> {
  try {
    const response = await axios({
      method: "get",
      url: streamUrl,
      responseType: "stream",
    });

    const stream = response.data;
    let dataBuffer = "" as string; // To hold chunks of data as they arrive

    stream.on("data", (chunk: Buffer) => {
      dataBuffer += chunk; // Append incoming chunk to the buffer
      let lines = dataBuffer.split("\n");

      // last line
      dataBuffer = lines.pop() || "";
      dataBuffer = _removeRedudantSymbols(dataBuffer);

      const objs = lines
        // Skip empty lines
        .filter((line) => Boolean(line.trim()))
        .map((line) => {
          try {
            return JSON.parse(_removeRedudantSymbols(line));
          } catch (err) {
            // failed are skipped for now
            console.error("Failed to parse line into JSON:", err, line);
          }
        });

      emitter.emit("data", objs);
    });

    stream.on("end", () => {
      console.log("Stream ended");
    });

    // Listen for any errors in the stream
    stream.on("error", (err: Error) => {
      console.error("Error in stream:", err.message);
    });
  } catch (error: any) {
    console.error("Error connecting to stream:", error.message);
  }
}

function _removeRedudantSymbols(str: string): string {
  return str.replace("data:", "").trim();
}
