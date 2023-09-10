import {SupplierContact} from "./supplier.contact.model";
import {SupplierPayment} from "./supplier.payment.model";
import {Tag} from "../tags/tag.model";

export class Supplier {
  id?: string
  name?: string
  address?: string
  website?: string
  contacts?: SupplierContact[]
  payments?: SupplierPayment[]
  tags?: Tag[]
}
