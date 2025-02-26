<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import WainscotPanelLayout from './WainscotPanelLayout.vue'
import type { MeasurementUnit, ImperialUnit, MetricUnit } from '@/utils/measurements'
import {
  INCH_TO_MM,
  convertFromMm,
  convertToMm,
  roundToNearestFraction,
  formatImperialMeasurement,
  getInputStep,
  getUnitLabel
} from '@/utils/measurements'

// State for wall dimensions and unit preferences
const selectedUnit = ref<MeasurementUnit>('imperial')
const imperialUnit = ref<ImperialUnit>('inches')
const metricUnit = ref<MetricUnit>('cm')

// Wall dimensions in mm (internal calculations always use mm)
const wallHeightMm = ref(1854) // Default: 73 inches
const wallWidthMm = ref(889)  // Default: 35 inches

// Wainscot components dimensions in mm
const chairRailHeightMm = ref(102) // Default: 4 inches (top rail height)
const wainscotCapHeightMm = ref(19) // Default: 3/4 inch
const railHeightMm = ref(51) // Default: 2 inches (bottom rail height)
const stileWidthMm = ref(76) // Default: 3 inches
const panelMoldingWidthMm = ref(19) // Default: 3/4 inch
const baseboardHeightMm = ref(152) // Default: 6 inches
const shoeMoldingHeightMm = ref(19) // Default: 3/4 inch

// Panel configuration
const horizontalPanelCount = ref(3)
const verticalPanelCount = ref(1)

// Input values (for display)
const wallWidthInput = ref('')
const wallHeightInput = ref('')
const chairRailHeightInput = ref('')
const wainscotCapHeightInput = ref('')
const railHeightInput = ref('')
const stileWidthInput = ref('')
const panelMoldingWidthInput = ref('')
const baseboardHeightInput = ref('')
const shoeMoldingHeightInput = ref('')

// Display values (for input fields)
const wallHeight = computed(() => 
  convertFromMm(wallHeightMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)
const wallWidth = computed(() => 
  convertFromMm(wallWidthMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)
const chairRailHeight = computed(() => 
  convertFromMm(chairRailHeightMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)
const wainscotCapHeight = computed(() => 
  convertFromMm(wainscotCapHeightMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)
const railHeight = computed(() => 
  convertFromMm(railHeightMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)
const stileWidth = computed(() => 
  convertFromMm(stileWidthMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)
const panelMoldingWidth = computed(() => 
  convertFromMm(panelMoldingWidthMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)
const baseboardHeight = computed(() => 
  convertFromMm(baseboardHeightMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)
const shoeMoldingHeight = computed(() => 
  convertFromMm(shoeMoldingHeightMm.value, selectedUnit.value, imperialUnit.value, metricUnit.value)
)

// Formatted display values (for display only, not for inputs)
const formattedWallHeight = computed(() => {
  if (selectedUnit.value === 'imperial') {
    return formatImperialMeasurement(wallHeight.value, imperialUnit.value)
  } else {
    return wallHeight.value.toString()
  }
})

const formattedWallWidth = computed(() => {
  if (selectedUnit.value === 'imperial') {
    return formatImperialMeasurement(wallWidth.value, imperialUnit.value)
  } else {
    return wallWidth.value.toString()
  }
})

const formattedChairRailHeight = computed(() => {
  if (selectedUnit.value === 'imperial') {
    return formatImperialMeasurement(chairRailHeight.value, imperialUnit.value)
  } else {
    return chairRailHeight.value.toString()
  }
})

const formattedRailHeight = computed(() => {
  if (selectedUnit.value === 'imperial') {
    return formatImperialMeasurement(railHeight.value, imperialUnit.value)
  } else {
    return railHeight.value.toString()
  }
})

const formattedStileWidth = computed(() => {
  if (selectedUnit.value === 'imperial') {
    return formatImperialMeasurement(stileWidth.value, imperialUnit.value)
  } else {
    return stileWidth.value.toString()
  }
})

// Validation for chair rail height (cannot exceed 32 inches or 1/5 of wall height)
const maxChairRailHeightMm = computed(() => {
  const oneFilthWallHeight = wallHeightMm.value / 5
  const thirtyTwoInchesInMm = 32 * INCH_TO_MM
  return Math.min(oneFilthWallHeight, thirtyTwoInchesInMm)
})

const isChairRailHeightValid = computed(() => {
  return chairRailHeightMm.value <= maxChairRailHeightMm.value
})

// Scaling factor for visualization
const scale = computed(() => {
  // Calculate scale based on available space (using larger dimensions)
  const maxWidth = 1200
  const maxHeight = 800
  const widthScale = maxWidth / wallWidthMm.value
  const heightScale = maxHeight / wallHeightMm.value
  return Math.min(widthScale, heightScale) * 0.8 // 80% of the max scale to leave some margin
})

// Scaled dimensions for visualization
const scaledWallHeight = computed(() => wallHeightMm.value * scale.value)
const scaledWallWidth = computed(() => wallWidthMm.value * scale.value)
const scaledChairRailHeight = computed(() => chairRailHeightMm.value * scale.value)
const scaledWainscotCapHeight = computed(() => wainscotCapHeightMm.value * scale.value)
const scaledRailHeight = computed(() => railHeightMm.value * scale.value)
const scaledStileWidth = computed(() => stileWidthMm.value * scale.value)
const scaledPanelMoldingWidth = computed(() => panelMoldingWidthMm.value * scale.value)
const scaledBaseboardHeight = computed(() => baseboardHeightMm.value * scale.value)
const scaledShoeMoldingHeight = computed(() => shoeMoldingHeightMm.value * scale.value)

// Calculate wainscot area dimensions
const wainscotAreaHeight = computed(() => {
  // In the reference image, the wainscot is the full height
  return scaledWallHeight.value
})

const wainscotAreaTop = computed(() => {
  return 0
})

// Update internal mm values when display values change
// Modified to work with v-model and @update:model-value
function updateWallHeight(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    wallHeightMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

function updateWallWidth(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    wallWidthMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

function updateChairRailHeight(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    chairRailHeightMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

function updateWainscotCapHeight(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    wainscotCapHeightMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

function updateRailHeight(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    railHeightMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

function updateStileWidth(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    stileWidthMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

function updatePanelMoldingWidth(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    panelMoldingWidthMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

function updateBaseboardHeight(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    baseboardHeightMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

function updateShoeMoldingHeight(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (!isNaN(numValue)) {
    const roundedValue = roundToNearestFraction(numValue, selectedUnit.value, imperialUnit.value)
    shoeMoldingHeightMm.value = convertToMm(roundedValue, selectedUnit.value, imperialUnit.value, metricUnit.value)
  }
}

// Automatically adjust chair rail height to 1/5 of wall height when wall height changes
watch(wallHeightMm, (newHeight) => {
  const recommendedHeight = newHeight / 5
  // Only auto-adjust if the current height is invalid
  if (!isChairRailHeightValid.value) {
    chairRailHeightMm.value = Math.min(recommendedHeight, 32 * INCH_TO_MM)
  }
})

// Unit labels
const unitLabel = computed(() => {
  return getUnitLabel(selectedUnit.value, imperialUnit.value, metricUnit.value)
})

// Step value for inputs
const inputStep = computed(() => {
  return getInputStep(selectedUnit.value, imperialUnit.value, metricUnit.value)
})

// Initialize input values
function initializeInputValues() {
  wallWidthInput.value = wallWidth.value.toString()
  wallHeightInput.value = wallHeight.value.toString()
  chairRailHeightInput.value = chairRailHeight.value.toString()
  wainscotCapHeightInput.value = wainscotCapHeight.value.toString()
  railHeightInput.value = railHeight.value.toString()
  stileWidthInput.value = stileWidth.value.toString()
  panelMoldingWidthInput.value = panelMoldingWidth.value.toString()
  baseboardHeightInput.value = baseboardHeight.value.toString()
  shoeMoldingHeightInput.value = shoeMoldingHeight.value.toString()
}

// Watch for unit changes to update input values
watch(selectedUnit, () => {
  initializeInputValues()
})

// Initialize on component mount
onMounted(() => {
  initializeInputValues()
})
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-4 primary--text">Wainscot Layout Visualizer</h2>
      </v-col>
    </v-row>
    
    <v-row>
      <!-- Controls Panel -->
      <v-col cols="12" md="3">
        <v-card class="controls-panel">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-2">Wall Dimensions</h3>
                <v-text-field
                  label="Wall Height"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="wallHeightInput"
                  @update:model-value="updateWallHeight"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  label="Wall Width"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="wallWidthInput"
                  @update:model-value="updateWallWidth"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-divider class="my-4"></v-divider>
            
            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-2">Measurement Units</h3>
                <v-radio-group v-model="selectedUnit" inline>
                  <v-radio value="imperial" label="Imperial"></v-radio>
                  <v-radio value="metric" label="Metric"></v-radio>
                </v-radio-group>
                
                <v-select
                  v-if="selectedUnit === 'imperial'"
                  v-model="imperialUnit"
                  :items="[
                    { title: 'Inches', value: 'inches' },
                    { title: 'Feet', value: 'feet' }
                  ]"
                  label="Unit"
                  density="compact"
                  variant="outlined"
                ></v-select>
                
                <v-select
                  v-if="selectedUnit === 'metric'"
                  v-model="metricUnit"
                  :items="[
                    { title: 'mm', value: 'mm' },
                    { title: 'cm', value: 'cm' },
                    { title: 'm', value: 'm' }
                  ]"
                  label="Unit"
                  density="compact"
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <v-card class="mt-4">
          <v-card-title>Wainscot Components</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Chair Rail Height"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="chairRailHeightInput"
                  @update:model-value="updateChairRailHeight"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  label="Wainscot Cap Height"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="wainscotCapHeightInput"
                  @update:model-value="updateWainscotCapHeight"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  label="Rail Height"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="railHeightInput"
                  @update:model-value="updateRailHeight"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  label="Stile Width"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="stileWidthInput"
                  @update:model-value="updateStileWidth"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  label="Panel Molding Width"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="panelMoldingWidthInput"
                  @update:model-value="updatePanelMoldingWidth"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  label="Baseboard Height"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="baseboardHeightInput"
                  @update:model-value="updateBaseboardHeight"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  label="Shoe Molding Height"
                  :suffix="unitLabel"
                  type="number"
                  v-model.number="shoeMoldingHeightInput"
                  @update:model-value="updateShoeMoldingHeight"
                  :step="inputStep"
                  min="0"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <v-card class="mt-4">
          <v-card-title>Panel Configuration</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Horizontal Panels"
                  type="number"
                  v-model.number="horizontalPanelCount"
                  min="1"
                  max="10"
                  step="1"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  label="Vertical Panels"
                  type="number"
                  v-model.number="verticalPanelCount"
                  min="1"
                  max="5"
                  step="1"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Visualization Panel -->
      <v-col cols="12" md="9">
        <v-card class="visualization-panel">
          <v-card-text>
            <div class="technical-drawing-container">
              <!-- Wainscot Panel Layout -->
              <WainscotPanelLayout
                :wainscot-width="scaledWallWidth"
                :wainscot-height="scaledWallHeight"
                :stile-width="scaledStileWidth"
                :rail-height="scaledRailHeight"
                :panel-molding-width="scaledPanelMoldingWidth"
                :horizontal-panel-count="horizontalPanelCount"
                :vertical-panel-count="verticalPanelCount"
                :unit-label="unitLabel"
                :actual-wall-width="wallWidth"
                :actual-wall-height="wallHeight"
                :actual-stile-width="stileWidth"
                :actual-rail-height="railHeight"
                :formatted-wall-width="formattedWallWidth"
                :formatted-wall-height="formattedWallHeight"
                :formatted-stile-width="formattedStileWidth"
                :formatted-rail-height="formattedRailHeight"
                :use-fractions="selectedUnit === 'imperial'"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Measurements Summary -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">Measurements Summary</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Dimension</th>
                  <th>Value ({{ unitLabel }})</th>
                  <th>Lumber Size</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Wall</td>
                  <td>Height</td>
                  <td>{{ formattedWallHeight }}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Wall</td>
                  <td>Width</td>
                  <td>{{ formattedWallWidth }}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Top Rail</td>
                  <td>Height</td>
                  <td>{{ formattedChairRailHeight }}</td>
                  <td>1×4</td>
                </tr>
                <tr>
                  <td>Bottom Rail</td>
                  <td>Height</td>
                  <td>{{ formattedRailHeight }}</td>
                  <td>1×2</td>
                </tr>
                <tr>
                  <td>Stiles</td>
                  <td>Width</td>
                  <td>{{ formattedStileWidth }}</td>
                  <td>1×3</td>
                </tr>
                <tr>
                  <td>Panel Configuration</td>
                  <td>Count</td>
                  <td>{{ horizontalPanelCount }}×{{ verticalPanelCount }}</td>
                  <td>-</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Only keep styles that are still needed with Vuetify */
.technical-drawing-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .technical-drawing-container {
    min-height: 400px;
  }
}
</style> 