/**
 * Quantified Impact Calculation Engine
 * Converts behavioral & lifestyle modifications into scientifically grounded
 * particulate dose reductions (µg PM2.5 inhaled) and greenhouse gas abatement.
 */

import {
  BERKELEY_EARTH_UG_PER_CIGARETTE,
  EMISSION_FACTORS,
  MINUTE_VENTILATION_L_PER_MIN,
} from '../config/constants.js';
import { DirectImpactMetrics } from '../types/recommendation.js';
import { CommuteMode, FamilyProfile, HeatingCookingType } from '../types/user.js';

export class ImpactEngine {
  /**
   * Calculates comprehensive quantified impact of smog mitigation interventions
   * @param profile User's family profile
   * @param ambientPM25 Current outdoor PM2.5 in µg/m³
   * @param hasPurifierAction Whether family adopts DIY C-R box or HEPA
   * @param shiftsCommute Whether family switches to sustainable commute
   */
  public static calculateDirectImpact(
    profile: FamilyProfile,
    ambientPM25: number,
    hasPurifierAction: boolean = true,
    shiftsCommute: boolean = true
  ): DirectImpactMetrics {
    // 1. Inhaled PM2.5 Dose Computation for primary adult (baseline vs optimized)
    // Conversion: 1 L/min = 0.06 m³/hour
    const baselineOutdoorHours = 3.0; // typical commute + errand + morning exertion
    const baselineIndoorHours = 21.0;

    // Indoor air infiltration without filtration typically allows 70% of outdoor PM2.5 indoors
    const unmitigatedIndoorPM25 = ambientPM25 * 0.70;

    // With DIY C-R box or HEPA, indoor PM2.5 is reduced by 75% to 85%
    const mitigatedIndoorPM25 = hasPurifierAction
      ? unmitigatedIndoorPM25 * 0.20
      : unmitigatedIndoorPM25 * 0.85;

    // Minute ventilation rates (L/min)
    const outdoorVe_baseline = MINUTE_VENTILATION_L_PER_MIN.ADULT_MODERATE_CARDIO; // morning jog/walk
    const outdoorVe_optimized = MINUTE_VENTILATION_L_PER_MIN.ADULT_LIGHT_EXERTION;  // relaxed walk at safe hour with N95
    const indoorVe = MINUTE_VENTILATION_L_PER_MIN.ADULT_REST;

    // Baseline Daily Inhaled Dose (µg):
    // Outdoor: C * (Ve * 0.06 m³/hr) * hours
    const baselineOutdoorDose =
      ambientPM25 * (outdoorVe_baseline * 0.06) * baselineOutdoorHours;
    const baselineIndoorDose =
      unmitigatedIndoorPM25 * (indoorVe * 0.06) * baselineIndoorHours;
    const baselineTotalDailyDoseUg = baselineOutdoorDose + baselineIndoorDose;

    // Optimized Daily Inhaled Dose (µg):
    // Shifting outdoor hours to 1.0 hr, wearing N95 (95% filtration), and running indoor clean air
    const optimizedOutdoorHours = 1.0;
    const optimizedIndoorHours = 23.0;
    const n95FiltrationEfficiency = 0.90; // effective real-world seal

    const optimizedOutdoorDose =
      ambientPM25 *
      (1 - n95FiltrationEfficiency) *
      (outdoorVe_optimized * 0.06) *
      optimizedOutdoorHours;
    const optimizedIndoorDose =
      mitigatedIndoorPM25 * (indoorVe * 0.06) * optimizedIndoorHours;
    const optimizedTotalDailyDoseUg = optimizedOutdoorDose + optimizedIndoorDose;

    // Inhalation Reduction Percentage
    const dailyDoseReductionUg = Math.max(0, baselineTotalDailyDoseUg - optimizedTotalDailyDoseUg);
    const pm25ReductionPct = Math.min(
      95,
      Math.round((dailyDoseReductionUg / Math.max(1, baselineTotalDailyDoseUg)) * 100)
    );

    // Equivalent Cigarettes avoided per month (Berkeley Earth formula)
    const monthlyUgAvoided = dailyDoseReductionUg * 30;
    const equivalentCigarettesPerMonth = Math.round(
      (monthlyUgAvoided / (BERKELEY_EARTH_UG_PER_CIGARETTE * 10)) * 10
    ) / 10;

    // 2. Weekly Carbon Dioxide (CO2) Abatement
    const weeklyCarbonAbatedKg = this.calculateWeeklyCarbonSaved(
      profile.primaryCommute,
      profile.commuteDistanceKm,
      shiftsCommute,
      profile.heatingType
    );

    // 3. Composite Risk Reduction Score (0 - 100 scale)
    const vulnerabilityMultiplier = profile.members.some(
      (m) =>
        m.vulnerabilities.includes('ASTHMATIC_COPD') ||
        m.vulnerabilities.includes('INFANT_TODDLER') ||
        m.vulnerabilities.includes('ELDERLY')
    )
      ? 1.25
      : 1.0;

    const riskReductionScore = Math.min(
      99,
      Math.round(pm25ReductionPct * 0.8 + (hasPurifierAction ? 15 : 0) * vulnerabilityMultiplier)
    );

    // 4. Transparent Mathematical Explanation for Explainability
    const mathematicalExplanation =
      `Based on the EPA Exposure Factors Handbook, daily inhaled dose is computed as: ` +
      `Dose (µg) = ∑ [ Ambient Concentration (µg/m³) × Minute Ventilation Rate (m³/hr) × Exposure Duration (hr) × (1 - Filtration Efficiency) ]. ` +
      `By rescheduling peak-hour exposure from 07:00 AM (thermal inversion peak) to mid-day, deploying a low-cost C-R box (reducing indoor ambient PM2.5 from ${Math.round(unmitigatedIndoorPM25)} to ${Math.round(mitigatedIndoorPM25)} µg/m³), ` +
      `and utilizing an N95 mask for transit, daily inhaled PM2.5 is slashed from ${Math.round(baselineTotalDailyDoseUg)} µg to ${Math.round(optimizedTotalDailyDoseUg)} µg (a ${pm25ReductionPct}% exposure reduction).`;

    return {
      baselineDailyPM25InhaledMicrograms: Math.round(baselineTotalDailyDoseUg),
      optimizedDailyPM25InhaledMicrograms: Math.round(optimizedTotalDailyDoseUg),
      pm25InhalationReductionPercentage: pm25ReductionPct,
      weeklyCarbonAbatedKg: Math.round(weeklyCarbonAbatedKg * 10) / 10,
      equivalentCigarettesAvoidedPerMonth: equivalentCigarettesPerMonth,
      riskReductionScore,
      mathematicalExplanation,
    };
  }

  /**
   * Computes weekly CO2 saved in kilograms from commute and heating adjustments
   */
  private static calculateWeeklyCarbonSaved(
    commute: CommuteMode,
    dailyDistanceKm: number,
    shiftsCommute: boolean,
    heatingType: HeatingCookingType
  ): number {
    let weeklyCommuteCO2Saved = 0;
    const workingDaysPerWeek = 5;
    const totalWeeklyKm = dailyDistanceKm * 2 * workingDaysPerWeek;

    if (shiftsCommute) {
      if (commute === 'SINGLE_OCCUPANT_CAR') {
        const baselineEmissions = totalWeeklyKm * EMISSION_FACTORS.SINGLE_OCCUPANT_PETROL_CAR_KG_CO2_PER_KM;
        const alternativeEmissions = totalWeeklyKm * EMISSION_FACTORS.PUBLIC_METRO_ELECTRIC_KG_CO2_PER_KM;
        weeklyCommuteCO2Saved = Math.max(0, baselineEmissions - alternativeEmissions);
      } else if (commute === 'MOTORCYCLE_SCOOTER') {
        const baselineEmissions = totalWeeklyKm * 0.080;
        const alternativeEmissions = totalWeeklyKm * EMISSION_FACTORS.PUBLIC_METRO_ELECTRIC_KG_CO2_PER_KM;
        weeklyCommuteCO2Saved = Math.max(0, baselineEmissions - alternativeEmissions);
      }
    }

    // Heating adjustment savings (e.g. replacing unvented biomass/wood with electric heat pump)
    let weeklyHeatingCO2Saved = 0;
    if (heatingType === 'UNVENTED_BIOMASS_WOOD' || heatingType === 'COAL_ANGITHI') {
      const dailyHours = 6;
      const baselineWoodCO2 = dailyHours * EMISSION_FACTORS.WOOD_HEATING_KG_CO2_PER_HOUR * 7;
      const heatPumpCO2 = dailyHours * EMISSION_FACTORS.ELECTRIC_HEAT_PUMP_KG_CO2_PER_HOUR * 7;
      weeklyHeatingCO2Saved = baselineWoodCO2 - heatPumpCO2;
    }

    return weeklyCommuteCO2Saved + weeklyHeatingCO2Saved;
  }
}

