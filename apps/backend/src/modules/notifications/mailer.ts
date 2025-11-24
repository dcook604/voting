import nodemailer from 'nodemailer';

import { config } from '../../config.js';
import { logger } from '../../logger.js';

const createTransport = () => {
  if (config.smtp.host && config.smtp.user && config.smtp.password) {
    return nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password
      }
    });
  }

  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
};

const transport = createTransport();

export const mailer = {
  async sendMagicLinkEmail(params: { to: string; token: string }) {
    const link = `${config.app.baseUrl.replace(/\/$/, '')}/magic-link?token=${params.token}`;

    const info = await transport.sendMail({
      from: config.smtp.from,
      to: params.to,
      subject: 'Your strata voting link',
      text: `A voting invitation is ready. Use the following link:\n\n${link}\n\nIf you did not request this link, ignore this email.`,
      html: `<p>A voting invitation is ready. Use the button below:</p><p><a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:6px;background:#0ea5e9;color:#fff;text-decoration:none;">Open voting link</a></p><p>If the button does not work, copy this URL into your browser:<br/><code>${link}</code></p>`
    });

    if (config.env !== 'production') {
      logger.debug({ messageId: info.messageId, to: params.to }, 'Magic link email dispatched');
    }

    return info;
  },

  async sendFinalizationEmail(params: { to: string; batchTitle: string; batchId: string }) {
    const exportLink = `${config.app.baseUrl.replace(/\/$/, '')}/batches/${params.batchId}/export/pdf`;

    const info = await transport.sendMail({
      from: config.smtp.from,
      to: params.to,
      subject: `Voting batch finalized: ${params.batchTitle}`,
      text: `The voting batch "${params.batchTitle}" has been finalized.\n\nDownload the report: ${exportLink}`,
      html: `<p>The voting batch <strong>${params.batchTitle}</strong> has been finalized.</p><p><a href="${exportLink}" style="display:inline-block;padding:12px 18px;border-radius:6px;background:#0ea5e9;color:#fff;text-decoration:none;">Download PDF Report</a></p>`
    });

    if (config.env !== 'production') {
      logger.debug({ messageId: info.messageId, to: params.to }, 'Finalization email dispatched');
    }

    return info;
  }
};

