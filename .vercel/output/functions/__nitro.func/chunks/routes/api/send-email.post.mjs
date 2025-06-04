import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
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

const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields: name and email are required."
      });
    }
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@taash.ai";
    const toEmail = process.env.RESEND_TO_EMAIL || "hello@taash.ai";
    const subject = `New Contact Form Submission from ${body.name}`;
    let htmlContent = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
    `;
    if (body.company) {
      htmlContent += `<p><strong>Company:</strong> ${body.company}</p>`;
    }
    if (body.position) {
      htmlContent += `<p><strong>Position:</strong> ${body.position}</p>`;
    }
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      // Resend expects an array of strings for 'to'
      subject,
      html: htmlContent
    });
    if (error) {
      console.error("Resend API Error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to send email.",
        data: error
        // Optionally include Resend error details
      });
    }
    return {
      statusCode: 200,
      message: "Email sent successfully!",
      data
      // Optionally include Resend success data
    };
  } catch (err) {
    console.error("Error in send-email handler:", err);
    if (err.statusCode) {
      throw err;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "An unexpected error occurred.",
      data: err.message
    });
  }
});

export { sendEmail_post as default };
//# sourceMappingURL=send-email.post.mjs.map
