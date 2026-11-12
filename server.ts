import 'dotenv/config';
import http from 'http';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  ALL_CORE_COMPETENCIES,
  CERTIFICATIONS,
  EDUCATION_ITEMS,
  EXPERIENCE_ITEMS,
  PROFILE,
  TARGET_ROLES,
  TECHNICAL_SKILL_GROUPS,
} from './src/data/portfolioData.ts';
import { generatePortfolioBotReply } from './src/utils/whatsappBotResponder.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_ITEMS = 8;
const MAX_HISTORY_TEXT_LENGTH = 400;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const GEMINI_TIMEOUT_MS = 3000;
const GEMINI_COOLDOWN_MS = 60_000;

const SYSTEM_INSTRUCTION = `You are the official WhatsApp Chat Assistant for Gilbert Kariithi Ihugo on his portfolio website.
Always stay concise, warm, helpful, and strictly factual based ONLY on the profile data below. Never invent projects, employers, certifications, or prices not listed.
Use short paragraphs or clean bullet points suitable for a WhatsApp chat bubble (under 110 words unless the user asks for full details).
Always mention his direct WhatsApp number (${PROFILE.phone}) or email (${PROFILE.email}) when the user asks how to contact, hire, or get a quote from Gilbert.

PROFILE:
- Name: ${PROFILE.fullName}
- Title: ${PROFILE.roleTitle}
- Location: ${PROFILE.location}
- Availability: ${PROFILE.availability}
- Phone / WhatsApp: ${PROFILE.phone}
- Email: ${PROFILE.email}
- Languages: Swahili (Native), English (Fluent, Professional Working Proficiency)
- Summary: ${PROFILE.fullSummary}

CORE COMPETENCIES:
${ALL_CORE_COMPETENCIES.join(', ')}

TECHNICAL SKILLS & TOOLS:
${TECHNICAL_SKILL_GROUPS.map((g) => `- ${g.category}: ${g.items.join(', ')}`).join('\n')}

EXPERIENCE:
${EXPERIENCE_ITEMS.map(
  (exp) =>
    `- ${exp.role} at ${exp.organization} (${exp.location}, ${exp.period}): ${exp.bullets.join(' ')}`
).join('\n')}

EDUCATION:
${EDUCATION_ITEMS.map((e) => `- ${e.degree} — ${e.institution} (${e.year})`).join('\n')}

CERTIFICATIONS:
${CERTIFICATIONS.map((c) => `- ${c.issuer} — ${c.title}`).join('\n')}

TARGET ROLES:
${TARGET_ROLES.join(', ')}`;

let lastGeminiTimeoutAt = 0;

interface RateEntry {
  timestamps: number[];
}

const rateBuckets = new Map<string, RateEntry>();

// Periodically prune expired rate-limit entries to prevent unbounded memory growth
setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
  for (const [ip, entry] of rateBuckets.entries()) {
    const active = entry.timestamps.filter((t) => t > cutoff);
    if (active.length === 0) {
      rateBuckets.delete(ip);
    } else {
      entry.timestamps = active;
    }
  }
}, RATE_LIMIT_WINDOW_MS).unref();

function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function isValidHostHeader(host: string | undefined): host is string {
  return Boolean(host && /^[a-zA-Z0-9.-]+(:\d{1,5})?$/.test(host));
}

function getEffectiveHost(req: Request): string | undefined {
  const forwarded = req.headers['x-forwarded-host'];
  const raw =
    typeof forwarded === 'string' && forwarded.length > 0
      ? forwarded.split(',')[0].trim()
      : req.headers.host;
  return isValidHostHeader(raw) ? raw : undefined;
}

function isLocalHost(hostHeader: string | undefined): boolean {
  if (!hostHeader) return true;
  const host = hostHeader.split(':')[0].toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function isAllowedOrigin(origin: string | undefined, effectiveHost: string | undefined): boolean {
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const originHost = parsed.host;
    if (effectiveHost && originHost === effectiveHost) return true;
    const appUrlHost = process.env.APP_URL ? new URL(process.env.APP_URL).host : null;
    if (appUrlHost && originHost === appUrlHost) return true;
    if (isLocalHost(originHost)) return true;
    if (
      originHost === 'aistudio.google.com' ||
      originHost.endsWith('.aistudio.google.com') ||
      originHost.endsWith('.run.app')
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function buildContentSecurityPolicy(): string {
  const scriptSrc = IS_PRODUCTION
    ? "script-src 'self' https://apis.google.com https://accounts.google.com https://www.gstatic.com"
    : "script-src 'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com https://www.gstatic.com";
  const connectSrc = IS_PRODUCTION
    ? "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://accounts.google.com https://wa.me"
    : "connect-src 'self' ws: wss: https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://accounts.google.com https://wa.me";
  const directives = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.googleusercontent.com https://www.gstatic.com",
    connectSrc,
    "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://content.googleapis.com https://docs.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' mailto: https://accounts.google.com",
    "frame-ancestors 'self' https://aistudio.google.com https://*.google.com https://*.googleusercontent.com",
  ];
  if (IS_PRODUCTION) {
    directives.push('upgrade-insecure-requests');
  }
  return directives.join('; ');
}

function enforceHttpsMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!IS_PRODUCTION) {
    next();
    return;
  }

  const proto = req.headers['x-forwarded-proto'];
  const isHttps = req.secure || proto === 'https';
  const host = getEffectiveHost(req);

  if (!isHttps && host && !isLocalHost(host)) {
    res.redirect(308, `https://${host}${req.originalUrl}`);
    return;
  }
  next();
}

function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Content-Security-Policy', buildContentSecurityPolicy());
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
  );
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  const proto = req.headers['x-forwarded-proto'];
  if (IS_PRODUCTION || req.secure || proto === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
}

function apiSecurityMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  const origin = req.headers.origin;
  const host = getEffectiveHost(req);
  if (origin && isAllowedOrigin(origin, host)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    if (origin && !isAllowedOrigin(origin, host)) {
      res.status(403).json({ error: 'Origin not permitted.' });
      return;
    }
    res.status(204).end();
    return;
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!req.is('application/json')) {
      res.status(415).json({ error: 'Content-Type must be application/json.' });
      return;
    }

    if (origin && !isAllowedOrigin(origin, host)) {
      res.status(403).json({ error: 'Origin not permitted.' });
      return;
    }
  }

  next();
}

function apiRateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIp(req);
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  const entry = rateBuckets.get(ip) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = entry.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
    res.setHeader('Retry-After', String(retryAfterSec));
    res.status(429).json({
      error: `Too many requests. Please wait ${retryAfterSec}s before sending another message.`,
    });
    return;
  }

  entry.timestamps.push(now);
  rateBuckets.set(ip, entry);
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
  res.setHeader('X-RateLimit-Remaining', String(RATE_LIMIT_MAX_REQUESTS - entry.timestamps.length));
  next();
}

function getGeminiClient(): GoogleGenAI | null {
  if (Date.now() - lastGeminiTimeoutAt < GEMINI_COOLDOWN_MS) {
    return null;
  }
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface LinkedConnectionRecord {
  id: string;
  provider: string;
  label: string;
  targetUrl: string;
  category: 'workspace' | 'messaging' | 'social' | 'integration';
  verified: boolean;
  accountEmail?: string;
  linkedAt: string;
}

const MAX_LINKED_CONNECTIONS = 40;
const linkedConnectionsStore: LinkedConnectionRecord[] = [];

const ALLOWED_CONNECTION_PROVIDERS = new Set([
  'google-workspace',
  'gmail',
  'contacts',
  'calendar',
  'tasks',
  'forms',
  'whatsapp',
  'email',
  'linkedin',
  'github',
  'calendly',
  'custom-https',
]);

function isSafeExternalTargetUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') {
      return rawUrl.length <= 240;
    }
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function verifyGoogleBearerToken(token: string): Promise<{
  valid: boolean;
  email?: string;
  scopes: string[];
  expiresIn?: number;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);
  try {
    const res = await fetch('https://oauth2.googleapis.com/tokeninfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ access_token: token }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return { valid: false, scopes: [] };
    }
    const data = (await res.json()) as {
      email?: string;
      scope?: string;
      expires_in?: string | number;
    };
    const scopes = typeof data.scope === 'string' ? data.scope.split(/\s+/).filter(Boolean) : [];
    const expiresIn = data.expires_in !== undefined ? Number(data.expires_in) : undefined;
    return {
      valid: true,
      email: data.email,
      scopes,
      expiresIn: Number.isFinite(expiresIn) ? expiresIn : undefined,
    };
  } catch {
    return { valid: false, scopes: [] };
  } finally {
    clearTimeout(timer);
  }
}

function buildBuiltinConnectors() {
  const cleanPhoneDigits = PROFILE.phone.replace(/\D/g, '');
  return [
    {
      id: 'whatsapp-direct',
      provider: 'whatsapp',
      label: 'WhatsApp Direct & Assistant',
      category: 'messaging',
      endpoint: `https://wa.me/${cleanPhoneDigits}`,
      localApi: '/api/whatsapp-bot',
      requiresOAuth: false,
      status: 'ready',
    },
    {
      id: 'email-direct',
      provider: 'email',
      label: 'Direct Email',
      category: 'messaging',
      endpoint: `mailto:${PROFILE.email}`,
      requiresOAuth: false,
      status: 'ready',
    },
    {
      id: 'gmail-api',
      provider: 'gmail',
      label: 'Gmail API',
      category: 'workspace',
      endpoint: 'https://gmail.googleapis.com/gmail/v1',
      requiresOAuth: true,
      requiredScopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
      status: 'oauth-required',
    },
    {
      id: 'contacts-api',
      provider: 'contacts',
      label: 'Google Contacts (People API)',
      category: 'workspace',
      endpoint: 'https://people.googleapis.com/v1/people/me/connections',
      requiresOAuth: true,
      requiredScopes: ['https://www.googleapis.com/auth/contacts'],
      status: 'oauth-required',
    },
    {
      id: 'calendar-api',
      provider: 'calendar',
      label: 'Google Calendar API',
      category: 'workspace',
      endpoint: 'https://www.googleapis.com/calendar/v3',
      requiresOAuth: true,
      requiredScopes: ['https://www.googleapis.com/auth/calendar'],
      status: 'oauth-required',
    },
    {
      id: 'tasks-api',
      provider: 'tasks',
      label: 'Google Tasks API',
      category: 'workspace',
      endpoint: 'https://tasks.googleapis.com/tasks/v1',
      requiresOAuth: true,
      requiredScopes: ['https://www.googleapis.com/auth/tasks'],
      status: 'oauth-required',
    },
    {
      id: 'forms-api',
      provider: 'forms',
      label: 'Google Forms API',
      category: 'workspace',
      endpoint: 'https://forms.googleapis.com/v1/forms',
      requiresOAuth: true,
      requiredScopes: ['https://www.googleapis.com/auth/forms.body'],
      status: 'oauth-required',
    },
  ];
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(enforceHttpsMiddleware);
  app.use(securityHeadersMiddleware);
  app.use(express.json({ limit: '32kb' }));

  app.use('/api', apiSecurityMiddleware);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'gilbert-portfolio-api' });
  });

  app.get('/api/connections', (_req, res) => {
    res.json({
      ok: true,
      connectors: buildBuiltinConnectors(),
      linked: linkedConnectionsStore,
    });
  });

  app.post('/api/connections/verify', apiRateLimitMiddleware, async (req, res) => {
    const authHeader = req.headers.authorization;
    const token =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : '';

    if (!token) {
      res.status(401).json({
        ok: false,
        error: 'Missing Bearer access token in Authorization header.',
      });
      return;
    }

    const verification = await verifyGoogleBearerToken(token);
    if (!verification.valid) {
      res.status(401).json({
        ok: false,
        error: 'OAuth token is expired or invalid. Please sign in again.',
      });
      return;
    }

    const scopeSet = new Set(verification.scopes);
    const hasPrefix = (prefixes: string[]) => prefixes.some((p) => scopeSet.has(p));

    const services = {
      gmail: hasPrefix([
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.send',
      ]),
      contacts: hasPrefix([
        'https://www.googleapis.com/auth/contacts',
        'https://www.googleapis.com/auth/contacts.readonly',
      ]),
      calendar: hasPrefix([
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly',
      ]),
      tasks: hasPrefix([
        'https://www.googleapis.com/auth/tasks',
        'https://www.googleapis.com/auth/tasks.readonly',
      ]),
      forms: hasPrefix([
        'https://www.googleapis.com/auth/forms.body',
        'https://www.googleapis.com/auth/forms.body.readonly',
      ]),
    };

    res.json({
      ok: true,
      email: verification.email ?? null,
      expiresIn: verification.expiresIn ?? null,
      scopeCount: verification.scopes.length,
      services,
    });
  });

  app.post('/api/connections/link', apiRateLimitMiddleware, async (req, res) => {
    const rawProvider = typeof req.body?.provider === 'string' ? req.body.provider.trim().toLowerCase() : '';
    const rawLabel = typeof req.body?.label === 'string' ? stripControlChars(req.body.label).slice(0, 80) : '';
    const rawTargetUrl = typeof req.body?.targetUrl === 'string' ? req.body.targetUrl.trim() : '';

    if (!ALLOWED_CONNECTION_PROVIDERS.has(rawProvider)) {
      res.status(400).json({ error: 'Unsupported connection provider.' });
      return;
    }

    if (!rawTargetUrl || !isSafeExternalTargetUrl(rawTargetUrl)) {
      res.status(400).json({
        error: 'Please provide a valid public https://, mailto:, or tel: connection URL.',
      });
      return;
    }

    const authHeader = req.headers.authorization;
    const token =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : '';

    let verified = false;
    let accountEmail: string | undefined;
    if (token) {
      const check = await verifyGoogleBearerToken(token);
      verified = check.valid;
      accountEmail = check.email;
    }

    const category: LinkedConnectionRecord['category'] =
      rawProvider === 'whatsapp' || rawProvider === 'email'
        ? 'messaging'
        : rawProvider === 'linkedin' || rawProvider === 'github'
        ? 'social'
        : rawProvider === 'custom-https' || rawProvider === 'calendly'
        ? 'integration'
        : 'workspace';

    const record: LinkedConnectionRecord = {
      id: `conn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      provider: rawProvider,
      label: rawLabel || rawProvider.replace(/-/g, ' '),
      targetUrl: rawTargetUrl,
      category,
      verified,
      accountEmail,
      linkedAt: new Date().toISOString(),
    };

    linkedConnectionsStore.unshift(record);
    if (linkedConnectionsStore.length > MAX_LINKED_CONNECTIONS) {
      linkedConnectionsStore.pop();
    }

    res.status(201).json({ ok: true, connection: record });
  });

  app.delete('/api/connections/:id', apiRateLimitMiddleware, (req, res) => {
    const targetId = req.params.id;
    const idx = linkedConnectionsStore.findIndex((c) => c.id === targetId);
    if (idx === -1) {
      res.status(404).json({ error: 'Linked connection not found.' });
      return;
    }
    linkedConnectionsStore.splice(idx, 1);
    res.json({ ok: true, deletedId: targetId });
  });

  app.post('/api/whatsapp-bot', apiRateLimitMiddleware, async (req, res) => {
    const rawInput = typeof req.body?.message === 'string' ? req.body.message : '';
    const cleanedMessage = stripControlChars(rawInput);

    if (!cleanedMessage) {
      res.status(400).json({ error: 'Please enter a valid message.' });
      return;
    }

    if (cleanedMessage.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({
        error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      });
      return;
    }

    const rawHistory: unknown[] = Array.isArray(req.body?.history)
      ? req.body.history.slice(-MAX_HISTORY_ITEMS)
      : [];

    const sanitizedHistory = rawHistory
      .filter(
        (m: unknown): m is { sender: string; text: string } =>
          Boolean(
            m &&
              typeof m === 'object' &&
              'sender' in m &&
              'text' in m &&
              (m.sender === 'user' || m.sender === 'bot') &&
              typeof m.text === 'string'
          )
      )
      .map((m: { sender: string; text: string }) => ({
        sender: m.sender,
        text: stripControlChars(m.text).slice(0, MAX_HISTORY_TEXT_LENGTH),
      }))
      .filter((m) => m.text.length > 0);

    const ai = getGeminiClient();

    if (ai) {
      try {
        const transcript = sanitizedHistory
          .map((m) => `${m.sender === 'user' ? 'Visitor' : 'Assistant'}: ${m.text}`)
          .join('\n');

        const prompt = transcript
          ? `Previous chat:\n${transcript}\n\nVisitor: ${cleanedMessage}\nAssistant:`
          : cleanedMessage;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini request timeout')), GEMINI_TIMEOUT_MS)
        );

        const response = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          timeoutPromise,
        ]);

        const text = response.text?.trim();
        if (text) {
          res.json({ reply: text, mode: 'ai' });
          return;
        }
      } catch {
        lastGeminiTimeoutAt = Date.now();
      }
    }

    const fallbackReply = generatePortfolioBotReply(cleanedMessage);
    res.json({ reply: fallbackReply, mode: 'assistant' });
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  // Handle malformed JSON payloads cleanly without exposing stack traces
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      res.status(400).json({ error: 'Malformed JSON request body.' });
      return;
    }
    next(err);
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: { server: httpServer },
        hmr: disableHmr ? false : { server: httpServer },
        watch: disableHmr ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      express.static(distPath, {
        maxAge: '1d',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use((_err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
