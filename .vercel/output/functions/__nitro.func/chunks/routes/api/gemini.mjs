import { n as node } from '../../_/index.mjs';
import { d as defineEventHandler, a as setResponseStatus, r as readBody, s as sendStream } from '../../nitro/nitro.mjs';
import dotenv from 'dotenv';
import 'google-auth-library';
import 'ws';
import 'fs/promises';
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

dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY) {
  console.error("FATAL: GEMINI_API_KEY is not set in the .env file.");
}
const ai = new node.GoogleGenAI({ apiKey: API_KEY });
const modelName = "gemini-2.0-flash";
const gemini = defineEventHandler(async (event) => {
  if (!API_KEY) {
    setResponseStatus(event, 500);
    return { error: "API key not configured", success: false };
  }
  try {
    const body = await readBody(event);
    const { prompt, history = [], travelEra = "", stream = false, options = {} } = body;
    if (!prompt) {
      setResponseStatus(event, 400);
      return { error: "Prompt is required", success: false };
    }
    const contents = [...history];
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });
    const config = {
      responseMimeType: "text/plain",
      ...options.generationConfig && { generationConfig: options.generationConfig },
      ...options.safetySettings && { safetySettings: options.safetySettings }
    };
    if (stream) {
      event.node.res.setHeader("Content-Type", "text/plain; charset=utf-8");
      event.node.res.setHeader("Cache-Control", "no-cache");
      event.node.res.setHeader("Connection", "keep-alive");
      event.node.res.setHeader("Transfer-Encoding", "chunked");
      return sendStream(event, async (stream2) => {
        try {
          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            config,
            contents
          });
          for await (const chunk of responseStream) {
            if (chunk && typeof chunk.text === "string") {
              stream2.write(chunk.text);
            }
          }
        } catch (error) {
          console.error("Error in stream:", error);
          stream2.write(`Error: ${error.message}`);
        }
      });
    } else {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        config,
        contents
      });
      let fullText = "";
      for await (const chunk of responseStream) {
        if (chunk && typeof chunk.text === "string") {
          fullText += chunk.text;
        } else {
          console.warn("Received unexpected chunk structure:", chunk);
        }
      }
      return {
        text: fullText,
        success: true
      };
    }
  } catch (error) {
    console.error("Error calling Google AI API:", error);
    let errorMessage = "An internal server error occurred";
    let statusCode = 500;
    if (error.message) {
      errorMessage = error.message;
      if (error.message.includes("API key not valid")) {
        statusCode = 401;
        errorMessage = "Invalid or missing API Key.";
      } else if (error.message.includes("not found") || error.message.includes("permission denied")) {
        statusCode = 404;
        errorMessage = `Model ${modelName} not found or permission denied.`;
      }
    }
    setResponseStatus(event, statusCode);
    return {
      error: errorMessage,
      details: error.toString(),
      // Include full error string for debugging
      success: false
    };
  }
});

export { gemini as default };
//# sourceMappingURL=gemini.mjs.map
