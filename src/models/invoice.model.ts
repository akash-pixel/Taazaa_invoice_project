export interface IInvoice {
    InvoiceNumber: number,    // InvoiceNumber or Invoicenumber
    InvoicedBy : string ,
    InvoicedTo : string,
    ShippingAddress ? : string | null,
    PONumber : string,
    InvoiceGeneratedOn : Date,
    DueDate : Date,
    Note ? : string | null,
    SubTotal: number,                           // Example  100 + 200 = 300
    TotalAmount: number,                        //  300 + 5% = 315
    AmountPaid: number ,                        //  250
    AmountBalance: number                       //  315 - 250 = 65
}