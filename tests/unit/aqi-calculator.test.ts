import { describe, it, expect } from 'vitest';
import { AQICalculator } from '../../src/lib/aqi-calculator.js';

describe('AQICalculator Unit Tests', () => {
  it('should accurately calculate AQI for Good air (PM2.5 = 8.0 µg/m³)', () => {
    const res = AQICalculator.calculatePM25AQI(8.0);
    expect(res.category).toBe('GOOD');
    expect(res.aqi).toBeGreaterThanOrEqual(0);
    expect(res.aqi).toBeLessThanOrEqual(50);
  });

  it('should accurately calculate AQI for Moderate air (PM2.5 = 25.0 µg/m³)', () => {
    const res = AQICalculator.calculatePM25AQI(25.0);
    expect(res.category).toBe('MODERATE');
    expect(res.aqi).toBeGreaterThanOrEqual(51);
    expect(res.aqi).toBeLessThanOrEqual(100);
  });

  it('should accurately calculate AQI for Unhealthy for Sensitive Groups (PM2.5 = 45.0 µg/m³)', () => {
    const res = AQICalculator.calculatePM25AQI(45.0);
    expect(res.category).toBe('UNHEALTHY_SENSITIVE');
    expect(res.aqi).toBeGreaterThanOrEqual(101);
    expect(res.aqi).toBeLessThanOrEqual(150);
  });

  it('should accurately calculate AQI for Severe winter smog (PM2.5 = 380.0 µg/m³)', () => {
    const res = AQICalculator.calculatePM25AQI(380.0);
    expect(res.category).toBe('SEVERE');
    expect(res.aqi).toBeGreaterThanOrEqual(400);
  });

  it('should throw RangeError for negative concentration', () => {
    expect(() => AQICalculator.calculatePM25AQI(-5.0)).toThrow(RangeError);
  });

  it('should return appropriate health advisories for each bracket', () => {
    const goodAdv = AQICalculator.getHealthAdvisory(35);
    expect(goodAdv.headline).toContain('satisfactory');

    const hazardAdv = AQICalculator.getHealthAdvisory(350);
    expect(hazardAdv.headline).toContain('Hazardous');
    expect(hazardAdv.outdoorExercise).toContain('Absolute ban');
  });
});

