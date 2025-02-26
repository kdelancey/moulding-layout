<script setup lang="ts">
import { computed } from 'vue'
import { formatAsFraction } from '@/utils/measurements'

const props = defineProps<{
  // Dimensions in pixels (already scaled)
  wainscotWidth: number
  wainscotHeight: number
  stileWidth: number
  railHeight: number
  panelMoldingWidth: number
  // Number of panels
  horizontalPanelCount: number
  verticalPanelCount: number
  // Unit label for measurements
  unitLabel: string
  // Actual measurements (not scaled)
  actualWallWidth: number
  actualWallHeight: number
  actualStileWidth: number
  actualRailHeight: number
  // Formatted measurements with fractions
  formattedWallWidth?: string
  formattedWallHeight?: string
  formattedStileWidth?: string
  formattedRailHeight?: string
  // Whether to use fractions in display
  useFractions?: boolean
}>()

// Calculate the width of each panel section
const panelSectionWidth = computed(() => {
  return props.wainscotWidth / props.horizontalPanelCount
})

// Calculate the height of each panel section
const panelSectionHeight = computed(() => {
  return props.wainscotHeight / props.verticalPanelCount
})

// Calculate actual panel width (for measurement display)
const actualPanelWidth = computed(() => {
  return props.actualWallWidth / props.horizontalPanelCount - props.actualStileWidth
})

// Calculate actual panel height (for measurement display)
const actualPanelHeight = computed(() => {
  return props.actualWallHeight / props.verticalPanelCount - props.actualRailHeight
})

// Generate outer frame (top and bottom rails, left and right stiles)
const outerFrame = computed(() => {
  return {
    // Top rail
    topRail: {
      x: 0,
      y: 0,
      width: props.wainscotWidth,
      height: props.railHeight
    },
    // Bottom rail
    bottomRail: {
      x: 0,
      y: props.wainscotHeight - props.railHeight,
      width: props.wainscotWidth,
      height: props.railHeight
    },
    // Left stile
    leftStile: {
      x: 0,
      y: 0,
      width: props.stileWidth,
      height: props.wainscotHeight
    },
    // Right stile
    rightStile: {
      x: props.wainscotWidth - props.stileWidth,
      y: 0,
      width: props.stileWidth,
      height: props.wainscotHeight
    }
  }
})

// Generate inner stiles (vertical dividers)
const innerStiles = computed(() => {
  const result = []
  
  // Add stiles at panel section boundaries (excluding the edges)
  for (let i = 1; i < props.horizontalPanelCount; i++) {
    const xPosition = i * panelSectionWidth.value - props.stileWidth / 2
    
    result.push({
      x: xPosition,
      y: 0,
      width: props.stileWidth,
      height: props.wainscotHeight
    })
  }
  
  return result
})

// Generate inner rails (horizontal dividers)
const innerRails = computed(() => {
  const result = []
  
  // Add rails at panel section boundaries (excluding the edges)
  for (let i = 1; i < props.verticalPanelCount; i++) {
    const yPosition = i * panelSectionHeight.value - props.railHeight / 2
    
    result.push({
      x: 0,
      y: yPosition,
      width: props.wainscotWidth,
      height: props.railHeight
    })
  }
  
  return result
})

// Generate panel areas (spaces between stiles and rails)
const panelAreas = computed(() => {
  const result = []
  
  for (let row = 0; row < props.verticalPanelCount; row++) {
    for (let col = 0; col < props.horizontalPanelCount; col++) {
      // Calculate the panel position
      const panelX = col * panelSectionWidth.value + (col === 0 ? props.stileWidth : props.stileWidth / 2)
      const panelY = row * panelSectionHeight.value + (row === 0 ? props.railHeight : props.railHeight / 2)
      
      // Calculate the panel size
      const panelWidth = panelSectionWidth.value - (col === 0 || col === props.horizontalPanelCount - 1 ? 
                         props.stileWidth * 1.5 : props.stileWidth)
      const panelHeight = panelSectionHeight.value - (row === 0 || row === props.verticalPanelCount - 1 ? 
                          props.railHeight * 1.5 : props.railHeight)
      
      result.push({
        x: panelX,
        y: panelY,
        width: panelWidth,
        height: panelHeight,
        row,
        col
      })
    }
  }
  
  return result
})

// Calculate dimensions for measurement arrows
const measurementArrows = computed(() => {
  // Wall width arrow (top)
  const wallWidthArrow = {
    x1: 0,
    y1: -30,
    x2: props.wainscotWidth,
    y2: -30,
    labelX: props.wainscotWidth / 2,
    labelY: -40,
    label: props.formattedWallWidth 
      ? `${props.formattedWallWidth} ${props.unitLabel}`
      : `${props.actualWallWidth} ${props.unitLabel}`
  }
  
  // Wall height arrow (right side)
  const wallHeightArrow = {
    x1: props.wainscotWidth + 30,
    y1: 0,
    x2: props.wainscotWidth + 30,
    y2: props.wainscotHeight,
    labelX: props.wainscotWidth + 40,
    labelY: props.wainscotHeight / 2,
    label: props.formattedWallHeight 
      ? `${props.formattedWallHeight} ${props.unitLabel}`
      : `${props.actualWallHeight} ${props.unitLabel}`
  }
  
  // Panel width arrow (if we have panels)
  const panelWidthArrow = props.horizontalPanelCount > 0 && panelAreas.value.length > 0 ? {
    x1: panelAreas.value[0].x,
    y1: -15,
    x2: panelAreas.value[0].x + panelAreas.value[0].width,
    y2: -15,
    labelX: panelAreas.value[0].x + panelAreas.value[0].width / 2,
    labelY: -20,
    label: `${formattedPanelWidth.value} ${props.unitLabel}`
  } : null
  
  return {
    wallWidthArrow,
    wallHeightArrow,
    panelWidthArrow
  }
})

// Lumber dimensions for labels
const lumberDimensions = computed(() => {
  return {
    topRail: "1×4",
    bottomRail: "1×2",
    stiles: "1×3"
  }
})

// Format panel measurements
const formattedPanelWidth = computed(() => {
  if (props.useFractions) {
    return formatAsFraction(actualPanelWidth.value)
  }
  return actualPanelWidth.value.toFixed(1)
})

const formattedPanelHeight = computed(() => {
  if (props.useFractions) {
    return formatAsFraction(actualPanelHeight.value)
  }
  return actualPanelHeight.value.toFixed(1)
})
</script>

<template>
  <div class="wainscot-panel-layout" :style="{ width: `${wainscotWidth}px`, height: `${wainscotHeight}px` }">
    <!-- Technical drawing container with measurement arrows -->
    <div class="technical-drawing">
      <!-- Measurement arrows -->
      <svg class="measurement-arrows" :width="wainscotWidth + 100" :height="wainscotHeight + 100" viewBox="-50 -50 100% 100%">
        <!-- Wall width arrow -->
        <line 
          :x1="0" 
          :y1="-30" 
          :x2="wainscotWidth" 
          :y2="-30" 
          stroke="rgba(0, 0, 0, 0.6)" 
          stroke-width="1"
        />
        <polygon points="-5,-30 0,-27 0,-33" transform="translate(0, 0)" fill="rgba(0, 0, 0, 0.6)" />
        <polygon :points="`-5,-30 0,-27 0,-33`" :transform="`translate(${wainscotWidth}, 0) scale(-1, 1)`" fill="rgba(0, 0, 0, 0.6)" />
        <text 
          :x="measurementArrows.wallWidthArrow.labelX" 
          :y="measurementArrows.wallWidthArrow.labelY" 
          text-anchor="middle" 
          class="measurement-text"
        >{{ measurementArrows.wallWidthArrow.label }}</text>
        
        <!-- Wall height arrow -->
        <line 
          :x1="wainscotWidth + 30" 
          :y1="0" 
          :x2="wainscotWidth + 30" 
          :y2="wainscotHeight" 
          stroke="rgba(0, 0, 0, 0.6)" 
          stroke-width="1"
        />
        <polygon points="30,-5 27,0 33,0" transform="translate(0, 0) rotate(90)" fill="rgba(0, 0, 0, 0.6)" />
        <polygon :points="`30,-5 27,0 33,0`" :transform="`translate(0, ${wainscotHeight}) rotate(90) scale(-1, 1)`" fill="rgba(0, 0, 0, 0.6)" />
        <text 
          :x="measurementArrows.wallHeightArrow.labelX" 
          :y="measurementArrows.wallHeightArrow.labelY" 
          text-anchor="middle" 
          class="measurement-text"
        >{{ measurementArrows.wallHeightArrow.label }}</text>
        
        <!-- Panel width arrow (if we have panels) -->
        <template v-if="measurementArrows.panelWidthArrow">
          <line 
            :x1="measurementArrows.panelWidthArrow.x1" 
            :y1="measurementArrows.panelWidthArrow.y1" 
            :x2="measurementArrows.panelWidthArrow.x2" 
            :y2="measurementArrows.panelWidthArrow.y2" 
            stroke="rgba(0, 0, 0, 0.6)" 
            stroke-width="1"
          />
          <polygon points="-5,-15 0,-12 0,-18" transform="translate(0, 0)" fill="rgba(0, 0, 0, 0.6)" />
          <polygon 
            :points="`-5,-15 0,-12 0,-18`" 
            :transform="`translate(${measurementArrows.panelWidthArrow.x2}, 0) scale(-1, 1)`" 
            fill="rgba(0, 0, 0, 0.6)" 
          />
          <text 
            :x="measurementArrows.panelWidthArrow.labelX" 
            :y="measurementArrows.panelWidthArrow.labelY" 
            text-anchor="middle" 
            class="measurement-text"
          >{{ measurementArrows.panelWidthArrow.label }}</text>
        </template>
      </svg>
    </div>
    
    <!-- Outer frame -->
    <!-- Top rail (1x4) -->
    <div 
      class="rail top-rail"
      :style="{
        left: `${outerFrame.topRail.x}px`,
        top: `${outerFrame.topRail.y}px`,
        width: `${outerFrame.topRail.width}px`,
        height: `${outerFrame.topRail.height}px`
      }"
    >
      <span class="lumber-dimension">{{ lumberDimensions.topRail }}</span>
    </div>
    
    <!-- Bottom rail (1x2) -->
    <div 
      class="rail bottom-rail"
      :style="{
        left: `${outerFrame.bottomRail.x}px`,
        top: `${outerFrame.bottomRail.y}px`,
        width: `${outerFrame.bottomRail.width}px`,
        height: `${outerFrame.bottomRail.height}px`
      }"
    >
      <span class="lumber-dimension">{{ lumberDimensions.bottomRail }}</span>
    </div>
    
    <!-- Left stile (1x3) -->
    <div 
      class="stile left-stile"
      :style="{
        left: `${outerFrame.leftStile.x}px`,
        top: `${outerFrame.leftStile.y}px`,
        width: `${outerFrame.leftStile.width}px`,
        height: `${outerFrame.leftStile.height}px`
      }"
    >
      <span class="lumber-dimension">{{ lumberDimensions.stiles }}</span>
    </div>
    
    <!-- Right stile (1x3) -->
    <div 
      class="stile right-stile"
      :style="{
        left: `${outerFrame.rightStile.x}px`,
        top: `${outerFrame.rightStile.y}px`,
        width: `${outerFrame.rightStile.width}px`,
        height: `${outerFrame.rightStile.height}px`
      }"
    >
      <span class="lumber-dimension">{{ lumberDimensions.stiles }}</span>
    </div>
    
    <!-- Inner stiles (1x3) -->
    <div 
      v-for="(stile, index) in innerStiles" 
      :key="`stile-${index}`"
      class="stile inner-stile"
      :style="{
        left: `${stile.x}px`,
        top: `${stile.y}px`,
        width: `${stile.width}px`,
        height: `${stile.height}px`
      }"
    >
      <span class="lumber-dimension">{{ lumberDimensions.stiles }}</span>
    </div>
    
    <!-- Inner rails -->
    <div 
      v-for="(rail, index) in innerRails" 
      :key="`rail-${index}`"
      class="rail inner-rail"
      :style="{
        left: `${rail.x}px`,
        top: `${rail.y}px`,
        width: `${rail.width}px`,
        height: `${rail.height}px`
      }"
    >
      <span class="lumber-dimension">{{ lumberDimensions.bottomRail }}</span>
    </div>
    
    <!-- Panel areas -->
    <div 
      v-for="(panel, index) in panelAreas" 
      :key="`panel-${index}`"
      class="panel-area"
      :style="{
        left: `${panel.x}px`,
        top: `${panel.y}px`,
        width: `${panel.width}px`,
        height: `${panel.height}px`
      }"
    >
      <!-- Panel measurements -->
      <div v-if="panel.row === 0 && panel.col === 0" class="panel-measurement">
        {{ formattedPanelWidth }} × {{ formattedPanelHeight }} {{ unitLabel }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.wainscot-panel-layout {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.12);
  max-width: 100%;
  height: auto;
  min-height: 500px;
  margin: 0 auto;
  background-color: white;
}

.technical-drawing {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.measurement-arrows {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.measurement-text {
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  fill: rgba(0, 0, 0, 0.87);
}

.stile, .rail {
  position: absolute;
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.6);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-rail {
  border-top-width: 2px;
}

.bottom-rail {
  border-bottom-width: 2px;
}

.left-stile {
  border-left-width: 2px;
}

.right-stile {
  border-right-width: 2px;
}

.panel-area {
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.38);
  background-color: transparent;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lumber-dimension {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.87);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px;
  border-radius: 2px;
}

.panel-measurement {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.87);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: 2px;
}
</style> 