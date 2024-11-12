import {Tag} from "../tags/tag.model";

export class Service {
  id?: string
  name?: string
  use_consumable?: boolean
  step?: string
  apply_to?: string
  multiple_products?: number
  count_label?: any
  report_type?: string
  price?: number
  sort?: number
  tags?: Tag[]
  attributes?: ServiceAttribute[]
}


export class ServiceAttribute {
  id?: number
  service_id?: number
  name?: string
  attribute_type?: string
  allow_multiselect?: number
  apply_to_price_type?: number
  attribute_data?: ServiceAttributeData[]
}

export class ServiceAttributeData {
  price?: any
  value?: string
}
