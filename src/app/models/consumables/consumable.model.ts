import {Tag} from "../tags/tag.model";

export class Consumable {
  id?: string;
  name?: string;
  size?: string;
  unit?: string;
  price?: string;
  tags?: Tag[];
  qty?: string;
  price_threshold_type?: string;
  price_threshold?: string;
  qty_threshold?: string;
}
