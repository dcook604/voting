import { Router } from 'express';
import { z } from 'zod';

import { signAuthToken } from '../modules/auth/jwt.js';
import { invitationService } from '../modules/invitations/service.js';
import type { InvitationRole } from '../modules/invitations/types.js';
import { mailer } from '../modules/notifications/mailer.js';

const magicLinkSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'council', 'observer']).default('council')
});

const tokenSchema = z.object({
  token: z.string().min(10)
});

export const authRouter = Router();

authRouter.post('/auth/magic-link', async (req, res, next) => {
  try {
    const { email, role } = magicLinkSchema.parse(req.body);
    const { invitation, token } = await invitationService.createInvitation(email, role as InvitationRole);
    await mailer.sendMagicLinkEmail({ to: email, token });

    res.json({
      success: true,
      data: {
        invitationId: invitation.id,
        expiresAt: invitation.expiresAt.toISOString(),
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0]?.message ?? 'Invalid payload' });
    }

    next(error);
  }
});

authRouter.post('/auth/token', async (req, res, next) => {
  try {
    const { token } = tokenSchema.parse(req.body);
    const invitation = await invitationService.consumeToken(token);

    if (!invitation) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    const jwt = signAuthToken({ sub: invitation.email, role: invitation.role });

    res.json({
      success: true,
      data: {
        token: jwt,
        user: {
          email: invitation.email,
          role: invitation.role
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0]?.message ?? 'Invalid payload' });
    }

    next(error);
  }
});
