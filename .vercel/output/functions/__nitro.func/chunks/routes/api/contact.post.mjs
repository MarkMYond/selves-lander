import { d as defineEventHandler, u as useRuntimeConfig, c as createError, r as readBody } from '../../nitro/nitro.mjs';
import { Resend } from 'resend';
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

const contact_post = defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const resendApiKey = runtimeConfig.resendApiKey || process.env.NUXT_RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("Resend API key is not configured.");
    throw createError({
      statusCode: 500,
      statusMessage: "Email service is not configured."
    });
  }
  const resend = new Resend(resendApiKey);
  try {
    const body = await readBody(event);
    if (!body.recipientEmail || typeof body.recipientEmail !== "string" || body.recipientEmail.trim() === "") {
      console.error("Invalid or missing recipientEmail in request body:", body.recipientEmail);
      throw createError({
        statusCode: 400,
        statusMessage: "Recipient email is invalid or missing."
      });
    }
    if (!body.email || typeof body.email !== "string" || body.email.trim() === "") {
      throw createError({
        statusCode: 400,
        statusMessage: "Sender email is invalid or missing."
      });
    }
    const {
      name,
      email,
      company,
      subject,
      message,
      recipientEmail
      // Now validated to be a non-empty string
    } = body;
    const configuredFromEmail = runtimeConfig.public.resendFromEmail || process.env.NUXT_RESEND_FROM_EMAIL;
    if (!configuredFromEmail || typeof configuredFromEmail !== "string" || configuredFromEmail.trim() === "") {
      console.error("From email is not configured correctly. Please set NUXT_PUBLIC_RESEND_FROM_EMAIL or runtimeConfig.public.resendFromEmail.");
      throw createError({
        statusCode: 500,
        statusMessage: 'Email service "from" address is not configured.'
      });
    }
    const fromEmail = configuredFromEmail;
    const emailSubject = subject || `Contact Form Submission from ${name || email}`;
    let emailHtmlContent = `<p>You have a new contact form submission:</p><ul>`;
    if (name) emailHtmlContent += `<li><strong>Name:</strong> ${name}</li>`;
    emailHtmlContent += `<li><strong>Email:</strong> ${email}</li>`;
    if (company) emailHtmlContent += `<li><strong>Company:</strong> ${company}</li>`;
    if (subject) emailHtmlContent += `<li><strong>Subject:</strong> ${subject}</li>`;
    if (message) emailHtmlContent += `<li><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</li>`;
    emailHtmlContent += `</ul>`;
    let emailTextContent = `You have a new contact form submission:

`;
    if (name) emailTextContent += `Name: ${name}
`;
    emailTextContent += `Email: ${email}
`;
    if (company) emailTextContent += `Company: ${company}
`;
    if (subject) emailTextContent += `Subject: ${subject}
`;
    if (message) emailTextContent += `Message:
${message}
`;
    const finalRecipientEmail = recipientEmail;
    const emailToSend = {
      from: fromEmail,
      to: finalRecipientEmail,
      subject: emailSubject,
      html: emailHtmlContent,
      text: emailTextContent
      // Added plain text version
    };
    const { data, error } = await resend.emails.send(emailToSend);
    if (error) {
      console.error("Resend API Error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to send email."
      });
    }
    return { message: "Message sent successfully!", data };
  } catch (error) {
    console.error("Error in /api/contact:", error);
    if (error.statusCode && error.statusMessage) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "An internal server error occurred."
    });
  }
});

export { contact_post as default };
//# sourceMappingURL=contact.post.mjs.map
