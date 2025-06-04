import { GoogleGenAI } from '@google/genai';
import { defineEventHandler, readBody, setResponseStatus, sendStream } from 'h3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('FATAL: GEMINI_API_KEY is not set in the .env file.');
  // Optionally, throw an error during setup if the key is essential
}

// Initialize the Google AI client
const ai = new GoogleGenAI({ apiKey: API_KEY });
const modelName = 'gemini-2.0-flash'; // Using the correct model name from the example

export default defineEventHandler(async (event) => {
  if (!API_KEY) {
    setResponseStatus(event, 500);
    return { error: 'API key not configured', success: false };
  }

  try {
    const body = await readBody(event);
    const { prompt, history = [], travelEra = '', stream = false, options = {} } = body;

    if (!prompt) {
      setResponseStatus(event, 400);
      return { error: 'Prompt is required', success: false };
    }

    // Define contents based on the prompt and history
    const contents = [...history];
    
    // Add the current user message
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const config = {
      responseMimeType: 'text/plain',
      ...(options.generationConfig && { generationConfig: options.generationConfig }),
      ...(options.safetySettings && { safetySettings: options.safetySettings }),
    };
    
    // Handle streaming response differently
    if (stream) {
      // Set the correct headers for text streaming
      event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      event.node.res.setHeader('Cache-Control', 'no-cache');
      event.node.res.setHeader('Connection', 'keep-alive');
      event.node.res.setHeader('Transfer-Encoding', 'chunked');
      
      return sendStream(event, async (stream) => {
        try {
          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            config,
            contents,
          });
          
          // Stream each chunk directly to the client
          for await (const chunk of responseStream) {
            if (chunk && typeof chunk.text === 'string') {
              stream.write(chunk.text);
            }
          }
        } catch (error) {
          console.error('Error in stream:', error);
          stream.write(`Error: ${error.message}`);
        }
      });
    } else {
      // Non-streaming response (original behavior)
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        config,
        contents,
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        if (chunk && typeof chunk.text === 'string') {
          fullText += chunk.text;
        } else {
          console.warn('Received unexpected chunk structure:', chunk);
        }
      }

      return {
        text: fullText,
        success: true,
      };
    }
  } catch (error: any) {
    console.error('Error calling Google AI API:', error);
    // Provide more specific error handling if possible
    let errorMessage = 'An internal server error occurred';
    let statusCode = 500;
    if (error.message) {
        errorMessage = error.message;
        // Potentially set status based on error type, e.g., 4xx for client errors
        if (error.message.includes('API key not valid')) {
            statusCode = 401; // Unauthorized
            errorMessage = 'Invalid or missing API Key.'
        } else if (error.message.includes('not found') || error.message.includes('permission denied')) {
            statusCode = 404; // Or 403 Forbidden
            errorMessage = `Model ${modelName} not found or permission denied.`;
        }
    }

    setResponseStatus(event, statusCode);
    return {
      error: errorMessage,
      details: error.toString(), // Include full error string for debugging
      success: false,
    };
  }
});
