/**
 * Structured Recommendation & Direct Impact Types
 * Strictly validates GenAI assistant outputs via Zod
 */

import { AQICategory, WeatherCondition } from './aqi.js';

export interface RoutineShiftItem {
  timeSlot: string;            // e.g. "06:30 - 08:30 AM"
  standardActivity: string;    // e.g. "Outdoor morning jog in park"
  smogOptimizedActivity: string; // e.g. "Indoor stretching + shift brisk walk to 13:30 PM"
  healthImpactRationale: string;
  exposureReductionPercentage: number; // e.g. 72%
}

export type IndoorHackCategory =
  | 'DIY_FILTRATION'      // e.g. Corsi-Rosenthal box
  | 'OPTIMIZED_VENTILATION' // e.g. Inversion-break cross ventilation
  | 'SOURCE_CONTROL'       // e.g. Kitchen range hood, avoiding incense
  | 'SURFACE_HYGIENE'      // e.g. Damp mopping instead of dry broom sweeping
  | 'AIR_SEALING';         // e.g. DIY door snakes, weatherstripping

export interface IndoorHackItem {
  id: string;
  title: string;
  category: IndoorHackCategory;
  estimatedCostUsd: number;
  materialsNeeded: string[];
  stepByStepGuide: string[];
  scientificMechanism: string;
  expectedCADR_CFM?: number; // Clean Air Delivery Rate in Cubic Feet per Minute
  mythBustingNote?: string;  // e.g. "Why spider plants alone won't clear winter smog"
  safetyWarning?: string;    // e.g. "Never operate unvented combustion appliances indoors"
}

export interface SustainableAlternative {
  category: 'TRANSPORT' | 'HEATING_COOKING' | 'NEIGHBORHOOD_COLLECTIVE';
  currentBaseline: string;
  recommendedAlternative: string;
  annualCo2AvoidedKg: number;
  dailyPM25AvoidedGrams: number;
  directCommunityBenefit: string;
  paybackOrCostNote: string;
}

export interface DirectImpactMetrics {
  baselineDailyPM25InhaledMicrograms: number;
  optimizedDailyPM25InhaledMicrograms: number;
  pm25InhalationReductionPercentage: number;
  weeklyCarbonAbatedKg: number;
  equivalentCigarettesAvoidedPerMonth: number;
  riskReductionScore: number; // 0 - 100 scale
  mathematicalExplanation: string; // Transparent formula breakdown
}

export interface CommunityCollectiveAction {
  title: string;
  actionType: 'SCHOOL_ZONE_IDLE_BAN' | 'SHARED_CR_BOX_WORKSHOP' | 'COMMUNITY_AIR_SENSORS' | 'CARPOOL_ROTATION';
  participantRequirement: string;
  neighborhoodImpactMultiplier: string;
  stepToInitiate: string;
}

export interface AssistantRecommendationResponse {
  sessionId: string;
  generatedAt: string;
  targetCity: string;
  currentAQI: number;
  aqiCategory: AQICategory;
  weatherSummary: WeatherCondition;
  highRiskMembersNoted: string[];
  dailyRoutinePlan: RoutineShiftItem[];
  indoorAirHacks: IndoorHackItem[];
  sustainableAlternatives: SustainableAlternative[];
  communityActions: CommunityCollectiveAction[];
  quantifiedImpact: DirectImpactMetrics;
  disclaimer: string;
}

