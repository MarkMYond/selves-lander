import OpenAI from 'openai';
import { d as defineEventHandler, r as readBody, s as sendStream } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'node:url';
import 'ipx';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});
const stream_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { systemPrompt, messages, tabId, modelName = "gpt-4.1-2025-04-14" } = body;
    if (!messages || !messages.length || !tabId) {
      return { error: "Missing required fields (messages, tabId)" };
    }
    console.log(`Streaming with OpenAI model: ${modelName}`);
    const apiMessages = [];
    if (systemPrompt) {
      apiMessages.push({ role: "system", content: systemPrompt });
    }
    messages.forEach((msg) => {
      if (msg.role === "user") {
        apiMessages.push({ role: "user", content: msg.parts[0].text });
      } else if (msg.role === "model") {
        apiMessages.push({ role: "assistant", content: msg.parts[0].text });
      }
    });
    const lastMessage = apiMessages[apiMessages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      console.warn("The last message in the history sent to OpenAI is not from the user.");
    }
    const stream = await openai.chat.completions.create({
      model: modelName,
      messages: apiMessages,
      stream: true,
      temperature: 0.2,
      max_tokens: 16384
    });
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              const encoder = new TextEncoder();
              const encoded = encoder.encode(content);
              controller.enqueue(encoded);
            }
          }
          controller.close();
        } catch (error) {
          console.error("Error processing OpenAI stream:", error);
          controller.error(error);
        }
      }
    });
    return sendStream(event, readable);
  } catch (err) {
    const error = err;
    console.error("Error streaming OpenAI response:", error);
    console.log("OpenAI API Key available:", !!process.env.OPENAI_API_KEY);
    console.log("OpenAI API Key length:", process.env.OPENAI_API_KEY?.length);
    if (process.env.OPENAI_API_KEY) {
      console.log("First 4 chars of OpenAI API key:", process.env.OPENAI_API_KEY.substring(0, 4));
    }
    return {
      error: "Failed to stream OpenAI response",
      details: error.message || String(error)
    };
  }
});

export { stream_post as default };
//# sourceMappingURL=stream.post.mjs.map
