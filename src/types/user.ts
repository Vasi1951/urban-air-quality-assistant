/**
 * Family and Community Profile Type Definitions
 * Designed for tailored winter smog intervention planning
 */

export type VulnerabilityType =
  | 'INFANT_TODDLER'      // Higher breathing rate per kg, alveoli developing
  | 'CHILD'               // Developing lungs, high outdoor activity
  | 'ELDERLY'             // Cardiovascular/cerebrovascular risk
  | 'ASTHMATIC_COPD'      // Hyper-reactive airways, bronchospasm risk
  | 'PREGNANT'            // Transplacental particulate translocation risk
  | 'CARDIOVASCULAR'      // Endothelial dysfunction & clotting risk
  | 'OUTDOOR_WORKER'      // Extended daily occupational exposure
  | 'HEALTHY_ADULT';

export type CommuteMode =
  | 'SINGLE_OCCUPANT_CAR'
  | 'CARPOOL'
  | 'MOTORCYCLE_SCOOTER'
  | 'PUBLIC_BUS'
  | 'METRO_SUBWAY'
  | 'BICYCLE'
  | 'WALKING'
  | 'WORK_FROM_HOME';

export type HeatingCookingType =
  | 'UNVENTED_BIOMASS_WOOD'
  | 'COAL_ANGITHI'
  | 'KEROSENE_HEATER'
  | 'PIPED_OR_CYLINDER_GAS'
  | 'ELECTRIC_CONVECTION'
  | 'HEAT_PUMP_INVERTER';

export type BudgetTier = 'ZERO_COST' | 'LOW_COST_DIY' | 'MODERATE' | 'PREMIUM';

export interface FamilyMember {
  id: string;
  relation: string; // e.g. "Grandmother", "Toddler (2yo)", "Self"
  ageGroup: 'INFANT' | 'CHILD' | 'ADULT' | 'SENIOR';
  vulnerabilities: VulnerabilityType[];
  dailyOutdoorHours: number;
}

export interface FamilyProfile {
  familyId: string;
  locationCity: string;
  neighborhood: string;
  householdSize: number;
  members: FamilyMember[];
  primaryCommute: CommuteMode;
  commuteDistanceKm: number;
  heatingType: HeatingCookingType;
  cookingType: HeatingCookingType;
  housingType: 'HIGH_RISE_APARTMENT' | 'STANDALONE_HOUSE' | 'INFORMAL_SETTLEMENT' | 'LOW_RISE';
  budgetPreference: BudgetTier;
  hasAirPurifier: boolean;
  hasAirConditioner: boolean;
}

