/**
 * Accessible Indoor Air Quality Hack Card Component Specification
 * Conforms to WCAG 2.1 AA with proper heading hierarchy, contrast, and list semantics.
 */

import { IndoorHackItem } from '../../types/recommendation.js';

export class IndoorHackCardRenderer {
  public static render(hack: IndoorHackItem): string {
    const materialsList = hack.materialsNeeded
      .map((m) => `<li style="margin-bottom: 0.25rem;">${m}</li>`)
      .join('\n');

    const stepsList = hack.stepByStepGuide
      .map((s) => `<li style="margin-bottom: 0.5rem; line-height: 1.4;">${s}</li>`)
      .join('\n');

    return `
<article 
  class="indoor-hack-card" 
  aria-labelledby="hack-title-${hack.id}" 
  style="border: 1px solid #374151; background: #1F2937; color: #F9FAFB; border-radius: 0.5rem; padding: 1.25rem; margin-bottom: 1.5rem;"
>
  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
    <div>
      <span 
        class="category-tag" 
        style="background: #3B82F6; color: #FFFFFF; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase;"
      >
        ${hack.category.replace(/_/g, ' ')}
      </span>
      <h3 id="hack-title-${hack.id}" style="font-size: 1.25rem; margin: 0.5rem 0 0.25rem 0; color: #F3F4F6;">
        ${hack.title}
      </h3>
    </div>
    <div 
      class="cost-badge" 
      aria-label="Estimated implementation cost: ${hack.estimatedCostUsd === 0 ? 'Free' : '$' + hack.estimatedCostUsd}"
      style="background: #065F46; color: #D1FAE5; padding: 0.35rem 0.75rem; border-radius: 9999px; font-weight: 700; font-size: 0.875rem;"
    >
      ${hack.estimatedCostUsd === 0 ? 'Zero-Cost' : `~$${hack.estimatedCostUsd} USD`}
    </div>
  </div>

  <p style="color: #D1D5DB; font-size: 0.925rem; margin: 0.75rem 0; line-height: 1.5;">
    <strong>Scientific Mechanism:</strong> ${hack.scientificMechanism}
  </p>

  ${
    hack.expectedCADR_CFM
      ? `<div style="background: #111827; padding: 0.5rem 0.75rem; border-radius: 4px; margin-bottom: 0.75rem; font-size: 0.875rem; color: #60A5FA;">
           ⚡ <strong>Clean Air Delivery Rate (CADR):</strong> ~${hack.expectedCADR_CFM} CFM
         </div>`
      : ''
  }

  <div style="margin-top: 1rem;">
    <h4 style="font-size: 1rem; color: #9CA3AF; margin-bottom: 0.5rem;">Materials Needed:</h4>
    <ul style="padding-left: 1.25rem; color: #E5E7EB; font-size: 0.9rem;">
      ${materialsList}
    </ul>
  </div>

  <div style="margin-top: 1rem;">
    <h4 style="font-size: 1rem; color: #9CA3AF; margin-bottom: 0.5rem;">Step-by-Step Instructions:</h4>
    <ol style="padding-left: 1.25rem; color: #E5E7EB; font-size: 0.9rem;">
      ${stepsList}
    </ol>
  </div>

  ${
    hack.mythBustingNote
      ? `
  <aside 
    role="note" 
    aria-label="Fact check note" 
    style="margin-top: 1rem; background: #312E81; border-left: 4px solid #818CF8; padding: 0.75rem; border-radius: 0.25rem; font-size: 0.85rem; color: #E0E7FF;"
  >
    <strong>💡 Science Fact-Check:</strong> ${hack.mythBustingNote}
  </aside>`
      : ''
  }

  ${
    hack.safetyWarning
      ? `
  <div 
    role="alert" 
    style="margin-top: 0.75rem; background: #7F1D1D; border-left: 4px solid #EF4444; padding: 0.75rem; border-radius: 0.25rem; font-size: 0.85rem; color: #FEE2E2;"
  >
    <strong>⚠️ Safety Warning:</strong> ${hack.safetyWarning}
  </div>`
      : ''
  }
</article>
    `.trim();
  }
}

