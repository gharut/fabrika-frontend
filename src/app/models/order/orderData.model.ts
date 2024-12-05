import {Validators} from "@angular/forms";

export interface OrderData {
  client: number
  pickup: {
    products: OrderProduct[]
    supply_date: string,
    supply_time: string,
    supply_items?: SupplyItem[]
    supply_details?: {
      name: string,
      phone: string,
      load_number: string,
      other: string,
    }
    services: OrderServices[]
  }
  packaging: OrderProductPackaging[]
}

export interface OrderProduct {
  index: number
  name: string
  color: string
  size: OrderSize[]
  child: OrderChildProduct[]
}

export interface OrderChildProduct {
  index: number
  color: string
  size: OrderSize[]
}

export interface OrderSize {
  index?: number
  size: string
  qty: number
}

export interface OrderServices {
  service_id: number
  service_attribute: string
  service_enabled: boolean
}

export interface SupplyItem {
  qty: string,
  unit: string,
  width: string,
  height: string,
  length: string,
  weight: string
}

export interface OrderProductPackaging {
  complect: number
  product_id: number
  services: OrderServices[]
}
