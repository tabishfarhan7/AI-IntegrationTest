import GPT4js from "gpt4js";
import express from "express";
import cors from "cors";
import fs from "fs";
import { performance } from "perf_hooks"; // High-resolution time

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // To parse JSON request body

const options = {
  provider: "Nextway",
  model: "gpt-4o-free",
};

const logResponseTime = (input, response, responseTime) => {
  const logMessage = `User Input: ${input}\nAI Response: ${response}\nResponse Time: ${responseTime.toFixed(2)} ms\n\n`;
  fs.appendFile("response_logs.txt", logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

app.post("/api/ask", async (req, res) => {
  const { input } = req.body; // Get input from request body

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  const messages = [{ role: "user", content: input }];

  try {
    const provider = GPT4js.createProvider(options.provider);
    const startTime = performance.now(); // Start timing the response

    const text = await provider.chatCompletion(messages, options);

    const responseTime = performance.now() - startTime; // Calculate response time
    logResponseTime(input, text, responseTime); // Log response time

    res.json({ response: text, responseTime: responseTime.toFixed(2) });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
