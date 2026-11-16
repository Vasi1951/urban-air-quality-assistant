/**
 * Air Quality & Atmospheric Domain Definitions
 * Adheres to US EPA and WHO Global Air Quality Guidelines (2021)
 */

export type AQICategory =
  | 'GOOD'
  | 'MODERATE'
  | 'UNHEALTHY_SENSITIVE'
  | 'UNHEALTHY'
  | 'VERY_UNHEALTHY'
  | 'HAZARDOUS'
  | 'SEVERE';

export type ThermalInversionRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface PollutantValues {
  pm25: number;      // µg/m³
  pm10: number;      // µg/m³
  no2?: number;      // ppb or µg/m³
  so2?: number;      // ppb or µg/m³
  co?: number;       // ppm or mg/m³
  o3?: number;       // ppb or µg/m³
}

export interface WeatherCondition {
  temperatureC: number;
  relativeHumidity: number; // percentage (0 - 100)
  windSpeedKmh: number;
  atmosphericBoundaryLayerHeightMeters?: number;
  isThermalInversionActive: boolean;
  thermalInversionRisk: ThermalInversionRisk;
  optimalVentilationWindow: {
    startHour: number; // 24-hr format (e.g. 13)
    endHour: number;   // 24-hr format (e.g. 15)
    rationale: string;
  };
}

export interface AQIMeasurement {
  aqi: number;
  category: AQICategory;
  categoryLabel: string;
  primaryPollutant: keyof PollutantValues;
  pollutants: PollutantValues;
  weather: WeatherCondition;
  location: {
    cityName: string;
    coarseCoordinates: [number, number]; // [lat, lng] fuzzed to 0.1 deg for privacy
    monitoringStation: string;
  };
  timestamp: string; // ISO 8601
  source: 'LIVE_SENSOR_FEED' | 'CALIBRATED_FALLBACK' | 'HISTORICAL_MODEL';
}

export interface AQIBreakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
  category: AQICategory;
  label: string;
  colorHex: string;
  contrastForeground: string; // WCAG AAA compliant text color
  iconName: string;
}

