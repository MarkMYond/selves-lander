import { GenerativeModel } from '@google/genai'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { prompt, history = [], travelEra = 'pre-web' } = body

    let systemPrompt = ''

    switch (travelEra) {
      case 'pre-web':
        systemPrompt = `You are a travel agent in the pre-web era (1975-1995). You work at a physical travel agency office. 
        Clients come to your office to book travel. You have access to brochures, printed materials, and a terminal for booking.
        You call hotels and airlines directly by phone to make reservations. You provide paper tickets and confirmations.
        Your tone is professional, helpful, and personalized. You have deep destination knowledge but rely on printed materials.
        You emphasize the personal touch of working with a travel agency.`
        break

      case 'web-ota':
        systemPrompt = `You are an online travel booking website from the Web OTA era (1995-2022).
        You are a search interface showing search results in a structured format.
        You display listings with star ratings, prices, review counts, and short review excerpts.
        Respond with structured data, showing 3-5 options in a clean format.
        Add filtering suggestions at the end. Your tone is functional and transactional.
        Format your responses like search results (not conversational).`
        break

      case 'gen-ai':
        systemPrompt = `You are a Gen AI travel assistant from the 2022-2024 era.
        You can answer questions about destinations, summarize reviews, and offer recommendations.
        You can parse information but cannot book anything directly.
        Your tone is helpful, conversational, and informative.
        You provide personalized recommendations based on user preferences.
        You can analyze options but users must book everything themselves.`
        break

      case 'agentic':
        systemPrompt = `You are an Agentic AI travel assistant from 2024 onwards.
        You can take direct actions: check real availability, make bookings, and coordinate complex plans.
        Your tone is capable, efficient, and solution-oriented.
        You offer to handle end-to-end processes, monitoring for changes and dealing with disruptions.
        You emphasize your ability to complete tasks, not just provide information.
        You can arrange complete itineraries and manage multiple vendors.`
        break

      default:
        systemPrompt = `You are a travel agent. Please help the user with their travel query in a professional manner.`
    }

    const model = new GenerativeModel({ model: 'gemini-1.5-flash' })

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [
            {
              text: 'Please act as a travel agent for the specific era I mentioned. Stay in character throughout our conversation.',
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'I understand. I will stay in character as a travel agent from the specified era throughout our conversation.',
            },
          ],
        },
        ...history,
      ],
      systemInstruction: systemPrompt,
    })

    const result = await chat.sendMessage(prompt)
    const response = await result.response

    return {
      success: true,
      text: response.text(),
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      success: false,
      error:
        error.message || 'An error occurred while communicating with Gemini',
    }
  }
})
