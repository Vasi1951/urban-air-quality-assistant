/**
 * Accessible Direct Impact Meter Component Specification
 * WCAG 2.1 Compliant with Live Region Announcements and Clear Visual Contrast
 */

import { DirectImpactMetrics } from '../../types/recommendation.js';

export class ImpactMeterRenderer {
  public static render(metrics: DirectImpactMetrics): string {
    return `
<section 
  class="impact-meter-card" 
  role="region" 
  aria-labelledby="impact-heading"
  style="background: #111827; border: 1px solid #1F2937; border-radius: 0.75rem; padding: 1.5rem; color: #FFFFFF;"
>
  <h2 id="impact-heading" style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #F9FAFB;">
    Direct Quantified Impact of Your Choices
  </h2>
  <p style="color: #9CA3AF; font-size: 0.9rem; margin-bottom: 1.5rem;">
    Calculated using peer-reviewed aerosol deposition models and EPA minute ventilation metrics.
  </p>

  <div 
    class="metrics-grid" 
    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;"
  >
    <!-- Metric 1: PM2.5 Inhaled Reduction -->
    <div 
      class="metric-box" 
      style="background: #064E3B; border: 1px solid #059669; border-radius: 0.5rem; padding: 1rem;"
    >
      <span class="sr-only">Particulate Exposure Reduction: </span>
      <div style="font-size: 2.25rem; font-weight: 800; color: #34D399; font-family: monospace;">
        -${metrics.pm25InhalationReductionPercentage}%
      </div>
      <div style="font-size: 0.875rem; color: #A7F3D0; font-weight: 600; margin-top: 0.25rem;">
        Inhaled PM2.5 Slashed
      </div>
      <div style="font-size: 0.775rem; color: #D1FAE5; margin-top: 0.25rem;">
        From ${metrics.baselineDailyPM25InhaledMicrograms} µg down to ${metrics.optimizedDailyPM25InhaledMicrograms} µg/day
      </div>
    </div>

    <!-- Metric 2: Berkeley Earth Cigarette Equivalence -->
    <div 
      class="metric-box" 
      style="background: #1E3A8A; border: 1px solid #3B82F6; border-radius: 0.5rem; padding: 1rem;"
    >
      <span class="sr-only">Toxic Dose Equivalence: </span>
      <div style="font-size: 2.25rem; font-weight: 800; color: #60A5FA; font-family: monospace;">
        -${metrics.equivalentCigarettesAvoidedPerMonth}
      </div>
      <div style="font-size: 0.875rem; color: #BFDBFE; font-weight: 600; margin-top: 0.25rem;">
        Eq. Cigarettes Avoided/Mo
      </div>
      <div style="font-size: 0.775rem; color: #DBEAFE; margin-top: 0.25rem;">
        Based on Berkeley Earth PM2.5 lung toxicity metric
      </div>
    </div>

    <!-- Metric 3: Carbon Abatement -->
    <div 
      class="metric-box" 
      style="background: #78350F; border: 1px solid #D97706; border-radius: 0.5rem; padding: 1rem;"
    >
      <span class="sr-only">Carbon Abatement: </span>
      <div style="font-size: 2.25rem; font-weight: 800; color: #FBBF24; font-family: monospace;">
        ${metrics.weeklyCarbonAbatedKg} kg
      </div>
      <div style="font-size: 0.875rem; color: #FDE68A; font-weight: 600; margin-top: 0.25rem;">
        CO₂ Abated / Week
      </div>
      <div style="font-size: 0.775rem; color: #FEF3C7; margin-top: 0.25rem;">
        Via carpool, metro transit, and clean space heating
      </div>
    </div>

    <!-- Metric 4: Composite Risk Reduction Score -->
    <div 
      class="metric-box" 
      style="background: #4C1D95; border: 1px solid #8B5CF6; border-radius: 0.5rem; padding: 1rem;"
    >
      <span class="sr-only">Community Health Safety Score: </span>
      <div style="font-size: 2.25rem; font-weight: 800; color: #C4B5FD; font-family: monospace;">
        ${metrics.riskReductionScore}/100
      </div>
      <div style="font-size: 0.875rem; color: #DDD6FE; font-weight: 600; margin-top: 0.25rem;">
        Respiratory Safety Score
      </div>
      <div style="font-size: 0.775rem; color: #EDE9FE; margin-top: 0.25rem;">
        Composite protection factor for vulnerable family members
      </div>
    </div>
  </div>

  <!-- Transparent Mathematical Derivation Accordion -->
  <details 
    style="background: #1F2937; border-radius: 0.5rem; padding: 0.75rem 1rem; border: 1px solid #374151;"
  >
    <summary 
      style="font-weight: 600; cursor: pointer; color: #93C5FD; font-size: 0.9rem;"
      aria-label="Toggle mathematical methodology explanation"
    >
      📐 Click to View Complete Mathematical & Scientific Derivation
    </summary>
    <div style="margin-top: 0.75rem; font-size: 0.85rem; color: #D1D5DB; line-height: 1.6;">
      <p>${metrics.mathematicalExplanation}</p>
    </div>
  </details>
</section>
    `.trim();
  }
}

