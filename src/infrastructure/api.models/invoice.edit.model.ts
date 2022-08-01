import { IInvoice } from "../../models/invoice.model" ;
import { IItem } from "../../models/item.model";

export interface IInputInvoice extends Omit< IInvoice, "AmountBalance" | "TotalAmount" | "SubTotal" >  {

    Items? : Array< Partial<IItem> >
}
