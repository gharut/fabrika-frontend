import {WarehousePrices} from "./warehouse-prices.model";

export interface CreateWarehouse {
  name: string
  shipping_type: 'BOX' | 'PALLET'
  consumable_id: number
  supplier_id: number
  prices: Array<WarehousePrices>
}
