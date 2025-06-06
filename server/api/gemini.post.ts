import { GoogleGenAI } from '@google/genai'
import { defineEventHandler, readBody, createError, sendStream } from 'h3'
// Removed dotenv import

const API_KEY = process.env.GEMINI_API_KEY || ''

if (!API_KEY && process.env.NODE_ENV !== 'production') { // Only log fatal in dev if key is missing during setup
  console.error('[gemini.post.ts] FATAL: GEMINI_API_KEY is not set in the .env file.')
}

// Initialize GenAI client here, it might throw if API_KEY is truly empty and required by constructor
// However, GoogleGenAI constructor might not immediately throw for an empty key string.
// The actual API call will fail later if the key is invalid or missing.
const ai = new GoogleGenAI({ apiKey: API_KEY }) // Pass API_KEY directly
const modelName = 'gemini-2.0-flash' // Consider making this configurable via body or env

export default defineEventHandler(async (event) => {
  if (!API_KEY) { // Check API_KEY at the start of each request
    throw createError({
      statusCode: 500,
      statusMessage: 'API key not configured.',
      data: { success: false, reason: 'GEMINI_API_KEY not available on server.' }
    });
  }

  try {
    const body = await readBody(event)
    const {
      prompt,
      history = [],
      travelEra = '',
      stream = false,
      options = {},
    } = body

    if (!prompt) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Prompt is required.',
        data: { success: false }
      });
    }

    const contents = [...history]

    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    })

    const config = {
      responseMimeType: 'text/plain',
      ...(options.generationConfig && {
        generationConfig: options.generationConfig,
      }),
      ...(options.safetySettings && { safetySettings: options.safetySettings }),
    }

    if (stream) {
      // Correctly use ReadableStream with sendStream
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            const responseStream = await ai.models.generateContentStream({
              model: modelName,
              config,
              contents,
            });

            for await (const chunk of responseStream) {
              if (chunk && typeof chunk.text === 'string') {
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode(chunk.text));
              }
            }
            controller.close();
          } catch (streamingError: unknown) {
            console.error('[gemini.post.ts] Error during Gemini content streaming:', streamingError);
            // Ensure the error is an instance of Error for the controller
            const errorToSignal = streamingError instanceof Error ? streamingError : new Error(String(streamingError));
            controller.error(errorToSignal);
          }
        }
      });
      return sendStream(event, readableStream);
    } else {
      // Non-streaming response
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        config,
        contents,
      })

      let fullText = ''
      for await (const chunk of responseStream) {
        if (chunk && typeof chunk.text === 'string') {
          fullText += chunk.text
        } else {
          console.warn('Received unexpected chunk structure:', chunk)
        }
      }

      return {
        text: fullText,
        success: true,
      }
    }
  } catch (error: unknown) { // Changed to unknown
    console.error('[gemini.post.ts] Error calling Google AI API:', error);
    let errorMessage = 'An internal server error occurred processing Gemini request.';
    let statusCode = 500;
    const errorDetails: Record<string, any> = {
      originalError: String(error), // Convert unknown to string
      success: false,
    };

    if (error instanceof Error && error.message) {
      // It's good practice to check if error is an instance of Error before accessing .message
      if (error.message.includes('API key not valid')) {
        statusCode = 401; // Unauthorized
        errorMessage = 'Invalid or missing Gemini API Key.';
        errorDetails.reason = 'api_key_invalid';
      } else if (error.message.includes('not found') || error.message.includes('permission denied')) {
        statusCode = 404; // Not Found or Forbidden
        errorMessage = `Gemini model '${modelName}' not found or permission denied.`;
        errorDetails.reason = 'model_permission_or_not_found';
      } else if (error.message.includes('quota')) {
        statusCode = 429; // Too Many Requests
        errorMessage = 'Gemini API quota exceeded.';
        errorDetails.reason = 'quota_exceeded';
      } else {
        // Keep original message if not specifically handled
        errorMessage = error.message;
      }
    }
    
    // For stream errors, the headers might have already been sent.
    // This catch block primarily handles errors before streaming starts or for non-streaming requests.
    if (event.node.res.headersSent) {
      const messageToLog = error instanceof Error ? error.message : String(error);
      console.error(`[gemini.post.ts] Error after headers sent, cannot send new error response: ${messageToLog}`);
      // Optionally, try to end the stream if possible, though it might be too late.
      // event.node.res.end(); // This might corrupt the stream if not handled carefully.
      return; // Cannot throw createError here
    }

    throw createError({
      statusCode,
      statusMessage: errorMessage,
      data: errorDetails,
    });
  }
})
