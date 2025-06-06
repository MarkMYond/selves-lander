import OpenAI from 'openai'
import { defineEventHandler, readBody } from 'h3'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      systemPrompt,
      messages,
      tabId,
      modelName = 'gpt-4.1-2025-04-14',
    } = body

    if (!messages || !messages.length || !tabId) {
      return {
        statusCode: 400,
        body: { error: 'Missing required fields: messages, or tabId' },
      }
    }

    console.log(`Using OpenAI model: ${modelName} for non-streaming request`)

    const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

    if (systemPrompt) {
      apiMessages.push({ role: 'system', content: systemPrompt })
    }

    messages.forEach((msg: any) => {
      if (msg.role === 'user') {
        apiMessages.push({ role: 'user', content: msg.parts[0].text })
      } else if (msg.role === 'model') {
        apiMessages.push({ role: 'assistant', content: msg.parts[0].text })
      }
    })

    const lastMessage = apiMessages[apiMessages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      console.warn(
        'The last message in the history sent to OpenAI (non-streaming) is not from the user.'
      )
    }

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: apiMessages,
      temperature: 0.2,
      max_tokens: 16384,
    })

    const responseContent = completion.choices[0]?.message?.content

    if (responseContent === null || responseContent === undefined) {
      console.error('OpenAI response content is null or undefined.')
      return {
        statusCode: 500,
        body: { error: 'Failed to get valid content from OpenAI response' },
      }
    }

    return {
      statusCode: 200,
      response: responseContent,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error generating OpenAI response (non-streaming):', error)
    console.log('OpenAI API Key available:', !!process.env.OPENAI_API_KEY)
    console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length)
    if (process.env.OPENAI_API_KEY) {
      console.log(
        'First 4 chars of OpenAI API key:',
        process.env.OPENAI_API_KEY.substring(0, 4)
      )
    }

    return {
      statusCode: 500,
      body: {
        error: 'Failed to generate OpenAI response (non-streaming)',
        details: error.message || String(error),
      },
    }
  }
})
