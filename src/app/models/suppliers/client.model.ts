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
  tin?: string
  psrn?: string
  account?: string
  bank?: string
  correspondent_account?: string
  bic?: string
  legal_address?: string
  vat?: number
}
