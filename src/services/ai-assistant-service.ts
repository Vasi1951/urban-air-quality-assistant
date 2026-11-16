/**
 * GenAI Air Quality Assistant Orchestration Service
 * Integrates prompt safety guardrails, schema enforcement, and deterministic resilience.
 */

import { z } from 'zod';
import { SECURITY_CONFIG } from '../config/security.js';
import { AQICalculator } from '../lib/aqi-calculator.js';
import { ImpactEngine } from '../lib/impact-engine.js';
import { SecuritySanitizer } from '../lib/security/sanitizer.js';
import { AQIMeasurement } from '../types/aqi.js';
import {
  AssistantRecommendationResponse,
  CommunityCollectiveAction,
  RoutineShiftItem,
  SustainableAlternative,
} from '../types/recommendation.js';
import { FamilyProfile } from '../types/user.js';
import { AQIService } from './aqi-service.js';
import { IndoorHacksService } from './indoor-hacks-service.js';

/**
 * Zod Schema to strictly validate GenAI assistant structured outputs
 */
export const AssistantRecommendationSchema = z.object({
  sessionId: z.string(),
  generatedAt: z.string(),
  targetCity: z.string(),
  currentAQI: z.number(),
  aqiCategory: z.enum([
    'GOOD',
    'MODERATE',
    'UNHEALTHY_SENSITIVE',
    'UNHEALTHY',
    'VERY_UNHEALTHY',
    'HAZARDOUS',
    'SEVERE',
  ]),
  highRiskMembersNoted: z.array(z.string()),
  dailyRoutinePlan: z.array(
    z.object({
      timeSlot: z.string(),
      standardActivity: z.string(),
      smogOptimizedActivity: z.string(),
      healthImpactRationale: z.string(),
      exposureReductionPercentage: z.number().min(0).max(100),
    })
  ),
  indoorAirHacks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      category: z.enum([
        'DIY_FILTRATION',
        'OPTIMIZED_VENTILATION',
        'SOURCE_CONTROL',
        'SURFACE_HYGIENE',
        'AIR_SEALING',
      ]),
      estimatedCostUsd: z.number(),
      materialsNeeded: z.array(z.string()),
      stepByStepGuide: z.array(z.string()),
      scientificMechanism: z.string(),
      expectedCADR_CFM: z.number().optional(),
      mythBustingNote: z.string().optional(),
      safetyWarning: z.string().optional(),
    })
  ),
  sustainableAlternatives: z.array(
    z.object({
      category: z.enum(['TRANSPORT', 'HEATING_COOKING', 'NEIGHBORHOOD_COLLECTIVE']),
      currentBaseline: z.string(),
      recommendedAlternative: z.string(),
      annualCo2AvoidedKg: z.number(),
      dailyPM25AvoidedGrams: z.number(),
      directCommunityBenefit: z.string(),
      paybackOrCostNote: z.string(),
    })
  ),
  communityActions: z.array(
    z.object({
      title: z.string(),
      actionType: z.enum([
        'SCHOOL_ZONE_IDLE_BAN',
        'SHARED_CR_BOX_WORKSHOP',
        'COMMUNITY_AIR_SENSORS',
        'CARPOOL_ROTATION',
      ]),
      participantRequirement: z.string(),
      neighborhoodImpactMultiplier: z.string(),
      stepToInitiate: z.string(),
    })
  ),
  quantifiedImpact: z.object({
    baselineDailyPM25InhaledMicrograms: z.number(),
    optimizedDailyPM25InhaledMicrograms: z.number(),
    pm25InhalationReductionPercentage: z.number(),
    weeklyCarbonAbatedKg: z.number(),
    equivalentCigarettesAvoidedPerMonth: z.number(),
    riskReductionScore: z.number(),
    mathematicalExplanation: z.string(),
  }),
  disclaimer: z.string(),
});

export class AIAssistantService {
  private aqiService: AQIService;

  constructor(aqiService?: AQIService) {
    this.aqiService = aqiService || new AQIService();
  }

  /**
   * Generates a fully audited, personalized air quality plan
   */
  public async generatePersonalizedPlan(
    profile: FamilyProfile,
    customUserPrompt?: string
  ): Promise<AssistantRecommendationResponse> {
    // 1. Audit and sanitize optional custom prompt
    if (customUserPrompt) {
      const audit = SecuritySanitizer.sanitizeAndAuditInput(customUserPrompt);
      if (!audit.isSafe) {
        throw new Error(
          `Security Firewall Blocked Request: ${audit.violations.join('; ')}`
        );
      }
    }

    // 2. Fetch current environmental & thermal inversion data
    const aqiData = await this.aqiService.getUrbanAirQuality(profile.locationCity);

    // 3. Identify vulnerable family members
    const highRiskNotes: string[] = [];
    profile.members.forEach((m) => {
      if (m.vulnerabilities.includes('INFANT_TODDLER')) {
        highRiskNotes.push(`${m.relation}: Underdeveloped alveoli and 2x higher respiratory volume per kg.`);
      }
      if (m.vulnerabilities.includes('ASTHMATIC_COPD')) {
        highRiskNotes.push(`${m.relation}: High bronchospasm sensitivity; airborne PM2.5 triggers airway constriction.`);
      }
      if (m.vulnerabilities.includes('ELDERLY') || m.vulnerabilities.includes('CARDIOVASCULAR')) {
        highRiskNotes.push(`${m.relation}: Particulates cross alveolar-capillary barrier, increasing microvascular clotting risk.`);
      }
    });

    // 4. Generate Routine Shift Items tailored to thermal inversion hours
    const routineShifts = this.buildRoutineShifts(profile, aqiData);

    // 5. Select indoor air hacks
    const indoorHacks = IndoorHacksService.getRecommendedHacks(profile.budgetPreference);

    // 6. Generate Sustainable Alternatives
    const sustainableAlternatives = this.buildSustainableAlternatives(profile);

    // 7. Community Collective Actions
    const communityActions = this.buildCommunityActions();

    // 8. Calculate direct mathematical impact
    const directImpact = ImpactEngine.calculateDirectImpact(
      profile,
      aqiData.pollutants.pm25,
      true,
      profile.primaryCommute === 'SINGLE_OCCUPANT_CAR' || profile.primaryCommute === 'MOTORCYCLE_SCOOTER'
    );

    const advisory = AQICalculator.getHealthAdvisory(aqiData.aqi);

    const responsePayload: AssistantRecommendationResponse = {
      sessionId: `aero_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      generatedAt: new Date().toISOString(),
      targetCity: profile.locationCity,
      currentAQI: aqiData.aqi,
      aqiCategory: aqiData.category,
      weatherSummary: aqiData.weather,
      highRiskMembersNoted: highRiskNotes,
      dailyRoutinePlan: routineShifts,
      indoorAirHacks: indoorHacks,
      sustainableAlternatives: sustainableAlternatives,
      communityActions: communityActions,
      quantifiedImpact: directImpact,
      disclaimer:
        `${advisory.headline} AeroShield provides science-based exposure mitigation guidance based on EPA and WHO standards. ` +
        'This does not replace individualized medical advice for acute respiratory exacerbations.',
    };

    // Strictly validate against Zod schema to guarantee zero structural deviations
    return AssistantRecommendationSchema.parse(responsePayload) as unknown as AssistantRecommendationResponse;
  }

  /**
   * Assembles the secured prompt string with protective delimiters
   */
  public buildSecureSystemPrompt(profile: FamilyProfile, aqi: AQIMeasurement): string {
    const delimiters = SECURITY_CONFIG.DELIMITERS;
    return [
      `You are AeroShield, an expert atmospheric scientist and urban environmental health advisor.`,
      `Your mission is to protect families and communities from severe winter smog, particulate matter (PM2.5), and thermal inversion episodes.`,
      `Provide low-emission daily routines, indoor air quality hacks, and sustainable alternatives with clear impact explanations.`,
      ``,
      `${delimiters.CONTEXT_START}`,
      `Current City: ${aqi.location.cityName}`,
      `AQI: ${aqi.aqi} (${aqi.categoryLabel})`,
      `PM2.5: ${aqi.pollutants.pm25} µg/m³`,
      `Thermal Inversion: ${aqi.weather.isThermalInversionActive ? 'ACTIVE' : 'INACTIVE'} (Risk: ${aqi.weather.thermalInversionRisk})`,
      `Optimal Solar Ventilation Window: ${aqi.weather.optimalVentilationWindow.startHour}:00 - ${aqi.weather.optimalVentilationWindow.endHour}:00`,
      `${delimiters.CONTEXT_END}`,
      ``,
      `${delimiters.USER_INPUT_START}`,
      `Household Size: ${profile.householdSize}`,
      `Housing Type: ${profile.housingType}`,
      `Primary Commute: ${profile.primaryCommute} (${profile.commuteDistanceKm} km)`,
      `Heating/Cooking: ${profile.heatingType} / ${profile.cookingType}`,
      `Budget Tier: ${profile.budgetPreference}`,
      `${delimiters.USER_INPUT_END}`,
      ``,
      `Instructions: Return strictly valid JSON adhering to the AssistantRecommendationSchema without conversational fluff.`,
    ].join('\n');
  }

  private buildRoutineShifts(profile: FamilyProfile, _aqi: AQIMeasurement): RoutineShiftItem[] {
    const shifts: RoutineShiftItem[] = [
      {
        timeSlot: '06:30 - 08:30 AM (Peak Thermal Inversion)',
        standardActivity: 'Outdoor morning walk, brisk jogging, or school bus queue',
        smogOptimizedActivity:
          'Indoor low-intensity stretching or yoga; children board carpool/shuttle directly from indoor vestibule with N95 masks.',
        healthImpactRationale:
          'Morning ground inversion compresses particulates beneath 120m altitude, creating 3x higher toxic concentration than mid-day.',
        exposureReductionPercentage: 74,
      },
      {
        timeSlot: '08:30 - 09:30 AM (Morning Rush Hour)',
        standardActivity: `Commuting via ${profile.primaryCommute} with open windows or cycling in street canyon`,
        smogOptimizedActivity:
          'Switch to metro rail or carpool; if driving, set vehicle AC to Recirculation Mode (internal loop) with cabin HEPA filter.',
        healthImpactRationale:
          'Recirculation mode prevents fresh intake of diesel exhaust (NO2 + black carbon), slashing in-cabin PM2.5 by up to 80%.',
        exposureReductionPercentage: 68,
      },
      {
        timeSlot: '13:30 - 14:30 PM (Solar Inversion Break)',
        standardActivity: 'Windows closed continuously all day',
        smogOptimizedActivity:
          'Open opposing windows for a timed 15-minute cross-ventilation flush; shake and air out doormats.',
        healthImpactRationale:
          'Solar insolation temporarily expands the planetary boundary layer, diluting PM2.5 to its lowest daily point while expelling indoor CO2.',
        exposureReductionPercentage: 35,
      },
      {
        timeSlot: '18:30 - 20:30 PM (Evening Smog Accumulation)',
        standardActivity: 'Evening market walk or outdoor sports practice',
        smogOptimizedActivity:
          'Indoor reading, homework, and family activities inside the designated Clean Air Room running a DIY Corsi-Rosenthal box.',
        healthImpactRationale:
          'Evening temperature drop traps domestic heating smoke and return rush-hour emissions at pedestrian height.',
        exposureReductionPercentage: 82,
      },
    ];

    return shifts;
  }

  private buildSustainableAlternatives(profile: FamilyProfile): SustainableAlternative[] {
    const alternatives: SustainableAlternative[] = [
      {
        category: 'TRANSPORT',
        currentBaseline: `Daily single-occupant commute (${profile.commuteDistanceKm} km each way)`,
        recommendedAlternative:
          'Join a neighborhood carpool rotation (3+ passengers) or transition to electric metro rail with last-mile shared shuttle.',
        annualCo2AvoidedKg: Math.round(profile.commuteDistanceKm * 2 * 250 * 0.142),
        dailyPM25AvoidedGrams: 4.8,
        directCommunityBenefit:
          'Every vehicle removed from morning queue directly eliminates 0.17 kg CO2/km and localized diesel particulate plumes near schools.',
        paybackOrCostNote: 'Saves 50% - 65% of monthly commuting fuel and maintenance expenses.',
      },
      {
        category: 'HEATING_COOKING',
        currentBaseline: `${profile.heatingType} for living space warmth`,
        recommendedAlternative:
          'Switch to an inverter heat pump or sealed ceramic convection radiator paired with DIY door-snake draft blockers.',
        annualCo2AvoidedKg: 640,
        dailyPM25AvoidedGrams: 18.5,
        directCommunityBenefit:
          'Eliminates direct indoor combustion, preventing dangerous carbon monoxide accumulation and toxic indoor VOC spikes.',
        paybackOrCostNote: 'Lowers energy bills by up to 35% compared to resistive space heaters.',
      },
    ];

    return alternatives;
  }

  private buildCommunityActions(): CommunityCollectiveAction[] {
    return [
      {
        title: 'Zero-Idling School Drop-off Zone',
        actionType: 'SCHOOL_ZONE_IDLE_BAN',
        participantRequirement: 'School administration + 15 parent volunteers',
        neighborhoodImpactMultiplier: 'Drops roadside PM2.5 at school gates by up to 45% during 08:00 AM drop-off.',
        stepToInitiate:
          'Distribute "Turn Key, Be Idle-Free" pledge cards to parents and place anti-idling sandwich boards in arrival lanes.',
      },
      {
        title: 'Neighborhood DIY Corsi-Rosenthal Box Assembly Workshop',
        actionType: 'SHARED_CR_BOX_WORKSHOP',
        participantRequirement: 'Community center or apartment association (8-12 families)',
        neighborhoodImpactMultiplier:
          'Bulk purchasing of MERV 13 filters drops unit cost from $45 to $28 per household, protecting senior and infant residents.',
        stepToInitiate:
          'Organize a 1-hour weekend workshop in the residential club house or community library.',
      },
    ];
  }
}
