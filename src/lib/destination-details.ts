export interface DestinationFAQ {
  question: string
  answer: string
}

export interface ItineraryCoord {
  day: number
  title: string
  description: string
  lat: number
  lng: number
}

export interface TripExtra {
  promoPrice?: number
  promoLabel?: string
  itinerary?: ItineraryCoord[]
}

const LOCATION_COORDS: Record<string, [number, number]> = {
  "Tokio": [35.6762, 139.6503],
  "Akihabara": [35.6984, 139.7731],
  "Monte Fuji": [35.3606, 138.7274],
  "Kioto": [35.0116, 135.7681],
  "Osaka": [34.6937, 135.5023],
  "Bangkok": [13.7563, 100.5018],
  "Chiang Mai": [18.7883, 98.9853],
  "Phi Phi": [7.7407, 98.7784],
  "Marrakech": [31.6295, -7.9811],
  "Sahara": [31.0801, -4.0133],
  "Fez": [34.0181, -5.0078],
  "Rio de Janeiro": [-22.9068, -43.1729],
  "Favela y Samba": [-22.9500, -43.1900],
  "Florianópolis": [-27.5954, -48.5480],
  "Rovaniemi": [66.5039, 25.7294],
  "Huskies": [66.5200, 25.8000],
  "Auroras": [66.5500, 25.7500],
  "Malé": [4.1755, 73.5093],
  "Snorkel": [4.2000, 73.5500],
  "Isla desierta": [4.1000, 73.4500],
  "Stone Town": [-6.1622, 39.1921],
  "Especias": [-6.1200, 39.2200],
  "Nungwi": [-5.7269, 39.2986],
  "Mnemba": [-5.8167, 39.3833],
  "Reikiavik": [64.1466, -21.9426],
  "Círculo Dorado": [64.3143, -20.2986],
  "Sur de Islandia": [63.5321, -19.5115],
  "Sur": [63.5321, -19.5115],
  "Lima": [-12.0464, -77.0428],
  "Cusco": [-13.5319, -71.9675],
  "Machu Picchu": [-13.1631, -72.5450],
  "Ubud": [-8.5069, 115.2625],
  "Monte Batur": [-8.2415, 115.3752],
  "Nusa Penida": [-8.7275, 115.5444],
  "Uluwatu": [-8.8291, 115.0849],
  "Gili Islands": [-8.3500, 116.0500],
  "San José": [9.9281, -84.0907],
  "Arenal": [10.4626, -84.7033],
  "Manuel Antonio": [9.3923, -84.1365],
  "Caribe": [9.7489, -82.8497],
  "El Cairo": [30.0444, 31.2357],
  "Luxor": [25.6872, 32.6396],
  "Nilo": [25.0000, 32.8998],
  "Asuán": [24.0889, 32.8998],
  "Atenas": [37.9838, 23.7275],
  "Santorini": [36.3932, 25.4615],
  "Mykonos": [37.4467, 25.3289],
  "Naxos": [37.1036, 25.3762],
  "CDMX": [19.4326, -99.1332],
  "Oaxaca": [17.0732, -96.7266],
  "Tulum": [20.2115, -87.4654],
  "Hanoi": [21.0285, 105.8542],
  "Ha Long": [20.9101, 107.1839],
  "Hoi An": [15.8801, 108.3380],
  "Sapa": [22.3363, 103.8438],
  "Ho Chi Minh": [10.8231, 106.6297],
  "Norte": [18.7883, 98.9853],
  "Islas": [36.3932, 25.4615],
  "Krabi": [8.0863, 98.9063],
  "Atlas": [31.0470, -7.1297],
  "Desierto": [31.0801, -4.0133],
  "Ouarzazate": [30.9189, -6.8936],
  "Chefchaouen": [35.1688, -5.2636],
  "Moto de nieve": [66.5500, 25.9000],
  "Pirámides de Giza": [29.9792, 31.1342],
}

export function lookupCoords(title: string): [number, number] | null {
  const key = Object.keys(LOCATION_COORDS).find(
    (k) => title.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(title.toLowerCase())
  )
  return key ? LOCATION_COORDS[key] : null
}
