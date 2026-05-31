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

  async sendFinalizationEmail(params: {
    to: string;
    batchTitle: string;
    batchId: string;
    closeReason?: string;
    results?: { yes: number; no: number; abstain: number; cast: number; outcome: string | null };
  }) {
    const resultsLink = `${config.app.baseUrl.replace(/\/$/, '')}/results/${params.batchId}`;
    const closeReasonLine = params.closeReason ? `Close reason: ${params.closeReason}` : '';

    const resultLines = params.results
      ? [
          'Summary',
          `Cast: ${params.results.cast}`,
          `Yes: ${params.results.yes}`,
          `No: ${params.results.no}`,
          `Abstain: ${params.results.abstain}`,
          params.results.outcome ? `Outcome: ${params.results.outcome}` : ''
        ]
          .filter(Boolean)
          .join('\n')
      : '';

    const resultHtml = params.results
      ? `<table style="border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Cast</td><td style="padding:4px 0;font-weight:600;">${params.results.cast}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Yes</td><td style="padding:4px 0;font-weight:600;color:#16a34a;">${params.results.yes}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">No</td><td style="padding:4px 0;font-weight:600;color:#dc2626;">${params.results.no}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Abstain</td><td style="padding:4px 0;font-weight:600;">${params.results.abstain}</td></tr>
          ${params.results.outcome ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">Outcome</td><td style="padding:4px 0;font-weight:600;">${params.results.outcome}</td></tr>` : ''}
        </table>`
      : '';

    const info = await transport.sendMail({
      from: config.smtp.from,
      to: params.to,
      subject: `Voting closed: ${params.batchTitle}`,
      text: [
        `Motion: ${params.batchTitle}`,
        closeReasonLine,
        resultLines,
        `View results: ${resultsLink}`
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <p><strong>Motion:</strong> ${params.batchTitle}</p>
        ${params.closeReason ? `<p style="color:#64748b;">Close reason: ${params.closeReason}</p>` : ''}
        ${resultHtml}
        <p><a href="${resultsLink}" style="display:inline-block;padding:12px 18px;border-radius:6px;background:#0ea5e9;color:#fff;text-decoration:none;">View results</a></p>
      `
    });

    if (config.env !== 'production') {
      logger.debug({ messageId: info.messageId, to: params.to }, 'Finalization email dispatched');
    }

    return info;
  }
};

