import { 
  Lightbulb, 
  Plug, 
  Thermometer, 
  Monitor, 
  Wind, 
  Droplet,
  Zap,
  Home
} from 'lucide-vue-next'
import type { Component } from 'vue'

const iconMap: Record<string, Component> = {
  light: Lightbulb,
  lamp: Lightbulb,
  plug: Plug,
  outlet: Plug,
  thermostat: Thermometer,
  heating: Thermometer,
  cooling: Thermometer,
  tv: Monitor,
  monitor: Monitor,
  screen: Monitor,
  fan: Wind,
  ventilation: Wind,
  water: Droplet,
  washer: Droplet,
  dishwasher: Droplet,
  appliance: Zap,
  device: Zap,
  default: Home
}

export function getDeviceIcon(deviceType: string): Component {
  const type = deviceType.toLowerCase()
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (type.includes(key)) {
      return icon
    }
  }
  
  return iconMap.default
}

export function getDeviceCategory(deviceType: string): string {
  const type = deviceType.toLowerCase()
  
  if (type.includes('light') || type.includes('lamp')) {
    return 'Light'
  } else if (type.includes('thermostat') || type.includes('heating') || type.includes('cooling')) {
    return 'Climate'
  } else if (type.includes('tv') || type.includes('monitor') || type.includes('entertainment')) {
    return 'Entertainment'
  } else if (type.includes('washer') || type.includes('dishwasher') || type.includes('dryer')) {
    return 'Appliance'
  } else {
    return 'Device'
  }
}
