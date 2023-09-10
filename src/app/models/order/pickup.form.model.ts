import {OrderProduct, OrderServices, SupplyItem} from "./orderData.model";

export interface PickupFormModel {
  supply_date: string,
  supply_time: string,
  supply_items: SupplyItem[]
  supply_details: {
    name: string,
    phone: string,
    load_number: string,
    other: string,
  }
  services: OrderServices[]
}
