/**
 * Indoor Air Quality (IAQ) Hacks Catalog & Recommendation Service
 * Science-grounded interventions vetted against EPA and aerosol science literature.
 */

import { IndoorHackItem } from '../types/recommendation.js';

export class IndoorHacksService {
  private static HACKS_CATALOG: IndoorHackItem[] = [
    {
      id: 'corsi-rosenthal-box',
      title: 'DIY Corsi-Rosenthal (C-R) Air Purifier Box',
      category: 'DIY_FILTRATION',
      estimatedCostUsd: 35.0,
      materialsNeeded: [
        '1x standard 20" box fan (3-speed)',
        '4x MERV 13 (or MERV 14) furnace filters (20" x 20")',
        '1x cardboard shroud (cut to 14" center circle diameter)',
        '1x roll of standard duct tape or painter tape',
      ],
      stepByStepGuide: [
        'Place cardboard base on the floor to form the bottom seal.',
        'Tape the 4 MERV 13 filters in a cube with arrows pointing inward toward the center.',
        'Place the 20" box fan facing UPWARD on top of the filter cube and tape all perimeter seams airtight.',
        'Tape the cardboard shroud over the front face of the fan to eliminate blade-tip back-pressure turbulence and boost airflow efficiency by 15-20%.',
        'Plug in and run on Medium or High in rooms occupied by vulnerable family members.',
      ],
      scientificMechanism:
        'The 4-filter geometry creates ~32 sq ft of pleated filter media, lowering air resistance and delivering clean air delivery rates (CADR) exceeding 250 CFM, rivaling $400 commercial HEPA units at 1/10th the initial and replacement cost.',
      expectedCADR_CFM: 260,
      mythBustingNote:
        'Commercial HEPA marketers claim only proprietary units work; however, UC Davis peer-reviewed trials proved Corsi-Rosenthal boxes achieve 99.2% airborne particle reduction within 30 minutes in standard 400 sq ft rooms.',
      safetyWarning:
        'Always ensure filters are rated MERV 13 or higher (captures >85% of 0.3–1.0 µm particles). Replace filters every 3–6 months during winter smog.',
    },
    {
      id: 'damp-mopping-settled-particles',
      title: 'Microfiber Damp Mopping Protocol (No Dry Sweeping)',
      category: 'SURFACE_HYGIENE',
      estimatedCostUsd: 5.0,
      materialsNeeded: [
        'Microfiber mop head or damp cotton towels',
        'Warm water with a drop of neutral detergent',
      ],
      stepByStepGuide: [
        'Never dry-sweep with a standard broom during smog episodes; dry sweeping violently aerosolizes settled toxic heavy-metal particles.',
        'Dampen a microfiber cloth/mop lightly (not dripping wet).',
        'Mop floors starting from the furthest corner toward the door using S-shaped strokes.',
        'Rinse the cloth in a separate bucket to trap particulates down the drain.',
      ],
      scientificMechanism:
        'Dry sweeping resuspends up to 80% of settled fine particles (PM2.5 and PM10) into the breathing zone for 2-4 hours. Damp mopping captures particulate matter via surface tension without aerodynamic resuspension.',
      mythBustingNote:
        'Many families believe sweeping cleans the air; in reality, indoor airborne PM2.5 spikes by up to 300% for 90 minutes post-sweeping.',
    },
    {
      id: 'thermal-inversion-window-ventilation',
      title: 'Solar-Break Window Ventilation (The 1:30 PM Window)',
      category: 'OPTIMIZED_VENTILATION',
      estimatedCostUsd: 0.0,
      materialsNeeded: ['Timer or smartphone reminder', 'Window mesh or pre-filter cheesecloth'],
      stepByStepGuide: [
        'Keep all exterior windows and balcony doors sealed tight between 6:00 AM and 11:00 AM (peak thermal inversion).',
        'Set an alarm for 13:30 PM (when solar heating breaks the boundary layer).',
        'Open opposing windows for a brief 15-20 minute cross-breeze to expel built-up indoor CO2, VOCs, and moisture.',
        'Re-seal all windows before 16:30 PM before evening radiation cooling traps emissions.',
      ],
      scientificMechanism:
        'Trapping air indefinitely indoors leads to toxic CO2 buildup (>1500 ppm), causing cognitive fatigue. Venting strictly during peak solar thermal boundary breakdown exchanges air when ambient PM2.5 is at its lowest diurnal concentration.',
    },
    {
      id: 'diy-door-snakes-and-foam-seals',
      title: 'DIY Draft Snakes & Perimeter Infiltration Barrier',
      category: 'AIR_SEALING',
      estimatedCostUsd: 8.0,
      materialsNeeded: [
        'Old towels, thick socks, or fabric tubes filled with dry rice/beans',
        'Adhesive foam weatherstripping tape (optional)',
      ],
      stepByStepGuide: [
        'Inspect bottom gaps of exterior entry doors and leaky window sashes.',
        'Roll a thick bath towel tightly or fill a fabric tube with rice to create a door snake.',
        'Press firmly against the base of the front door and balcony sliders.',
        'Apply foam tape to window frames that rattle in the wind.',
      ],
      scientificMechanism:
        'Reduces passive building infiltration rate from 1.5 Air Changes per Hour (ACH) down to 0.4 ACH, blocking outdoor smog pressure from penetrating living spaces by over 60%.',
    },
    {
      id: 'kitchen-source-isolation-protocol',
      title: 'Kitchen Source Isolation & Range Hood Ventilation',
      category: 'SOURCE_CONTROL',
      estimatedCostUsd: 0.0,
      materialsNeeded: ['Kitchen door closure', 'Exhaust fan or range hood'],
      stepByStepGuide: [
        'Close the kitchen door while frying, roasting, or sautéing with oil.',
        'Turn on kitchen exhaust at least 2 minutes BEFORE igniting burners to establish outward negative pressure.',
        'Never burn incense, scented candles, or unvented mosquito coils indoors during smog season.',
        'Keep exhaust fan running for 5 minutes after cooking finishes.',
      ],
      scientificMechanism:
        'Cooking oils and gas combustion produce ultrafine particles (<0.1 µm) reaching concentrations >500 µg/m³. Sealing the kitchen isolates the living quarters and prevents particulate migration to bedrooms.',
      mythBustingNote:
        'Burning scented candles does not "purify" smoggy odors; paraffin candles emit black carbon and benzene, exacerbating respiratory distress.',
      safetyWarning:
        'Never operate unvented coal, wood, or kerosene heaters inside enclosed rooms. Carbon monoxide (CO) poisoning risk is lethal.',
    },
  ];

  /**
   * Retrieves recommended hacks filtered by budget and user profile
   */
  public static getRecommendedHacks(budgetTier: string = 'LOW_COST_DIY'): IndoorHackItem[] {
    if (budgetTier === 'ZERO_COST') {
      return this.HACKS_CATALOG.filter((h) => h.estimatedCostUsd === 0);
    }
    return [...this.HACKS_CATALOG];
  }

  /**
   * Educational Myth-Busting Database for Air Quality
   */
  public static getDebunkedMyths(): Array<{ myth: string; reality: string; scienceBasis: string }> {
    return [
      {
        myth: 'Household houseplants (like snake plants or peace lilies) effectively purify severe winter smog.',
        reality:
          'Plants have virtually zero measurable impact on fine particulate matter (PM2.5) in real-world homes.',
        scienceBasis:
          'NASA clean air studies were conducted in tiny, sealed 1-cubic-meter Plexiglas chambers over 24 hours for volatile gases. To match a single $35 Corsi-Rosenthal box CADR, a standard living room would require 10 to 100 plants per square foot.',
      },
      {
        myth: 'Ozone generators and ionizers are advanced purifiers that remove smog.',
        reality:
          'Ozone generators are hazardous air pollutants that directly induce lung inflammation and asthma attacks.',
        scienceBasis:
          'Ozone (O3) is a powerful pulmonary irritant that reacts with indoor organic chemicals to generate toxic formaldehyde and ultrafine aerosols. US EPA explicitly warns against indoor ozone generators.',
      },
      {
        myth: 'Keeping windows closed 24 hours a day for weeks without filtration is the best strategy.',
        reality:
          'Closed unventilated rooms accumulate metabolic CO2 (>2,000 ppm), moisture (mold spores), and indoor VOCs.',
        scienceBasis:
          'Strategic, timed micro-ventilation during peak solar boundary breakdown (1:30 PM - 2:30 PM) flushes CO2 while minimizing particulate infiltration.',
      },
    ];
  }
}

