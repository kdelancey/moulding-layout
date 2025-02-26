// Define measurement units and conversion factors
export const INCH_TO_MM = 25.4
export const FOOT_TO_MM = 304.8

// Define measurement types
export type MeasurementUnit = 'imperial' | 'metric'
export type ImperialUnit = 'inches' | 'feet'
export type MetricUnit = 'mm' | 'cm' | 'm'

/**
 * Converts a value from millimeters to the specified unit
 * @param valueMm Value in millimeters
 * @param selectedUnit The measurement system (imperial or metric)
 * @param imperialUnit The imperial unit (inches or feet)
 * @param metricUnit The metric unit (mm, cm, or m)
 * @returns The converted value
 */
export function convertFromMm(
  valueMm: number, 
  selectedUnit: MeasurementUnit, 
  imperialUnit: ImperialUnit = 'inches', 
  metricUnit: MetricUnit = 'cm'
): number {
  if (selectedUnit === 'imperial') {
    if (imperialUnit === 'inches') {
      const inches = valueMm / INCH_TO_MM
      return Math.round(inches * 16) / 16 // Round to nearest 1/16th inch
    } else { // feet
      return parseFloat((valueMm / FOOT_TO_MM).toFixed(2))
    }
  } else { // metric
    if (metricUnit === 'mm') {
      return Math.round(valueMm)
    } else if (metricUnit === 'cm') {
      return parseFloat((valueMm / 10).toFixed(1))
    } else { // meters
      return parseFloat((valueMm / 1000).toFixed(3))
    }
  }
}

/**
 * Converts a value to millimeters from the specified unit
 * @param value The value to convert
 * @param selectedUnit The measurement system (imperial or metric)
 * @param imperialUnit The imperial unit (inches or feet)
 * @param metricUnit The metric unit (mm, cm, or m)
 * @returns The value in millimeters
 */
export function convertToMm(
  value: number, 
  selectedUnit: MeasurementUnit, 
  imperialUnit: ImperialUnit = 'inches', 
  metricUnit: MetricUnit = 'cm'
): number {
  if (selectedUnit === 'imperial') {
    if (imperialUnit === 'inches') {
      return value * INCH_TO_MM
    } else { // feet
      return value * FOOT_TO_MM
    }
  } else { // metric
    if (metricUnit === 'mm') {
      return value
    } else if (metricUnit === 'cm') {
      return value * 10
    } else { // meters
      return value * 1000
    }
  }
}

/**
 * Rounds a value to the nearest 1/16th of an inch when in imperial inches
 * @param value The value to round
 * @param selectedUnit The measurement system (imperial or metric)
 * @param imperialUnit The imperial unit (inches or feet)
 * @returns The rounded value
 */
export function roundToNearestFraction(
  value: number, 
  selectedUnit: MeasurementUnit, 
  imperialUnit: ImperialUnit = 'inches'
): number {
  if (selectedUnit === 'imperial' && imperialUnit === 'inches') {
    // Round to nearest 1/16th
    return Math.round(value * 16) / 16
  }
  return value
}

/**
 * Converts a decimal value to a fraction string using Unicode fraction characters
 * @param decimal The decimal value to convert
 * @returns A string representation with Unicode fractions
 */
export function decimalToFraction(decimal: number): string {
  // Handle whole numbers
  const wholePart = Math.floor(decimal)
  let fractionalPart = decimal - wholePart
  
  // Round to nearest 1/16th
  fractionalPart = Math.round(fractionalPart * 16) / 16
  
  // If rounding made it 1, increment the whole part
  if (fractionalPart >= 0.9999) {
    return `${wholePart + 1}`
  }
  
  // If it's a whole number, just return it
  if (fractionalPart < 0.0001) {
    return `${wholePart}`
  }
  
  // Common fractions with Unicode symbols
  const fractions: Record<number, string> = {
    0.0625: "¹⁄₁₆", // 1/16
    0.125: "⅛",     // 1/8
    0.1875: "³⁄₁₆", // 3/16
    0.25: "¼",      // 1/4
    0.3125: "⁵⁄₁₆", // 5/16
    0.375: "⅜",     // 3/8
    0.4375: "⁷⁄₁₆", // 7/16
    0.5: "½",       // 1/2
    0.5625: "⁹⁄₁₆", // 9/16
    0.625: "⅝",     // 5/8
    0.6875: "¹¹⁄₁₆", // 11/16
    0.75: "¾",      // 3/4
    0.8125: "¹³⁄₁₆", // 13/16
    0.875: "⅞",     // 7/8
    0.9375: "¹⁵⁄₁₆"  // 15/16
  }
  
  // Return the formatted value
  if (wholePart === 0) {
    return fractions[fractionalPart] || fractionalPart.toFixed(2)
  } else {
    return `${wholePart} ${fractions[fractionalPart] || fractionalPart.toFixed(2)}`
  }
}

/**
 * Formats a measurement value for display in imperial units
 * @param value The value to format
 * @param imperialUnit The imperial unit (inches or feet)
 * @returns A formatted string
 */
export function formatImperialMeasurement(value: number, imperialUnit: ImperialUnit): string {
  if (imperialUnit === 'inches') {
    return decimalToFraction(value)
  } else { // feet
    // For feet, we'll show decimal feet
    return value.toFixed(2)
  }
}

/**
 * Calculates the appropriate step value for input fields based on the selected unit
 * @param selectedUnit The measurement system (imperial or metric)
 * @param imperialUnit The imperial unit (inches or feet)
 * @param metricUnit The metric unit (mm, cm, or m)
 * @returns The step value for input fields
 */
export function getInputStep(
  selectedUnit: MeasurementUnit, 
  imperialUnit: ImperialUnit, 
  metricUnit: MetricUnit
): number {
  if (selectedUnit === 'imperial' && imperialUnit === 'inches') {
    return 0.0625 // 1/16th of an inch
  } else if (selectedUnit === 'imperial' && imperialUnit === 'feet') {
    return 0.01 // 0.01 feet
  } else if (selectedUnit === 'metric' && metricUnit === 'mm') {
    return 1 // 1mm
  } else if (selectedUnit === 'metric' && metricUnit === 'cm') {
    return 0.1 // 0.1cm
  } else { // meters
    return 0.001 // 0.001m
  }
}

/**
 * Returns the appropriate unit label based on the selected unit
 * @param selectedUnit The measurement system (imperial or metric)
 * @param imperialUnit The imperial unit (inches or feet)
 * @param metricUnit The metric unit (mm, cm, or m)
 * @returns The unit label
 */
export function getUnitLabel(
  selectedUnit: MeasurementUnit, 
  imperialUnit: ImperialUnit, 
  metricUnit: MetricUnit
): string {
  if (selectedUnit === 'imperial') {
    return imperialUnit
  } else {
    return metricUnit
  }
}

/**
 * Formats a number as a fraction using Unicode fraction characters
 * @param value The value to format as a fraction
 * @returns A string representation with Unicode fractions
 */
export function formatAsFraction(value: number): string {
  // Calculate the decimal part
  const wholePart = Math.floor(value)
  const decimalPart = value - wholePart
  
  // Common fractions with Unicode symbols
  const fractions: Record<number, string> = {
    0.0625: "¹⁄₁₆", // 1/16
    0.125: "⅛",     // 1/8
    0.1875: "³⁄₁₆", // 3/16
    0.25: "¼",      // 1/4
    0.3125: "⁵⁄₁₆", // 5/16
    0.375: "⅜",     // 3/8
    0.4375: "⁷⁄₁₆", // 7/16
    0.5: "½",       // 1/2
    0.5625: "⁹⁄₁₆", // 9/16
    0.625: "⅝",     // 5/8
    0.6875: "¹¹⁄₁₆", // 11/16
    0.75: "¾",      // 3/4
    0.8125: "¹³⁄₁₆", // 13/16
    0.875: "⅞",     // 7/8
    0.9375: "¹⁵⁄₁₆"  // 15/16
  }
  
  // Round to nearest 1/16th
  const roundedDecimal = Math.round(decimalPart * 16) / 16
  
  // If rounding made it 1, increment the whole part
  if (roundedDecimal >= 0.9999) {
    return `${wholePart + 1}`
  }
  
  // If it's a whole number, just return it
  if (roundedDecimal < 0.0001) {
    return `${wholePart}`
  }
  
  // Return the formatted value
  if (wholePart === 0) {
    return fractions[roundedDecimal] || roundedDecimal.toFixed(2)
  } else {
    return `${wholePart} ${fractions[roundedDecimal] || roundedDecimal.toFixed(2)}`
  }
} 