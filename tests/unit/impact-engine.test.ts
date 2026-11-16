import { describe, it, expect } from 'vitest';
import { ImpactEngine } from '../../src/lib/impact-engine.js';
import { FamilyProfile } from '../../src/types/user.js';

describe('ImpactEngine Unit Tests', () => {
  const mockProfile: FamilyProfile = {
    familyId: 'test_family',
    locationCity: 'Delhi',
    neighborhood: 'Central',
    householdSize: 4,
    members: [
      {
        id: '1',
        relation: 'Child',
        ageGroup: 'CHILD',
        vulnerabilities: ['ASTHMATIC_COPD'],
        dailyOutdoorHours: 2,
      },
      {
        id: '2',
        relation: 'Adult',
        ageGroup: 'ADULT',
        vulnerabilities: ['HEALTHY_ADULT'],
        dailyOutdoorHours: 3,
      },
    ],
    primaryCommute: 'SINGLE_OCCUPANT_CAR',
    commuteDistanceKm: 15,
    heatingType: 'UNVENTED_BIOMASS_WOOD',
    cookingType: 'PIPED_OR_CYLINDER_GAS',
    housingType: 'HIGH_RISE_APARTMENT',
    budgetPreference: 'LOW_COST_DIY',
    hasAirPurifier: false,
    hasAirConditioner: true,
  };

  it('should compute significant PM2.5 inhalation reduction during severe smog', () => {
    const ambientPM25 = 280; // severe smog day
    const metrics = ImpactEngine.calculateDirectImpact(mockProfile, ambientPM25, true, true);

    expect(metrics.baselineDailyPM25InhaledMicrograms).toBeGreaterThan(
      metrics.optimizedDailyPM25InhaledMicrograms
    );
    expect(metrics.pm25InhalationReductionPercentage).toBeGreaterThanOrEqual(60);
    expect(metrics.equivalentCigarettesAvoidedPerMonth).toBeGreaterThan(0);
    expect(metrics.riskReductionScore).toBeGreaterThanOrEqual(70);
  });

  it('should compute weekly carbon abatement from commute and heating shift', () => {
    const metrics = ImpactEngine.calculateDirectImpact(mockProfile, 200, true, true);
    expect(metrics.weeklyCarbonAbatedKg).toBeGreaterThan(10);
  });

  it('should generate transparent mathematical explanation with formula details', () => {
    const metrics = ImpactEngine.calculateDirectImpact(mockProfile, 200, true, true);
    expect(metrics.mathematicalExplanation).toContain('EPA Exposure Factors Handbook');
    expect(metrics.mathematicalExplanation).toContain('Dose (µg) =');
  });
});

