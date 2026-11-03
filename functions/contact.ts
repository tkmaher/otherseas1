"use server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Basic server-side validation
  if (!name || !email || !message) {
    // console.error('Validation failed: Missing fields', { name, email, message });
    return { success: false, error: 'All fields are required.' };
  }

  try {
    console.log('Received form data:', { name, email, message });
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <os@otherseas1.com>', 
      to: 'os@otherseas1.com',        
      subject: `New Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error sending email:', err);
    return { success: false, error: 'Failed to send email.' };
  }
}