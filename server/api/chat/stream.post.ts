import OpenAI from 'openai'
import { defineEventHandler, sendStream, readBody } from 'h3'

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Cache for ongoing conversations (though OpenAI's API is stateless for chat completions,
// we might still want to manage context on our side if needed for more complex scenarios,
// but for simple streaming, we'll pass the history each time)
// For now, this cache won't be used in the same way as with Gemini's chat sessions.

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    // modelName is now specific to OpenAI, e.g., "gpt-4.1-2025-04-14"
    const {
      systemPrompt,
      messages,
      tabId,
      modelName = 'gpt-4.1-2025-04-14',
    } = body

    if (!messages || !messages.length || !tabId) {
      // System prompt is optional for OpenAI, but messages and tabId are essential
      return { error: 'Missing required fields (messages, tabId)' }
    }

    console.log(`Streaming with OpenAI model: ${modelName}`)

    // Prepare messages for OpenAI API
    // OpenAI expects messages in the format: { role: "user" | "assistant" | "system", content: string }
    // The 'systemPrompt' will be the first message with role 'system'.
    const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

    if (systemPrompt) {
      apiMessages.push({ role: 'system', content: systemPrompt })
    }

    // Convert our message format to OpenAI's format
    // Our 'messages' are { role: "user" | "model", parts: [{ text: string }] }
    // OpenAI 'messages' are { role: "user" | "assistant", content: string }
    messages.forEach((msg: any) => {
      if (msg.role === 'user') {
        apiMessages.push({ role: 'user', content: msg.parts[0].text })
      } else if (msg.role === 'model') {
        // 'model' in our app corresponds to 'assistant' in OpenAI
        apiMessages.push({ role: 'assistant', content: msg.parts[0].text })
      }
    })

    // Ensure the last message is from the user if that's a requirement for your logic
    // (OpenAI API itself doesn't strictly require this for a new completion, but it's typical for a chat turn)
    const lastMessage = apiMessages[apiMessages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      // If the last message isn't from the user, we might be missing context or it's an invalid sequence.
      // For now, we'll proceed, but this could be a point of error handling.
      console.warn(
        'The last message in the history sent to OpenAI is not from the user.'
      )
    }

    // Request a streaming completion from OpenAI
    const stream = await openai.chat.completions.create({
      model: modelName,
      messages: apiMessages,
      stream: true,
      temperature: 0.2,
      max_tokens: 16384,
    })

    // Create a readable stream from the OpenAI response
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              const encoder = new TextEncoder()
              const encoded = encoder.encode(content)
              controller.enqueue(encoded)
            }
          }
          controller.close()
        } catch (error) {
          console.error('Error processing OpenAI stream:', error)
          controller.error(error)
        }
      },
    })

    return sendStream(event, readable)
  } catch (err) {
    const error = err as Error
    console.error('Error streaming OpenAI response:', error)
    // Log API key status for debugging, but be careful with logging actual keys
    console.log('OpenAI API Key available:', !!process.env.OPENAI_API_KEY)
    console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length)
    if (process.env.OPENAI_API_KEY) {
      console.log(
        'First 4 chars of OpenAI API key:',
        process.env.OPENAI_API_KEY.substring(0, 4)
      )
    }

    return {
      error: 'Failed to stream OpenAI response',
      details: error.message || String(error),
    }
  }
})
