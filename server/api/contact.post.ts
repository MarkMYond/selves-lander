import { Resend } from 'resend'
import { defineEventHandler, readBody, createError } from 'h3' // Ensure all h3 imports are here

interface ContactFormBody {
  name?: string
  email: string
  company?: string
  subject?: string
  message?: string
  recipientEmail: string
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const resendApiKey =
    runtimeConfig.resendApiKey || process.env.NUXT_RESEND_API_KEY

  if (!resendApiKey) {
    console.error('[contact.post.ts] Resend API key is not configured.') // Added prefix
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service is not configured.',
    })
  }

  const resend = new Resend(resendApiKey)

  try {
    const body = await readBody<ContactFormBody>(event) // Use defined interface

    // Validate recipientEmail
    if (
      !body.recipientEmail ||
      typeof body.recipientEmail !== 'string' ||
      body.recipientEmail.trim() === ''
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          '[contact.post.ts] Invalid or missing recipientEmail in request body:',
          body.recipientEmail
        );
      }
      throw createError({
        statusCode: 400,
        statusMessage: 'Recipient email is invalid or missing.',
      })
    }
    // Validate sender email
    if (
      !body.email ||
      typeof body.email !== 'string' ||
      body.email.trim() === ''
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Sender email is invalid or missing.',
      })
    }

    // Destructure with the defined type
    const {
      name,
      email,
      company,
      subject,
      message,
      recipientEmail,
    } = body

    // Configure your "from" address (must be a verified domain with Resend)
    const configuredFromEmail =
      runtimeConfig.public.resendFromEmail ||
      process.env.NUXT_PUBLIC_RESEND_FROM_EMAIL
    if (
      !configuredFromEmail ||
      typeof configuredFromEmail !== 'string' ||
      configuredFromEmail.trim() === ''
    ) {
      console.error(
        '[contact.post.ts] From email is not configured correctly. Please set NUXT_PUBLIC_RESEND_FROM_EMAIL or runtimeConfig.public.resendFromEmail.'
      )
      throw createError({
        statusCode: 500,
        statusMessage: 'Email service "from" address is not configured.',
      })
    }
    const fromEmail: string = configuredFromEmail

    const emailSubject =
      subject || `Contact Form Submission from ${name || email}`

    let emailHtmlContent = `<p>You have a new contact form submission:</p><ul>`
    if (name) emailHtmlContent += `<li><strong>Name:</strong> ${name}</li>`
    emailHtmlContent += `<li><strong>Email:</strong> ${email}</li>`
    if (company)
      emailHtmlContent += `<li><strong>Company:</strong> ${company}</li>`
    if (subject)
      emailHtmlContent += `<li><strong>Subject:</strong> ${subject}</li>`
    if (message)
      emailHtmlContent += `<li><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</li>`
    emailHtmlContent += `</ul>`

    // Create plain text version
    let emailTextContent = `You have a new contact form submission:\n\n`
    if (name) emailTextContent += `Name: ${name}\n`
    emailTextContent += `Email: ${email}\n`
    if (company) emailTextContent += `Company: ${company}\n`
    if (subject) emailTextContent += `Subject: ${subject}\n`
    if (message) emailTextContent += `Message:\n${message}\n`

    const finalRecipientEmail: string = recipientEmail

    const emailToSend = {
      from: fromEmail,
      to: finalRecipientEmail,
      subject: emailSubject,
      html: emailHtmlContent,
      text: emailTextContent,
    }

    const { data, error: resendError } = await resend.emails.send(emailToSend) // Renamed error to avoid conflict

    if (resendError) { // Check resendError
      console.error('[contact.post.ts] Resend API Error:', resendError)
      throw createError({
        statusCode: 500, // Or use resendError.statusCode if available and appropriate
        statusMessage: 'Failed to send email.',
        data: { name: resendError.name, message: resendError.message }
      })
    }

    return { message: 'Message sent successfully!', data }
  } catch (error: unknown) { // Changed to unknown
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('[contact.post.ts] Error in contact form handler:', errorMessage, error);
    
    // If the error is already an H3Error (e.g., from createError calls above), re-throw it
    if (typeof error === 'object' && error !== null && 'statusCode' in error && 'statusMessage' in error) {
        throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'An internal server error occurred while processing the contact form.',
      data: { originalError: errorMessage }
    })
  }
})
