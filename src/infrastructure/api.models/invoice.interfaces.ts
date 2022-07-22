// filename: invoice.view.model.ts

// Class Name: IInvoiceViewModel{

// }

export interface IItem {
    InvoiceNumber: number,
    // ItemNumber: number,
    Name: string,
    Price: number,
    Quantity: number,
    Amount: number
}

export interface IInvoice {
    InvoiceNumber: number,    // InvoiceNumber or Invoicenumber
    InvoicedBy : string ,
    InvoicedTo : string,
    ShippingAddress ? : string | null,
    PONumber : string,
    InvoiceGeneratedOn : Date,
    DueDate : Date,
    Note ? : string | null,
    SubTotal: number,                             // Example  100 + 200 = 300
    TotalAmount: number,                         //  300 + 5% = 315
    AmountPaid: Required<number> ,               //  250
    AmountBalance: number                        //  315 - 250 = 65
}

export interface IInputInvoice extends Omit< IInvoice, "AmountBalance" | "TotalAmount" | "SubTotal" >  {

    Items? : Array< Omit< IItem, "Amount" | "InvoiceNumber" >>
}
