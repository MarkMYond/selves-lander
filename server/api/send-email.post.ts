import { Resend } from 'resend'

// Initialize Resend with the API key from environment variables
// Ensure you have RESEND_API_KEY set in your Vercel environment
const resend = new Resend(process.env.RESEND_API_KEY)

// Define the expected structure of the request body
interface EmailPayload {
  name: string
  email: string
  company?: string
  position?: string
}

export default defineEventHandler(async (event) => {
  try {
    // Read and parse the request body
    const body = await readBody<EmailPayload>(event)

    // Validate required fields
    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name and email are required.',
      })
    }

    // Email details
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@taash.ai'
    const toEmail = process.env.RESEND_TO_EMAIL || 'hello@taash.ai'
    const subject = `New Contact Form Submission from ${body.name}`

    // Construct email content
    let htmlContent = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
    `
    if (body.company) {
      htmlContent += `<p><strong>Company:</strong> ${body.company}</p>`
    }
    if (body.position) {
      htmlContent += `<p><strong>Position:</strong> ${body.position}</p>`
    }

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail], // Resend expects an array of strings for 'to'
      subject: subject,
      html: htmlContent,
    })

    // Handle Resend API errors
    if (error) {
      console.error('Resend API Error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send email.',
        data: error, // Optionally include Resend error details
      })
    }

    // Return a success response
    return {
      statusCode: 200,
      message: 'Email sent successfully!',
      data, // Optionally include Resend success data
    }
  } catch (err: any) {
    // Log the error
    console.error('Error in send-email handler:', err)

    // Return an appropriate error response
    // If it's already an H3Error, rethrow it, otherwise create a new one
    if (err.statusCode) {
      throw err
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred.',
      data: err.message,
    })
  }
})
