/**
 * Accessible Routine Comparison Component Specification
 * WCAG 2.1 Compliant Data Table with Keyboard Navigation & Screen Reader Scope
 */

import { RoutineShiftItem } from '../../types/recommendation.js';

export class RoutineComparisonRenderer {
  public static render(items: RoutineShiftItem[]): string {
    const rows = items
      .map(
        (item) => `
      <tr class="routine-row" tabindex="0">
        <th scope="row" style="font-weight: 600; padding: 0.75rem; border-bottom: 1px solid #333;">
          ${item.timeSlot}
        </th>
        <td style="padding: 0.75rem; border-bottom: 1px solid #333; color: #E57373;">
          <span class="sr-only">Baseline Routine: </span>
          ${item.standardActivity}
        </td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #333; color: #81C784;">
          <span class="sr-only">Smog-Optimized Routine: </span>
          ${item.smogOptimizedActivity}
        </td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #333; font-size: 0.85rem; color: #B0BEC5;">
          ${item.healthImpactRationale}
        </td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #333; text-align: center;">
          <div 
            role="meter" 
            aria-valuenow="${item.exposureReductionPercentage}" 
            aria-valuemin="0" 
            aria-valuemax="100"
            aria-label="Inhaled particulate exposure reduction"
            style="background: #2E7D32; color: #FFFFFF; font-weight: 700; border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.85rem;"
          >
            -${item.exposureReductionPercentage}%
          </div>
        </td>
      </tr>
    `
      )
      .join('\n');

    return `
<section class="routine-comparison-section" aria-labelledby="routine-comparison-heading">
  <h2 id="routine-comparison-heading" style="font-size: 1.5rem; margin-bottom: 1rem; color: #ECEFF1;">
    Personalized Smog-Adaptive Daily Routine
  </h2>
  <div style="overflow-x: auto;">
    <table 
      class="routine-table" 
      style="width: 100%; border-collapse: collapse; text-align: left; background: #121212; color: #ECEFF1;"
    >
      <caption style="text-align: left; padding: 0.5rem; color: #90A4AE; font-size: 0.9rem;">
        Comparison between typical daily schedule and science-grounded winter smog optimized shifts.
      </caption>
      <thead>
        <tr style="background: #1E1E1E; border-bottom: 2px solid #455A64;">
          <th scope="col" style="padding: 0.75rem;">Time Window</th>
          <th scope="col" style="padding: 0.75rem;">Baseline Routine</th>
          <th scope="col" style="padding: 0.75rem;">Smog-Safe Routine</th>
          <th scope="col" style="padding: 0.75rem;">Scientific Mechanism</th>
          <th scope="col" style="padding: 0.75rem; text-align: center;">Exposure Reduction</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
</section>
    `.trim();
  }
}
