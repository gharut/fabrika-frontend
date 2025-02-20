import {WarehousePrices} from "./warehouse-prices.model";

export interface Warehouse {
  id: number
  name: string
  shipping_type: string
  consumable: any
  supplier: any
  prices: Array<WarehousePrices>
}
