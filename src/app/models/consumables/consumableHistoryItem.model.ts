import {Consumable} from "./consumable.model";
import {Supplier} from "../suppliers/supplier.model";

export class ConsumableHistoryItemModel {
  id?: string
  type?: string
  consumable_id?: string
  supplier_id?: string
  operation_id?: string
  qty?: string
  price_per_unit?: string
  delivery_status?: string
  payment_status?: string
  delivery_date?: string
  details?: string
  payment_date?: string
  created_at?: string
  updated_at?: string
  consumable?: Consumable
  supplier?: Supplier
}
