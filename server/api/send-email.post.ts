import { Resend } from 'resend'

import { defineEventHandler, readBody, createError, H3Error } from 'h3'; // Ensure h3 imports, add H3Error

// Initialize Resend with the API key from environment variables
// Ensure you have RESEND_API_KEY set in your Vercel environment
const RESEND_API_KEY = process.env.RESEND_API_KEY;
let resend: Resend | null = null;
if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else {
  console.error('[send-email.post.ts] RESEND_API_KEY is not set. Email functionality will be disabled.');
}

// Define the expected structure of the request body
interface EmailPayload {
  name: string
  email: string
  company?: string
  position?: string
}

export default defineEventHandler(async (event) => {
  if (!resend) {
    console.error('[send-email.post.ts] Resend client not initialized due to missing API key.');
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service is not configured correctly.',
    });
  }

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
    // It's better to get these from runtimeConfig if possible, or ensure they are securely set.
  const fromEmail = (useRuntimeConfig(event).public?.resendFromEmail as string) || process.env.RESEND_FROM_EMAIL || ''
  const toEmail = (useRuntimeConfig(event).public?.resendToEmail as string) || process.env.RESEND_TO_EMAIL || ''
    
  if (!fromEmail || !toEmail) {
        console.error('[send-email.post.ts] From/To email addresses are not configured.');
        throw createError({
            statusCode: 500,
            statusMessage: 'Email service recipient/sender not configured.',
        });
    }
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
      console.error('[send-email.post.ts] Resend API Error:', error);
      throw createError({
        statusCode: 500, // Or error.statusCode if available from Resend error
        statusMessage: 'Failed to send email.',
        data: { name: error.name, message: error.message }, // Include Resend error details
      })
    }

    // Return a success response (Nitro handles 200 OK by default)
    return {
      message: 'Email sent successfully!',
      data, // Optionally include Resend success data
    }
  } catch (err: unknown) { 
    let finalErrorToThrow: H3Error;

    if (err instanceof H3Error) {
      finalErrorToThrow = err;
    } else {
      const originalMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      // Ensure all properties passed to createError are of the expected type.
      const statusMsg: string = 'An internal server error occurred while sending the email.';
      const errorData: { originalErrorDetails: string } = { originalErrorDetails: originalMessage };
      
      finalErrorToThrow = createError({ // This is where line 73 was approximately
        statusCode: 500,
        statusMessage: statusMsg, 
        data: errorData, 
      });
    }

    // Use properties of finalErrorToThrow, which is typed as H3Error
    const logMessage = finalErrorToThrow.statusMessage || 'Unknown error';
    const logStatusCode = finalErrorToThrow.statusCode || 500;
    const logData = finalErrorToThrow.data || {};

    if (process.env.NODE_ENV === 'development') {
      console.error(
        '[send-email.post.ts] Error in send-email handler (DEV):', 
        logStatusCode,
        logMessage, 
        logData
      );
    } else {
       console.error(
        `[send-email.post.ts] Error in send-email handler: ${logMessage} (Status: ${logStatusCode})`
      );
    }
    throw finalErrorToThrow;
  }
})
