import { IInputInvoice, IInvoice, IItem } from "../api.models/invoice.interfaces";
import { InvoiceRepository } from "../repositories/invoice.repository";
import PDF from "./pdf.service";

export default class InvoiceService{

    private repository:any ;

    constructor() {
        this.repository = new InvoiceRepository()  
    }

    public async getAllInvoices() : Promise<any> {
        return await this.repository.getAllInvoices() ;
    }

    public async getInvoice( invoiceNumber: any ): Promise<any> {
        if( invoiceNumber.length < 1 || isNaN(invoiceNumber) ){
            return "Invalid Invoice number."
        }
        return await this.repository.getInvoice( invoiceNumber ) ;
    }

    public async createInvoice( invoice: IInputInvoice  ): Promise<Object | String> {
        // Invoice number validation
        const isNumberValid = await this.isInvoiceNoValid(invoice.InvoiceNumber)
        if( !isNumberValid ){
            return "Invalid invoice number"
        }

        //  Data validation
        if( !this.isInvoiceValid(invoice) )
            return "Invalid Data"

        // Calculations
        const { invoiceDetails, items } = this.Calculations( invoice )

        // Saving data
        this.repository.createInvoice( invoiceDetails, items )
        return { invoiceDetails, items } ;
    }

    public async deleteInvoice( invoiceNumber:any ) : Promise<String> {
        if( isNaN( invoiceNumber ) && invoiceNumber.length < 1 )
            return "Its not a number."

        await this.repository.deleteInvoice( invoiceNumber )
        return `${invoiceNumber} has been deleted.`
    }

    public async deleteItemFromInvoice( invoiceNumber:string, itemName:string ): Promise<String> {
        await this.repository.deleteItemFromInvoice( invoiceNumber, itemName  )
        return `${itemName} is deleted.`
    }

    public async updateInvoice ( invoice: IInputInvoice ): Promise<String > {
        const num = await this.repository.isValidInvoiceNo(invoice.InvoiceNumber)
        
        if( isNaN(invoice.InvoiceNumber) || num ){
            return "Invalid invoice number"
        }
        // Data validation
        if( !this.isInvoiceValid(invoice) )
            return "Invalid Data"

        const { invoiceDetails } = this.Calculations( invoice )
        await this.repository.update( invoiceDetails )
        return `${invoice.InvoiceNumber} is been updated.`
    }

    public isInvoiceValid( invoice:IInputInvoice ): boolean {
        if( invoice.InvoicedBy.length < 1 || invoice.InvoicedTo.length < 1  )
            return false

        // let filetedList = invoice.Items.filter(item => {
        //     if( item.Name.length < 1 || item.Price < 0 || item.Quantity < 0 )
        //         return false
        // })
        
        return true
    }
    
    public async getPDF( invoiceNumber: String ): Promise<String> {
        const result = await this.getInvoice(invoiceNumber) ;
        new PDF().generatepdf( result )
        
        return `./pdf/${invoiceNumber}.pdf`
    }
    
    private async isInvoiceNoValid( invoiceNumber: any ): Promise<boolean> {

        if( isNaN( invoiceNumber ) || invoiceNumber.length < 1 )
            return false;

        const isValid: boolean =  await this.repository.isValidInvoiceNo( invoiceNumber ) ;
        return isValid;
    }

    private Calculations( invoice: IInputInvoice ): {invoiceDetails: IInvoice, items: any } { 
        let SubTotal = 0;
        const items  = invoice.Items;
        delete invoice.Items;

        items?.forEach( (item: Partial< IItem> ) => {
            item.InvoiceNumber = invoice.InvoiceNumber ;
            item.Amount = item.Price! * item.Quantity! ;
            SubTotal += item.Amount
        })

        const TotalAmount = SubTotal;
        const AmountBalance = TotalAmount - invoice.AmountPaid!
        const invoiceDetails: IInvoice = { ...invoice, SubTotal, TotalAmount, AmountBalance }
        return { invoiceDetails, items }
    }
}