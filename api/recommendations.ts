import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AIAssistantService } from '../src/services/ai-assistant-service.js';
import { AQIService } from '../src/services/aqi-service.js';
import { RateLimiter } from '../src/lib/security/rate-limiter.js';
import { SecuritySanitizer } from '../src/lib/security/sanitizer.js';
import { FamilyProfile } from '../src/types/user.js';

const aqiService = new AQIService();
const assistantService = new AIAssistantService(aqiService);
const rateLimiter = new RateLimiter();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Rate Limiting Check
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'anonymous';
  const rateLimit = rateLimiter.checkRateLimit(clientIp);

  if (!rateLimit.isAllowed) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait before submitting another request.',
      retryAfterMs: rateLimit.retryAfterMs,
    });
  }

  if (req.method === 'GET') {
    const city = (req.query.city as string) || 'Delhi-NCR';
    const hour = req.query.hour ? parseInt(req.query.hour as string, 10) : undefined;
    const aqiData = await aqiService.getUrbanAirQuality(city, hour);
    return res.status(200).json(aqiData);
  }

  if (req.method === 'POST') {
    try {
      const { profile, customPrompt } = req.body as { profile: FamilyProfile; customPrompt?: string };

      if (!profile || !profile.locationCity) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'A valid family profile with locationCity is required.',
        });
      }

      if (customPrompt) {
        const audit = SecuritySanitizer.sanitizeAndAuditInput(customPrompt);
        if (!audit.isSafe) {
          return res.status(400).json({
            error: 'Security Violation',
            violations: audit.violations,
          });
        }
      }

      const plan = await assistantService.generatePersonalizedPlan(profile, customPrompt);
      return res.status(200).json(plan);
    } catch (err: any) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Failed to generate personalized air quality plan.',
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
