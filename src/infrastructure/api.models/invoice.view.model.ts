import { IInvoice } from "../../models/invoice.model" ;
import { IItem } from "../../models/item.model";

export interface IInvoiceViewModel {
    InvoiceNumber: number,
    InvoicedBy : string ,
    InvoicedTo : string,
    ShippingAddress ? : string | null,
    PONumber : string,
    InvoiceGeneratedOn : String ,
    DueDate : String ,
    Note ? : string | null,
    SubTotal: number,
    TotalAmount: number,
    AmountPaid: number ,
    AmountBalance: number,       
    Items ? : Array< Omit< IItem, "InvoiceNumber" > >
}