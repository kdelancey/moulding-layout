# Utility Functions

This directory contains utility functions used throughout the application.

## Measurement Utilities (`measurements.ts`)

The `measurements.ts` file provides utilities for handling measurements, unit conversions, and formatting.

### Constants

- `INCH_TO_MM`: Conversion factor from inches to millimeters (25.4)
- `FOOT_TO_MM`: Conversion factor from feet to millimeters (304.8)

### Types

- `MeasurementUnit`: Union type for measurement systems ('imperial' | 'metric')
- `ImperialUnit`: Union type for imperial units ('inches' | 'feet')
- `MetricUnit`: Union type for metric units ('mm' | 'cm' | 'm')

### Functions

#### Unit Conversion

- `convertFromMm(valueMm, selectedUnit, imperialUnit, metricUnit)`: Converts a value from millimeters to the specified unit
- `convertToMm(value, selectedUnit, imperialUnit, metricUnit)`: Converts a value to millimeters from the specified unit

#### Formatting

- `formatAsFraction(value)`: Formats a number as a fraction using Unicode fraction characters
- `formatImperialMeasurement(value, imperialUnit)`: Formats a measurement value for display in imperial units
- `decimalToFraction(decimal)`: Converts a decimal value to a fraction string using Unicode fraction characters

#### Utility Functions

- `roundToNearestFraction(value, selectedUnit, imperialUnit)`: Rounds a value to the nearest 1/16th of an inch when in imperial inches
- `getInputStep(selectedUnit, imperialUnit, metricUnit)`: Calculates the appropriate step value for input fields based on the selected unit
- `getUnitLabel(selectedUnit, imperialUnit, metricUnit)`: Returns the appropriate unit label based on the selected unit

### Usage Example

```typescript
import { 
  convertFromMm, 
  convertToMm, 
  formatImperialMeasurement 
} from '@/utils/measurements'
import type { MeasurementUnit, ImperialUnit, MetricUnit } from '@/utils/measurements'

// Convert 254mm to inches
const inches = convertFromMm(254, 'imperial', 'inches')
// Result: 10 (inches)

// Convert 10 inches to mm
const mm = convertToMm(10, 'imperial', 'inches')
// Result: 254 (mm)

// Format a measurement for display
const formatted = formatImperialMeasurement(10.25, 'inches')
// Result: "10 ¼" (with Unicode fraction)
``` 