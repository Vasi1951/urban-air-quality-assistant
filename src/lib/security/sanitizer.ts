/**
 * Input Sanitizer, PII Scrubber & Prompt Injection Firewall
 * Compliant with OWASP Top 10 for LLMs (LLM01, LLM02)
 */

import { SECURITY_CONFIG } from '../../config/security.js';

export interface SanitizationResult {
  isSafe: boolean;
  sanitizedInput: string;
  violations: string[];
  scrubbedPIICount: number;
}

export class SecuritySanitizer {
  /**
   * Evaluates user input against prompt injection patterns and scrubs sensitive PII
   * @param rawInput Unfiltered user string
   */
  public static sanitizeAndAuditInput(rawInput: string): SanitizationResult {
    const violations: string[] = [];
    let scrubbedPIICount = 0;

    if (!rawInput || typeof rawInput !== 'string') {
      return {
        isSafe: false,
        sanitizedInput: '',
        violations: ['Input is empty or not a valid string.'],
        scrubbedPIICount: 0,
      };
    }

    // 1. Length enforcement
    if (rawInput.length > SECURITY_CONFIG.INPUT_CONSTRAINTS.MAX_PROMPT_LENGTH) {
      violations.push(
        `Input exceeds maximum permitted length of ${SECURITY_CONFIG.INPUT_CONSTRAINTS.MAX_PROMPT_LENGTH} characters.`
      );
    }

    // 2. Prompt Injection Detection (OWASP LLM01)
    for (const pattern of SECURITY_CONFIG.PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(rawInput)) {
        violations.push(`Adversarial prompt injection pattern detected matching rule: ${pattern.toString()}`);
      }
    }

    // 3. System Delimiter Collision Detection
    const delimiters = Object.values(SECURITY_CONFIG.DELIMITERS);
    for (const delimiter of delimiters) {
      if (rawInput.includes(delimiter)) {
        violations.push(`Delimiter tampering detected: attempted injection of reserved token '${delimiter}'.`);
      }
    }

    // 4. PII Scrubbing (OWASP LLM02)
    let sanitized = rawInput;

    // Scrub Email
    sanitized = sanitized.replace(SECURITY_CONFIG.PII_PATTERNS.EMAIL, () => {
      scrubbedPIICount++;
      return '[REDACTED_EMAIL]';
    });

    // Scrub Phone Numbers
    sanitized = sanitized.replace(SECURITY_CONFIG.PII_PATTERNS.PHONE, () => {
      scrubbedPIICount++;
      return '[REDACTED_PHONE]';
    });

    // Scrub Social Security / National IDs
    sanitized = sanitized.replace(SECURITY_CONFIG.PII_PATTERNS.SSN_NATIONAL_ID, () => {
      scrubbedPIICount++;
      return '[REDACTED_NATIONAL_ID]';
    });

    // Scrub Street Addresses
    sanitized = sanitized.replace(SECURITY_CONFIG.PII_PATTERNS.STREET_ADDRESS, () => {
      scrubbedPIICount++;
      return '[REDACTED_STREET_ADDRESS]';
    });

    // 5. HTML Character Escaping to Prevent Stored XSS
    sanitized = this.escapeHtml(sanitized);

    const isSafe = violations.length === 0;

    return {
      isSafe,
      sanitizedInput: sanitized,
      violations,
      scrubbedPIICount,
    };
  }

  /**
   * Geographically fuzzes GPS coordinates to 1 decimal place (~11km) to protect residence privacy
   */
  public static fuzzCoordinates(latitude: number, longitude: number): [number, number] {
    const precision = SECURITY_CONFIG.GEO_PRIVACY.COARSE_PRECISION_DECIMAL_PLACES;
    const factor = Math.pow(10, precision);
    const fuzzedLat = Math.round(latitude * factor) / factor;
    const fuzzedLng = Math.round(longitude * factor) / factor;
    return [fuzzedLat, fuzzedLng];
  }

  /**
   * HTML Entity Escaping helper
   */
  public static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

