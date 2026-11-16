/**
 * Accessible AQI Badge Component Specification
 * WCAG 2.1 AAA Compliant: Never relies solely on color to convey critical safety state.
 */

import { AQIBreakpoint } from '../../types/aqi.js';

export interface AQIBadgeProps {
  aqi: number;
  breakpoint: AQIBreakpoint;
  isThermalInversionActive: boolean;
}

export class AQIBadgeRenderer {
  /**
   * Renders semantic, accessible HTML for the AQI display
   */
  public static render(props: AQIBadgeProps): string {
    const { aqi, breakpoint, isThermalInversionActive } = props;

    return `
<section 
  class="aqi-badge-container" 
  role="region" 
  aria-label="Current Air Quality Index and Atmospheric Status"
>
  <div 
    class="aqi-card" 
    style="border-left: 8px solid ${breakpoint.colorHex}; background-color: #1A1A1A; color: #FFFFFF; padding: 1.25rem; border-radius: 0.5rem;"
  >
    <div class="aqi-header" style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <span class="sr-only">Air Quality Status: </span>
        <span 
          class="aqi-value" 
          style="font-size: 2.75rem; font-weight: 800; font-family: monospace; letter-spacing: -0.05em;"
          aria-label="${aqi} AQI"
        >
          ${aqi}
        </span>
        <span class="aqi-unit" aria-hidden="true" style="font-size: 1rem; color: #A0AEC0; margin-left: 0.25rem;">AQI (US EPA)</span>
      </div>
      <div 
        class="aqi-pill" 
        role="status"
        style="background-color: ${breakpoint.colorHex}; color: ${breakpoint.contrastForeground}; font-weight: 700; padding: 0.35rem 0.85rem; border-radius: 9999px; text-transform: uppercase; font-size: 0.875rem;"
      >
        <span class="icon-${breakpoint.iconName}" aria-hidden="true">● </span>
        <span>${breakpoint.label}</span>
      </div>
    </div>

    ${
      isThermalInversionActive
        ? `
    <div 
      class="inversion-alert" 
      role="alert" 
      style="margin-top: 1rem; background-color: #3B1824; border: 1px solid #FF4D6D; color: #FFE0E6; padding: 0.75rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem;"
    >
      <span aria-hidden="true" style="font-size: 1.25rem;">⚠️</span>
      <div>
        <strong style="display: block; font-size: 0.9rem;">Thermal Inversion Layer Active</strong>
        <span style="font-size: 0.825rem;">Ground-level cold air is trapping heavy particulates. Postpone outdoor exertion until afternoon solar breakup.</span>
      </div>
    </div>`
        : ''
    }
  </div>
</section>
    `.trim();
  }
}

