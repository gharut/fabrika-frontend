import {OrderProduct, OrderServices, OrderSize, SupplyItem} from "./orderData.model";

export interface PackagingFormModel {
  products: PackagingFormProduct[],
}

export interface PackagingFormProduct {
  product_id: number|null
  name: string
  color: string
  size: OrderSize[]
  complect: number
  child: PackagingFormProductChild[]
  services: PackagingFormService[]
}

export interface PackagingFormProductChild {
  product_id: number|null
  color: string
  size: OrderSize[]
}
export interface PackagingFormService {
  record_id: number|null
  service_id: number
  service_attribute: string
  service_enabled: boolean
}
