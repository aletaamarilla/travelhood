export const TRAVEL_INSURANCE_NOT_INCLUDED = 'Seguro de viaje (se contrata aparte)'
export const TRAVEL_INSURANCE_NOTICE = 'El seguro de viaje no está incluido en ninguno de nuestros viajes. Se contrata aparte.'

/** Travel cover, not the liability insurance of an operator or a rental vehicle. */
export function isTravelInsuranceItem(item: string): boolean {
  const text = item.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
  return /\bseguros?\s+(?:de\s+viaje|medicos?\b|de\s+asistencia\b|de\s+cancelacion\b|de\s+anulacion\b)/.test(text)
    || /^seguros?(?:\s+incluidos?)?[.!]?$/.test(text)
}

export function withoutTravelInsurance(items: readonly string[]): string[] {
  return items.filter((item) => !isTravelInsuranceItem(item))
}

export function withSeparateTravelInsurance(items: readonly string[]): string[] {
  let found = false
  const result: string[] = []
  for (const item of items) {
    if (isTravelInsuranceItem(item)) {
      if (!found) result.push(TRAVEL_INSURANCE_NOT_INCLUDED)
      found = true
    } else result.push(item)
  }
  if (!found) result.push(TRAVEL_INSURANCE_NOT_INCLUDED)
  return result
}

export function enforceSeparateTravelInsurance<T extends {included?: string[]; notIncluded?: string[]}>(item: T) {
  return {
    ...item,
    included: withoutTravelInsurance(item.included ?? []),
    notIncluded: withSeparateTravelInsurance(item.notIncluded ?? []),
  }
}
