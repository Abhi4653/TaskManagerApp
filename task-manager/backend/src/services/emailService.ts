export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export interface EmailService {
  send(payload: EmailPayload): Promise<void>;
}

export class NodemailerEmailService implements EmailService {
  async send(payload: EmailPayload): Promise<void> {
    const nodemailer = (await import('nodemailer')).default as unknown as typeof import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    } as any);
    await transporter.sendMail({ from: process.env.MAIL_FROM || 'no-reply@example.com', ...payload });
  }
}

export class SendGridEmailService implements EmailService {
  async send(payload: EmailPayload): Promise<void> {
    const sgMod = await import('@sendgrid/mail');
    const sg = (sgMod as any).default || sgMod;
    sg.setApiKey(process.env.SENDGRID_API_KEY || '');
    await sg.send({ from: process.env.MAIL_FROM || 'no-reply@example.com', to: payload.to, subject: payload.subject, html: payload.html } as any);
  }
}

export function getEmailService(): EmailService {
  const provider = (process.env.EMAIL_PROVIDER || 'nodemailer').toLowerCase();
  return provider === 'sendgrid' ? new SendGridEmailService() : new NodemailerEmailService();
}
