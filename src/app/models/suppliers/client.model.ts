import {SupplierContact} from "./supplier.contact.model";
import {SupplierPayment} from "./supplier.payment.model";
import {Tag} from "../tags/tag.model";

export class Client {
  id?: string
  name?: string
  type?: string
  phone?: string
  email?: string
  telegram?: string
  details?: []
}
