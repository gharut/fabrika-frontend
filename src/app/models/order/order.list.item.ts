import {OrderSize} from "./orderData.model";

export interface OrderListItem {
  id: number,
  uuid: string,
  client_id: number,
  supply_date: string,
  supply_time: string,
  supply_items: OrderListItemSupplyItem[],
  "supply_details": [
    {
      name: string,
      other: string,
      phone: string,
      load_number: string
    }
  ],
  products: OrderListProduct[]
  "status": string,
  "delivery_status": number,
  "payment_status": number,
  "created_at": string,
  "client": OrderListItemClient
  "order_services": OrderListItemService[]
}

export interface OrderListItemService {
  "id": number,
  "order_id": number,
  "product_id": number,
  "service_id": number,
  "service_attribute": string,
  "price": number,
}


export interface OrderListItemSupplyItem {
  qty: string,
  unit: string,
  width: string,
  height: string,
  length: string,
  weight: string
}

export interface OrderListItemClient {
  id: number,
  name: string,
  type: string,
  phone: string,
  email: string,
}

export interface OrderListProduct {
  id: number
  order_id: number
  parent_id: number|null
  complect: number
  name: string
  qty: number|null
  color: string
  size: OrderListProductSize[]
  delivered: number
}

export interface OrderListProductSize {
  qty: number
  size: string
}
