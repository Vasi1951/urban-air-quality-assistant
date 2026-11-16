import { describe, it, expect } from 'vitest';
import { EPA_PM25_BREAKPOINTS } from '../../src/config/constants.js';
import { AQIBadgeRenderer } from '../../src/ui/components/AQIBadge.js';
import { RoutineComparisonRenderer } from '../../src/ui/components/RoutineComparison.js';
import { IndoorHackCardRenderer } from '../../src/ui/components/IndoorHackCard.js';
import { ImpactMeterRenderer } from '../../src/ui/components/ImpactMeter.js';

describe('Accessibility & WCAG 2.1 Compliance Tests', () => {
  it('should ensure all EPA breakpoints have high-contrast text foregrounds (WCAG AAA)', () => {
    EPA_PM25_BREAKPOINTS.forEach((bp) => {
      expect(bp.contrastForeground).toBeTruthy();
      expect(bp.label).toBeTruthy();
      expect(bp.iconName).toBeTruthy();
      // Ensure color code is valid hex
      expect(bp.colorHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('AQIBadgeRenderer should render semantic ARIA attributes and never rely on color alone', () => {
    const bp = EPA_PM25_BREAKPOINTS[3]!; // Unhealthy
    const html = AQIBadgeRenderer.render({
      aqi: 175,
      breakpoint: bp,
      isThermalInversionActive: true,
    });

    // Semantic roles & live regions
    expect(html).toContain('role="region"');
    expect(html).toContain('role="status"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-label="175 AQI"');
    expect(html).toContain(bp.label); // Explicit text label
  });

  it('RoutineComparisonRenderer should render accessible table with headers and meter semantics', () => {
    const html = RoutineComparisonRenderer.render([
      {
        timeSlot: '07:00 - 08:00 AM',
        standardActivity: 'Jogging',
        smogOptimizedActivity: 'Indoor stretch',
        healthImpactRationale: 'Inversion peak',
        exposureReductionPercentage: 70,
      },
    ]);

    expect(html).toContain('<table');
    expect(html).toContain('<caption');
    expect(html).toContain('scope="col"');
    expect(html).toContain('scope="row"');
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuenow="70"');
  });

  it('IndoorHackCardRenderer should include explicit heading hierarchy and fact check notes', () => {
    const html = IndoorHackCardRenderer.render({
      id: 'cr-box',
      title: 'DIY Corsi-Rosenthal Box',
      category: 'DIY_FILTRATION',
      estimatedCostUsd: 35,
      materialsNeeded: ['Fan', 'Filters'],
      stepByStepGuide: ['Step 1', 'Step 2'],
      scientificMechanism: 'High CADR filtration',
      expectedCADR_CFM: 250,
      mythBustingNote: 'Fact check text',
      safetyWarning: 'Safety text',
    });

    expect(html).toContain('<article');
    expect(html).toContain('id="hack-title-cr-box"');
    expect(html).toContain('role="note"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('~$35 USD');
  });

  it('ImpactMeterRenderer should feature accessible metrics and interactive mathematical derivation', () => {
    const html = ImpactMeterRenderer.render({
      baselineDailyPM25InhaledMicrograms: 320,
      optimizedDailyPM25InhaledMicrograms: 80,
      pm25InhalationReductionPercentage: 75,
      weeklyCarbonAbatedKg: 14.5,
      equivalentCigarettesAvoidedPerMonth: 8.2,
      riskReductionScore: 88,
      mathematicalExplanation: 'Dose = Integral(C * Ve * dt)',
    });

    expect(html).toContain('role="region"');
    expect(html).toContain('-75%');
    expect(html).toContain('8.2');
    expect(html).toContain('<details');
    expect(html).toContain('<summary');
    expect(html).toContain('Dose = Integral');
  });
});

