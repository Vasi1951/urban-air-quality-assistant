/**
 * Security Configurations & Guardrail Thresholds
 * Implements defenses for OWASP Top 10 for LLMs (2025/2026)
 */

export const SECURITY_CONFIG = {
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 60 * 1000, // 1 minute sliding window
    MAX_REQUESTS_PER_WINDOW: 30, // 30 requests per minute
    BURST_TOLERANCE: 10,
  },

  // Input Validation Constraints
  INPUT_CONSTRAINTS: {
    MAX_PROMPT_LENGTH: 1500,
    MIN_PROMPT_LENGTH: 2,
    MAX_FAMILY_MEMBERS: 20,
    MAX_CITY_NAME_LENGTH: 64,
  },

  // Delimiters for System Prompt Isolation
  DELIMITERS: {
    USER_INPUT_START: '<<<USER_SAFE_INPUT_START>>>',
    USER_INPUT_END: '<<<USER_SAFE_INPUT_END>>>',
    CONTEXT_START: '[[[ENVIRONMENT_CONTEXT_START]]]',
    CONTEXT_END: '[[[ENVIRONMENT_CONTEXT_END]]]',
  },

  // Geographic Privacy Fuzzing
  GEO_PRIVACY: {
    COARSE_PRECISION_DECIMAL_PLACES: 1, // 0.1 degree ≈ 11.1 km at equator
  },

  // Prompt Injection Detection Rules (OWASP LLM01)
  PROMPT_INJECTION_PATTERNS: [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /disregard\s+(the\s+)?(system|initial)\s+prompt/i,
    /you\s+are\s+now\s+(in\s+)?(DAN|developer|jailbreak|unrestricted)\s+mode/i,
    /system\s*:\s*override/i,
    /reveal\s+(your|the)\s+(system\s+prompt|hidden\s+instructions|api\s*key)/i,
    /print\s+(the\s+)?exact\s+prompt\s+above/i,
    /<script[\s\S]*?>[\s\S]*?<\/script>/i,
    /javascript:\s*/i,
    /data:\s*text\/html/i,
  ],

  // PII Scrubbing Patterns (OWASP LLM02)
  PII_PATTERNS: {
    EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    PHONE: /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g,
    SSN_NATIONAL_ID: /\b\d{3}-\d{2}-\d{4}\b|\b\d{12}\b/g,
    CREDIT_CARD: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    STREET_ADDRESS: /\b\d{1,5}\s+([A-Za-z0-9#.]+)\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi,
  },
} as const;

