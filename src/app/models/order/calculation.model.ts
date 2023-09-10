export interface Calculation {
  pickup: CalculationPickup
  packaging: CalculationPackaging
  total_price: number
}

export interface CalculationPickup {
  deliveryItems: DeliveryItems
  services: CalculationService[]
  total_price: 0
}

export interface DeliveryItems {
  qty: number
  total_weight: number
  total_volume: number
  weight_price: number
  volume_price: number
  total_price: number
}

export interface CalculationPackaging {
  products: CalculationProduct[]
  total_price: number
}

export interface CalculationProduct {
  product_name: string
  product_count: number
  colors_count: number
  services: CalculationService[]
  total_price: number
}

export interface CalculationService {
  service_name: string
  service_price: number
  count: number
  consumable?: CalculationConsumable
  total_price: number
}

export interface CalculationConsumable {
  consumable_name: string
  consumable_price: number
  count: number
  total_price: number
}
