// Interfaces
import { IInputInvoice } from "../api.models/invoice.edit.model";
import { IItem } from "../../models/item.model";
import { IInvoice } from "../../models/invoice.model";
import { InvoiceRepository } from "../repositories/invoice.repository";
import { IInvoiceViewModel } from "../api.models/invoice.view.model";

import PDF from "./pdf.service";

export default class InvoiceService{

    private repository:any ;

    constructor() {
        this.repository = new InvoiceRepository()  
    }

    public async getInvoice( invoiceNumber: number ): Promise< IInvoiceViewModel > {
        await this.isInvoiceNumberValid(invoiceNumber)

        const invoiceDetails : IInvoiceViewModel = await this.repository.getInvoiceDetails( invoiceNumber ) ;
        if( invoiceDetails === undefined )
            throw new Error("Invoice number does not exists")

        const changeDate = ( date: String) => date.toString().substring(4,15)

        invoiceDetails.InvoiceGeneratedOn = changeDate( invoiceDetails.InvoiceGeneratedOn )
        invoiceDetails.DueDate = changeDate( invoiceDetails.DueDate )

        const invoiceItems : Array< Omit<IItem, "InvoiceNumber"> > = await this.repository.getInvoiceItems( invoiceNumber );
        invoiceDetails.Items = invoiceItems

        return invoiceDetails
    }

    public async createInvoice( invoice: IInputInvoice  ): Promise<Object> {

        // Invoice number validation
        this.isInvoiceNumberValid(invoice.InvoiceNumber)

        // Checking the given invoice number exist in database or not
        if( await this.repository.isInvoiceNumberPresent( invoice.InvoiceNumber ) )
            throw new Error("Invoice number already exists")        

        //  Data validation
        this.isInvoiceValid( invoice )

        // Calculations
        const { invoiceDetails, items } = this.Calculations( invoice )

        // Saving data
        this.repository.createInvoice( invoiceDetails, items )
        return { invoiceDetails, items } ;
    }

    public async deleteInvoice( invoiceNumber:number ) : Promise<String > {
        this.isInvoiceNumberValid(invoiceNumber);

        await this.repository.deleteInvoice( invoiceNumber )
        return `${invoiceNumber} has been deleted.`
    }

    public async deleteItemFromInvoice( invoiceNumber:number, itemName:string ): Promise<String> {
        this.isInvoiceNumberValid(invoiceNumber)
        await this.repository.deleteItemFromInvoice( invoiceNumber, itemName  )
        return `${itemName} is deleted.`
    }

    public async updateInvoice ( invoice: IInputInvoice ): Promise<String > {
        
        this.isInvoiceNumberValid( invoice.InvoiceNumber )

         // Checking the given invoice number exist in database or not
         const isInvoicePresent = await this.repository.isInvoiceNumberPresent( invoice.InvoiceNumber );
         if( !isInvoicePresent )
            throw new Error("Invoice number does not exists")

        // Data validation
        // if( !this.isInvoiceValid(invoice) )
        //     return "Invalid Data"

        // Calcutaions
        const { invoiceDetails } = this.Calculations( invoice )

        await this.repository.update( invoiceDetails )
        return `${invoice.InvoiceNumber} is been updated.`
    }

    public async getPDF( invoiceNumber: number ): Promise<Object> {
        const invoice = await this.getInvoice( invoiceNumber ) ;
        
        await new PDF().generatePdf( invoice )

        const path = `./pdf/${invoiceNumber}.pdf`
        const fileName = `${invoiceNumber}.pdf`
        return { path , fileName  }
    }

    private isInvoiceValid( invoice:IInputInvoice ): void {
        if( invoice.InvoicedBy.length < 1 || invoice.InvoicedTo.length < 1  )
            throw new Error("Name should not be less than 1 character.")
        
        if( invoice.Items?.length! < 1)
            throw new Error("Invoice should have atleast 1 item")

        invoice.Items?.forEach( item =>{
            if( item.Name?.length! < 1 || item.Quantity! < 0 || item.Price! < 0 ){
                throw new Error("Invalid item details.")
            }
        })

        if (invoice.AmountPaid < 0)
            throw new Error("Paid amount should not be less than 0")
        
    }
    
    private async isInvoiceNumberValid( invoiceNumber: number ): Promise<void> {

        // invoiceNumber % 1 !== 0 to check is number is an integer
        if( isNaN( invoiceNumber ) || invoiceNumber < 1 || invoiceNumber % 1 !== 0 ){        
            throw new Error("Invalid invoice number");
        }
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