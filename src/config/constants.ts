/**
 * Environmental & Scientific Constants
 * Grounded in peer-reviewed atmospheric studies and WHO/EPA reference guidelines.
 */

import { AQIBreakpoint } from '../types/aqi.js';

/**
 * US EPA PM2.5 24-Hour Breakpoints (revised standard)
 */
export const EPA_PM25_BREAKPOINTS: AQIBreakpoint[] = [
  {
    cLow: 0.0,
    cHigh: 12.0,
    iLow: 0,
    iHigh: 50,
    category: 'GOOD',
    label: 'Good',
    colorHex: '#00E400',
    contrastForeground: '#004D00',
    iconName: 'ShieldCheck'
  },
  {
    cLow: 12.1,
    cHigh: 35.4,
    iLow: 51,
    iHigh: 100,
    category: 'MODERATE',
    label: 'Moderate',
    colorHex: '#FFFF00',
    contrastForeground: '#595900',
    iconName: 'Info'
  },
  {
    cLow: 35.5,
    cHigh: 55.4,
    iLow: 101,
    iHigh: 150,
    category: 'UNHEALTHY_SENSITIVE',
    label: 'Unhealthy for Sensitive Groups',
    colorHex: '#FF7E00',
    contrastForeground: '#663200',
    iconName: 'AlertTriangle'
  },
  {
    cLow: 55.5,
    cHigh: 150.4,
    iLow: 151,
    iHigh: 200,
    category: 'UNHEALTHY',
    label: 'Unhealthy',
    colorHex: '#FF0000',
    contrastForeground: '#FFFFFF',
    iconName: 'AlertOctagon'
  },
  {
    cLow: 150.5,
    cHigh: 250.4,
    iLow: 201,
    iHigh: 300,
    category: 'VERY_UNHEALTHY',
    label: 'Very Unhealthy',
    colorHex: '#8F3F97',
    contrastForeground: '#FFFFFF',
    iconName: 'AlertCircle'
  },
  {
    cLow: 250.5,
    cHigh: 350.4,
    iLow: 301,
    iHigh: 400,
    category: 'HAZARDOUS',
    label: 'Hazardous (Emergency Warning)',
    colorHex: '#7E0023',
    contrastForeground: '#FFFFFF',
    iconName: 'Skull'
  },
  {
    cLow: 350.5,
    cHigh: 500.4,
    iLow: 401,
    iHigh: 500,
    category: 'SEVERE',
    label: 'Severe / Emergency Critical',
    colorHex: '#4A0014',
    contrastForeground: '#FFFFFF',
    iconName: 'Biohazard'
  }
];

/**
 * Human Minute Ventilation Rates (VE) in Liters/min (L/min)
 * Source: US EPA Exposure Factors Handbook (2011)
 */
export const MINUTE_VENTILATION_L_PER_MIN = {
  INFANT_REST: 3.2,
  CHILD_REST: 6.8,
  CHILD_ACTIVE: 18.5,
  ADULT_REST: 8.0,
  ADULT_LIGHT_EXERTION: 16.0,
  ADULT_MODERATE_CARDIO: 35.0,
  ADULT_HEAVY_CARDIO: 58.0,
  SENIOR_REST: 7.5,
} as const;

/**
 * Equivalent cigarettes per PM2.5 rule of thumb (Berkeley Earth: 22 µg/m³ PM2.5 per day ≈ 1 cigarette)
 */
export const BERKELEY_EARTH_UG_PER_CIGARETTE = 22.0;

/**
 * Vehicle and Heating Carbon Emission Factors
 */
export const EMISSION_FACTORS = {
  SINGLE_OCCUPANT_PETROL_CAR_KG_CO2_PER_KM: 0.170,
  SINGLE_OCCUPANT_DIESEL_CAR_KG_CO2_PER_KM: 0.190,
  CARPOOL_PER_PERSON_KG_CO2_PER_KM: 0.055,
  PUBLIC_METRO_ELECTRIC_KG_CO2_PER_KM: 0.028,
  EV_SCOOTER_KG_CO2_PER_KM: 0.018,
  CYCLING_WALKING_KG_CO2_PER_KM: 0.000,
  WOOD_HEATING_KG_CO2_PER_HOUR: 1.85,
  ELECTRIC_HEAT_PUMP_KG_CO2_PER_HOUR: 0.32,
} as const;

/**
 * Winter Diurnal Smog Profiles (Local Time 24-hr)
 */
export const WINTER_DIURNAL_SCHEDULE = {
  MORNING_INVERSION_PEAK: { start: 6, end: 9.5, reason: 'Ground radiation cooling traps vehicular and biomass emissions under shallow boundary layer.' },
  SOLAR_DISPERSAL_WINDOW: { start: 13, end: 15.5, reason: 'Peak solar insolation breaks thermal boundary layer; optimal for filtered cross-ventilation.' },
  EVENING_INVERSION_FORMATION: { start: 18, end: 23, reason: 'Rapid temperature drop causes secondary inversion; cooking and evening rush hour concentrate near ground.' },
} as const;

