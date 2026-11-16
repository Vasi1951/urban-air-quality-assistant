/**
 * Mathematical AQI Calculation Engine
 * Implements standard piecewise linear interpolation for US EPA standards.
 * Formula: Ip = ((Ihi - Ilo) / (BPhi - BPlo)) * (Cp - BPlo) + Ilo
 */

import { EPA_PM25_BREAKPOINTS } from '../config/constants.js';
import { AQIBreakpoint, AQICategory } from '../types/aqi.js';

export class AQICalculator {
  /**
   * Calculates AQI from 24-hr truncated PM2.5 concentration in µg/m³
   * @param pm25Concentration Raw PM2.5 concentration in µg/m³
   * @returns Computed AQI integer and category metadata
   */
  public static calculatePM25AQI(pm25Concentration: number): {
    aqi: number;
    category: AQICategory;
    breakpoint: AQIBreakpoint;
  } {
    if (pm25Concentration < 0) {
      throw new RangeError('PM2.5 concentration cannot be negative.');
    }

    // US EPA standard specifies truncating PM2.5 to one decimal place
    const truncatedConc = Math.floor(pm25Concentration * 10) / 10;

    const matchedBreakpoint = EPA_PM25_BREAKPOINTS.find(
      (bp) => truncatedConc >= bp.cLow && truncatedConc <= bp.cHigh
    );

    // If beyond highest standard breakpoint (500.4 µg/m³), scale into SEVERE hazard
    if (!matchedBreakpoint) {
      const highestBp = EPA_PM25_BREAKPOINTS[EPA_PM25_BREAKPOINTS.length - 1]!;
      const extrapolatedAqi = Math.min(
        999,
        Math.round(highestBp.iHigh + (truncatedConc - highestBp.cHigh) * 1.5)
      );
      return {
        aqi: extrapolatedAqi,
        category: 'SEVERE',
        breakpoint: highestBp,
      };
    }

    // Piecewise linear interpolation
    const aqi = Math.round(
      ((matchedBreakpoint.iHigh - matchedBreakpoint.iLow) /
        (matchedBreakpoint.cHigh - matchedBreakpoint.cLow)) *
        (truncatedConc - matchedBreakpoint.cLow) +
        matchedBreakpoint.iLow
    );

    return {
      aqi,
      category: matchedBreakpoint.category,
      breakpoint: matchedBreakpoint,
    };
  }

  /**
   * Returns human-centric health advisory based on AQI value
   */
  public static getHealthAdvisory(aqi: number): {
    headline: string;
    generalPopulation: string;
    sensitiveGroups: string;
    outdoorExercise: string;
  } {
    if (aqi <= 50) {
      return {
        headline: 'Air quality is satisfactory; air pollution poses little or no risk.',
        generalPopulation: 'Enjoy outdoor activities freely.',
        sensitiveGroups: 'No special precautions required.',
        outdoorExercise: 'Safe for all aerobic exercise and sports.',
      };
    } else if (aqi <= 100) {
      return {
        headline: 'Air quality is acceptable; moderate concern for extremely sensitive individuals.',
        generalPopulation: 'Unusually sensitive people should consider reducing prolonged heavy exertion.',
        sensitiveGroups: 'Children and asthmatics should observe for cough or shortness of breath.',
        outdoorExercise: 'Acceptable; consider morning outdoor shifts if symptoms develop.',
      };
    } else if (aqi <= 150) {
      return {
        headline: 'Unhealthy for Sensitive Groups; general public less likely to be affected.',
        generalPopulation: 'People with respiratory or heart disease, the elderly and children should limit prolonged outdoor exertion.',
        sensitiveGroups: 'Wear well-fitted N95/KF94 masks outdoors; keep emergency inhalers accessible.',
        outdoorExercise: 'Shift strenuous cardio indoors; avoid running near arterial roadways.',
      };
    } else if (aqi <= 200) {
      return {
        headline: 'Unhealthy; everyone may begin to experience adverse health effects.',
        generalPopulation: 'Active children and adults, and people with respiratory disease, should avoid prolonged outdoor exertion.',
        sensitiveGroups: 'Avoid all outdoor physical activity; seal room with air filtration.',
        outdoorExercise: 'Cease outdoor jogging, cycling, and sports; switch to home yoga or low-intensity movement.',
      };
    } else if (aqi <= 300) {
      return {
        headline: 'Very Unhealthy: Health alert - the risk of health effects is increased for everyone.',
        generalPopulation: 'Everyone should avoid prolonged outdoor exertion; keep windows closed during thermal inversion hours.',
        sensitiveGroups: 'Remain strictly indoors in a purified room; high risk of cardiac or respiratory exacerbation.',
        outdoorExercise: 'Strictly prohibited outdoors; exertion multiplies deep alveolar deposition by up to 5x.',
      };
    } else {
      return {
        headline: 'Hazardous / Emergency Smog Conditions: Entire population is more likely to be severely affected.',
        generalPopulation: 'Avoid all physical outdoor activity; run continuous HEPA/Corsi-Rosenthal filtration indoors.',
        sensitiveGroups: 'Emergency protocol: vulnerable family members should remain in sealed clean-air rooms.',
        outdoorExercise: 'Absolute ban on outdoor exertion. Seal gaps under doors with damp towels or door snakes.',
      };
    }
  }
}

