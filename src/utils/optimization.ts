import type { DeviceDto, ConsumptionLogDto, OptimizationSuggestion } from '@/types'
import { Lightbulb, Wind, Clock } from 'lucide-vue-next'

export function generateOptimizationSuggestions(
  devices: DeviceDto[],
  consumptionLogs: Record<number, ConsumptionLogDto[]>
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = []
  
  devices.forEach(device => {
    const logs = consumptionLogs[device.id] || []
    const deviceType = device.type.toLowerCase()
    
    // Suggestion 1: Turn off inactive devices
    if (!device.isActive && device.hourlyPowerKwh > 0) {
      const monthlySavings = device.hourlyPowerKwh * 24 * 30 / 1000 // Convert to kWh/month
      suggestions.push({
        id: `turn-off-${device.id}`,
        deviceId: device.id,
        deviceName: device.name,
        description: `Turn off ${device.name} when not in use`,
        savings: Math.round(monthlySavings * 10) / 10,
        icon: 'lightbulb'
      })
    }
    
    // Suggestion 2: Lower consumption for high-power devices
    if (device.isActive && device.hourlyPowerKwh > 0.5 && (deviceType.includes('thermostat') || deviceType.includes('heating'))) {
      const potentialSavings = device.hourlyPowerKwh * 0.2 * 24 * 30 / 1000
      suggestions.push({
        id: `reduce-${device.id}`,
        deviceId: device.id,
        deviceName: device.name,
        description: `Lower ${device.name} by 2°C at night`,
        savings: Math.round(potentialSavings * 10) / 10,
        icon: 'wind'
      })
    }
    
    // Suggestion 3: Schedule devices
    if (device.isActive && logs.length > 0 && deviceType.includes('tv') || deviceType.includes('entertainment')) {
      const avgConsumption = logs.reduce((sum, log) => sum + log.actualKwhConsumed, 0) / logs.length
      const nightlySavings = avgConsumption * 8 * 30 / 1000
      suggestions.push({
        id: `schedule-${device.id}`,
        deviceId: device.id,
        deviceName: device.name,
        description: `Schedule ${device.name} to turn off at midnight`,
        savings: Math.round(nightlySavings * 10) / 10,
        icon: 'clock'
      })
    }
  })
  
  return suggestions.slice(0, 3) // Return top 3 suggestions
}

