import { describe, it, expect } from 'vitest';
import { AQIService } from '../../src/services/aqi-service.js';

describe('AQIService Integration Tests', () => {
  const service = new AQIService(100, 300);

  it('should model thermal inversion during peak morning hours (07:00 AM)', async () => {
    const data = await service.getUrbanAirQuality('Delhi', 7);

    expect(data.weather.isThermalInversionActive).toBe(true);
    expect(data.weather.thermalInversionRisk).toBe('CRITICAL');
    expect(data.pollutants.pm25).toBeGreaterThan(200);
    expect(data.weather.atmosphericBoundaryLayerHeightMeters).toBeLessThan(300);
  });

  it('should model boundary layer breakup during mid-day solar window (14:00 PM)', async () => {
    const data = await service.getUrbanAirQuality('Delhi', 14);

    expect(data.weather.isThermalInversionActive).toBe(false);
    expect(data.pollutants.pm25).toBeLessThan(150);
    expect(data.weather.atmosphericBoundaryLayerHeightMeters).toBeGreaterThan(500);
    expect(data.weather.optimalVentilationWindow.startHour).toBe(13);
  });

  it('should cache repeated calls within TTL', async () => {
    const start = performance.now();
    await service.getUrbanAirQuality('Beijing', 8);
    const durationFirst = performance.now() - start;

    const startCached = performance.now();
    const cachedData = await service.getUrbanAirQuality('Beijing', 8);
    const durationCached = performance.now() - startCached;

    expect(cachedData.location.cityName).toBe('Beijing');
    expect(durationCached).toBeLessThanOrEqual(durationFirst + 1);
  });
});

