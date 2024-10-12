// import GPT4js from "gpt4js";
// const messages = [{ role: "user", content: "hi!" }];
// const options = {
//   provider: "Nextway",
//   model: "gpt-4o-free",
// };

// (async () => {
//   const provider = GPT4js.createProvider(options.provider);
//   try {
//     const text = await provider.chatCompletion(messages, options, (data) => {
//       console.log(data);
//     });
//     console.log(text);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();

// import GPT4js from "gpt4js";
// import readline from "readline"; // Import readline for user input

// const options = {
//   provider: "Nextway",
//   model: "gpt-4o-free",
// };
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// (async () => {
//   const provider = GPT4js.createProvider(options.provider);
//   const askQuestion = () => {
//     rl.question("You: ", async (input) => {
//       if (input.toLowerCase() === "stop") {
//         console.log("Conversation ended.");
//         rl.close(); 
//         return;
//       }
//       const messages = [{ role: "user", content: input }];
//       try {
//         const text = await provider.chatCompletion(messages, options, (data) => {
//           console.log(data); 
//         });
//         console.log("GPT-4: " + text); 
//       } catch (error) {
//         console.error("Error:", error);
//       }
//       askQuestion(); 
//     });
//   };

//   askQuestion(); 
// })();


// import GPT4js from "gpt4js";
// import readline from "readline"; // Import readline for user input

// const options = {
//   provider: "Nextway",
//   model: "gpt-4o-free",
// };

// // Create a readline interface for user input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// (async () => {
//   const provider = GPT4js.createProvider(options.provider);

//   const askQuestion = () => {
//     rl.question("You: ", async (input) => {
//       if (input.toLowerCase() === "stop") {
//         console.log("Conversation ended.");
//         rl.close();
//         return;
//       }
//       const messages = [{ role: "user", content: input }];
//       console.time("Response Time");
//       try {
//         const text = await provider.chatCompletion(messages, options);
//         console.log("GPT-4: " + text);
//       } catch (error) {
//         console.error("Error:", error);
//       }
//       console.timeEnd("Response Time");
//       askQuestion(); 
//     });
//   };

//   askQuestion();
// })();


import GPT4js from "gpt4js";
import readline from "readline"; 
import fs from "fs"; 
import { performance } from "perf_hooks";
const options = {
  provider: "Nextway",
  model: "gpt-4o-free",
};
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const typeEffect = (text, speed = 100) => {
  return new Promise((resolve) => {
    let index = 0;
    const words = text.split(' ');
    const printWord = () => {
      if (index < words.length) {
        process.stdout.write(words[index] + ' ');
        index++;
        setTimeout(printWord, speed);
      } 
      else{
        resolve();
      }
    };
    printWord();
  });
};

const logResponseTime = (input, response, responseTime) => {
  const logMessage = `User Input: ${input}\nAI Response: ${response}\nResponse Time: ${responseTime.toFixed(2)} ms\n\n`;
  fs.appendFile("response_logs.txt", logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

(async () => {
  const provider = GPT4js.createProvider(options.provider);
  const askQuestion = () => {
    rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "stop") {
        console.log("\nConversation ended.");
        rl.close();
        return;
      }
      const messages = [{ role: "user", content: input }];
      try {
        const startTime = performance.now();
        const text = await provider.chatCompletion(messages, options);
        const responseTime = performance.now() - startTime;
        console.log("GPT-4: ");
        await typeEffect(text);
        console.log(); 
        logResponseTime(input, text, responseTime);
        console.log(`Response time: ${responseTime.toFixed(2)} ms`);
      } catch (error) {
        console.error("Error:", error);
      }

      askQuestion(); 
    });
  };

  askQuestion();
})();
